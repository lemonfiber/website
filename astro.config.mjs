// @ts-check
import { defineConfig } from "astro/config";

// The public URL the site is served from.
//
// For GitHub Pages on a custom domain (e.g. lemonfiber.io) leave `base` at "/".
// For a project page (lemonfiber.github.io/website) set `base: "/website"`.
// Deployment is not wired up yet — this is the local/dev-correct default.
export default defineConfig({
  site: "https://lemonfiber.io",
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
