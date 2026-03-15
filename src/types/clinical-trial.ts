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

export interface Patient {
  id: string;
  subjectId: string;
  initials: string;
  dateOfBirth?: string;
  age?: number;
  enrollmentDate: string;
  trialArm?: string;
  cohort?: string;
  site: string;
  status: "SCREENING" | "ENROLLED" | "COMPLETED" | "WITHDRAWN";
  currentVisit: string;
  nextVisit: string;
  vitals?: Vitals[];
  visitHistory?: VisitHistory[];
  adverseEvents?: AdverseEvent[];
}

export interface Vitals {
  id: string;
  date: string;
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  weight: number;
  height?: number;
}

export interface VisitHistory {
  id: string;
  visitNumber: string;
  visitName: string;
  date: string;
  status: "SCHEDULED" | "COMPLETED" | "MISSED" | "CANCELLED";
  procedures: string[];
  notes?: string;
}

import { AdverseEvent } from './adverse-event';

export type { AdverseEvent };
