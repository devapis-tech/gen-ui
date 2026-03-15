export interface ClinicalTrial {
  nctId: string;
  protocolTitle: string;
  sponsorName: string;
  sponsorClass: string;
  phase: string;
  studyType: string;
  conditions: string;
  enrollmentCount: string;
  startDate: string;
  completionDate: string;
  overallStatus: string;
  piName: string;
  piAffiliation: string;
  indNumber: string;
  studyDetails?: {
    briefSummary: string;
    detailedDescription: string;
    primaryOutcomes: any[];
    secondaryOutcomes: any[];
  };
}

export interface TrialForm {
  id: string;
  name: string;
  description: string;
  required: boolean;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date';
  required: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface UserRole {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon?: string;
}

export interface TrialStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface AIAction {
  name: string;
  description: string;
  parameters: any[];
  handler: (args: any) => Promise<any>;
  render?: string;
}
