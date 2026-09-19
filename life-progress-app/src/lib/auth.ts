import { pool } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import type { User } from "@/lib/types";

/** Resolves the authenticated user from the session cookie. Never trust a client-supplied user id instead of this. */
export async function getCurrentUser(): Promise<User | null> {
  const userId = getSessionUserId();
  if (!userId) return null;
  const { rows } = await pool.query<User>("select * from users where id = $1", [userId]);
  return rows[0] ?? null;
}
