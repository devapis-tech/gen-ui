"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
// Styles are now imported globally in globals.css — no per-component import needed
import { useChatSessionStore } from "@/lib/stores/chatSessionStore";

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
        instructions="You are a clinical trial assistant. Help users with protocol design, visit scheduling, and patient monitoring."
      >
        <div className="hidden" />
      </CopilotSidebar>
    </div>
  );
}
