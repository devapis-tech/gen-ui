'use client';

import { useState } from 'react';
import { Plus, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { useCopilotAction } from "@copilotkit/react-core";
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
  const [aeReports, setAeReports] = useState<AEReport[]>(mockAEReports);
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
      handleSubmitAE({
        eventName,
        severity: (severity as any) || 1,
        causality: (causality as any) || 'related',
        isSAE: isSAE || false
      });
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

  const getOutcomeBadge = (outcome: AEReport['outcome']) => {
    const styles = {
      'resolved': 'bg-green-100 text-green-800',
      'ongoing': 'bg-yellow-100 text-yellow-800',
      'unknown': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[outcome]}`}>
        {outcome}
      </span>
    );
  };

  const handleSubmitAE = (aeData: Partial<AEReport>) => {
    const newAE: AEReport = {
      id: Date.now().toString(),
      eventName: aeData.eventName || 'Unknown Event',
      severity: aeData.severity || 1,
      onsetDate: aeData.onsetDate || new Date().toISOString().split('T')[0],
      causality: aeData.causality || 'unrelated',
      actionTaken: aeData.actionTaken || 'None',
      outcome: aeData.outcome || 'ongoing',
      isSAE: aeData.isSAE || false,
      meddraCode: aeData.meddraCode,
      reportedDate: new Date().toISOString().split('T')[0]
    };

    setAeReports([newAE, ...aeReports]);
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
        {aeReports.map((report: AEReport) => (
          <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {report.isSAE && (
                      <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        <span>SAE</span>
                      </span>
                    )}
                    <h3 className="text-lg font-medium text-gray-900">{report.eventName}</h3>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSeverityColor(report.severity)}`}>
                    {getSeverityLabel(report.severity)}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Onset Date</label>
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{new Date(report.onsetDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Causality</label>
                    <div className="mt-1">{getCausalityBadge(report.causality)}</div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</label>
                    <div className="mt-1">{getOutcomeBadge(report.outcome)}</div>
                  </div>
                </div>

                {/* Action Taken */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Action Taken</label>
                  <p className="mt-1 text-sm text-gray-900">{report.actionTaken}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {report.meddraCode && (
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>MedDRA: {report.meddraCode}</span>
                      </span>
                    )}
                    <span>Reported: {new Date(report.reportedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {aeReports.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No adverse events reported for this patient.</p>
        </div>
      )}
    </div>
  );
}
