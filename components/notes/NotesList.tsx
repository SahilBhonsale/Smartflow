"use client";

import { NoteType } from "@/types";
import { NoteCard } from "./NoteCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileText } from "lucide-react";

interface NotesListProps {
  notes: NoteType[];
  activeNoteId: string | null;
  onNoteClick: (note: NoteType) => void;
  onCreateNote: () => void;
}

export function NotesList({
  notes,
  activeNoteId,
  onNoteClick,
  onCreateNote,
}: NotesListProps) {
  const [search, setSearch] = useState("");

  const filtered = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/40 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Notes</h3>
          <Button size="sm" onClick={onCreateNote} className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No notes yet"
            description="Create your first note to get started"
            className="py-8"
          />
        ) : (
          filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => onNoteClick(note)}
            />
          ))
        )}
      </div>
    </div>
  );
}
