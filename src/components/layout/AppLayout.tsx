"use client";

import { ReactNode, useState } from "react";
import { ClientSideChatSidebar } from "@/components/ClientSideChatSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Main Sidebar - responsive behavior */}
      <div className={`
        fixed lg:relative lg:translate-x-0 transition-transform duration-300 z-40
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="w-64 lg:w-64 md:w-16 bg-gray-900 text-white p-4 lg:p-6 md:p-4 flex flex-col h-full">
          {/* App Logo/Name */}
          <div className="border-b border-gray-800 pb-4 mb-4">
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
          <nav className="flex-1 space-y-2">
            {['Dashboard', 'Trial Design', 'Patients', 'Settings'].map((item) => (
              <button
                key={item}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors md:justify-center md:px-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                title={item}
              >
                <div className="w-5 h-5 bg-gray-600 rounded"></div>
                <span className="font-medium lg:block md:hidden">{item}</span>
              </button>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="border-t border-gray-800 pt-4">
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
      </div>
      
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content Area - responsive spacing */}
      <main className="flex-1 overflow-hidden lg:ml-64">
        <div className="h-full overflow-y-auto pt-16 lg:pt-0">
          {children}
        </div>
      </main>
      
      {/* Chat Sidebar */}
      <ClientSideChatSidebar />
    </div>
  );
}
