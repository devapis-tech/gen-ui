"use client";

import { useState } from "react";
import { ClinicalTrial } from "@/types/clinical-trial";

interface Patient {
  id: string;
  subjectId: string;
  initials: string;
  site: string;
  enrollmentDate: string;
  status: "SCREENING" | "ENROLLED" | "COMPLETED" | "WITHDRAWN";
  currentVisit: string;
  nextVisit: string;
}

interface VisitSchedule {
  id: string;
  visitNumber: string;
  visitName: string;
  windowStart: string;
  windowEnd: string;
  procedures: string[];
  status: "SCHEDULED" | "COMPLETED" | "MISSED" | "CANCELLED";
}

interface SafetyReport {
  id: string;
  patientId: string;
  reportType: "SAE" | "AE" | "ADVERSE_EVENT_OF_SPECIAL_INTEREST";
  severity: "MILD" | "MODERATE" | "SEVERE";
  description: string;
  onsetDate: string;
  status: "OPEN" | "CLOSED" | "FOLLOW_UP_REQUIRED";
}

interface PatientManagementProps {
  trialData: ClinicalTrial | null;
  onBack: () => void;
  onContinue: () => void;
}

type DataType = "ECFR" | "SAFETY" | "LIVE_MONITOR";

export function PatientManagement({ trialData, onBack, onContinue }: PatientManagementProps) {
  const [activeTab, setActiveTab] = useState<DataType>("ECFR");
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      subjectId: "SUBJ-001",
      initials: "JD",
      site: "Site A - Medical Center",
      enrollmentDate: "2024-01-15",
      status: "ENROLLED",
      currentVisit: "Week 12",
      nextVisit: "Week 16 (2024-04-15)"
    },
    {
      id: "2",
      subjectId: "SUBJ-002",
      initials: "AB",
      site: "Site B - Research Hospital",
      enrollmentDate: "2024-02-01",
      status: "SCREENING",
      currentVisit: "Screening",
      nextVisit: "Baseline (2024-02-15)"
    }
  ]);

  const [visitSchedules] = useState<VisitSchedule[]>([
    {
      id: "1",
      visitNumber: "VISIT-001",
      visitName: "Screening Visit",
      windowStart: "Day -28 to Day -1",
      windowEnd: "Day -1",
      procedures: ["Informed Consent", "Eligibility Assessment", "Baseline Labs", "ECG"],
      status: "COMPLETED"
    },
    {
      id: "2",
      visitNumber: "VISIT-002",
      visitName: "Baseline Visit",
      windowStart: "Day 0",
      windowEnd: "Day 3",
      procedures: ["Randomization", "Study Drug Administration", "Safety Assessment", "Questionnaires"],
      status: "SCHEDULED"
    },
    {
      id: "3",
      visitNumber: "VISIT-003",
      visitName: "Week 4 Visit",
      windowStart: "Day 28 ± 3 days",
      windowEnd: "Day 31",
      procedures: ["Study Drug Administration", "Safety Labs", "Adverse Event Review", "Compliance Check"],
      status: "SCHEDULED"
    }
  ]);

  const [safetyReports] = useState<SafetyReport[]>([
    {
      id: "1",
      patientId: "1",
      reportType: "AE",
      severity: "MILD",
      description: "Mild headache reported 2 days after study drug administration",
      onsetDate: "2024-01-17",
      status: "CLOSED"
    },
    {
      id: "2",
      patientId: "1",
      reportType: "SAE",
      severity: "MODERATE",
      description: "Hospitalization for pneumonia - unrelated to study drug",
      onsetDate: "2024-02-10",
      status: "OPEN"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ENROLLED":
      case "COMPLETED":
      case "SCHEDULED":
        return "bg-green-100 text-green-800";
      case "SCREENING":
      case "OPEN":
        return "bg-yellow-100 text-yellow-800";
      case "WITHDRAWN":
      case "MISSED":
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "MILD":
        return "bg-green-100 text-green-800";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-800";
      case "SEVERE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Trial Design
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Patient Management
        </h1>
        <p className="text-lg text-gray-600">
          Monitor patient visits, safety data, and live trial status
        </p>
      </div>

      {/* Data Type Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("ECFR")}
              className={`py-3 px-6 border-b-2 font-medium text-sm ${
                activeTab === "ECFR"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              eCFR/CFR Data
            </button>
            <button
              onClick={() => setActiveTab("SAFETY")}
              className={`py-3 px-6 border-b-2 font-medium text-sm ${
                activeTab === "SAFETY"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Safety & Adverse Events
            </button>
            <button
              onClick={() => setActiveTab("LIVE_MONITOR")}
              className={`py-3 px-6 border-b-2 font-medium text-sm ${
                activeTab === "LIVE_MONITOR"
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Live Monitor
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* eCFR/CFR Data Tab */}
          {activeTab === "ECFR" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">eCFR/CFR Visit Schedule</h3>
                <button className="px-4 py-2 bg-accent text-white rounded-lg bg-accent-hover text-sm">
                  Add Patient
                </button>
              </div>

              {/* Patients Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Total Enrolled</h4>
                  <p className="text-2xl font-bold text-accent">{patients.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Active Patients</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {patients.filter(p => p.status === "ENROLLED").length}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Screening</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    {patients.filter(p => p.status === "SCREENING").length}
                  </p>
                </div>
              </div>

              {/* Patients Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Initials
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Site
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Visit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Visit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {patient.subjectId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.initials}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.site}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.currentVisit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.nextVisit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-green-600 hover:text-green-900">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visit Schedule */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Visit Schedule Template</h4>
                <div className="space-y-4">
                  {visitSchedules.map((visit) => (
                    <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{visit.visitName}</h5>
                          <p className="text-sm text-gray-500">{visit.visitNumber}</p>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Visit Window</p>
                          <p className="text-sm text-gray-600">{visit.windowStart}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Procedures</p>
                          <ul className="text-sm text-gray-600">
                            {visit.procedures.map((proc, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                {proc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Safety & Adverse Events Tab */}
          {activeTab === "SAFETY" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Safety & Adverse Event Reporting</h3>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
                  Report New Event
                </button>
              </div>

              {/* Safety Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">SAEs</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {safetyReports.filter(r => r.reportType === "SAE").length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">AEs</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    {safetyReports.filter(r => r.reportType === "AE").length}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Open Reports</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    {safetyReports.filter(r => r.status === "OPEN").length}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Closed Reports</h4>
                  <p className="text-2xl font-bold text-gray-600">
                    {safetyReports.filter(r => r.status === "CLOSED").length}
                  </p>
                </div>
              </div>

              {/* Safety Reports Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Onset Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {safetyReports.map((report) => {
                      const patient = patients.find(p => p.id === report.patientId);
                      return (
                        <tr key={report.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            SAE-{report.id.padStart(4, '0')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient?.subjectId} ({patient?.initials})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              {report.reportType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(report.severity)}`}>
                              {report.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {report.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {report.onsetDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                              {report.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Review</button>
                            <button className="text-green-600 hover:text-green-900">Update</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Live Monitor Tab */}
          {activeTab === "LIVE_MONITOR" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Live Trial Monitor</h3>
                <div className="flex items-center space-x-2">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>

              {/* Live Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                  <h4 className="font-medium mb-2">Enrollment Rate</h4>
                  <p className="text-3xl font-bold mb-1">2.3</p>
                  <p className="text-sm opacity-90">patients/month</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                  <h4 className="font-medium mb-2">Retention Rate</h4>
                  <p className="text-3xl font-bold mb-1">94%</p>
                  <p className="text-sm opacity-90">of enrolled patients</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                  <h4 className="font-medium mb-2">Protocol Compliance</h4>
                  <p className="text-3xl font-bold mb-1">98%</p>
                  <p className="text-sm opacity-90">visit completion rate</p>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">SUBJ-001</span> completed Week 12 visit
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago - Site A</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        New SAE reported for <span className="font-medium">SUBJ-001</span>
                      </p>
                      <p className="text-xs text-gray-500">4 hours ago - Requires review</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">SUBJ-002</span> enrolled in study
                      </p>
                      <p className="text-xs text-gray-500">6 hours ago - Site B</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        Site C completed regulatory documentation
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Site Performance */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Site Performance</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Site A - Medical Center</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Enrolled:</span>
                        <span className="font-medium">8 patients</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active:</span>
                        <span className="font-medium text-green-600">7 patients</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compliance:</span>
                        <span className="font-medium">96%</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Site B - Research Hospital</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Enrolled:</span>
                        <span className="font-medium">5 patients</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active:</span>
                        <span className="font-medium text-green-600">4 patients</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compliance:</span>
                        <span className="font-medium">98%</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Site C - Clinical Center</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Enrolled:</span>
                        <span className="font-medium">3 patients</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active:</span>
                        <span className="font-medium text-green-600">3 patients</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compliance:</span>
                        <span className="font-medium">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Back to Trial Design
        </button>
        <button
          onClick={onContinue}
          className="px-6 py-2 bg-accent text-white rounded-lg bg-accent-hover"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
