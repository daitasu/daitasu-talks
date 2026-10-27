import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { fetchProfileMarkdown, PROFILE_DOCUMENTS, rewriteProfileLinks } from "./lib/profile.ts";

const profile = defineCollection({
  loader: {
    name: "profile-loader",
    load: async ({ store, renderMarkdown }) => {
      store.clear();
      await Promise.all(
        PROFILE_DOCUMENTS.map(async ({ id, fileName }) => {
          const body = rewriteProfileLinks(await fetchProfileMarkdown(fileName));
          store.set({ id, data: {}, body, rendered: await renderMarkdown(body) });
        }),
      );
    },
  },
  schema: z.object({}),
});

export const collections = { profile };
