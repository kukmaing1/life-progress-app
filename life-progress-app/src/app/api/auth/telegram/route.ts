import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { validateInitData } from "@/lib/telegramAuth";
import { createSessionToken, sessionCookieOptions } from "@/lib/session";
import { logEvent } from "@/lib/analytics";
import { isValidTimezone } from "@/lib/date";

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  let body: { initData?: string; timezone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const initData = body.initData;
  if (!initData || typeof initData !== "string") {
    return NextResponse.json({ error: "Missing initData" }, { status: 400 });
  }

  // Client-detected IANA timezone (e.g. "Europe/Kyiv"). Optional — a missing or
  // unrecognized value just falls back to the column default ('UTC') / whatever
  // is already stored, rather than failing the whole login.
  const timezone =
    typeof body.timezone === "string" && isValidTimezone(body.timezone) ? body.timezone : null;

  // The whole point: we never trust a user object the frontend sends us directly —
  // only what we can verify came from Telegram via this HMAC check.
  const validated = validateInitData(initData, botToken);
  if (!validated) {
    return NextResponse.json({ error: "Invalid Telegram authentication" }, { status: 401 });
  }

  const { user: tgUser } = validated;

  const upsertResult = await pool.query(
    `insert into users (telegram_id, username, first_name, last_name, timezone)
     values ($1, $2, $3, $4, coalesce($5, 'UTC'))
     on conflict (telegram_id) do update set
       username = excluded.username,
       first_name = excluded.first_name,
       last_name = excluded.last_name,
       timezone = coalesce($5, users.timezone)
     returning *`,
    [tgUser.id, tgUser.username ?? null, tgUser.first_name ?? null, tgUser.last_name ?? null, timezone]
  );

  const user = upsertResult.rows[0];
  const token = createSessionToken(user.id);

  const res = NextResponse.json({ user });
  const cookieOpts = sessionCookieOptions();
  res.cookies.set(cookieOpts.name, token, cookieOpts);

  await logEvent(user.id, "APP_OPENED");

  return res;
}
