"use client";

import { Check, Clock } from "lucide-react";
import type { Task } from "@/lib/types";

export function TaskRow({
  task,
  onToggleComplete,
  onOpenActions,
}: {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onOpenActions: (task: Task) => void;
}) {
  const completed = task.status === "completed";

  return (
    <div className="flex items-center gap-3 py-3">
      <button
        aria-label={completed ? "Completed" : "Mark complete"}
        onClick={() => !completed && onToggleComplete(task)}
        disabled={completed}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
          completed ? "border-gold/40 bg-gold/10 text-gold" : "border-cream/30 text-transparent active:bg-white/5"
        }`}
      >
        <Check size={14} strokeWidth={2.5} />
      </button>

      <button onClick={() => onOpenActions(task)} className="flex flex-1 items-center gap-2 text-left">
        {task.scheduled_time && !completed && (
          <span className="flex shrink-0 items-center gap-1 text-sm text-cream/50">
            <Clock size={14} strokeWidth={1.5} />
            {task.scheduled_time}
          </span>
        )}
        <span className={completed ? "text-cream/30 line-through" : "text-cream"}>{task.title}</span>
      </button>
    </div>
  );
}
