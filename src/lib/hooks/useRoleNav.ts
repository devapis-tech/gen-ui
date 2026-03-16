"use client";

import { useUserRole } from "@/contexts/UserRoleContext";
import {
  LayoutDashboard,
  FlaskConical,
  Calendar,
  Activity,
  Users,
  AlertTriangle,
  FileText,
  ClipboardList,
  Settings,
  Bug
} from "lucide-react";

export interface NavItem {
  label: string;
  route: string;
  icon: any;
  roles: string[];
}

export const navItems: NavItem[] = [
  { label: "Dashboard", route: "/", icon: LayoutDashboard, roles: ["ADMIN", "COORDINATOR", "MONITOR", "PATIENT"] },
  { label: "Analytic Insight", route: "/chat-with-data", icon: Activity, roles: ["ADMIN", "COORDINATOR", "MONITOR"] },
  { label: "Trial Design", route: "/trial-design", icon: FlaskConical, roles: ["ADMIN", "COORDINATOR", "MONITOR"] },
  { label: "Visit & Schedule", route: "/visit-schedule", icon: Calendar, roles: ["ADMIN", "COORDINATOR"] },
  { label: "Live Monitor", route: "/live-monitor", icon: Activity, roles: ["ADMIN", "MONITOR", "COORDINATOR"] },
  { label: "Patients", route: "/patients", icon: Users, roles: ["ADMIN", "COORDINATOR", "MONITOR", "PATIENT"] },
  { label: "Adverse Events", route: "/adverse-events", icon: AlertTriangle, roles: ["ADMIN", "COORDINATOR", "MONITOR"] },
  { label: "Documents", route: "/documents", icon: FileText, roles: ["ADMIN", "COORDINATOR", "MONITOR"] },
  { label: "Forms", route: "/forms", icon: ClipboardList, roles: ["ADMIN", "COORDINATOR", "MONITOR", "PATIENT"] },
  { label: "Issue Tracker", route: "/issues", icon: Bug, roles: ["ADMIN", "COORDINATOR", "MONITOR", "PATIENT"] },
  { label: "Settings", route: "/settings", icon: Settings, roles: ["ADMIN"] },
];

export function useRoleNav() {
  const { userRole } = useUserRole();

  const filteredNav = navItems.filter((item) =>
    !item.roles || (userRole && item.roles.includes(userRole.title))
  );

  return { navItems: filteredNav, currentRole: userRole };
}
