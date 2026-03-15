"use client";

import { useState } from "react";
import { useTrialDesignStore } from "@/lib/stores/trialDesignStore";

export function EligibilityCriteria() {
  const { trialData, updateEligibilityCriteria } = useTrialDesignStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(["inclusion", "exclusion"]);
  const [isEditing, setIsEditing] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const mockInclusionCriteria = [
    "Established diagnosis of UC for ≥3 months prior to randomization",
    "Moderately to severely active UC (mMS 5-9, ES ≥2, RB ≥1)",
    "Evidence of UC extending proximal to the rectum",
    "Surveillance colonoscopy within 1 year if UC >8 years",
    "Inadequate response to conventional or advanced therapy (excluding vedolizumab)",
    "Must meet contraception requirements"
  ];

  const mockExclusionCriteria = [
    "Diagnosis of Crohn's disease, IBD unclassified, or PSC",
    "Inherited immunodeficiency syndrome",
    "Prior or planned bowel resection or major GI surgery",
    "Evidence of toxic megacolon, abscess, or stricture",
    "History of GI malignancy or any cancer within 5 years"
  ];

  const currentInclusionCriteria = trialData?.eligibilityCriteria?.inclusion || mockInclusionCriteria;
  const currentExclusionCriteria = trialData?.eligibilityCriteria?.exclusion || mockExclusionCriteria;

  const handleSaveCriteria = () => {
    updateEligibilityCriteria({
      inclusion: currentInclusionCriteria,
      exclusion: currentExclusionCriteria
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Eligibility Criteria</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="space-y-4">
        {/* Inclusion Criteria */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection("inclusion")}
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
          >
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <h4 className="font-medium text-gray-900">Inclusion Criteria</h4>
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                {currentInclusionCriteria.length} items
              </span>
            </div>
            <svg
              className={`w-5 h-5 transform transition-transform ${expandedSections.includes("inclusion") ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.includes("inclusion") && (
            <div className="px-4 pb-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentInclusionCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 mr-3 mt-0.5">{index + 1}.</span>
                    <p className="text-sm text-gray-700 flex-1">{criteria}</p>
                    {isEditing && (
                      <button
                        onClick={() => {
                          const updated = currentInclusionCriteria.filter((_, i) => i !== index);
                          updateEligibilityCriteria({
                            inclusion: updated,
                            exclusion: currentExclusionCriteria
                          });
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <button
                  onClick={() => {
                    const newCriteria = prompt("Enter new inclusion criteria:");
                    if (newCriteria) {
                      updateEligibilityCriteria({
                        inclusion: [...currentInclusionCriteria, newCriteria],
                        exclusion: currentExclusionCriteria
                      });
                    }
                  }}
                  className="mt-3 w-full p-2 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50"
                >
                  + Add Inclusion Criteria
                </button>
              )}
            </div>
          )}
        </div>

        {/* Exclusion Criteria */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection("exclusion")}
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
          >
            <div className="flex items-center">
              <span className="text-red-600 mr-2">✗</span>
              <h4 className="font-medium text-gray-900">Exclusion Criteria</h4>
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                {currentExclusionCriteria.length} items
              </span>
            </div>
            <svg
              className={`w-5 h-5 transform transition-transform ${expandedSections.includes("exclusion") ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSections.includes("exclusion") && (
            <div className="px-4 pb-4">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentExclusionCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                    <span className="text-red-600 mr-3 mt-0.5">{index + 1}.</span>
                    <p className="text-sm text-gray-700 flex-1">{criteria}</p>
                    {isEditing && (
                      <button
                        onClick={() => {
                          const updated = currentExclusionCriteria.filter((_, i) => i !== index);
                          updateEligibilityCriteria({
                            inclusion: currentInclusionCriteria,
                            exclusion: updated
                          });
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <button
                  onClick={() => {
                    const newCriteria = prompt("Enter new exclusion criteria:");
                    if (newCriteria) {
                      updateEligibilityCriteria({
                        inclusion: currentInclusionCriteria,
                        exclusion: [...currentExclusionCriteria, newCriteria]
                      });
                    }
                  }}
                  className="mt-3 w-full p-2 border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50"
                >
                  + Add Exclusion Criteria
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Eligibility Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <span className="text-2xl mb-2 block">👥</span>
            <p className="font-medium text-blue-900">Total Criteria</p>
            <p className="text-sm text-blue-700">{currentInclusionCriteria.length + currentExclusionCriteria.length} items</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <span className="text-2xl mb-2 block">✓</span>
            <p className="font-medium text-green-900">Inclusion</p>
            <p className="text-sm text-green-700">{currentInclusionCriteria.length} items</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <span className="text-2xl mb-2 block">✗</span>
            <p className="font-medium text-red-900">Exclusion</p>
            <p className="text-sm text-red-700">{currentExclusionCriteria.length} items</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCriteria}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
