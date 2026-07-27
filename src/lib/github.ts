// The motor. Everything dynamic on the site is assembled here at BUILD TIME,
// from the GitHub org and two Markdown files the maintainers already keep
// current (spec/roadmap.md, lemonfiber/IMPLEMENTATION-STATUS.md). Nothing here
// runs in the browser — the output is baked into static HTML.
//
// Design rule: no single failure may break the build. Every fetch is wrapped,
// times out fast, and falls back to the committed seed. A maintainer never has
// to touch this site; when they push, CI rebuilds and the numbers move.

import type {
  Deliverable,
  DeliverableStatus,
  Issue,
  Milestone,
  Release,
  ReleaseAsset,
  Repo,
  SiteData,
} from "./types";
import { seedMilestonesRaw, seedRepos } from "../data/seed";
import { seedReleases } from "../data/seed-releases";

const ORG = "lemonfiber";
const API = "https://api.github.com";
const RAW = "https://raw.githubusercontent.com";
const TIMEOUT_MS = 8000;

// The two files the roadmap is derived from.
const STATUS_FILE = `${RAW}/${ORG}/lemonfiber/main/IMPLEMENTATION-STATUS.md`;

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "lemonfiber-website-build",
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

// ── Local response cache ──────────────────────────────────────────
//
// Unauthenticated GitHub allows 60 API calls an hour per IP, and one build
// spends eight. That is seven builds before the site silently falls back to the
// seed — which it does correctly, but a developer iterating on layout should
// not have to notice. Responses are cached on disk between builds so repeated
// local builds cost nothing.
//
// Deliberately off in CI: a deploy must reflect the org as it is right now, and
// a cache that can serve a stale roadmap to production defeats the point of
// generating the site from the org at all. Set LF_NO_CACHE=1 to skip it
// locally too.
const CACHE_DIR = ".astro/.fetch-cache";
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_ON = !process.env.CI && !process.env.LF_NO_CACHE;

async function cacheRead(key: string): Promise<string | null> {
  if (!CACHE_ON) return null;
  try {
    const { readFile } = await import("node:fs/promises");
    const raw = await readFile(`${CACHE_DIR}/${key}.json`, "utf8");
    const { at, body } = JSON.parse(raw) as { at: number; body: string | null };
    return Date.now() - at < CACHE_TTL_MS ? (body ?? "\u0000null") : null;
  } catch {
    return null;
  }
}

async function cacheWrite(key: string, body: string | null): Promise<void> {
  if (!CACHE_ON) return;
  try {
    const { mkdir, writeFile } = await import("node:fs/promises");
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(`${CACHE_DIR}/${key}.json`, JSON.stringify({ at: Date.now(), body }));
  } catch {
    // A cache that cannot be written is not an error worth failing a build for.
  }
}

// Stable, filesystem-safe key for a URL.
function cacheKey(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 180);
}

// Fetches text, via the cache when it is on. A cached *failure* is stored too —
// as a null body — so a rate-limited build does not retry eight dead calls on
// every subsequent build within the TTL.
async function fetchText(url: string, withHeaders: boolean): Promise<string | null> {
  const key = cacheKey(url);
  const hit = await cacheRead(key);
  if (hit !== null) return hit === "\u0000null" ? null : hit;

  let body: string | null = null;
  try {
    const res = await fetch(url, {
      ...(withHeaders ? { headers: headers() } : {}),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) body = await res.text();
  } catch {
    body = null;
  }
  await cacheWrite(key, body);
  return body;
}

async function getJSON<T>(url: string): Promise<T | null> {
  const body = await fetchText(url, true);
  if (body === null) return null;
  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

async function getText(url: string): Promise<string | null> {
  return fetchText(url, false);
}

const EMOJI: Record<string, DeliverableStatus> = {
  "✅": "done",
  "◐": "partial",
  "☐": "todo",
};

function rollup(deliverables: Deliverable[]): {
  done: number;
  total: number;
  pct: number;
  status: DeliverableStatus;
} {
  // Group headings are section titles, not work items, so they are excluded
  // from every count — including them would inflate progress.
  const items = deliverables.filter((d) => !d.group);
  const total = items.length || 1;
  const doneUnits = items.reduce(
    (n, d) => n + (d.status === "done" ? 1 : d.status === "partial" ? 0.5 : 0),
    0,
  );
  const done = items.filter((d) => d.status === "done").length;
  const pct = Math.round((doneUnits / total) * 100);
  const status: DeliverableStatus =
    pct >= 100 ? "done" : doneUnits === 0 ? "todo" : "partial";
  return { done, total: items.length, pct, status };
}

// ── Markdown parsing ──────────────────────────────────────────────

function cleanCell(s: string): string {
  return s
    .replace(/`([^`]*)`/g, "$1") // strip inline code
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // link → text
    .replace(/\*\*/g, "")
    // Markdown escapes are for the Markdown renderer, not for us. `\*arr`
    // means a literal asterisk; carrying the backslash through would print it.
    .replace(/\\([\\`*_{}[\]()#+\-.!|])/g, "$1")
    .replace(/\s+/g, " ") // collapse runs, so joined prose lines read cleanly
    .trim();
}

// Parse IMPLEMENTATION-STATUS.md into per-milestone deliverables. Column order
// varies between milestone tables, so we locate cells by shape, not position.
function parseStatus(md: string): Map<string, Deliverable[]> {
  const out = new Map<string, Deliverable[]>();
  const sections = md.split(/\n(?=##\s+M[0-9])/);
  for (const section of sections) {
    const head = section.match(/^##\s+(M[0-9.]+)/m);
    if (!head) continue;
    const id = head[1];
    const deliverables: Deliverable[] = [];
    for (const line of section.split("\n")) {
      const row = line.trim();

      // A `###` heading inside a milestone groups the rows beneath it. Kept as
      // a deliverable so the roadmap can render the structure the status file
      // actually has, but flagged so it never counts toward progress.
      if (row.startsWith("### ")) {
        const title = cleanCell(row.slice(4)).replace(/^\d+\s*—\s*/, "");
        if (title) deliverables.push({ title, status: "todo", group: true });
        continue;
      }

      if (!row.startsWith("|")) continue;
      const cells = row
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (cells.length < 2) continue;
      // skip header + separator rows
      if (/^-+$/.test(cells[0].replace(/[:\s]/g, "")) || cells[0] === "") continue;
      if (/^deliverable$/i.test(cells[0])) continue;

      let status: DeliverableStatus | null = null;
      let spec: string | undefined;
      const rest: string[] = [];
      for (const c of cells.slice(1)) {
        const emoji = Object.keys(EMOJI).find((e) => c.includes(e));
        if (emoji && !status) {
          status = EMOJI[emoji];
        } else if (!spec && /^[A-Z][A-Z0-9]*-[A-Za-z]*[0-9]/.test(cleanCell(c))) {
          spec = cleanCell(c).split(/[,·]/)[0].trim();
        } else {
          rest.push(cleanCell(c));
        }
      }
      if (!status) continue; // not a real deliverable row
      const note = rest.filter(Boolean).pop();
      deliverables.push({
        title: cleanCell(cells[0]),
        status,
        spec,
        note: note && note.length < 80 ? note : undefined,
      });
    }
    // Headings alone are not a milestone. Requiring at least one real row
    // stops a section that has been restructured but not yet filled in from
    // overriding the seed with nothing but its own sub-headings.
    if (deliverables.some((d) => !d.group)) out.set(id, deliverables);
  }
  return out;
}

// ── Spec-owned content ────────────────────────────────────────────
//
// The colophon and the FAQ are authored in the spec repo, not here, so the
// credits cannot drift from the dependency list the specification documents
// and the answers cannot drift from the product. Both render straight from
// Markdown at build time; when the spec is unreachable the pages fall back to
// a link rather than a stale local copy, because a credits list or an answer
// that silently goes out of date is worse than one that sends you to source.

const COLOPHON_FILE = `${RAW}/${ORG}/spec/main/90-appendix/colophon.md`;
const FAQ_FILE = `${RAW}/${ORG}/spec/main/90-appendix/faq.md`;

// Sections every spec doc ends with, which are structure rather than content.
const SKIP_SECTION = /^(requirements|related)$/i;

// A colophon section: one `##` heading and the table rows beneath it.
export interface ColophonGroup {
  heading: string;
  entries: { name: string; body: string }[];
}

// Only `##` sections carrying a table are taken, which drops the prose intro
// and the Related footer without needing to name them.
export function parseColophon(md: string): ColophonGroup[] {
  const out: ColophonGroup[] = [];
  let current: ColophonGroup | null = null;

  for (const raw of md.split("\n")) {
    const line = raw.trim();

    if (line.startsWith("## ")) {
      if (current && current.entries.length) out.push(current);
      const heading = cleanCell(line.slice(3));
      // The spec's house style ends every doc with a Requirements table and a
      // Related list. The former is a table, so without this it would be read
      // as a group of credits named after requirement IDs.
      current = SKIP_SECTION.test(heading) ? null : { heading, entries: [] };
      continue;
    }
    if (!current) continue;
    if (!line.startsWith("|") || (line.match(/\|/g) ?? []).length < 3) continue;

    const cells = line
      .slice(1, -1)
      .split("|")
      .map((c) => c.trim());
    if (cells.length < 2) continue;
    if (/^[-:\s]+$/.test(cells[0])) continue;
    if (/^(project|name|component)$/i.test(cells[0])) continue;

    const name = cleanCell(cells[0]);
    const body = cleanCell(cells[1]);
    if (name && body) current.entries.push({ name, body });
  }
  if (current && current.entries.length) out.push(current);
  return out;
}

export async function getColophon(): Promise<ColophonGroup[]> {
  const md = await getText(COLOPHON_FILE);
  return md ? parseColophon(md) : [];
}

export interface SpecFaqGroup {
  heading: string;
  items: { q: string; a: string }[];
}

// `## group` / `### question` / prose answer. Paragraphs are joined because a
// structured-data answer has to be a single string.
export function parseFaq(md: string): SpecFaqGroup[] {
  const groups: SpecFaqGroup[] = [];
  let group: SpecFaqGroup | null = null;
  let question: string | null = null;
  let answer: string[] = [];

  const flush = () => {
    if (group && question && answer.length) {
      group.items.push({ q: question, a: answer.join(" ").trim() });
    }
    question = null;
    answer = [];
  };

  for (const raw of md.split("\n")) {
    const line = raw.trim();

    if (line.startsWith("## ")) {
      flush();
      if (group && group.items.length) groups.push(group);
      const heading = cleanCell(line.slice(3));
      group = SKIP_SECTION.test(heading) ? null : { heading, items: [] };
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      question = cleanCell(line.slice(4));
      continue;
    }
    if (!group || !question) continue;
    if (!line || line.startsWith("#") || line.startsWith("-")) continue;
    answer.push(cleanCell(line));
  }
  flush();
  if (group && group.items.length) groups.push(group);
  return groups;
}

export async function getFaq(): Promise<SpecFaqGroup[]> {
  const md = await getText(FAQ_FILE);
  return md ? parseFaq(md) : [];
}

function buildMilestones(statusMd: string | null): Milestone[] {
  const parsed = statusMd ? parseStatus(statusMd) : new Map<string, Deliverable[]>();
  return seedMilestonesRaw.map((seed) => {
    // Prefer live deliverables when the status file actually lists them for
    // this milestone; otherwise the seed (M0/M0.5/M1 carry no live table).
    const live = parsed.get(seed.id);
    const deliverables = live && live.length ? live : seed.deliverables;
    const r = rollup(deliverables);
    return {
      ...seed,
      deliverables,
      done: r.done,
      total: r.total,
      pct: r.pct,
      status: r.status,
    };
  });
}

// ── GitHub API ────────────────────────────────────────────────────

interface ApiRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string;
  archived: boolean;
}

async function fetchRepos(): Promise<{ repos: Repo[]; stars: number } | null> {
  const api = await getJSON<ApiRepo[]>(
    `${API}/orgs/${ORG}/repos?per_page=100&type=public&sort=pushed`,
  );
  if (!api) return null;
  const byName = new Map(api.map((r) => [r.name, r]));
  const stars = api.reduce((n, r) => n + (r.stargazers_count || 0), 0);

  // Keep the seed's curated order + roles; overlay live metrics.
  //
  // `latestRelease` is deliberately NOT fetched here. It used to cost one
  // `releases/latest` request per repo on top of this one, and fetchReleases
  // already pulls the full release list — so the tag is back-filled from that
  // instead, halving the request count against an unauthenticated rate limit.
  const repos = seedRepos.map((seed) => {
    const live = byName.get(seed.name);
    if (!live) return seed;
    return {
      ...seed,
      description: live.description || seed.description,
      language: live.language || seed.language,
      url: live.html_url,
      homepage: live.homepage || undefined,
      stars: live.stargazers_count,
      openIssues: live.open_issues_count,
      pushedAt: live.pushed_at,
    } satisfies Repo;
  });
  return { repos, stars };
}

interface ApiIssue {
  title: string;
  html_url: string;
  number: number;
  created_at: string;
  repository_url: string;
  labels: { name: string }[];
  pull_request?: unknown;
}

async function fetchGoodFirstIssues(): Promise<Issue[]> {
  const q = encodeURIComponent(
    `org:${ORG} label:"good first issue" state:open is:issue`,
  );
  const data = await getJSON<{ items: ApiIssue[] }>(
    `${API}/search/issues?q=${q}&per_page=12&sort=created`,
  );
  if (!data?.items) return [];
  return data.items
    .filter((i) => !i.pull_request)
    .map((i) => ({
      title: i.title,
      url: i.html_url,
      number: i.number,
      repo: i.repository_url.split("/").pop() || "",
      labels: i.labels.map((l) => l.name),
      createdAt: i.created_at,
    }));
}

interface ApiAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface ApiRelease {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
  body: string | null;
  assets: ApiAsset[];
}

// Which platform an asset belongs to is inferred from its filename rather than
// listed here, so the site follows whatever the release workflow actually
// produced instead of carrying a parallel list that can drift. Checksums and
// signatures are matched first — `lemonfiber_1.0_linux_amd64.tar.gz.sig` is a
// signature, not a Linux build, and the order is what makes that come out right.
export function platformFor(name: string): ReleaseAsset["platform"] {
  const n = name.toLowerCase();
  if (/(sha256|checksum|\.sig$|\.asc$|\.pem$|\.sbom|\.intoto)/.test(n)) return "checksums";
  if (/(\.dmg$|\.pkg$|darwin|macos|apple)/.test(n)) return "macos";
  if (/(\.exe$|\.msi$|windows|win32|win64|\bwin\b)/.test(n)) return "windows";
  if (/(\.appimage$|\.deb$|\.rpm$|linux)/.test(n)) return "linux";
  return undefined;
}

function toRelease(repo: string, r: ApiRelease): Release {
  return {
    repo,
    tag: r.tag_name,
    name: r.name || r.tag_name,
    url: r.html_url,
    publishedAt: r.published_at as string,
    prerelease: r.prerelease,
    body: r.body ?? undefined,
    assets: (r.assets ?? []).map((a) => ({
      name: a.name,
      url: a.browser_download_url,
      size: a.size,
      platform: platformFor(a.name),
    })),
  };
}

// The full published history across the org, newest first — which is what the
// changelog renders.
//
// Drafts are dropped because they are not public. Prereleases are NOT: this
// project is pre-1.0, so every release it has ever made is one, and filtering
// them would leave the changelog empty while real releases exist — which reads
// as "never shipped" and is simply false. They are rendered and marked instead.
async function fetchReleases(repos: Repo[]): Promise<Release[]> {
  const perRepo = await Promise.all(
    repos.map(async (repo) => {
      const api = await getJSON<ApiRelease[]>(
        `${API}/repos/${ORG}/${repo.name}/releases?per_page=20`,
      );
      if (!api) return [];
      return api.filter((r) => !r.draft && r.published_at).map((r) => toRelease(repo.name, r));
    }),
  );
  return perRepo.flat().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

// ── Public entry point ────────────────────────────────────────────

let cached: SiteData | null = null;

export async function getSiteData(): Promise<SiteData> {
  if (cached) return cached;

  const [repoResult, statusMd] = await Promise.all([
    fetchRepos(),
    getText(STATUS_FILE),
  ]);

  const live = repoResult !== null;
  const baseRepos = repoResult?.repos ?? seedRepos;
  const stars = repoResult?.stars ?? 0;

  const milestones = buildMilestones(statusMd);

  // Only hit the search + releases APIs when the org was reachable at all.
  const [goodFirstIssues, liveReleases] = live
    ? await Promise.all([fetchGoodFirstIssues(), fetchReleases(baseRepos)])
    : [[] as Issue[], [] as Release[]];

  // Falls back rather than rendering an empty history: a changelog that shows
  // nothing reads as "this project has never shipped", which is worse than
  // showing a build-time-old copy of the truth.
  const releases = liveReleases.length ? liveReleases : seedReleases;

  // Back-fill each repo's newest tag from the release list, so the tag shown
  // on a repo card and the tag at the top of the changelog cannot disagree.
  const newestTag = new Map<string, string>();
  for (const r of releases) {
    if (!newestTag.has(r.repo)) newestTag.set(r.repo, r.tag);
  }
  const repos = baseRepos.map((r) => ({
    ...r,
    latestRelease: newestTag.get(r.name) ?? r.latestRelease,
  }));

  const totalDeliverables = milestones.reduce((n, m) => n + m.total, 0);
  const doneDeliverables = milestones.reduce((n, m) => n + m.done, 0);
  const doneUnits = milestones.reduce(
    (n, m) =>
      n +
      m.deliverables
        .filter((d) => !d.group)
        .reduce((k, d) => k + (d.status === "done" ? 1 : d.status === "partial" ? 0.5 : 0), 0),
    0,
  );

  cached = {
    generatedAt: new Date().toISOString(),
    live,
    stars,
    repos,
    milestones,
    goodFirstIssues,
    releases,
    latestRelease: releases[0],
    progress: {
      doneMilestones: milestones.filter((m) => m.status === "done").length,
      totalMilestones: milestones.length,
      doneDeliverables,
      totalDeliverables,
      pct: Math.round((doneUnits / (totalDeliverables || 1)) * 100),
    },
  };
  return cached;
}
