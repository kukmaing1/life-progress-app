import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getDateInTimezone, isValidMonthString } from "@/lib/date";

/**
 * Per-day completion counts for one calendar month, for the history/calendar
 * view (roadmap Phase 1 — dot indicators, no cost gate). Only days that have
 * at least one task come back; the client treats any day missing from `days`
 * as "nothing planned" (empty dot), matching /api/progress/daily's shape.
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const monthParam = url.searchParams.get("month");
  const month =
    monthParam && isValidMonthString(monthParam)
      ? monthParam
      : getDateInTimezone(user.timezone).slice(0, 7);

  const { rows } = await pool.query<{ date: string; completed: number; planned: number }>(
    `select
       scheduled_date::text as date,
       count(*) filter (where status = 'completed')::int as completed,
       count(*)::int as planned
     from tasks
     where user_id = $1
       and scheduled_date >= ($2 || '-01')::date
       and scheduled_date < (($2 || '-01')::date + interval '1 month')
     group by scheduled_date
     order by scheduled_date`,
    [user.id, month]
  );

  return NextResponse.json({ month, days: rows });
}
