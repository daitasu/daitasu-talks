import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchProfileMarkdown, rewriteProfileLinks } from "./profile.ts";

describe("rewriteProfileLinks", () => {
  it("GitHub 上の resume.md へのリンクを /resume/ に張り替えること", () => {
    expect(rewriteProfileLinks("- [レジュメ](https://github.com/daitasu/daitasu/blob/main/resume.md)")).toBe(
      "- [レジュメ](/resume/)",
    );
  });

  it("talks.daitasu.work へのリンクを /talks/ に張り替えること", () => {
    expect(rewriteProfileLinks("- [登壇資料](https://talks.daitasu.work/)")).toBe("- [登壇資料](/talks/)");
  });

  it("同じリンクが複数あれば全て張り替えること", () => {
    expect(rewriteProfileLinks("[a](https://talks.daitasu.work/) [b](https://talks.daitasu.work/)")).toBe(
      "[a](/talks/) [b](/talks/)",
    );
  });

  it("対象外のリンクは変えないこと", () => {
    expect(rewriteProfileLinks("[Zenn](https://zenn.dev/daitasu)")).toBe("[Zenn](https://zenn.dev/daitasu)");
  });
});

describe("fetchProfileMarkdown", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("daitasu/daitasu の raw URL から取得すること", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("# resume"));
    vi.stubGlobal("fetch", fetchMock);
    await fetchProfileMarkdown("resume.md");
    expect(fetchMock).toHaveBeenCalledWith("https://raw.githubusercontent.com/daitasu/daitasu/main/resume.md");
  });

  it("本文を返すこと", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("# resume")));
    expect(await fetchProfileMarkdown("resume.md")).toBe("# resume");
  });

  it("HTTP エラーならビルドを止めるため例外を投げること", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })));
    await expect(fetchProfileMarkdown("resume.md")).rejects.toThrow("HTTP 404");
  });
});
