"use client";

import { useState } from "react";
import { Bug } from "lucide-react";
import { IssueReportForm } from "./IssueReportForm";

interface IssueReport {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "bug" | "feature_request" | "ui_issue" | "performance" | "other" | "data_query" | "protocol_deviation" | "sae_escalation";
  reporter: string;
  timestamp: Date;
  status: "open" | "in_progress" | "resolved";
  linkedTo?: {
    patientId?: string;
    formId?: string;
    visitId?: string;
    aeId?: string;
    documentId?: string;
  };
  assignee?: string;
  dueDate?: Date;
  issueType?: "data_query" | "protocol_deviation" | "system_bug" | "feature_request" | "sae_escalation";
}

interface FloatingReportButtonProps {
  sourceContext?: {
    patientId?: string;
    formId?: string;
    visitId?: string;
    aeId?: string;
    documentId?: string;
    pageType?: string;
  };
}

export function FloatingReportButton({ sourceContext }: FloatingReportButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmitIssue = async (issueData: Omit<IssueReport, "id" | "timestamp" | "status">) => {
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...issueData,
          linkedTo: sourceContext || undefined,
        }),
      });

      if (response.ok) {
        // Success - issue submitted
        console.log("Issue submitted successfully");
      } else {
        console.error("Failed to submit issue");
      }
    } catch (error) {
      console.error("Failed to submit issue:", error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 group"
          title="Report an Issue"
        >
          <Bug className="w-5 h-5" />
          <span className="text-sm font-medium group-hover:opacity-100 opacity-90">Report Issue</span>
        </button>
      </div>

      {/* Issue Report Form */}
      <IssueReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitIssue}
        sourceContext={sourceContext}
      />
    </>
  );
}
