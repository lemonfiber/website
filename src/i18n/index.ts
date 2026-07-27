// Two locales, both fully static. `en` is served from the site root and `nl`
// from /nl — no runtime negotiation, because the site is prerendered and
// deployed to a plain static host with no request-time layer to vary on.
// Language detection is therefore a small client-side redirect (see
// LanguageRedirect.astro), which only ever fires once per visitor and never
// overrides an explicit choice.
//
// Adopted from the beatrax site, which is the same Astro skeleton. The storage
// key is `lf-locale` to match this site's existing `lf-theme`.

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

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
};
