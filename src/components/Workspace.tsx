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
          All fields are editable. Ask the AI assistant for help with any field.
        </div>
        <button
          onClick={onContinue}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue to Review
        </button>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        <p className="text-sm">
          💡 <strong>AI Assistant:</strong> I can help you fill in missing information, validate data, or suggest improvements. Just ask!
        </p>
      </div>
    </div>
  );
}
