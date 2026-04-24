"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AIMessage, AIGenerateType } from "@/types";
import { AIChatMessage } from "./AIChatMessage";
import { AIPromptInput } from "./AIPromptInput";
import { useAI } from "@/hooks/useAI";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, ListTodo, Lightbulb } from "lucide-react";

export function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [mode, setMode] = useState<AIGenerateType>("chat");
  const { loading, generateStream } = useAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (prompt: string) => {
    // Add user message
    const userMessage: AIMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    // Add empty assistant message that will be filled via streaming
    const assistantMessage: AIMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    // Stream the response
    await generateStream(prompt, mode, messages, (chunk) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.content += chunk;
        }
        return [...newMessages];
      });
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-background rounded-xl border border-border/40 overflow-hidden">
      {/* Mode Tabs */}
      <div className="px-4 pt-4 pb-2 border-b border-border/40 bg-muted/20">
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as AIGenerateType)}
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="chat" className="gap-1.5 text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="generate_tasks" className="gap-1.5 text-xs">
              <ListTodo className="h-3.5 w-3.5" />
              Generate Tasks
            </TabsTrigger>
            <TabsTrigger value="brainstorm" className="gap-1.5 text-xs">
              <Lightbulb className="h-3.5 w-3.5" />
              Brainstorm
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-6 mb-4">
              <Bot className="h-12 w-12 text-violet-500" />
            </div>
            <h3 className="text-lg font-semibold mb-1">SmartFlow AI</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {mode === "chat" &&
                "Ask me anything about productivity, time management, or task organization."}
              {mode === "generate_tasks" &&
                "Describe a goal or project, and I'll break it down into actionable tasks."}
              {mode === "brainstorm" &&
                "Share a topic or problem, and I'll help you brainstorm ideas and solutions."}
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <AIChatMessage key={idx} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <AIPromptInput
        onSubmit={handleSend}
        loading={loading}
        placeholder={
          mode === "chat"
            ? "Ask SmartFlow AI anything..."
            : mode === "generate_tasks"
            ? "Describe a goal or project..."
            : "Share a topic to brainstorm..."
        }
      />
    </div>
  );
}
