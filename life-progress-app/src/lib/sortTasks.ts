import type { Task } from "@/lib/types";

/**
 * Default task order (spec section 11):
 * 1. active tasks with a time, chronologically
 * 2. active tasks without a time
 * 3. completed tasks (de-emphasized)
 *
 * Kept as a pure function — shared by the API route and covered by tests —
 * rather than hidden inside a SQL ORDER BY clause.
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "completed" ? 1 : -1;
    }
    if (a.status === "completed") {
      return a.created_at.localeCompare(b.created_at);
    }

    const aHasTime = a.scheduled_time !== null;
    const bHasTime = b.scheduled_time !== null;
    if (aHasTime !== bHasTime) {
      return aHasTime ? -1 : 1;
    }
    if (aHasTime && bHasTime) {
      return a.scheduled_time!.localeCompare(b.scheduled_time!);
    }
    return a.created_at.localeCompare(b.created_at);
  });
}
