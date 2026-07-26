// Shapes for everything the site derives from the GitHub org — "the motor".
// Kept deliberately small: only the fields a page actually renders.

export type DeliverableStatus = "done" | "partial" | "todo";

export interface Deliverable {
  title: string;
  status: DeliverableStatus;
  spec?: string;
  note?: string;
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

export interface Release {
  repo: string;
  tag: string;
  name: string;
  url: string;
  publishedAt: string;
}

export interface SiteData {
  generatedAt: string;
  live: boolean; // true when GitHub was reachable at build time
  stars: number; // org total
  repos: Repo[];
  milestones: Milestone[];
  goodFirstIssues: Issue[];
  releases: Release[];
  progress: {
    doneMilestones: number;
    totalMilestones: number;
    doneDeliverables: number;
    totalDeliverables: number;
    pct: number;
  };
}
