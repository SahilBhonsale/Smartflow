"use client";

import { Badge } from "@/components/ui/badge";
import { Priority } from "@prisma/client";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityConfig: Record<
  Priority,
  { label: string; className: string }
> = {
  LOW: {
    label: "Low",
    className: "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400",
  },
  MEDIUM: {
    label: "Medium",
    className:
      "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300",
  },
  HIGH: {
    label: "High",
    className:
      "bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300",
  },
  URGENT: {
    label: "Urgent",
    className:
      "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300",
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium text-[11px] px-2 py-0.5 border-0",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
