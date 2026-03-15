import { UserRole } from "@/types/clinical-trial";

interface StatusSelectionProps {
  selectedRole: UserRole | null;
  onContinue: () => void;
  onBack: () => void;
}

export function StatusSelection({ selectedRole, onContinue, onBack }: StatusSelectionProps) {
  const trialChoices = [
    {
      id: "new",
      title: "New Trial",
      description: "Select and complete required FDA and compliance forms for a brand-new clinical trial.",
      icon: "📋",
    },
    {
      id: "ongoing",
      title: "Ongoing Trial",
      description: "Upload an NCT ID, trial link, or protocol PDF to auto-extract and pre-fill all forms instantly.",
      icon: "🔄",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Role Selection
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Trial Status
        </h2>
        <p className="text-lg text-gray-600">
          Are you starting a new trial or working with an existing one?
        </p>
        {selectedRole && (
          <div className="mt-4">
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {selectedRole.badge} - {selectedRole.title}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {trialChoices.map((choice) => (
          <div
            key={choice.id}
            className="bg-white rounded-lg shadow-md p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
            onClick={onContinue}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{choice.icon}</div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {choice.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {choice.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Your selection will customize the form workflow and data requirements
        </p>
      </div>
    </div>
  );
}
