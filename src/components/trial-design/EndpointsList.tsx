"use client";

import { useState } from "react";
import { useTrialDesignStore } from "@/lib/stores/trialDesignStore";

export function EndpointsList() {
  const { trialData, addEndpoint, updateEndpoint, removeEndpoint } = useTrialDesignStore();
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'primary' | 'secondary'>('all');

  const mockEndpoints = [
    {
      id: "1",
      type: "primary" as const,
      title: "Change from Baseline in Efficacy Score at Week 52",
      description: "Mean change in the standardized efficacy assessment scale from baseline to week 52",
      timepoint: "Week 52",
      measurementMethod: "Standardized Efficacy Assessment Scale (SEAS)"
    },
    {
      id: "2", 
      type: "primary" as const,
      title: "Proportion of Participants Achieving Clinical Response",
      description: "Percentage of participants achieving predefined criteria for clinical response",
      timepoint: "Week 52",
      measurementMethod: "Clinical Response Criteria (CRC)"
    },
    {
      id: "3",
      type: "secondary" as const,
      title: "Change from Baseline in Quality of Life Score",
      description: "Mean change in quality of life assessment from baseline to each timepoint",
      timepoint: "Weeks 12, 24, 52",
      measurementMethod: "Quality of Life Index (QLI)"
    },
    {
      id: "4",
      type: "secondary" as const,
      title: "Time to First Clinical Response",
      description: "Time from randomization to first achievement of clinical response criteria",
      timepoint: "Throughout study",
      measurementMethod: "Kaplan-Meier survival analysis"
    },
    {
      id: "5",
      type: "secondary" as const,
      title: "Change from Baseline in Biomarker Levels",
      description: "Mean change in key biomarker concentrations from baseline",
      timepoint: "Weeks 12, 24, 52",
      measurementMethod: "ELISA assay"
    },
    {
      id: "6",
      type: "secondary" as const,
      title: "Safety Endpoint - Incidence of Treatment-Emergent Adverse Events",
      description: "Proportion of participants experiencing treatment-emerggent adverse events",
      timepoint: "Throughout study",
      measurementMethod: "MedDRA coding and CTCAE grading"
    }
  ];

  const currentEndpoints = trialData?.endpoints || mockEndpoints;

  const filteredEndpoints = currentEndpoints.filter(endpoint => 
    filter === 'all' || endpoint.type === filter
  );

  const handleAddEndpoint = () => {
    const newEndpoint = {
      id: Date.now().toString(),
      type: (prompt("Endpoint type (primary/secondary):") || "secondary") as 'primary' | 'secondary',
      title: prompt("Endpoint title:") || "New Endpoint",
      description: prompt("Endpoint description:") || "",
      timepoint: prompt("Assessment timepoint:") || "",
      measurementMethod: prompt("Measurement method:") || ""
    };
    addEndpoint(newEndpoint);
  };

  const handleUpdateEndpoint = (id: string, field: string, value: string) => {
    updateEndpoint(id, { [field]: field === 'type' ? value as 'primary' | 'secondary' : value });
  };

  const primaryEndpoints = currentEndpoints.filter(e => e.type === 'primary');
  const secondaryEndpoints = currentEndpoints.filter(e => e.type === 'secondary');

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Study Endpoints</h3>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'primary' | 'secondary')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Endpoints</option>
            <option value="primary">Primary Only</option>
            <option value="secondary">Secondary Only</option>
          </select>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            {isEditing ? "View Mode" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handleAddEndpoint}
              className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-800 border border-green-300 rounded-lg hover:bg-green-50"
            >
              + Add Endpoint
            </button>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <span className="text-2xl mb-2 block">🎯</span>
          <p className="font-medium text-blue-900">Total Endpoints</p>
          <p className="text-sm text-blue-700">{currentEndpoints.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <span className="text-2xl mb-2 block">🔥</span>
          <p className="font-medium text-green-900">Primary</p>
          <p className="text-sm text-green-700">{primaryEndpoints.length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <span className="text-2xl mb-2 block">📊</span>
          <p className="font-medium text-purple-900">Secondary</p>
          <p className="text-sm text-purple-700">{secondaryEndpoints.length}</p>
        </div>
      </div>

      {/* Primary Endpoints Section */}
      {(filter === 'all' || filter === 'primary') && primaryEndpoints.length > 0 && (
        <div className="mb-8">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Primary Endpoints
          </h4>
          <div className="space-y-4">
            {primaryEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="border border-green-200 rounded-lg bg-green-50 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={endpoint.title}
                        onChange={(e) => handleUpdateEndpoint(endpoint.id, 'title', e.target.value)}
                        className="w-full px-3 py-1 border border-green-300 rounded font-medium text-green-900"
                      />
                    ) : (
                      <h5 className="font-medium text-green-900">{endpoint.title}</h5>
                    )}
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    PRIMARY
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => removeEndpoint(endpoint.id)}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description:</p>
                    {isEditing ? (
                      <textarea
                        value={endpoint.description}
                        onChange={(e) => handleUpdateEndpoint(endpoint.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-green-300 rounded text-sm"
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{endpoint.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Assessment Timepoint:</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={endpoint.timepoint}
                          onChange={(e) => handleUpdateEndpoint(endpoint.id, 'timepoint', e.target.value)}
                          className="w-full px-2 py-1 border border-green-300 rounded text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{endpoint.timepoint}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Measurement Method:</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={endpoint.measurementMethod}
                          onChange={(e) => handleUpdateEndpoint(endpoint.id, 'measurementMethod', e.target.value)}
                          className="w-full px-2 py-1 border border-green-300 rounded text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{endpoint.measurementMethod}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Endpoints Section */}
      {(filter === 'all' || filter === 'secondary') && secondaryEndpoints.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Secondary Endpoints
          </h4>
          <div className="space-y-4">
            {secondaryEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="border border-purple-200 rounded-lg bg-purple-50 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={endpoint.title}
                        onChange={(e) => handleUpdateEndpoint(endpoint.id, 'title', e.target.value)}
                        className="w-full px-3 py-1 border border-purple-300 rounded font-medium text-purple-900"
                      />
                    ) : (
                      <h5 className="font-medium text-purple-900">{endpoint.title}</h5>
                    )}
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                    SECONDARY
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => removeEndpoint(endpoint.id)}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description:</p>
                    {isEditing ? (
                      <textarea
                        value={endpoint.description}
                        onChange={(e) => handleUpdateEndpoint(endpoint.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-purple-300 rounded text-sm"
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm text-gray-700">{endpoint.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Assessment Timepoint:</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={endpoint.timepoint}
                          onChange={(e) => handleUpdateEndpoint(endpoint.id, 'timepoint', e.target.value)}
                          className="w-full px-2 py-1 border border-purple-300 rounded text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{endpoint.timepoint}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Measurement Method:</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={endpoint.measurementMethod}
                          onChange={(e) => handleUpdateEndpoint(endpoint.id, 'measurementMethod', e.target.value)}
                          className="w-full px-2 py-1 border border-purple-300 rounded text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{endpoint.measurementMethod}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredEndpoints.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No endpoints found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}
