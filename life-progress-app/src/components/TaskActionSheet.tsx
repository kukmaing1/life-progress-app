"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Task } from "@/lib/types";

// Parent renders this with `key={task.id}` so switching tasks remounts it
// and resets local state, instead of hand-rolling a sync effect here.
export function TaskActionSheet({
  task,
  onClose,
  onSave,
  onPostpone,
  onDelete,
}: {
  task: Task | null;
  onClose: () => void;
  onSave: (id: string, title: string, time: string | null) => Promise<void>;
  onPostpone: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [time, setTime] = useState(task?.scheduled_time ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!task) return null;

  async function run(action: () => Promise<void>) {
    setBusy(true);
    try {
      await action();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-card bg-graphite-light p-5 pb-[max(env(safe-area-inset-bottom),20px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-cream">Edit task</h2>
          <button onClick={onClose} className="text-cream/50" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3 w-full rounded-xl bg-black/20 px-4 py-3 text-cream focus:outline-none focus:ring-1 focus:ring-gold/50"
        />
        <input
          type="time"
          value={time ?? ""}
          onChange={(e) => setTime(e.target.value)}
          className="mb-5 w-full rounded-xl bg-black/20 px-4 py-3 text-cream focus:outline-none focus:ring-1 focus:ring-gold/50"
        />

        <button
          disabled={busy || !title.trim()}
          onClick={() => run(() => onSave(task.id, title.trim(), time || null))}
          className="mb-2 w-full rounded-pill bg-gradient-to-r from-gold-soft to-gold py-3 text-center font-medium text-graphite-dark disabled:opacity-40"
        >
          Save changes
        </button>

        <button
          disabled={busy}
          onClick={() => run(() => onPostpone(task.id))}
          className="mb-2 w-full rounded-pill border border-white/10 py-3 text-center text-cream/80 disabled:opacity-40"
        >
          Postpone to tomorrow
        </button>

        {confirmDelete ? (
          <button
            disabled={busy}
            onClick={() => run(() => onDelete(task.id))}
            className="w-full rounded-pill bg-red-500/20 py-3 text-center text-red-300 disabled:opacity-40"
          >
            Confirm delete
          </button>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="w-full rounded-pill py-3 text-center text-red-400/80">
            Delete task
          </button>
        )}
      </div>
    </div>
  );
}
