import { Pool } from "pg";

// Reuse a single pool across hot reloads / serverless invocations.
declare global {
  // eslint-disable-next-line no-var
  var __lifeProgressPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false },
    max: 5,
  });
}

export const pool = global.__lifeProgressPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global.__lifeProgressPool = pool;
}

// Cast date/time columns to plain strings so the API returns "YYYY-MM-DD" / "HH:MM"
// instead of node-postgres's parsed Date objects (which JSON-serialize as full timestamps).
export const TASK_COLUMNS = `
  id, user_id, title,
  scheduled_date::text as scheduled_date,
  scheduled_time::text as scheduled_time,
  status, completed_at, created_at, updated_at
`;
