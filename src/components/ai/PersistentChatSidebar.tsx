"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";
import { useChatSessionStore } from "@/lib/stores/chatSessionStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatSidebar } from "@/contexts/ChatSidebarContext";
import { CustomAssistantMessage } from "./CustomAssistantMessage";

export function PersistentChatSidebar() {
  const { messages, setMessages, sessionId } = useChatSessionStore();
  const { visibleMessages } = useCopilotChat();
  const { isChatOpen, toggleChat } = useChatSidebar();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`fixed top-4 z-50 bg-white border border-gray-200 rounded-l-lg shadow-md p-2 transition-all duration-300 ${isChatOpen ? 'right-[320px]' : 'right-0'
          } hover:bg-gray-50`}
      >
        {isChatOpen ? (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* CopilotSidebar - Let it handle its own positioning */}
      <div className={`fixed right-0 top-0 h-full w-[320px] z-40 bg-white border-l border-gray-200 shadow-xl transition-all duration-300 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <CopilotSidebar
          defaultOpen={isChatOpen}
          clickOutsideToClose={false}
          AssistantMessage={CustomAssistantMessage}
          labels={{
            title: "Clinical Trial Assistant",
            initial: "Hello! I'm your AI-powered clinical trial assistant. I can help you with patient management, adverse event reporting, visit scheduling, and data analysis. How can I assist you today?",
            placeholder: "Ask about patients, trials, adverse events, or data analysis..."
          }}
          instructions="You are a specialized clinical trial assistant for the EMERALD-3 trial. You have access to real-time dashboard data including patient counts, compliance metrics, adverse events, and visit schedules. Help users with:

1. Patient management (search, enroll, track status)
2. Adverse event reporting and monitoring
3. Visit scheduling and compliance tracking
4. Data analysis and trial insights
5. Protocol guidance and compliance

Always be professional, accurate, and prioritize patient safety. When discussing medical information, include appropriate disclaimers about consulting healthcare professionals."
        >
          <div className="hidden" />
        </CopilotSidebar>
      </div>
    </>
  );
}
