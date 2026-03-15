"use client";

import { useState } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { ClinicalTrial, UserRole } from "@/types/clinical-trial";
import { RoleSelection } from "@/components/RoleSelection";
import { StatusSelection } from "@/components/StatusSelection";
import { TrialImport } from "@/components/TrialImport";
import { FormSelection } from "@/components/FormSelection";
import { Workspace } from "@/components/Workspace";
import { ReviewExport } from "@/components/ReviewExport";
import { TrialDesign } from "@/components/TrialDesign";
import { PatientManagement } from "@/components/PatientManagement";
import { useUserRole } from "@/contexts/UserRoleContext";
// import { ChatSidebar } from "@/components/ChatSidebar";

const roles: UserRole[] = [
  {
    id: "internal",
    title: "Internal Team",
    badge: "RESEARCH",
    description: "Manage, track, and coordinate clinical trial protocols and regulatory submissions.",
  },
  {
    id: "organization",
    title: "Organization",
    badge: "SPONSOR",
    description: "Institutional sponsors managing multi-site trials and regulatory compliance at scale.",
  },
  {
    id: "client",
    title: "Client",
    badge: "STAKEHOLDER",
    description: "External stakeholders reviewing trial summaries, data, and regulatory status.",
  },
];

type Step = "role" | "status" | "import" | "forms" | "workspace" | "trial_design" | "patient_management" | "review";

export default function Home() {
  const { userRole, setUserRole } = useUserRole();
  const [currentStep, setCurrentStep] = useState<Step>("role");
  const [trialData, setTrialData] = useState<ClinicalTrial | null>(null);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);

  // Make app state available to Copilot
  useCopilotReadable({
    description: "Current clinical trial workflow state",
    value: {
      currentStep,
      userRole,
      trialData,
      selectedForms,
    },
  });

  // Copilot action to navigate between steps
  useCopilotAction({
    name: "navigateToStep",
    description: "Navigate to a specific step in the clinical trial workflow",
    parameters: [
      {
        name: "step",
        type: "string",
        description: "The step to navigate to (role, status, import, forms, workspace, trial_design, patient_management, review)",
        required: true,
      },
    ],
    handler: ({ step }) => {
      if (["role", "status", "import", "forms", "workspace", "trial_design", "patient_management", "review"].includes(step)) {
        setCurrentStep(step as Step);
      }
    },
    render: "Navigating to workflow step...",
  });

  // Copilot action to update trial data
  useCopilotAction({
    name: "updateTrialData",
    description: "Update clinical trial data",
    parameters: [
      {
        name: "trialData",
        type: "object",
        description: "The clinical trial data to update",
        required: true,
      },
    ],
    handler: ({ trialData: newTrialData }) => {
      // Type assertion to handle CopilotKit's generic object type
      setTrialData(newTrialData as ClinicalTrial);
    },
    render: "Updating trial data...",
  });

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "role":
        return (
          <RoleSelection
            roles={roles}
            onSelectRole={(role) => {
              setUserRole(role);
              setCurrentStep("status");
            }}
          />
        );
      case "status":
        return (
          <StatusSelection
            selectedRole={userRole}
            onContinue={() => setCurrentStep("import")}
            onBack={() => setCurrentStep("role")}
          />
        );
      case "import":
        return (
          <TrialImport
            onTrialDataFetched={(data) => {
              setTrialData(data);
              setCurrentStep("forms");
            }}
            onBack={() => setCurrentStep("status")}
          />
        );
      case "forms":
        return (
          <FormSelection
            onContinue={(forms: string[]) => {
              setSelectedForms(forms);
              setCurrentStep("workspace");
            }}
            onBack={() => setCurrentStep("import")}
          />
        );
      case "workspace":
        return (
          <Workspace
            trialData={trialData}
            selectedForms={selectedForms}
            onContinue={() => setCurrentStep("trial_design")}
            onBack={() => setCurrentStep("forms")}
          />
        );
      case "trial_design":
        return (
          <TrialDesign
            trialData={trialData}
            onContinue={() => setCurrentStep("patient_management")}
            onBack={() => setCurrentStep("workspace")}
          />
        );
      case "patient_management":
        return (
          <PatientManagement
            trialData={trialData}
            onContinue={() => setCurrentStep("review")}
            onBack={() => setCurrentStep("trial_design")}
          />
        );
      case "review":
        return (
          <ReviewExport
            trialData={trialData}
            selectedForms={selectedForms}
            onBack={() => setCurrentStep("patient_management")}
          />
        );
      default:
        return <RoleSelection roles={roles} onSelectRole={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Clinical Trial Forms - AI Powered
            </h1>
            {userRole && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Role:</span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {userRole.badge}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderCurrentStep()}
      </main>

      {/* <ChatSidebar /> */}

      <CopilotPopup
        instructions="You are a helpful assistant for clinical trial forms. Help users navigate the workflow, extract trial data, and complete forms accurately."
        labels={{
          title: "Clinical Trial Assistant",
          initial: "Hi! I can help you complete your clinical trial forms. Just ask me anything!",
        }}
        defaultOpen={true}
        clickOutsideToClose={false}
      />
    </div>
  );
}
