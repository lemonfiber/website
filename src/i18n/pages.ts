// Lookup for the content pages, keyed by locale then page slug. Both locales
// define the same slugs; a page present in one and missing in the other is a
// runtime 404 in that language, so keep them in step.

import { pagesEn } from "./pages-en";
import { pagesNl } from "./pages-nl";
import type { Doc } from "../lib/doc";
import type { Locale } from "./index";

const PAGES: Record<Locale, Record<string, Doc>> = { en: pagesEn, nl: pagesNl };

export function docFor(locale: Locale, slug: string): Doc | undefined {
  return PAGES[locale][slug];
}
