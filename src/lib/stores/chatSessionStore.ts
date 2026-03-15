import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
  id?: string;
}

interface ChatWindow {
  sessionId: string;
  startedAt: Date;
  messageCount: number;
}

interface ChatSessionState {
  sessionId: string;
  userId: string | null;
  messages: Message[];
  tokenCount: number;
  chatWindows: ChatWindow[];
  
  // Actions
  setMessages: (messages: Message[]) => void;
  setUserId: (userId: string | null) => void;
  startNewSession: (userId?: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  logout: () => void;
}

// Simple token estimation function (roughly 4 characters per token)
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4);
};

const calculateTokenCount = (messages: Message[]): number => {
  return messages.reduce((total, message) => {
    return total + estimateTokens(message.content || '');
  }, 0);
};

export const useChatSessionStore = create<ChatSessionState>()(
  persist(
    (set, get) => ({
      sessionId: uuidv4(),
      userId: null,
      messages: [],
      tokenCount: 0,
      chatWindows: [],

      setMessages: (messages: Message[]) => {
        const tokenCount = calculateTokenCount(messages);
        set({ 
          messages, 
          tokenCount,
          chatWindows: get().chatWindows.map(window => 
            window.sessionId === get().sessionId 
              ? { ...window, messageCount: messages.length }
              : window
          )
        });
      },

      setUserId: (userId: string | null) => {
        set({ userId });
      },

      startNewSession: (userId?: string) => {
        const currentSession = get();
        const newSessionId = uuidv4();
        
        // Archive current window if it has messages
        if (currentSession.messages.length > 0) {
          const chatWindow: ChatWindow = {
            sessionId: currentSession.sessionId,
            startedAt: new Date(),
            messageCount: currentSession.messages.length
          };
          
          set({
            chatWindows: [...currentSession.chatWindows, chatWindow]
          });
        }

        // Start new session
        set({
          sessionId: newSessionId,
          userId: userId || currentSession.userId,
          messages: [],
          tokenCount: 0
        });
      },

      addMessage: (message: Message) => {
        const currentMessages = get().messages;
        const newMessages = [...currentMessages, message];
        const tokenCount = calculateTokenCount(newMessages);
        
        // Auto-rotate session if token limit exceeded (Improvement 01)
        if (tokenCount > 8000) {
          get().startNewSession();
          // After rotation, the first message in the new session is the one that triggered the overflow
          get().addMessage(message);
          return;
        }

        set({
          messages: newMessages,
          tokenCount,
          chatWindows: get().chatWindows.map(window => 
            window.sessionId === get().sessionId 
              ? { ...window, messageCount: newMessages.length }
              : window
          )
        });
      },

      clearMessages: () => {
        set({
          messages: [],
          tokenCount: 0,
          chatWindows: get().chatWindows.map(window => 
            window.sessionId === get().sessionId 
              ? { ...window, messageCount: 0 }
              : window
          )
        });
      },

      logout: () => {
        set({
          userId: null,
          messages: [],
          tokenCount: 0,
          sessionId: uuidv4()
        });
      }
    }),
    {
      name: 'clinical-trial-chat-session',
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          if (!item) return null;
          
          const parsed = JSON.parse(item);
          return {
            ...parsed,
            chatWindows: parsed.chatWindows?.map((window: any) => ({
              ...window,
              startedAt: new Date(window.startedAt)
            })) || []
          };
        },
        setItem: (name, value) => {
          const state = value as unknown as ChatSessionState;
          const serialized = JSON.stringify({
            ...state,
            chatWindows: (state.chatWindows || []).map((window: any) => ({
              ...window,
              startedAt: window.startedAt instanceof Date 
                ? window.startedAt.toISOString() 
                : window.startedAt
            }))
          });
          localStorage.setItem(name, serialized);
        },
        removeItem: (name) => localStorage.removeItem(name),
      }
    }
  )
);
