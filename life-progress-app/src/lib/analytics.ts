import { pool } from "@/lib/db";

/**
 * Simple internal event tracking (spec section 22). No dashboard —
 * just stores events cleanly so they can be queried/used later.
 */
export async function logEvent(
  userId: string | null,
  eventType: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    await pool.query(
      `insert into events (user_id, event_type, metadata) values ($1, $2, $3)`,
      [userId, eventType, JSON.stringify(metadata)]
    );
  } catch (err) {
    // Analytics must never break the main request flow.
    console.error("logEvent failed", err);
  }
}
