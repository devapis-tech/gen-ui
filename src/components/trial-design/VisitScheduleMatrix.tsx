"use client";

import { useState } from "react";
import { useTrialDesignStore } from "@/lib/stores/trialDesignStore";

export function VisitScheduleMatrix() {
  const { trialData, addVisitSchedule, updateVisitSchedule, removeVisitSchedule } = useTrialDesignStore();
  const [isEditing, setIsEditing] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'day', direction: 'asc' as 'asc' | 'desc' });

  const mockVisitSchedule = [
    {
      id: "1",
      name: "Screening",
      day: -28,
      window: "Day -28 to -1",
      procedures: ["Informed Consent", "Medical History", "Physical Exam", "Lab Tests", "ECG", "Vital Signs"]
    },
    {
      id: "2",
      name: "Baseline/Randomization",
      day: 0,
      window: "Day 0",
      procedures: ["Randomization", "Study Drug Administration", "Lab Tests", "ECG", "Vital Signs", "Questionnaires"]
    },
    {
      id: "3",
      name: "Week 2 Visit",
      day: 14,
      window: "Day 14 ± 2 days",
      procedures: ["Study Drug Administration", "Lab Tests", "Vital Signs", "AE Assessment", "Medication Review"]
    },
    {
      id: "4",
      name: "Week 4 Visit",
      day: 28,
      window: "Day 28 ± 3 days",
      procedures: ["Study Drug Administration", "Lab Tests", "ECG", "Vital Signs", "AE Assessment", "Questionnaires"]
    },
    {
      id: "5",
      name: "Week 8 Visit",
      day: 56,
      window: "Day 56 ± 3 days",
      procedures: ["Study Drug Administration", "Lab Tests", "Vital Signs", "AE Assessment", "Medication Review"]
    },
    {
      id: "6",
      name: "Week 12 Visit",
      day: 84,
      window: "Day 84 ± 5 days",
      procedures: ["Study Drug Administration", "Lab Tests", "ECG", "Vital Signs", "AE Assessment", "Questionnaires"]
    },
    {
      id: "7",
      name: "Week 24 Visit",
      day: 168,
      window: "Day 168 ± 7 days",
      procedures: ["Study Drug Administration", "Lab Tests", "ECG", "Vital Signs", "AE Assessment", "Questionnaires"]
    },
    {
      id: "8",
      name: "Week 52 Visit (End of Treatment)",
      day: 364,
      window: "Day 364 ± 7 days",
      procedures: ["Study Drug Administration", "Lab Tests", "ECG", "Vital Signs", "AE Assessment", "Questionnaires", "Final Assessment"]
    },
    {
      id: "9",
      name: "Follow-up Week 4",
      day: 392,
      window: "Day 392 ± 7 days",
      procedures: ["Lab Tests", "ECG", "Vital Signs", "AE Assessment", "Safety Follow-up"]
    },
    {
      id: "10",
      name: "Follow-up Week 12",
      day: 448,
      window: "Day 448 ± 7 days",
      procedures: ["Lab Tests", "Vital Signs", "Final Safety Assessment", "Study Completion"]
    }
  ];

  const currentVisitSchedule = trialData?.visitSchedule || mockVisitSchedule;

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedVisits = [...currentVisitSchedule].sort((a, b) => {
    if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleAddVisit = () => {
    const newVisit = {
      id: Date.now().toString(),
      name: prompt("Visit name:") || "New Visit",
      day: parseInt(prompt("Visit day:") || "0"),
      window: prompt("Visit window:") || "Day 0",
      procedures: (prompt("Procedures (comma separated):") || "").split(",").map(p => p.trim()).filter(p => p)
    };
    addVisitSchedule(newVisit);
  };

  const handleUpdateVisit = (id: string, field: string, value: string) => {
    if (field === 'procedures') {
      value = value.split(",").map(p => p.trim()).filter(p => p).join(",");
    }
    updateVisitSchedule(id, { [field]: field === 'day' ? parseInt(value) : value });
  };

  const getVisitTypeColor = (day: number) => {
    if (day < 0) return 'bg-gray-100 text-gray-800'; // Screening
    if (day === 0) return 'bg-blue-100 text-blue-800'; // Baseline
    if (day <= 84) return 'bg-green-100 text-green-800'; // Early treatment
    if (day <= 364) return 'bg-yellow-100 text-yellow-800'; // Late treatment
    return 'bg-purple-100 text-purple-800'; // Follow-up
  };

  const getVisitTypeLabel = (day: number) => {
    if (day < 0) return 'Screening';
    if (day === 0) return 'Baseline';
    if (day <= 364) return 'Treatment';
    return 'Follow-up';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Visit Schedule Matrix</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            {isEditing ? "View Mode" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handleAddVisit}
              className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-800 border border-green-300 rounded-lg hover:bg-green-50"
            >
              + Add Visit
            </button>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <span className="text-xl mb-1 block">📅</span>
          <p className="font-medium text-blue-900 text-sm">Total Visits</p>
          <p className="text-sm text-blue-700">{currentVisitSchedule.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <span className="text-xl mb-1 block">⚗️</span>
          <p className="font-medium text-green-900 text-sm">Treatment Visits</p>
          <p className="text-sm text-green-700">{currentVisitSchedule.filter(v => v.day > 0 && v.day <= 364).length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <span className="text-xl mb-1 block">🔍</span>
          <p className="font-medium text-purple-900 text-sm">Screening</p>
          <p className="text-sm text-purple-700">{currentVisitSchedule.filter(v => v.day < 0).length}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <span className="text-xl mb-1 block">📊</span>
          <p className="font-medium text-orange-900 text-sm">Follow-up</p>
          <p className="text-sm text-orange-700">{currentVisitSchedule.filter(v => v.day > 364).length}</p>
        </div>
      </div>

      {/* Visit Schedule Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Visit Name
                  {sortConfig.key === 'name' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                onClick={() => handleSort('day')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Day
                  {sortConfig.key === 'day' && (
                    <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Window
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Procedures
              </th>
              {isEditing && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedVisits.map((visit) => (
              <tr key={visit.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={visit.name}
                      onChange={(e) => handleUpdateVisit(visit.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <div className="font-medium text-gray-900">{visit.name}</div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="number"
                      value={visit.day}
                      onChange={(e) => handleUpdateVisit(visit.id, 'day', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <div className="text-gray-900">Day {visit.day}</div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={visit.window}
                      onChange={(e) => handleUpdateVisit(visit.id, 'window', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <div className="text-sm text-gray-600">{visit.window}</div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getVisitTypeColor(visit.day)}`}>
                    {getVisitTypeLabel(visit.day)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {isEditing ? (
                    <textarea
                      value={visit.procedures.join(", ")}
                      onChange={(e) => handleUpdateVisit(visit.id, 'procedures', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      rows={2}
                    />
                  ) : (
                    <div className="text-sm text-gray-600">
                      {visit.procedures.slice(0, 3).map((proc, idx) => (
                        <div key={idx} className="mb-1">• {proc}</div>
                      ))}
                      {visit.procedures.length > 3 && (
                        <div className="text-gray-400">+{visit.procedures.length - 3} more...</div>
                      )}
                    </div>
                  )}
                </td>
                {isEditing && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => removeVisitSchedule(visit.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline Visualization */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Timeline Overview</h4>
        <div className="relative">
          <div className="absolute left-0 right-0 top-8 h-1 bg-gray-300"></div>
          <div className="flex justify-between relative">
            {sortedVisits.slice(0, 8).map((visit, index) => (
              <div key={visit.id} className="text-center flex-1">
                <div 
                  className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                    visit.day < 0 ? 'bg-gray-400' : 
                    visit.day === 0 ? 'bg-blue-500' : 
                    'bg-green-500'
                  }`}
                ></div>
                <div className="text-xs text-gray-600 font-medium">{visit.name}</div>
                <div className="text-xs text-gray-500">Day {visit.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
