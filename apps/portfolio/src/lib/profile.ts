/** Markdown の取得元は daitasu/daitasu（GitHub プロフィール README）。ビルド時に取得する。 */
const PROFILE_RAW_BASE = "https://raw.githubusercontent.com/daitasu/daitasu/main";

export const PROFILE_DOCUMENTS = [
  { id: "readme", fileName: "README.md" },
  { id: "resume", fileName: "resume.md" },
] as const;

export type ProfileDocumentId = (typeof PROFILE_DOCUMENTS)[number]["id"];

// GitHub 上で読まれる前提のリンクを、このサイト内のページへ張り替える。
const LINK_REWRITES: ReadonlyArray<readonly [string, string]> = [
  ["https://github.com/daitasu/daitasu/blob/main/resume.md", "/resume/"],
  ["https://talks.daitasu.work/", "/talks/"],
];

export const rewriteProfileLinks = (markdown: string): string =>
  LINK_REWRITES.reduce((current, [from, to]) => current.replaceAll(`(${from})`, `(${to})`), markdown);

export const fetchProfileMarkdown = async (fileName: string): Promise<string> => {
  const url = `${PROFILE_RAW_BASE}/${fileName}`;
  const response = await fetch(url);
  // 空のページを公開しないよう、取得できなければビルドを落とす。
  if (!response.ok) throw new Error(`${url} の取得に失敗しました（HTTP ${response.status}）`);
  return response.text();
};
