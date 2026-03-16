"use client";

import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Extended mock trial data with details
const mockTrialDetails: Record<string, any> = {
  "NCT07415044": {
    id: "NCT07415044",
    protocolTitle: "LY4268989 in Adults With Moderately to Severely Active Ulcerative Colitis (EMERALD-3)",
    sponsorName: "Eli Lilly and Company",
    sponsorClass: "Industry",
    phase: "Phase 2",
    studyType: "Interventional",
    conditions: "Ulcerative Colitis (UC)",
    enrollmentCount: "1431",
    startDate: "2026-04-01",
    completionDate: "2031-07-31",
    overallStatus: "NOT_YET_RECRUITING",
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
  },
  "NCT04567890": {
    id: "NCT04567890",
    protocolTitle: "Novel Biologic Therapy for Moderate to Severe Crohn's Disease",
    sponsorName: "Janssen Pharmaceuticals",
    sponsorClass: "Industry",
    phase: "Phase 3",
    studyType: "Interventional",
    conditions: "Crohn's Disease",
    enrollmentCount: "850",
    startDate: "2024-03-15",
    completionDate: "2028-12-31",
    overallStatus: "RECRUITING",
    piName: "Dr. Sarah Johnson",
    piAffiliation: "Mayo Clinic",
    indNumber: "IND142567",
    studyDetails: {
      briefSummary: "This study evaluates the efficacy and safety of a novel biologic therapy in patients with moderate to severe Crohn's disease who have inadequate response to conventional therapy.",
      detailedDescription: "A multicenter, randomized, double-blind, placebo-controlled Phase 3 study to evaluate the efficacy and safety of novel biologic therapy for induction and maintenance of remission in patients with moderate to severe Crohn's disease.",
      primaryOutcomes: [
        "Clinical remission at Week 12",
        "Endoscopic remission at Week 52"
      ],
      secondaryOutcomes: [
        "Clinical response at Week 12",
        "Corticosteroid-free remission at Week 52",
        "Health-related quality of life improvements",
        "Safety and tolerability assessment"
      ]
    },
    eligibilityCriteria: {
      inclusion: [
        "Age 18-75 years",
        "Confirmed diagnosis of Crohn's disease ≥3 months",
        "Moderate to severe disease activity (CDAI 220-450)",
        "Inadequate response to conventional therapy",
        "Ability to provide informed consent"
      ],
      exclusion: [
        "Previous exposure to this biologic agent",
        "Active severe infection",
        "History of malignancy within 5 years",
        "Pregnancy or breastfeeding"
      ]
    },
    endpoints: [
      {
        id: "1",
        type: "primary",
        title: "Clinical Remission (Week 12)",
        description: "Proportion of patients achieving CDAI <150 at Week 12",
        timepoint: "Week 12",
        measurementMethod: "Crohn's Disease Activity Index (CDAI)"
      }
    ]
  }
};

export default function TrialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trialId = params.id as string;
  const [trialData, setTrialData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch trial data
    const fetchTrialData = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = mockTrialDetails[trialId];
      if (data) {
        setTrialData(data);
      }
      setLoading(false);
    };

    fetchTrialData();
  }, [trialId]);

  // Make trial data readable by CopilotKit
  useCopilotReadable({
    description: "Detailed clinical trial information including protocol, eligibility, and endpoints",
    value: trialData,
  });

  // AI action to update trial design
  useCopilotAction({
    name: "updateTrialDetail",
    description: "Update trial detail information",
    parameters: [
      { name: "field", description: "The field to update", type: "string", required: true },
      { name: "value", description: "The new value", type: "string", required: true },
    ],
    handler: async ({ field, value }: { field: string, value: string }) => {
      if (trialData) {
        setTrialData({ ...trialData, [field]: value });
        return `Updated ${field} with new value`;
      }
      return "No trial data available";
    },
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading trial details...</p>
        </div>
      </div>
    );
  }

  if (!trialData) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trial Not Found</h1>
          <p className="text-gray-500 mb-6">The trial with ID {trialId} was not found.</p>
          <Link
            href="/trials"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Trials
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "details", label: "Study Details", icon: "🔬" },
    { id: "eligibility", label: "Eligibility", icon: "👥" },
    { id: "endpoints", label: "Endpoints", icon: "🎯" },
    { id: "timeline", label: "Timeline", icon: "📅" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECRUITING":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "NOT_YET_RECRUITING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link
            href="/trials"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Trials
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trial Details</h1>
        <p className="text-lg text-gray-600">Comprehensive view of the clinical trial protocol</p>
      </div>

      {/* Trial Header Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {trialData.protocolTitle}
            </h2>
            <p className="text-gray-600 mb-4">NCT ID: {trialData.id}</p>

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
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trialData.overallStatus)}`}>
                  {trialData.overallStatus.replace("_", " ")}
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

        {activeTab === "details" && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Details</h3>
            
            {trialData.studyDetails?.detailedDescription && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Detailed Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {trialData.studyDetails.detailedDescription}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Primary Outcomes</h4>
                <ul className="space-y-2">
                  {trialData.studyDetails?.primaryOutcomes?.map((outcome: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Secondary Outcomes</h4>
                <ul className="space-y-2">
                  {trialData.studyDetails?.secondaryOutcomes?.map((outcome: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "eligibility" && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Criteria</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-700 mb-3">Inclusion Criteria</h4>
                <ul className="space-y-2">
                  {trialData.eligibilityCriteria?.inclusion?.map((criterion: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-700 mb-3">Exclusion Criteria</h4>
                <ul className="space-y-2">
                  {trialData.eligibilityCriteria?.exclusion?.map((criterion: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "endpoints" && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Endpoints</h3>
            
            <div className="space-y-4">
              {trialData.endpoints?.map((endpoint: any) => (
                <div key={endpoint.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{endpoint.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      endpoint.type === "primary" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {endpoint.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Timepoint:</span>
                      <span className="ml-2 font-medium">{endpoint.timepoint}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Method:</span>
                      <span className="ml-2 font-medium">{endpoint.measurementMethod}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Timeline</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Study Start</p>
                  <p className="text-sm text-gray-600">{trialData.startDate}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-4 h-4 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Estimated Completion</p>
                  <p className="text-sm text-gray-600">{trialData.completionDate}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Current Status</p>
                  <p className="text-sm text-gray-600">{trialData.overallStatus.replace("_", " ")}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
