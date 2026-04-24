"use client";

import { useState, useCallback } from "react";
import {
  BoardWithColumns,
  BoardListItem,
  TaskType,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/types";
import toast from "react-hot-toast";

export function useBoards() {
  const [boards, setBoards] = useState<BoardListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/boards");
      if (!res.ok) throw new Error("Failed to fetch boards");
      const data = await res.json();
      setBoards(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch boards");
    } finally {
      setLoading(false);
    }
  }, []);

  const createBoard = useCallback(async (name: string) => {
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create board");
      const board = await res.json();
      setBoards((prev) => [...prev, board]);
      toast.success("Board created!");
      return board;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create board");
      return null;
    }
  }, []);

  const deleteBoard = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/boards/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete board");
      setBoards((prev) => prev.filter((b) => b.id !== id));
      toast.success("Board deleted!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete board");
    }
  }, []);

  return { boards, loading, fetchBoards, createBoard, deleteBoard };
}

export function useBoard() {
  const [board, setBoard] = useState<BoardWithColumns | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBoard = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/boards/${id}`);
      if (!res.ok) throw new Error("Failed to fetch board");
      const data = await res.json();
      setBoard(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch board");
    } finally {
      setLoading(false);
    }
  }, []);

  return { board, setBoard, loading, fetchBoard };
}

export function useTasks() {
  const [loading, setLoading] = useState(false);

  const createTask = useCallback(async (input: CreateTaskInput): Promise<TaskType | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const task: TaskType = await res.json();
      toast.success("Task created!");
      return task;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskInput): Promise<TaskType | null> => {
      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) throw new Error("Failed to update task");
        const task: TaskType = await res.json();
        return task;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update task");
        return null;
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      toast.success("Task deleted!");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
      return false;
    }
  }, []);

  return { loading, createTask, updateTask, deleteTask };
}
