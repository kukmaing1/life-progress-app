import { addDaysToDateString } from "@/lib/date";

/**
 * Pure streak calculation, kept separate from the DB query (same reasoning
 * as lib/sortTasks) so it's directly testable.
 *
 * Walks backward from `today` counting consecutive days present in
 * `completedDates`. Today itself doesn't break the streak just because
 * it's not done yet — see the route's comment for why.
 */
export function computeStreak(completedDates: string[], today: string): number {
  const completedDateSet = new Set(completedDates);

  let cursor = today;
  if (!completedDateSet.has(cursor)) {
    cursor = addDaysToDateString(cursor, -1);
  }

  let streak = 0;
  while (completedDateSet.has(cursor)) {
    streak++;
    cursor = addDaysToDateString(cursor, -1);
  }

  return streak;
}
