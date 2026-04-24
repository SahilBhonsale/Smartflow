"use client";

import { useState, useCallback } from "react";
import { AIMessage, AIGenerateType } from "@/types";
import toast from "react-hot-toast";

export function useAI() {
  const [loading, setLoading] = useState(false);

  const summarizeNote = useCallback(async (noteId: string): Promise<string | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      });
      if (!res.ok) throw new Error("Failed to summarize note");
      const data = await res.json();
      return data.summary;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to summarize note");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const prioritizeTasks = useCallback(async (boardId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId }),
      });
      if (!res.ok) throw new Error("Failed to prioritize tasks");
      return await res.json();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to prioritize tasks");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateStream = useCallback(
    async (
      prompt: string,
      type: AIGenerateType,
      history: AIMessage[],
      onChunk: (chunk: string) => void
    ): Promise<void> => {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, type, history }),
        });
        if (!res.ok) throw new Error("Failed to generate response");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader available");

        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
          }
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to generate response");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, summarizeNote, prioritizeTasks, generateStream };
}
