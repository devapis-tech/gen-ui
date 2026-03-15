import { useScheduledVisits } from '@/lib/hooks/useScheduledVisits';
import { useTrialDesignStore } from '@/lib/stores/trialDesignStore';
import { AIAction } from '@/types/clinical-trial';

export const createVisitAIActions = (): AIAction[] => {
  const { addVisit, updateVisit, completeVisit, flagQuery, getVisitsForPatient } = useScheduledVisits();
  const { trialData } = useTrialDesignStore();

  return [
    {
      name: 'logVisitData',
      description: 'Log visit data from verbal description',
      parameters: [
        { name: 'patientId', type: 'string', required: true },
        { name: 'visitName', type: 'string', required: true },
        { name: 'description', type: 'string', required: true },
        { name: 'scheduledDate', type: 'string', required: false }
      ],
      handler: async ({ patientId, visitName, description, scheduledDate }) => {
        try {
          // Parse the description to extract structured data
          const parsedData = parseVisitDescription(description, visitName);
          
          // Create or update the visit
          const visitDate = scheduledDate ? new Date(scheduledDate) : new Date();
          
          if (parsedData.isCompleted) {
            const visitId = Date.now().toString();
            addVisit(patientId, visitName, visitDate);
            completeVisit(visitId, parsedData.formData, 'ai-assistant');
          } else {
            addVisit(patientId, visitName, visitDate);
          }

          return {
            success: true,
            message: `Successfully logged ${visitName} for patient ${patientId}`,
            data: parsedData
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to log visit data: ${error instanceof Error ? error.message : 'Unknown error'}`
          };
        }
      }
    },

    {
      name: 'flagDataQuery',
      description: 'Flag a data query for review',
      parameters: [
        { name: 'visitId', type: 'string', required: true },
        { name: 'fieldName', type: 'string', required: true },
        { name: 'reason', type: 'string', required: true }
      ],
      handler: async ({ visitId, fieldName, reason }) => {
        try {
          flagQuery(visitId, fieldName, reason, 'ai-assistant');
          
          return {
            success: true,
            message: `Data query flagged for field: ${fieldName}`,
            queryId: `query-${Date.now()}`
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to flag data query: ${error instanceof Error ? error.message : 'Unknown error'}`
          };
        }
      }
    },

    {
      name: 'getVisitSummary',
      description: 'Get summary of visits for a patient',
      parameters: [
        { name: 'patientId', type: 'string', required: true }
      ],
      handler: async ({ patientId }) => {
        try {
          const visits = getVisitsForPatient(patientId);
          
          const summary = {
            totalVisits: visits.length,
            completedVisits: visits.filter(v => v.status === 'completed').length,
            scheduledVisits: visits.filter(v => v.status === 'scheduled').length,
            missedVisits: visits.filter(v => v.status === 'missed').length,
            overdueVisits: visits.filter(v => v.complianceStatus === 'overdue').length,
            openQueries: visits.reduce((acc, v) => acc + v.queries.filter(q => q.status === 'open').length, 0),
            lastVisit: visits.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())[0]
          };

          return {
            success: true,
            message: `Retrieved visit summary for patient ${patientId}`,
            data: summary
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to get visit summary: ${error instanceof Error ? error.message : 'Unknown error'}`
          };
        }
      }
    },

    {
      name: 'validateVisitData',
      description: 'Validate visit data against protocol requirements',
      parameters: [
        { name: 'visitId', type: 'string', required: true }
      ],
      handler: async ({ visitId }) => {
        try {
          const visits = getVisitsForPatient(''); // This would need to be enhanced to get specific visit
          const visit = visits.find(v => v.id === visitId);
          
          if (!visit) {
            return {
              success: false,
              message: 'Visit not found'
            };
          }

          const validationResults = validateVisitAgainstProtocol(visit, trialData);
          
          return {
            success: true,
            message: `Validation completed for ${visit.visitName}`,
            data: validationResults
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to validate visit data: ${error instanceof Error ? error.message : 'Unknown error'}`
          };
        }
      }
    }
  ];
};

// Helper functions
function parseVisitDescription(description: string, visitName: string) {
  const lowerDesc = description.toLowerCase();
  
  // Extract completion status
  const isCompleted = lowerDesc.includes('completed') || 
                     lowerDesc.includes('done') || 
                     lowerDesc.includes('finished') ||
                     lowerDesc.includes('completed today');
  
  // Extract vital signs if mentioned
  const vitals: Record<string, any> = {};
  
  // Blood pressure
  const bpMatch = description.match(/(\d{2,3})\/(\d{2,3})\s*mmhg/i);
  if (bpMatch) {
    vitals.bloodPressure = {
      systolic: parseInt(bpMatch[1]),
      diastolic: parseInt(bpMatch[2]),
      unit: 'mmHg'
    };
  }
  
  // Heart rate
  const hrMatch = description.match(/(\d{2,3})\s*bpm/i);
  if (hrMatch) {
    vitals.heartRate = {
      value: parseInt(hrMatch[1]),
      unit: 'bpm'
    };
  }
  
  // Weight
  const weightMatch = description.match(/(\d+(?:\.\d+)?)\s*kg/i);
  if (weightMatch) {
    vitals.weight = {
      value: parseFloat(weightMatch[1]),
      unit: 'kg'
    };
  }
  
  // Temperature
  const tempMatch = description.match(/(\d+(?:\.\d+)?)\s*°?[cf]/i);
  if (tempMatch) {
    vitals.temperature = {
      value: parseFloat(tempMatch[1]),
      unit: description.includes('°F') || description.includes('F') ? '°F' : '°C'
    };
  }
  
  // Extract adverse events
  const adverseEvents: string[] = [];
  if (lowerDesc.includes('headache')) adverseEvents.push('Headache');
  if (lowerDesc.includes('nausea')) adverseEvents.push('Nausea');
  if (lowerDesc.includes('dizziness')) adverseEvents.push('Dizziness');
  if (lowerDesc.includes('fatigue')) adverseEvents.push('Fatigue');
  
  // Extract concomitant medications
  const medications: string[] = [];
  if (lowerDesc.includes('aspirin')) medications.push('Aspirin');
  if (lowerDesc.includes('acetaminophen')) medications.push('Acetaminophen');
  if (lowerDesc.includes('ibuprofen')) medications.push('Ibuprofen');
  
  const formData = {
    ...vitals,
    notes: description,
    adverseEvents,
    concomitantMedications: medications
  };
  
  return {
    isCompleted,
    formData
  };
}

function validateVisitAgainstProtocol(visit: any, trialData: any) {
  const validationResults = {
    isValid: true,
    warnings: [] as string[],
    errors: [] as string[],
    missingRequiredFields: [] as string[]
  };
  
  // Get the visit template from trial design
  const visitTemplate = trialData?.visitSchedule?.find((v: any) => v.name === visit.visitName);
  
  if (!visitTemplate) {
    validationResults.warnings.push(`No template found for visit type: ${visit.visitName}`);
    return validationResults;
  }
  
  // Check required fields
  if (visitTemplate.eCRFFields) {
    visitTemplate.eCRFFields.forEach((field: any) => {
      if (field.required && !visit.formData[field.id]) {
        validationResults.missingRequiredFields.push(field.label);
        validationResults.isValid = false;
      }
    });
  }
  
  // Check visit timing
  const scheduledDate = new Date(visit.scheduledDate);
  const completedDate = visit.completedDate ? new Date(visit.completedDate) : null;
  
  if (visit.status === 'completed' && completedDate) {
    const daysDiff = Math.floor((completedDate.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (visitTemplate.window) {
      // Parse window (e.g., "±3 days", "±1 week")
      const windowMatch = visitTemplate.window.match(/±(\d+)\s*(day|week)s?/i);
      if (windowMatch) {
        const windowValue = parseInt(windowMatch[1]);
        const windowUnit = windowMatch[2].toLowerCase();
        
        const allowedDays = windowUnit === 'week' ? windowValue * 7 : windowValue;
        
        if (Math.abs(daysDiff) > allowedDays) {
          validationResults.warnings.push(`Visit completed outside protocol window: ${daysDiff} days difference`);
        }
      }
    }
  }
  
  // Check for out-of-range values
  if (visit.formData) {
    Object.entries(visit.formData).forEach(([fieldId, value]) => {
      const field = visitTemplate.eCRFFields?.find((f: any) => f.id === fieldId);
      
      if (field && field.validation && typeof value === 'number') {
        if (field.validation.min !== undefined && value < field.validation.min) {
          validationResults.errors.push(`${field.label}: Value ${value} is below minimum ${field.validation.min}`);
          validationResults.isValid = false;
        }
        
        if (field.validation.max !== undefined && value > field.validation.max) {
          validationResults.errors.push(`${field.label}: Value ${value} is above maximum ${field.validation.max}`);
          validationResults.isValid = false;
        }
      }
    });
  }
  
  return validationResults;
}
