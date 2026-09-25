import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getDateInTimezone } from "@/lib/date";
import { secureCompare } from "@/lib/secureCompare";

// This route touches the database on every call and must never be
// statically prerendered/cached at build time (it doesn't use cookies(),
// so Next can't infer that on its own the way it does for the other routes).
export const dynamic = "force-dynamic";

/**
 * Sends a basic "<task> in <N> minutes" reminder for tasks with a scheduled
 * time coming up within 30 minutes. No AI, no coaching — just the functional
 * reminder the spec asks for (section 21).
 *
 * This route does nothing on its own: something has to call it periodically.
 * See README "Notifications" for setup options and the Vercel free-plan caveat.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const provided = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!provided || !secureCompare(provided, cronSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const { rows: candidates } = await pool.query(
    `select
       t.id, t.title,
       t.scheduled_date::text as scheduled_date,
       t.scheduled_time::text as scheduled_time,
       u.telegram_id, u.timezone
     from tasks t
     join users u on u.id = t.user_id
     where t.status = 'active'
       and t.scheduled_time is not null
       and t.reminder_sent_at is null
       and u.notifications_enabled = true`
  );

  let sent = 0;
  for (const task of candidates) {
    const todayInTz = getDateInTimezone(task.timezone);
    if (task.scheduled_date !== todayInTz) continue;

    const [hour, minute] = task.scheduled_time.slice(0, 5).split(":").map(Number);
    const nowInTz = new Date(new Date().toLocaleString("en-US", { timeZone: task.timezone }));
    const scheduled = new Date(nowInTz);
    scheduled.setHours(hour, minute, 0, 0);

    const minutesUntil = Math.round((scheduled.getTime() - nowInTz.getTime()) / 60000);
    if (minutesUntil < 0 || minutesUntil > 30) continue;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: task.telegram_id,
          text: `${task.title} in ${minutesUntil} minutes.`,
        }),
      });
      await pool.query(`update tasks set reminder_sent_at = now() where id = $1`, [task.id]);
      sent++;
    } catch (err) {
      console.error("Failed to send reminder", err);
    }
  }

  return NextResponse.json({ checked: candidates.length, sent });
}
