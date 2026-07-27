// Small presentational helpers. Pure, build-time only.

import type { Locale } from "../i18n";

export function relativeTime(iso?: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const day = 86_400_000;
  const days = Math.round(diff / day);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

export function compact(n: number): string {
  if (n < 1000) return String(n);
  return (n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, "") + "k";
}

const STATUS_GLYPH: Record<string, string> = {
  done: "●",
  partial: "◐",
  todo: "○",
};
export function statusGlyph(s: string): string {
  return STATUS_GLYPH[s] ?? "○";
}

// Kept as the English table so `statusLabel(s)` with no locale returns exactly
// what it always has. The Dutch column is additive.
const STATUS_LABEL: Record<string, string> = {
  done: "Done",
  partial: "In progress",
  todo: "Planned",
};

const STATUS_LABEL_NL: Record<string, string> = {
  done: "Klaar",
  partial: "Onderweg",
  todo: "Gepland",
};

export function statusLabel(s: string, locale: Locale = "en"): string {
  const table = locale === "nl" ? STATUS_LABEL_NL : STATUS_LABEL;
  return table[s] ?? table.todo;
}

// Dates on this site are release dates, so day precision is enough, and the
// month is spelled out to sidestep the DD/MM vs MM/DD ambiguity between
// locales. Formatted in UTC so the rendered date cannot shift depending on
// which timezone the build machine happened to run in.
export function releaseDate(iso: string, locale: Locale = "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

// Byte size for release assets, in the units a download page actually wants.
export function fileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const mb = bytes / 1_048_576;
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  if (mb >= 10) return `${Math.round(mb)} MB`;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
