"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoards, useBoard } from "@/hooks/useTasks";
import { useAI } from "@/hooks/useAI";
import {
  Plus,
  Kanban,
  Sparkles,
  Loader2,
  Trash2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { AIPrioritizedTask } from "@/types";

export default function TasksPage() {
  const { boards, loading: boardsLoading, fetchBoards, createBoard, deleteBoard } =
    useBoards();
  const { board, loading: boardLoading, fetchBoard } = useBoard();
  const { prioritizeTasks, loading: aiLoading } = useAI();

  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [deleteBoardOpen, setDeleteBoardOpen] = useState(false);
  const [prioritizeOpen, setPrioritizeOpen] = useState(false);
  const [prioritizeResults, setPrioritizeResults] = useState<
    AIPrioritizedTask[]
  >([]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Auto-select first board when boards load
  useEffect(() => {
    if (boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  // Fetch board data when selection changes
  useEffect(() => {
    if (selectedBoardId) {
      fetchBoard(selectedBoardId);
    }
  }, [selectedBoardId, fetchBoard]);

  const handleBoardUpdate = useCallback(() => {
    if (selectedBoardId) {
      fetchBoard(selectedBoardId);
    }
  }, [selectedBoardId, fetchBoard]);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    const created = await createBoard(newBoardName.trim());
    if (created) {
      setSelectedBoardId(created.id);
      setNewBoardName("");
      setCreateBoardOpen(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (selectedBoardId) {
      await deleteBoard(selectedBoardId);
      setSelectedBoardId(boards.find((b) => b.id !== selectedBoardId)?.id ?? "");
      setDeleteBoardOpen(false);
    }
  };

  const handlePrioritize = async () => {
    if (!selectedBoardId) return;
    const result = await prioritizeTasks(selectedBoardId);
    if (result?.prioritizedTasks) {
      setPrioritizeResults(result.prioritizedTasks);
      setPrioritizeOpen(true);
    }
  };

  const loading = boardsLoading || boardLoading;

  return (
    <>
      <Header title="Tasks" />
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 lg:px-8 py-6">
          {/* Board Controls */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-xl"
                onClick={() => setCreateBoardOpen(true)}
              >
                <Plus className="h-4 w-4" />
                New Board
              </Button>

              {selectedBoardId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => setDeleteBoardOpen(true)}
                  title="Delete Board"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {selectedBoardId && (
              <Button
                onClick={handlePrioritize}
                disabled={aiLoading}
                className="gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
              >
                {aiLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                AI Prioritize
              </Button>
            )}
          </div>

          {/* Board Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" text="Loading board..." />
            </div>
          ) : boards.length === 0 ? (
            <EmptyState
              icon={Kanban}
              title="No boards yet"
              description="Create your first board to start organizing tasks with Kanban columns."
              action={
                <Button onClick={() => setCreateBoardOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Board
                </Button>
              }
            />
          ) : board ? (
            <KanbanBoard board={board} onBoardUpdate={handleBoardUpdate} />
          ) : null}
        </div>
      </div>

      {/* Create Board Dialog */}
      <Dialog open={createBoardOpen} onOpenChange={setCreateBoardOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="board-name">Board Name</Label>
              <Input
                id="board-name"
                placeholder="e.g. My Project"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCreateBoardOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Board Confirmation */}
      <ConfirmDialog
        open={deleteBoardOpen}
        onOpenChange={setDeleteBoardOpen}
        title="Delete Board"
        description="This will permanently delete this board and all its tasks. This action cannot be undone."
        confirmText="Delete Board"
        variant="destructive"
        onConfirm={handleDeleteBoard}
      />

      {/* AI Prioritize Results */}
      <Dialog open={prioritizeOpen} onOpenChange={setPrioritizeOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              AI Priority Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {prioritizeResults.map((item, idx) => (
              <div
                key={item.taskId}
                className="flex gap-3 p-3 rounded-xl bg-muted/50 border border-border/40"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary text-primary-foreground text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    Priority: {item.suggestedPriority}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
