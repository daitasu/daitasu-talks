import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE_URL, toTalkPath } from "@daitasu/shared/talks";
import { talks } from "talks/config";

// draft の詳細ページは URL 直開き用なので、検索エンジンに渡さない（ページ側でも noindex を出す）
const draftTalkUrls = new Set(
  talks.filter((talk) => talk.kind === "slidev" && talk.status === "draft").map((talk) => `${SITE_URL}${toTalkPath(talk.slug)}`),
);

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !draftTalkUrls.has(page) })],
});
