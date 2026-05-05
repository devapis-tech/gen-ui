"use client";

import { useState } from "react";
import { AlertTriangle, Shield, Calendar, Filter, Download, Plus, Activity, AlertCircle } from "lucide-react";
import Link from "next/link";

interface AdverseEvent {
    id: string;
    patientId: string;
    term: string;
    severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE-THREATENING";
    onset: string;
    status: "ONGOING" | "RESOLVED";
    reportedBy: string;
    visit?: string;
}

// Helper function to normalize patient IDs
const normalizePatientId = (id: string): string => {
    return id.replace(/^S(\d+)$/, (_, n) => `EMR-${String(Number(n)).padStart(4, "0")}`);
};

// Generate comprehensive mock data (24 records)
const generateMockEvents = (): AdverseEvent[] => {
    const baseEvents = [
        { id: "AE001", patientId: "S001", term: "Headache", severity: "MILD" as const, onset: "2024-03-01", status: "RESOLVED" as const, reportedBy: "Dr. Smith", visit: "Week 4" },
        { id: "AE002", patientId: "S004", term: "Nausea", severity: "MODERATE" as const, onset: "2024-03-05", status: "ONGOING" as const, reportedBy: "Dr. Jones", visit: "Week 8" },
        { id: "AE003", patientId: "S012", term: "Dizziness", severity: "SEVERE" as const, onset: "2024-03-10", status: "ONGOING" as const, reportedBy: "Dr. Smith", visit: "Week 12" },
    ];
    
    // Generate additional mock events to reach 24 total
    const additionalEvents: AdverseEvent[] = [];
    const terms = ["Fatigue", "Insomnia", "Anxiety", "Back Pain", "Cough", "Fever", "Rash", "Constipation", "Diarrhea", "Vomiting"];
    const severities: ("MILD" | "MODERATE" | "SEVERE" | "LIFE-THREATENING")[] = ["MILD", "MODERATE", "SEVERE", "LIFE-THREATENING"];
    const statuses: ("ONGOING" | "RESOLVED")[] = ["ONGOING", "RESOLVED"];
    const visits = ["Week 2", "Week 4", "Week 6", "Week 8", "Week 10", "Week 12", "Week 16", "Week 20"];
    const reporters = ["Dr. Smith", "Dr. Jones", "Dr. Wilson", "Dr. Brown", "Dr. Davis"];
    
    for (let i = 4; i <= 24; i++) {
        const patientNum = ((i - 1) % 20) + 1;
        additionalEvents.push({
            id: `AE${String(i).padStart(3, "0")}`,
            patientId: `S${String(patientNum).padStart(3, "0")}`,
            term: terms[(i - 4) % terms.length],
            severity: severities[(i - 4) % severities.length],
            onset: `2024-03-${String((i % 28) + 1).padStart(2, "0")}`,
            status: statuses[(i - 4) % statuses.length],
            reportedBy: reporters[(i - 4) % reporters.length],
            visit: visits[(i - 4) % visits.length]
        });
    }
    
    return [...baseEvents, ...additionalEvents];
};

const mockEvents = generateMockEvents();

export default function AdverseEventsPage() {
    const [events] = useState<AdverseEvent[]>(mockEvents);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    
    // Calculate pagination
    const totalPages = Math.ceil(events.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEvents = events.slice(startIndex, endIndex);
    
    // Count SAEs (SEVERE and LIFE-THREATENING)
    const saeCount = events.filter(event => 
        event.severity === "SEVERE" || event.severity === "LIFE-THREATENING"
    ).length;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "MILD": return "bg-blue-100 text-blue-800";
            case "MODERATE": return "bg-yellow-100 text-yellow-800";
            case "SEVERE": return "bg-orange-100 text-orange-800";
            case "LIFE-THREATENING": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Safety & Adverse Events</h1>
                    <p className="text-lg text-gray-600">Track and manage safety reports across the trial</p>
                </div>
                <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    <Plus className="w-5 h-5" />
                    <span>Report New AE</span>
                </button>
            </div>

            {/* SAE Escalation Banner */}
            {saeCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-900">
                                    ⚠️ {saeCount} SAEs require immediate regulatory reporting
                                </h3>
                                <p className="text-red-700 mt-1">
                                    Serious Adverse Events detected. Immediate action required per protocol.
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                Start SAE Report
                            </button>
                            <button className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                                View Guidelines
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Total Reported</span>
                        <AlertTriangle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">24</div>
                    <div className="text-sm text-green-600 mt-1">↑ 2 from last week</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">Ongoing Cases</span>
                        <Activity className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <div className="text-sm text-orange-600 mt-1">4 High severity</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-sm font-medium">SAEs (Serious)</span>
                        <Shield className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-red-600 mt-1">Immediate reporting required</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 text-gray-600 border border-gray-300 px-3 py-1.5 rounded bg-white hover:bg-gray-50 text-sm">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <div className="text-sm text-gray-500">
                            Showing {startIndex + 1}-{Math.min(endIndex, events.length)} of {events.length} reports
                        </div>
                    </div>
                    <button className="flex items-center space-x-2 text-gray-600 border border-gray-300 px-3 py-1.5 rounded bg-white hover:bg-gray-50 text-sm">
                        <Download className="w-4 h-4" />
                        <span>Export All ({events.length}) CSV</span>
                    </button>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adverse Event Term</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onset Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentEvents.map((event) => (
                            <tr 
                                key={event.id} 
                                className={`hover:bg-gray-50 ${
                                    event.severity === "SEVERE" || event.severity === "LIFE-THREATENING" 
                                        ? "border-l-4 border-red-500" 
                                        : ""
                                }`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link 
                                        href={`/subjects/${normalizePatientId(event.patientId)}`}
                                        className="text-blue-600 underline hover:text-blue-800"
                                    >
                                        {normalizePatientId(event.patientId)}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.term}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getSeverityColor(event.severity)}`}>
                                        {event.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.onset}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {event.visit && (
                                        <Link 
                                            href={`/visit-schedule?patient=${normalizePatientId(event.patientId)}&visit=${event.visit.toLowerCase().replace(" ", "-")}`}
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            {event.visit}
                                        </Link>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                        event.status === "RESOLVED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.reportedBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
