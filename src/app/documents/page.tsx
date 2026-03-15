"use client";

import { useState } from "react";
import { FileText, Search, Download, Eye, Clock, User, Filter } from "lucide-react";

interface Document {
    id: string;
    name: string;
    type: string;
    version: string;
    uploadedAt: string;
    uploadedBy: string;
    status: "APPROVED" | "PENDING" | "DRAFT";
}

const mockDocs: Document[] = [
    { id: "DOC001", name: "Clinical Trial Protocol v2.1.pdf", type: "Protocol", version: "2.1", uploadedAt: "2024-02-15", uploadedBy: "Rahul M.", status: "APPROVED" },
    { id: "DOC002", name: "Informed Consent Form - Site A.docx", type: "ICF", version: "1.0", uploadedAt: "2024-03-01", uploadedBy: "Sarah J.", status: "PENDING" },
    { id: "DOC003", name: "Investigator Brochure.pdf", type: "IB", version: "4.0", uploadedAt: "2024-01-20", uploadedBy: "Rahul M.", status: "APPROVED" },
    { id: "DOC004", name: "Lab Manual.pdf", type: "Manual", version: "1.2", uploadedAt: "2024-03-10", uploadedBy: "System", status: "DRAFT" },
];

export default function DocumentsPage() {
    const [searchTerm, setSearchTerm] = useState("");

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
                    <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{stat.count}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Document Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Version</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Modified</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockDocs.map((doc) => (
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">v{doc.version}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-900">{doc.uploadedAt}</span>
                                        <span className="text-xs text-gray-400">by {doc.uploadedBy}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-[10px] font-black rounded-md ${doc.status === "APPROVED" ? "bg-green-100 text-green-700" :
                                            doc.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex justify-end space-x-2">
                                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><Eye className="w-4 h-4" /></button>
                                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><Download className="w-4 h-4" /></button>
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
