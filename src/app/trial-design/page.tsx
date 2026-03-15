"use client";

// import { useCopilotReadable } from "@copilotkit/react-core";
// import { useCopilotAction } from "@copilotkit/react-core";
import { useState, useEffect } from "react";
import { useTrialDesignStore } from "@/lib/stores/trialDesignStore";
import { TrialPhaseCard } from "@/components/trial-design/TrialPhaseCard";
import { EligibilityCriteria } from "@/components/trial-design/EligibilityCriteria";
import { VisitScheduleMatrix } from "@/components/trial-design/VisitScheduleMatrix";
import { EndpointsList } from "@/components/trial-design/EndpointsList";
import { TrialDesignData } from "@/lib/stores/trialDesignStore";

export default function TrialDesignPage() {
  const { trialData, updateTrialData } = useTrialDesignStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Add mock data for testing
  useEffect(() => {
    if (!trialData) {
      const mockTrialData: TrialDesignData = {
        nctId: "NCT12345678",
        protocolTitle: "Randomized, Double-Blind, Placebo-Controlled Study of Investigational Drug",
        sponsorName: "Acme Pharmaceuticals",
        sponsorClass: "Industry",
        phase: "Phase 2",
        studyType: "Interventional",
        conditions: "Moderate to Severe Condition",
        enrollmentCount: "200",
        startDate: "2024-03-01",
        completionDate: "2026-12-31",
        overallStatus: "RECRUITING",
        piName: "Dr. John Smith",
        piAffiliation: "Medical Center Hospital",
        indNumber: "IND123456",
        studyDetails: {
          briefSummary: "This is a randomized, double-blind, placebo-controlled study to evaluate the efficacy and safety of investigational drug in patients with moderate to severe condition.",
          detailedDescription: "A comprehensive 52-week treatment period with 12-week follow-up to assess long-term outcomes.",
          primaryOutcomes: ["Change in efficacy score at Week 52", "Proportion of participants achieving clinical response"],
          secondaryOutcomes: ["Change in quality of life", "Time to first clinical response", "Safety endpoints"]
        }
      };
      updateTrialData(mockTrialData);
    }
  }, [trialData, updateTrialData]);

  // Make trial data readable by CopilotKit
  // useCopilotReadable({
  //   description: "Complete clinical trial design data including protocol information, eligibility criteria, visit schedule, and endpoints",
  //   value: trialData,
  // });

  // AI action to update trial design
  // useCopilotAction({
  //   name: "updateTrialDesign",
  //   description: "Update trial design data with new information",
  //   parameters: [
  //     { name: "field", description: "The field to update", type: "string", required: true },
  //     { name: "value", description: "The new value", type: "string", required: true },
  //   ],
  //   handler: async ({ field, value }) => {
  //     updateTrialData({ [field]: value });
  //     return `Updated ${field} with new value`;
  //   },
  // });

  if (!trialData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trial Design</h1>
          <p className="text-gray-500 mb-6">No trial data available. Please import trial data first.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              To get started, import a clinical trial using the NCT ID import feature.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "phase", label: "Phase & Design", icon: "⚗️" },
    { id: "eligibility", label: "Eligibility", icon: "👥" },
    { id: "visits", label: "Visit Schedule", icon: "📅" },
    { id: "endpoints", label: "Endpoints", icon: "🎯" },
    { id: "documents", label: "Documents", icon: "📄" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trial Design</h1>
        <p className="text-lg text-gray-600">Comprehensive view of the clinical trial protocol</p>
      </div>

      {/* Trial Header Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {trialData.protocolTitle}
            </h2>
            <p className="text-gray-600 mb-4">NCT ID: {trialData.nctId}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
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
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trial Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Study Details</h4>
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
                <h4 className="font-medium text-gray-900 mb-3">Investigator</h4>
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
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Brief Summary</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {trialData.studyDetails.briefSummary}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "phase" && <TrialPhaseCard trialData={trialData} />}
        
        {activeTab === "eligibility" && <EligibilityCriteria />}
        
        {activeTab === "visits" && <VisitScheduleMatrix />}
        
        {activeTab === "endpoints" && <EndpointsList />}
        
        {activeTab === "documents" && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Documents</h3>
            {trialData.protocolDocuments && trialData.protocolDocuments.length > 0 ? (
              <div className="space-y-3">
                {trialData.protocolDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📄</span>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No protocol documents uploaded yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
