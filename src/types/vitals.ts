export interface VitalSign {
  id: string;
  patientId: string;
  timestamp: Date;
  type: 'heart_rate' | 'blood_pressure' | 'spo2' | 'temperature' | 'respiratory_rate' | 'ecg';
  value: number | string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

export interface VitalsData {
  heartRate: {
    value: number;
    unit: 'bpm';
    status: 'normal' | 'warning' | 'critical';
    trend?: 'up' | 'down' | 'stable';
    normalRange: { min: number; max: number };
  };
  bloodPressure: {
    systolic: number;
    diastolic: number;
    unit: 'mmHg';
    status: 'normal' | 'warning' | 'critical';
    trend?: 'up' | 'down' | 'stable';
    normalRange: { systolic: { min: number; max: number }; diastolic: { min: number; max: number } };
  };
  spo2: {
    value: number;
    unit: '%';
    status: 'normal' | 'warning' | 'critical';
    trend?: 'up' | 'down' | 'stable';
    normalRange: { min: number; max: number };
  };
  temperature: {
    value: number;
    unit: '°F';
    status: 'normal' | 'warning' | 'critical';
    trend?: 'up' | 'down' | 'stable';
    normalRange: { min: number; max: number };
  };
  respiratoryRate: {
    value: number;
    unit: 'bpm';
    status: 'normal' | 'warning' | 'critical';
    trend?: 'up' | 'down' | 'stable';
    normalRange: { min: number; max: number };
  };
  ecg?: {
    rhythm: string;
    heartRate: number;
    status: 'normal' | 'warning' | 'critical';
    events?: string[];
  };
}

export interface VitalAlert {
  id: string;
  patientId: string;
  timestamp: Date;
  type: 'heart_rate' | 'blood_pressure' | 'spo2' | 'temperature' | 'respiratory_rate' | 'ecg';
  severity: 'warning' | 'critical';
  message: string;
  currentValue: number | string;
  normalRange: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface MonitorConnection {
  status: 'connected' | 'disconnected' | 'reconnecting';
  lastUpdate: Date;
  method: 'websocket' | 'polling';
}

export interface LiveMonitorState {
  vitals: VitalsData;
  alerts: VitalAlert[];
  connection: MonitorConnection;
  loading: boolean;
  error?: string;
}
