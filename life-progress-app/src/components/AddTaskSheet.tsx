"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { addDaysToDateString } from "@/lib/date";
import { useLocale } from "@/components/LocaleProvider";

export function AddTaskSheet({
  open,
  todayDate,
  onClose,
  onCreate,
}: {
  open: boolean;
  /** "YYYY-MM-DD" for the user's current day (their timezone) — the date
   * field's default and lower bound, and the "Today" quick-pick target. */
  todayDate: string;
  onClose: () => void;
  onCreate: (title: string, time: string | null, date: string) => Promise<void>;
}) {
  const { t } = useLocale();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState(todayDate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const tomorrow = addDaysToDateString(todayDate, 1);

  async function handleSave() {
    if (!title.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onCreate(title.trim(), time || null, date);
      setTitle("");
      setTime("");
      setDate(todayDate);
      onClose();
    } catch (err) {
      // Previously this failed silently — the sheet just sat there with no
      // explanation (looked like "nothing happens" / "doesn't save"). Now the
      // person actually sees why, and their typed title/time are kept so they
      // don't have to retype anything to try again.
      setError(err instanceof Error ? err.message : t("errors.saveTaskFailed"));
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
          <h2 className="font-serif text-lg text-cream">{t("addTask.heading")}</h2>
          <button onClick={handleClose} className="text-cream/50" aria-label={t("addTask.closeAria")}>
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
          placeholder={t("addTask.titlePlaceholder")}
          className="mb-3 w-full rounded-xl bg-field px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:ring-1 focus:ring-gold/50"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />

        {/* iOS/Android render native time/date inputs with their own internal
            chrome (font metrics, padding) that doesn't reliably match our
            custom py-based sizing — on a phone the rows visibly drifted out
            of alignment with each other even though desktop looked fine.
            Fixing every row (this input, the chips, the date input below) to
            the same explicit h-12 with appearance-none + centered text makes
            the height consistent regardless of platform quirks. */}
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mb-3 h-12 w-full appearance-none rounded-xl bg-field px-4 text-center text-cream focus:outline-none focus:ring-1 focus:ring-gold/50"
        />

        {/* Planning ahead is a secondary, optional step — most tasks are still
            for today, so this stays visually quieter than the title/time
            fields above rather than competing with them. Chips cover the
            common cases; the date input underneath handles anything further
            out (a week, a month) without needing its own screen. */}
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setDate(todayDate)}
            className={`flex h-12 flex-1 items-center justify-center rounded-xl text-sm transition-colors ${
              date === todayDate ? "bg-gold/20 text-gold" : "bg-field text-cream/50"
            }`}
          >
            {t("addTask.today")}
          </button>
          <button
            type="button"
            onClick={() => setDate(tomorrow)}
            className={`flex h-12 flex-1 items-center justify-center rounded-xl text-sm transition-colors ${
              date === tomorrow ? "bg-gold/20 text-gold" : "bg-field text-cream/50"
            }`}
          >
            {t("addTask.tomorrow")}
          </button>
        </div>

        <input
          type="date"
          value={date}
          min={todayDate}
          onChange={(e) => setDate(e.target.value)}
          aria-label={t("addTask.dateAria")}
          className="mb-5 h-12 w-full appearance-none rounded-xl bg-field px-4 text-center text-cream focus:outline-none focus:ring-1 focus:ring-gold/50"
        />

        <button
          onClick={handleSave}
          disabled={!title.trim() || saving}
          className="w-full rounded-pill bg-gradient-to-r from-gold-soft to-gold py-3.5 text-center font-medium text-graphite-dark disabled:opacity-40"
        >
          {saving ? t("addTask.saving") : date === todayDate ? t("addTask.addButton") : t("addTask.planButton")}
        </button>
      </div>
    </div>
  );
}
