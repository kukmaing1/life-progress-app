import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getDateInTimezone } from "@/lib/date";

// This route touches the database on every call and must never be
// statically prerendered/cached at build time.
export const dynamic = "force-dynamic";

/**
 * The last 7 days' completion counts (today inclusive), for the Profile
 * page's "this week" strip — a smaller, always-fully-populated cousin of
 * /api/progress/month's calendar grid. Unlike that endpoint, every day in
 * the range comes back even when it has zero tasks (via generate_series),
 * so the client always has exactly 7 days to draw dots for, no gap-filling.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = getDateInTimezone(user.timezone);

  // generate_series($2::date - interval '6 days', ...) yields `timestamp` rows
  // (subtracting an interval from a date promotes it), so gs.date is a
  // timestamp — casting straight to ::text produced "2026-09-19 00:00:00"
  // and broke the client's "YYYY-MM-DD" parsing (showed as "Invalid Date").
  // The extra ::date strips the time part back off before the text cast.
  const { rows } = await pool.query<{ date: string; completed: number; planned: number }>(
    `select
       gs.date::date::text as date,
       coalesce(count(t.id) filter (where t.status = 'completed'), 0)::int as completed,
       coalesce(count(t.id), 0)::int as planned
     from generate_series($2::date - interval '6 days', $2::date, interval '1 day') as gs(date)
     left join tasks t on t.user_id = $1 and t.scheduled_date = gs.date
     group by gs.date
     order by gs.date`,
    [user.id, today]
  );

  return NextResponse.json({ days: rows });
}
