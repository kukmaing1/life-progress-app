/**
 * Profile page achievement badges. Deliberately built only from
 * ever-increasing stats (total completed tasks, and the person's best
 * streak EVER — see lib/streak.ts's longestStreak, not the resettable
 * "current streak") so a badge, once unlocked, can never un-unlock itself.
 * A badge that disappeared the day someone missed a habit would be a
 * strange, discouraging kind of "achievement".
 *
 * Kept as pure, testable threshold logic here — icons and translated labels
 * are a rendering concern and live in ProfileHeader.tsx instead.
 */
export type AchievementId =
  | "firstStep"
  | "tenDone"
  | "fiftyDone"
  | "threeDayStreak"
  | "sevenDayStreak"
  | "thirtyDayStreak";

/** Display order for the achievements grid. */
export const ACHIEVEMENT_IDS: AchievementId[] = [
  "firstStep",
  "tenDone",
  "fiftyDone",
  "threeDayStreak",
  "sevenDayStreak",
  "thirtyDayStreak",
];

export interface AchievementStats {
  totalCompleted: number;
  bestStreak: number;
}

const REQUIREMENTS: Record<AchievementId, (stats: AchievementStats) => boolean> = {
  firstStep: (s) => s.totalCompleted >= 1,
  tenDone: (s) => s.totalCompleted >= 10,
  fiftyDone: (s) => s.totalCompleted >= 50,
  threeDayStreak: (s) => s.bestStreak >= 3,
  sevenDayStreak: (s) => s.bestStreak >= 7,
  thirtyDayStreak: (s) => s.bestStreak >= 30,
};

export function isAchievementUnlocked(id: AchievementId, stats: AchievementStats): boolean {
  return REQUIREMENTS[id](stats);
}

/** How many of the 6 badges are currently unlocked — the grid's "3 / 6" subtitle. */
export function countUnlockedAchievements(stats: AchievementStats): number {
  return ACHIEVEMENT_IDS.filter((id) => isAchievementUnlocked(id, stats)).length;
}
