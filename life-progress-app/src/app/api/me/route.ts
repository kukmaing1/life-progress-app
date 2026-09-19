import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isValidTimezone } from "@/lib/date";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { timezone?: string; notifications_enabled?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const updates: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (body.timezone !== undefined) {
    if (typeof body.timezone !== "string" || !isValidTimezone(body.timezone)) {
      return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
    }
    updates.push(`timezone = $${idx++}`);
    values.push(body.timezone);
  }

  if (body.notifications_enabled !== undefined) {
    if (typeof body.notifications_enabled !== "boolean") {
      return NextResponse.json({ error: "Invalid notifications_enabled" }, { status: 400 });
    }
    updates.push(`notifications_enabled = $${idx++}`);
    values.push(body.notifications_enabled);
  }

  if (updates.length === 0) {
    return NextResponse.json({ user });
  }

  values.push(user.id);
  const { rows } = await pool.query(
    `update users set ${updates.join(", ")} where id = $${idx} returning *`,
    values
  );

  return NextResponse.json({ user: rows[0] });
}
