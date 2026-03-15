"use client";

import { useState } from "react";
import { usePatient } from "@/lib/hooks/usePatient";
import { Patient } from "@/types/clinical-trial";
import { User, ChevronDown, Search } from "lucide-react";

interface PatientSelectorProps {
  selectedPatient?: Patient | null;
  onPatientSelect: (patient: Patient) => void;
  placeholder?: string;
  showStatus?: boolean;
  className?: string;
}

export function PatientSelector({ 
  selectedPatient, 
  onPatientSelect, 
  placeholder = "Select a patient...",
  showStatus = true,
  className = ""
}: PatientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { patients } = usePatient();

  const filteredPatients = patients.filter(patient =>
    patient.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.initials.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center">
          <User className="w-4 h-4 text-gray-400 mr-2" />
          <span className={selectedPatient ? "text-gray-900" : "text-gray-500"}>
            {selectedPatient ? `${selectedPatient.subjectId} (${selectedPatient.initials})` : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Patient List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                No patients found
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => handlePatientSelect(patient)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.subjectId} ({patient.initials})
                        </div>
                        <div className="text-xs text-gray-500">
                          {patient.site} • Age: {patient.age || "N/A"}
                        </div>
                      </div>
                    </div>
                    {showStatus && (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
