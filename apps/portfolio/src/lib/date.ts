import dayjs from "dayjs";

const TALK_DATE_FORMAT = "YYYY.MM.DD";
const PROSE_DATE_FORMAT = "YYYY年M月D日";

const formatDate = (date: string, format: string): string => {
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format(format) : date;
};

/** 一覧・詳細ページの日付表示用（例: "2026.07.08"）。解釈できない値はそのまま返す。 */
export const formatTalkDate = (date: string): string => formatDate(date, TALK_DATE_FORMAT);

/** 文中に埋め込む用（例: "2026年7月8日"）。解釈できない値はそのまま返す。 */
export const formatProseDate = (date: string): string => formatDate(date, PROSE_DATE_FORMAT);
