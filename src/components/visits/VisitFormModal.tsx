'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { DynamicECRFForm } from './DynamicECRFForm';
import { useTrialDesignStore } from '@/lib/stores/trialDesignStore';
import { useScheduledVisits } from '@/lib/hooks/useScheduledVisits';
import { ECRFField, VisitEntry } from '@/types/visit';

interface VisitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  visitId?: string;
  initialData?: Partial<VisitEntry>;
}

export default function VisitFormModal({ 
  isOpen, 
  onClose, 
  patientId, 
  visitId, 
  initialData 
}: VisitFormModalProps) {
  const { trialData } = useTrialDesignStore();
  const { addVisit, updateVisit, completeVisit, flagQuery } = useScheduledVisits();
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedVisitName, setSelectedVisitName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [status, setStatus] = useState<'scheduled' | 'completed' | 'missed' | 'unscheduled'>('scheduled');
  const [aiInput, setAiInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [currentVisit, setCurrentVisit] = useState<VisitEntry | null>(null);

  // Get available visit types from trial design
  const availableVisitTypes = trialData?.visitSchedule || [];
  const selectedVisitTemplate = availableVisitTypes.find(v => v.name === selectedVisitName);
  const eCRFFields = selectedVisitTemplate?.eCRFFields || [];

  useEffect(() => {
    if (initialData) {
      setSelectedVisitName(initialData.visitName || '');
      setScheduledDate(initialData.scheduledDate ? new Date(initialData.scheduledDate).toISOString().split('T')[0] : '');
      setCompletedDate(initialData.completedDate ? new Date(initialData.completedDate).toISOString().split('T')[0] : '');
      setStatus(initialData.status || 'scheduled');
      setFormData(initialData.formData || {});
      setCurrentVisit(visitId ? null : null); // Would fetch visit data if visitId provided
    }
  }, [initialData, visitId]);

  if (!isOpen) return null;

  const handleFormSubmit = async () => {
    if (!patientId || !selectedVisitName) {
      setFormErrors({ general: 'Patient ID and Visit Type are required' });
      return;
    }

    try {
      const visitData = {
        patientId,
        visitName: selectedVisitName,
        scheduledDate: new Date(scheduledDate),
        completedDate: completedDate ? new Date(completedDate) : null,
        status,
        formData,
        enteredBy: 'current-user', // Would get from auth context
        enteredAt: new Date()
      };

      if (visitId) {
        // Update existing visit
        updateVisit(visitId, visitData);
      } else {
        // Add new visit
        if (status === 'completed') {
          const visitId = Date.now().toString();
          addVisit(patientId, selectedVisitName, new Date(scheduledDate));
          completeVisit(visitId, formData, 'current-user');
        } else {
          addVisit(patientId, selectedVisitName, new Date(scheduledDate));
        }
      }

      handleClose();
    } catch (error) {
      setFormErrors({ general: 'Failed to save visit data' });
    }
  };

  const handleAISubmit = async () => {
    if (!aiInput.trim()) return;
    
    setIsProcessingAI(true);
    
    try {
      // Simulate AI processing - in real implementation, this would call an AI service
      setTimeout(() => {
        const processed = processAIDescription(aiInput);
        setSelectedVisitName(processed.visitName);
        setScheduledDate(processed.scheduledDate);
        setCompletedDate(processed.completedDate);
        setStatus(processed.status);
        setFormData(prev => ({ ...prev, ...processed.formData }));
        
        setAiInput('');
        setIsProcessingAI(false);
      }, 1500);
    } catch (error) {
      setFormErrors({ ai: 'Failed to process AI input' });
      setIsProcessingAI(false);
    }
  };

  const processAIDescription = (description: string) => {
    // Mock AI processing - would integrate with actual AI service
    const lowerDesc = description.toLowerCase();
    
    let visitName = selectedVisitName;
    if (lowerDesc.includes('screening')) visitName = 'Screening Visit';
    else if (lowerDesc.includes('baseline')) visitName = 'Baseline Visit';
    else if (lowerDesc.includes('week 4')) visitName = 'Week 4 Visit';
    else if (lowerDesc.includes('week 8')) visitName = 'Week 8 Visit';
    else if (lowerDesc.includes('follow')) visitName = 'Follow-up Visit';

    const isCompleted = lowerDesc.includes('completed') || lowerDesc.includes('done') || lowerDesc.includes('finished');
    
    return {
      visitName,
      scheduledDate: new Date().toISOString().split('T')[0],
      completedDate: isCompleted ? new Date().toISOString().split('T')[0] : '',
      status: isCompleted ? 'completed' as const : 'scheduled' as const,
      formData: {
        notes: `AI processed: ${description}`
      }
    };
  };

  const handleClose = () => {
    // Reset form
    setSelectedVisitName('');
    setScheduledDate('');
    setCompletedDate('');
    setStatus('scheduled');
    setFormData({});
    setAiInput('');
    setFormErrors({});
    setCurrentVisit(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {visitId ? 'Edit Visit Entry' : 'Add Visit Entry'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Assistant Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">AI Assistant</h3>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Describe the visit verbally and AI will help fill the form:
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g., 'Patient completed screening visit today with all vitals normal'"
                className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()}
              />
              <button
                onClick={handleAISubmit}
                disabled={!aiInput.trim() || isProcessingAI}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessingAI ? 'Processing...' : 'Process'}
              </button>
            </div>
            {formErrors.ai && (
              <p className="text-sm text-red-600 mt-2">{formErrors.ai}</p>
            )}
          </div>

          {/* Visit Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visit Type *
              </label>
              <select
                value={selectedVisitName}
                onChange={(e) => setSelectedVisitName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select visit type</option>
                {availableVisitTypes.map(visit => (
                  <option key={visit.id} value={visit.name}>
                    {visit.name} (Day {visit.day})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Scheduled Date *
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
                <option value="unscheduled">Unscheduled</option>
              </select>
            </div>
          </div>

          {status === 'completed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Completed Date
              </label>
              <input
                type="date"
                value={completedDate}
                onChange={(e) => setCompletedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Dynamic eCRF Form */}
          {selectedVisitName && eCRFFields.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                eCRF Data Entry - {selectedVisitName}
              </h3>
              <DynamicECRFForm
                fields={eCRFFields}
                initialData={formData}
                onDataChange={setFormData}
                onValidationChange={setIsFormValid}
              />
            </div>
          )}

          {/* General Error */}
          {formErrors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{formErrors.general}</span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              disabled={!selectedVisitName || !scheduledDate || (status === 'completed' && !isFormValid)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{visitId ? 'Update Visit' : 'Add Visit'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
