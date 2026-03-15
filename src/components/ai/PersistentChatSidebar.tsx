"use client";

import { useState, useEffect, useRef } from "react";
// import { useCopilotChat } from "@copilotkit/react-core";
import { useChatSessionStore } from "@/lib/stores/chatSessionStore";

export function PersistentChatSidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Zustand store for session management
  const { 
    sessionId, 
    userId, 
    setUserId, 
    startNewSession, 
    logout,
    messages,
    addMessage
  } = useChatSessionStore();
  
  // Temporarily disable CopilotKit hooks for testing
  // const { visibleMessages, appendMessage, isLoading } = useCopilotChat();
  const visibleMessages = messages;
  const isLoading = false;

  // Initialize user ID (in a real app, this would come from authentication)
  useEffect(() => {
    // For demo purposes, we'll use a simple user ID
    // In production, this would come from your auth system
    if (!userId) {
      setUserId("demo-user");
    }
  }, [userId, setUserId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  // Simple token estimation
  const getTokenCount = () => {
    if (!visibleMessages) return 0;
    return visibleMessages.reduce((total, message) => {
      return total + Math.ceil(((message as any).content?.length || 0) / 4);
    }, 0);
  };

  const tokenCount = getTokenCount();

  // Handle token overflow - auto-start new session
  useEffect(() => {
    if (tokenCount > 8000) {
      startNewSession();
    }
  }, [tokenCount, startNewSession]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    try {
      // Temporarily use local store instead of CopilotKit
      addMessage({
        role: "user",
        content: userMessage,
        createdAt: new Date(),
        id: Date.now().toString()
      });

      // Simulate AI response
      setTimeout(() => {
        addMessage({
          role: "assistant",
          content: "I'm a demo AI assistant. The CopilotKit integration is temporarily disabled for testing the layout.",
          createdAt: new Date(),
          id: (Date.now() + 1).toString()
        });
      }, 1000);

      // if (appendMessage) {
      //   await appendMessage(userMessage as any);
      // }
    } catch (error) {
      console.error("Failed to send message to Copilot:", error);
    }
  };

  const handleNewChat = () => {
    startNewSession();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`h-full bg-white border-l border-gray-200 shadow-lg transition-all duration-300 lg:fixed lg:right-0 lg:top-0 lg:w-80 lg:z-50 ${
      isMinimized ? "lg:w-12" : ""
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isMinimized && (
          <>
            <div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">Session: {sessionId.slice(0, 8)}</span>
                {tokenCount > 0 && (
                  <span className="text-xs text-blue-600">~{tokenCount} tokens</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 rounded lg:block hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </>
        )}
        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 hover:bg-gray-100 rounded hidden lg:block"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {/* Mobile close button */}
        <button className="lg:hidden p-1 hover:bg-gray-100 rounded">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Session Controls */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={handleNewChat}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  New Chat
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
              >
                Logout
              </button>
            </div>
            {tokenCount > 6000 && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Session approaching token limit ({tokenCount}/8000). New session will start automatically.
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:h-[calc(100vh-200px)] h-[calc(50vh-120px)]">
            {(!visibleMessages || visibleMessages.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-2">👋 Hi! I'm your clinical trial assistant.</p>
                <p className="text-sm">How can I help you today?</p>
              </div>
            )}
            
            {/* Render messages */}
            {visibleMessages?.map((message, index) => (
              <div
                key={message.id || index}
                className={`mb-4 ${
                  (message as any).role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    (message as any).role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{(message as any).content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about clinical trials..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
