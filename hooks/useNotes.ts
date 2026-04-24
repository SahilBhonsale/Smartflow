"use client";

import { useState, useCallback } from "react";
import { NoteType, CreateNoteInput, UpdateNoteInput } from "@/types";
import toast from "react-hot-toast";

export function useNotes() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (input: CreateNoteInput): Promise<NoteType | null> => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create note");
      const note: NoteType = await res.json();
      setNotes((prev) => [note, ...prev]);
      toast.success("Note created!");
      return note;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create note");
      return null;
    }
  }, []);

  const updateNote = useCallback(
    async (id: string, input: UpdateNoteInput): Promise<NoteType | null> => {
      try {
        const res = await fetch(`/api/notes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) throw new Error("Failed to update note");
        const note: NoteType = await res.json();
        setNotes((prev) => prev.map((n) => (n.id === id ? note : n)));
        return note;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update note");
        return null;
      }
    },
    []
  );

  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note deleted!");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete note");
      return false;
    }
  }, []);

  return { notes, setNotes, loading, fetchNotes, createNote, updateNote, deleteNote };
}
