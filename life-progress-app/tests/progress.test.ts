import { describe, expect, it } from "vitest";
import { computeProgress, dayDotVariant } from "@/lib/progress";
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

describe("dayDotVariant", () => {
  it("classifies a day with nothing planned, or missing entirely, as 'none'", () => {
    expect(dayDotVariant(undefined)).toBe("none");
    expect(dayDotVariant({ completed: 0, planned: 0 })).toBe("none");
  });

  it("classifies a fully-completed day as 'full'", () => {
    expect(dayDotVariant({ completed: 3, planned: 3 })).toBe("full");
  });

  it("classifies a partially-completed day as 'partial'", () => {
    expect(dayDotVariant({ completed: 1, planned: 3 })).toBe("partial");
  });

  it("classifies a planned-but-untouched day as 'planned'", () => {
    expect(dayDotVariant({ completed: 0, planned: 2 })).toBe("planned");
  });
});
