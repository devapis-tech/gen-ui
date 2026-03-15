"use client";

import { ReactNode } from "react";
import { MainSidebar } from "./MainSidebar";
import { PersistentChatSidebar } from "@/components/ai/PersistentChatSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Column: Main Navigation (Fixed 256px) */}
      <MainSidebar />

      {/* Center Column: Main Content (Scrollable) */}
      <main className="flex-1 flex flex-col relative ml-64 mr-[320px] overflow-hidden">
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </main>

      {/* Right Column: AI Assistant (Fixed 320px) */}
      <PersistentChatSidebar />
    </div>
  );
}
