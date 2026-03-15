"use client";

import dynamic from "next/dynamic";
import { ChatSidebar } from "./ChatSidebar";

// Export a dynamic version that only renders on the client
export const ClientSideChatSidebar = dynamic(() => Promise.resolve(ChatSidebar), {
  ssr: false,
  loading: () => (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex items-center justify-center">
      <div className="text-gray-500">Loading chat...</div>
    </div>
  ),
});
