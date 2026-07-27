// The committed release snapshot.
//
// The changelog renders the live GitHub Releases history. When GitHub is
// unreachable at build time the page falls back to this rather than rendering
// nothing: an empty changelog reads as "this project has never shipped", which
// is a worse lie than a build-time-old copy of the truth.
//
// Every field here is copied from the real release on GitHub — tag, date,
// prerelease flag and notes. Nothing in this file is written by hand, because a
// fallback that invents plausible release notes is exactly the failure this
// site exists to avoid. When a new release ships, replace this with that one.

import type { Release } from "../lib/types";

export const seedReleases: Release[] = [
  {
    repo: "lemonfiber",
    tag: "v0.1.0",
    name: "v0.1.0",
    url: "https://github.com/lemonfiber/lemonfiber/releases/tag/v0.1.0",
    publishedAt: "2026-07-26T02:46:15Z",
    prerelease: true,
    body: [
      "### Features",
      "- Discord notifications + maintainer triage & labels",
      "- Schema-compat gate, 100% coverage gate, CI hardening",
      "- Lay out the modules, the seam, and the way in",
      "- Embed the stack, and refuse to build against one this cannot read (#13)",
      "- Resolve forms to profiles, and build the compose command (#14)",
      "- Read and write the environment file without disturbing it (#16)",
      "- Start and stop a form, and say what would happen first (#17)",
      "- Check a manifest against the contract, all faults at once (#18)",
      "- Read and change settings, and let providers be configured (#19)",
      "- Reach the container engine, health-gate starting, and answer what is running (#21)",
      "- Prove the VPN isn't leaking (doctor + C2 egress check) (#22)",
      "- Prove the machine can run the stack, and cost what it needs (#26)",
      "### Fixes",
      "- Narrow by the protocol a profile declares, not by its name (#15)",
    ].join("\n"),
    assets: [],
  },
];
