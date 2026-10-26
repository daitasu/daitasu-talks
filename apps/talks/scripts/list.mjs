import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TALKS_DIR = join(fileURLToPath(import.meta.url), "../..");

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
      const content = readFileSync(slidesPath, "utf-8");
      const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
      const title =
        frontmatter?.[1]?.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? talk;
      const date =
        frontmatter?.[1]?.match(/date:\s*"?([^"\n]+)"?/m)?.[1]?.trim() ?? "";
      const event =
        frontmatter?.[1]?.match(/event:\s*"?([^"\n]+)"?/m)?.[1]?.trim() ?? "";
      results.push({
        path: relative(dir, join(yearPath, talk)),
        title,
        date,
        event,
      });
    }
  }
  return results;
};

const talks = findSlides(TALKS_DIR);

if (talks.length === 0) {
  console.log("No talks found.");
  process.exit(0);
}

console.log("\nAvailable talks:\n");
for (const talk of talks) {
  const meta = [talk.date, talk.event].filter(Boolean).join(" / ");
  console.log(`  ${talk.path}`);
  console.log(`    ${talk.title}${meta ? ` (${meta})` : ""}`);
  console.log();
}
