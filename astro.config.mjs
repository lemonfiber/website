// @ts-check
import { defineConfig } from "astro/config";

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
});
