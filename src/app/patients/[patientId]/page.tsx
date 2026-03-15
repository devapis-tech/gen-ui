"use client";

import { useParams } from "next/navigation";
import { usePatient } from "@/lib/hooks/usePatient";
import { PatientHeader } from "@/components/patients/PatientHeader";
import { PatientDataTabs } from "@/components/patients/PatientDataTabs";
import { ArrowLeft, Edit, Download } from "lucide-react";
import Link from "next/link";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const { currentPatient, loading } = usePatient(patientId);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient Not Found</h1>
          <p className="text-gray-600 mb-6">The patient you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/patients"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/patients" className="text-gray-500 hover:text-gray-700">
                Patients
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{currentPatient.subjectId}</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/patients"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
        </Link>
        
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Edit className="w-4 h-4 mr-2" />
            Edit Patient
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Patient Header */}
      <PatientHeader patient={currentPatient} />

      {/* Patient Data Tabs */}
      <PatientDataTabs patient={currentPatient} />

      {/* AI Context Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant Context</h3>
        <div className="bg-white rounded-lg border border-gray-300 p-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Available Context:</strong> Complete patient profile including visit history, vitals, and adverse events
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Patient ID:</strong> {currentPatient.subjectId} ({currentPatient.initials})
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Data Points:</strong> {currentPatient.visitHistory?.length || 0} visits, {currentPatient.vitals?.length || 0} vitals, {currentPatient.adverseEvents?.length || 0} adverse events
          </p>
          <p className="text-sm text-gray-600">
            <strong>AI Capabilities:</strong> Patient data analysis, risk assessment, compliance monitoring, and treatment recommendations
          </p>
        </div>
      </div>
    </div>
  );
}
