"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useChatSessionStore } from "@/lib/stores/chatSessionStore";
import { useEffect } from "react";

export function PersistentChatSidebar() {
  const { messages, setMessages, sessionId } = useChatSessionStore();

  return (
    <div className="w-[320px] fixed right-0 top-0 h-full border-l border-gray-200 bg-white z-50">
      <CopilotSidebar
        defaultOpen={true}
        clickOutsideToClose={false}
        labels={{
          title: "Multiplier Clinic Agent",
          initial: "I'm your Multiplier Clinic Agent. How can I assist you with the clinical trial today?",
        }}
        // Sync messages if needed, but CopilotSidebar usually handles internal state
        // unless we want to provide the initial messages from our store on mount
        // or keep them in sync.
        instructions="You are a clinical trial assistant. Help users with protocol design, visit scheduling, and patient monitoring."
      >
        <div className="hidden">
          {/* This could be used to pass children if needed, 
                but CopilotSidebar provides its own chat interface */}
        </div>
      </CopilotSidebar>
    </div>
  );
}
