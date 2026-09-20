/**
 * Timezone helpers. Tasks and "Today" must always be resolved using the
 * user's stored timezone, never the server's — see spec section 20.
 */

/** Returns today's date as YYYY-MM-DD in the given IANA timezone. */
export function getDateInTimezone(timezone: string, reference: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(reference);
  } catch {
    // Invalid/unsupported timezone string — fall back to UTC rather than throwing.
    return getDateInTimezone("UTC", reference);
  }
}

export function addDaysToDateString(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Basic YYYY-MM-DD validation. */
export function isValidDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime());
}

/** Basic YYYY-MM validation (calendar month view — see /api/progress/month). */
export function isValidMonthString(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

/**
 * Calendar grid helpers for the Progress month view. All UTC-based on
 * purpose — these only ever operate on a "YYYY-MM" string, never a Date
 * from the browser, so there's no local-timezone rollover risk (the exact
 * class of bug the created_at/scheduled_date fixes were about).
 */

/** Number of days in the given month. */
export function daysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Weekday of the 1st of the month, Monday = 0 ... Sunday = 6. */
export function firstWeekdayOfMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  const sundayFirst = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // 0=Sun..6=Sat
  return (sundayFirst + 6) % 7;
}

/** Shifts a "YYYY-MM" string by `delta` months (negative to go back). */
export function addMonths(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Basic HH:MM validation (24h). */
export function isValidTimeString(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}
