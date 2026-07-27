// Two locales, both fully static. `en` is served from the site root and `nl`
// from /nl — no runtime negotiation, because the site is prerendered and
// deployed to a plain static host with no request-time layer to vary on.
// Language detection is therefore a small client-side redirect (see
// LanguageRedirect.astro), which only ever fires once per visitor and never
// overrides an explicit choice.
//
// Adopted from the beatrax site, which is the same Astro skeleton. The storage
// key is `lf-locale` to match this site's existing `lf-theme`.

import { TRANSLATED_ROUTES } from "./routes";
import { en } from "./en";
import { nl } from "./nl";

export const DEFAULT_LOCALE = "en" as const;
export const LOCALES = ["en", "nl"] as const;

// The localStorage key the language switcher and the detection redirect share.
// Kept here so the inline scripts and the components cannot disagree.
export const LOCALE_KEY = "lf-locale";

export type Locale = (typeof LOCALES)[number];
export type Copy = typeof en;

const DICTIONARIES: Record<Locale, Copy> = { en, nl };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function copyFor(locale: Locale): Copy {
  return DICTIONARIES[locale];
}

// Prefixes a path with the locale segment. `en` lives at the root, so it is
// returned untouched — keeping the canonical URLs short for the majority case.
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) {
    return clean;
  }
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

// Strips a known locale prefix, giving the route-relative path. Used by the
// language switcher to stay on the same page across a locale change.
export function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

// Which routes exist in every locale. The Dutch tree is grown page by page, so
// this is the one place that knows how far it has got — Nav, Footer and Base all
// read it rather than each page declaring its own state and drifting.
//
// A route missing here is English-only. Links to it stay on the English URL even
// from a Dutch page: sending a Dutch reader to a page that does not exist is
// worse than sending them to the English one, which at least answers them.
const TRANSLATED = new Set<string>(TRANSLATED_ROUTES);

export function isTranslated(route: string): boolean {
  return TRANSLATED.has(route);
}

// The URL for `route` in `locale`, falling back to English where that locale has
// no copy of the page.
export function pathFor(locale: Locale, route: string): string {
  return isTranslated(route) ? localePath(locale, route) : route;
}

// The locales `route` is genuinely published in — what the language switcher
// offers and what hreflang advertises.
export function localesFor(route: string): Locale[] {
  return isTranslated(route) ? [...LOCALES] : [DEFAULT_LOCALE];
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
};

// The front page's copy lives apart from the chrome: it is more prose than
// everything else combined, and mixing them made both harder to scan.
import { homeEn } from "./home-en";
import { homeNl } from "./home-nl";

export type HomeCopy = typeof homeEn;

const HOME: Record<Locale, HomeCopy> = { en: homeEn, nl: homeNl };

export function homeCopy(locale: Locale): HomeCopy {
  return HOME[locale];
}
