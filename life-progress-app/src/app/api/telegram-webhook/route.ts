import { NextRequest, NextResponse } from "next/server";
import { secureCompare } from "@/lib/secureCompare";

// This route touches network/env on every call and must never be statically
// prerendered/cached at build time (same reasoning as the cron route).
export const dynamic = "force-dynamic";

/**
 * Telegram webhook: the only thing this bot does outside the Mini App itself
 * is answer `/start` with a button that opens the app. There is no other bot
 * logic (no other commands, no free-text handling) — by design, per the spec.
 *
 * Setup (one-time, after deploying):
 *   curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
 *     -d "url=https://<your-app>/api/telegram-webhook" \
 *     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"   # omit if you didn't set one
 *
 * TELEGRAM_WEBHOOK_SECRET is optional but recommended — without it, anyone
 * who finds this URL can POST fake Telegram updates to it. If set, Telegram
 * echoes it back on every request as the X-Telegram-Bot-Api-Secret-Token
 * header, which we check below.
 */
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (webhookSecret) {
    const provided = req.headers.get("x-telegram-bot-api-secret-token");
    if (!provided || !secureCompare(provided, webhookSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Always ack with 200, even when misconfigured or the update is something
  // we don't handle — returning an error status makes Telegram retry the
  // same update repeatedly, which we don't want.
  if (!botToken || !appUrl) {
    console.error("telegram-webhook: TELEGRAM_BOT_TOKEN or NEXT_PUBLIC_APP_URL not set");
    return NextResponse.json({ ok: true });
  }

  let update: { message?: { chat?: { id?: number }; text?: string } };
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatId = update.message?.chat?.id;
  const text = update.message?.text ?? "";
  // Bot commands can arrive as "/start@YourBotName" in group chats.
  const isStart = /^\/start(@\w+)?$/.test(text.trim());

  if (chatId && isStart) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Build a better version of yourself. Small actions. Real progress.",
          reply_markup: {
            inline_keyboard: [[{ text: "Open Life Progress", web_app: { url: appUrl } }]],
          },
        }),
      });
    } catch (err) {
      console.error("telegram-webhook: failed to send /start reply", err);
    }
  }

  return NextResponse.json({ ok: true });
}
