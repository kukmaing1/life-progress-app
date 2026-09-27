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

/**
 * The longest run of consecutive completed days anywhere in the person's
 * history, not just the one currently running. Used for the Profile page's
 * streak achievements (see lib/achievements.ts): those badges are meant to
 * be permanent once earned, so they read off this rather than the "current
 * streak" above, which resets to 0 the moment a day is missed — a badge
 * that could un-earn itself would be a confusing kind of achievement.
 */
export function longestStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sorted = Array.from(new Set(completedDates)).sort();

  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === addDaysToDateString(sorted[i - 1], 1)) {
      current++;
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
  }

  return longest;
}
