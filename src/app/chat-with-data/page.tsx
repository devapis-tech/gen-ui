"use client";

import { usePatient } from "@/lib/hooks/usePatient";
import { useCopilotReadable, useCopilotChatSuggestions } from "@copilotkit/react-core";
import { PatientDataDashboard } from "@/components/chat-with-data/PatientDataDashboard";
import { Database, Download, Share2, Filter, Calendar } from "lucide-react";
import { useState } from "react";

export default function ChatWithDataPage() {
    const { patients } = usePatient();
    const [dateRange, setDateRange] = useState('30'); // Default to last 30 days

    // Export functionality
    const handleExportPDF = () => {
        // Create a simple PDF export functionality
        const printContent = document.getElementById('dashboard-content');
        if (printContent) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>EMERALD-3 Analytics Report</title>
                            <style>
                                body { font-family: Arial, sans-serif; margin: 20px; }
                                .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                                .metric { margin: 10px 0; }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <h1>EMERALD-3 Analytics Report</h1>
                                <p>Generated: ${new Date().toLocaleDateString()}</p>
                                <p>Date Range: Last ${dateRange} days</p>
                            </div>
                            ${printContent.innerHTML}
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    const handleExportCSV = () => {
        // Create CSV export for patient data
        const csvContent = [
            ['Patient ID', 'Status', 'Cohort', 'Site', 'AE Count', 'SAE Count', 'Compliance Rate'],
            ...patients.map(p => [
                p.subjectId,
                p.status,
                p.cohort || 'N/A',
                p.site,
                p.adverseEvents?.length || 0,
                p.adverseEvents?.filter(ae => ae.serious).length || 0,
                `${Math.round(((p.visitHistory?.filter(v => v.status === "COMPLETED").length || 0) / (p.visitHistory?.length || 1)) * 100)}%`
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emerald3_analytics_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

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
                    {/* Date Range Filter */}
                    <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setDateRange('7')}
                            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                                dateRange === '7' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => setDateRange('30')}
                            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                                dateRange === '30' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Last 30 Days
                        </button>
                        <button
                            onClick={() => setDateRange('90')}
                            className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                                dateRange === '90' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Last 90 Days
                        </button>
                        <button className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 rounded transition-colors flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>Custom</span>
                        </button>
                    </div>

                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-xs">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-xs">
                        <Share2 size={16} />
                        <span>Share</span>
                    </button>
                    <div className="relative group">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-md">
                            <Download size={16} />
                            <span>Export Report</span>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <button
                                onClick={handleExportPDF}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-3 rounded-t-lg"
                            >
                                <Download size={14} />
                                <span>Export PDF Report</span>
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-3 rounded-b-lg border-t border-gray-100"
                            >
                                <Download size={14} />
                                <span>Export CSV Data</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div id="dashboard-content" className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                <PatientDataDashboard dateRange={dateRange} />
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
