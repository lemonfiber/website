import type { Repo } from "../lib/types";

// Fallback snapshot for the org's repositories. Used only when GitHub is
// unreachable at build time so a build (and local dev without a token) never
// fails. When GitHub is reachable, live metrics override all of this.
//
// The milestone snapshot moved to seed-milestones.ts and the release snapshot
// to seed-releases.ts. Both are re-exported here so existing imports of
// `seedMilestonesRaw` from this module keep resolving.

export { seedMilestonesRaw, type RawMilestone } from "./seed-milestones";
export { seedReleases } from "./seed-releases";

export const seedRepos: Repo[] = [
  {
    name: "spec",
    role: "canonical",
    primary: true,
    description: "The canonical specification — 795 requirements and the why behind every one.",
    language: "Markdown",
    url: "https://github.com/lemonfiber/spec",
    stars: 0,
    openIssues: 0,
  },
  {
    name: "lemonfiber",
    role: "the binary",
    primary: true,
    description: "The Lemonfiber binary: sets up your media stack, runs it in slices, proves it works. Rust.",
    language: "Rust",
    url: "https://github.com/lemonfiber/lemonfiber",
    stars: 0,
    openIssues: 0,
    latestRelease: "v0.1.0",
  },
  {
    name: "media-stack",
    role: "the stack",
    primary: true,
    description: "The Docker Compose stack it orchestrates — 19 services + the stack.toml manifest.",
    language: "Shell",
    url: "https://github.com/lemonfiber/media-stack",
    stars: 0,
    openIssues: 0,
  },
  {
    name: "brand",
    role: "identity",
    description: "Logo, colour and type — design tokens with contrast CI.",
    language: "CSS",
    url: "https://github.com/lemonfiber/brand",
    stars: 0,
    openIssues: 0,
  },
  {
    name: "homebrew-tap",
    role: "generated",
    description: "brew install lemonfiber — a formula written by release CI, not by hand.",
    language: "Ruby",
    url: "https://github.com/lemonfiber/homebrew-tap",
    stars: 0,
    openIssues: 0,
  },
  {
    name: "website",
    role: "this site",
    description: "This frontpage — a build-in-the-open site driven by the org.",
    language: "Astro",
    url: "https://github.com/lemonfiber/website",
    stars: 0,
    openIssues: 0,
  },
];
