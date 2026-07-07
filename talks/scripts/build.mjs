import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const TALKS_DIR = join(fileURLToPath(import.meta.url), "../..");
const REPO_ROOT = join(TALKS_DIR, "..");
const DIST = join(REPO_ROOT, "dist");

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
      });
    }
  }
  return results;
};

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

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
  // hash router avoids per-deck SPA fallback config; base makes assets resolve under the sub-route
  execFileSync(
    "npx",
    ["slidev", "build", t.slidesPath, "--base", t.base, "--router-mode", "hash", "--out", out],
    { stdio: "inherit", cwd: TALKS_DIR },
  );
}

// Root index linking to every deck
const items = talks
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  .map((t) => {
    const meta = [t.date, t.event].filter(Boolean).map(esc).join(" · ");
    return `    <li><a href="${t.base}">${esc(t.title)}</a>${meta ? `<span>${meta}</span>` : ""}</li>`;
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
  body { font-family: system-ui, sans-serif; max-width: 720px; margin: 4rem auto; padding: 0 1.5rem; color: #1a1a1a; }
  h1 { font-size: 1.5rem; }
  ul { list-style: none; padding: 0; }
  li { padding: 0.9rem 0; border-bottom: 1px solid #e5e7eb; }
  a { color: #4a90d9; text-decoration: none; font-weight: 600; }
  a:hover { text-decoration: underline; }
  span { display: block; color: #6b7280; font-size: 0.85rem; margin-top: 0.2rem; }
</style>
</head>
<body>
  <h1>daitasu slides</h1>
  <ul>
${items}
  </ul>
</body>
</html>
`,
);

console.log(`\n✓ Built ${talks.length} deck(s) → ${relative(REPO_ROOT, DIST)}/`);
