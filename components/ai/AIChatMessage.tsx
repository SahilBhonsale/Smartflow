"use client";

import { AIMessage } from "@/types";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIChatMessageProps {
  message: AIMessage;
}

export function AIChatMessage({ message }: AIChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-xl shrink-0",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600"
            : "bg-gradient-to-br from-violet-500 to-indigo-600"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            : "bg-muted/70 text-foreground border border-border/40"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
