'use client';

import { useSearchParams } from 'next/navigation';
import LiveMonitorTab from '@/components/visits/LiveMonitorTab';

export default function LiveMonitorPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient') || 'demo-patient-1';

  return (
    <div className="container mx-auto px-4 py-6">
      <LiveMonitorTab patientId={patientId} />
    </div>
  );
}
