"use client";

import { useState } from "react";
import { ClinicalTrial } from "@/types/clinical-trial";

interface TrialDesignProps {
  trialData: ClinicalTrial | null;
  onBack: () => void;
  onContinue: () => void;
}

export function TrialDesign({ trialData, onBack, onContinue }: TrialDesignProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview", "design"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  if (!trialData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">No trial data available. Please import trial data first.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-accent text-white rounded-lg bg-accent-hover"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="bg-accent text-white py-2 px-6 rounded-lg bg-accent-hover transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Workspace
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Trial Design Overview
        </h1>
        <p className="text-lg text-gray-600">
          Comprehensive view of the clinical trial design and protocol
        </p>
      </div>

      {/* Trial Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {trialData.protocolTitle}
            </h2>
            <p className="text-gray-600">NCT ID: {trialData.nctId}</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              trialData.overallStatus === "RECRUITING" 
                ? "bg-green-100 text-green-800"
                : trialData.overallStatus === "COMPLETED"
                ? "bg-gray-100 text-gray-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {trialData.overallStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Sponsor</p>
            <p className="font-medium">{trialData.sponsorName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phase</p>
            <p className="font-medium">{trialData.phase}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Study Type</p>
            <p className="font-medium">{trialData.studyType}</p>
          </div>
        </div>
      </div>

      {/* Trial Overview */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <button
          onClick={() => toggleSection("overview")}
          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold text-gray-900">Trial Overview</h3>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.includes("overview") ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.includes("overview") && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Study Details</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Conditions:</dt>
                    <dd className="text-sm font-medium">{trialData.conditions}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Enrollment:</dt>
                    <dd className="text-sm font-medium">{trialData.enrollmentCount} participants</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Start Date:</dt>
                    <dd className="text-sm font-medium">{trialData.startDate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Completion:</dt>
                    <dd className="text-sm font-medium">{trialData.completionDate}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Investigator</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Principal Investigator:</dt>
                    <dd className="text-sm font-medium">{trialData.piName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Affiliation:</dt>
                    <dd className="text-sm font-medium">{trialData.piAffiliation}</dd>
                  </div>
                  {trialData.indNumber && (
                    <div>
                      <dt className="text-sm text-gray-500">IND Number:</dt>
                      <dd className="text-sm font-medium">{trialData.indNumber}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {trialData.studyDetails?.briefSummary && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Brief Summary</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {trialData.studyDetails.briefSummary}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Study Design */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <button
          onClick={() => toggleSection("design")}
          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold text-gray-900">Study Design</h3>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.includes("design") ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.includes("design") && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Study Arms</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                    <span className="text-sm">Experimental Arm</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    <span className="text-sm">Placebo Control</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Randomization</h4>
                <p className="text-sm text-gray-600">1:1 Randomization</p>
                <p className="text-sm text-gray-600">Double-blind</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Duration</h4>
                <p className="text-sm text-gray-600">Treatment Period: 52 weeks</p>
                <p className="text-sm text-gray-600">Follow-up: 12 weeks</p>
              </div>
            </div>

            {trialData.studyDetails?.detailedDescription && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Detailed Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {trialData.studyDetails.detailedDescription}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Endpoints */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <button
          onClick={() => toggleSection("endpoints")}
          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold text-gray-900">Study Endpoints</h3>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.includes("endpoints") ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.includes("endpoints") && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Primary Endpoints</h4>
                {trialData.studyDetails?.primaryOutcomes && trialData.studyDetails.primaryOutcomes.length > 0 ? (
                  <ul className="space-y-2">
                    {trialData.studyDetails?.primaryOutcomes?.map((outcome, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No primary outcomes specified</p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Secondary Endpoints</h4>
                {trialData.studyDetails?.secondaryOutcomes && trialData.studyDetails.secondaryOutcomes.length > 0 ? (
                  <ul className="space-y-2">
                    {trialData.studyDetails?.secondaryOutcomes?.map((outcome, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No secondary outcomes specified</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <button
          onClick={() => toggleSection("timeline")}
          className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold text-gray-900">Study Timeline</h3>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              expandedSections.includes("timeline") ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSections.includes("timeline") && (
          <div className="px-6 pb-6">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-medium z-10">
                    1
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Screening Period</p>
                    <p className="text-sm text-gray-600">Up to 4 weeks</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-medium z-10">
                    2
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Randomization & Treatment</p>
                    <p className="text-sm text-gray-600">Week 0 - Week 52</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-medium z-10">
                    3
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Follow-up Period</p>
                    <p className="text-sm text-gray-600">Week 53 - Week 64</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium z-10">
                    ✓
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Study Completion</p>
                    <p className="text-sm text-gray-600">Final analysis and reporting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back to Workspace
        </button>
        <button
          onClick={onContinue}
          className="px-6 py-2 bg-accent text-white rounded-lg bg-accent-hover"
        >
          Continue to Subject Management
        </button>
      </div>
    </div>
  );
}
