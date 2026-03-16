"use client";

import { AssistantMessageProps } from "@copilotkit/react-ui";
import { Loader } from "lucide-react";

export const CustomAssistantMessage = (props: AssistantMessageProps) => {
  const { message, isLoading, subComponent } = props;

  // Convert message to string if it's not already
  // Handle complex content structures from various CopilotKit versions
  const getMessageContent = (msg: any): string => {
    if (!msg) return "";
    if (typeof msg === "string") return msg;

    // If it's a message object
    if (typeof msg === "object") {
      // Check content property (common in newest versions)
      if ("content" in msg) {
        const content = (msg as any).content;
        if (typeof content === "string") return content;
        if (Array.isArray(content)) {
          return content
            .map((part: any) => {
              if (typeof part === "string") return part;
              if (part && typeof part === "object") {
                if ("text" in part) return part.text;
                if ("content" in part) return part.content;
              }
              return "";
            })
            .join("");
        }
      }
      // Check text, message, or other common properties
      if ("text" in msg) return String((msg as any).text);
      if ("message" in msg) return String((msg as any).message);
      if ("display" in msg) return String((msg as any).display);
    }

    const stringified = String(msg);
    if (stringified === "[object Object]") return "";
    return stringified;
  };

  const messageText = getMessageContent(message);

  return (
    <div className="mb-4 px-2 assistant-message-container">
      {(messageText || isLoading) && (
        <div className={`p-4 rounded-2xl shadow-sm border transition-all duration-200 ${isLoading ? "bg-blue-50/50 border-blue-100 animate-pulse" : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
          }`}>
          <div className="text-sm text-gray-800 leading-relaxed">
            {messageText && (
              <div className="prose prose-sm max-w-none prose-slate">
                <div
                  dangerouslySetInnerHTML={{
                    __html: messageText
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-[11px] font-mono text-blue-700">$1</code>')
                      .replace(/\n\n/g, '<div class="h-2"></div>')
                      .replace(/\n/g, '<br />')
                  }}
                />
              </div>
            )}
            {isLoading && !messageText && (
              <div className="flex items-center gap-2 text-[11px] text-blue-600 font-semibold uppercase tracking-wider">
                <Loader className="h-3 w-3 animate-spin" />
                <span>Assistant is thinking...</span>
              </div>
            )}
          </div>
        </div>
      )}
      {subComponent && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 shadow-md bg-gray-50/30">
          {subComponent}
        </div>
      )}
    </div>
  );
};
