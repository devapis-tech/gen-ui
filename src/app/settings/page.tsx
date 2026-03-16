"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Shield, User, Database, Globe, Save, Users, Clock, Key, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { UserRole } from "@/types/clinical-trial";

export default function SettingsPage() {
    const { userRole, setUserRole } = useUserRole();
    const [selectedRole, setSelectedRole] = useState(userRole?.id || "");
    const [ecrfValidation, setEcrfValidation] = useState(true);
    const [realtimeMonitoring, setRealtimeMonitoring] = useState(false);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(true);
    const [monthlyReports, setMonthlyReports] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: "Rahul Multiplier", email: "rahul@multiplier.ai" });

    const availableRoles: UserRole[] = [
        {
            id: "internal",
            title: "Internal Team",
            badge: "RESEARCH",
            description: "Manage, track, and coordinate clinical trial protocols and regulatory submissions.",
        },
        {
            id: "organization",
            title: "Organization",
            badge: "SPONSOR",
            description: "Institutional sponsors managing multi-site trials and regulatory compliance at scale.",
        },
        {
            id: "client",
            title: "Client",
            badge: "STAKEHOLDER",
            description: "External stakeholders reviewing trial summaries, data, and regulatory status.",
        },
    ];

    const handleRoleChange = (roleId: string) => {
        setSelectedRole(roleId);
        const role = availableRoles.find(r => r.id === roleId);
        if (role) {
            setUserRole(role);
            setHasChanges(true);
        }
    };

    const handleSaveSettings = () => {
        setShowSaveConfirm(true);
        setTimeout(() => {
            setShowSaveConfirm(false);
            setHasChanges(false);
        }, 2000);
    };

    const handleDiscardChanges = () => {
        if (hasChanges) {
            // Reset to original values
            setEcrfValidation(true);
            setRealtimeMonitoring(false);
            setEmailAlerts(true);
            setSmsNotifications(true);
            setMonthlyReports(false);
            setSelectedRole(userRole?.id || "");
            setHasChanges(false);
        }
    };

    // Track changes
    useEffect(() => {
        setHasChanges(true);
    }, [ecrfValidation, realtimeMonitoring, emailAlerts, smsNotifications, monthlyReports]);
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
                <p className="text-lg text-gray-600">Configure trial parameters, user permissions, and notifications</p>
            </div>

            <div className="space-y-6">
                {/* Success Message */}
                {showSaveConfirm && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">Settings saved successfully!</span>
                    </div>
                )}

                {/* Active Trial Section */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-2">Active Trial</h3>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">EMERALD-3 — LY4268989 in Adults With UC</h2>
                                <p className="text-sm text-gray-600 mb-3">NCT07415044 · Phase 2 · Eli Lilly · Status: NOT_YET_RECRUITING</p>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                                    <span>View Trial Design</span>
                                    <span>→</span>
                                </button>
                            </div>
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                CURRENT
                            </div>
                        </div>
                    </div>
                </section>
                {/* Profile Section */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-500" />
                        <h2 className="font-bold text-gray-900">User Profile</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1">Full Name</label>
                                <input type="text" value={currentUser.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1">Email Address</label>
                                <input type="email" value={currentUser.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-gray-400 uppercase">Active Role</span>
                                    <p className="font-medium text-gray-900">{userRole?.title || 'Internal Team'}</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Change Role</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Roles Section (Admin Only) */}
                {selectedRole === 'internal' && (
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-gray-500" />
                                <h2 className="font-bold text-gray-900">Team Roles</h2>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Invite Team Member</button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">RM</div>
                                        <div>
                                            <p className="font-medium text-gray-900">Rahul M.</p>
                                            <p className="text-sm text-gray-500">rahul@multiplier.ai</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Administrator</span>
                                        <span className="text-green-600">✓</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium text-sm">SJ</div>
                                        <div>
                                            <p className="font-medium text-gray-900">Sarah J.</p>
                                            <p className="text-sm text-gray-500">sarah@multiplier.ai</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Coordinator</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-medium text-sm">DS</div>
                                        <div>
                                            <p className="font-medium text-gray-900">Dr. Smith</p>
                                            <p className="text-sm text-gray-500">smith@hospital.org</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">Investigator</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Trial Configuration */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
                        <Database className="w-5 h-5 text-gray-500" />
                        <h2 className="font-bold text-gray-900">Trial Configuration</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Enable Automatic eCRF Validation</p>
                                <p className="text-xs text-gray-500">Review all forms using AI before submission</p>
                            </div>
                            <button
                                onClick={() => setEcrfValidation(!ecrfValidation)}
                                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                                    ecrfValidation ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${
                                    ecrfValidation ? 'right-1' : 'left-1'
                                }`}></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Real-time Patient Monitoring</p>
                                <p className="text-xs text-gray-500">
                                    {realtimeMonitoring 
                                        ? "Stream data from wearable devices directly to live monitor" 
                                        : "Live Monitor page will show static/cached data only"
                                    }
                                </p>
                            </div>
                            <button
                                onClick={() => setRealtimeMonitoring(!realtimeMonitoring)}
                                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                                    realtimeMonitoring ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${
                                    realtimeMonitoring ? 'right-1' : 'left-1'
                                }`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Audit Log Section */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <h2 className="font-bold text-gray-900">Audit Log</h2>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Full Audit Log (156 entries) →</button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Enabled eCRF Validation</p>
                                        <p className="text-xs text-gray-500">Rahul M. · 2026-03-16 11:20</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Uploaded document ICF v1.0</p>
                                        <p className="text-xs text-gray-500">Sarah J. · 2026-03-15 09:15</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Reported AE for EMR-1012</p>
                                        <p className="text-xs text-gray-500">Dr. Smith · 2026-03-14 14:30</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI & Integrations Section (Admin Only) */}
                {selectedRole === 'internal' && (
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
                            <Key className="w-5 h-5 text-gray-500" />
                            <h2 className="font-bold text-gray-900">AI & Integrations</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">CopilotKit Runtime URL</p>
                                    <p className="text-xs text-gray-500">/api/copilotkit</p>
                                </div>
                                <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1">
                                    <span>Test</span>
                                    <span className="text-green-600">✓</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Ollama API Key</p>
                                    <p className="text-xs text-gray-500">••••••••••••••••</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Ollama Model</p>
                                    <p className="text-xs text-gray-500">llama3.2</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Change</button>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">eCRF Validation AI</p>
                                    <p className="text-xs text-gray-500">Enabled</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Config</button>
                            </div>
                        </div>
                    </section>
                )}
                {/* Notifications */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-gray-500" />
                        <h2 className="font-bold text-gray-900">Notification Preferences</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    checked={emailAlerts}
                                    onChange={(e) => setEmailAlerts(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Email alerts for High-Severity Adverse Events</p>
                                    <p className="text-xs text-gray-500 mt-1">Sent to: rahul@multiplier.ai, pi@hospital.org  <button className="text-blue-600 hover:text-blue-800">[Edit Recipients]</button></p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    checked={smsNotifications}
                                    onChange={(e) => setSmsNotifications(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">SMS notifications for site visit delays</p>
                                    <p className="text-xs text-gray-500 mt-1">Sent to: +1-555-0100  <button className="text-blue-600 hover:text-blue-800">[Edit Phone]</button></p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    checked={monthlyReports}
                                    onChange={(e) => setMonthlyReports(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Monthly trial performance reports</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {monthlyReports 
                                            ? "Would send on: 1st of each month  [Disable]" 
                                            : "Would send on: 1st of each month  [Enable]"
                                        }
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Includes: Enrollment, compliance, AE summary, visit completion</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end space-x-4 pt-4">
                    <button 
                        onClick={handleDiscardChanges}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                        disabled={!hasChanges}
                    >
                        Discard Changes
                    </button>
                    <button 
                        onClick={handleSaveSettings}
                        className="flex items-center space-x-2 bg-accent text-white px-8 py-2 rounded-lg font-medium bg-accent-hover transition-all shadow-lg hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!hasChanges}
                    >
                        <Save className="w-4 h-4" />
                        <span>Save Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
