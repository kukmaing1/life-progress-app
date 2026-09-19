import { describe, expect, it } from "vitest";
import { sortTasks } from "@/lib/sortTasks";
import type { Task } from "@/lib/types";

function makeTask(overrides: Partial<Task> & { id: string }): Task {
  return {
    user_id: "user",
    title: "Task",
    scheduled_date: "2026-09-19",
    scheduled_time: null,
    status: "active",
    completed_at: null,
    created_at: "2026-09-19T08:00:00.000Z",
    updated_at: "2026-09-19T08:00:00.000Z",
    ...overrides,
  };
}

describe("sortTasks", () => {
  it("orders timed active tasks chronologically, then untimed active, then completed last", () => {
    const tasks = [
      makeTask({ id: "completed", status: "completed", title: "Barber" }),
      makeTask({ id: "no-time", title: "Buy groceries" }),
      makeTask({ id: "later", scheduled_time: "18:00", title: "Read 20 pages" }),
      makeTask({ id: "earlier", scheduled_time: "09:00", title: "Gym" }),
    ];

    expect(sortTasks(tasks).map((t) => t.id)).toEqual(["earlier", "later", "no-time", "completed"]);
  });

  it("does not mutate the input array", () => {
    const tasks = [makeTask({ id: "a" }), makeTask({ id: "b", scheduled_time: "08:00" })];
    const original = [...tasks];
    sortTasks(tasks);
    expect(tasks).toEqual(original);
  });
});
