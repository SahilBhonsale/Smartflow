"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { NoteType, UpdateNoteInput } from "@/types";
import toast from "react-hot-toast";

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  const [note, setNote] = useState<NoteType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await fetch(`/api/notes/${noteId}`);
        if (!res.ok) throw new Error("Note not found");
        const data = await res.json();
        setNote(data);
      } catch {
        toast.error("Note not found");
        router.push("/notes");
      } finally {
        setLoading(false);
      }
    }
    if (noteId) fetchNote();
  }, [noteId, router]);

  const handleUpdate = async (
    id: string,
    data: UpdateNoteInput
  ): Promise<NoteType | null> => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated: NoteType = await res.json();
      setNote(updated);
      return updated;
    } catch {
      toast.error("Failed to update note");
      return null;
    }
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Note deleted");
      router.push("/notes");
      return true;
    } catch {
      toast.error("Failed to delete note");
      return false;
    }
  };

  if (loading || !note) {
    return (
      <>
        <Header title="Note" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading note..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={note.title} />
      <div className="flex-1 overflow-hidden">
        <NoteEditor
          key={note.id}
          note={note}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
