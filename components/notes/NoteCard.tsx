"use client";

import { NoteType } from "@/types";
import { Pin, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: NoteType;
  isActive: boolean;
  onClick: () => void;
}

function getExcerpt(content: string, maxLength = 80): string {
  try {
    const parsed = JSON.parse(content);
    // Extract text from Tiptap JSON
    const extractText = (node: Record<string, unknown>): string => {
      if (node.type === "text" && typeof node.text === "string") return node.text;
      if (Array.isArray(node.content)) {
        return (node.content as Record<string, unknown>[])
          .map(extractText)
          .join(" ");
      }
      return "";
    };
    const text = extractText(parsed).trim();
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text || "Empty note";
  } catch {
    const stripped = content.replace(/<[^>]*>/g, "").trim();
    return stripped.length > maxLength
      ? stripped.slice(0, maxLength) + "..."
      : stripped || "Empty note";
  }
}

export function NoteCard({ note, isActive, onClick }: NoteCardProps) {
  const excerpt = getExcerpt(note.content);
  const dateStr = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3.5 rounded-xl border transition-all duration-200",
        isActive
          ? "bg-primary/5 border-primary/20 shadow-sm"
          : "bg-card border-border/40 hover:bg-muted/50 hover:border-border"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <h4 className="text-sm font-medium text-foreground truncate">
            {note.title}
          </h4>
        </div>
        {note.isPinned && (
          <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0 fill-amber-500" />
        )}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 ml-5.5 mb-2">
        {excerpt}
      </p>
      <span className="text-[10px] text-muted-foreground/70 ml-5.5">
        {dateStr}
      </span>
    </button>
  );
}
