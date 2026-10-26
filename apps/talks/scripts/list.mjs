import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { findDecks } from "@daitasu/shared/decks";

const TALKS_DIR = join(fileURLToPath(import.meta.url), "../..");

const talks = findDecks(TALKS_DIR);

if (talks.length === 0) {
  console.log("No talks found.");
  process.exit(0);
}

console.log("\nAvailable talks:\n");
for (const talk of talks) {
  const meta = [talk.date, talk.event].filter(Boolean).join(" / ");
  console.log(`  ${talk.slug}`);
  console.log(`    ${talk.title}${meta ? ` (${meta})` : ""}`);
  console.log();
}
