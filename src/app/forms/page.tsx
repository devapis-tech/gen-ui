"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipboardList, CheckCircle, Clock, AlertCircle, ArrowRight, Search, Plus, Info, Filter, Users } from "lucide-react";
import { PatientSelector } from "@/components/patients/PatientSelector";
import { Patient } from "@/types/clinical-trial";

interface CRFForm {
    id: string;
    name: string;
    category: string;
    visit: string;
    completionRate: number;
    status: "COMPLETE" | "IN-PROGRESS" | "NOT-STARTED" | "REQUIRES-ATTENTION";
    hasQueries?: boolean;
}

const mockForms: CRFForm[] = [
    { id: "F001", name: "Demographics", category: "Screening", visit: "Screening", completionRate: 100, status: "COMPLETE" },
    { id: "F002", name: "Medical History", category: "Screening", visit: "Screening", completionRate: 100, status: "COMPLETE" },
    { id: "F003", name: "Vital Signs - Baseline", category: "Baseline", visit: "Baseline Visit", completionRate: 85, status: "IN-PROGRESS" },
    { id: "F004", name: "Physical Examination", category: "Baseline", visit: "Baseline Visit", completionRate: 0, status: "NOT-STARTED" },
    { id: "F005", name: "AE Reporting", category: "Safety", visit: "Safety (Ongoing)", completionRate: 40, status: "REQUIRES-ATTENTION", hasQueries: true },
];

export default function FormsPage() {
    const router = useRouter();
    const [forms] = useState(mockForms);
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patient');
    const visitId = searchParams.get('visit');
    
    const [contextInfo, setContextInfo] = useState<string>('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'category' | 'completion'>('category');

    useEffect(() => {
        if (patientId && visitId) {
            setContextInfo(`Patient ${patientId} - Visit ${visitId}`);
        } else if (patientId) {
            setContextInfo(`Patient ${patientId}`);
        }
    }, [patientId, visitId]);

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        router.push(`/forms?patient=${patient.id}${visitId ? `&visit=${visitId}` : ''}`);
    };

    const handleQueriesClick = () => {
        setStatusFilter('query');
    };

    const clearFilter = () => {
        setStatusFilter(null);
    };

    const handleOpenForm = (formId: string) => {
        const url = `/forms/${formId}${patientId ? `?patient=${patientId}` : ''}${visitId ? `&visit=${visitId}` : ''}`;
        router.push(url);
    };

    const handleVisitBadgeClick = (visit: string) => {
        if (selectedPatient) {
            router.push(`/visit-schedule?patient=${selectedPatient.id}&visit=${visit.toLowerCase().replace(' ', '-')}`);
        }
    };

    const handleAEClick = () => {
        router.push('/adverse-events?pending=true&form=F005');
    };

    const handleAssignToVisit = (formId: string) => {
        // Open assign modal logic here
        alert(`Assign form ${formId} to visit - this would open an assignment modal`);
    };

    const handleNewFormTemplate = () => {
        // Open AI-assisted form builder
        alert('AI-assisted form builder - this would open CopilotKit form builder');
    };

    const getSortedAndFilteredForms = () => {
        let filteredForms = forms;
        
        if (statusFilter === 'query') {
            filteredForms = forms.filter(form => form.hasQueries);
        }
        
        const sorted = [...filteredForms].sort((a, b) => {
            if (sortBy === 'completion') {
                return b.completionRate - a.completionRate;
            }
            return a.category.localeCompare(b.category);
        });
        
        return sorted;
    };

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
            {/* Patient Selector */}
            <div className="mb-6">
                <div className="flex items-center space-x-4">
                    <Users className="w-5 h-5 text-gray-500" />
                    <label className="text-sm font-medium text-gray-700">Select Subject:</label>
                    <div className="w-80">
                        <PatientSelector
                            selectedPatient={selectedPatient}
                            onPatientSelect={handlePatientSelect}
                            placeholder="Select Subject to view their forms..."
                        />
                    </div>
                </div>
            </div>

            {contextInfo && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium text-blue-900">Navigation Context</h3>
                            <p className="text-sm text-blue-700 mt-1">{contextInfo}</p>
                            <p className="text-xs text-blue-600 mt-2">
                                You've been redirected from the visit schedule. Forms below are filtered for this context.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">eCRF Forms Library</h1>
                    <p className="text-lg text-gray-600">Electronic Case Report Forms management and data entry</p>
                </div>
                <button 
                    onClick={handleNewFormTemplate}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold transition-all"
                >
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
                <div 
                    onClick={handleQueriesClick}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="bg-red-100 p-3 rounded-full"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Queries Pending</p>
                        <p className="text-2xl font-black">7</p>
                    </div>
                </div>
            </div>

            {/* Filter indicator */}
            {statusFilter && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">Showing forms with pending queries only</span>
                    </div>
                    <button 
                        onClick={clearFilter}
                        className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                    >
                        Clear Filter
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search forms..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="flex space-x-2">
                        <span className="text-xs text-gray-400 font-bold self-center">Sort by:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'category' | 'completion')}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="category">Category</option>
                            <option value="completion">Completion %</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-gray-100 font-bold">
                    {getSortedAndFilteredForms().map(form => (
                        <div key={form.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between group">
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

                                <div className="flex items-center space-x-6">
                                    {/* Visit Badge */}
                                    <div className="hidden md:block">
                                        <button
                                            onClick={() => handleVisitBadgeClick(form.visit)}
                                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                        >
                                            {form.visit}
                                        </button>
                                    </div>

                                    {/* Completion */}
                                    <div className="hidden md:block w-32">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] text-gray-500">Completion</span>
                                            <span className="text-[10px] text-gray-700">{form.completionRate}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1">
                                            <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${form.completionRate}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Status with Actions */}
                                    <div className="flex items-center space-x-3 min-w-[200px]">
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(form.status)}
                                            <span className="text-xs font-black tracking-tight">{form.status}</span>
                                        </div>
                                        
                                        {/* Action buttons based on status */}
                                        {form.status === 'REQUIRES-ATTENTION' && (
                                            <button
                                                onClick={handleAEClick}
                                                className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                                            >
                                                View AEs →
                                            </button>
                                        )}
                                        
                                        {form.status === 'NOT-STARTED' && (
                                            <button
                                                onClick={() => handleAssignToVisit(form.id)}
                                                className="text-xs border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                                            >
                                                + Assign to Visit
                                            </button>
                                        )}
                                    </div>

                                    {/* Open Form Button */}
                                    <button 
                                        onClick={() => handleOpenForm(form.id)}
                                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all flex items-center space-x-1 text-xs"
                                    >
                                        <span>Open Form</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
