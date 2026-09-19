import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "lp_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

interface SessionPayload {
  userId: string;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

export function createSessionToken(userId: string): string {
  return jwt.sign({ userId } satisfies SessionPayload, getSecret(), {
    expiresIn: SESSION_TTL_SECONDS,
  });
}

/** Reads and verifies the session cookie on the current request. Returns null if absent/invalid. */
export function getSessionUserId(): string | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getSecret()) as SessionPayload;
    return payload.userId;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    maxAge: SESSION_TTL_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const, // Telegram Mini Apps load inside an iframe/webview
    path: "/",
  };
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
