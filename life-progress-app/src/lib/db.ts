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

// Cast every date/time column to plain text so the API (and anything that touches
// these rows server-side, like lib/sortTasks) always sees the strings the `Task`
// type promises — never node-postgres's auto-parsed `Date` objects. Missing this
// for created_at/updated_at/completed_at previously crashed sortTasks with
// "e.created_at.localeCompare is not a function" as soon as a comparison actually
// ran (i.e. from the 2nd task of the day onward) — a JS Date has no localeCompare.
export const TASK_COLUMNS = `
  id, user_id, title,
  scheduled_date::text as scheduled_date,
  scheduled_time::text as scheduled_time,
  status,
  to_char(completed_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as completed_at,
  to_char(created_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at,
  to_char(updated_at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
`;
