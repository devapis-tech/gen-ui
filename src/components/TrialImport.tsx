"use client";

import { useState, useRef } from "react";
import { ClinicalTrial } from "@/types/clinical-trial";
import { extractClinicalTrialData, extractFromPDF } from "@/lib/ollama";

interface TrialImportProps {
  onTrialDataFetched: (data: ClinicalTrial) => void;
  onBack: () => void;
}

export function TrialImport({ onTrialDataFetched, onBack }: TrialImportProps) {
  const [nctInput, setNctInput] = useState("");
  const [trialLinkInput, setTrialLinkInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copilot action to fetch trial data
  // useCopilotAction({
  //   name: "fetchTrialData",
  //   description: "Fetch clinical trial data from NCT ID or trial link",
  //   parameters: [
  //     {
  //       name: "nctId",
  //       type: "string",
  //       description: "The NCT ID to fetch data for",
  //       required: false,
  //     },
  //     {
  //       name: "trialLink",
  //       type: "string",
  //       description: "The trial link to fetch data from",
  //       required: false,
  //     },
  //   ],
  //   handler: async ({ nctId, trialLink }) => {
  //     if (nctId) {
  //       await handleFetchNctData(nctId);
  //     } else if (trialLink) {
  //       await handleFetchLinkData(trialLink);
  //     }
  //   },
  //   render: "Fetching trial data...",
  // });

  const extractNctIdFromInput = (value: string): string => {
    const trimmed = value.trim();
    const match = trimmed.match(/NCT\d{8}/i);
    return match ? match[0].toUpperCase() : "";
  };

  const handleFetchNctData = async (nctId?: string) => {
    const id = nctId || extractNctIdFromInput(nctInput);

    if (!id) {
      setError("Please enter a valid NCT ID");
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      // Use AI to extract/mock trial data (in real app, this would call actual API)
      const mockData: ClinicalTrial = {
        nctId: id,
        protocolTitle: "A Randomized, Double-Blind, Placebo-Controlled Study",
        sponsorName: "Pharma Corporation",
        sponsorClass: "INDUSTRY",
        phase: "PHASE2",
        studyType: "INTERVENTIONAL",
        conditions: "Medical Condition",
        enrollmentCount: "150",
        startDate: "2024-01",
        completionDate: "2026-12",
        overallStatus: "RECRUITING",
        piName: "Dr. John Smith",
        piAffiliation: "Medical Center",
        indNumber: "",
        studyDetails: {
          briefSummary: "This is a randomized study to evaluate the efficacy and safety of a new treatment.",
          detailedDescription: "",
          primaryOutcomes: [],
          secondaryOutcomes: [],
        },
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      onTrialDataFetched(mockData);
    } catch (err) {
      setError("Failed to fetch trial data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchLinkData = async (link?: string) => {
    const trialLink = link || trialLinkInput;

    if (!trialLink) {
      setError("Please enter a valid trial link");
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      // First try to fetch the webpage content via proxy
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(trialLink)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch webpage: ${response.status}`);
      }

      const htmlContent = await response.text();

      // Use AI to extract data from the HTML content
      const extractedData = await extractClinicalTrialData(htmlContent);

      const trialData: ClinicalTrial = {
        nctId: extractedData.nctId || "UNKNOWN",
        protocolTitle: extractedData.protocolTitle || "Extracted from link",
        sponsorName: extractedData.sponsorName || "Unknown Sponsor",
        sponsorClass: "INDUSTRY",
        phase: extractedData.phase || "PHASE1",
        studyType: extractedData.studyType || "INTERVENTIONAL",
        conditions: extractedData.conditions || "Various",
        enrollmentCount: extractedData.enrollmentCount || "0",
        startDate: extractedData.startDate || "2024-01",
        completionDate: extractedData.completionDate || "2026-12",
        overallStatus: extractedData.overallStatus || "UNKNOWN",
        piName: extractedData.piName || "Unknown PI",
        piAffiliation: extractedData.piAffiliation || "Unknown Institution",
        indNumber: extractedData.indNumber || "",
        studyDetails: {
          briefSummary: extractedData.studyDetails?.briefSummary || "Extracted from trial link",
          detailedDescription: extractedData.studyDetails?.detailedDescription || "",
          primaryOutcomes: extractedData.studyDetails?.primaryOutcomes || [],
          secondaryOutcomes: extractedData.studyDetails?.secondaryOutcomes || [],
        },
      };

      onTrialDataFetched(trialData);
    } catch (err) {
      console.error("Link extraction error:", err);
      setError("Failed to extract data from link. Please check the URL and try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setIsFetching(true);
    setError(null);
    setUploadProgress(0);

    try {
      setUploadProgress(25);

      // Extract text from PDF using API
      const extractedText = await extractFromPDF(file);

      setUploadProgress(75);

      // Use AI to parse the extracted text
      const extractedData = await extractClinicalTrialData(extractedText);

      setUploadProgress(100);

      const trialData: ClinicalTrial = {
        nctId: extractedData.nctId || "PDF_IMPORTED",
        protocolTitle: extractedData.protocolTitle || "Extracted from PDF",
        sponsorName: extractedData.sponsorName || "Unknown Sponsor",
        sponsorClass: "INDUSTRY",
        phase: extractedData.phase || "PHASE1",
        studyType: extractedData.studyType || "INTERVENTIONAL",
        conditions: extractedData.conditions || "Various",
        enrollmentCount: extractedData.enrollmentCount || "0",
        startDate: extractedData.startDate || "2024-01",
        completionDate: extractedData.completionDate || "2026-12",
        overallStatus: extractedData.overallStatus || "UNKNOWN",
        piName: extractedData.piName || "Unknown PI",
        piAffiliation: extractedData.piAffiliation || "Unknown Institution",
        indNumber: extractedData.indNumber || "",
        studyDetails: {
          briefSummary: extractedData.studyDetails?.briefSummary || "Extracted from PDF document",
          detailedDescription: extractedData.studyDetails?.detailedDescription || "",
          primaryOutcomes: extractedData.studyDetails?.primaryOutcomes || [],
          secondaryOutcomes: extractedData.studyDetails?.secondaryOutcomes || [],
        },
      };

      onTrialDataFetched(trialData);
    } catch (err) {
      console.error("PDF processing error:", err);
      setError("Failed to process PDF. Please ensure it contains trial data and try again.");
    } finally {
      setIsFetching(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Status Selection
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Import Trial Data
        </h2>
        <p className="text-lg text-gray-600">
          Enter an NCT ID or trial link to automatically extract trial information
        </p>
      </div>

      <div className="space-y-8">
        {/* NCT ID Input */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Import by NCT ID
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={nctInput}
              onChange={(e) => setNctInput(e.target.value)}
              placeholder="Enter NCT ID (e.g., NCT12345678)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => handleFetchNctData()}
              disabled={isFetching || !nctInput.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isFetching ? "Fetching..." : "Fetch Trial Data"}
            </button>
          </div>
        </div>

        {/* PDF Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Import from PDF Document
          </h3>
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isFetching}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploadProgress !== null && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            <div className="text-sm text-gray-600">
              <p>Upload a PDF containing clinical trial information (protocol, investigator brochure, etc.)</p>
            </div>
          </div>
        </div>

        {/* Trial Link Input */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Import by Trial Link
          </h3>
          <div className="space-y-4">
            <input
              type="url"
              value={trialLinkInput}
              onChange={(e) => setTrialLinkInput(e.target.value)}
              placeholder="Enter trial registry link (e.g., https://clinicaltrials.gov/study/NCT12345678)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => handleFetchLinkData()}
              disabled={isFetching || !trialLinkInput.trim()}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isFetching ? "Extracting..." : "Extract from Link"}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* AI Helper Text */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <p className="text-sm">
            💡 <strong>Import Options:</strong> Choose from NCT ID lookup, direct link extraction, or PDF document upload. The AI will automatically extract and structure the trial data.
          </p>
        </div>
      </div>
    </div>
  );
}
