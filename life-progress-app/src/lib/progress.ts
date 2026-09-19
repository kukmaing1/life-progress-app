import type { Task } from "@/lib/types";

/** completed / planned for a set of tasks — never fabricated, just counted (spec section 10). */
export function computeProgress(tasks: Task[]): { completed: number; planned: number } {
  const completed = tasks.filter((t) => t.status === "completed").length;
  return { completed, planned: tasks.length };
}
