'use client';

import { Heart, Activity, Thermometer, Droplets, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { VitalSignsCard, BloodPressureCard } from '@/components/monitor/VitalSignsCard';
import { AlertFeed } from '@/components/monitor/AlertFeed';
import { useLiveMonitor } from '@/lib/hooks/useLiveMonitor';

interface LiveMonitorTabProps {
  patientId?: string;
}

export default function LiveMonitorTab({ patientId }: LiveMonitorTabProps) {
  const { vitals, alerts, connection, loading, error, acknowledgeAlert, disconnect, reconnect } = useLiveMonitor(patientId);

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
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              connection.status === 'connected' 
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
        />

        <BloodPressureCard
          systolic={vitals.bloodPressure.systolic}
          diastolic={vitals.bloodPressure.diastolic}
          status={vitals.bloodPressure.status}
          trend={vitals.bloodPressure.trend}
          normalRange={vitals.bloodPressure.normalRange}
          lastUpdate={connection.lastUpdate}
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
