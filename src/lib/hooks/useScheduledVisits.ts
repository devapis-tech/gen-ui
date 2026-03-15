import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTrialDesignStore } from '../stores/trialDesignStore';
import { VisitEntry, ScheduledVisit, AuditEntry, DataQuery } from '@/types/visit';

interface UseScheduledVisitsReturn {
  visits: ScheduledVisit[];
  addVisit: (patientId: string, visitName: string, scheduledDate: Date) => void;
  updateVisit: (visitId: string, updates: Partial<VisitEntry>) => void;
  completeVisit: (visitId: string, formData: Record<string, any>, enteredBy: string) => void;
  flagQuery: (visitId: string, fieldName: string, reason: string, raisedBy: string) => void;
  resolveQuery: (visitId: string, queryId: string, response: string, resolvedBy: string) => void;
  getVisitsForPatient: (patientId: string) => ScheduledVisit[];
  getOverdueVisits: () => ScheduledVisit[];
  getUpcomingVisits: (days: number) => ScheduledVisit[];
}

export const useScheduledVisits = (): UseScheduledVisitsReturn => {
  const [visits, setVisits] = useState<ScheduledVisit[]>([]);
  const { trialData } = useTrialDesignStore();

  const createAuditEntry = useCallback((
    userId: string,
    action: AuditEntry['action'],
    fieldName?: string,
    oldValue?: any,
    newValue?: any,
    reason?: string
  ): AuditEntry => ({
    id: uuidv4(),
    timestamp: new Date(),
    userId,
    action,
    fieldName,
    oldValue,
    newValue,
    reason
  }), []);

  const calculateComplianceStatus = useCallback((visit: VisitEntry): ScheduledVisit['complianceStatus'] => {
    const now = new Date();
    const scheduledDate = new Date(visit.scheduledDate);
    const diffDays = Math.floor((now.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24));

    if (visit.status === 'completed') return 'compliant';
    if (diffDays > 7) return 'overdue';
    if (diffDays <= 7 && diffDays >= 0) return 'upcoming';
    return 'compliant';
  }, []);

  const generateNextActions = useCallback((visit: VisitEntry): string[] => {
    const actions: string[] = [];
    
    if (visit.status === 'scheduled') {
      actions.push('Complete visit forms');
      actions.push('Verify patient eligibility');
    }
    
    if (visit.dataEntryStatus === 'pending') {
      actions.push('Enter eCRF data');
    }
    
    if (visit.dataEntryStatus === 'query') {
      actions.push('Resolve data queries');
    }
    
    if (visit.queries && visit.queries.length > 0) {
      actions.push(`Address ${visit.queries.length} open quer${visit.queries.length === 1 ? 'y' : 'ies'}`);
    }
    
    return actions;
  }, []);

  const assessRiskFlags = useCallback((visit: VisitEntry): string[] => {
    const flags: string[] = [];
    
    // Check for overdue visits
    if (visit.status === 'scheduled' && new Date(visit.scheduledDate) < new Date()) {
      flags.push('Visit overdue');
    }
    
    // Check for unresolved queries
    if (visit.queries && visit.queries.some(q => q.status === 'open')) {
      flags.push('Open data queries');
    }
    
    // Check for missing critical data
    if (visit.status === 'completed' && visit.dataEntryStatus !== 'complete') {
      flags.push('Incomplete data entry');
    }
    
    return flags;
  }, []);

  const addVisit = useCallback((patientId: string, visitName: string, scheduledDate: Date) => {
    const newVisit: VisitEntry = {
      id: uuidv4(),
      patientId,
      visitName,
      scheduledDate,
      completedDate: null,
      status: 'scheduled',
      formData: {},
      dataEntryStatus: 'pending',
      enteredBy: 'system',
      enteredAt: new Date(),
      auditLog: [createAuditEntry('system', 'created')],
      queries: []
    };

    const scheduledVisit: ScheduledVisit = {
      ...newVisit,
      nextActions: generateNextActions(newVisit),
      complianceStatus: calculateComplianceStatus(newVisit),
      riskFlags: assessRiskFlags(newVisit)
    };

    setVisits(prev => [...prev, scheduledVisit]);
  }, [createAuditEntry, generateNextActions, calculateComplianceStatus, assessRiskFlags]);

  const updateVisit = useCallback((visitId: string, updates: Partial<VisitEntry>) => {
    setVisits(prev => prev.map(visit => {
      if (visit.id !== visitId) return visit;

      const auditEntry = createAuditEntry(
        updates.enteredBy || 'unknown',
        'updated',
        undefined,
        undefined,
        updates
      );

      const updatedVisit: VisitEntry = {
        ...visit,
        ...updates,
        auditLog: [...visit.auditLog, auditEntry]
      };

      return {
        ...updatedVisit,
        nextActions: generateNextActions(updatedVisit),
        complianceStatus: calculateComplianceStatus(updatedVisit),
        riskFlags: assessRiskFlags(updatedVisit)
      };
    }));
  }, [createAuditEntry, generateNextActions, calculateComplianceStatus, assessRiskFlags]);

  const completeVisit = useCallback((visitId: string, formData: Record<string, any>, enteredBy: string) => {
    setVisits(prev => prev.map(visit => {
      if (visit.id !== visitId) return visit;

      const auditEntry = createAuditEntry(
        enteredBy,
        'updated',
        undefined,
        { status: visit.status, formData: visit.formData },
        { status: 'completed', formData }
      );

      const updatedVisit: VisitEntry = {
        ...visit,
        status: 'completed',
        completedDate: new Date(),
        formData,
        dataEntryStatus: 'complete',
        enteredBy,
        enteredAt: new Date(),
        auditLog: [...visit.auditLog, auditEntry]
      };

      return {
        ...updatedVisit,
        nextActions: generateNextActions(updatedVisit),
        complianceStatus: calculateComplianceStatus(updatedVisit),
        riskFlags: assessRiskFlags(updatedVisit)
      };
    }));
  }, [createAuditEntry, generateNextActions, calculateComplianceStatus, assessRiskFlags]);

  const flagQuery = useCallback((visitId: string, fieldName: string, reason: string, raisedBy: string) => {
    const newQuery: DataQuery = {
      id: uuidv4(),
      fieldName,
      reason,
      raisedBy,
      raisedAt: new Date(),
      status: 'open'
    };

    setVisits(prev => prev.map(visit => {
      if (visit.id !== visitId) return visit;

      const auditEntry = createAuditEntry(
        raisedBy,
        'flagged',
        fieldName,
        undefined,
        { query: newQuery },
        reason
      );

      const updatedVisit: VisitEntry = {
        ...visit,
        queries: [...visit.queries, newQuery],
        dataEntryStatus: 'query',
        auditLog: [...visit.auditLog, auditEntry]
      };

      return {
        ...updatedVisit,
        nextActions: generateNextActions(updatedVisit),
        complianceStatus: calculateComplianceStatus(updatedVisit),
        riskFlags: assessRiskFlags(updatedVisit)
      };
    }));
  }, [createAuditEntry, generateNextActions, calculateComplianceStatus, assessRiskFlags]);

  const resolveQuery = useCallback((visitId: string, queryId: string, response: string, resolvedBy: string) => {
    setVisits(prev => prev.map(visit => {
      if (visit.id !== visitId) return visit;

      const updatedQueries = visit.queries.map(query => {
        if (query.id !== queryId) return query;
        return {
          ...query,
          status: 'resolved' as const,
          response,
          resolvedBy,
          resolvedAt: new Date()
        };
      });

      const hasOpenQueries = updatedQueries.some(q => q.status === 'open');
      
      const auditEntry = createAuditEntry(
        resolvedBy,
        'updated',
        'queries',
        visit.queries,
        updatedQueries,
        `Resolved query: ${response}`
      );

      const updatedVisit: VisitEntry = {
        ...visit,
        queries: updatedQueries,
        dataEntryStatus: hasOpenQueries ? 'query' : 'complete',
        auditLog: [...visit.auditLog, auditEntry]
      };

      return {
        ...updatedVisit,
        nextActions: generateNextActions(updatedVisit),
        complianceStatus: calculateComplianceStatus(updatedVisit),
        riskFlags: assessRiskFlags(updatedVisit)
      };
    }));
  }, [createAuditEntry, generateNextActions, calculateComplianceStatus, assessRiskFlags]);

  const getVisitsForPatient = useCallback((patientId: string) => {
    return visits.filter(visit => visit.patientId === patientId);
  }, [visits]);

  const getOverdueVisits = useCallback(() => {
    const now = new Date();
    return visits.filter(visit => 
      visit.status === 'scheduled' && 
      new Date(visit.scheduledDate) < now
    );
  }, [visits]);

  const getUpcomingVisits = useCallback((days: number) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    return visits.filter(visit => 
      visit.status === 'scheduled' && 
      new Date(visit.scheduledDate) >= now && 
      new Date(visit.scheduledDate) <= futureDate
    );
  }, [visits]);

  return {
    visits,
    addVisit,
    updateVisit,
    completeVisit,
    flagQuery,
    resolveQuery,
    getVisitsForPatient,
    getOverdueVisits,
    getUpcomingVisits
  };
};
