import { NextRequest, NextResponse } from "next/server";
import { pool, TASK_COLUMNS } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { addDaysToDateString, getDateInTimezone, isValidDateString } from "@/lib/date";
import { logEvent } from "@/lib/analytics";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { date?: string } = {};
  try {
    body = await req.json();
  } catch {
    // No body — default to "tomorrow", per spec example (Gym -> Tomorrow).
  }

  let newDate: string;
  if (body.date) {
    if (!isValidDateString(body.date)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    newDate = body.date;
  } else {
    newDate = addDaysToDateString(getDateInTimezone(user.timezone), 1);
  }

  // Moving the date is all "postpone" does — the task simply stops showing up
  // as active for the original day, satisfying the spec without extra state.
  const { rows } = await pool.query(
    `update tasks set scheduled_date = $1 where id = $2 and user_id = $3 returning ${TASK_COLUMNS}`,
    [newDate, params.id, user.id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await logEvent(user.id, "TASK_POSTPONED", { taskId: params.id, newDate });

  return NextResponse.json({ task: rows[0] });
}
