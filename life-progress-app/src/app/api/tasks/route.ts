import { NextRequest, NextResponse } from "next/server";
import { pool, TASK_COLUMNS } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getDateInTimezone, isValidDateString, isValidTimeString } from "@/lib/date";
import { logEvent } from "@/lib/analytics";
import { sortTasks } from "@/lib/sortTasks";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const dateParam = url.searchParams.get("date");
  const date = dateParam && isValidDateString(dateParam) ? dateParam : getDateInTimezone(user.timezone);

  const { rows } = await pool.query(
    `select ${TASK_COLUMNS} from tasks where user_id = $1 and scheduled_date = $2`,
    [user.id, date]
  );

  // Ordering is a pure, tested function (see lib/sortTasks) rather than buried in SQL.
  return NextResponse.json({ date, tasks: sortTasks(rows) });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { title?: string; date?: string; time?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const title = body.title?.trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (title.length > 200) {
    return NextResponse.json({ error: "Title is too long" }, { status: 400 });
  }

  let date = getDateInTimezone(user.timezone);
  if (body.date !== undefined) {
    if (typeof body.date !== "string" || !isValidDateString(body.date)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    date = body.date;
  }

  let time: string | null = null;
  if (body.time) {
    if (typeof body.time !== "string" || !isValidTimeString(body.time)) {
      return NextResponse.json({ error: "Invalid time" }, { status: 400 });
    }
    time = body.time;
  }

  const { rows } = await pool.query(
    `insert into tasks (user_id, title, scheduled_date, scheduled_time)
     values ($1, $2, $3, $4)
     returning ${TASK_COLUMNS}`,
    [user.id, title, date, time]
  );

  await logEvent(user.id, "TASK_CREATED", { taskId: rows[0].id });

  return NextResponse.json({ task: rows[0] }, { status: 201 });
}
