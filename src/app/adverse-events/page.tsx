"use client";

import { useState } from "react";
import { AlertTriangle, Shield, Calendar, Filter, Download, Plus, Activity } from "lucide-react";

interface AdverseEvent {
    id: string;
    patientId: string;
    term: string;
    severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE-THREATENING";
    onset: string;
    status: "ONGOING" | "RESOLVED";
    reportedBy: string;
}

const mockEvents: AdverseEvent[] = [
    { id: "AE001", patientId: "S001", term: "Headache", severity: "MILD", onset: "2024-03-01", status: "RESOLVED", reportedBy: "Dr. Smith" },
    { id: "AE002", patientId: "S004", term: "Nausea", severity: "MODERATE", onset: "2024-03-05", status: "ONGOING", reportedBy: "Dr. Jones" },
    { id: "AE003", patientId: "S012", term: "Dizziness", severity: "SEVERE", onset: "2024-03-10", status: "ONGOING", reportedBy: "Dr. Smith" },
];

export default function AdverseEventsPage() {
    const [events] = useState<AdverseEvent[]>(mockEvents);

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
                        <div className="text-sm text-gray-500">Showing {events.length} reports</div>
                    </div>
                    <button className="flex items-center space-x-2 text-gray-600 border border-gray-300 px-3 py-1.5 rounded bg-white hover:bg-gray-50 text-sm">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adverse Event Term</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onset Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 font-bold">{event.patientId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.term}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getSeverityColor(event.severity)}`}>
                                        {event.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.onset}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${event.status === "RESOLVED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.reportedBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
