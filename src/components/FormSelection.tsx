"use client";

import { useState } from "react";

interface FormSelectionProps {
  onContinue: (forms: string[]) => void;
  onBack: () => void;
}

export function FormSelection({ onContinue, onBack }: FormSelectionProps) {
  const forms = [
    {
      id: "fda-1572",
      name: "FDA Form 1572",
      description: "Statement of Investigator - required for all clinical trials",
      required: true,
    },
    {
      id: "informed-consent",
      name: "Informed Consent Form",
      description: "Patient consent documentation with all required disclosures",
      required: true,
    },
    {
      id: "protocol",
      name: "Trial Protocol",
      description: "Complete study protocol with objectives and methodology",
      required: true,
    },
    {
      id: "irb-approval",
      name: "IRB Approval",
      description: "Institutional Review Board approval documentation",
      required: true,
    },
    {
      id: "investigator-brochure",
      name: "Investigator's Brochure",
      description: "Comprehensive information about the investigational product",
      required: false,
    },
    {
      id: "case-report-form",
      name: "Case Report Form",
      description: "Template for collecting patient data during the trial",
      required: false,
    },
  ];

  const [selectedForms, setSelectedForms] = useState<string[]>(
    forms.filter(f => f.required).map(f => f.id)
  );

  const handleFormToggle = (formId: string) => {
    setSelectedForms(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  const handleContinue = () => {
    onContinue(selectedForms);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Trial Import
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Select Required Forms
        </h2>
        <p className="text-lg text-gray-600">
          Choose the forms you need to complete for this clinical trial
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                id={form.id}
                checked={selectedForms.includes(form.id)}
                onChange={() => handleFormToggle(form.id)}
                disabled={form.required}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <label 
                    htmlFor={form.id} 
                    className="text-lg font-medium text-gray-900 cursor-pointer"
                  >
                    {form.name}
                  </label>
                  {form.required && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">
                  {form.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {selectedForms.length} forms selected
        </div>
        <button
          onClick={handleContinue}
          disabled={selectedForms.length === 0}
          className="bg-accent text-white py-2 px-6 rounded-lg bg-accent-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Workspace
        </button>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        <p className="text-sm">
          💡 <strong>AI Assistant:</strong> Ask me which forms are typically required for your specific trial type!
        </p>
      </div>
    </div>
  );
}
