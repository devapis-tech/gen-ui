"use client";

import { useState, useEffect } from "react";
import { Patient, Vitals, VisitHistory } from "@/types/clinical-trial";
import { AdverseEvent } from "@/types/adverse-event";
import { getDatabase, findMany, findOne, insertOne, updateOne } from "@/lib/mongodb";

export function usePatientMongo(patientId?: string) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize mock data if database is empty
  const initializeMockData = async () => {
    try {
      const existingPatients = await findMany<Patient>('patients');
      if (existingPatients.length === 0) {
        // Generate mock patients
        const mockPatients = generateMockPatients();
        for (const patient of mockPatients) {
          await insertOne('patients', patient);
        }
        console.log(`Initialized ${mockPatients.length} mock patients in MongoDB`);
      }
    } catch (error) {
      console.error('Error initializing mock data:', error);
    }
  };

  // Load all patients from MongoDB
  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const patientData = await findMany<Patient>('patients');
      setPatients(patientData);
    } catch (err) {
      console.error('Error loading patients:', err);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // Load specific patient
  const loadPatient = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const patient = await findOne<Patient>('patients', { id });
      if (patient) {
        setCurrentPatient(patient);
      } else {
        setError('Patient not found');
      }
    } catch (err) {
      console.error('Error loading patient:', err);
      setError('Failed to load patient');
    } finally {
      setLoading(false);
    }
  };

  // Save patient to MongoDB
  const savePatient = async (patient: Patient) => {
    try {
      await updateOne('patients', { id: patient.id }, patient);
      
      // Update local state
      setPatients(prev => prev.map(p => p.id === patient.id ? patient : p));
      if (currentPatient?.id === patient.id) {
        setCurrentPatient(patient);
      }
    } catch (err) {
      console.error('Error saving patient:', err);
      setError('Failed to save patient');
    }
  };

  // Add adverse event to patient
  const addAdverseEvent = async (patientId: string, event: Omit<AdverseEvent, "id" | "patientId">) => {
    try {
      const newEvent: AdverseEvent = {
        ...event,
        id: `ae${Date.now()}`,
        patientId
      };

      const patient = await findOne<Patient>('patients', { id: patientId });
      if (!patient) {
        throw new Error('Patient not found');
      }

      const updatedPatient = {
        ...patient,
        adverseEvents: [...(patient.adverseEvents || []), newEvent]
      };

      await savePatient(updatedPatient);
      return newEvent;
    } catch (err) {
      console.error('Error adding adverse event:', err);
      setError('Failed to add adverse event');
      throw err;
    }
  };

  // Add vitals to patient
  const addVitals = async (patientId: string, vitals: Omit<Vitals, "id">) => {
    try {
      const newVitals: Vitals = {
        ...vitals,
        id: `vitals${Date.now()}`
      };

      const patient = await findOne<Patient>('patients', { id: patientId });
      if (!patient) {
        throw new Error('Patient not found');
      }

      const updatedPatient = {
        ...patient,
        vitals: [...(patient.vitals || []), newVitals]
      };

      await savePatient(updatedPatient);
      return newVitals;
    } catch (err) {
      console.error('Error adding vitals:', err);
      setError('Failed to add vitals');
      throw err;
    }
  };

  // Add visit to patient
  const addVisit = async (patientId: string, visit: Omit<VisitHistory, "id">) => {
    try {
      const newVisit: VisitHistory = {
        ...visit,
        id: `visit${Date.now()}`
      };

      const patient = await findOne<Patient>('patients', { id: patientId });
      if (!patient) {
        throw new Error('Patient not found');
      }

      const updatedPatient = {
        ...patient,
        visitHistory: [...(patient.visitHistory || []), newVisit]
      };

      await savePatient(updatedPatient);
      return newVisit;
    } catch (err) {
      console.error('Error adding visit:', err);
      setError('Failed to add visit');
      throw err;
    }
  };

  // Mock data generator (same as original)
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
        enrollmentDate,
        status,
        trialArm: arm,
        cohort,
        site,
        currentVisit: "Screening",
        nextVisit: "Baseline",
        vitals: [],
        visitHistory: [],
        adverseEvents: []
      };

      // Add some mock data
      if (i % 3 === 0) {
        patient.vitals = [
          {
            id: `vitals${i}1`,
            date: new Date(2025, (i % 12), 5 + (i % 20)).toISOString().split('T')[0],
            bloodPressure: `${120 + (i % 20)}/${70 + (i % 15)}`,
            heartRate: 60 + (i % 40),
            temperature: 98 + (i % 3),
            weight: 150 + (i % 50),
            height: 65 + (i % 10)
          }
        ];
      }

      if (i % 4 === 0) {
        patient.visitHistory = [
          {
            id: `visit${i}1`,
            visitName: "Screening Visit",
            visitNumber: "Visit 01",
            date: new Date(2025, (i % 12), 1 + (i % 28)).toISOString().split('T')[0],
            status: "COMPLETED",
            procedures: ["Informed Consent", "Physical Exam", "Lab Tests"],
            notes: "Patient successfully screened"
          }
        ];
      }

      if (i % 5 === 0) {
        patient.adverseEvents = [
          {
            id: `ae${i}1`,
            patientId: id,
            eventName: "Headache",
            soc: "Nervous System Disorders",
            severity: "Grade 1",
            onset: new Date(2025, (i % 12), 10 + (i % 15)),
            resolution: null,
            causality: "Possibly Related",
            action: "No action taken",
            outcome: "Ongoing",
            serious: false,
            reportedBy: "Site Staff",
            reportedAt: new Date(2025, (i % 12), 11 + (i % 15)),
            regulatoryReported: false,
            description: "Mild headache reported by patient",
            followUpRequired: false
          }
        ];
      }

      generated.push(patient);
    }

    return generated;
  };

  // Initialize data and load patients on mount
  useEffect(() => {
    const initialize = async () => {
      await initializeMockData();
      await loadPatients();
    };
    initialize();
  }, []);

  // Load specific patient when patientId changes
  useEffect(() => {
    if (patientId) {
      loadPatient(patientId);
    } else {
      setCurrentPatient(null);
    }
  }, [patientId]);

  return {
    patients,
    currentPatient,
    loading,
    error,
    savePatient,
    addAdverseEvent,
    addVitals,
    addVisit,
    refreshPatients: loadPatients,
    refreshPatient: () => patientId ? loadPatient(patientId) : Promise.resolve()
  };
}
