export type SiteLang = "ja" | "en";

export const SOURCE_LANG: SiteLang = "ja";
export const TRANSLATED_LANG: SiteLang = "en";

/** Google 翻訳のウェブ埋め込みは、この cookie（値は `/<原文>/<訳文>`）を見て読み込み時に翻訳する。 */
const TRANSLATE_COOKIE_NAME = "googtrans";
const TRANSLATED_COOKIE_VALUE = `/${SOURCE_LANG}/${TRANSLATED_LANG}`;

export const readSiteLang = (cookie: string): SiteLang =>
  cookie.split(";").some((entry) => entry.trim() === `${TRANSLATE_COOKIE_NAME}=${TRANSLATED_COOKIE_VALUE}`)
    ? TRANSLATED_LANG
    : SOURCE_LANG;

/** ホスト名自身と、ドット区切りで遡れる親ドメイン（TLD 単体は除く）。 */
export const toCookieDomains = (hostname: string): string[] =>
  hostname
    .split(".")
    .map((_, index, labels) => labels.slice(index).join("."))
    .filter((domain) => domain.includes("."));

/**
 * 言語を切り替えるために書き込む cookie 文字列の一覧。
 * Google 翻訳はホスト名と親ドメインの両方に cookie を書くことがあるので、原文へ戻すときは全候補を消す。
 */
export const buildLangCookies = (lang: SiteLang, hostname: string): string[] => {
  if (lang === TRANSLATED_LANG) return [`${TRANSLATE_COOKIE_NAME}=${TRANSLATED_COOKIE_VALUE}; path=/`];

  const expired = `${TRANSLATE_COOKIE_NAME}=; path=/; max-age=0`;
  return [expired, ...toCookieDomains(hostname).map((domain) => `${expired}; domain=${domain}`)];
};
