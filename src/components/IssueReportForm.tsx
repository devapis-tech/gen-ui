"use client";

import { useState } from "react";
import { AlertTriangle, Send, X, Bug, AlertCircle, HelpCircle } from "lucide-react";

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

interface IssueReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: Omit<IssueReport, "id" | "timestamp" | "status">) => void;
  sourceContext?: {
    patientId?: string;
    formId?: string;
    visitId?: string;
    aeId?: string;
    documentId?: string;
    pageType?: string;
  };
}

export function IssueReportForm({ isOpen, onClose, onSubmit, sourceContext }: IssueReportFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium" as IssueReport["severity"],
    category: "bug" as IssueReport["category"],
    reporter: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        title: "",
        description: "",
        severity: "medium",
        category: "bug",
        reporter: ""
      });
      onClose();
    } catch (error) {
      console.error("Failed to submit issue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: IssueReport["severity"]) => {
    const colors = {
      low: "bg-gray-100 text-gray-800 border-gray-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      high: "bg-orange-100 text-orange-800 border-orange-300",
      critical: "bg-red-100 text-red-800 border-red-300"
    };
    return colors[severity];
  };

  const getCategoryIcon = (category: IssueReport["category"]) => {
    const icons = {
      bug: Bug,
      feature_request: HelpCircle,
      ui_issue: AlertCircle,
      performance: AlertTriangle,
      other: AlertCircle,
      data_query: AlertCircle,
      protocol_deviation: AlertTriangle,
      sae_escalation: AlertTriangle
    };
    return icons[category] || AlertCircle;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Report an Issue</h2>
              <p className="text-sm text-gray-500">Help us improve by reporting problems or suggesting features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the issue"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: "bug", label: "Bug", icon: Bug },
                { value: "feature_request", label: "Feature Request", icon: HelpCircle },
                { value: "ui_issue", label: "UI Issue", icon: AlertCircle },
                { value: "performance", label: "Performance", icon: AlertTriangle },
                { value: "data_query", label: "Data Query", icon: AlertCircle },
                { value: "protocol_deviation", label: "Protocol Deviation", icon: AlertTriangle },
                { value: "sae_escalation", label: "SAE Escalation", icon: AlertTriangle },
                { value: "other", label: "Other", icon: AlertCircle }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: value as IssueReport["category"] })}
                  className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
                    formData.category === value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Issue Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type Template
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { value: "data_query", label: "📋 Data Query", description: "Form field clarification" },
                { value: "protocol_deviation", label: "⚠️ Protocol Deviation", description: "Study protocol violation" },
                { value: "system_bug", label: "🐛 System Bug", description: "Technical issue or error" },
                { value: "feature_request", label: "💡 Feature Request", description: "New functionality suggestion" },
                { value: "sae_escalation", label: "🔴 SAE Escalation", description: "Serious adverse event reporting" }
              ].map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setFormData({ 
                      ...formData, 
                      category: value.replace("system_", "").replace("_escalation", "") as IssueReport["category"],
                      title: label.split(" ")[1] + " - " + description
                    });
                  }}
                  className="text-left p-3 border rounded-lg hover:border-accent hover:bg-accent/10 transition-colors"
                >
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Linked Entities */}
          {(sourceContext || Object.keys(sourceContext || {}).length > 0) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Entities (Context)
              </label>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">
                  {sourceContext?.patientId && <div>• Patient: {sourceContext.patientId}</div>}
                  {sourceContext?.formId && <div>• Form: {sourceContext.formId}</div>}
                  {sourceContext?.visitId && <div>• Visit: {sourceContext.visitId}</div>}
                  {sourceContext?.aeId && <div>• AE: {sourceContext.aeId}</div>}
                  {sourceContext?.documentId && <div>• Document: {sourceContext.documentId}</div>}
                  {!sourceContext || Object.keys(sourceContext).length === 0 && (
                    <div className="text-gray-400">No context available</div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: value as IssueReport["severity"] })}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${getSeverityColor(value as IssueReport["severity"])}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Detailed description of the issue. Include steps to reproduce if it's a bug."
              required
            />
          </div>

          {/* Reporter */}
          <div>
            <label htmlFor="reporter" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="reporter"
              value={formData.reporter}
              onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name or identifier"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Issue</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
