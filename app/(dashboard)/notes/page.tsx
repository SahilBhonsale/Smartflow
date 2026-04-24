"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { NotesList } from "@/components/notes/NotesList";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { useNotes } from "@/hooks/useNotes";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoteType } from "@/types";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotesPage() {
  const { notes, loading, fetchNotes, createNote, updateNote, deleteNote } =
    useNotes();
  const [activeNote, setActiveNote] = useState<NoteType | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Auto-select first note
  useEffect(() => {
    if (notes.length > 0 && !activeNote) {
      setActiveNote(notes[0]);
    }
  }, [notes, activeNote]);

  // Update active note when notes list changes (after edit)
  useEffect(() => {
    if (activeNote) {
      const updated = notes.find((n) => n.id === activeNote.id);
      if (updated) {
        setActiveNote(updated);
      }
    }
  }, [notes, activeNote]);

  const handleCreateNote = useCallback(async () => {
    const note = await createNote({ title: "Untitled Note" });
    if (note) {
      setActiveNote(note);
    }
  }, [createNote]);

  const handleDeleteNote = useCallback(
    async (id: string) => {
      const success = await deleteNote(id);
      if (success) {
        if (activeNote?.id === id) {
          setActiveNote(notes.find((n) => n.id !== id) ?? null);
        }
      }
      return success;
    },
    [deleteNote, activeNote, notes]
  );

  if (loading) {
    return (
      <>
        <Header title="Notes" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading notes..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Notes" />
      <div className="flex-1 flex overflow-hidden">
        {/* Notes List Sidebar */}
        <div className="w-[300px] border-r border-border/40 shrink-0 hidden md:flex flex-col">
          <NotesList
            notes={notes}
            activeNoteId={activeNote?.id ?? null}
            onNoteClick={setActiveNote}
            onCreateNote={handleCreateNote}
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 min-w-0">
          {activeNote ? (
            <NoteEditor
              key={activeNote.id}
              note={activeNote}
              onUpdate={updateNote}
              onDelete={handleDeleteNote}
            />
          ) : (
            <EmptyState
              icon={FileText}
              title="No note selected"
              description="Select a note from the list or create a new one to get started."
              action={
                <Button onClick={handleCreateNote} className="gap-2">
                  Create Note
                </Button>
              }
              className="h-full"
            />
          )}
        </div>

        {/* Mobile: show list only when no active note (simplified) */}
        {!activeNote && (
          <div className="flex md:hidden flex-col flex-1">
            <NotesList
              notes={notes}
              activeNoteId={null}
              onNoteClick={setActiveNote}
              onCreateNote={handleCreateNote}
            />
          </div>
        )}
      </div>
    </>
  );
}
