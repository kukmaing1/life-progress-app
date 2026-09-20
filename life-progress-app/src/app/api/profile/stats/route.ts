import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getDateInTimezone } from "@/lib/date";
import { computeStreak } from "@/lib/streak";

/**
 * Lightweight profile stats for the personalization block (spec: Phase 1
 * roadmap item — "streak" + a total, both free, no AI involved).
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

  const streak = computeStreak(
    completedDays.map((row) => row.date),
    getDateInTimezone(user.timezone)
  );

  return NextResponse.json({ streak, totalCompleted: totalRows[0].total });
}
