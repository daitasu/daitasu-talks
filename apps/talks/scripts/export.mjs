import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { execSync } from "node:child_process";
import { findDecks } from "@daitasu/shared/decks";

const TALKS_DIR = join(fileURLToPath(import.meta.url), "../..");

const talks = findDecks(TALKS_DIR);

if (talks.length === 0) {
  console.log("No talks found.");
  process.exit(0);
}

const exportTalk = (selected) => {
  const outDir = join(TALKS_DIR, "dist", selected.slug.replace("/", "-"));
  mkdirSync(outDir, { recursive: true });

  console.log(`\nExporting: ${selected.title}\n`);
  execSync(
    `npx slidev export ${selected.slidesPath} --output ${join(outDir, "slides.pdf")}`,
    { stdio: "inherit", cwd: TALKS_DIR },
  );
  console.log(`\nExported to: ${outDir}/slides.pdf`);
};

const arg = process.argv[2];
if (arg) {
  const match = talks.find(
    (t) => t.slug === arg || t.slug.split("/")[1] === arg,
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
  console.log(`  [${i + 1}] ${talk.slug} - ${talk.title}`);
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
