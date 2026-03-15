'use client';

import { useState } from 'react';
import { X, AlertTriangle, MessageSquare, Search } from 'lucide-react';

interface AEReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function AEReportForm({ isOpen, onClose, onSubmit }: AEReportFormProps) {
  const [formData, setFormData] = useState({
    eventName: '',
    severity: 1 as 1 | 2 | 3 | 4 | 5,
    onsetDate: '',
    causality: 'unrelated' as 'related' | 'possibly-related' | 'unlikely-related' | 'unrelated',
    actionTaken: '',
    outcome: 'ongoing' as 'resolved' | 'ongoing' | 'unknown',
    isSAE: false,
    meddraCode: ''
  });
  const [aiInput, setAiInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [meddraSearch, setMeddraSearch] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      eventName: '',
      severity: 1,
      onsetDate: '',
      causality: 'unrelated',
      actionTaken: '',
      outcome: 'ongoing',
      isSAE: false,
      meddraCode: ''
    });
  };

  const handleAISubmit = async () => {
    if (!aiInput.trim()) return;
    
    setIsProcessingAI(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock AI response - in real implementation, this would call an AI service
      const mockAIResponse = {
        eventName: aiInput.includes('headache') ? 'Headache' : 
                   aiInput.includes('nausea') ? 'Nausea' : 
                   aiInput.includes('fever') ? 'Fever' : 'Adverse Event',
        severity: (aiInput.includes('severe') ? 3 : aiInput.includes('mild') ? 1 : 2) as 1 | 2 | 3 | 4 | 5,
        onsetDate: new Date().toISOString().split('T')[0],
        meddraCode: aiInput.includes('headache') ? '10019231' : 
                   aiInput.includes('nausea') ? '10029605' : 
                   aiInput.includes('fever') ? '10023375' : '10000001',
        causality: (aiInput.includes('related') ? 'possibly-related' : 'unrelated') as 'related' | 'possibly-related' | 'unlikely-related' | 'unrelated'
      };
      
      setFormData(prev => ({
        ...prev,
        ...mockAIResponse
      }));
      
      setAiInput('');
      setIsProcessingAI(false);
    }, 1500);
  };

  const mockMeddraCodes = [
    { code: '10019231', term: 'Headache' },
    { code: '10029605', term: 'Nausea' },
    { code: '10023375', term: 'Fever' },
    { code: '10017986', term: 'Fatigue' },
    { code: '10027217', term: 'Dizziness' },
    { code: '10013361', term: 'Vomiting' },
    { code: '10040878', term: 'Rash' },
    { code: '10011401', term: 'Abdominal pain' }
  ];

  const filteredMeddraCodes = mockMeddraCodes.filter(item => 
    item.term.toLowerCase().includes(meddraSearch.toLowerCase()) ||
    item.code.includes(meddraSearch)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Report Adverse Event</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Assistant Section */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <MessageSquare className="w-5 h-5 text-red-600" />
              <h3 className="font-medium text-red-900">AI Assistant - MedDRA Coding</h3>
            </div>
            <p className="text-sm text-red-800 mb-3">
              Describe the adverse event and AI will help with MedDRA coding:
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g., 'Patient reports severe headache starting yesterday, possibly related to medication'"
                className="flex-1 px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()}
              />
              <button
                onClick={handleAISubmit}
                disabled={!aiInput.trim() || isProcessingAI}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessingAI ? 'Processing...' : 'Process'}
              </button>
            </div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Headache, Nausea"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity (Grade 1-5) *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value={1}>Grade 1 - Mild</option>
                  <option value={2}>Grade 2 - Moderate</option>
                  <option value={3}>Grade 3 - Severe</option>
                  <option value={4}>Grade 4 - Life-threatening</option>
                  <option value={5}>Grade 5 - Death</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Onset Date *
                </label>
                <input
                  type="date"
                  value={formData.onsetDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, onsetDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Causality *
                </label>
                <select
                  value={formData.causality}
                  onChange={(e) => setFormData(prev => ({ ...prev, causality: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="related">Related</option>
                  <option value="possibly-related">Possibly Related</option>
                  <option value="unlikely-related">Unlikely Related</option>
                  <option value="unrelated">Unrelated</option>
                </select>
              </div>
            </div>

            {/* MedDRA Coding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MedDRA Code
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={meddraSearch}
                    onChange={(e) => setMeddraSearch(e.target.value)}
                    placeholder="Search MedDRA terms..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                {meddraSearch && filteredMeddraCodes.length > 0 && (
                  <div className="border border-gray-200 rounded-md max-h-32 overflow-y-auto">
                    {filteredMeddraCodes.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, meddraCode: item.code }));
                          setMeddraSearch('');
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-sm font-medium">{item.term}</div>
                        <div className="text-xs text-gray-500">{item.code}</div>
                      </button>
                    ))}
                  </div>
                )}
                
                {formData.meddraCode && (
                  <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <span className="text-sm">
                      Selected: <span className="font-medium">{formData.meddraCode}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, meddraCode: '' }))}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Taken *
              </label>
              <input
                type="text"
                value={formData.actionTaken}
                onChange={(e) => setFormData(prev => ({ ...prev, actionTaken: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., Medication administered, Dose adjusted"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outcome *
                </label>
                <select
                  value={formData.outcome}
                  onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="resolved">Resolved</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isSAE"
                  checked={formData.isSAE}
                  onChange={(e) => setFormData(prev => ({ ...prev, isSAE: e.target.checked }))}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isSAE" className="text-sm font-medium text-gray-700">
                  Serious Adverse Event (SAE)
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Submit AE Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
