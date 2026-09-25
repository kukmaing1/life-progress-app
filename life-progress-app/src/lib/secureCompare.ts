import crypto from "crypto";

/**
 * Constant-time string comparison for secrets (webhook/cron tokens), so a
 * mismatch can't be timed byte-by-byte to guess the correct value one
 * character at a time. Same approach telegramAuth.ts already uses for the
 * Telegram initData HMAC check — this just gives the other two secret
 * checks in the app (webhook, cron) the same protection instead of a plain
 * `!==`.
 */
export function secureCompare(a: string, b: string): boolean {
  return a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
