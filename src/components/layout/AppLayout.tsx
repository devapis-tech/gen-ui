"use client";

import { ReactNode, Suspense } from "react";
import { MainSidebar } from "./MainSidebar";
import dynamic from "next/dynamic";
import { useChatSidebar } from "@/contexts/ChatSidebarContext";

// Lazy-load the heavy CopilotKit sidebar — do NOT block page navigation
const PersistentChatSidebar = dynamic(
  () => import("@/components/ai/PersistentChatSidebar").then((m) => ({ default: m.PersistentChatSidebar })),
  { ssr: false }
);

interface AppLayoutProps {
  children: ReactNode;
}

function ChatSidebarSkeleton() {
  return (
    <div className="w-[320px] fixed right-0 top-0 h-full border-l border-gray-200 bg-white z-50 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
      </div>
      <div className="flex-1 p-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isChatOpen } = useChatSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Left Column: Main Navigation */}
      <MainSidebar />

      {/* Center Column: Main Content (Scrollable) */}
      <main
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out lg:ml-64 ${isChatOpen ? 'lg:mr-[320px]' : 'lg:mr-0'
          } ml-0 mr-0 pt-16 lg:pt-0`}
      >
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </main>

      {/* Right Column: AI Assistant — hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <Suspense fallback={<ChatSidebarSkeleton />}>
          <PersistentChatSidebar />
        </Suspense>
      </div>
    </div>
  );
}
