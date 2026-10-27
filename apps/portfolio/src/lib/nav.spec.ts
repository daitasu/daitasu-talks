import { describe, expect, it } from "vitest";
import { isActiveNav } from "./nav.ts";

describe("isActiveNav", () => {
  it("Home はトップでだけアクティブになること", () => {
    expect(isActiveNav("/", "/")).toBe(true);
  });

  it("Home は配下のページではアクティブにならないこと", () => {
    expect(isActiveNav("/", "/talks/")).toBe(false);
  });

  it("配下の詳細ページでも親の項目をアクティブにすること", () => {
    expect(isActiveNav("/talks/", "/talks/2026/0708_nihonbashijs/")).toBe(true);
  });

  it("別の項目のページではアクティブにならないこと", () => {
    expect(isActiveNav("/resume/", "/talks/")).toBe(false);
  });
});
