"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { BottomNav } from "@/components/BottomNav";
import { ProgressBar } from "@/components/ProgressBar";
import { TaskRow } from "@/components/TaskRow";
import { AddTaskSheet } from "@/components/AddTaskSheet";
import { TaskActionSheet } from "@/components/TaskActionSheet";
import { apiFetch } from "@/lib/apiClient";
import { formatDateLong, getDateInTimezone } from "@/lib/date";
import { computeProgress } from "@/lib/progress";
import type { Task } from "@/lib/types";

export default function TodayPage() {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const data = await apiFetch<{ date: string; tasks: Task[] }>("/api/tasks");
      setTasks(data.tasks);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadTasks();
  }, [user, loadTasks]);

  const { completed: completedCount, planned: plannedCount } = computeProgress(tasks);

  // Split into the three sections the person asked for: a fixed time (e.g.
  // "12:00") vs. flexible/anytime during the day vs. already done.
  const scheduledTasks = tasks.filter((t) => t.status === "active" && t.scheduled_time !== null);
  const anytimeTasks = tasks.filter((t) => t.status === "active" && t.scheduled_time === null);
  const completedTasks = tasks.filter((t) => t.status === "completed");

  async function handleCreate(title: string, time: string | null) {
    await apiFetch("/api/tasks", { method: "POST", body: JSON.stringify({ title, time }) });
    await loadTasks();
  }

  async function handleToggleComplete(task: Task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: "completed" } : t)));
    try {
      await apiFetch(`/api/tasks/${task.id}/complete`, { method: "POST" });
    } catch (err) {
      // The optimistic update above gets corrected back to "active" by the
      // loadTasks() refetch in `finally` below — this just tells the person
      // why it reverted instead of leaving them wondering.
      setToastError(err instanceof Error ? err.message : "Couldn't complete the task. Try again.");
      setTimeout(() => setToastError(null), 4000);
    } finally {
      loadTasks();
    }
  }

  async function handleSaveEdit(id: string, title: string, time: string | null) {
    await apiFetch(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ title, time }) });
    await loadTasks();
  }

  async function handlePostpone(id: string) {
    await apiFetch(`/api/tasks/${id}/postpone`, { method: "POST" });
    await loadTasks();
  }

  async function handleDelete(id: string) {
    await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
    await loadTasks();
  }

  if (authLoading) {
    return <div className="flex flex-1 items-center justify-center text-cream/40">Loading...</div>;
  }

  if (authError || !user) {
    return (
      <div className="flex flex-1 items-center justify-center px-8 text-center text-cream/60">
        {authError ?? "Sign-in required."}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-28">
        <h1 className="font-serif text-3xl text-cream">Today</h1>
        <p className="mt-1 text-sm text-cream/40">{formatDateLong(getDateInTimezone(user.timezone))}</p>
        <p className="mt-3 text-sm text-cream/50">
          {completedCount} / {plannedCount} completed
        </p>
        <div className="mt-3">
          <ProgressBar completed={completedCount} planned={plannedCount} />
        </div>

        {toastError && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{toastError}</p>
        )}

        <div className="mt-8">
          {loadingTasks ? (
            <p className="py-8 text-center text-cream/30">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="py-8 text-center text-cream/30">Nothing yet — add your first task.</p>
          ) : (
            // `tasks` is already sorted by the server (see lib/sortTasks): scheduled
            // tasks chronologically, then anytime tasks, then completed ones. We
            // just split that same order into labeled groups rather than re-sorting.
            <>
              {scheduledTasks.length > 0 && (
                <div className="mb-6">
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.15em] text-cream/40">Scheduled</p>
                  <div className="divide-y divide-white/5">
                    {scheduledTasks.map((task) => (
                      <TaskRow key={task.id} task={task} onToggleComplete={handleToggleComplete} onOpenActions={setActiveTask} />
                    ))}
                  </div>
                </div>
              )}

              {anytimeTasks.length > 0 && (
                <div className="mb-6">
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.15em] text-cream/40">Anytime</p>
                  <div className="divide-y divide-white/5">
                    {anytimeTasks.map((task) => (
                      <TaskRow key={task.id} task={task} onToggleComplete={handleToggleComplete} onOpenActions={setActiveTask} />
                    ))}
                  </div>
                </div>
              )}

              {completedTasks.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.15em] text-cream/40">Completed</p>
                  <div className="divide-y divide-white/5">
                    {completedTasks.map((task) => (
                      <TaskRow key={task.id} task={task} onToggleComplete={handleToggleComplete} onOpenActions={setActiveTask} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-graphite-dark shadow-glow"
        aria-label="Add task"
      >
        <Plus size={26} />
      </button>

      <BottomNav />

      <AddTaskSheet open={addOpen} onClose={() => setAddOpen(false)} onCreate={handleCreate} />
      <TaskActionSheet
        key={activeTask?.id ?? "none"}
        task={activeTask}
        onClose={() => setActiveTask(null)}
        onSave={handleSaveEdit}
        onPostpone={handlePostpone}
        onDelete={handleDelete}
      />
    </div>
  );
}
