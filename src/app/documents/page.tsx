"use client";

import { useState } from "react";
import { FileText, Search, Download, Eye, Clock, User, Filter, Copy, AlertTriangle, Calendar, GitCompare } from "lucide-react";

interface Document {
    id: string;
    name: string;
    type: string;
    version: string;
    uploadedAt: string;
    uploadedBy: string;
    status: "APPROVED" | "PENDING" | "DRAFT";
    relatedTo?: string;
    expiryDate?: string;
    reviewer?: string;
    reviewDeadline?: string;
}

const mockDocs: Document[] = [
    { id: "DOC001", name: "Clinical Trial Protocol v2.1.pdf", type: "Protocol", version: "2.1", uploadedAt: "2024-02-15", uploadedBy: "Rahul M.", status: "APPROVED", relatedTo: "Trial: EMERALD-3 (NCT07415044)" },
    { id: "DOC002", name: "Informed Consent Form - Site A.docx", type: "ICF", version: "1.0", uploadedAt: "2024-03-01", uploadedBy: "Sarah J.", status: "PENDING", relatedTo: "Site: One of a Kind CRC | 91 subjects", reviewer: "Principal Investigator", reviewDeadline: "2024-03-15" },
    { id: "DOC003", name: "Investigator Brochure.pdf", type: "IB", version: "4.0", uploadedAt: "2024-01-20", uploadedBy: "Rahul M.", status: "APPROVED", relatedTo: "Trial: EMERALD-3" },
    { id: "DOC004", name: "Lab Manual.pdf", type: "Manual", version: "1.2", uploadedAt: "2024-03-10", uploadedBy: "System", status: "DRAFT", relatedTo: "All Sites", reviewer: "Lab Director", reviewDeadline: "2024-04-01" },
];

export default function DocumentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredDocs = mockDocs.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || 
                              (selectedCategory === "Protocols" && doc.type === "Protocol") ||
                              (selectedCategory === "ICFs" && doc.type === "ICF") ||
                              (selectedCategory === "Regulatory" && ["IB", "Manual"].includes(doc.type)) ||
                              (selectedCategory === "Monitoring" && doc.type === "Manual");
        return matchesSearch && matchesCategory;
    });

    const pendingDocs = mockDocs.filter(doc => doc.status === "PENDING");
    const getExpiryBadge = (expiryDate?: string) => {
        if (!expiryDate) return null;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 0) {
            return <span className="px-2 py-1 text-[10px] font-black rounded-md bg-red-100 text-red-700">EXPIRED</span>;
        } else if (daysUntilExpiry <= 30) {
            return <span className="px-2 py-1 text-[10px] font-black rounded-md bg-yellow-100 text-yellow-700">EXPIRES IN {daysUntilExpiry} DAYS</span>;
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents Repository</h1>
                <p className="text-lg text-gray-600">Access and manage all trial-related documentation and regulatory filings</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6 font-bold">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search documents by name or type..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-bold">
                        Upload Document
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Protocols", count: 12, color: "blue" },
                    { label: "ICFs", count: 42, color: "green" },
                    { label: "Regulatory", count: 8, color: "purple" },
                    { label: "Monitoring", count: 156, color: "orange" }
                ].map((stat) => (
                    <div 
                        key={stat.label} 
                        onClick={() => setSelectedCategory(selectedCategory === stat.label ? null : stat.label)}
                        className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                            selectedCategory === stat.label ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                    >
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{stat.count}</p>
                    </div>
                ))}
            </div>

            {pendingDocs.length > 0 && (
                <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-yellow-800">⏳ PENDING APPROVAL</h3>
                            <div className="mt-2 space-y-1">
                                {pendingDocs.map(doc => (
                                    <div key={doc.id} className="text-sm text-yellow-700">
                                        <span className="font-medium">{doc.name}</span> — submitted by {doc.uploadedBy}
                                        <br />
                                        <span className="text-xs">Waiting for review from: {doc.reviewer || "Unassigned"}</span>
                                        {doc.reviewDeadline && (
                                            <>
                                                <br />
                                                <span className="text-xs font-medium">
                                                    Deadline: {doc.reviewDeadline} {new Date(doc.reviewDeadline) < new Date() ? "(OVERDUE)" : ""}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 flex space-x-2">
                                <button className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700">Approve</button>
                                <button className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded hover:bg-yellow-700">Request Changes</button>
                                <button className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700">Escalate</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Document Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Version</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Related To</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Modified</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDocs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="bg-blue-50 p-2 rounded mr-3">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    <div className="flex items-center space-x-2">
                                        <span>v{doc.version}</span>
                                        {["DOC001"].includes(doc.id) && (
                                            <button className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Compare versions">
                                                <GitCompare className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {doc.relatedTo || "-"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-900">{doc.uploadedAt}</span>
                                        <span className="text-xs text-gray-400">by {doc.uploadedBy}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 text-[10px] font-black rounded-md ${doc.status === "APPROVED" ? "bg-green-100 text-green-700" :
                                            doc.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                                        }`}>
                                            {doc.status}
                                        </span>
                                        {doc.status === "DRAFT" && doc.reviewer && (
                                            <span className="text-xs text-gray-500">Rev: {doc.reviewer}</span>
                                        )}
                                        {getExpiryBadge(doc.expiryDate)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex justify-end space-x-2">
                                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500" title="View document"><Eye className="w-4 h-4" /></button>
                                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Download document"><Download className="w-4 h-4" /></button>
                                        <button 
                                            onClick={() => navigator.clipboard.writeText(window.location.origin + "/documents/" + doc.id)}
                                            className="p-1 hover:bg-gray-100 rounded text-gray-500" 
                                            title="Copy link"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
