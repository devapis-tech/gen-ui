"use client";

import { useState } from "react";
import { Patient } from "@/types/clinical-trial";
import { AdverseEvent } from "@/types/adverse-event";
import { FileText, AlertTriangle, Activity } from "lucide-react";

interface PatientDataTabsProps {
  patient: Patient;
}

type DataType = "ECFR" | "SAFETY" | "LIVE_MONITOR";

export function PatientDataTabs({ patient }: PatientDataTabsProps) {
  const [activeTab, setActiveTab] = useState<DataType>("ECFR");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "MISSED":
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Grade 1":
        return "bg-green-100 text-green-800";
      case "Grade 2":
        return "bg-yellow-100 text-yellow-800";
      case "Grade 3":
      case "Grade 4":
      case "Grade 5":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReportTypeColor = (serious: boolean) => {
    return serious ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("ECFR")}
            className={`py-3 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === "ECFR"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>eCRF/CFR Data</span>
          </button>
          <button
            onClick={() => setActiveTab("SAFETY")}
            className={`py-3 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === "SAFETY"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Safety & Adverse Events</span>
          </button>
          <button
            onClick={() => setActiveTab("LIVE_MONITOR")}
            className={`py-3 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === "LIVE_MONITOR"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Monitor</span>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {/* eCRF/CFR Data Tab */}
        {activeTab === "ECFR" && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit History</h3>
              <p className="text-sm text-gray-600">Complete visit schedule and form completion status</p>
            </div>

            {/* Visit History */}
            <div className="space-y-4">
              {patient.visitHistory?.map((visit) => (
                <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{visit.visitName}</h4>
                      <p className="text-sm text-gray-500">{visit.visitNumber}</p>
                      <p className="text-sm text-gray-600 mt-1">{visit.date}</p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(visit.status)}`}>
                      {visit.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {visit.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                        <p className="text-sm text-gray-600">{visit.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <p className="text-gray-500">No visit history available</p>
                </div>
              )}
            </div>

            {/* Vitals */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Vitals History</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Pressure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Heart Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Temperature
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Height
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patient.vitals?.map((vital) => (
                      <tr key={vital.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vital.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vital.bloodPressure}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vital.heartRate} bpm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vital.temperature}°F
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vital.weight} lbs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vital.height ? `${vital.height} in` : "N/A"}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No vitals recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Safety & Adverse Events Tab */}
        {activeTab === "SAFETY" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety & Adverse Events</h3>
                <p className="text-sm text-gray-600">Reported adverse events and safety monitoring</p>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
                Report New Event
              </button>
            </div>

            {/* Safety Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">SAEs</h4>
                <p className="text-2xl font-bold text-red-600">
                  {patient.adverseEvents?.filter(ae => ae.serious).length || 0}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">AEs</h4>
                <p className="text-2xl font-bold text-yellow-600">
                  {patient.adverseEvents?.filter(ae => !ae.serious).length || 0}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Open Reports</h4>
                <p className="text-2xl font-bold text-orange-600">
                  {patient.adverseEvents?.filter(ae => ae.followUpRequired).length || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Closed Reports</h4>
                <p className="text-2xl font-bold text-gray-600">
                  {patient.adverseEvents?.filter(ae => !ae.followUpRequired && ae.resolution !== null).length || 0}
                </p>
              </div>
            </div>

            {/* Adverse Events Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Name
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
                  {patient.adverseEvents?.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.eventName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getReportTypeColor(event.serious)}`}>
                          {event.serious ? "SAE" : "AE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {event.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.onset.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.followUpRequired ? "OPEN" : "CLOSED")}`}>
                          {event.followUpRequired ? "Follow Up Required" : "Closed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Review</button>
                        <button className="text-green-600 hover:text-green-900">Update</button>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        No adverse events reported
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Live Monitor Tab */}
        {activeTab === "LIVE_MONITOR" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Patient Monitor</h3>
                <p className="text-sm text-gray-600">Real-time patient status and compliance tracking</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>

            {/* Patient Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                <h4 className="font-medium mb-2">Visit Compliance</h4>
                <p className="text-3xl font-bold mb-1">
                  {patient.visitHistory ? Math.round((patient.visitHistory.filter(v => v.status === "COMPLETED").length / patient.visitHistory.length) * 100) : 0}%
                </p>
                <p className="text-sm opacity-90">of scheduled visits completed</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                <h4 className="font-medium mb-2">Days in Study</h4>
                <p className="text-3xl font-bold mb-1">
                  {Math.floor((Date.now() - new Date(patient.enrollmentDate).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-sm opacity-90">since enrollment</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                <h4 className="font-medium mb-2">Safety Score</h4>
                <p className="text-3xl font-bold mb-1">
                  {patient.adverseEvents && patient.adverseEvents.length > 0 
                    ? Math.max(0, 100 - (patient.adverseEvents.filter(ae => ae.severity === "Grade 4" || ae.severity === "Grade 5").length * 20) - (patient.adverseEvents.filter(ae => ae.severity === "Grade 3").length * 10))
                    : 100}
                </p>
                <p className="text-sm opacity-90">based on adverse events</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-4">
                {patient.visitHistory?.slice(-3).reverse().map((visit) => (
                  <div key={visit.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      visit.status === "COMPLETED" ? "bg-green-500" : 
                      visit.status === "MISSED" || visit.status === "CANCELLED" ? "bg-red-500" : "bg-blue-500"
                    }`}></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{visit.visitName}</span> {visit.status.toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500">{visit.date}</p>
                      {visit.notes && <p className="text-xs text-gray-600 mt-1">{visit.notes}</p>}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance Indicators */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Compliance Indicators</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Visit Adherence</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed Visits:</span>
                      <span className="font-medium">{patient.visitHistory?.filter(v => v.status === "COMPLETED").length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Missed Visits:</span>
                      <span className="font-medium text-red-600">{patient.visitHistory?.filter(v => v.status === "MISSED").length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Upcoming Visits:</span>
                      <span className="font-medium text-blue-600">{patient.visitHistory?.filter(v => v.status === "SCHEDULED").length || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Safety Monitoring</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total AEs:</span>
                      <span className="font-medium">{patient.adverseEvents?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Open Reports:</span>
                      <span className="font-medium text-orange-600">{patient.adverseEvents?.filter(ae => ae.followUpRequired).length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Assessment:</span>
                      <span className="font-medium">{patient.vitals?.[0]?.date || "No data"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
