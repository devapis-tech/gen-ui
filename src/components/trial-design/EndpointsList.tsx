"use client";

import { useState, useEffect } from "react";
import { useTrialDesignStore } from "@/lib/stores/trialDesignStore";

export function EndpointsList() {
  const { trialData, addEndpoint, updateEndpoint, removeEndpoint } = useTrialDesignStore();
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'primary' | 'secondary'>('all');
  const [liveMetrics, setLiveMetrics] = useState<{[key: string]: any}>({});

  const mockEndpoints = [
    {
      id: "1",
      type: "primary" as const,
      title: "Clinical Remission with mMS (Week 10)",
      description: "Percentage of participants who achieve clinical remission using the Modified Mayo Score at Week 10",
      timepoint: "Week 10",
      measurementMethod: "Modified Mayo Score (mMS)"
    },
    {
      id: "2",
      type: "primary" as const,
      title: "Clinical Remission with mMS (Week 52)",
      description: "Percentage of participants who achieve clinical remission at Week 52 among responders at Week 10",
      timepoint: "Week 52",
      measurementMethod: "Modified Mayo Score (mMS)"
    },
    {
      id: "3",
      type: "secondary" as const,
      title: "Clinical Response with mMS",
      description: "Percentage of participants who achieve clinical response with mMS at Week 10",
      timepoint: "Week 10",
      measurementMethod: "Modified Mayo Score (mMS)"
    },
    {
      id: "4",
      type: "secondary" as const,
      title: "Symptomatic Response",
      description: "Percentage of participants who achieve symptomatic response from baseline to week 8",
      timepoint: "Week 8",
      measurementMethod: "Symptomatic Response Assessment"
    },
    {
      id: "5",
      type: "secondary" as const,
      title: "Pharmacokinetics (PK)",
      description: "Plasma concentrations of LY4268989 throughout the study period",
      timepoint: "Baseline to Week 52",
      measurementMethod: "Plasma Concentration Analysis"
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

  // Fetch live metrics from analytics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/analytics/endpoints');
        if (response.ok) {
          const metrics = await response.json();
          setLiveMetrics(metrics);
        } else {
          // Fallback to mock metrics
          setLiveMetrics({
            "1": { currentRate: "12.5%", patients: 12, total: 96, trend: "+2.3%" },
            "2": { currentRate: "8.7%", patients: 8, total: 92, trend: "+1.1%" },
            "3": { currentRate: "23.4%", patients: 22, total: 94, trend: "+3.2%" }
          });
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        // Fallback to mock metrics
        setLiveMetrics({
          "1": { currentRate: "12.5%", patients: 12, total: 96, trend: "+2.3%" },
          "2": { currentRate: "8.7%", patients: 8, total: 92, trend: "+1.1%" },
          "3": { currentRate: "23.4%", patients: 22, total: 94, trend: "+3.2%" }
        });
      }
    };

    fetchMetrics();
  }, []);

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

                  {/* Live Metrics */}
                  {!isEditing && liveMetrics[endpoint.id] && (
                    <div className="mt-4 p-3 bg-white border border-green-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-600">Current Rate:</span>
                          <span className="ml-2 text-lg font-bold text-green-600">{liveMetrics[endpoint.id].currentRate}</span>
                          <span className={`ml-2 text-xs font-medium ${liveMetrics[endpoint.id].trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {liveMetrics[endpoint.id].trend}
                          </span>
                        </div>
                        <a
                          href="/chat-with-data?endpoint=primary"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View in Analytics →
                        </a>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {liveMetrics[endpoint.id].patients} of {liveMetrics[endpoint.id].total} patients
                      </div>
                    </div>
                  )}
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

                  {/* Live Metrics */}
                  {!isEditing && liveMetrics[endpoint.id] && (
                    <div className="mt-4 p-3 bg-white border border-purple-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-600">Current Rate:</span>
                          <span className="ml-2 text-lg font-bold text-purple-600">{liveMetrics[endpoint.id].currentRate}</span>
                          <span className={`ml-2 text-xs font-medium ${liveMetrics[endpoint.id].trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {liveMetrics[endpoint.id].trend}
                          </span>
                        </div>
                        <a
                          href="/chat-with-data?endpoint=secondary"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View in Analytics →
                        </a>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {liveMetrics[endpoint.id].patients} of {liveMetrics[endpoint.id].total} patients
                      </div>
                    </div>
                  )}
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
