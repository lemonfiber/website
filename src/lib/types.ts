// Shapes for everything the site derives from the GitHub org — "the motor".
// Kept deliberately small: only the fields a page actually renders.

export type DeliverableStatus = "done" | "partial" | "todo";

export interface Deliverable {
  title: string;
  status: DeliverableStatus;
  spec?: string;
  note?: string;
  // True for a section heading that groups the rows beneath it rather than
  // being a work item in its own right. Excluded from every count — including
  // headings in the total would quietly inflate progress.
  group?: boolean;
}

export interface Milestone {
  id: string; // "M2"
  title: string; // "Core: manifest, compose driver, CLI"
  status: DeliverableStatus; // rolled up
  blurb: string; // one-line narrative from the roadmap
  repo?: string; // which repo carries it
  deliverables: Deliverable[];
  done: number;
  total: number;
  pct: number; // 0..100
}

export interface Repo {
  name: string;
  description: string;
  language: string;
  url: string;
  homepage?: string;
  stars: number;
  openIssues: number;
  latestRelease?: string; // tag name, e.g. "v0.1.0"
  pushedAt?: string; // ISO
  role: string; // human label: "canonical", "binary", "stack"…
  primary?: boolean;
}

export interface Issue {
  title: string;
  url: string;
  repo: string;
  number: number;
  labels: string[];
  createdAt: string;
}

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
  // Which platform the filename implies. Derived, not declared — the release
  // workflow names the assets, and this site should follow whatever it
  // actually produced rather than carry its own list that can fall out of date.
  platform?: "macos" | "linux" | "windows" | "checksums";
}

export interface Release {
  repo: string;
  tag: string;
  name: string;
  url: string;
  publishedAt: string;
  // Pre-1.0, every release is a prerelease. Hiding them would leave the
  // changelog empty while real releases exist, so they are shown and marked.
  prerelease?: boolean;
  // Both optional so a seed entry that carries neither stays valid.
  body?: string;
  assets?: ReleaseAsset[];
}

export interface SiteData {
  generatedAt: string;
  live: boolean; // true when GitHub was reachable at build time
  stars: number; // org total
  repos: Repo[];
  milestones: Milestone[];
  goodFirstIssues: Issue[];
  releases: Release[];
  // Newest published release across the org, for the install page's headline
  // version. Optional because a fresh org genuinely has none.
  latestRelease?: Release;
  progress: {
    doneMilestones: number;
    totalMilestones: number;
    doneDeliverables: number;
    totalDeliverables: number;
    pct: number;
    // Implementation progress split by epoch — v1 (the product, M0–M6) and v2
    // (the ecosystem, M7 onward), keyed by epoch id — so the roadmap can show a
    // bar per major version rather than one blended figure.
    byEpoch: Record<string, { pct: number; done: number; total: number }>;
  };
}
