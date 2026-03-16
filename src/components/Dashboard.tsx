"use client";

import { useState } from "react";
import { useCopilotReadable } from "@copilotkit/react-core";
import { useUserRole } from "@/contexts/UserRoleContext";
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  UserPlus,
  Plus,
  Calendar,
  Upload
} from "lucide-react";
import Link from "next/link";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "stable";
  icon: React.ReactNode;
  href: string;
}

function KPICard({ title, value, change, changeType, icon, href }: KPICardProps) {
  const changeColors = {
    increase: "text-green-600",
    decrease: "text-red-600", 
    stable: "text-gray-600"
  };

  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer hover:scale-[1.02] transition-transform">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className={`text-sm mt-1 ${changeColors[changeType]}`}>{change}</p>
          </div>
          <div className="text-blue-600">
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function QuickAction({ title, description, icon, href, color }: QuickActionProps) {
  return (
    <Link href={href} className="block">
      <div className={`${color} rounded-lg p-4 text-white hover:opacity-90 transition-opacity cursor-pointer`}>
        <div className="flex items-center space-x-3">
          <div className="text-white">
            {icon}
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm opacity-90">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Dashboard() {
  const { userRole } = useUserRole();
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Mock trial data - in real app this would come from API
  const trialData = {
    name: "EMERALD-3",
    fullTitle: "LY4268989 in Adults With Moderately to Severely Active Ulcerative Colitis",
    nctId: "NCT07415044",
    phase: "Phase 2",
    sponsor: "Eli Lilly",
    status: "NOT_YET_RECRUITING",
    totalPatients: 100,
    compliance: "100%",
    activeAEs: 6,
    saes: 3
  };

  // Make dashboard data available to Copilot
  useCopilotReadable({
    description: "Current trial overview and dashboard KPIs",
    value: {
      trialName: trialData.name,
      nctId: trialData.nctId,
      totalPatients: trialData.totalPatients,
      activeAEs: trialData.activeAEs,
      compliance: trialData.compliance,
      phase: trialData.phase,
      sponsor: trialData.sponsor,
      status: trialData.status,
      userRole: userRole?.title,
      upcomingVisits: [
        { patient: "EMR-001", date: "2024-03-20", type: "Screening" },
        { patient: "EMR-002", date: "2024-03-21", type: "Baseline" },
        { patient: "EMR-003", date: "2024-03-22", type: "Week 2" }
      ],
      recentAEs: [
        { patient: "EMR-004", type: "Headache", severity: "Mild", date: "2024-03-18" },
        { patient: "EMR-005", type: "Nausea", severity: "Moderate", date: "2024-03-17" }
      ]
    }
  });

  const kpiData = [
    {
      title: "Patients",
      value: trialData.totalPatients.toString(),
      change: "↑12%",
      changeType: "increase" as const,
      icon: <Users className="w-6 h-6" />,
      href: "/patients"
    },
    {
      title: "Compliance",
      value: trialData.compliance,
      change: "↑5%",
      changeType: "increase" as const,
      icon: <CheckCircle className="w-6 h-6" />,
      href: "/chat-with-data?metric=compliance"
    },
    {
      title: "Active AEs",
      value: trialData.activeAEs.toString(),
      change: "↓2",
      changeType: "decrease" as const,
      icon: <AlertTriangle className="w-6 h-6" />,
      href: "/adverse-events?status=ongoing"
    },
    {
      title: "SAEs",
      value: trialData.saes.toString(),
      change: "Stable",
      changeType: "stable" as const,
      icon: <FileText className="w-6 h-6" />,
      href: "/adverse-events?severity=serious"
    }
  ];

  const quickActions = [
    {
      title: "Enroll Patient",
      description: "Add new patient to trial",
      icon: <UserPlus className="w-5 h-5" />,
      href: "/patients/new",
      color: "bg-accent"
    },
    {
      title: "Report AE",
      description: "Log adverse event",
      icon: <AlertTriangle className="w-5 h-5" />,
      href: "/adverse-events/new",
      color: "bg-orange-600"
    },
    {
      title: "Open eCRF",
      description: "Electronic case report form",
      icon: <FileText className="w-5 h-5" />,
      href: "/forms",
      color: "bg-green-600"
    },
    {
      title: "View Schedule",
      description: "Patient visit calendar",
      icon: <Calendar className="w-5 h-5" />,
      href: "/visit-schedule",
      color: "bg-purple-600"
    },
    {
      title: "Upload Document",
      description: "Add trial documents",
      icon: <Upload className="w-5 h-5" />,
      href: "/documents",
      color: "bg-gray-600"
    }
  ];

  if (isFirstTime) {
    // Show role selection for first-time users
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Multiplier AI</h2>
          <p className="text-gray-600 mb-6">Let's set up your role to get started</p>
          <button 
            onClick={() => setIsFirstTime(false)}
            className="bg-accent text-white px-6 py-3 rounded-lg bg-accent-hover"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trial Identity Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{trialData.name}</h1>
            <p className="text-sm text-gray-600 mt-1">{trialData.fullTitle}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm">
              <span className="text-gray-500">{trialData.nctId}</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-500">{trialData.phase}</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-500">Sponsor: {trialData.sponsor}</span>
              <span className="text-gray-500">|</span>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                {trialData.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          {userRole && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Role</p>
              <p className="font-medium text-gray-900">{userRole.title}</p>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Visits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Visits</h3>
          <div className="space-y-3">
            {[
              { patient: "EMR-001", date: "2024-03-20", type: "Screening" },
              { patient: "EMR-002", date: "2024-03-21", type: "Baseline" },
              { patient: "EMR-003", date: "2024-03-22", type: "Week 2" }
            ].map((visit, index) => (
              <Link key={index} href={`/visit-schedule?patient=${visit.patient}`} className="block">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">{visit.patient}</p>
                    <p className="text-sm text-gray-600">{visit.type}</p>
                  </div>
                  <p className="text-sm text-gray-500">{visit.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent AEs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Adverse Events</h3>
          <div className="space-y-3">
            {[
              { patient: "EMR-004", type: "Headache", severity: "Mild", date: "2024-03-18" },
              { patient: "EMR-005", type: "Nausea", severity: "Moderate", date: "2024-03-17" }
            ].map((ae, index) => (
              <Link key={index} href={`/adverse-events?id=AE-${index + 1}`} className="block">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-gray-900">{ae.patient}</p>
                    <p className="text-sm text-gray-600">{ae.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs px-2 py-1 rounded ${
                      ae.severity === "Mild" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {ae.severity}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{ae.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
