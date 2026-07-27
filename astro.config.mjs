// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

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
      // NOTE: the `i18n` option is deliberately not set yet. It emits an
      // xhtml:link alternate for every configured locale on every page, which
      // is correct only when the locale trees are at parity. They are not —
      // /nl currently covers install, changelog, faq and colophon, and the
      // four hand-built pages are English-only. Turning it on now would
      // advertise Dutch URLs that 404. Enable it, with
      // `{ defaultLocale: "en", locales: { en: "en-GB", nl: "nl-NL" } }`,
      // once every page has a Dutch twin.
    }),
  ],
});
