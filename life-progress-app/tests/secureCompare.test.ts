import { describe, expect, it } from "vitest";
import { secureCompare } from "@/lib/secureCompare";

describe("secureCompare", () => {
  it("returns true for identical strings", () => {
    expect(secureCompare("abc123", "abc123")).toBe(true);
  });

  it("returns false for different strings of the same length", () => {
    expect(secureCompare("abc123", "abc124")).toBe(false);
  });

  it("returns false for strings of different length, without throwing", () => {
    expect(secureCompare("short", "a-much-longer-string")).toBe(false);
  });

  it("returns false against an empty string", () => {
    expect(secureCompare("abc123", "")).toBe(false);
  });
});
