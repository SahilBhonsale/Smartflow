"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface AIPromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
  placeholder?: string;
}

export function AIPromptInput({
  onSubmit,
  loading,
  placeholder = "Ask SmartFlow AI anything...",
}: AIPromptInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSubmit(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-4 border-t border-border/40 bg-background"
    >
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="resize-none min-h-[44px] max-h-[120px] text-sm"
        rows={1}
        disabled={loading}
      />
      <Button
        type="submit"
        size="icon"
        className="h-[44px] w-[44px] shrink-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
        disabled={loading || !input.trim()}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
