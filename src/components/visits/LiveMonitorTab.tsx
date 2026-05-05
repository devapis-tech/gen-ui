'use client';

import { Heart, Activity, Thermometer, Droplets, Wifi, WifiOff, AlertCircle, User, Calendar, MapPin } from 'lucide-react';
import { useCopilotReadable } from "@copilotkit/react-core";
import { VitalSignsCard, BloodPressureCard } from '@/components/monitor/VitalSignsCard';
import { AlertFeed } from '@/components/monitor/AlertFeed';
import { useLiveMonitor } from '@/lib/hooks/useLiveMonitor';

interface LiveMonitorTabProps {
  patientId?: string;
}

// Mock subject data
const mockSubjects = [
  { id: 'EMR-1001', name: 'BG', age: 21, trial: 'LY4268989', dose: 'Dose 2', site: 'One of a Kind CRC - Scottsdale', visit: 'Week 4' },
  { id: 'EMR-1002', name: 'JD', age: 35, trial: 'LY4268989', dose: 'Dose 1', site: 'Phoenix Trial Center', visit: 'Week 2' },
  { id: 'EMR-1003', name: 'SM', age: 28, trial: 'LY4268989', dose: 'Dose 3', site: 'Mayo Clinic', visit: 'Week 8' },
];

export default function LiveMonitorTab({ patientId }: LiveMonitorTabProps) {
  const { vitals, alerts, connection, loading, error, acknowledgeAlert, disconnect, reconnect } = useLiveMonitor(patientId);
  
  // Get current subject info
  const currentSubject = mockSubjects.find(p => p.id === patientId) || mockSubjects[0];

  // Handle flag as adverse event
  const handleFlagAsAE = (subjectId: string, vitalType: string, value: string) => {
    // Navigate to adverse events page with pre-filled data
    window.location.href = `/adverse-events/new?patient=${patientId}&vital=${vitalType}&value=${encodeURIComponent(value)}&timestamp=${encodeURIComponent(new Date().toISOString())}`;
  };

  // Share real-time vitals with AI (Improvement 09)
  useCopilotReadable({
    description: `Real-time vital signs and alerts for patient ${patientId || 'monitoring'}`,
    value: { vitals, activeAlerts: alerts.filter(a => !a.acknowledged) },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading monitor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Context Bar */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">
                📡 Monitoring: {currentSubject.id} ({currentSubject.name})
              </span>
            </div>
            <div className="text-sm text-blue-700">
              Age: {currentSubject.age} | {currentSubject.trial} {currentSubject.dose}
            </div>
            <div className="flex items-center space-x-1 text-sm text-blue-700">
              <MapPin className="w-4 h-4" />
              <span>{currentSubject.site}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-blue-700">
              <Calendar className="w-4 h-4" />
              <span>Visit: {currentSubject.visit}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              value={currentSubject.id}
              onChange={(e) => {
                const newPatientId = e.target.value;
                window.history.pushState({}, '', `/live-monitor?patient=${newPatientId}`);
                window.location.reload();
              }}
              className="px-3 py-1 text-sm border border-blue-300 rounded-md bg-white text-blue-900"
            >
              {mockSubjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.id} ({subject.name})
                </option>
              ))}
            </select>
            <button
              onClick={() => window.location.href = `/patients/${currentSubject.id}`}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Profile →
            </button>
            <button
              onClick={() => window.location.href = `/visit-schedule?patient=${currentSubject.id}`}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Schedule →
            </button>
          </div>
        </div>
      </div>

      {/* Header with Connection Status */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Live Monitor</h2>
        <div className="flex items-center space-x-2">
          {connection.status === 'connected' ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                {connection.method === 'websocket' ? 'Live' : 'Polling'}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">Disconnected</span>
            </>
          )}
          <button
            onClick={connection.status === 'connected' ? disconnect : reconnect}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${connection.status === 'connected'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
          >
            {connection.status === 'connected' ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>

      {/* Connection Status Message */}
      {connection.status === 'disconnected' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">Monitor is disconnected. Real-time data is not available.</p>
          </div>
        </div>
      )}

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <VitalSignsCard
          title="Heart Rate"
          value={vitals.heartRate.value}
          unit={vitals.heartRate.unit}
          status={vitals.heartRate.status}
          trend={vitals.heartRate.trend}
          normalRange={`${vitals.heartRate.normalRange.min}-${vitals.heartRate.normalRange.max} ${vitals.heartRate.unit}`}
          icon={<Heart className="w-5 h-5 text-red-500" />}
          lastUpdate={connection.lastUpdate}
          patientId={currentSubject.id}
          vitalType="heart_rate"
          onFlagAsAE={handleFlagAsAE}
        />

        <BloodPressureCard
          systolic={vitals.bloodPressure.systolic}
          diastolic={vitals.bloodPressure.diastolic}
          status={vitals.bloodPressure.status}
          trend={vitals.bloodPressure.trend}
          normalRange={vitals.bloodPressure.normalRange}
          lastUpdate={connection.lastUpdate}
          patientId={currentSubject.id}
          onFlagAsAE={handleFlagAsAE}
        />

        <VitalSignsCard
          title="SpO2"
          value={vitals.spo2.value}
          unit={vitals.spo2.unit}
          status={vitals.spo2.status}
          trend={vitals.spo2.trend}
          normalRange={`${vitals.spo2.normalRange.min}-${vitals.spo2.normalRange.max} ${vitals.spo2.unit}`}
          icon={<Droplets className="w-5 h-5 text-blue-500" />}
          lastUpdate={connection.lastUpdate}
          patientId={currentSubject.id}
          vitalType="spo2"
          onFlagAsAE={handleFlagAsAE}
        />

        <VitalSignsCard
          title="Temperature"
          value={vitals.temperature.value}
          unit={vitals.temperature.unit}
          status={vitals.temperature.status}
          trend={vitals.temperature.trend}
          normalRange={`${vitals.temperature.normalRange.min}-${vitals.temperature.normalRange.max} ${vitals.temperature.unit}`}
          icon={<Thermometer className="w-5 h-5 text-orange-500" />}
          lastUpdate={connection.lastUpdate}
          patientId={currentSubject.id}
          vitalType="temperature"
          onFlagAsAE={handleFlagAsAE}
        />

        <VitalSignsCard
          title="Respiratory Rate"
          value={vitals.respiratoryRate.value}
          unit={vitals.respiratoryRate.unit}
          status={vitals.respiratoryRate.status}
          trend={vitals.respiratoryRate.trend}
          normalRange={`${vitals.respiratoryRate.normalRange.min}-${vitals.respiratoryRate.normalRange.max} ${vitals.respiratoryRate.unit}`}
          icon={<Activity className="w-5 h-5 text-green-500" />}
          lastUpdate={connection.lastUpdate}
          patientId={currentSubject.id}
          vitalType="respiratory_rate"
          onFlagAsAE={handleFlagAsAE}
        />
      </div>

      {/* Alerts Section */}
      <AlertFeed
        alerts={alerts}
        onAcknowledgeAlert={acknowledgeAlert}
        maxAlerts={15}
      />
    </div>
  );
}
