'use client';

import { useState } from 'react';
import { Plus, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { useCopilotAction } from "@copilotkit/react-core";
import { usePatient } from '@/lib/hooks/usePatient';
import { AdverseEvent } from '@/types/adverse-event';
import AEReportForm from './AEReportForm';

interface AEReport {
  id: string;
  eventName: string;
  severity: 1 | 2 | 3 | 4 | 5;
  onsetDate: string;
  causality: 'related' | 'possibly-related' | 'unlikely-related' | 'unrelated';
  actionTaken: string;
  outcome: 'resolved' | 'ongoing' | 'unknown';
  isSAE: boolean;
  meddraCode?: string;
  reportedDate: string;
}

interface SafetyReportingTabProps {
  patientId: string;
}

const mockAEReports: AEReport[] = [
  {
    id: '1',
    eventName: 'Headache',
    severity: 2,
    onsetDate: '2024-02-01',
    causality: 'possibly-related',
    actionTaken: 'Acetaminophen administered',
    outcome: 'resolved',
    isSAE: false,
    meddraCode: '10019231',
    reportedDate: '2024-02-01'
  },
  {
    id: '2',
    eventName: 'Nausea',
    severity: 1,
    onsetDate: '2024-02-05',
    causality: 'related',
    actionTaken: 'Anti-emetic administered',
    outcome: 'ongoing',
    isSAE: false,
    meddraCode: '10029605',
    reportedDate: '2024-02-05'
  }
];

export default function SafetyReportingTab({ patientId }: SafetyReportingTabProps) {
  const { currentPatient, addAdverseEvent } = usePatient(patientId);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // AI action to file adverse event report (Improvement 08)
  useCopilotAction({
    name: "fileAdverseEventReport",
    description: "File a new adverse event report for the patient",
    parameters: [
      { name: "eventName", description: "Name/description of the adverse event", type: "string", required: true },
      { name: "severity", description: "Severity grade (1-5)", type: "number", required: true },
      { name: "causality", description: "Causality (related, possibly-related, etc.)", type: "string" },
      { name: "isSAE", description: "Whether this is a Serious Adverse Event", type: "boolean" }
    ],
    handler: async ({ eventName, severity, causality, isSAE }) => {
      // Convert severity from number to string format
      const severityMap: { [key: number]: AdverseEvent['severity'] } = {
        1: 'Grade 1',
        2: 'Grade 2', 
        3: 'Grade 3',
        4: 'Grade 4',
        5: 'Grade 5'
      };

      // Convert causality to match AdverseEvent type
      const causalityMap: { [key: string]: AdverseEvent['causality'] } = {
        'related': 'Related',
        'possibly-related': 'Possibly Related',
        'unlikely-related': 'Not Related',
        'unrelated': 'Not Related'
      };

      const adverseEventData: Omit<AdverseEvent, 'id' | 'patientId'> = {
        eventName: eventName || 'Unknown Event',
        soc: 'General Disorders', // Default System Organ Class
        severity: severityMap[severity as number] || 'Grade 1',
        onset: new Date(),
        resolution: null,
        causality: causalityMap[causality || 'related'] || 'Unknown',
        action: 'Under investigation',
        outcome: 'Ongoing',
        serious: isSAE || false,
        reportedBy: 'AI Assistant',
        reportedAt: new Date(),
        regulatoryReported: false,
        description: `Adverse event reported via AI assistant: ${eventName}`,
        followUpRequired: true,
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      };

      addAdverseEvent(patientId, adverseEventData);
      return `Filed AE report: ${eventName}`;
    }
  });

  const getSeverityColor = (severity: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-orange-100 text-orange-800',
      4: 'bg-red-100 text-red-800',
      5: 'bg-purple-100 text-purple-800'
    };
    return colors[severity as keyof typeof colors];
  };

  const getSeverityLabel = (severity: number) => {
    const labels = {
      1: 'Grade 1 - Mild',
      2: 'Grade 2 - Moderate',
      3: 'Grade 3 - Severe',
      4: 'Grade 4 - Life-threatening',
      5: 'Grade 5 - Death'
    };
    return labels[severity as keyof typeof labels];
  };

  const getCausalityBadge = (causality: AEReport['causality']) => {
    const styles = {
      'related': 'bg-red-100 text-red-800',
      'possibly-related': 'bg-yellow-100 text-yellow-800',
      'unlikely-related': 'bg-blue-100 text-blue-800',
      'unrelated': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[causality]}`}>
        {causality.replace('-', ' ')}
      </span>
    );
  };

  const getOutcomeBadgeFromAdverseEvent = (outcome: string) => {
    const styles = {
      'Recovered': 'bg-green-100 text-green-800',
      'Ongoing': 'bg-yellow-100 text-yellow-800',
      'Unknown': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[outcome as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {outcome}
      </span>
    );
  };

  const getCausalityBadgeFromAdverseEvent = (causality: AdverseEvent['causality']) => {
    const styles = {
      'Related': 'bg-red-100 text-red-800',
      'Possibly Related': 'bg-yellow-100 text-yellow-800',
      'Not Related': 'bg-blue-100 text-blue-800',
      'Unknown': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[causality] || 'bg-gray-100 text-gray-800'}`}>
        {causality}
      </span>
    );
  };

  const getSeverityColorFromGrade = (severity: AdverseEvent['severity']) => {
    const colors = {
      'Grade 1': 'bg-green-100 text-green-800',
      'Grade 2': 'bg-yellow-100 text-yellow-800',
      'Grade 3': 'bg-orange-100 text-orange-800',
      'Grade 4': 'bg-red-100 text-red-800',
      'Grade 5': 'bg-purple-100 text-purple-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const handleSubmitAE = (aeData: Partial<AEReport>) => {
    // Convert AEReport format to AdverseEvent format
    const severityMap: { [key: number]: AdverseEvent['severity'] } = {
      1: 'Grade 1',
      2: 'Grade 2', 
      3: 'Grade 3',
      4: 'Grade 4',
      5: 'Grade 5'
    };

    const causalityMap: { [key: string]: AdverseEvent['causality'] } = {
      'related': 'Related',
      'possibly-related': 'Possibly Related',
      'unlikely-related': 'Not Related',
      'unrelated': 'Not Related'
    };

    const adverseEventData: Omit<AdverseEvent, 'id' | 'patientId'> = {
      eventName: aeData.eventName || 'Unknown Event',
      soc: 'General Disorders',
      severity: severityMap[aeData.severity || 1],
      onset: new Date(aeData.onsetDate || new Date().toISOString().split('T')[0]),
      resolution: aeData.outcome === 'resolved' ? new Date() : null,
      causality: causalityMap[aeData.causality || 'unrelated'],
      action: aeData.actionTaken || 'None',
      outcome: aeData.outcome === 'resolved' ? 'Recovered' : 'Ongoing',
      serious: aeData.isSAE || false,
      reportedBy: 'Clinical Staff',
      reportedAt: new Date(),
      regulatoryReported: false,
      description: `Adverse event: ${aeData.eventName}`,
      followUpRequired: aeData.outcome !== 'resolved',
      nextFollowUp: aeData.outcome !== 'resolved' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined
    };

    addAdverseEvent(patientId, adverseEventData);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Safety & Adverse Event Reporting</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Report AE</span>
        </button>
      </div>

      {/* AE Report Form */}
      <AEReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitAE}
      />

      {/* AE Reports List */}
      <div className="space-y-4">
        {currentPatient?.adverseEvents?.map((event: AdverseEvent) => (
          <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {event.serious && (
                      <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        <span>SAE</span>
                      </span>
                    )}
                    <h3 className="text-lg font-medium text-gray-900">{event.eventName}</h3>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSeverityColorFromGrade(event.severity)}`}>
                    {event.severity}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Onset Date</label>
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{event.onset.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Causality</label>
                    <div className="mt-1">{getCausalityBadgeFromAdverseEvent(event.causality)}</div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</label>
                    <div className="mt-1">{getOutcomeBadgeFromAdverseEvent(event.outcome)}</div>
                  </div>
                </div>

                {/* Action Taken */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Action Taken</label>
                  <p className="mt-1 text-sm text-gray-900">{event.action}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Reported by: {event.reportedBy}</span>
                    <span>Reported: {event.reportedAt.toLocaleDateString()}</span>
                    {event.followUpRequired && (
                      <span className="text-orange-600">Follow-up required</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) || (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No adverse events reported for this patient.</p>
          </div>
        )}
      </div>
    </div>
  );
}
