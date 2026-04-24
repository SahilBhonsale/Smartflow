"use client";

import { ColumnWithTasks, TaskType } from "@/types";
import { TaskCard } from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  column: ColumnWithTasks;
  onAddTask: (columnId: string, columnName: string) => void;
  onTaskClick: (task: TaskType) => void;
}

const columnColors: Record<string, string> = {
  "To Do": "from-zinc-500/20 to-zinc-500/5",
  "In Progress": "from-blue-500/20 to-blue-500/5",
  Done: "from-emerald-500/20 to-emerald-500/5",
};

const columnDotColors: Record<string, string> = {
  "To Do": "bg-zinc-400",
  "In Progress": "bg-blue-400",
  Done: "bg-emerald-400",
};

export function KanbanColumn({
  column,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-[320px] min-w-[320px] shrink-0">
      {/* Column Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-t-xl bg-gradient-to-b",
          columnColors[column.name] ?? "from-zinc-500/20 to-zinc-500/5"
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              columnDotColors[column.name] ?? "bg-zinc-400"
            )}
          />
          <h3 className="text-sm font-semibold text-foreground">
            {column.name}
          </h3>
          <span className="text-xs text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full font-medium">
            {column.tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg hover:bg-background/50"
          onClick={() => onAddTask(column.id, column.name)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 min-h-[200px] p-2 space-y-2 rounded-b-xl border border-t-0 border-border/40 transition-colors",
              snapshot.isDraggingOver
                ? "bg-primary/[0.03] border-primary/20"
                : "bg-muted/20"
            )}
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
            {column.tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
                Drop tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
