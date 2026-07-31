// The spec, rendered on-site. The website is a read-only front-end over the
// specification: the file tree and every document are fetched from GitHub at
// build time and rendered here, with a "view source" link back to the repo and
// internal links rewritten to on-site routes. Same rule as github.ts — a failed
// fetch falls back to empty, never a broken build.

import { marked } from "marked";
import { getJSON, getText } from "./github";

const ORG = "lemonfiber";
const API = "https://api.github.com";
const RAW = "https://raw.githubusercontent.com";
const SPEC_RAW = `${RAW}/${ORG}/spec/main`;
const SPEC_BLOB = `https://github.com/${ORG}/spec/blob/main`;

// The numbered sections are the spec proper; everything else in the repo
// (scripts, CI, config) is not documentation and is left out of the portal.
const SECTIONS: Record<string, string> = {
  "00-overview": "Overview",
  "10-functional": "Functional — features & journeys",
  "20-architecture": "Architecture",
  "30-repos": "Repositories",
  "40-quality": "Quality",
  "50-governance": "Governance",
  "60-brand": "Brand",
  "70-operations": "Operations",
  "90-appendix": "Appendix",
};

export interface SpecDocMeta {
  path: string;
  slug: string;
  section: string;
  label: string;
}

export interface SpecGroup {
  key: string;
  section: string;
  docs: SpecDocMeta[];
}

interface TreeItem {
  path: string;
  type: string;
}

function labelFor(path: string): string {
  const base = path.split("/").pop()!.replace(/\.md$/, "");
  if (base.toLowerCase() === "readme") {
    const parent = path.split("/").slice(-2, -1)[0] || "";
    return SECTIONS[parent] ? "Overview" : titleCase(parent);
  }
  return titleCase(base);
}

function titleCase(s: string): string {
  return s
    .replace(/^\d+[-.]?/, "")
    .split("-")
    .filter(Boolean)
    .map((w) => (/^[a-k]\d+$/i.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

let inventoryCache: SpecDocMeta[] | null = null;

export async function specInventory(): Promise<SpecDocMeta[]> {
  if (inventoryCache) return inventoryCache;
  const tree = await getJSON<{ tree: TreeItem[] }>(
    `${API}/repos/${ORG}/spec/git/trees/main?recursive=1`,
  );
  inventoryCache = (tree?.tree ?? [])
    .filter((t) => t.type === "blob" && t.path.endsWith(".md"))
    .filter((t) => SECTIONS[t.path.split("/")[0]])
    .map((t) => ({
      path: t.path,
      slug: t.path.replace(/\.md$/, ""),
      section: SECTIONS[t.path.split("/")[0]],
      label: labelFor(t.path),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
  return inventoryCache;
}

export async function specGroups(): Promise<SpecGroup[]> {
  const docs = await specInventory();
  const order = Object.keys(SECTIONS);
  const byKey = new Map<string, SpecGroup>();
  for (const d of docs) {
    const key = d.path.split("/")[0];
    if (!byKey.has(key)) byKey.set(key, { key, section: d.section, docs: [] });
    byKey.get(key)!.docs.push(d);
  }
  return order.filter((k) => byKey.has(k)).map((k) => byKey.get(k)!);
}

// Resolve a relative link inside a doc to an on-site /spec route (for .md) or the
// raw file on GitHub (for images and other assets). Fragments are preserved.
function resolveLink(docPath: string, href: string): string {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [rel, frag] = href.split("#");
  if (!rel) return href;
  const stack = docPath.split("/").slice(0, -1);
  for (const part of rel.split("/")) {
    if (part === "..") stack.pop();
    else if (part && part !== ".") stack.push(part);
  }
  const target = stack.join("/");
  if (target.endsWith(".md")) {
    return `/spec/${target.replace(/\.md$/, "")}${frag ? "#" + frag : ""}`;
  }
  return `${SPEC_RAW}/${target}`;
}

// ── Version train (from the board) ────────────────────────────────
//
// The spec's generated board (index.json) carries a `versions` array — every
// release the manifests declare, ordered by semver — and, per feature, which
// versions ship it. The train is that version list, each carrying the features
// it delivers. The list is authoritative rather than inverted from feature
// membership, so the epoch-closing majors (1.0.0, 2.0.0) — which own no
// per-feature goals — are present rather than dropped for having nothing to
// point at them. A major stands for its whole epoch, so it carries every feature
// that epoch ships; an ordinary version carries only what it itself delivers.

interface BoardFeature {
  id: string;
  title: string;
  area: string;
  tracks: string;
  path: string;
  versions?: { version: string; status: string }[];
}

interface BoardVersion {
  version: string;
  epoch: string;
  status: string;
  closes_epoch: string | null;
  goals: number;
}

export interface TrainFeature {
  id: string;
  title: string;
  area: string;
  slug: string;
}

export interface TrainVersion {
  version: string;
  epoch: string;
  status: string;
  // The epoch this version closes, if it is a major — its features are then the
  // epoch's whole set rather than its own goal membership.
  closesEpoch: string | null;
  features: TrainFeature[];
}

export async function specVersionTrain(): Promise<TrainVersion[]> {
  const idx = await getJSON<{
    versions?: BoardVersion[];
    features?: BoardFeature[];
  }>(`${SPEC_RAW}/10-functional/features/index.json`);
  if (!idx?.versions || !idx?.features) return [];

  const toFeature = (f: BoardFeature): TrainFeature => ({
    id: f.id,
    title: f.title,
    area: f.area,
    slug: `10-functional/features/${f.path.replace(/\.md$/, "")}`,
  });

  // Features by the version that ships them, and by the epoch they belong to —
  // the latter for the majors, which own no per-feature goals of their own.
  const byVersion = new Map<string, TrainFeature[]>();
  const byEpoch = new Map<string, TrainFeature[]>();
  for (const f of idx.features) {
    for (const v of f.versions ?? []) {
      (byVersion.get(v.version) ?? byVersion.set(v.version, []).get(v.version)!).push(
        toFeature(f),
      );
    }
    (byEpoch.get(f.tracks) ?? byEpoch.set(f.tracks, []).get(f.tracks)!).push(toFeature(f));
  }

  return idx.versions.map((v) => ({
    version: v.version,
    epoch: v.epoch,
    status: v.status,
    closesEpoch: v.closes_epoch ?? null,
    features: v.closes_epoch
      ? (byEpoch.get(v.closes_epoch) ?? [])
      : (byVersion.get(v.version) ?? []),
  }));
}

export interface TocEntry {
  level: number;
  text: string;
  id: string;
}

export interface RenderedDoc {
  title: string;
  html: string;
  source: string;
  path: string;
  toc: TocEntry[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function renderSpecDoc(path: string): Promise<RenderedDoc | null> {
  const md = await getText(`${SPEC_RAW}/${path}`);
  if (md === null) return null;
  // Strip any YAML frontmatter — it is metadata, not prose.
  const raw = md.startsWith("---\n") ? md.slice(md.indexOf("\n---\n", 4) + 5) : md;
  const trimmed = raw.replace(/^\s+/, "");
  const title = (trimmed.match(/^#\s+(.+)$/m)?.[1] ?? path).replace(/[*`]/g, "").trim();
  // Drop the leading H1 — it is shown as the page header already.
  const body = trimmed.replace(/^#\s+.+\r?\n+/, "");
  const rendered = await marked.parse(body, { async: true });
  const linked = rendered.replace(
    /href="([^"]+)"/g,
    (_m, h) => `href="${resolveLink(path, h)}"`,
  );
  // Build the table of contents from the markdown headings (not the rendered
  // HTML), so no fragile HTML tag-stripping is needed, then give the rendered
  // h2/h3 the same ids in order. Code fences are removed first so a `##` inside
  // a code block is not mistaken for a heading.
  const noFences = body.replace(/```[\s\S]*?```/g, "");
  const toc: TocEntry[] = [];
  const seen = new Set<string>();
  for (const m of noFences.matchAll(/^(#{2,3})\s+(.+?)\s*$/gm)) {
    const text = m[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*`_]/g, "")
      .trim();
    let id = slugify(text) || "section";
    while (seen.has(id)) id += "-";
    seen.add(id);
    toc.push({ level: m[1].length, text, id });
  }
  let hi = 0;
  const html = linked.replace(/<h([23])>/g, (_m, lvl) => {
    const entry = toc[hi++];
    return entry ? `<h${lvl} id="${entry.id}">` : `<h${lvl}>`;
  });
  return { title, html, source: `${SPEC_BLOB}/${path}`, path, toc };
}
