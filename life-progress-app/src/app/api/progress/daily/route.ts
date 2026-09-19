import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getDateInTimezone, isValidDateString } from "@/lib/date";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");
  const date = dateParam && isValidDateString(dateParam) ? dateParam : getDateInTimezone(user.timezone);

  const { rows } = await pool.query(
    `select
       count(*) filter (where status = 'completed')::int as completed,
       count(*)::int as planned
     from tasks
     where user_id = $1 and scheduled_date = $2`,
    [user.id, date]
  );

  const { completed, planned } = rows[0];
  return NextResponse.json({ date, completed, planned });
}
