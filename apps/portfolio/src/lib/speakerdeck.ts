export type SpeakerdeckEmbed = {
  title: string;
  playerUrl: string;
  image: string;
};

const OEMBED_ENDPOINT = "https://speakerdeck.com/oembed.json";
const PLAYER_SRC_PATTERN = /src="(https:\/\/speakerdeck\.com\/player\/([0-9a-f]+))"/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** oEmbed の html に含まれるプレイヤー iframe から埋め込み URL と表紙画像を取り出す。形式が想定外なら null。 */
export const parseOembed = (json: unknown): SpeakerdeckEmbed | null => {
  if (!isRecord(json) || typeof json.html !== "string") return null;
  const match = json.html.match(PLAYER_SRC_PATTERN);
  const playerUrl = match?.[1];
  const presentationId = match?.[2];
  if (playerUrl === undefined || presentationId === undefined) return null;
  return {
    title: typeof json.title === "string" ? json.title : "",
    playerUrl,
    image: `https://files.speakerdeck.com/presentations/${presentationId}/slide_0.jpg`,
  };
};

/** 取得に失敗したら null（詳細ページは SpeakerDeck へのリンクだけを出す）。 */
export const fetchSpeakerdeckEmbed = async (talkUrl: string): Promise<SpeakerdeckEmbed | null> => {
  try {
    const response = await fetch(`${OEMBED_ENDPOINT}?url=${encodeURIComponent(talkUrl)}`);
    if (!response.ok) return null;
    return parseOembed(await response.json());
  } catch {
    return null;
  }
};
