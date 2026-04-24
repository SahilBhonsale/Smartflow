import { Priority } from "@prisma/client";

// ─── API Response Types ──────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}

export interface ApiSuccess<T> {
  data: T;
}

// ─── Board Types ─────────────────────────────────────────────────────────────

export interface BoardWithColumns {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  columns: ColumnWithTasks[];
}

export interface ColumnWithTasks {
  id: string;
  name: string;
  order: number;
  boardId: string;
  tasks: TaskType[];
}

// ─── Task Types ──────────────────────────────────────────────────────────────

export interface TaskType {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: string;
  dueDate: string | null;
  tags: string[];
  order: number;
  columnId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Priority;
  columnId: string;
  boardId: string;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
  columnId?: string;
  order?: number;
  dueDate?: string | null;
  tags?: string[];
  status?: string;
}

// ─── Note Types ──────────────────────────────────────────────────────────────

export interface NoteType {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  tags?: string[];
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

// ─── AI Types ────────────────────────────────────────────────────────────────

export interface AISummarizeResponse {
  summary: string;
}

export interface AIPrioritizedTask {
  taskId: string;
  reason: string;
  suggestedPriority: Priority;
}

export interface AIPrioritizeResponse {
  prioritizedTasks: AIPrioritizedTask[];
}

export type AIGenerateType = "chat" | "generate_tasks" | "brainstorm";

export interface AIGenerateInput {
  prompt: string;
  type: AIGenerateType;
  history?: AIMessage[];
}

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Dashboard Types ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalNotes: number;
  tasksDueToday: number;
}

// ─── Board List Item ─────────────────────────────────────────────────────────

export interface BoardListItem {
  id: string;
  name: string;
  createdAt: string;
  _count: {
    columns: number;
  };
}
