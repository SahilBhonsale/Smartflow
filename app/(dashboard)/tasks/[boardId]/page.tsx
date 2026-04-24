"use client";

import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useBoard } from "@/hooks/useTasks";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const { board, loading, fetchBoard } = useBoard();

  useEffect(() => {
    if (boardId) {
      fetchBoard(boardId);
    }
  }, [boardId, fetchBoard]);

  const handleBoardUpdate = useCallback(() => {
    fetchBoard(boardId);
  }, [boardId, fetchBoard]);

  if (loading || !board) {
    return (
      <>
        <Header title="Board" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading board..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={board.name} />
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        <KanbanBoard board={board} onBoardUpdate={handleBoardUpdate} />
      </div>
    </>
  );
}
