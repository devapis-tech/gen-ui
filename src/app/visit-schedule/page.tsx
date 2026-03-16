'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Shield, Activity, Users, Plus } from 'lucide-react';
import ScheduledVisitsTab from '@/components/visits/ScheduledVisitsTab';
import SafetyReportingTab from '@/components/visits/SafetyReportingTab';
import LiveMonitorTab from '@/components/visits/LiveMonitorTab';

interface Patient {
  id: string;
  name: string;
  studyId: string;
  status: 'active' | 'completed' | 'withdrawn';
}

const mockPatients: Patient[] = [
  { id: '1', name: 'John Doe', studyId: 'STUDY-001', status: 'active' },
  { id: '2', name: 'Jane Smith', studyId: 'STUDY-001', status: 'active' },
  { id: '3', name: 'Robert Johnson', studyId: 'STUDY-002', status: 'completed' },
];

export default function VisitSchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'scheduled' | 'safety' | 'monitor'>('scheduled');

  // Initialize patient from URL on mount
  useEffect(() => {
    const patientId = searchParams.get('patient');
    if (patientId) {
      const patient = mockPatients.find(p => p.id === patientId);
      setSelectedPatient(patient || mockPatients[0]);
    } else {
      setSelectedPatient(mockPatients[0]);
    }
  }, [searchParams]);

  const handlePatientChange = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    setSelectedPatient(patient || null);
    // Update URL with patient parameter
    router.push(`/visit-schedule?patient=${patientId}`);
  };

  const tabs = [
    { id: 'scheduled' as const, label: 'eCRF / CFR Schedule', icon: Calendar },
    { id: 'safety' as const, label: 'Safety & Adverse Events', icon: Shield },
    { id: 'monitor' as const, label: 'Live Monitor', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Visit & Schedule Management</h1>
            
            {/* Patient Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Select Patient:</label>
              </div>
              <select
                value={selectedPatient?.id || ''}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {mockPatients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.studyId} ({patient.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedPatient ? (
              <>
                {activeTab === 'scheduled' && (
                  <ScheduledVisitsTab patientId={selectedPatient.id} />
                )}
                {activeTab === 'safety' && (
                  <SafetyReportingTab patientId={selectedPatient.id} />
                )}
                {activeTab === 'monitor' && (
                  <LiveMonitorTab patientId={selectedPatient.id} />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Please select a patient to continue.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
