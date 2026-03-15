"use client";

import { Patient } from "@/types/clinical-trial";
import { Calendar, MapPin, User, Activity } from "lucide-react";

interface PatientHeaderProps {
  patient: Patient;
  userRole?: "COORDINATOR" | "MONITOR" | "INVESTIGATOR";
}

export function PatientHeader({ patient, userRole = "COORDINATOR" }: PatientHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ENROLLED":
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "SCREENING":
        return "bg-yellow-100 text-yellow-800";
      case "WITHDRAWN":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const maskSensitiveData = (data: string) => {
    if (userRole === "MONITOR") {
      return data.substring(0, 2) + "***";
    }
    return data;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {maskSensitiveData(patient.subjectId)} ({patient.initials})
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {userRole === "MONITOR" ? "Age: ***" : `Age: ${patient.age || "N/A"}`}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Enrolled: {patient.enrollmentDate}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {patient.site}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
            {patient.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Trial Arm</p>
          <p className="text-sm text-gray-900">{patient.trialArm || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Cohort</p>
          <p className="text-sm text-gray-900">{patient.cohort || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Current Visit</p>
          <p className="text-sm text-gray-900">{patient.currentVisit}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Next Visit</p>
          <p className="text-sm text-gray-900">{patient.nextVisit}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Visits</p>
            <p className="text-lg font-semibold text-gray-900">{patient.visitHistory?.length || 0}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-50 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Vitals Recorded</p>
            <p className="text-lg font-semibold text-gray-900">{patient.vitals?.length || 0}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-red-50 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Adverse Events</p>
            <p className="text-lg font-semibold text-gray-900">{patient.adverseEvents?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
