"use client";

import { useState } from "react";
import { usePatient } from "@/lib/hooks/usePatient";
import { useUserRole } from "@/contexts/UserRoleContext";
import Link from "next/link";
import { User, Calendar, MapPin, ArrowRight, Search, Filter, X, Download, Plus, FileText, Activity, AlertTriangle, Radio } from "lucide-react";

export default function PatientsPage() {
  const { patients, getPatientsByStatus } = usePatient();
  const { userRole } = useUserRole();
  const isMonitor = userRole?.title === "MONITOR";
  
  // State for filtering and searching
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [trialArmFilter, setTrialArmFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ENROLLED":
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "SCREENING":
        return "bg-yellow-100 text-yellow-800";
      case "WITHDRAWN":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const enrolledPatients = getPatientsByStatus("ENROLLED");
  const screeningPatients = getPatientsByStatus("SCREENING");
  const completedPatients = getPatientsByStatus("COMPLETED");
  
  // Filter patients based on status, search, and trial arm
  const filteredPatients = patients.filter((patient: any) => {
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter.toUpperCase();
    const matchesSearch = searchQuery === "" || 
      patient.subjectId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.initials?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.site?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.trialArm?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrialArm = trialArmFilter === "" || patient.trialArm === trialArmFilter;
    
    return matchesStatus && matchesSearch && matchesTrialArm;
  });
  
  // Sort patients by enrollment date
  const sortedPatients = [...filteredPatients].sort((a: any, b: any) => {
    const dateA = new Date(a.enrollmentDate || 0).getTime();
    const dateB = new Date(b.enrollmentDate || 0).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
  
  // Get unique trial arms for filter options
  const uniqueTrialArms = Array.from(new Set(patients.map((p: any) => p.trialArm).filter(Boolean)));
  
  // Handle row click
  const handleRowClick = (patientId: string) => {
    window.location.href = `/patients/${patientId}`;
  };
  
  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Subject ID", "Initials", "Age", "Site", "Trial Arm", "Status", "Enrollment Date", "Current Visit"];
    const csvData = sortedPatients.map((patient: any) => [
      patient.subjectId,
      isMonitor ? "***" : patient.initials,
      patient.age || "N/A",
      patient.site,
      patient.trialArm || "N/A",
      patient.status,
      patient.enrollmentDate,
      patient.currentVisit
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
        <p className="text-lg text-gray-600">View and manage all enrolled patients across all trial sites</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Enrolled</p>
              <p className="text-3xl font-bold text-green-600">{enrolledPatients.length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Screening</p>
              <p className="text-3xl font-bold text-yellow-600">{screeningPatients.length}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <User className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-3xl font-bold text-blue-600">{completedPatients.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({patients.length})
          </button>
          <button
            onClick={() => setStatusFilter("enrolled")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === "enrolled"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Enrolled ({enrolledPatients.length})
          </button>
          <button
            onClick={() => setStatusFilter("screening")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === "screening"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Screening ({screeningPatients.length})
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed ({completedPatients.length})
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ID, initials, site, or trial arm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {trialArmFilter && (
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-sm">{trialArmFilter}</span>
              <button
                onClick={() => setTrialArmFilter("")}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {statusFilter === "all" ? "All Patients" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Patients`}
            <span className="ml-2 text-sm text-gray-500">({sortedPatients.length})</span>
          </h2>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

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
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trial Arm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  Enrollment Date {sortOrder === "asc" ? "↑" : "↓"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPatients.map((patient: any) => (
                <tr 
                  key={patient.id} 
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(patient.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.subjectId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isMonitor ? "***" : patient.initials}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.age || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {patient.site}
                    </div>
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hover:text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrialArmFilter(patient.trialArm);
                    }}
                  >
                    {patient.trialArm || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      <span title={patient.enrollmentDate}>
                        {patient.enrollmentDate ? new Date(patient.enrollmentDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.currentVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/visit-schedule?patient=${patient.id}`}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="Schedule"
                      >
                        <Calendar className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/forms?patient=${patient.id}`}
                        className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                        title="Forms"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/adverse-events?patient=${patient.id}`}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                        title="Adverse Events"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/live-monitor?patient=${patient.id}`}
                        className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
                        title="Live Monitor"
                      >
                        <Radio className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {sortedPatients.length} of {patients.length} patients
          {statusFilter !== "all" && ` (${statusFilter})`}
          {searchQuery && ` matching "${searchQuery}"`}
          {trialArmFilter && ` in ${trialArmFilter}`}
        </div>
        <div className="space-x-4">
          <Link
            href="/patients/enroll"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Enroll Patient
          </Link>
        </div>
      </div>
    </div>
  );
}
