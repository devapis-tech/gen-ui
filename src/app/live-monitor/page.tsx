'use client';

import LiveMonitorTab from '@/components/visits/LiveMonitorTab';

export default function LiveMonitorPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <LiveMonitorTab patientId="demo-patient-1" />
    </div>
  );
}
