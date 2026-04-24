"use client";

import { useState, useEffect, useCallback } from "react";
import { NoteType, UpdateNoteInput } from "@/types";
import { TiptapEditor } from "./TiptapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin, PinOff, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useAI } from "@/hooks/useAI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NoteEditorProps {
  note: NoteType;
  onUpdate: (id: string, data: UpdateNoteInput) => Promise<NoteType | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export function NoteEditor({ note, onUpdate, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const { summarizeNote, loading: aiLoading } = useAI();

  // Debounced auto-save for content changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (content !== note.content) {
        onUpdate(note.id, { content });
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [content, note.id, note.content, onUpdate]);

  // Save title on blur
  const handleTitleBlur = useCallback(() => {
    if (title !== note.title && title.trim()) {
      onUpdate(note.id, { title: title.trim() });
    }
  }, [title, note.title, note.id, onUpdate]);

  // Update local state when note changes (different note selected)
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);

  const handleSummarize = async () => {
    const result = await summarizeNote(note.id);
    if (result) {
      setSummary(result);
      setSummaryOpen(true);
    }
  };

  const handleTogglePin = () => {
    onUpdate(note.id, { isPinned: !note.isPinned });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-border/40">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="text-lg font-semibold border-0 px-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Note title..."
        />
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleSummarize}
            disabled={aiLoading}
            title="AI Summarize"
          >
            {aiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-violet-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleTogglePin}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            {note.isPinned ? (
              <PinOff className="h-4 w-4 text-amber-500" />
            ) : (
              <Pin className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(note.id)}
            title="Delete Note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <TiptapEditor content={content} onUpdate={setContent} />
      </div>

      {/* AI Summary Dialog */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              AI Summary
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {summary}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
