"use client";

import { useState, useEffect } from "react";
import { Patient, Vitals, VisitHistory } from "@/types/clinical-trial";
import { AdverseEvent } from "@/types/adverse-event";

export function usePatient(patientId?: string) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // EMERALD-3 (NCT07415044) Trial Data
  // Drug: LY4268989 (MORF-057)
  // Condition: Ulcerative Colitis
  // Arms: LY Study Dose 1, LY Study Dose 2, Placebo
  // Sites: Various (Phoenix, Scottsdale, Anaheim, etc.)

  const generateMockPatients = (): Patient[] => {
    const arms = ["LY4268989 Dose 1", "LY4268989 Dose 2", "Placebo"];
    const cohorts = ["Cohort A", "Cohort B", "Cohort C"];
    const sites = [
      "Valleywise Health - Phoenix",
      "One of a Kind CRC - Scottsdale",
      "Clinnova Research - Anaheim",
      "Om Research - Temple City",
      "Rush University - Chicago",
      "Saint Peter's - New Brunswick",
      "Ohio State - Hilliard",
      "Medical University SC - Charleston"
    ];
    const statuses: ("SCREENING" | "ENROLLED" | "COMPLETED" | "WITHDRAWN")[] = [
      "ENROLLED", "ENROLLED", "ENROLLED", "ENROLLED", "SCREENING", "COMPLETED", "WITHDRAWN"
    ];

    const generated: Patient[] = [];

    for (let i = 1; i <= 100; i++) {
      const id = i.toString();
      const subjectId = `EMR-${1000 + i}`;
      const initials = String.fromCharCode(65 + (i % 26)) + String.fromCharCode(65 + ((i + 5) % 26));
      const age = 20 + (i % 60);
      const arm = arms[i % arms.length];
      const cohort = cohorts[i % cohorts.length];
      const site = sites[i % sites.length];
      const status = i < 80 ? "ENROLLED" : statuses[i % statuses.length];

      const enrollmentDate = new Date(2025, i % 12, 1 + (i % 28)).toISOString().split('T')[0];

      const patient: Patient = {
        id,
        subjectId,
        initials,
        age,
        dateOfBirth: new Date(2025 - age, 0, 1).toISOString().split('T')[0],
        enrollmentDate,
        trialArm: arm,
        cohort,
        site,
        status,
        currentVisit: status === "COMPLETED" ? "End of Study" : `Week ${4 * (i % 12)}`,
        nextVisit: status === "ENROLLED" ? `Week ${(4 * (i % 12) + 4)} (2026-04-${10 + (i % 20)})` : "N/A",
        vitals: [
          {
            id: `v-${i}-1`,
            date: "2026-03-01",
            bloodPressure: `${110 + (i % 20)}/${70 + (i % 15)}`,
            heartRate: 65 + (i % 15),
            temperature: 97.5 + (i % 20) / 10,
            weight: 150 + (i % 50),
            height: 60 + (i % 15)
          }
        ],
        visitHistory: [
          {
            id: `vh-${i}-1`,
            visitNumber: "V1",
            visitName: "Screening",
            date: enrollmentDate,
            status: "COMPLETED",
            procedures: ["Informed Consent", "Physical Exam", "Bloodwork"],
            notes: "Stable UC condition"
          }
        ],
        adverseEvents: i % 15 === 0 ? [
          {
            id: `ae-${i}-1`,
            patientId: id,
            eventName: i % 30 === 0 ? "Severe Flare" : "Headache",
            soc: i % 30 === 0 ? "Gastrointestinal" : "Nervous System",
            severity: i % 30 === 0 ? "Grade 3" : "Grade 1",
            onset: new Date("2026-02-15"),
            resolution: null,
            causality: i % 30 === 0 ? "Possibly Related" : "Not Related",
            action: "Admitted to hospital",
            outcome: "Ongoing",
            serious: i % 30 === 0,
            saeReason: i % 30 === 0 ? ["hospitalization"] : [],
            reportedBy: "Dr. Investigator",
            reportedAt: new Date("2026-02-16"),
            regulatoryReported: i % 30 === 0,
            description: "Patient experienced worsening symptoms of UC.",
            followUpRequired: i % 30 === 0
          }
        ] : []
      };

      generated.push(patient);
    }
    return generated;
  };

  useEffect(() => {
    setPatients(generateMockPatients());
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
