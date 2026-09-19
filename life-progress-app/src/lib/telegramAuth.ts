import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface ValidatedInitData {
  user: TelegramUser;
  authDate: number;
}

/**
 * Validates Telegram WebApp `initData` server-side per Telegram's spec:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * Never trust the `user` field sent by the frontend without this check —
 * anyone can fabricate an initData-looking string without the bot token.
 */
export function validateInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 86400
): ValidatedInitData | null {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const pairs: string[] = [];
  const sortedKeys = Array.from(params.keys()).sort();
  for (const key of sortedKeys) {
    pairs.push(`${key}=${params.get(key)}`);
  }
  const dataCheckString = pairs.join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const validSignature =
    computedHash.length === hash.length &&
    crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));

  if (!validSignature) return null;

  const authDate = Number(params.get("auth_date") ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSeconds) {
    return null;
  }

  const userRaw = params.get("user");
  if (!userRaw) return null;

  let user: TelegramUser;
  try {
    user = JSON.parse(userRaw);
  } catch {
    return null;
  }
  if (!user || typeof user.id !== "number") return null;

  return { user, authDate };
}
