"use client";

import { Settings as SettingsIcon, Bell, Shield, User, Database, Globe, Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
                <p className="text-lg text-gray-600">Configure trial parameters, user permissions, and notifications</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-500" />
                        <h2 className="font-bold text-gray-900">User Profile</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1">Full Name</label>
                                <input type="text" defaultValue="Rahul Multiplier" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 uppercase mb-1">Email Address</label>
                                <input type="email" defaultValue="rahul@multiplier.ai" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trial Configuration */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-bold">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
                        <Database className="w-5 h-5 text-gray-500" />
                        <h2 className="font-bold text-gray-900">Trial Configuration</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-black">Enable Automatic eCRF Validation</p>
                                <p className="text-xs text-gray-400">Review all forms using AI before submission</p>
                            </div>
                            <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                            <div>
                                <p className="text-sm font-black">Real-time Patient Monitoring</p>
                                <p className="text-xs text-gray-400">Stream data from wearable devices directly to live monitor</p>
                            </div>
                            <div className="w-10 h-5 bg-gray-300 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-bold">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-gray-500" />
                        <h2 className="font-bold text-gray-900">Notification Preferences</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-3 font-bold">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                <span className="text-sm text-gray-700">Email alerts for High-Severity Adverse Events</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                <span className="text-sm text-gray-700">SMS notifications for site visit delays</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                                <span className="text-sm text-gray-700">Monthly trial performance reports</span>
                            </label>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end space-x-4 pt-4">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-black text-gray-600 hover:bg-gray-50">Discard Changes</button>
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-2 rounded-lg font-black hover:bg-blue-700 transition-all shadow-lg hover:translate-y-[-1px]">
                        <Save className="w-4 h-4" />
                        <span>Save Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
