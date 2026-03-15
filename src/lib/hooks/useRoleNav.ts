"use client";

import { useMemo } from "react";
import { UserRole } from "@/types/clinical-trial";

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[];
}

const allNavItems: NavItem[] = [
  { label: "Dashboard", route: "/dashboard", icon: "LayoutDashboard", roles: ["RESEARCH", "SPONSOR", "STAKEHOLDER"] },
  { label: "Trial Design", route: "/trial-design", icon: "FlaskConical", roles: ["RESEARCH", "SPONSOR"] },
  { label: "Visit & Schedule", route: "/visit-schedule", icon: "Calendar", roles: ["RESEARCH", "SPONSOR"] },
  { label: "Live Monitor", route: "/live-monitor", icon: "Activity", roles: ["RESEARCH"] },
  { label: "Patients", route: "/patients", icon: "Users", roles: ["RESEARCH", "SPONSOR", "STAKEHOLDER"] },
  { label: "Adverse Events", route: "/adverse-events", icon: "AlertTriangle", roles: ["RESEARCH", "SPONSOR"] },
  { label: "Documents", route: "/documents", icon: "FileText", roles: ["RESEARCH", "SPONSOR", "STAKEHOLDER"] },
  { label: "Forms", route: "/forms", icon: "ClipboardList", roles: ["RESEARCH", "SPONSOR", "STAKEHOLDER"] },
  { label: "Settings", route: "/settings", icon: "Settings", roles: ["RESEARCH", "SPONSOR", "STAKEHOLDER"] },
];

export function useRoleNav(userRole: UserRole | null) {
  const filteredNavItems = useMemo(() => {
    if (!userRole) return [];
    
    return allNavItems.filter(item => 
      !item.roles || item.roles.includes(userRole.badge)
    );
  }, [userRole]);

  const getActiveRoute = (currentPath: string): NavItem | null => {
    return filteredNavItems.find(item => 
      currentPath === item.route || currentPath.startsWith(item.route + "/")
    ) || null;
  };

  return {
    navItems: filteredNavItems,
    getActiveRoute,
  };
}
