import { defineAppSetup } from "@slidev/types";

// Prefix a public-asset path with the deploy base so it resolves under a
// sub-route (e.g. /talks/2026/slug/). Use in slides: :src="$public('/foo.png')"
export default defineAppSetup(({ app }) => {
  app.config.globalProperties.$public = (p: string) =>
    import.meta.env.BASE_URL + String(p).replace(/^\//, "");
});
