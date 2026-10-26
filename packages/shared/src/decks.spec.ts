import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, onTestFinished } from "vitest";
import { findDecks, parseDeckMeta } from "./decks.ts";

const FULL_DECK = `---
theme: ../../themes/daitasu
title: Generative UI の逐次描画
description: 2026年7月8日の登壇資料です。
talk:
  date: "2026-07-08"
  event: "Nihonbashi.js #11"
  eventUrl: "https://example.com/events/11"
layout: cover
---

# Generative UI
`;

describe("parseDeckMeta", () => {
  describe("正常系", () => {
    it("title を読むこと", () => {
      expect(parseDeckMeta(FULL_DECK, "fallback").title).toBe("Generative UI の逐次描画");
    });

    it("talk 配下の date を読むこと", () => {
      expect(parseDeckMeta(FULL_DECK, "fallback").date).toBe("2026-07-08");
    });

    it("talk 配下の event を読むこと", () => {
      expect(parseDeckMeta(FULL_DECK, "fallback").event).toBe("Nihonbashi.js #11");
    });

    it("talk 配下の eventUrl を読むこと", () => {
      expect(parseDeckMeta(FULL_DECK, "fallback").eventUrl).toBe("https://example.com/events/11");
    });

    it("description を読むこと", () => {
      expect(parseDeckMeta(FULL_DECK, "fallback").description).toBe("2026年7月8日の登壇資料です。");
    });

    it("引用符なしの日付も文字列として読むこと", () => {
      const markdown = "---\ntalk:\n  date: 2026-07-08\n---\n";
      expect(parseDeckMeta(markdown, "fallback").date).toBe("2026-07-08");
    });
  });

  describe("欠損・異常系", () => {
    it("title が無ければ fallbackTitle を返すこと", () => {
      expect(parseDeckMeta("---\nlayout: cover\n---\n", "0612_tamadev").title).toBe("0612_tamadev");
    });

    it("talk が無ければ eventUrl を空文字にすること", () => {
      expect(parseDeckMeta("---\ntitle: x\n---\n", "fallback").eventUrl).toBe("");
    });

    it("frontmatter が無ければ fallbackTitle を返すこと", () => {
      expect(parseDeckMeta("# no frontmatter", "fallback").title).toBe("fallback");
    });

    it("YAML が壊れていても例外を投げず fallbackTitle を返すこと", () => {
      expect(parseDeckMeta("---\ntitle: [unclosed\n---\n", "fallback").title).toBe("fallback");
    });
  });
});

describe("findDecks", () => {
  const createTalksDir = (): string => {
    const root = mkdtempSync(join(tmpdir(), "decks-"));
    onTestFinished(() => rmSync(root, { recursive: true, force: true }));
    return root;
  };

  const writeDeck = (root: string, relativeDir: string, markdown: string): void => {
    mkdirSync(join(root, relativeDir), { recursive: true });
    writeFileSync(join(root, relativeDir, "slides.md"), markdown);
  };

  it("<year>/<dir>/slides.md を slug 付きで見つけること", () => {
    const root = createTalksDir();
    writeDeck(root, "2026/0708_nihonbashijs", FULL_DECK);
    expect(findDecks(root).map((deck) => deck.slug)).toEqual(["2026/0708_nihonbashijs"]);
  });

  it("年の形式でないディレクトリを無視すること", () => {
    const root = createTalksDir();
    writeDeck(root, "themes/daitasu", FULL_DECK);
    expect(findDecks(root)).toEqual([]);
  });

  it("slides.md の無いディレクトリを無視すること", () => {
    const root = createTalksDir();
    mkdirSync(join(root, "2026/frontend-conf-kansai"), { recursive: true });
    expect(findDecks(root)).toEqual([]);
  });

  it("slug の昇順で返すこと", () => {
    const root = createTalksDir();
    writeDeck(root, "2026/0907_gotandats", FULL_DECK);
    writeDeck(root, "2025/1201_sample", FULL_DECK);
    writeDeck(root, "2026/0612_tamadev", FULL_DECK);
    expect(findDecks(root).map((deck) => deck.slug)).toEqual([
      "2025/1201_sample",
      "2026/0612_tamadev",
      "2026/0907_gotandats",
    ]);
  });
});
