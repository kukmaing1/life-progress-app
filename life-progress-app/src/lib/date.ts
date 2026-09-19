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

/** Basic HH:MM validation (24h). */
export function isValidTimeString(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}
