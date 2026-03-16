"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ChatSidebarContextType {
  isChatOpen: boolean;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
}

const ChatSidebarContext = createContext<ChatSidebarContextType | undefined>(undefined);

export function ChatSidebarProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("chat-sidebar-open");
    if (savedState !== null) {
      setIsChatOpen(savedState === "true");
    }
  }, []);

  const toggleChat = () => {
    setIsChatOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("chat-sidebar-open", newState.toString());
      return newState;
    });
  };

  const setChatOpen = (open: boolean) => {
    setIsChatOpen(open);
    localStorage.setItem("chat-sidebar-open", open.toString());
  };

  return (
    <ChatSidebarContext.Provider value={{ isChatOpen, toggleChat, setChatOpen }}>
      {children}
    </ChatSidebarContext.Provider>
  );
}

export function useChatSidebar() {
  const context = useContext(ChatSidebarContext);
  if (context === undefined) {
    throw new Error("useChatSidebar must be used within a ChatSidebarProvider");
  }
  return context;
}
