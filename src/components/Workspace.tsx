"use client";

import { useState } from "react";
import { ClinicalTrial } from "@/types/clinical-trial";

interface WorkspaceProps {
  trialData: ClinicalTrial | null;
  selectedForms: string[];
  onContinue: () => void;
  onBack: () => void;
}

export function Workspace({ trialData, selectedForms, onContinue, onBack }: WorkspaceProps) {
  const [fields, setFields] = useState({
    sponsorName: trialData?.sponsorName || "",
    sponsorClass: trialData?.sponsorClass || "",
    indNumber: trialData?.indNumber || "",
    nctId: trialData?.nctId || "",
    piName: trialData?.piName || "",
    piAffiliation: trialData?.piAffiliation || "",
    phase: trialData?.phase || "",
    studyType: trialData?.studyType || "",
    status: trialData?.overallStatus || "",
    enrollmentCount: trialData?.enrollmentCount || "",
    startDate: trialData?.startDate || "",
    completionDate: trialData?.completionDate || "",
    conditions: trialData?.conditions || "",
    protocolTitle: trialData?.protocolTitle || "",
  });

  // Copilot action to update form fields
  // useCopilotAction({
  //   name: "updateFormField",
  //   description: "Update a specific form field in the workspace",
  //   parameters: [
  //     {
  //       name: "fieldName",
  //       type: "string",
  //       description: "The name of the field to update",
  //       required: true,
  //     },
  //     {
  //       name: "value",
  //       type: "string",
  //       description: "The new value for the field",
  //       required: true,
  //     },
  //   ],
  //   handler: ({ fieldName, value }) => {
  //     if (fieldName in fields) {
  //       setFields(prev => ({ ...prev, [fieldName]: value }));
  //     }
  //   },
  //   render: "Updating form field...",
  // });

  // Copilot action to auto-fill missing fields
  // useCopilotAction({
  //   name: "autoFillFields",
  //   description: "Auto-fill missing form fields based on available trial data",
  //   parameters: [],
  //   handler: async () => {
  //     // In a real implementation, this would use AI to fill missing fields
  //     const updatedFields = { ...fields };
  //     
  //     // Example: Fill missing fields with AI suggestions
  //     if (!updatedFields.indNumber && updatedFields.nctId) {
  //       updatedFields.indNumber = "IND-" + updatedFields.nctId.slice(-6);
  //     }
  //     
  //     setFields(updatedFields);
  //   },
  //   render: "Auto-filling missing fields...",
  // });

  const handleFieldChange = (fieldName: string, value: string) => {
    setFields(prev => ({ ...prev, [fieldName]: value }));
  };

  const renderField = (label: string, fieldName: string, type: "text" | "textarea" = "text", full: boolean = false) => {
    const value = fields[fieldName as keyof typeof fields] || "";

    return (
      <div className={`${full ? "col-span-2" : ""}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Form Selection
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Form Workspace
        </h2>
        <p className="text-lg text-gray-600">
          Review and edit the extracted trial information
        </p>
        <div className="mt-2">
          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">
            {selectedForms.length} forms selected
          </span>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all"
          onClick={onContinue}>
          <h3 className="text-xl font-semibold mb-2">Trial Design</h3>
          <p className="text-blue-100 mb-4">View comprehensive trial design overview, protocol details, and study endpoints</p>
          <div className="flex items-center text-white">
            <span>View Design</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all"
          onClick={onContinue}>
          <h3 className="text-xl font-semibold mb-2">Patient Management</h3>
          <p className="text-green-100 mb-4">Monitor patient visits, safety data, and live trial status</p>
          <div className="flex items-center text-white">
            <span>Manage Patients</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Trial Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("Protocol Title", "protocolTitle", "textarea", true)}
            {renderField("Sponsor Name", "sponsorName")}
            {renderField("Sponsor Class", "sponsorClass")}
            {renderField("NCT ID", "nctId")}
            {renderField("IND Number", "indNumber")}
            {renderField("Principal Investigator", "piName")}
            {renderField("PI Affiliation", "piAffiliation")}
            {renderField("Phase", "phase")}
            {renderField("Study Type", "studyType")}
            {renderField("Overall Status", "status")}
            {renderField("Enrollment Count", "enrollmentCount")}
            {renderField("Start Date", "startDate")}
            {renderField("Completion Date", "completionDate")}
            {renderField("Conditions", "conditions")}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          All fields are editable. Ask the Multiplier Clinic Agent for help with any field.
        </div>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={onContinue}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Trial Design
          </button>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        <p className="text-sm">
          💡 <strong>Next Steps:</strong> Review your trial information, then proceed to Trial Design for detailed protocol overview or Patient Management for visit tracking and safety monitoring.
        </p>
      </div>
    </div>
  );
}
