import { UserRole } from "@/types/clinical-trial";

interface RoleSelectionProps {
  roles: UserRole[];
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelection({ roles, onSelectRole }: RoleSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Select Your Role
        </h2>
        <p className="text-lg text-gray-600">
          Choose your role to customize the clinical trial form experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => onSelectRole(role)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {role.title.charAt(0)}
                </span>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {role.badge}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {role.title}
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {role.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Each role provides customized forms and workflows tailored to your specific needs
        </p>
      </div>
    </div>
  );
}
