import { describe, expect, it } from "vitest";
import {
  addDaysToDateString,
  getDateInTimezone,
  isValidDateString,
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
});
