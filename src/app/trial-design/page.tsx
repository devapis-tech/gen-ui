"use client";

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { useState, useEffect } from "react";
import { useTrialDesignStore } from "@/lib/stores/trialDesignStore";
import { useUserRole } from "@/contexts/UserRoleContext";
import { TrialPhaseCard } from "@/components/trial-design/TrialPhaseCard";
import { EligibilityCriteria } from "@/components/trial-design/EligibilityCriteria";
import { VisitScheduleMatrix } from "@/components/trial-design/VisitScheduleMatrix";
import { EndpointsList } from "@/components/trial-design/EndpointsList";
import { TrialDesignData } from "@/lib/stores/trialDesignStore";

export default function TrialDesignPage() {
  const { trialData, updateTrialData, setTrialData } = useTrialDesignStore();
  const { userRole } = useUserRole();
  const [activeTab, setActiveTab] = useState("overview");
  const [enrolledPatients, setEnrolledPatients] = useState(100); // Mock enrolled patients count
  const [protocolDocuments, setProtocolDocuments] = useState<any[]>([]);

  // Add mock data for testing
  useEffect(() => {
    if (!trialData) {
      const mockTrialData: TrialDesignData = {
        nctId: "NCT07415044",
        protocolTitle: "LY4268989 in Adults With Moderately to Severely Active Ulcerative Colitis (EMERALD-3)",
        sponsorName: "Eli Lilly and Company",
        sponsorClass: "Industry",
        phase: "Phase 2",
        studyType: "Interventional",
        conditions: "Ulcerative Colitis (UC)",
        enrollmentCount: "1431",
        startDate: "2026-04-01",
        completionDate: "2031-07-31",
        overallStatus: enrolledPatients > 0 ? "RECRUITING" : "NOT_YET_RECRUITING",
        piName: "Dr. John Smith",
        piAffiliation: "Eli Lilly and Company",
        indNumber: "IND168420",
        studyDetails: {
          briefSummary: "The main purpose of this study is to evaluate the safety and effectiveness of LY4268989 when compared to placebo in adult participants with moderately to severely active ulcerative colitis (UC). The study drug will be administered orally.",
          detailedDescription: "A Randomized, Multicenter, Double-Blind, Placebo-Controlled Development Program to Evaluate the Efficacy and Safety of LY4268989 (MORF-057) for the Treatment of Adults With Moderately to Severely Active Ulcerative Colitis (EMERALD-3). The study will last up to approximately 108 weeks, excluding screening.",
          primaryOutcomes: [
            "Percentage of Participants Who Achieve Clinical Remission with Modified Mayo Score (mMS) - Week 10",
            "Percentage of Participants Who Achieve Clinical Remission with mMS Among Participants Who Achieved Clinical Response with LY4268989 at Week 10 - Week 52"
          ],
          secondaryOutcomes: [
            "Percentage of Participants Who Achieve Clinical Response with mMS - Week 10",
            "Percentage of Participants Who Achieve Symptomatic Response - Baseline Up to Week 8",
            "Pharmacokinetics (PK): Plasma Concentrations of LY4268989",
            "Safety Endpoint - Incidence of Treatment-Emergent Adverse Events"
          ]
        },
        eligibilityCriteria: {
          inclusion: [
            "Established diagnosis of UC for ≥3 months prior to randomization",
            "Moderately to severely active UC (mMS 5-9, ES ≥2, RB ≥1)",
            "Evidence of UC extending proximal to the rectum",
            "Surveillance colonoscopy within 1 year if UC >8 years",
            "Inadequate response to conventional or advanced therapy (excluding vedolizumab)",
            "Must meet contraception requirements"
          ],
          exclusion: [
            "Diagnosis of Crohn's disease, IBD unclassified, or PSC",
            "Inherited immunodeficiency syndrome",
            "Prior or planned bowel resection or major GI surgery",
            "Evidence of toxic megacolon, abscess, or stricture",
            "History of GI malignancy or any cancer within 5 years"
          ]
        },
        endpoints: [
          {
            id: "1",
            type: "primary",
            title: "Clinical Remission with mMS (Week 10)",
            description: "Percentage of participants who achieve clinical remission using the Modified Mayo Score at Week 10",
            timepoint: "Week 10",
            measurementMethod: "Modified Mayo Score (mMS)"
          },
          {
            id: "2",
            type: "primary",
            title: "Clinical Remission with mMS (Week 52)",
            description: "Percentage of participants who achieve clinical remission at Week 52 among responders at Week 10",
            timepoint: "Week 52",
            measurementMethod: "Modified Mayo Score (mMS)"
          },
          {
            id: "3",
            type: "secondary",
            title: "Clinical Response with mMS",
            description: "Percentage of participants who achieve clinical response with mMS at Week 10",
            timepoint: "Week 10",
            measurementMethod: "Modified Mayo Score (mMS)"
          }
        ]
      };
      setTrialData(mockTrialData);
    }
  }, [trialData, setTrialData, enrolledPatients]);

  // Fetch protocol documents from Documents Repository
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/documents?trial=${trialData?.nctId}`);
        if (response.ok) {
          const docs = await response.json();
          setProtocolDocuments(docs);
        } else {
          // Fallback to mock documents if API fails
          setProtocolDocuments([
            {
              id: "DOC-001",
              name: "Clinical Trial Protocol v2.1.pdf",
              type: "Protocol",
              url: "/documents/DOC-001"
            },
            {
              id: "DOC-002",
              name: "Investigator Brochure.pdf",
              type: "IB",
              url: "/documents/DOC-002"
            },
            {
              id: "DOC-003",
              name: "Informed Consent Form - Site A.docx",
              type: "ICF",
              url: "/documents/DOC-003"
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        // Fallback to mock documents
        setProtocolDocuments([
          {
            id: "DOC-001",
            name: "Clinical Trial Protocol v2.1.pdf",
            type: "Protocol",
            url: "/documents/DOC-001"
          },
          {
            id: "DOC-002",
            name: "Investigator Brochure.pdf",
            type: "IB",
            url: "/documents/DOC-002"
          }
        ]);
      }
    };

    if (trialData?.nctId) {
      fetchDocuments();
    }
  }, [trialData?.nctId]);

  // Role-based visibility for sensitive fields
  const canViewSensitive = userRole?.title === "ADMIN" || userRole?.badge === "INTERNAL TEAM";

  // Make trial data readable by CopilotKit
  useCopilotReadable({
    description: "Complete clinical trial design data including protocol information, eligibility criteria, visit schedule, and endpoints",
    value: trialData,
  });

  // AI action to update trial design
  useCopilotAction({
    name: "updateTrialDesign",
    description: "Update trial design data with new information",
    parameters: [
      { name: "field", description: "The field to update", type: "string", required: true },
      { name: "value", description: "The new value", type: "string", required: true },
    ],
    handler: async ({ field, value }: { field: string, value: string }) => {
      updateTrialData({ [field]: value });
      return `Updated ${field} with new value`;
    },
  });

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
            <p className="text-gray-600 mb-4">
              NCT ID: <a 
                href={`https://clinicaltrials.gov/study/${trialData.nctId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {trialData.nctId}
              </a>
            </p>

            {/* View Enrolled Patients Button */}
            <div className="mb-4">
              <a
                href={`/patients?trial=${trialData.nctId}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <span className="mr-2">👥</span>
                View {enrolledPatients} Enrolled Subjects →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Sponsor</p>
                <p className="font-medium">{canViewSensitive ? trialData.sponsorName : "••••••••••"}</p>
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
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${trialData.overallStatus === "RECRUITING"
                  ? "bg-green-100 text-green-800"
                  : trialData.overallStatus === "COMPLETED"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-yellow-100 text-yellow-800"
                  }`}>
                  {trialData.overallStatus}
                </span>
              </div>
            </div>

            {/* Trial Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Trial Progress</span>
                <span className="text-sm font-medium">{enrolledPatients}/{trialData.enrollmentCount} ({Math.round((enrolledPatients / parseInt(trialData.enrollmentCount)) * 100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((enrolledPatients / parseInt(trialData.enrollmentCount)) * 100, 100)}%` }}
                />
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
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
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
                    <dd className="text-sm font-medium">{canViewSensitive ? trialData.startDate : "••••••••"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Completion:</dt>
                    <dd className="text-sm font-medium">{canViewSensitive ? trialData.completionDate : "••••••••"}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Investigator</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Principal Investigator:</dt>
                    <dd className="text-sm font-medium">{canViewSensitive ? trialData.piName : "••••••••••"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Affiliation:</dt>
                    <dd className="text-sm font-medium">{canViewSensitive ? trialData.piAffiliation : "••••••••••"}</dd>
                  </div>
                  {trialData.indNumber && (
                    <div>
                      <dt className="text-sm text-gray-500">IND Number:</dt>
                      <dd className="text-sm font-medium">{canViewSensitive ? trialData.indNumber : "••••••••"}</dd>
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
            {protocolDocuments && protocolDocuments.length > 0 ? (
              <div className="space-y-3">
                {protocolDocuments.map((doc) => (
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
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No protocol documents uploaded yet.</p>
                <a
                  href="/documents"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Go to Documents Repository →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
