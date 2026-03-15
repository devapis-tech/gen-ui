import { TrialDesignData } from "@/lib/stores/trialDesignStore";

interface TrialPhaseCardProps {
  trialData: TrialDesignData;
}

export function TrialPhaseCard({ trialData }: TrialPhaseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Phase & Randomization Configuration</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trial Phase Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 mb-3">Trial Phase</h4>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">⚗️</span>
              <div>
                <p className="font-semibold text-blue-900">{trialData.phase}</p>
                <p className="text-sm text-blue-700">Study Phase</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Study Type</span>
              <span className="font-medium text-gray-900">{trialData.studyType}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Allocation</span>
              <span className="font-medium text-gray-900">Randomized</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Masking</span>
              <span className="font-medium text-gray-900">Double Blind</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Primary Purpose</span>
              <span className="font-medium text-gray-900">Treatment</span>
            </div>
          </div>
        </div>

        {/* Randomization Arms */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 mb-3">Randomization Arms</h4>
          
          <div className="space-y-3">
            {/* Experimental Arm */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-blue-900">Experimental Arm</p>
                  <p className="text-sm text-blue-700">Investigational Treatment</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  1:1
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Participants receive the investigational medication according to the protocol-specified dosing regimen.
              </div>
            </div>

            {/* Control Arm */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Placebo Control</p>
                  <p className="text-sm text-gray-700">Standard of Care + Placebo</p>
                </div>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                  1:1
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Participants receive matching placebo in addition to standard of care treatment.
              </div>
            </div>
          </div>

          {/* Randomization Details */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-900 mb-2">Randomization Details</h5>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• 1:1 randomization ratio</li>
              <li>• Stratified by study site</li>
              <li>• Block randomization with variable block sizes</li>
              <li>• Centralized interactive web response system (IWRS)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Study Duration */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Study Duration</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <span className="text-2xl mb-2 block">📅</span>
            <p className="font-medium text-green-900">Treatment Period</p>
            <p className="text-sm text-green-700">52 weeks</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <span className="text-2xl mb-2 block">⏱️</span>
            <p className="font-medium text-purple-900">Follow-up Period</p>
            <p className="text-sm text-purple-700">12 weeks</p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <span className="text-2xl mb-2 block">📊</span>
            <p className="font-medium text-orange-900">Total Duration</p>
            <p className="text-sm text-orange-700">64 weeks</p>
          </div>
        </div>
      </div>

      {/* Additional Study Design Information */}
      {trialData.studyDetails?.detailedDescription && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Detailed Design Description</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {trialData.studyDetails.detailedDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
