import { describe, expect, it } from "vitest";
import { toSlidesPath, toTalkPath } from "./talks.ts";

describe("toTalkPath", () => {
  it("詳細ページのパスを返すこと", () => {
    expect(toTalkPath("2026/0708_nihonbashijs")).toBe("/talks/2026/0708_nihonbashijs/");
  });
});

describe("toSlidesPath", () => {
  it("スライド本体のパスを返すこと", () => {
    expect(toSlidesPath("2026/0708_nihonbashijs")).toBe("/slides/2026/0708_nihonbashijs/");
  });
});
