"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { BottomNav } from "@/components/BottomNav";
import { ProgressDot } from "@/components/ProgressDot";
import { apiFetch } from "@/lib/apiClient";
import { addMonths, daysInMonth, firstWeekdayOfMonth, formatDateLong, getDateInTimezone } from "@/lib/date";
import { dayDotVariant } from "@/lib/progress";
import type { MonthProgress, Task } from "@/lib/types";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// All date math here works on the "YYYY-MM(-DD)" strings directly via UTC —
// never a bare `new Date(dateString)` in the browser's own timezone, which is
// exactly the class of off-by-one-day bug the timezone fixes elsewhere were about.
function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The "look back at past days" history view (roadmap Phase 1 — free,
 * dot-style indicators to match the app's aesthetic rather than emoji).
 * Read-only by design: it's for reviewing, not editing history.
 */
export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth();
  const [month, setMonth] = useState<string | null>(null);
  const [monthData, setMonthData] = useState<MonthProgress | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayTasks, setDayTasks] = useState<Task[] | null>(null);
  const [dayLoading, setDayLoading] = useState(false);

  // Starting point: "today" in the user's real timezone (never the browser's,
  // never the server's) — same helper the API routes use.
  useEffect(() => {
    if (!user) return;
    const today = getDateInTimezone(user.timezone);
    setMonth(today.slice(0, 7));
    setSelectedDate(today);
  }, [user]);

  const loadMonth = useCallback((m: string) => {
    apiFetch<MonthProgress>(`/api/progress/month?month=${m}`)
      .then(setMonthData)
      .catch(() => setMonthData(null));
  }, []);

  useEffect(() => {
    if (month) loadMonth(month);
  }, [month, loadMonth]);

  const loadDay = useCallback((date: string) => {
    setDayLoading(true);
    apiFetch<{ date: string; tasks: Task[] }>(`/api/tasks?date=${date}`)
      .then((data) => setDayTasks(data.tasks))
      .catch(() => setDayTasks(null))
      .finally(() => setDayLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDate) loadDay(selectedDate);
  }, [selectedDate, loadDay]);

  if (authLoading || !user || !month) {
    return <div className="flex flex-1 items-center justify-center text-cream/40">Loading...</div>;
  }

  const byDate = new Map((monthData?.days ?? []).map((d) => [d.date, d]));
  const totalDays = daysInMonth(month);
  const leadingBlanks = firstWeekdayOfMonth(month);
  const cells: (string | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`),
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-28">
        <h1 className="font-serif text-3xl text-cream">Progress</h1>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setMonth((m) => (m ? addMonths(m, -1) : m))}
            className="p-2 text-cream/50 active:text-cream"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <p className="text-cream">{monthLabel(month)}</p>
          <button
            onClick={() => setMonth((m) => (m ? addMonths(m, 1) : m))}
            className="p-2 text-cream/50 active:text-cream"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 text-center text-xs text-cream/30">
          {WEEKDAY_LABELS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-y-1 text-center">
          {cells.map((date, i) => {
            if (!date) return <div key={`blank-${i}`} />;

            const day = byDate.get(date);
            const dayNum = Number(date.slice(-2));
            const isSelected = date === selectedDate;

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center gap-1 rounded-xl py-2 ${
                  isSelected ? "bg-white/10" : ""
                }`}
              >
                <span className="text-sm text-cream/80">{dayNum}</span>
                <ProgressDot variant={dayDotVariant(day)} />
              </button>
            );
          })}
        </div>

        <div className="mt-8 border-t border-white/5 pt-6">
          <p className="mb-2 text-sm text-cream/50">{selectedDate ? formatDateLong(selectedDate) : ""}</p>

          {dayLoading ? (
            <p className="py-6 text-center text-cream/30">Loading...</p>
          ) : !dayTasks || dayTasks.length === 0 ? (
            <p className="py-6 text-center text-cream/30">Nothing planned that day.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {dayTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 py-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      task.status === "completed"
                        ? "border-gold/40 bg-gold/10 text-gold"
                        : "border-cream/20 text-transparent"
                    }`}
                  >
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  <span className="flex-1">
                    {task.scheduled_time && (
                      <span className="mr-2 text-sm text-cream/50">{task.scheduled_time}</span>
                    )}
                    <span className={task.status === "completed" ? "text-cream/30 line-through" : "text-cream"}>
                      {task.title}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
