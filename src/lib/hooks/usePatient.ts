"use client";

import { useState, useEffect } from "react";
import { Patient, Vitals, VisitHistory } from "@/types/clinical-trial";
import { AdverseEvent } from "@/types/adverse-event";

export function usePatient(patientId?: string) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data - in real app this would come from API
  const mockPatients: Patient[] = [
    {
      id: "1",
      subjectId: "SUBJ-001",
      initials: "JD",
      dateOfBirth: "1985-06-15",
      age: 38,
      enrollmentDate: "2024-01-15",
      trialArm: "Treatment A",
      cohort: "Cohort 1",
      site: "Site A - Medical Center",
      status: "ENROLLED",
      currentVisit: "Week 12",
      nextVisit: "Week 16 (2024-04-15)",
      vitals: [
        {
          id: "v1",
          date: "2024-03-15",
          bloodPressure: "120/80",
          heartRate: 72,
          temperature: 98.6,
          weight: 175.2,
          height: 69
        },
        {
          id: "v2",
          date: "2024-02-15",
          bloodPressure: "118/78",
          heartRate: 70,
          temperature: 98.4,
          weight: 176.1,
          height: 69
        }
      ],
      visitHistory: [
        {
          id: "vh1",
          visitNumber: "VISIT-001",
          visitName: "Screening Visit",
          date: "2024-01-10",
          status: "COMPLETED",
          procedures: ["Informed Consent", "Eligibility Assessment", "Baseline Labs", "ECG"],
          notes: "Patient passed all screening criteria"
        },
        {
          id: "vh2",
          visitNumber: "VISIT-002",
          visitName: "Baseline Visit",
          date: "2024-01-15",
          status: "COMPLETED",
          procedures: ["Randomization", "Study Drug Administration", "Safety Assessment", "Questionnaires"],
          notes: "Randomized to Treatment A"
        },
        {
          id: "vh3",
          visitNumber: "VISIT-003",
          visitName: "Week 4 Visit",
          date: "2024-02-12",
          status: "COMPLETED",
          procedures: ["Study Drug Administration", "Safety Labs", "Adverse Event Review", "Compliance Check"],
          notes: "No adverse events reported"
        }
      ],
      adverseEvents: [
        {
          id: "ae1",
          patientId: "1",
          eventName: "Headache",
          soc: "Nervous System Disorders",
          severity: "Grade 1",
          onset: new Date("2024-01-17"),
          resolution: new Date("2024-01-19"),
          causality: "Possibly Related",
          action: "Patient advised to take OTC pain reliever",
          outcome: "Recovered",
          serious: false,
          reportedBy: "Dr. Smith",
          reportedAt: new Date("2024-01-18"),
          regulatoryReported: false,
          description: "Mild headache reported 2 days after study drug administration",
          followUpRequired: false
        },
        {
          id: "ae2",
          patientId: "1",
          eventName: "Pneumonia",
          soc: "Infections and Infestations",
          severity: "Grade 3",
          onset: new Date("2024-02-10"),
          resolution: null,
          causality: "Not Related",
          action: "Patient hospitalized, relationship to study drug being investigated",
          outcome: "Ongoing",
          serious: true,
          saeReason: ["hospitalization"],
          reportedBy: "Study Coordinator",
          reportedAt: new Date("2024-02-10"),
          regulatoryReported: true,
          description: "Hospitalization for pneumonia - unrelated to study drug",
          followUpRequired: true
        }
      ]
    },
    {
      id: "2",
      subjectId: "SUBJ-002",
      initials: "AB",
      dateOfBirth: "1990-09-22",
      age: 33,
      enrollmentDate: "2024-02-01",
      trialArm: "Treatment B",
      cohort: "Cohort 2",
      site: "Site B - Research Hospital",
      status: "SCREENING",
      currentVisit: "Screening",
      nextVisit: "Baseline (2024-02-15)",
      vitals: [
        {
          id: "v3",
          date: "2024-02-01",
          bloodPressure: "115/75",
          heartRate: 68,
          temperature: 98.2,
          weight: 142.8,
          height: 64
        }
      ],
      visitHistory: [
        {
          id: "vh4",
          visitNumber: "VISIT-001",
          visitName: "Screening Visit",
          date: "2024-02-01",
          status: "COMPLETED",
          procedures: ["Informed Consent", "Eligibility Assessment"],
          notes: "Awaiting lab results"
        }
      ],
      adverseEvents: []
    },
    {
      id: "3",
      subjectId: "SUBJ-003",
      initials: "MC",
      dateOfBirth: "1978-03-08",
      age: 46,
      enrollmentDate: "2023-12-01",
      trialArm: "Placebo",
      cohort: "Cohort 1",
      site: "Site A - Medical Center",
      status: "COMPLETED",
      currentVisit: "Study Complete",
      nextVisit: "N/A",
      vitals: [
        {
          id: "v4",
          date: "2024-03-01",
          bloodPressure: "122/82",
          heartRate: 75,
          temperature: 98.8,
          weight: 189.4,
          height: 71
        }
      ],
      visitHistory: [
        {
          id: "vh5",
          visitNumber: "VISIT-001",
          visitName: "Screening Visit",
          date: "2023-11-28",
          status: "COMPLETED",
          procedures: ["Informed Consent", "Eligibility Assessment", "Baseline Labs", "ECG"],
          notes: "Patient eligible for study"
        },
        {
          id: "vh6",
          visitNumber: "VISIT-002",
          visitName: "Baseline Visit",
          date: "2023-12-01",
          status: "COMPLETED",
          procedures: ["Randomization", "Study Drug Administration", "Safety Assessment", "Questionnaires"],
          notes: "Randomized to Placebo"
        },
        {
          id: "vh7",
          visitNumber: "VISIT-008",
          visitName: "Final Visit",
          date: "2024-03-01",
          status: "COMPLETED",
          procedures: ["Final Assessment", "Study Completion", "Follow-up Planning"],
          notes: "Study completed successfully"
        }
      ],
      adverseEvents: [
        {
          id: "ae3",
          patientId: "3",
          eventName: "Nausea",
          soc: "Gastrointestinal Disorders",
          severity: "Grade 1",
          onset: new Date("2023-12-29"),
          resolution: new Date("2024-01-02"),
          causality: "Possibly Related",
          action: "Symptomatic treatment provided",
          outcome: "Recovered",
          serious: false,
          reportedBy: "Dr. Smith",
          reportedAt: new Date("2023-12-30"),
          regulatoryReported: false,
          description: "Mild nausea at week 4",
          followUpRequired: false
        }
      ]
    }
  ];

  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  useEffect(() => {
    if (patientId && patients.length > 0) {
      const patient = patients.find(p => p.id === patientId);
      setCurrentPatient(patient || null);
    }
  }, [patientId, patients]);

  const getPatientById = (id: string): Patient | undefined => {
    return patients.find(p => p.id === id);
  };

  const getPatientsByStatus = (status: Patient["status"]): Patient[] => {
    return patients.filter(p => p.status === status);
  };

  const getPatientsBySite = (site: string): Patient[] => {
    return patients.filter(p => p.site.includes(site));
  };

  const updatePatientStatus = (id: string, status: Patient["status"]) => {
    setPatients(prev => 
      prev.map(p => p.id === id ? { ...p, status } : p)
    );
  };

  const addAdverseEvent = (patientId: string, event: Omit<AdverseEvent, "id" | "patientId">) => {
    const newEvent: AdverseEvent = {
      ...event,
      id: `ae${Date.now()}`,
      patientId
    };

    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            adverseEvents: [...(p.adverseEvents || []), newEvent]
          };
        }
        return p;
      })
    );
  };

  const addVitals = (patientId: string, vitals: Omit<Vitals, "id">) => {
    const newVitals: Vitals = {
      ...vitals,
      id: `v${Date.now()}`
    };

    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            vitals: [...(p.vitals || []), newVitals]
          };
        }
        return p;
      })
    );
  };

  const addVisitHistory = (patientId: string, visit: Omit<VisitHistory, "id">) => {
    const newVisit: VisitHistory = {
      ...visit,
      id: `vh${Date.now()}`
    };

    setPatients(prev => 
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            visitHistory: [...(p.visitHistory || []), newVisit]
          };
        }
        return p;
      })
    );
  };

  return {
    patients,
    currentPatient,
    loading,
    error,
    getPatientById,
    getPatientsByStatus,
    getPatientsBySite,
    updatePatientStatus,
    addAdverseEvent,
    addVitals,
    addVisitHistory
  };
}
