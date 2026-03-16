'use client';

import { useState } from 'react';
import { Plus, Calendar, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { useCopilotAction } from "@copilotkit/react-core";
import VisitFormModal from './VisitFormModal';

interface ScheduledVisit {
  id: string;
  visitName: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed';
  ecrfStatus: 'not-started' | 'in-progress' | 'submitted' | 'approved';
}

interface ScheduledVisitsTabProps {
  patientId: string;
}

const mockVisits: ScheduledVisit[] = [
  {
    id: '1',
    visitName: 'Screening Visit',
    scheduledDate: '2024-01-15',
    completedDate: '2024-01-15',
    status: 'completed',
    ecrfStatus: 'approved'
  },
  {
    id: '2',
    visitName: 'Baseline Visit',
    scheduledDate: '2024-01-22',
    completedDate: '2024-01-22',
    status: 'completed',
    ecrfStatus: 'submitted'
  },
  {
    id: '3',
    visitName: 'Week 4 Visit',
    scheduledDate: new Date().toISOString().split('T')[0], // Today
    status: 'in-progress',
    ecrfStatus: 'in-progress'
  },
  {
    id: '4',
    visitName: 'Week 8 Visit',
    scheduledDate: '2024-03-18', // Past date (overdue)
    status: 'scheduled',
    ecrfStatus: 'not-started'
  },
  {
    id: '5',
    visitName: 'Week 12 Visit',
    scheduledDate: '2025-04-15', // Future date
    status: 'scheduled',
    ecrfStatus: 'not-started'
  }
];

export default function ScheduledVisitsTab({ patientId }: ScheduledVisitsTabProps) {
  const [visits, setVisits] = useState<ScheduledVisit[]>(mockVisits);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // AI action to log visit data (Improvement 07)
  useCopilotAction({
    name: "logVisitData",
    description: "Log a new clinical trial visit entry",
    parameters: [
      { name: "visitName", description: "Name of the visit (e.g., Week 4)", type: "string", required: true },
      { name: "date", description: "Date of the visit (YYYY-MM-DD)", type: "string" },
      { name: "status", description: "Status of the visit", type: "string" }
    ],
    handler: async ({ visitName, date, status }) => {
      handleAddVisit({
        visitName,
        scheduledDate: date || new Date().toISOString().split('T')[0],
        status: (status as any) || 'completed'
      });
      return `Logged visit: ${visitName}`;
    }
  });

  const getStatusIcon = (status: ScheduledVisit['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'missed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ScheduledVisit['status']) => {
    const styles = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'missed': 'bg-red-100 text-red-800',
      'scheduled': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getEcrfStatusBadge = (status: ScheduledVisit['ecrfStatus'], visitId: string, patientId: string) => {
    const styles = {
      'approved': 'bg-green-100 text-green-800 hover:bg-green-200',
      'submitted': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'not-started': 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    };

    const handleClick = () => {
      // Navigate to forms page with patient and visit context
      window.location.href = `/forms?patient=${patientId}&visit=${visitId}`;
    };

    return (
      <button
        onClick={handleClick}
        className={`px-2 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer underline decoration-dotted underline-offset-2 ${styles[status]}`}
        title={`Click to open form for ${status.replace('-', ' ')}`}
      >
        <span className="flex items-center space-x-1">
          <span>{status.replace('-', ' ')}</span>
          <ExternalLink className="w-3 h-3" />
        </span>
      </button>
    );
  };

  const getRowStyle = (visit: ScheduledVisit) => {
    const today = new Date();
    const scheduledDate = new Date(visit.scheduledDate);
    const isOverdue = scheduledDate < today && visit.status !== 'completed';
    
    const baseStyles = 'hover:bg-gray-50 transition-colors';
    
    if (isOverdue) {
      return `${baseStyles} bg-red-50 border-l-4 border-red-400`;
    }
    
    switch (visit.status) {
      case 'completed':
        return `${baseStyles} bg-green-50`;
      case 'in-progress':
        return `${baseStyles} bg-blue-50`;
      case 'missed':
        return `${baseStyles} bg-red-50`;
      default:
        return baseStyles;
    }
  };

  const isVisitToday = (visit: ScheduledVisit) => {
    const today = new Date();
    const visitDate = new Date(visit.scheduledDate);
    return visitDate.toDateString() === today.toDateString();
  };

  const isOverdue = (visit: ScheduledVisit) => {
    const today = new Date();
    const scheduledDate = new Date(visit.scheduledDate);
    return scheduledDate < today && visit.status !== 'completed';
  };

  const handleAddVisit = (visitData: Partial<ScheduledVisit>) => {
    const newVisit: ScheduledVisit = {
      id: Date.now().toString(),
      visitName: visitData.visitName || 'New Visit',
      scheduledDate: visitData.scheduledDate || new Date().toISOString().split('T')[0],
      status: 'scheduled',
      ecrfStatus: 'not-started'
    };

    setVisits([...visits, newVisit]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Scheduled Visits</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Visits Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visit Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  eCRF Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits.map((visit: ScheduledVisit) => (
                <tr key={visit.id} className={getRowStyle(visit)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(visit.status)}
                      <span className="text-sm font-medium text-gray-900">{visit.visitName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(visit.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {visit.completedDate ? new Date(visit.completedDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(visit.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getEcrfStatusBadge(visit.ecrfStatus, visit.id, patientId)}
                      {isVisitToday(visit) && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          TODAY
                        </span>
                      )}
                      {isOverdue(visit) && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>OVERDUE</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visit Form Modal */}
      <VisitFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
