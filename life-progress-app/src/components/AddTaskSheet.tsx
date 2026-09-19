"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function AddTaskSheet({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, time: string | null) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSave() {
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      await onCreate(title.trim(), time || null);
      setTitle("");
      setTime("");
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-card bg-graphite-light p-5 pb-[max(env(safe-area-inset-bottom),20px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-cream">New task</h2>
          <button onClick={onClose} className="text-cream/50" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="mb-3 w-full rounded-xl bg-black/20 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:ring-1 focus:ring-gold/50"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mb-5 w-full rounded-xl bg-black/20 px-4 py-3 text-cream focus:outline-none focus:ring-1 focus:ring-gold/50"
        />

        <button
          onClick={handleSave}
          disabled={!title.trim() || saving}
          className="w-full rounded-pill bg-gradient-to-r from-gold-soft to-gold py-3.5 text-center font-medium text-graphite-dark disabled:opacity-40"
        >
          {saving ? "Saving..." : "Add task"}
        </button>
      </div>
    </div>
  );
}
