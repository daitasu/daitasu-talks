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

// If argument is provided, match it
const arg = process.argv[2];
if (arg) {
  const match = talks.find(
    (t) => t.slug === arg || t.slug.split("/")[1] === arg,
  );
  if (match) {
    console.log(`\nStarting dev server for: ${match.title}\n`);
    execSync(`npx slidev --open ${match.slidesPath}`, {
      stdio: "inherit",
      cwd: TALKS_DIR,
    });
    process.exit(0);
  }
  console.log(`Talk "${arg}" not found.`);
}

// Interactive selection
console.log("\nSelect a talk:\n");
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
  const selected = talks[index];
  console.log(`\nStarting dev server for: ${selected.title}\n`);
  execSync(`npx slidev --open ${selected.slidesPath}`, {
    stdio: "inherit",
    cwd: TALKS_DIR,
  });
});
