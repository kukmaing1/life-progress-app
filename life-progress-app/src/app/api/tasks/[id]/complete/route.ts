import { NextRequest, NextResponse } from "next/server";
import { pool, TASK_COLUMNS } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows } = await pool.query(
    `update tasks
     set status = 'completed', completed_at = now()
     where id = $1 and user_id = $2
     returning ${TASK_COLUMNS}`,
    [params.id, user.id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await logEvent(user.id, "TASK_COMPLETED", { taskId: params.id });

  return NextResponse.json({ task: rows[0] });
}
