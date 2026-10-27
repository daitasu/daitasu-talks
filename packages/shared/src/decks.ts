import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

export type DeckMeta = {
  title: string;
  date: string;
  event: string;
  eventUrl: string;
  description: string;
};

/** apps/talks/<year>/<dir>/slides.md から見つけた slidev デッキ 1 件。 */
export type Deck = DeckMeta & {
  /** "<year>/<dir>" */
  slug: string;
  slidesPath: string;
};

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const YEAR_DIR_PATTERN = /^\d{4}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (record: Record<string, unknown>, key: string): string => {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
};

const parseFrontmatter = (markdown: string): Record<string, unknown> => {
  const source = markdown.match(FRONTMATTER_PATTERN)?.[1];
  if (source === undefined) return {};
  try {
    const parsed: unknown = parse(source);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

/** slides.md の frontmatter から一覧・詳細ページに使うメタを読む。 */
export const parseDeckMeta = (markdown: string, fallbackTitle: string): DeckMeta => {
  const frontmatter = parseFrontmatter(markdown);
  const talk = isRecord(frontmatter.talk) ? frontmatter.talk : {};
  return {
    title: readString(frontmatter, "title") || fallbackTitle,
    date: readString(talk, "date"),
    event: readString(talk, "event"),
    eventUrl: readString(talk, "eventUrl"),
    description: readString(frontmatter, "description"),
  };
};

const listDirectories = (dir: string): string[] =>
  readdirSync(dir)
    .filter((name) => statSync(join(dir, name)).isDirectory())
    .sort();

export const findDecks = (talksDir: string): Deck[] =>
  listDirectories(talksDir)
    .filter((year) => YEAR_DIR_PATTERN.test(year))
    .flatMap((year) =>
      listDirectories(join(talksDir, year)).map((dir) => ({
        dir,
        slug: `${year}/${dir}`,
        slidesPath: join(talksDir, year, dir, "slides.md"),
      })),
    )
    .filter(({ slidesPath }) => existsSync(slidesPath))
    .map(({ dir, slug, slidesPath }) => ({
      slug,
      slidesPath,
      ...parseDeckMeta(readFileSync(slidesPath, "utf-8"), dir),
    }));
