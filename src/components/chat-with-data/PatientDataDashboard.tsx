"use client";

import { usePatient } from "@/lib/hooks/usePatient";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Users, Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface PatientDataDashboardProps {
    dateRange?: string;
}

export function PatientDataDashboard({ dateRange = '30' }: PatientDataDashboardProps) {
    const { patients } = usePatient();
    const router = useRouter();

    // Make live patient data available to the AI assistant
    useCopilotReadable({
        description: "Live list of all patients in the clinical trial",
        value: patients.map(p => {
            const completed = p.visitHistory?.filter(v => v.status === "COMPLETED").length || 0;
            const total = p.visitHistory?.length || 1;
            const compliance = `${Math.round((completed / total) * 100)}%`;
            return {
                id: p.subjectId,
                status: p.status,
                site: p.site,
                compliance,
                nextVisit: p.nextVisit,
                adverseEventsCount: p.adverseEvents?.length || 0
            };
        })
    });

    const totalPatients = patients.length;
    const enrolledCount = patients.filter(p => p.status === "ENROLLED").length;
    const compliantCount = patients.filter(p => {
        const completed = p.visitHistory?.filter(v => v.status === "COMPLETED").length || 0;
        const total = p.visitHistory?.length || 1;
        return (completed / total) >= 0.8;
    }).length;

    const totalAEs = patients.reduce((acc, p) => acc + (p.adverseEvents?.length || 0), 0);
    const totalSAEs = patients.reduce((acc, p) => acc + (p.adverseEvents?.filter(ae => ae.serious).length || 0), 0);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Patients</span>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-gray-900">{totalPatients}</span>
                        <span className="flex items-center text-xs font-semibold text-green-600 mb-1">
                            <TrendingUp size={14} className="mr-0.5" />
                            12%
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Compliance Rate</span>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-gray-900">{Math.round((compliantCount / totalPatients) * 100)}%</span>
                        <span className="flex items-center text-xs font-semibold text-green-600 mb-1">
                            <TrendingUp size={14} className="mr-0.5" />
                            5%
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active AEs</span>
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-gray-900">{totalAEs}</span>
                        <span className="flex items-center text-xs font-semibold text-red-600 mb-1">
                            <TrendingDown size={14} className="mr-0.5" />
                            -2
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Serious AE (SAE)</span>
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-gray-900">{totalSAEs}</span>
                        <span className="flex items-center text-xs font-semibold text-gray-400 mb-1">
                            Stable
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Charts / Data Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center">
                            <TrendingUp size={16} className="mr-2 text-blue-500" />
                            Patient Enrollment Trends
                        </h3>
                        <span className="text-[10px] text-gray-400 font-mono">LIVE FEED</span>
                    </div>
                    <div className="flex-1 p-6 flex items-center justify-center min-h-[300px]">
                        {/* Mock Chart Visualization */}
                        <div className="w-full h-full flex items-end justify-between space-x-2 px-4">
                            {[45, 60, 55, 75, 90, 85, 100, 110, 95, 120, 105, 130].map((val, i) => {
                                const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group">
                                        <div
                                            className="w-full bg-accent/80 hover:bg-accent transition-all rounded-t-sm relative group cursor-pointer hover:scale-105"
                                            style={{ height: `${val * 1.5}px` }}
                                            onClick={() => router.push(`/patients?enrolled_month=${month}`)}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {val} patients • {month}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-2 font-medium">
                                            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest flex items-center">
                            <Activity size={16} className="mr-2 text-green-500" />
                            Demographics
                        </h3>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center items-center">
                        <div className="relative w-40 h-40">
                            {/* Clickable donut segments */}
                            <div
                                className="absolute inset-0 rounded-full border-[12px] border-blue-500 cursor-pointer hover:opacity-80 transition-opacity group"
                                onClick={() => router.push('/patients?cohort=1')}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                                        Cohort 1 (45%)
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute inset-0 rounded-full border-[12px] border-green-400 border-t-transparent border-r-transparent -rotate-45 cursor-pointer hover:opacity-80 transition-opacity group"
                                onClick={() => router.push('/patients?cohort=2')}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                                        Cohort 2 (32%)
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute inset-0 rounded-full border-[12px] border-purple-400 border-t-transparent border-l-transparent border-b-transparent rotate-90 cursor-pointer hover:opacity-80 transition-opacity group"
                                onClick={() => router.push('/patients?cohort=3')}
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap">
                                        Cohort 3 (23%)
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-2xl font-bold text-gray-900">3</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter text-center leading-none">Cohorts</p>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-accent"></div>
                                <span className="text-xs text-gray-600">Cohort 1 (45%)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span className="text-xs text-gray-600">Cohort 2 (32%)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                <span className="text-xs text-gray-600">Cohort 3 (23%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid of Recent Actions / Data Points */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Recent Adverse Events</h3>
                        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700">VIEW ALL</button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {patients.flatMap(p => p.adverseEvents?.map(ae => ({ ...ae, patientId: p.subjectId })) || []).slice(0, 4).map((ae, i) => (
                            <div
                                key={i}
                                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => router.push(`/adverse-events?patient=${ae.patientId}&event=${ae.eventName}`)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${ae.serious ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                        <AlertTriangle size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{ae.eventName}</p>
                                        <p className="text-xs text-gray-500">{ae.patientId} • {ae.severity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-mono text-gray-400">{new Date(ae.onset).toLocaleDateString()}</span>
                                    <ArrowRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                        {totalAEs === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-gray-400 text-sm italic">No adverse events reported</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Upcoming Visits</h3>
                        <div className="flex items-center text-[10px] text-gray-400">
                            <Clock size={12} className="mr-1" />
                            NEXT 7 DAYS
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {patients.map(p => ({ subjectId: p.subjectId, nextVisit: p.nextVisit, site: p.site })).filter(p => p.nextVisit !== 'N/A').slice(0, 4).map((v, i) => (
                            <div
                                key={i}
                                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                                onClick={() => router.push(`/visit-schedule?patient=${v.subjectId}`)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tighter">{v.subjectId}</p>
                                        <p className="text-xs text-gray-500">{v.nextVisit}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{v.site.split('-')[0].trim()}</p>
                                    <ArrowRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
