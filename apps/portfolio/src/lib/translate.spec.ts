import { describe, expect, it } from "vitest";
import { buildLangCookies, readSiteLang, toCookieDomains } from "./translate.ts";

describe("readSiteLang", () => {
  it("翻訳 cookie があれば en を返すこと", () => {
    expect(readSiteLang("theme=dark; googtrans=/ja/en")).toBe("en");
  });

  it("翻訳 cookie がなければ ja を返すこと", () => {
    expect(readSiteLang("theme=dark")).toBe("ja");
  });

  it("空の cookie なら ja を返すこと", () => {
    expect(readSiteLang("")).toBe("ja");
  });

  it("対象外の言語ペアなら ja を返すこと", () => {
    expect(readSiteLang("googtrans=/ja/fr")).toBe("ja");
  });
});

describe("toCookieDomains", () => {
  it("サブドメインから親ドメインまで遡ること", () => {
    expect(toCookieDomains("www.daitasu.work")).toEqual(["www.daitasu.work", "daitasu.work"]);
  });

  it("ドットのないホスト名では空になること", () => {
    expect(toCookieDomains("localhost")).toEqual([]);
  });
});

describe("buildLangCookies", () => {
  describe("en に切り替えるとき", () => {
    it("翻訳 cookie を 1 つだけ書くこと", () => {
      expect(buildLangCookies("en", "daitasu.work")).toEqual(["googtrans=/ja/en; path=/"]);
    });
  });

  describe("ja に戻すとき", () => {
    it("ドメイン指定なしと、各ドメイン指定の cookie を消すこと", () => {
      expect(buildLangCookies("ja", "portfolio.daitasu.work")).toEqual([
        "googtrans=; path=/; max-age=0",
        "googtrans=; path=/; max-age=0; domain=portfolio.daitasu.work",
        "googtrans=; path=/; max-age=0; domain=daitasu.work",
      ]);
    });

    it("localhost ではドメイン指定なしの cookie だけを消すこと", () => {
      expect(buildLangCookies("ja", "localhost")).toEqual(["googtrans=; path=/; max-age=0"]);
    });
  });
});
