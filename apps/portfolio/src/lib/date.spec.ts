import { describe, expect, it } from "vitest";
import { formatProseDate, formatTalkDate } from "./date.ts";

describe("formatTalkDate", () => {
  it("YYYY.MM.DD 形式にすること", () => {
    expect(formatTalkDate("2026-07-08")).toBe("2026.07.08");
  });

  it("空文字はそのまま返すこと", () => {
    expect(formatTalkDate("")).toBe("");
  });

  it("解釈できない値はそのまま返すこと", () => {
    expect(formatTalkDate("そのうち")).toBe("そのうち");
  });
});

describe("formatProseDate", () => {
  it("ゼロ埋めなしの年月日にすること", () => {
    expect(formatProseDate("2026-07-08")).toBe("2026年7月8日");
  });

  it("解釈できない値はそのまま返すこと", () => {
    expect(formatProseDate("")).toBe("");
  });
});
