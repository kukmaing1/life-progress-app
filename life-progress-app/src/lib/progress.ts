import type { DailyProgress, Task } from "@/lib/types";

/** completed / planned for a set of tasks — never fabricated, just counted (spec section 10). */
export function computeProgress(tasks: Task[]): { completed: number; planned: number } {
  const completed = tasks.filter((t) => t.status === "completed").length;
  return { completed, planned: tasks.length };
}

export type DayDotVariant = "full" | "partial" | "planned" | "none";

/**
 * Classifies a single day's completed/planned counts into the dot style
 * shared by the Progress calendar grid and the Profile "this week" strip,
 * so the two views can never drift into slightly different rules for what
 * counts as "fully done" vs "partial" vs "planned but untouched".
 */
export function dayDotVariant(day: Pick<DailyProgress, "completed" | "planned"> | undefined): DayDotVariant {
  if (!day || day.planned === 0) return "none";
  if (day.completed === day.planned) return "full";
  if (day.completed > 0) return "partial";
  return "planned";
}
