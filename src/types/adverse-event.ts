export interface AdverseEvent {
  id: string;
  patientId: string;
  eventName: string;           // MedDRA Preferred Term
  soc: string;                // System Organ Class
  severity: "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | "Grade 5";
  onset: Date;
  resolution: Date | null;
  causality: "Related" | "Not Related" | "Possibly Related" | "Unknown";
  action: string;             // e.g., "Dose reduced", "Drug withdrawn"
  outcome: string;            // e.g., "Recovered", "Ongoing"
  serious: boolean;           // SAE flag
  saeReason?: string[];       // Death, Hospitalization, etc.
  reportedBy: string;
  reportedAt: Date;
  regulatoryReported: boolean;
  description?: string;       // Free-text description for AI analysis
  meddraCode?: string;        // MedDRA code
  followUpRequired: boolean;
  nextFollowUp?: Date;
}

export interface SAEReason {
  id: string;
  label: string;
  description: string;
}

export const SAEReasons: SAEReason[] = [
  {
    id: 'death',
    label: 'Death',
    description: 'Patient death related to the adverse event'
  },
  {
    id: 'hospitalization',
    label: 'Hospitalization',
    description: 'Inpatient hospitalization or prolongation of existing hospitalization'
  },
  {
    id: 'disability',
    label: 'Disability',
    description: 'Persistent or significant disability/incapacity'
  },
  {
    id: 'congenital',
    label: 'Congenital Anomaly',
    description: 'Congenital anomaly/birth defect'
  },
  {
    id: 'life_threatening',
    label: 'Life-Threatening',
    description: 'Event that places the patient at immediate risk of death'
  },
  {
    id: 'other_medically_important',
    label: 'Other Medically Important',
    description: 'Other medically important serious events'
  }
];

export interface MedDRATerm {
  code: string;
  term: string;
  soc: string;
  pt: string;  // Preferred Term
  llt: string; // Lowest Level Term
}

export interface AEFilters {
  severity?: string[];
  causality?: string[];
  serious?: boolean;
  outcome?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AEExportOptions {
  format: 'fda_3500a' | 'csv' | 'json';
  includeFollowUp: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
