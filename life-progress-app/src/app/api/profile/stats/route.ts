import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getDateInTimezone } from "@/lib/date";
import { computeStreak, longestStreak } from "@/lib/streak";

/**
 * Lightweight profile stats for the personalization block (spec: Phase 1
 * roadmap item — "streak" + a total, both free, no AI involved). `bestStreak`
 * (added for the Profile achievements grid — see lib/achievements.ts) reuses
 * the same `completedDays` rows already fetched for `streak`, so this adds
 * no extra query.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ rows: completedDays }, { rows: totalRows }] = await Promise.all([
    pool.query<{ date: string }>(
      `select distinct scheduled_date::text as date
       from tasks
       where user_id = $1 and status = 'completed'`,
      [user.id]
    ),
    pool.query<{ total: number }>(
      `select count(*)::int as total from tasks where user_id = $1 and status = 'completed'`,
      [user.id]
    ),
  ]);

  const completedDates = completedDays.map((row) => row.date);
  const streak = computeStreak(completedDates, getDateInTimezone(user.timezone));
  const bestStreak = longestStreak(completedDates);

  return NextResponse.json({ streak, bestStreak, totalCompleted: totalRows[0].total });
}
