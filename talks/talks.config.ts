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

  // 過去の SpeakerDeck 登壇（SpeakerDeck から date/title/画像を取得して追加）。
  // date は SpeakerDeck の公開日。title / 画像は build 時に URL から自動取得。
  // event は任意なので必要なら足す。※ 2026/0612 は slidev 版があるので除外。
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/tachikawa-dot-any-yun-ying-ai-zan", date: "2026-05-12" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/tachikawa-dot-any-shi-memasita-di-yu-komiyuniteiwonazeli-tishang-gerunoka-chu-metenoli-tishang-genobi", date: "2026-04-10" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/kai-fa-zu-zhi-noke-ti-jie-jue-wojia-su-surutamenoquan-xian-yi-rang-suruce-sareruce-tositenoxiang-kihe-ifang", date: "2026-03-04" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/koji-xian-nixue-he-qin-hokeyan-noqin-tatihezeng-ru-you-nolun-qu-dong-kai-fa", date: "2026-02-19" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/xing-an-quan-defei-yi-cun-naqing-liang-aiezientohuremuwaku-tankstack-ai", date: "2026-01-09" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/aiezientogadui-hua-de-nauiwofan-su-mcp-uidebian-waruyuzati-yan", date: "2025-11-12" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/zhi-zhong-nobi-worong-kasitekai-fa-saikuruwogao-su-nihui-su-qing-bao-tou-ming-xing-tozhi-zhong-yue-jing-karakao-eruaihurendorinazhi-zhong-jian-lian-xi", date: "2025-09-11" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/minna-xiao-yan-ninaare-woshi-xian-suru-zhi-zhong-hun-he-kai-fa-zu-zhi-nomu-biao-she-ding-ping-jia-nogai-shan-shi-li", date: "2025-08-22" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/typescript-de-railway-oriented-programming-xing-an-quan-naerahandoringuwozuo-ru", date: "2025-03-19" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/establishing-a-system-for-continuous-inquiry-about-where-we-are", date: "2024-07-23" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/designsystem-history-stores-20220310", date: "2022-03-11" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/zhi-neng-heng-duan-xing-sukuramuti-zhi-ninatutekarafalsetimugai-shan-huo-dong-improvement-activity-for-multi-functional-team", date: "2020-12-12" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/components-design-of-frontend-in-stores-dot-jp", date: "2019-10-24" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/vuedefalseanimesiyonfalsehua", date: "2019-03-22" },
  { kind: "speakerdeck", url: "https://speakerdeck.com/daitasu/lifffalseogong-nisentryhaikaga", date: "2018-12-12" },
];
