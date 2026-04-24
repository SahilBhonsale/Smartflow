"use client";

import { TaskType } from "@/types";
import { PriorityBadge } from "./PriorityBadge";
import { Calendar, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Draggable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: TaskType;
  index: number;
  onClick: () => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Done";
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "group bg-card rounded-xl p-3.5 border border-border/60 cursor-pointer transition-all duration-200",
            "hover:shadow-md hover:shadow-black/5 hover:border-border hover:-translate-y-0.5",
            snapshot.isDragging && "shadow-xl shadow-black/10 rotate-2 border-primary/30"
          )}
          onClick={onClick}
        >
          <div className="flex items-start gap-2">
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 cursor-grab"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title */}
              <h4 className="text-sm font-medium text-foreground truncate mb-2">
                {task.title}
              </h4>

              {/* Priority + Due date row */}
              <div className="flex items-center gap-2 flex-wrap">
                <PriorityBadge priority={task.priority} />
                {formattedDate && (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-[11px] font-medium",
                      isOverdue ? "text-red-500" : "text-muted-foreground"
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    {formattedDate}
                  </span>
                )}
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {task.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {task.tags.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{task.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
