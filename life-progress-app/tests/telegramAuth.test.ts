import { describe, expect, it } from "vitest";
import crypto from "crypto";
import { validateInitData } from "@/lib/telegramAuth";

const BOT_TOKEN = "123456:TESTTOKEN";

function buildInitData(fields: Record<string, string>, authDate = Math.floor(Date.now() / 1000)) {
  const params: Record<string, string> = { auth_date: String(authDate), query_id: "AAExample", ...fields };
  const dataCheckString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const hash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  return new URLSearchParams({ ...params, hash }).toString();
}

const VALID_USER = JSON.stringify({ id: 42, first_name: "Ada", username: "ada" });

describe("validateInitData", () => {
  it("accepts correctly signed initData", () => {
    const initData = buildInitData({ user: VALID_USER });
    const result = validateInitData(initData, BOT_TOKEN);
    expect(result).not.toBeNull();
    expect(result?.user.id).toBe(42);
    expect(result?.user.username).toBe("ada");
  });

  it("rejects a tampered payload", () => {
    const initData = buildInitData({ user: VALID_USER }).replace("Ada", "Eve");
    expect(validateInitData(initData, BOT_TOKEN)).toBeNull();
  });

  it("rejects data signed with a different bot token", () => {
    const initData = buildInitData({ user: VALID_USER });
    expect(validateInitData(initData, "999999:WRONG")).toBeNull();
  });

  it("rejects a request with no hash at all", () => {
    const params = new URLSearchParams(buildInitData({ user: VALID_USER }));
    params.delete("hash");
    expect(validateInitData(params.toString(), BOT_TOKEN)).toBeNull();
  });

  it("rejects auth_date older than the allowed max age", () => {
    const staleAuthDate = Math.floor(Date.now() / 1000) - 90000; // > 24h
    const initData = buildInitData({ user: VALID_USER }, staleAuthDate);
    expect(validateInitData(initData, BOT_TOKEN)).toBeNull();
  });

  it("rejects initData with no user field", () => {
    const initData = buildInitData({});
    expect(validateInitData(initData, BOT_TOKEN)).toBeNull();
  });

  it("rejects empty initData", () => {
    expect(validateInitData("", BOT_TOKEN)).toBeNull();
  });
});
