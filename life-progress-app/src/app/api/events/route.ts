import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { logEvent } from "@/lib/analytics";

// Server-originated events (APP_OPENED, TASK_CREATED, ...) are logged directly
// in their own routes. This endpoint only accepts client-only UI events.
const ALLOWED_EVENTS = new Set(["ONBOARDING_STARTED", "ONBOARDING_COMPLETED", "SETTINGS_OPENED"]);

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { eventType?: string; metadata?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.eventType || !ALLOWED_EVENTS.has(body.eventType)) {
    return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
  }

  await logEvent(user.id, body.eventType, body.metadata ?? {});
  return NextResponse.json({ ok: true });
}
