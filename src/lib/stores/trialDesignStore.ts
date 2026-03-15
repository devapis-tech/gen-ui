import { create } from 'zustand';
import { ClinicalTrial } from '@/types/clinical-trial';

export interface EligibilityCriteria {
  inclusion: string[];
  exclusion: string[];
}

export interface VisitSchedule {
  id: string;
  name: string;
  day: number;
  window: string;
  procedures: string[];
  eCRFFields?: any[];
}

export interface Endpoint {
  id: string;
  type: 'primary' | 'secondary';
  title: string;
  description: string;
  timepoint: string;
  measurementMethod: string;
}

export interface ProtocolDocument {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface TrialDesignData extends ClinicalTrial {
  eligibilityCriteria?: EligibilityCriteria;
  visitSchedule?: VisitSchedule[];
  endpoints?: Endpoint[];
  protocolDocuments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
}

interface TrialDesignStore {
  trialData: TrialDesignData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTrialData: (data: TrialDesignData) => void;
  updateTrialData: (updates: Partial<TrialDesignData>) => void;
  clearTrialData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Specific update methods
  updateEligibilityCriteria: (criteria: EligibilityCriteria) => void;
  addVisitSchedule: (visit: VisitSchedule) => void;
  updateVisitSchedule: (id: string, updates: Partial<VisitSchedule>) => void;
  removeVisitSchedule: (id: string) => void;
  addEndpoint: (endpoint: Endpoint) => void;
  updateEndpoint: (id: string, updates: Partial<Endpoint>) => void;
  removeEndpoint: (id: string) => void;
  addProtocolDocument: (document: { id: string; name: string; type: string; url: string }) => void;
  removeProtocolDocument: (id: string) => void;
}

export const useTrialDesignStore = create<TrialDesignStore>((set, get) => ({
  trialData: null,
  isLoading: false,
  error: null,

  setTrialData: (data: TrialDesignData) => set({ trialData: data, error: null }),
  
  updateTrialData: (updates: Partial<TrialDesignData>) => set((state) => {
    if (!state.trialData) return state;
    return {
      trialData: { ...state.trialData, ...updates },
      error: null
    };
  }),

  clearTrialData: () => set({ trialData: null, error: null }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),

  updateEligibilityCriteria: (criteria: EligibilityCriteria) => set((state) => {
    if (!state.trialData) return state;
    return {
      trialData: { ...state.trialData, eligibilityCriteria: criteria }
    };
  }),

  addVisitSchedule: (visit: VisitSchedule) => set((state) => {
    if (!state.trialData) return state;
    return {
      trialData: {
        ...state.trialData,
        visitSchedule: [...(state.trialData.visitSchedule || []), visit]
      }
    };
  }),

  updateVisitSchedule: (id: string, updates: Partial<VisitSchedule>) => set((state) => {
    if (!state.trialData?.visitSchedule) return state;
    return {
      trialData: {
        ...state.trialData,
        visitSchedule: state.trialData.visitSchedule.map(visit =>
          visit.id === id ? { ...visit, ...updates } : visit
        )
      }
    };
  }),

  removeVisitSchedule: (id: string) => set((state) => {
    if (!state.trialData?.visitSchedule) return state;
    return {
      trialData: {
        ...state.trialData,
        visitSchedule: state.trialData.visitSchedule.filter(visit => visit.id !== id)
      }
    };
  }),

  addEndpoint: (endpoint: Endpoint) => set((state) => {
    if (!state.trialData) return state;
    return {
      trialData: {
        ...state.trialData,
        endpoints: [...(state.trialData.endpoints || []), endpoint]
      }
    };
  }),

  updateEndpoint: (id: string, updates: Partial<Endpoint>) => set((state) => {
    if (!state.trialData?.endpoints) return state;
    return {
      trialData: {
        ...state.trialData,
        endpoints: state.trialData.endpoints.map(endpoint =>
          endpoint.id === id ? { ...endpoint, ...updates } : endpoint
        )
      }
    };
  }),

  removeEndpoint: (id: string) => set((state) => {
    if (!state.trialData?.endpoints) return state;
    return {
      trialData: {
        ...state.trialData,
        endpoints: state.trialData.endpoints.filter(endpoint => endpoint.id !== id)
      }
    };
  }),

  addProtocolDocument: (document: ProtocolDocument) => set((state) => {
    if (!state.trialData) return state;
    return {
      trialData: {
        ...state.trialData,
        protocolDocuments: [...(state.trialData.protocolDocuments || []), document]
      }
    };
  }),

  removeProtocolDocument: (id) => set((state) => {
    if (!state.trialData?.protocolDocuments) return state;
    return {
      trialData: {
        ...state.trialData,
        protocolDocuments: state.trialData.protocolDocuments.filter(doc => doc.id !== id)
      }
    };
  }),
}));
