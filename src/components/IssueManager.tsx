"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Bug, HelpCircle, AlertCircle, Plus, Search, Filter, CheckCircle, Clock, XCircle, X } from "lucide-react";
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

export function IssueManager() {
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Load issues from API on mount
  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/issues');
      if (response.ok) {
        const issueData = await response.json();
        // Convert string dates back to Date objects
        const issuesWithDates = issueData.map((issue: any) => ({
          ...issue,
          timestamp: new Date(issue.timestamp)
        }));
        setIssues(issuesWithDates);
      } else {
        console.error("Failed to load issues from API");
      }
    } catch (error) {
      console.error("Failed to load issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIssue = async (issueData: Omit<IssueReport, "id" | "timestamp" | "status">) => {
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        const newIssue = await response.json();
        // Convert timestamp back to Date object
        const newIssueWithDate = {
          ...newIssue,
          timestamp: new Date(newIssue.timestamp)
        };
        setIssues(prev => [newIssueWithDate, ...prev]);
      } else {
        console.error("Failed to submit issue");
      }
    } catch (error) {
      console.error("Failed to submit issue:", error);
    }
  };

  const updateIssueStatus = async (issueId: string, status: IssueReport["status"]) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedIssue = await response.json();
        // Convert timestamp back to Date object
        const updatedIssueWithDate = {
          ...updatedIssue,
          timestamp: new Date(updatedIssue.timestamp)
        };
        
        // Update local state
        setIssues(prev =>
          prev.map(issue =>
            issue.id === issueId ? updatedIssueWithDate : issue
          )
        );
      } else {
        console.error("Failed to update issue status");
      }
    } catch (error) {
      console.error("Failed to update issue status:", error);
    }
  };

  const deleteIssue = async (issueId: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state
        setIssues(prev => prev.filter(issue => issue.id !== issueId));
      } else {
        console.error("Failed to delete issue");
      }
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  };

  const getSeverityColor = (severity: IssueReport["severity"]) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800"
    };
    return colors[severity];
  };

  const getStatusColor = (status: IssueReport["status"]) => {
    const colors = {
      open: "bg-red-100 text-red-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800"
    };
    return colors[status];
  };

  const getStatusIcon = (status: IssueReport["status"]) => {
    const icons = {
      open: XCircle,
      in_progress: Clock,
      resolved: CheckCircle
    };
    return icons[status];
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

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || issue.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || issue.status === filterStatus;
    const matchesCategory = filterCategory === "all" || issue.category === filterCategory;

    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const getStats = () => {
    const total = issues.length;
    const open = issues.filter(i => i.status === "open").length;
    const inProgress = issues.filter(i => i.status === "in_progress").length;
    const resolved = issues.filter(i => i.status === "resolved").length;
    const critical = issues.filter(i => i.severity === "critical").length;

    return { total, open, inProgress, resolved, critical };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Issue Tracker</h1>
              <p className="text-gray-600 mt-2">Report and track issues, bugs, and feature requests</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Report Issue</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Open</p>
                  <p className="text-2xl font-bold text-red-600">{stats.open}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="bug">Bug</option>
                <option value="feature_request">Feature Request</option>
                <option value="ui_issue">UI Issue</option>
                <option value="performance">Performance</option>
                <option value="data_query">Data Query</option>
                <option value="protocol_deviation">Protocol Deviation</option>
                <option value="sae_escalation">SAE Escalation</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading issues...</h3>
              <p className="text-gray-500">Fetching issues from database</p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterSeverity !== "all" || filterStatus !== "all" || filterCategory !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Get started by reporting your first issue"}
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="w-4 h-4" />
                <span>Report Issue</span>
              </button>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const StatusIcon = getStatusIcon(issue.status);
              const CategoryIcon = getCategoryIcon(issue.category);
              
              return (
                <div key={issue.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CategoryIcon className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(issue.severity)}`}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status)}`}>
                          {issue.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{issue.description}</p>
                      
                      {/* Linked Entities */}
                      {issue.linkedTo && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {issue.linkedTo.patientId && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Subject: {issue.linkedTo.patientId}
                            </span>
                          )}
                          {issue.linkedTo.formId && (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Form: {issue.linkedTo.formId}
                            </span>
                          )}
                          {issue.linkedTo.visitId && (
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              Visit: {issue.linkedTo.visitId}
                            </span>
                          )}
                          {issue.linkedTo.aeId && (
                            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              AE: {issue.linkedTo.aeId}
                            </span>
                          )}
                          {issue.linkedTo.documentId && (
                            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Document: {issue.linkedTo.documentId}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>Category: {issue.category.replace("_", " ")}</span>
                          {issue.reporter && <span>Reporter: {issue.reporter}</span>}
                          {issue.assignee && <span>Assignee: {issue.assignee}</span>}
                          {issue.dueDate && <span>Due: {issue.dueDate.toLocaleDateString()}</span>}
                        </div>
                        <span>Created: {issue.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <select
                        value={issue.status}
                        onChange={(e) => updateIssueStatus(issue.id, e.target.value as IssueReport["status"])}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button
                        onClick={() => deleteIssue(issue.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Issue Report Form */}
        <IssueReportForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitIssue}
        />
      </div>
    </div>
  );
}
