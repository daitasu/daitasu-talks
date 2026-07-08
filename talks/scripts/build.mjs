import { readdirSync, readFileSync, statSync, existsSync, mkdirSync, writeFileSync, rmSync, copyFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const TALKS_DIR = join(fileURLToPath(import.meta.url), "../..");
const REPO_ROOT = join(TALKS_DIR, "..");
const DIST = join(REPO_ROOT, "dist");
// 本番ドメイン。OGP の og:image は絶対 URL 必須なのでここを前置する。
const SITE = "https://talks.daitasu.work";
// OGP 画像（表紙 PNG）の生成は headless ブラウザが要る。CI では必ず生成し、
// ローカルは既定でスキップ（毎回の just build を遅くしない）。OG=1 で強制。
const GEN_OG = !!(process.env.CI || process.env.OG);

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

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

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

// Root index: 全デッキをカードのグリッドで並べる
const cards = talks
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  .map((t) => {
    const meta = [t.date, t.event].filter(Boolean).map(esc).join(" · ");
    // og.png は相対参照（同一オリジンなのでドメイン非依存）。無ければタイトルの
    // プレースホルダを出す。
    const thumb = t.hasOg
      ? `<img class="thumb" src="${t.base}og.png" alt="" loading="lazy">`
      : `<div class="thumb thumb-ph"><span>${esc(t.title)}</span></div>`;
    return `      <a class="card" href="${t.base}">
        ${thumb}
        <div class="body">
          <h2>${esc(t.title)}</h2>
          ${meta ? `<p class="meta">${meta}</p>` : ""}
        </div>
      </a>`;
  })
  .join("\n");

writeFileSync(
  join(DIST, "index.html"),
  `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>daitasu slides</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; max-width: 1080px; margin: 0 auto; padding: 3rem 1.5rem 5rem; color: #1a1a1a; background: #fff; }
  h1 { font-size: 1.6rem; margin: 0 0 1.8rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.4rem; }
  .card { display: flex; flex-direction: column; text-decoration: none; color: inherit; border: 1px solid #e5e7eb; border-radius: 14px; overflow: hidden; background: #fff; transition: transform .15s ease, box-shadow .15s ease; }
  .card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -20px rgba(30, 64, 128, .45); }
  .thumb { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; background: #eef4fb; border-bottom: 1px solid #e5e7eb; }
  .thumb-ph { display: flex; align-items: center; justify-content: center; padding: 1rem; text-align: center; background: linear-gradient(135deg, #eaf3fc, #f7fafd); }
  .thumb-ph span { font-weight: 700; font-size: .95rem; color: #3a6099; }
  .body { padding: .9rem 1.1rem 1.1rem; }
  .body h2 { font-size: 1.02rem; line-height: 1.4; margin: 0; font-weight: 700; }
  .meta { color: #6b7280; font-size: .82rem; margin: .5rem 0 0; }
  @media (prefers-color-scheme: dark) {
    body { color: #e7ebf2; background: #0f1115; }
    .card { background: #171a21; border-color: #262b35; }
    .thumb { background: #1c2530; border-color: #262b35; }
    .thumb-ph { background: linear-gradient(135deg, #1a2331, #141821); }
    .thumb-ph span { color: #8fb4e6; }
    .meta { color: #98a2b3; }
  }
</style>
</head>
<body>
  <h1>daitasu slides</h1>
  <div class="grid">
${cards}
  </div>
</body>
</html>
`,
);

console.log(`\n✓ Built ${talks.length} deck(s) → ${relative(REPO_ROOT, DIST)}/`);
