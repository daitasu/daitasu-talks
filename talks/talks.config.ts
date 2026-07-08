// 一覧（talks.daitasu.work トップ）に並べる登壇の master リスト。
// 日付降順で表示される（date はソートキー）。
// build.mjs がこれを読んでカードを生成する。

export type Talk =
  | {
      kind: "slidev";
      /** talks/<slug>/slides.md の <slug>（例: "2026/0708_nihonbashijs"）。
       *  title / date / event / OGP はデッキから自動解決するので書かない。 */
      slug: string;
    }
  | {
      kind: "speakerdeck";
      /** SpeakerDeck の talk URL。title と画像は og:title / og:image を build 時に取得。 */
      url: string;
      /** 登壇日（SpeakerDeck からは取れないので手動）。"YYYY-MM-DD"。 */
      date: string;
      /** 任意。イベント名。 */
      event?: string;
      /** 任意。fetch した og:title を上書き（or 取得失敗時のフォールバック）。 */
      title?: string;
      /** 任意。og:image を上書き。 */
      image?: string;
    };

export const talks: Talk[] = [
  { kind: "slidev", slug: "2026/0710_tamagawadev" },
  { kind: "slidev", slug: "2026/0708_nihonbashijs" },
  { kind: "slidev", slug: "2026/0612_tamadev" },

  // 過去の SpeakerDeck 登壇。date を埋めると日付降順に差し込まれる。
  // title / 画像は URL から自動取得。event は任意。
  // {
  //   kind: "speakerdeck",
  //   url: "https://speakerdeck.com/daitasu/components-design-of-frontend-in-stores-dot-jp",
  //   date: "2022-03-10",
  //   event: "STORES Tech Talk",
  // },
];
