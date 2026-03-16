"use client";

import { useState, useEffect, useRef } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { useChatSessionStore } from "../lib/stores/chatSessionStore";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatSidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Zustand store
  const {
    sessionId,
    userId,
    messages: storeMessages,
    tokenCount,
    chatWindows,
    setMessages,
    setUserId,
    startNewSession,
    addMessage,
    clearMessages,
    logout
  } = useChatSessionStore();

  // Temporarily disable CopilotKit to test store functionality
  // const useCopilotChat = () => ({
  //   visibleMessages: [],
  //   appendMessage: undefined,
  //   isLoading: false
  // });

  let visibleMessages: any[] = [];
  let appendMessage: ((message: any) => Promise<void>) | undefined;
  let isLoading = false;

  // try {
  //   const copilotChat = useCopilotChat();
  //   visibleMessages = copilotChat.visibleMessages || [];
  //   appendMessage = copilotChat.appendMessage;
  //   isLoading = copilotChat.isLoading;
  // } catch (error) {
  //   console.warn("CopilotKit not available, using fallback chat");
  // }

  // Sync Copilot messages with store
  useEffect(() => {
    if (Array.isArray(visibleMessages) && visibleMessages.length > 0) {
      const convertedMessages = visibleMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        createdAt: new Date(),
        id: msg.id || Date.now().toString()
      }));
      setMessages(convertedMessages);
    }
  }, [visibleMessages, setMessages]);

  // Initialize sessionId on client if empty
  useEffect(() => {
    if (!sessionId && typeof window !== 'undefined') {
      // This will be handled by the store's persist middleware
      // but we ensure we have a valid session ID
    }
  }, [sessionId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storeMessages, visibleMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to store
    addMessage({
      role: "user",
      content: userMessage,
      createdAt: new Date(),
      id: Date.now().toString()
    });

    // Send to Copilot if available, otherwise add a fallback response
    if (appendMessage) {
      try {
        await appendMessage(userMessage);
      } catch (error) {
        console.error("Failed to send message to Copilot:", error);
        // Add fallback response
        addMessage({
          role: "assistant",
          content: "I'm sorry, I'm currently unable to process your request. Please try again later or use the manual data entry options.",
          createdAt: new Date(),
          id: Date.now().toString()
        });
      }
    } else {
      // Add fallback response when Copilot is not available
      setTimeout(() => {
        addMessage({
          role: "assistant",
          content: "AI Assistant is currently unavailable. You can still use all the manual features like PDF upload, link extraction, and form management.",
          createdAt: new Date(),
          id: Date.now().toString()
        });
      }, 1000);
    }
  };

  const handleNewSession = () => {
    startNewSession(userId || undefined);
  };

  const handleLogout = () => {
    logout();
  };

  // Display messages from store (prioritize store over Copilot messages)
  const displayMessages = storeMessages.length > 0 ? storeMessages : visibleMessages;

  return (
    <div className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-lg transition-all duration-300 z-50 ${isMinimized ? "w-12" : "w-96"
      }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isMinimized && (
          <>
            <h3 className="font-semibold text-gray-900">Multiplier Clinic Agent</h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 rounded"
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
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Session Management */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Session {sessionId.slice(0, 8)}...
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleNewSession}
                  className="px-2 py-1 text-xs bg-accent text-white rounded bg-accent-hover"
                >
                  New Chat
                </button>
                {userId && (
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>

            {/* Session Info */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>Messages: {storeMessages.length}</div>
              <div>Tokens: ~{tokenCount}</div>
              <div>Past sessions: {chatWindows.length}</div>
              {userId && <div>User: {userId.slice(0, 8)}...</div>}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-200px)]">
            {displayMessages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-2">👋 Hi! I'm your Multiplier Clinic Agent.</p>
                <p className="text-sm">How can I help you today?</p>
              </div>
            )}

            {/* Render messages */}
            {displayMessages.map((message, index) => (
              <div
                key={message.id || `msg-${index}`}
                className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"
                  }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${message.role === "user"
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-gray-900"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {(message.timestamp || message.createdAt) && (
                    <p className="text-xs opacity-70 mt-1">
                      {(message.timestamp || message.createdAt) instanceof Date
                        ? (message.timestamp || message.createdAt).toLocaleTimeString()
                        : new Date(message.timestamp || message.createdAt).toLocaleTimeString()
                      }
                    </p>
                  )}
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
