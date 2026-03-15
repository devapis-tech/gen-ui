export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'flagged';
  fieldName?: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
}

export interface ECRFField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'textarea';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  category?: string;
  description?: string;
}

export interface VisitEntry {
  id: string;
  patientId: string;
  visitName: string;
  scheduledDate: Date;
  completedDate: Date | null;
  status: 'scheduled' | 'completed' | 'missed' | 'unscheduled';
  formData: Record<string, any>;
  dataEntryStatus: 'pending' | 'complete' | 'query';
  enteredBy: string;
  enteredAt: Date;
  auditLog: AuditEntry[];
  queries: DataQuery[];
}

export interface DataQuery {
  id: string;
  fieldName: string;
  reason: string;
  raisedBy: string;
  raisedAt: Date;
  status: 'open' | 'resolved' | 'closed';
  response?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface VisitTemplate {
  visitName: string;
  eCRFFields: ECRFField[];
  procedures: string[];
  window: string;
  estimatedDuration: number;
}

export interface ScheduledVisit extends VisitEntry {
  nextActions: string[];
  complianceStatus: 'compliant' | 'overdue' | 'upcoming';
  riskFlags: string[];
}
