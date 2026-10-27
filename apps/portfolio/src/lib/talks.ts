import type { Deck } from "@daitasu/shared/decks";
import { toSlidesPath, type TalkEntry } from "@daitasu/shared/talks";
import { formatProseDate } from "./date.ts";
import type { SpeakerdeckEmbed } from "./speakerdeck.ts";

/** 一覧カードと詳細ページの両方で使う、slidev / SpeakerDeck を正規化した登壇 1 件。 */
export type TalkItem = {
  slug: string;
  kind: TalkEntry["kind"];
  title: string;
  date: string;
  event: string;
  eventUrl: string;
  description: string;
  /** サムネイル・OGP 画像。slidev はサイト内パス、SpeakerDeck は絶対 URL。空ならプレースホルダ表示。 */
  image: string;
  /** iframe で埋め込む URL。空なら埋め込みなしで sourceUrl へのリンクだけを出す。 */
  embedUrl: string;
  /** スライド本体を単体で開く URL。 */
  sourceUrl: string;
  /** false は一覧に出さない（詳細ページは生成する）。 */
  listed: boolean;
};

export type ResolveTalksDeps = {
  decks: Deck[];
  hasCoverImage: (slug: string) => boolean;
  fetchSpeakerdeckEmbed: (url: string) => Promise<SpeakerdeckEmbed | null>;
  warn: (message: string) => void;
};

const COVER_IMAGE_NAME = "og.png";

export const describeTalk = (date: string, event: string): string =>
  event ? `${formatProseDate(date)} 「${event}」における登壇資料です。` : `${formatProseDate(date)} の登壇資料です。`;

const resolveEntry = async (entry: TalkEntry, deps: ResolveTalksDeps): Promise<TalkItem | null> => {
  if (entry.kind === "slidev") {
    const deck = deps.decks.find((candidate) => candidate.slug === entry.slug);
    if (deck === undefined) {
      deps.warn(`slidev slug 未検出 "${entry.slug}"`);
      return null;
    }
    const slidesPath = toSlidesPath(deck.slug);
    return {
      slug: deck.slug,
      kind: "slidev",
      title: deck.title,
      date: deck.date,
      event: deck.event,
      eventUrl: deck.eventUrl,
      description: deck.description || describeTalk(deck.date, deck.event),
      image: deps.hasCoverImage(deck.slug) ? `${slidesPath}${COVER_IMAGE_NAME}` : "",
      embedUrl: slidesPath,
      sourceUrl: slidesPath,
      listed: entry.status !== "draft",
    };
  }

  const embed = await deps.fetchSpeakerdeckEmbed(entry.url);
  if (embed === null) deps.warn(`SpeakerDeck の埋め込み取得に失敗 ${entry.url}`);
  const event = entry.event ?? "";
  return {
    slug: entry.slug,
    kind: "speakerdeck",
    title: entry.title || embed?.title || entry.url,
    date: entry.date,
    event,
    eventUrl: entry.eventUrl ?? "",
    description: describeTalk(entry.date, event),
    image: entry.image || embed?.image || "",
    embedUrl: embed?.playerUrl ?? "",
    sourceUrl: entry.url,
    listed: true,
  };
};

/** talks.config.ts の並びを TalkItem に正規化し、日付の新しい順に並べる。解決できないエントリは警告して除く。 */
export const resolveTalks = async (entries: TalkEntry[], deps: ResolveTalksDeps): Promise<TalkItem[]> => {
  const resolved = await Promise.all(entries.map((entry) => resolveEntry(entry, deps)));
  return resolved
    .filter((talk): talk is TalkItem => talk !== null)
    .toSorted((a, b) => b.date.localeCompare(a.date));
};
