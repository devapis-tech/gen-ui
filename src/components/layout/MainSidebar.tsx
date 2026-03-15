"use client";

import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FlaskConical, 
  Calendar, 
  Activity, 
  Users, 
  AlertTriangle, 
  FileText, 
  ClipboardList, 
  Settings 
} from "lucide-react";
import { useRoleNav } from "@/lib/hooks/useRoleNav";
import { UserRole } from "@/types/clinical-trial";

const iconMap = {
  LayoutDashboard,
  FlaskConical,
  Calendar,
  Activity,
  Users,
  AlertTriangle,
  FileText,
  ClipboardList,
  Settings,
};

interface MainSidebarProps {
  userRole: UserRole | null;
}

export function MainSidebar({ userRole }: MainSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { navItems, getActiveRoute } = useRoleNav(userRole);
  const activeRoute = getActiveRoute(pathname);

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <div className="h-full w-64 bg-gray-900 text-white flex flex-col lg:w-64 md:w-16">
      {/* App Logo/Name */}
      <div className="p-6 border-b border-gray-800 md:p-4">
        <h1 className="text-xl font-bold lg:block md:hidden">CTF</h1>
        <div className="lg:block md:hidden">
          <h1 className="text-xl font-bold">Clinical Trial Forms</h1>
          <p className="text-sm text-gray-400 mt-1">AI Powered</p>
        </div>
        {/* Icons-only mode for tablet */}
        <div className="hidden md:block lg:hidden">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">CTF</span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 md:p-2">
        {navItems.map((item) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap];
          const isActive = activeRoute?.route === item.route;
          
          return (
            <button
              key={item.route}
              onClick={() => handleNavigation(item.route)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors md:justify-center md:px-2 ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              title={item.label} // Show tooltip on tablet
            >
              {IconComponent && <IconComponent className="w-5 h-5" />}
              <span className="font-medium lg:block md:hidden">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 md:p-2">
        <p className="text-xs text-gray-400 text-center lg:block md:hidden">
          Powered by CopilotKit
        </p>
        {/* Icons-only mode for tablet */}
        <div className="hidden md:block lg:hidden flex justify-center">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">CK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
