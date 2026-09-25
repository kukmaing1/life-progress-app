import { describe, expect, it } from "vitest";
import {
  addDaysToDateString,
  addMonths,
  daysInMonth,
  firstWeekdayOfMonth,
  formatDateLong,
  formatWeekdayShort,
  getDateInTimezone,
  isValidDateString,
  isValidMonthString,
  isValidTimeString,
  isValidTimezone,
} from "@/lib/date";

describe("getDateInTimezone", () => {
  it("resolves 'today' independently per timezone, not the server's", () => {
    // 23:30 UTC on Jan 1 is already Jan 2 in Kyiv (UTC+2).
    const reference = new Date("2026-01-01T23:30:00Z");
    expect(getDateInTimezone("UTC", reference)).toBe("2026-01-01");
    expect(getDateInTimezone("Europe/Kyiv", reference)).toBe("2026-01-02");
  });

  it("falls back to UTC instead of throwing on an invalid timezone", () => {
    const reference = new Date("2026-01-01T12:00:00Z");
    expect(getDateInTimezone("Not/ARealZone", reference)).toBe("2026-01-01");
  });
});

describe("addDaysToDateString", () => {
  it("adds days across month and year boundaries", () => {
    expect(addDaysToDateString("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDaysToDateString("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDaysToDateString("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("validators", () => {
  it("validates date strings strictly", () => {
    expect(isValidDateString("2026-09-19")).toBe(true);
    expect(isValidDateString("19-09-2026")).toBe(false);
    expect(isValidDateString("not-a-date")).toBe(false);
  });

  it("validates 24h time strings", () => {
    expect(isValidTimeString("09:05")).toBe(true);
    expect(isValidTimeString("23:59")).toBe(true);
    expect(isValidTimeString("9:5")).toBe(false);
    expect(isValidTimeString("24:00")).toBe(false);
  });

  it("validates IANA timezone names", () => {
    expect(isValidTimezone("Europe/Kyiv")).toBe(true);
    expect(isValidTimezone("Not/ARealZone")).toBe(false);
  });

  it("validates YYYY-MM month strings", () => {
    expect(isValidMonthString("2026-09")).toBe(true);
    expect(isValidMonthString("2026-13")).toBe(false);
    expect(isValidMonthString("2026-9")).toBe(false);
    expect(isValidMonthString("2026-09-19")).toBe(false);
  });
});

describe("formatDateLong", () => {
  it("formats a plain date string as a long UTC-anchored label", () => {
    // Sep 24, 2026 is a Thursday.
    expect(formatDateLong("2026-09-24")).toBe("Thursday, September 24");
    expect(formatDateLong("2026-01-01")).toBe("Thursday, January 1");
  });
});

describe("formatWeekdayShort", () => {
  it("formats a plain date string as a short UTC-anchored weekday", () => {
    expect(formatWeekdayShort("2026-09-24")).toBe("Thu");
    expect(formatWeekdayShort("2026-09-19")).toBe("Sat");
  });
});

describe("calendar grid helpers", () => {
  it("counts days in a month, leap years included", () => {
    expect(daysInMonth("2026-09")).toBe(30);
    expect(daysInMonth("2026-02")).toBe(28);
    expect(daysInMonth("2024-02")).toBe(29); // leap year
  });

  it("finds the Monday-first weekday of the 1st", () => {
    // Sep 1, 2026 is a Tuesday -> index 1 (Mon=0).
    expect(firstWeekdayOfMonth("2026-09")).toBe(1);
    // Nov 1, 2026 is a Sunday -> index 6.
    expect(firstWeekdayOfMonth("2026-11")).toBe(6);
  });

  it("shifts months across year boundaries", () => {
    expect(addMonths("2026-09", 1)).toBe("2026-10");
    expect(addMonths("2026-12", 1)).toBe("2027-01");
    expect(addMonths("2026-01", -1)).toBe("2025-12");
  });
});
