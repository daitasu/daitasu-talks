import { readdirSync, readFileSync, statSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { execSync } from "node:child_process";

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
      results.push({
        dir: join(yearPath, talk),
        path: talk,
        year,
        title,
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

const exportTalk = (selected) => {
  const outDir = join(TALKS_DIR, "dist", `${selected.year}-${selected.path}`);
  mkdirSync(outDir, { recursive: true });

  console.log(`\nExporting: ${selected.title}\n`);
  execSync(
    `npx slidev export ${join(selected.dir, "slides.md")} --output ${join(outDir, "slides.pdf")}`,
    { stdio: "inherit", cwd: TALKS_DIR },
  );
  console.log(`\nExported to: ${outDir}/slides.pdf`);
};

const arg = process.argv[2];
if (arg) {
  const match = talks.find(
    (t) => `${t.year}/${t.path}` === arg || t.path === arg,
  );
  if (match) {
    exportTalk(match);
    process.exit(0);
  }
  console.log(`Talk "${arg}" not found.`);
  process.exit(1);
}

console.log("\nSelect a talk to export:\n");
talks.forEach((talk, i) => {
  console.log(`  [${i + 1}] ${talk.year}/${talk.path} - ${talk.title}`);
});
console.log();

const rl = createInterface({ input: process.stdin, output: process.stdout });
rl.question("Enter number: ", (answer) => {
  rl.close();
  const index = parseInt(answer, 10) - 1;
  if (index < 0 || index >= talks.length) {
    console.log("Invalid selection.");
    process.exit(1);
  }
  exportTalk(talks[index]);
});
