"use client";

import { usePatient } from "@/lib/hooks/usePatient";
import { useCopilotReadable, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { PatientDataDashboard } from "@/components/chat-with-data/PatientDataDashboard";
import { Database, Download, Share2, Filter } from "lucide-react";

export default function ChatWithDataPage() {
    const { patients } = usePatient();

    // Make patient data available to the AI
    useCopilotReadable({
        description: "Full clinical trial dataset including patient demographics, enrollment status, adverse events, and visit adherence across all sites.",
        value: patients,
    });

    // Add chat suggestions
    useCopilotChatSuggestions({
        instructions: "Suggest questions about patient enrollment, safety signals, and visit compliance based on the current data dashboard.",
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
            {/* Header section with actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Database size={18} />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">EMERALD-3 Analytics</h1>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                        NCT07415044: LY4268989 Trial • Multiplier AI Internal Environment • User: Rahul
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-xs">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-xs">
                        <Share2 size={16} />
                        <span>Share</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-md">
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                <PatientDataDashboard />
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                <div className="flex items-center space-x-4">
                    <span>DATA SOURCE: CLINICAL_PRO_V4</span>
                    <span className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                        SYSTEM ACTIVE
                    </span>
                </div>
                <div>
                    LAST SYNC: {new Date().toLocaleTimeString()}
                </div>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
        </div>
    );
}
