"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoleNav } from "@/lib/hooks/useRoleNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Menu, X } from "lucide-react";

export function MainSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openIssuesCount, setOpenIssuesCount] = useState(0);
  const pathname = usePathname();
  const { navItems } = useRoleNav();
  const { userRole, setUserRole } = useUserRole();

  useEffect(() => {
    const fetchOpenIssuesCount = async () => {
      try {
        const response = await fetch('/api/issues');
        if (response.ok) {
          const issues = await response.json();
          const openCount = issues.filter((issue: any) => issue.status === 'open').length;
          setOpenIssuesCount(openCount);
        }
      } catch (error) {
        console.error('Failed to fetch issues count:', error);
      }
    };

    fetchOpenIssuesCount();
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-cg-dark-blue text-cg-white rounded-lg shadow-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-cg-light-blue text-cg-dark-blue flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* App Logo/Name */}
        <div className="p-2 border-b border-cg-blue">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center h-12">
              <img 
                src="/Capgemini_Primary-spade_Capgemini-white.png" 
                alt="Capgemini Spade Logo" 
                className="h-full w-auto object-cover"
              />
            </div>
            <div className="flex items-center h-18">
              <img  
                src="/Capgemini_Primary-logo_Capgemini-white.png" 
                alt="Capgemini Logo" 
                className="h-full w-auto object-fill mt-2"
              />
            </div>
          </div>
          {/* <div className="text-center mt-3">
            <p className="text-[10px] text-cg-white font-bold">INTERNAL HUB • RAHUL</p>
          </div> */}
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
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                  ? "bg-cg-blue text-cg-white shadow-lg shadow-cg-blue/20"
                  : "text-cg-white hover:bg-cg-blue"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-cg-white" : "group-hover:text-cg-white"}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.route === "/issues" && openIssuesCount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {openIssuesCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Role Switcher */}
        <div className="p-4 border-t border-cg-blue">
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider text-cg-dark-blue font-bold mb-2">Active Role</p>
            <select
              value={userRole?.title || ""}
              onChange={(e) => {
                const selected = e.target.value;
                setUserRole({ id: selected, title: selected, badge: selected, description: selected });
              }}
              className="w-full bg-cg-turquoise border border-cg-blue text-cg-dark-blue text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cg-dark-blue"
            >
              <option value="ADMIN">Administrator</option>
              <option value="COORDINATOR">Coordinator</option>
              <option value="MONITOR">Monitor</option>
              <option value="PATIENT">Patient</option>
            </select>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-[10px] text-cg-blue text-center uppercase tracking-tighter">
              Powered by <span className="text-cg-dark-blue font-semibold">Multiplier Clinic Agent</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
