export const dynamic = "force-dynamic";

import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { OpenAI } from "openai";

// Mock data for demonstration
const mockPatients = [
  { id: "EMR-001", name: "John Doe", status: "Enrolled", compliance: "95%" },
  { id: "EMR-002", name: "Jane Smith", status: "Screening", compliance: "N/A" },
  { id: "EMR-003", name: "Bob Johnson", status: "Enrolled", compliance: "88%" },
];

const mockAdverseEvents = [
  { id: "AE-001", patient: "EMR-001", type: "Headache", severity: "Mild", date: "2024-03-18" },
  { id: "AE-002", patient: "EMR-003", type: "Nausea", severity: "Moderate", date: "2024-03-17" },
];

export const POST = async (req: NextRequest) => {
  const openai = new OpenAI({
    apiKey: process.env.OLLAMA_API_KEY || "dummy-key",
    baseURL: process.env.OLLAMA_BASE_URL || "https://ollama.com/v1",
    defaultHeaders: {
      "Cookie": "aid=cb42d98a-a5b2-47ae-8aea-48701f756cac"
    }
  });

  const serviceAdapter = new OpenAIAdapter({
    openai: openai as any,
    model: process.env.LLM_MODEL || "gpt-oss:120b"
  });

  const runtime = new CopilotRuntime({
    actions: [
      {
        name: "searchPatients",
        description: "Search for patients in the clinical trial",
        parameters: [
          {
            name: "query",
            type: "string",
            description: "Search query for patients (name, ID, or status)",
            required: true,
          },
        ],
        handler: async ({ query }: { query: string }) => {
          // Simulate search functionality
          const filteredPatients = mockPatients.filter(
            patient => 
              patient.name.toLowerCase().includes(query.toLowerCase()) ||
              patient.id.toLowerCase().includes(query.toLowerCase()) ||
              patient.status.toLowerCase().includes(query.toLowerCase())
          );
          
          return {
            success: true,
            data: filteredPatients,
            count: filteredPatients.length
          };
        },
      } as any,
      {
        name: "enrollPatient",
        description: "Enroll a new patient in the clinical trial",
        parameters: [
          {
            name: "patientData",
            type: "object",
            description: "Patient information for enrollment",
            required: true,
          },
        ],
        handler: async ({ patientData }: { patientData: any }) => {
          // Simulate patient enrollment
          const newPatient = {
            id: `EMR-${String(mockPatients.length + 1).padStart(3, '0')}`,
            name: patientData.name || "New Patient",
            status: "Screening",
            compliance: "N/A"
          };
          
          mockPatients.push(newPatient);
          
          return {
            success: true,
            patient: newPatient,
            message: `Patient ${newPatient.name} successfully enrolled with ID ${newPatient.id}`
          };
        },
      } as any,
      {
        name: "reportAdverseEvent",
        description: "Report a new adverse event",
        parameters: [
          {
            name: "eventData",
            type: "object",
            description: "Adverse event details",
            required: true,
          },
        ],
        handler: async ({ eventData }: { eventData: any }) => {
          // Simulate adverse event reporting
          const newEvent = {
            id: `AE-${String(mockAdverseEvents.length + 1).padStart(3, '0')}`,
            patient: eventData.patientId || "Unknown",
            type: eventData.type || "Unknown",
            severity: eventData.severity || "Unknown",
            date: new Date().toISOString().split('T')[0]
          };
          
          mockAdverseEvents.push(newEvent);
          
          return {
            success: true,
            event: newEvent,
            message: `Adverse event successfully reported: ${newEvent.type} (${newEvent.severity})`
          };
        },
      } as any,
      {
        name: "getTrialMetrics",
        description: "Get current trial metrics and statistics",
        parameters: [],
        handler: async () => {
          return {
            success: true,
            metrics: {
              totalPatients: mockPatients.length,
              enrolledPatients: mockPatients.filter(p => p.status === "Enrolled").length,
              screeningPatients: mockPatients.filter(p => p.status === "Screening").length,
              averageCompliance: "91.5%",
              totalAdverseEvents: mockAdverseEvents.length,
              severeEvents: mockAdverseEvents.filter(ae => ae.severity === "Severe").length,
              moderateEvents: mockAdverseEvents.filter(ae => ae.severity === "Moderate").length,
              mildEvents: mockAdverseEvents.filter(ae => ae.severity === "Mild").length,
            }
          };
        },
      } as any,
    ],
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};

export const GET = async (req: NextRequest) => {
  const openai = new OpenAI({
    apiKey: process.env.OLLAMA_API_KEY || "dummy-key",
    baseURL: process.env.OLLAMA_BASE_URL || "https://ollama.com/v1",
    defaultHeaders: {
      "Cookie": "aid=cb42d98a-a5b2-47ae-8aea-48701f756cac"
    }
  });

  const serviceAdapter = new OpenAIAdapter({
    openai: openai as any,
    model: process.env.LLM_MODEL || "gpt-oss:120b"
  });
  const runtime = new CopilotRuntime({
    actions: [
      {
        name: "searchPatients",
        description: "Search for patients in the clinical trial",
        parameters: [
          {
            name: "query",
            type: "string",
            description: "Search query for patients (name, ID, or status)",
            required: true,
          },
        ],
        handler: async ({ query }: { query: string }) => {
          // Simulate search functionality
          const filteredPatients = mockPatients.filter(
            patient => 
              patient.name.toLowerCase().includes(query.toLowerCase()) ||
              patient.id.toLowerCase().includes(query.toLowerCase()) ||
              patient.status.toLowerCase().includes(query.toLowerCase())
          );
          
          return {
            success: true,
            data: filteredPatients,
            count: filteredPatients.length
          };
        },
      } as any,
      {
        name: "enrollPatient",
        description: "Enroll a new patient in the clinical trial",
        parameters: [
          {
            name: "patientData",
            type: "object",
            description: "Patient information for enrollment",
            required: true,
          },
        ],
        handler: async ({ patientData }: { patientData: any }) => {
          // Simulate patient enrollment
          const newPatient = {
            id: `EMR-${String(mockPatients.length + 1).padStart(3, '0')}`,
            name: patientData.name || "New Patient",
            status: "Screening",
            compliance: "N/A"
          };
          
          mockPatients.push(newPatient);
          
          return {
            success: true,
            patient: newPatient,
            message: `Patient ${newPatient.name} successfully enrolled with ID ${newPatient.id}`
          };
        },
      } as any,
      {
        name: "reportAdverseEvent",
        description: "Report a new adverse event",
        parameters: [
          {
            name: "eventData",
            type: "object",
            description: "Adverse event details",
            required: true,
          },
        ],
        handler: async ({ eventData }: { eventData: any }) => {
          // Simulate adverse event reporting
          const newEvent = {
            id: `AE-${String(mockAdverseEvents.length + 1).padStart(3, '0')}`,
            patient: eventData.patientId || "Unknown",
            type: eventData.type || "Unknown",
            severity: eventData.severity || "Unknown",
            date: new Date().toISOString().split('T')[0]
          };
          
          mockAdverseEvents.push(newEvent);
          
          return {
            success: true,
            event: newEvent,
            message: `Adverse event successfully reported: ${newEvent.type} (${newEvent.severity})`
          };
        },
      } as any,
      {
        name: "getTrialMetrics",
        description: "Get current trial metrics and statistics",
        parameters: [],
        handler: async () => {
          return {
            success: true,
            metrics: {
              totalPatients: mockPatients.length,
              enrolledPatients: mockPatients.filter(p => p.status === "Enrolled").length,
              screeningPatients: mockPatients.filter(p => p.status === "Screening").length,
              averageCompliance: "91.5%",
              totalAdverseEvents: mockAdverseEvents.length,
              severeEvents: mockAdverseEvents.filter(ae => ae.severity === "Severe").length,
              moderateEvents: mockAdverseEvents.filter(ae => ae.severity === "Moderate").length,
              mildEvents: mockAdverseEvents.filter(ae => ae.severity === "Mild").length,
            }
          };
        },
      } as any,
    ],
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};

