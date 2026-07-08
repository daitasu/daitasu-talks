import { readdirSync, readFileSync, statSync, existsSync, mkdirSync, writeFileSync, rmSync, copyFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { talks as talkList } from "../talks.config.ts";

const TALKS_DIR = join(fileURLToPath(import.meta.url), "../..");
const REPO_ROOT = join(TALKS_DIR, "..");
const DIST = join(REPO_ROOT, "dist");
// 本番ドメイン。OGP の og:image は絶対 URL 必須なのでここを前置する。
const SITE = "https://talks.daitasu.work";
// OGP 画像（表紙 PNG）の生成。既定で生成する（本番と同じ成果物をローカルでも
// 確認できるように）。速く回したいときは SKIP_OG=1 でスキップ。要 headless ブラウザ。
const GEN_OG = !process.env.SKIP_OG;

const findSlides = (dir) => {
  const results = [];
  for (const year of readdirSync(dir).sort()) {
    const yearPath = join(dir, year);
    if (!/^\d{4}$/.test(year) || !statSync(yearPath).isDirectory()) continue;
    for (const talk of readdirSync(yearPath).sort()) {
      const slidesPath = join(yearPath, talk, "slides.md");
      try {
        statSync(slidesPath);
      } catch {
        continue;
      }
      const fm = readFileSync(slidesPath, "utf-8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
      results.push({
        year,
        slug: talk,
        slidesPath,
        base: `/talks/${year}/${talk}/`,
        title: fm.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? talk,
        date: fm.match(/date:\s*"?([^"\n]+)"?/m)?.[1]?.trim() ?? "",
        event: fm.match(/event:\s*"?([^"\n]+)"?/m)?.[1]?.trim() ?? "",
        description: fm.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? "",
      });
    }
  }
  return results;
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// HTML 属性値の実体参照を戻す（fetch した og:title 用）。
const unesc = (s) =>
  String(s).replace(/&(amp|lt|gt|quot|#39|#x27);/g, (_, e) =>
    ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", "#x27": "'" })[e]);

// URL から og:title / og:image を取得（属性順は両パターン許容）。best-effort。
const fetchOg = async (url) => {
  const pick = (html, prop) =>
    html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1] ??
    html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${prop}["']`, "i"))?.[1];
  try {
    const html = await (await fetch(url, { redirect: "follow" })).text();
    return { title: unesc(pick(html, "og:title") ?? ""), image: pick(html, "og:image") ?? "" };
  } catch (e) {
    console.warn(`  ! og 取得失敗 ${url}: ${e.message}`);
    return {};
  }
};

// PNG の IHDR から実寸を読む（先頭 24 byte、big-endian）。
const pngSize = (p) => {
  const b = readFileSync(p);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

// 表紙（1 枚目）を PNG 出力して <out>/og.png に置く。best-effort。
// slidev export は --output のディレクトリを丸ごとクリーンするので、必ず一時
// ディレクトリに吐いてから og.png だけコピーする（out には build 済み成果物がある）。
const genOg = (t, out) => {
  const tmp = join(DIST, ".og-tmp", `${t.year}-${t.slug}`);
  rmSync(tmp, { recursive: true, force: true });
  // --wait-until load: 既定の networkidle は常時アニメの deck で発火せず固まるため。
  execFileSync(
    "npx",
    ["slidev", "export", t.slidesPath, "--format", "png", "--range", "1",
      "--wait-until", "load", "--wait", "800", "--timeout", "60000", "--output", tmp],
    { stdio: "inherit", cwd: TALKS_DIR },
  );
  copyFileSync(join(tmp, "1.png"), join(out, "og.png")); // png export は "<n>.png" で吐く
  rmSync(tmp, { recursive: true, force: true });
};

const talks = findSlides(TALKS_DIR);
if (talks.length === 0) {
  console.log("No talks found.");
  process.exit(0);
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

for (const t of talks) {
  const out = join(DIST, "talks", t.year, t.slug);
  console.log(`\n▸ ${t.base}  —  ${t.title}`);
  // hash router: static hosting needs no SPA-fallback config (the deck lives at
  // /talks/<year>/<slug>/, slides are #/<n>). The theme setup fixes the --base
  // navigation bug. Assets resolve via the deploy base + $public().
  execFileSync(
    "npx",
    ["slidev", "build", t.slidesPath, "--base", t.base, "--router-mode", "hash", "--out", out],
    { stdio: "inherit", cwd: TALKS_DIR },
  );

  // OGP: 表紙 PNG を生成し（CI/OG=1 のみ）、og/twitter の meta を注入する。
  // og:image は絶対 URL 必須。Slidev が付ける title の " - Slidev" 接尾辞は剥がす。
  const ogPng = join(out, "og.png");
  if (GEN_OG) {
    try {
      genOg(t, out);
      console.log("  + OGP image generated");
    } catch (e) {
      console.warn(`  ! OGP image 生成に失敗（meta はスキップ）: ${e.message}`);
    }
  }
  const htmlPath = join(out, "index.html");
  if (existsSync(ogPng) && existsSync(htmlPath)) {
    const img = `${SITE}${t.base}og.png`;
    const desc = t.description || [t.event, t.date].filter(Boolean).join(" · ");
    const { w, h } = pngSize(ogPng);
    const tags = [
      `<meta property="og:type" content="website">`,
      `<meta property="og:url" content="${SITE}${t.base}">`,
      `<meta name="twitter:title" content="${esc(t.title)}">`,
      desc && `<meta property="og:description" content="${esc(desc)}">`,
      desc && `<meta name="twitter:description" content="${esc(desc)}">`,
      `<meta property="og:image" content="${img}">`,
      `<meta property="og:image:width" content="${w}">`,
      `<meta property="og:image:height" content="${h}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:image" content="${img}">`,
    ].filter(Boolean).join("\n");
    const html = readFileSync(htmlPath, "utf-8")
      .replace(/(<(?:title|meta property="og:title" content=")[^<]*?)\s*-\s*Slidev/g, "$1")
      .replace("</head>", `${tags}\n</head>`);
    writeFileSync(htmlPath, html);
    console.log("  + OGP meta injected");
  }
  t.hasOg = existsSync(ogPng); // 一覧カードのサムネ有無に使う
}

rmSync(join(DIST, ".og-tmp"), { recursive: true, force: true }); // 空の一時親を除去

// ---- 一覧カード: talks.config.ts を単一ソースに、slidev / speakerdeck を正規化 ----
const deckBySlug = new Map(talks.map((d) => [`${d.year}/${d.slug}`, d]));

// 各エントリを共通形 { href, title, date, event, image, external } に正規化
// speakerdeck の og 取得は並列で。
const items = (await Promise.all(talkList.map(async (t) => {
  if (t.kind === "slidev") {
    const d = deckBySlug.get(t.slug);
    if (!d) { console.warn(`  ! index: slidev slug 未検出 "${t.slug}"`); return null; }
    // og.png は相対参照（同一オリジンなのでドメイン非依存）
    return { href: d.base, title: d.title, date: d.date, event: d.event, image: d.hasOg ? `${d.base}og.png` : "", external: false };
  }
  const og = t.title && t.image ? {} : await fetchOg(t.url); // 手動で両方揃っていれば fetch 不要
  // event は任意。無指定なら空（バッジで SpeakerDeck と分かるため冗長にしない）
  return { href: t.url, title: t.title || og.title || t.url, date: t.date, event: t.event ?? "", image: t.image || og.image || "", external: true };
}))).filter(Boolean);
items.sort((a, b) => (b.date || "").localeCompare(a.date || "")); // 日付降順

// presentational: 正規化済み item を 1 枚のカードに（slidev/speakerdeck 共通）
const renderCard = (it) => {
  const meta = [
    it.date && esc(it.date),
    it.event && `<span class="ev">${esc(it.event)}</span>`,
  ].filter(Boolean).join(" · ");
  const thumb = it.image
    ? `<img class="thumb" src="${esc(it.image)}" alt="" loading="lazy">`
    : `<div class="thumb thumb-ph"><span>${esc(it.title)}</span></div>`;
  const ext = it.external ? ` target="_blank" rel="noopener"` : "";
  const badge = it.external ? `<span class="badge">Speakerdeck</span>` : "";
  return `      <a class="card" href="${esc(it.href)}"${ext}>
        ${badge}
        ${thumb}
        <div class="body">
          <h2>${esc(it.title)}</h2>
          ${meta ? `<p class="meta">${meta}</p>` : ""}
        </div>
      </a>`;
};
const cards = items.map(renderCard).join("\n");

writeFileSync(
  join(DIST, "index.html"),
  `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>daitasu slides</title>
<style>
  * { box-sizing: border-box; }
  /* スライドテーマ（daitasu）に合わせた白×青の海イメージ */
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
${cards}
    </div>
  </div>
</body>
</html>
`,
);

console.log(`\n✓ Built ${talks.length} deck(s) → ${relative(REPO_ROOT, DIST)}/`);
