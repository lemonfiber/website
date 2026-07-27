// Which routes exist in every locale.
//
// Plain data with no dependencies, so both the site (via i18n/index.ts) and
// astro.config.mjs can import it. Keeping it in one place is the point: the
// sitemap's language alternates and the pages' hreflang tags must agree, and
// they can only be guaranteed to if they read the same list.
export const TRANSLATED_ROUTES: string[] = ["/", "/install", "/changelog", "/faq", "/colophon"];
