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
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSave() {
    if (!title.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onCreate(title.trim(), time || null);
      setTitle("");
      setTime("");
      onClose();
    } catch (err) {
      // Previously this failed silently — the sheet just sat there with no
      // explanation (looked like "nothing happens" / "doesn't save"). Now the
      // person actually sees why, and their typed title/time are kept so they
      // don't have to retype anything to try again.
      setError(err instanceof Error ? err.message : "Couldn't save the task. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={handleClose}>
      <div
        className="w-full max-w-md rounded-t-card bg-graphite-light p-5 pb-[max(env(safe-area-inset-bottom),20px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-cream">New task</h2>
          <button onClick={handleClose} className="text-cream/50" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>
        )}

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
