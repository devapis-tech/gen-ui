"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoleNav } from "@/lib/hooks/useRoleNav";
import { useUserRole } from "@/contexts/UserRoleContext";

export function MainSidebar() {
  const pathname = usePathname();
  const { navItems } = useRoleNav();
  const { userRole, setUserRole } = useUserRole();

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full fixed inset-y-0 left-0 z-40 border-r border-gray-800">
      {/* App Logo/Name */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-lg text-white">
            M
          </div>
          <div>
            <h1 className="text-sm font-black leading-tight uppercase tracking-tighter">Multiplier AI</h1>
            <p className="text-[10px] text-gray-400 font-bold">INTERNAL HUB • RAHUL</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.route || (item.route !== "/" && pathname.startsWith(item.route));

          return (
            <Link
              key={item.route}
              href={item.route}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-white"}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Role Switcher (for demo purposes) */}
      <div className="p-4 border-t border-gray-800">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Active Role</p>
          <select
            value={userRole?.title || ""}
            onChange={(e) => {
              const selected = e.target.value;
              setUserRole({ id: selected, title: selected, badge: selected, description: selected });
            }}
            className="w-full bg-gray-800 border border-gray-700 text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ADMIN">Administrator</option>
            <option value="COORDINATOR">Coordinator</option>
            <option value="MONITOR">Monitor</option>
            <option value="PATIENT">Patient</option>
          </select>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-[10px] text-gray-500 text-center uppercase tracking-tighter">
            Powered by <span className="text-blue-400 font-semibold">Multiplier Clinic Agent</span>
          </p>
        </div>
      </div>
    </div>
  );
}
