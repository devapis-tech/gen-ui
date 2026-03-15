"use client";

import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export function SimpleChatSidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        })));
      } catch (error) {
        console.error("Failed to load chat sessions:", error);
      }
    }
    
    // Create initial session if none exist
    if (!savedSessions || JSON.parse(savedSessions).length === 0) {
      createNewSession();
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("chatSessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, currentSessionId]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    return newSession;
  };

  const switchSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const addMessageToSession = (sessionId: string, message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        const updated = { ...s, messages: [...s.messages, newMessage], updatedAt: new Date() };
        
        // Auto-generate title from first user message
        if (s.messages.length === 0 && message.role === "user") {
          const title = message.content.substring(0, 30) + (message.content.length > 30 ? "..." : "");
          updated.title = title;
        }
        
        return updated;
      }
      return s;
    }));
  };

  const generateFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm your clinical trial assistant. I can help you with:\n\n• Extracting data from clinical trial links\n• Processing PDF documents\n• Navigating the form workflow\n• Answering questions about trial management\n\nHow can I help you today?";
    }
    
    if (lowerMessage.includes("nct") || lowerMessage.includes("trial") || lowerMessage.includes("extract")) {
      return "I can help you extract clinical trial data! You can:\n\n1. **Import by NCT ID**: Enter an NCT number like NCT12345678\n2. **Import by Link**: Paste a clinicaltrials.gov link\n3. **Upload PDF**: Upload a protocol or trial document\n\nNavigate to the Import Trial Data section to get started!";
    }
    
    if (lowerMessage.includes("pdf") || lowerMessage.includes("upload")) {
      return "For PDF uploads:\n\n1. Go to the Import Trial Data section\n2. Choose the 'Import from PDF Document' option\n3. Upload your clinical trial protocol, investigator brochure, or related document\n4. I'll automatically extract and structure the trial data for you\n\nThe system supports PDFs with trial information, protocols, and regulatory documents.";
    }
    
    if (lowerMessage.includes("form") || lowerMessage.includes("workflow")) {
      return "The clinical trial form workflow includes these steps:\n\n1. **Role Selection**: Choose your role (Internal Team, Organization, or Client)\n2. **Status Selection**: New Trial or Ongoing Trial\n3. **Data Import**: NCT ID, link, or PDF upload\n4. **Form Selection**: Choose required forms\n5. **Workspace**: Review and edit trial information\n6. **Trial Design**: View comprehensive trial overview\n7. **Patient Management**: Monitor visits and safety data\n8. **Review & Export**: Finalize your forms\n\nEach step is optimized for your specific role and needs.";
    }
    
    if (lowerMessage.includes("patient") || lowerMessage.includes("visit") || lowerMessage.includes("safety")) {
      return "The Patient Management section provides:\n\n**eCFR/CFR Data**:\n• Patient enrollment tracking\n• Visit scheduling\n• Case report form management\n\n**Safety & Adverse Events**:\n• SAE and AE reporting\n• Severity tracking\n• Follow-up management\n\n**Live Monitor**:\n• Real-time trial metrics\n• Site performance tracking\n• Activity feeds\n\nNavigate to Patient Management after completing the Trial Design section.";
    }
    
    return "I'm here to help with your clinical trial forms! I can assist with:\n\n• Data extraction from trials and PDFs\n• Form workflow navigation\n• Trial design overview\n• Patient management\n• Safety reporting\n\nWhat would you like to know more about?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentSessionId) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to session
    addMessageToSession(currentSessionId, {
      role: "user",
      content: userMessage
    });

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiResponse = generateFallbackResponse(userMessage);
      addMessageToSession(currentSessionId!, {
        role: "assistant",
        content: aiResponse
      });
      setIsLoading(false);
    }, 1000);
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-lg transition-all duration-300 z-50 ${
      isMinimized ? "w-12" : "w-96"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isMinimized && (
          <>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
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
              <span className="text-sm font-medium text-gray-700">Sessions</span>
              <button
                onClick={createNewSession}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                New Chat
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    currentSessionId === session.id ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                >
                  <button
                    onClick={() => switchSession(session.id)}
                    className="flex-1 text-left text-sm truncate"
                  >
                    {session.title}
                  </button>
                  {sessions.length > 1 && (
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-280px)]">
            {currentSession?.messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-2">👋 Hi! I'm your clinical trial assistant.</p>
                <p className="text-sm">How can I help you today?</p>
              </div>
            )}
            
            {/* Render session messages */}
            {currentSession?.messages.map(message => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
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
