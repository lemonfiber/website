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
  Repo,
  SiteData,
} from "./types";
import { seedMilestonesRaw, seedRepos } from "../data/seed";

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

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: headers(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
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
  const total = deliverables.length || 1;
  const doneUnits = deliverables.reduce(
    (n, d) => n + (d.status === "done" ? 1 : d.status === "partial" ? 0.5 : 0),
    0,
  );
  const done = deliverables.filter((d) => d.status === "done").length;
  const pct = Math.round((doneUnits / total) * 100);
  const status: DeliverableStatus =
    pct >= 100 ? "done" : doneUnits === 0 ? "todo" : "partial";
  return { done, total: deliverables.length, pct, status };
}

// ── Markdown parsing ──────────────────────────────────────────────

function cleanCell(s: string): string {
  return s
    .replace(/`([^`]*)`/g, "$1") // strip inline code
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // link → text
    .replace(/\*\*/g, "")
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
    const rows = section.split("\n").filter((l) => l.trim().startsWith("|"));
    const deliverables: Deliverable[] = [];
    for (const row of rows) {
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
    if (deliverables.length) out.set(id, deliverables);
  }
  return out;
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
  const repos = await Promise.all(
    seedRepos.map(async (seed) => {
      const live = byName.get(seed.name);
      if (!live) return seed;
      const rel = await getJSON<{ tag_name: string }>(
        `${API}/repos/${ORG}/${seed.name}/releases/latest`,
      );
      return {
        ...seed,
        description: live.description || seed.description,
        language: live.language || seed.language,
        url: live.html_url,
        homepage: live.homepage || undefined,
        stars: live.stargazers_count,
        openIssues: live.open_issues_count,
        pushedAt: live.pushed_at,
        latestRelease: rel?.tag_name || seed.latestRelease,
      } satisfies Repo;
    }),
  );
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

async function fetchReleases(repos: Repo[]): Promise<Release[]> {
  const out: Release[] = [];
  for (const repo of repos.filter((r) => r.latestRelease)) {
    const rel = await getJSON<{
      tag_name: string;
      name: string | null;
      html_url: string;
      published_at: string;
    }>(`${API}/repos/${ORG}/${repo.name}/releases/latest`);
    if (rel?.published_at) {
      out.push({
        repo: repo.name,
        tag: rel.tag_name,
        name: rel.name || rel.tag_name,
        url: rel.html_url,
        publishedAt: rel.published_at,
      });
    }
  }
  return out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
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
  const repos = repoResult?.repos ?? seedRepos;
  const stars = repoResult?.stars ?? 0;

  const milestones = buildMilestones(statusMd);

  // Only hit the search + releases APIs when the org was reachable at all.
  const [goodFirstIssues, releases] = live
    ? await Promise.all([fetchGoodFirstIssues(), fetchReleases(repos)])
    : [[], []];

  const totalDeliverables = milestones.reduce((n, m) => n + m.total, 0);
  const doneDeliverables = milestones.reduce((n, m) => n + m.done, 0);
  const doneUnits = milestones.reduce(
    (n, m) => n + m.deliverables.reduce((k, d) => k + (d.status === "done" ? 1 : d.status === "partial" ? 0.5 : 0), 0),
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
