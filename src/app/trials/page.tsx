"use client";

import { useState } from "react";
import Link from "next/link";
import { useCopilotReadable } from "@copilotkit/react-core";

// Mock trial data - in a real app, this would come from an API
const mockTrials = [
  {
    id: "NCT07415044",
    title: "LY4268989 in Adults With Moderately to Severely Active Ulcerative Colitis (EMERALD-3)",
    sponsor: "Eli Lilly and Company",
    phase: "Phase 2",
    status: "NOT_YET_RECRUITING",
    condition: "Ulcerative Colitis",
    enrollment: "1431",
    startDate: "2026-04-01",
    completionDate: "2031-07-31"
  },
  {
    id: "NCT04567890",
    title: "Novel Biologic Therapy for Moderate to Severe Crohn's Disease",
    sponsor: "Janssen Pharmaceuticals",
    phase: "Phase 3",
    status: "RECRUITING",
    condition: "Crohn's Disease",
    enrollment: "850",
    startDate: "2024-03-15",
    completionDate: "2028-12-31"
  },
  {
    id: "NCT03456789",
    title: "Gene Therapy Treatment for Rare Inherited Immunodeficiency",
    sponsor: "Genentech",
    phase: "Phase 1",
    status: "COMPLETED",
    condition: "Immunodeficiency",
    enrollment: "45",
    startDate: "2023-01-10",
    completionDate: "2025-06-30"
  },
  {
    id: "NCT02345678",
    title: "CAR-T Cell Therapy for Refractory Multiple Myeloma",
    sponsor: "Novartis",
    phase: "Phase 2",
    status: "RECRUITING",
    condition: "Multiple Myeloma",
    enrollment: "120",
    startDate: "2024-08-01",
    completionDate: "2027-03-31"
  },
  {
    id: "NCT01234567",
    title: "Oral Small Molecule for Rheumatoid Arthritis",
    sponsor: "Pfizer",
    phase: "Phase 3",
    status: "NOT_YET_RECRUITING",
    condition: "Rheumatoid Arthritis",
    enrollment: "2000",
    startDate: "2025-01-15",
    completionDate: "2029-08-31"
  }
];

export default function TrialsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Make trials data readable by CopilotKit
  useCopilotReadable({
    description: "List of available clinical trials with basic information",
    value: mockTrials,
  });

  // Filter trials based on search and status
  const filteredTrials = mockTrials.filter(trial => {
    const matchesSearch = trial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trial.sponsor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trial.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trial.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || trial.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clinical Trials</h1>
        <p className="text-lg text-gray-600">Browse and manage clinical trial protocols</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search trials by title, sponsor, condition, or NCT ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="RECRUITING">Recruiting</option>
              <option value="COMPLETED">Completed</option>
              <option value="NOT_YET_RECRUITING">Not Yet Recruiting</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trials List */}
      <div className="space-y-4">
        {filteredTrials.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No trials found matching your criteria.</p>
          </div>
        ) : (
          filteredTrials.map((trial) => (
            <Link
              key={trial.id}
              href={`/trials/${trial.id}`}
              className="block bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {trial.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">NCT ID: {trial.id}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Sponsor</p>
                      <p className="text-sm font-medium text-gray-900">{trial.sponsor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phase</p>
                      <p className="text-sm font-medium text-gray-900">{trial.phase}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Condition</p>
                      <p className="text-sm font-medium text-gray-900">{trial.condition}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Enrollment</p>
                      <p className="text-sm font-medium text-gray-900">{trial.enrollment} participants</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end ml-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mb-2 ${getStatusColor(trial.status)}`}>
                    {trial.status.replace("_", " ")}
                  </span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Showing {filteredTrials.length} of {mockTrials.length} trials
        </p>
      </div>
    </div>
  );
}
