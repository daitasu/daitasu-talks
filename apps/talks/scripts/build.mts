// Astro は build のたびに outDir を空にするので、public/ に置いて dist/ へコピーさせる（dev でも配信される）。
// apps/portfolio は og.png の有無を見てサムネイルを決めるので、このビルドを先に走らせる。

import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { findDecks, type Deck } from "@daitasu/shared/decks";
import { SITE_URL, toSlidesPath, toTalkPath } from "@daitasu/shared/talks";

const TALKS_DIR = join(fileURLToPath(import.meta.url), "../..");
const REPO_ROOT = join(TALKS_DIR, "../..");
const SLIDES_DIST = join(REPO_ROOT, "apps", "portfolio", "public", "slides");
const OG_TMP = join(TALKS_DIR, ".og-tmp");
// ローカルでも本番と同じ成果物にするため、既定で OGP を生成する。headless ブラウザが必要。省略は SKIP_OG=1。
const GEN_OG = !process.env.SKIP_OG;

const esc = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);

const outDirOf = (deck: Deck): string => join(SLIDES_DIST, deck.slug);

// hash router: 静的配信で SPA fallback 設定が不要。
// --base 由来のナビゲーションバグはテーマ側で補正し、画像などの asset はテーマの $public() で base を前置して解決する。
const buildDeck = (deck: Deck): void => {
  execFileSync(
    "npx",
    ["slidev", "build", deck.slidesPath, "--base", toSlidesPath(deck.slug), "--router-mode", "hash", "--out", outDirOf(deck)],
    { stdio: "inherit", cwd: TALKS_DIR },
  );
};

// slidev export は --output のディレクトリを丸ごとクリーンするので、必ず一時ディレクトリに吐いてから og.png だけコピーする。
const exportCover = (deck: Deck): void => {
  const tmp = join(OG_TMP, deck.slug);
  rmSync(tmp, { recursive: true, force: true });
  // --wait-until load: 既定の networkidle は常時アニメの deck で発火せず固まるため。
  execFileSync(
    "npx",
    ["slidev", "export", deck.slidesPath, "--format", "png", "--range", "1",
      "--wait-until", "load", "--wait", "800", "--timeout", "60000", "--output", tmp],
    { stdio: "inherit", cwd: TALKS_DIR },
  );
  copyFileSync(join(tmp, "1.png"), join(outDirOf(deck), "og.png")); // png export は "<n>.png" で吐く
};

// デッキ単体の URL は詳細ページの埋め込み元なので、canonical を詳細ページに向けて検索エンジンの評価をそちらへ寄せる。
// Slidev は lang="en" 固定で吐き、title に " - Slidev" を付けるので直す。
const injectHead = (deck: Deck): void => {
  const htmlPath = join(outDirOf(deck), "index.html");
  const html = readFileSync(htmlPath, "utf-8")
    .replace('<html lang="en">', '<html lang="ja">')
    .replace(/(<(?:title|meta property="og:title" content=")[^<]*?)\s*-\s*Slidev/g, "$1")
    .replace("</head>", `<link rel="canonical" href="${esc(SITE_URL + toTalkPath(deck.slug))}">\n</head>`);
  writeFileSync(htmlPath, html);
};

const processDeck = (deck: Deck): void => {
  console.log(`\n▸ ${toSlidesPath(deck.slug)}  —  ${deck.title}`);
  buildDeck(deck);
  if (GEN_OG) {
    try {
      exportCover(deck);
      console.log("  + OGP image generated");
    } catch (e) {
      console.warn(`  ! OGP image 生成に失敗（一覧はプレースホルダ表示になる）: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  injectHead(deck);
};

const decks = findDecks(TALKS_DIR);
rmSync(SLIDES_DIST, { recursive: true, force: true });
mkdirSync(SLIDES_DIST, { recursive: true });
decks.forEach(processDeck);
rmSync(OG_TMP, { recursive: true, force: true });

console.log(`\n✓ Built ${decks.length} deck(s) → ${relative(REPO_ROOT, SLIDES_DIST)}/`);
