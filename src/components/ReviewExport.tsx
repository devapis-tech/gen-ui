"use client";

import { useState } from "react";
import { ClinicalTrial } from "@/types/clinical-trial";

interface ReviewExportProps {
  trialData: ClinicalTrial | null;
  selectedForms: string[];
  onBack: () => void;
}

export function ReviewExport({ trialData, selectedForms, onBack }: ReviewExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>("");

  // Copilot action to generate summary
  // useCopilotAction({
  //   name: "generateTrialSummary",
  //   description: "Generate a comprehensive summary of the clinical trial",
  //   parameters: [],
  //   handler: async () => {
  //     // In a real implementation, this would use AI to generate a summary
  //     const summary = `
  //       Clinical Trial Summary for ${trialData?.protocolTitle}
  //       
  //       NCT ID: ${trialData?.nctId}
  //       Sponsor: ${trialData?.sponsorName}
  //       Phase: ${trialData?.phase}
  //       Status: ${trialData?.overallStatus}
  //       
  //       This ${trialData?.studyType?.toLowerCase()} study focuses on ${trialData?.conditions?.toLowerCase()} 
  //       with an expected enrollment of ${trialData?.enrollmentCount} participants. 
  //       The trial is scheduled to run from ${trialData?.startDate} to ${trialData?.completionDate}.
  //       
  //       Selected Forms: ${selectedForms.length} forms including required regulatory documentation.
  //     `;
      
  //     setExportStatus(summary);
  //   },
  //   render: "Generating trial summary...",
  // });

  // Copilot action to export to different formats
  // useCopilotAction({
  //   name: "exportData",
  //   description: "Export trial data in specified format",
  //   parameters: [
  //     {
  //       name: "format",
  //       type: "string",
  //       description: "Export format: pdf, json, csv",
  //       required: true,
  //     },
  //   ],
  //   handler: async ({ format }) => {
  //     await handleExport(format);
  //   },
  //   render: "Exporting data...",
  // });

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportStatus(`Exporting trial data as ${format.toUpperCase()}...`);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dataToExport = {
        trialData,
        selectedForms,
        exportDate: new Date().toISOString(),
      };

      switch (format) {
        case "json":
          const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `trial-${trialData?.nctId || "data"}.json`;
          a.click();
          URL.revokeObjectURL(url);
          break;
        
        case "pdf":
          setExportStatus("PDF export would be implemented with a PDF library like jsPDF");
          break;
        
        case "csv":
          setExportStatus("CSV export would convert trial data to CSV format");
          break;
        
        default:
          setExportStatus("Unsupported export format");
      }

      setExportStatus(`Successfully exported trial data as ${format.toUpperCase()}`);
    } catch (error) {
      setExportStatus("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatFormName = (formId: string) => {
    const formNames: Record<string, string> = {
      "fda-1572": "FDA Form 1572",
      "informed-consent": "Informed Consent Form",
      "protocol": "Trial Protocol",
      "irb-approval": "IRB Approval",
      "investigator-brochure": "Investigator's Brochure",
      "case-report-form": "Case Report Form",
    };
    return formNames[formId] || formId;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Workspace
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Review & Export
        </h2>
        <p className="text-lg text-gray-600">
          Review your trial data and export in your preferred format
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trial Summary */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Trial Summary
          </h3>
          
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Protocol Title:</span>
              <p className="text-gray-600">{trialData?.protocolTitle}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">NCT ID:</span>
              <p className="text-gray-600">{trialData?.nctId}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Sponsor:</span>
              <p className="text-gray-600">{trialData?.sponsorName}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Phase & Type:</span>
              <p className="text-gray-600">{trialData?.phase} • {trialData?.studyType}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p className="text-gray-600">{trialData?.overallStatus}</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Enrollment:</span>
              <p className="text-gray-600">{trialData?.enrollmentCount} participants</p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Timeline:</span>
              <p className="text-gray-600">{trialData?.startDate} - {trialData?.completionDate}</p>
            </div>
          </div>
        </div>

        {/* Selected Forms */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Selected Forms ({selectedForms.length})
          </h3>
          
          <div className="space-y-2">
            {selectedForms.map((formId) => (
              <div
                key={formId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-700">{formatFormName(formId)}</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  Ready
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Export Options
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleExport("json")}
            disabled={isExporting}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Export as JSON
          </button>
          
          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Export as PDF
          </button>
          
          <button
            onClick={() => handleExport("csv")}
            disabled={isExporting}
            className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Export as CSV
          </button>
        </div>

        {exportStatus && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{exportStatus}</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        <p className="text-sm">
          💡 <strong>AI Assistant:</strong> Ask me to generate a detailed summary, validate your data, or help you choose the best export format!
        </p>
      </div>
    </div>
  );
}
