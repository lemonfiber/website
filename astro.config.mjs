// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { TRANSLATED_ROUTES } from "./src/i18n/routes";

// The public URL the site is served from.
//
// Custom domain (lemonfiber.app) → `base` stays "/". `.app` is HSTS-preloaded,
// so the host must serve HTTPS (GitHub Pages and Cloudflare Pages both do).
// For a project page (lemonfiber.github.io/website) set `base: "/website"`.
export default defineConfig({
  site: "https://lemonfiber.app",
  base: "/",
  trailingSlash: "ignore",
  build: {
    // Emit foo/index.html so routes work identically on a static host.
    format: "directory",
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sitemap({
      // The 404 is not a destination, so it does not belong in a sitemap.
      filter: (page) => !page.includes("/404"),
      //
      // The `i18n` option is not used: it advertises an alternate for every
      // configured locale on every page, which is only correct once the trees
      // are at parity. They are not — Dutch covers the routes below and the
      // rest are English-only, so alternates are emitted per page instead,
      // from the same list the pages' hreflang tags read.
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, "") || "/";
        const route = (path.replace(/^\/nl(?=\/|$)/, "") || "/");
        if (!TRANSLATED_ROUTES.includes(route)) return item;
        const abs = (/** @type {string} */ p) =>
          new URL(p === "/" ? "/" : `${p}/`, item.url).href;
        return {
          ...item,
          links: [
            { lang: "en-GB", url: abs(route) },
            { lang: "nl-NL", url: abs(route === "/" ? "/nl" : `/nl${route}`) },
          ],
        };
      },
    }),
  ],
});
