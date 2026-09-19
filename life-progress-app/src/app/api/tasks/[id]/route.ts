import { NextRequest, NextResponse } from "next/server";
import { pool, TASK_COLUMNS } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isValidDateString, isValidTimeString } from "@/lib/date";
import { logEvent } from "@/lib/analytics";

async function getOwnedTask(userId: string, taskId: string) {
  const { rows } = await pool.query(
    `select ${TASK_COLUMNS} from tasks where id = $1 and user_id = $2`,
    [taskId, userId]
  );
  return rows[0] ?? null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ownership check happens before any write — a user must never be able to
  // reach another user's task, even by guessing an id.
  const existing = await getOwnedTask(user.id, params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: { title?: string; date?: string; time?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const updates: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (body.title !== undefined) {
    const title = body.title.trim();
    if (!title || title.length > 200) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }
    updates.push(`title = $${idx++}`);
    values.push(title);
  }

  if (body.date !== undefined) {
    if (typeof body.date !== "string" || !isValidDateString(body.date)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    updates.push(`scheduled_date = $${idx++}`);
    values.push(body.date);
  }

  if (body.time !== undefined) {
    if (body.time !== null && (typeof body.time !== "string" || !isValidTimeString(body.time))) {
      return NextResponse.json({ error: "Invalid time" }, { status: 400 });
    }
    updates.push(`scheduled_time = $${idx++}`);
    values.push(body.time);
  }

  if (updates.length === 0) {
    return NextResponse.json({ task: existing });
  }

  values.push(existing.id);
  const { rows } = await pool.query(
    `update tasks set ${updates.join(", ")} where id = $${idx} returning ${TASK_COLUMNS}`,
    values
  );

  await logEvent(user.id, "TASK_EDITED", { taskId: existing.id });

  return NextResponse.json({ task: rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await getOwnedTask(user.id, params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await pool.query(`delete from tasks where id = $1`, [existing.id]);
  await logEvent(user.id, "TASK_DELETED", { taskId: existing.id });

  return NextResponse.json({ ok: true });
}
