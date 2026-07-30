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
// The spec's generated board (index.json) records, per feature, which versions
// ship it and each version's status. Inverting that gives the semver train —
// every version with the features it delivers — sourced from the spec itself.

interface BoardFeature {
  id: string;
  title: string;
  area: string;
  tracks: string;
  path: string;
  versions?: { version: string; status: string }[];
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
  features: TrainFeature[];
}

function cmpSemver(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

export async function specVersionTrain(): Promise<TrainVersion[]> {
  const idx = await getJSON<{ features: BoardFeature[] }>(
    `${SPEC_RAW}/10-functional/features/index.json`,
  );
  if (!idx?.features) return [];
  const byVersion = new Map<string, TrainVersion>();
  for (const f of idx.features) {
    for (const v of f.versions ?? []) {
      if (!byVersion.has(v.version)) {
        byVersion.set(v.version, {
          version: v.version,
          epoch: f.tracks,
          status: v.status,
          features: [],
        });
      }
      byVersion.get(v.version)!.features.push({
        id: f.id,
        title: f.title,
        area: f.area,
        slug: `10-functional/features/${f.path.replace(/\.md$/, "")}`,
      });
    }
  }
  return [...byVersion.values()].sort((a, b) => cmpSemver(a.version, b.version));
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
  // Give h2/h3 stable ids and collect a table of contents.
  const toc: TocEntry[] = [];
  const seen = new Set<string>();
  const html = linked.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_m, lvl, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      let id = slugify(text) || "section";
      while (seen.has(id)) id += "-";
      seen.add(id);
      toc.push({ level: Number(lvl), text, id });
      return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
    },
  );
  return { title, html, source: `${SPEC_BLOB}/${path}`, path, toc };
}
