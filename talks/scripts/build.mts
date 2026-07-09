// 全 slidev デッキをビルドし、表紙 OGP を生成し、トップの登壇一覧を組み立てて
// dist/ に出力する。Cloudflare Pages はこの dist/ をそのまま配信する。
//
// 流れ（最下部の実行部を参照）:
//   1. talks/ 配下のデッキを探索
//   2. 各デッキを slidev build → 表紙 PNG 生成 → og/twitter meta 注入
//   3. talks.config.ts を元に一覧カード（slidev + SpeakerDeck）を組み立て
//   4. トップ index.html を書き出し

import { readdirSync, readFileSync, statSync, existsSync, mkdirSync, writeFileSync, rmSync, copyFileSync, cpSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { talks as talkList, type Talk } from "../talks.config.ts";

// ---------- 設定 ----------

const TALKS_DIR = join(fileURLToPath(import.meta.url), "../..");
const REPO_ROOT = join(TALKS_DIR, "..");
const DIST = join(REPO_ROOT, "dist");
const ROOT_PUBLIC = join(TALKS_DIR, "public");
// 本番ドメイン。OGP の og:image は絶対 URL 必須なのでここを前置する。
const SITE = "https://talks.daitasu.work";
// トップ一覧の説明文（meta description / og:description）。
const INDEX_DESC = "daitasu の登壇スライドまとめ";
// OGP 画像（表紙 PNG）の生成。既定で生成する（本番と同じ成果物をローカルでも
// 確認できるように）。速く回したいときは SKIP_OG=1 でスキップ。要 headless ブラウザ。
const GEN_OG = !process.env.SKIP_OG;

// ---------- 型 ----------

/** talks/ から探索した slidev デッキ 1 件。 */
type Deck = {
  year: string;
  slug: string;
  slidesPath: string;
  base: string;
  title: string;
  date: string;
  event: string;
  description: string;
  hasOg: boolean; // 表紙 PNG を生成できたか（一覧サムネの有無）
};

/** 一覧カード 1 枚分の正規化済みデータ（slidev / SpeakerDeck 共通）。 */
type Card = {
  href: string;
  title: string;
  date: string;
  event: string;
  image: string; // 空ならプレースホルダ表示
  external: boolean; // true = SpeakerDeck（別タブ + バッジ）
};

// ---------- 小さなユーティリティ ----------

const esc = (s: string): string =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// HTML 属性値の実体参照を戻す（fetch した og:title 用）。
const unesc = (s: string): string =>
  String(s).replace(/&(amp|lt|gt|quot|#39|#x27);/g, (_, e) =>
    ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", "#x27": "'" })[e]!);

// PNG の IHDR から実寸を読む（先頭 24 byte、big-endian）。
const pngSize = (path: string): { w: number; h: number } => {
  const b = readFileSync(path);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

// ---------- デッキ探索 ----------

// talks/<year>/<slug>/slides.md を探し、frontmatter からメタを読む。
const findSlides = (dir: string): Deck[] => {
  const decks: Deck[] = [];
  for (const year of readdirSync(dir).sort()) {
    const yearPath = join(dir, year);
    if (!/^\d{4}$/.test(year) || !statSync(yearPath).isDirectory()) continue;
    for (const slug of readdirSync(yearPath).sort()) {
      const slidesPath = join(yearPath, slug, "slides.md");
      if (!existsSync(slidesPath)) continue;
      const fm = readFileSync(slidesPath, "utf-8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
      const field = (re: RegExp) => fm.match(re)?.[1]?.trim() ?? "";
      decks.push({
        year,
        slug,
        slidesPath,
        base: `/talks/${year}/${slug}/`,
        title: field(/^title:\s*(.+)$/m) || slug,
        date: field(/date:\s*"?([^"\n]+)"?/m),
        event: field(/event:\s*"?([^"\n]+)"?/m),
        description: field(/^description:\s*(.+)$/m),
        hasOg: false,
      });
    }
  }
  return decks;
};

// ---------- デッキのビルドと OGP ----------

const buildDeck = (deck: Deck, outDir: string): void => {
  // hash router: 静的配信で SPA fallback 設定が不要（デッキは /talks/<year>/<slug>/、
  // スライドは #/<n>）。--base 由来のナビゲーションバグはテーマ側で補正、asset は
  // deploy base + $public() で解決する。
  execFileSync(
    "npx",
    ["slidev", "build", deck.slidesPath, "--base", deck.base, "--router-mode", "hash", "--out", outDir],
    { stdio: "inherit", cwd: TALKS_DIR },
  );
};

// 表紙（1 枚目）を PNG 出力して <outDir>/og.png に置く。throws。
// slidev export は --output のディレクトリを丸ごとクリーンするので、必ず一時
// ディレクトリに吐いてから og.png だけコピーする（outDir には build 済み成果物がある）。
const exportCover = (deck: Deck, outDir: string): void => {
  const tmp = join(DIST, ".og-tmp", `${deck.year}-${deck.slug}`);
  rmSync(tmp, { recursive: true, force: true });
  // --wait-until load: 既定の networkidle は常時アニメの deck で発火せず固まるため。
  execFileSync(
    "npx",
    ["slidev", "export", deck.slidesPath, "--format", "png", "--range", "1",
      "--wait-until", "load", "--wait", "800", "--timeout", "60000", "--output", tmp],
    { stdio: "inherit", cwd: TALKS_DIR },
  );
  copyFileSync(join(tmp, "1.png"), join(outDir, "og.png")); // png export は "<n>.png" で吐く
  rmSync(tmp, { recursive: true, force: true });
};

// デッキ index.html に注入する og/twitter meta 群を組み立てる。
const deckOgpTags = (deck: Deck, ogPng: string): string => {
  const img = `${SITE}${deck.base}og.png`;
  const desc = deck.description || [deck.event, deck.date].filter(Boolean).join(" · ");
  const { w, h } = pngSize(ogPng);
  return [
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${SITE}${deck.base}">`,
    `<meta name="twitter:title" content="${esc(deck.title)}">`,
    desc && `<meta property="og:description" content="${esc(desc)}">`,
    desc && `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:image:width" content="${w}">`,
    `<meta property="og:image:height" content="${h}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:image" content="${img}">`,
  ].filter(Boolean).join("\n");
};

// </head> 直前に tags を挿入し、Slidev が付ける title の " - Slidev" 接尾辞を除去。
const injectHead = (htmlPath: string, tags: string): void => {
  const html = readFileSync(htmlPath, "utf-8")
    .replace(/(<(?:title|meta property="og:title" content=")[^<]*?)\s*-\s*Slidev/g, "$1")
    .replace("</head>", `${tags}\n</head>`);
  writeFileSync(htmlPath, html);
};

// 1 デッキを build → 表紙 OGP 生成（best-effort）→ meta 注入。hasOg を更新する。
const processDeck = (deck: Deck): void => {
  const outDir = join(DIST, "talks", deck.year, deck.slug);
  console.log(`\n▸ ${deck.base}  —  ${deck.title}`);
  buildDeck(deck, outDir);

  if (GEN_OG) {
    try {
      exportCover(deck, outDir);
      console.log("  + OGP image generated");
    } catch (e) {
      console.warn(`  ! OGP image 生成に失敗（meta はスキップ）: ${(e as Error).message}`);
    }
  }

  const ogPng = join(outDir, "og.png");
  const htmlPath = join(outDir, "index.html");
  if (existsSync(ogPng) && existsSync(htmlPath)) {
    injectHead(htmlPath, deckOgpTags(deck, ogPng));
    console.log("  + OGP meta injected");
  }
  deck.hasOg = existsSync(ogPng);
};

// ---------- 一覧（トップ index.html） ----------

// URL から og:title / og:image を取得（属性順は両パターン許容）。best-effort。
const fetchOg = async (url: string): Promise<{ title?: string; image?: string }> => {
  const pick = (html: string, prop: string): string | undefined =>
    html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1] ??
    html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${prop}["']`, "i"))?.[1];
  try {
    const html = await (await fetch(url, { redirect: "follow" })).text();
    return { title: unesc(pick(html, "og:title") ?? ""), image: pick(html, "og:image") ?? "" };
  } catch (e) {
    console.warn(`  ! og 取得失敗 ${url}: ${(e as Error).message}`);
    return {};
  }
};

// config の 1 エントリを共通形 Card に正規化する。
const toCard = async (entry: Talk, deckBySlug: Map<string, Deck>): Promise<Card | null> => {
  if (entry.kind === "slidev") {
    const d = deckBySlug.get(entry.slug);
    if (!d) {
      console.warn(`  ! index: slidev slug 未検出 "${entry.slug}"`);
      return null;
    }
    // og.png は相対参照（同一オリジンなのでドメイン非依存）
    return { href: d.base, title: d.title, date: d.date, event: d.event, image: d.hasOg ? `${d.base}og.png` : "", external: false };
  }
  // SpeakerDeck: title / 画像は og から取得（手動で両方揃っていれば fetch 不要）。
  // event は任意。無指定なら空（バッジで SpeakerDeck と分かるため冗長にしない）。
  const og = entry.title && entry.image ? {} : await fetchOg(entry.url);
  return {
    href: entry.url,
    title: entry.title || og.title || entry.url,
    date: entry.date,
    event: entry.event ?? "",
    image: entry.image || og.image || "",
    external: true,
  };
};

// presentational: 正規化済み Card を 1 枚のカード HTML に。
const renderCard = (c: Card): string => {
  const meta = [
    c.date && esc(c.date),
    c.event && `<span class="ev">${esc(c.event)}</span>`,
  ].filter(Boolean).join(" · ");
  const thumb = c.image
    ? `<img class="thumb" src="${esc(c.image)}" alt="" loading="lazy">`
    : `<div class="thumb thumb-ph"><span>${esc(c.title)}</span></div>`;
  const ext = c.external ? ` target="_blank" rel="noopener"` : "";
  const badge = c.external ? `<span class="badge">Speakerdeck</span>` : "";
  return `      <a class="card" href="${esc(c.href)}"${ext}>
        ${badge}
        ${thumb}
        <div class="body">
          <h2>${esc(c.title)}</h2>
          ${meta ? `<p class="meta">${meta}</p>` : ""}
        </div>
      </a>`;
};

// talks/public/ を dist 直下へコピーし、トップ用 OGP meta を返す。
const buildIndexHead = (): string => {
  if (existsSync(ROOT_PUBLIC)) cpSync(ROOT_PUBLIC, DIST, { recursive: true });

  let head = `<meta name="description" content="${INDEX_DESC}">`;
  const ogPng = join(DIST, "daitasu-talks-ogp.png");
  if (existsSync(ogPng)) {
    const { w, h } = pngSize(ogPng);
    const img = `${SITE}/daitasu-talks-ogp.png`;
    head += "\n" + [
      `<meta property="og:type" content="website">`,
      `<meta property="og:url" content="${SITE}/">`,
      `<meta property="og:title" content="daitasu slides">`,
      `<meta property="og:description" content="${INDEX_DESC}">`,
      `<meta name="twitter:title" content="daitasu slides">`,
      `<meta name="twitter:description" content="${INDEX_DESC}">`,
      `<meta property="og:image" content="${img}">`,
      `<meta property="og:image:width" content="${w}">`,
      `<meta property="og:image:height" content="${h}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:image" content="${img}">`,
    ].join("\n");
  }
  return head;
};

// スライドテーマ（daitasu）に合わせた白×青の海イメージの一覧ページ。
const renderIndex = (cardsHtml: string, headMeta: string): string =>
  `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>daitasu slides</title>
${headMeta}
<style>
  * { box-sizing: border-box; }
  body {
    font-family: "Zen Kaku Gothic New", system-ui, sans-serif; color: #1a1a1a;
    margin: 0; min-height: 100vh; padding: 3.5rem 1.5rem 8rem;
    background-color: #fff;
    background-image:
      radial-gradient(760px 460px at 90% -14%, rgba(74, 144, 217, 0.16), transparent 62%),
      radial-gradient(620px 420px at -12% 40%, rgba(74, 144, 217, 0.09), transparent 60%);
    background-repeat: no-repeat;
  }
  /* 下端の波（cover と同じモチーフ） */
  body::after {
    content: ""; position: fixed; left: 0; right: 0; bottom: 0; height: 120px; z-index: 0; pointer-events: none;
    background-repeat: no-repeat; background-position: bottom; background-size: 100% 100%;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath d='M0 58 C220 98 420 18 660 52 C900 86 1140 22 1440 60 L1440 120 L0 120 Z' fill='%234a90d9' fill-opacity='0.22'/%3E%3C/svg%3E"),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath d='M0 74 C260 34 520 104 780 68 C1020 36 1240 98 1440 66 L1440 120 L0 120 Z' fill='%234a90d9' fill-opacity='0.10'/%3E%3C/svg%3E");
  }
  .wrap { max-width: 1080px; margin: 0 auto; position: relative; z-index: 1; }
  h1 { font-size: 1.7rem; margin: 0 0 0.4rem; letter-spacing: .01em; }
  .lead { color: #6b7280; font-size: .92rem; margin: 0 0 2rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  .card {
    position: relative;
    display: flex; flex-direction: column; text-decoration: none; color: inherit;
    border: 1px solid #e5e7eb; border-radius: 16px; background: #fff;
    box-shadow: 0 10px 30px -22px rgba(30, 64, 128, .35);
    transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
  }
  .card:hover { transform: translateY(-5px); border-color: rgba(74, 144, 217, .5); box-shadow: 0 22px 48px -22px rgba(30, 64, 128, .5); }
  /* 角の枠にはみ出して重なる SpeakerDeck バッジ */
  .badge {
    position: absolute; top: -9px; left: -9px; z-index: 2;
    background: #009287; color: #fff; font-size: .72rem; font-weight: 700;
    padding: .24rem .62rem; border-radius: 7px; letter-spacing: .02em;
    box-shadow: 0 5px 12px -4px rgba(0, 146, 135, .6);
  }
  .thumb { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; background: #eef4fb; border-bottom: 1px solid #e5e7eb; border-radius: 15px 15px 0 0; }
  .thumb-ph { display: flex; align-items: center; justify-content: center; padding: 1rem; text-align: center; background: linear-gradient(135deg, #eaf3fc, #f7fafd); }
  .thumb-ph span { font-weight: 700; font-size: .95rem; color: #3a6099; }
  .body { padding: 1rem 1.15rem 1.2rem; }
  .body h2 { font-size: 1.02rem; line-height: 1.45; margin: 0; font-weight: 700; }
  .meta { color: #6b7280; font-size: .82rem; margin: .55rem 0 0; }
  .meta .ev { color: #4a90d9; font-weight: 600; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>daitasu slides</h1>
    <p class="lead">登壇スライド一覧</p>
    <div class="grid">
${cardsHtml}
    </div>
  </div>
</body>
</html>
`;

// ---------- 実行 ----------

const decks = findSlides(TALKS_DIR);
if (decks.length === 0) {
  console.log("No talks found.");
  process.exit(0);
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

for (const deck of decks) processDeck(deck);
rmSync(join(DIST, ".og-tmp"), { recursive: true, force: true }); // 空の一時親を除去

// talks.config.ts を単一ソースに、slidev / SpeakerDeck を正規化して日付降順で並べる。
// slidev の draft は一覧から除外（デッキ自体はビルド済みで URL 直開きは可能）。
const deckBySlug = new Map(decks.map((d) => [`${d.year}/${d.slug}`, d]));
const visible = talkList.filter((t) => !(t.kind === "slidev" && t.status === "draft"));
const cards = (await Promise.all(visible.map((t) => toCard(t, deckBySlug))))
  .filter((c): c is Card => c !== null)
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

writeFileSync(
  join(DIST, "index.html"),
  renderIndex(cards.map(renderCard).join("\n"), buildIndexHead()),
);

console.log(`\n✓ Built ${decks.length} deck(s) → ${relative(REPO_ROOT, DIST)}/`);
