"use client";

import { useState } from "react";
import { ClipboardList, CheckCircle, Clock, AlertCircle, ArrowRight, Search, Plus } from "lucide-react";

interface CRFForm {
    id: string;
    name: string;
    category: string;
    completionRate: number;
    status: "COMPLETE" | "IN-PROGRESS" | "NOT-STARTED" | "REQUIRES-ATTENTION";
}

const mockForms: CRFForm[] = [
    { id: "F001", name: "Demographics", category: "Screening", completionRate: 100, status: "COMPLETE" },
    { id: "F002", name: "Medical History", category: "Screening", completionRate: 100, status: "COMPLETE" },
    { id: "F003", name: "Vital Signs - Baseline", category: "Baseline", completionRate: 85, status: "IN-PROGRESS" },
    { id: "F004", name: "Physical Examination", category: "Baseline", completionRate: 0, status: "NOT-STARTED" },
    { id: "F005", name: "AE Reporting", category: "Safety", completionRate: 40, status: "REQUIRES-ATTENTION" },
];

export default function FormsPage() {
    const [forms] = useState(mockForms);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETE": return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "IN-PROGRESS": return <Clock className="w-5 h-5 text-blue-500" />;
            case "REQUIRES-ATTENTION": return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <ClipboardList className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">eCRF Forms Library</h1>
                    <p className="text-lg text-gray-600">Electronic Case Report Forms management and data entry</p>
                </div>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold transition-all">
                    <Plus className="w-5 h-5" />
                    <span>New Form Template</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-bold">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Completed Forms</p>
                        <p className="text-2xl font-black">124</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full"><Clock className="w-6 h-6 text-blue-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">In Progress</p>
                        <p className="text-2xl font-black">18</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Queries Pending</p>
                        <p className="text-2xl font-black">7</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search forms..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="flex space-x-2">
                        <span className="text-xs text-gray-400 font-bold self-center">Sort by: Category</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-gray-100 font-bold">
                    {forms.map(form => (
                        <div key={form.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <ClipboardList className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{form.name}</h3>
                                    <div className="flex items-center space-x-2 mt-0.5">
                                        <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded tracking-tight">{form.category}</span>
                                        <span className="text-[10px] text-gray-400">• Form ID: {form.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-8">
                                <div className="hidden md:block w-32">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] text-gray-500">Completion</span>
                                        <span className="text-[10px] text-gray-700">{form.completionRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                        <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${form.completionRate}%` }}></div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 min-w-[120px]">
                                    {getStatusIcon(form.status)}
                                    <span className="text-xs font-black tracking-tight">{form.status}</span>
                                </div>

                                <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all flex items-center space-x-1 text-xs">
                                    <span>Open Form</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
