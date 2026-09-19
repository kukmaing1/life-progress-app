import { describe, expect, it } from "vitest";
import { computeProgress } from "@/lib/progress";
import type { Task } from "@/lib/types";

function makeTask(status: Task["status"]): Task {
  return {
    id: Math.random().toString(36),
    user_id: "u",
    title: "t",
    scheduled_date: "2026-09-19",
    scheduled_time: null,
    status,
    completed_at: null,
    created_at: "2026-09-19T00:00:00.000Z",
    updated_at: "2026-09-19T00:00:00.000Z",
  };
}

describe("computeProgress", () => {
  it("counts completed out of all planned tasks for the day", () => {
    const tasks = [makeTask("completed"), makeTask("completed"), makeTask("active"), makeTask("active")];
    expect(computeProgress(tasks)).toEqual({ completed: 2, planned: 4 });
  });

  it("never fabricates progress on an empty day", () => {
    expect(computeProgress([])).toEqual({ completed: 0, planned: 0 });
  });

  it("does not punish missed tasks — an active (missed) task just isn't counted as completed", () => {
    const tasks = [makeTask("active")];
    expect(computeProgress(tasks)).toEqual({ completed: 0, planned: 1 });
  });
});
