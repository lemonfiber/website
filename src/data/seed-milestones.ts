// The committed milestone snapshot, split out of seed.ts so the roadmap
// fallback and the repo fallback can be edited without touching each other.
//
// Used only when GitHub is unreachable at build time, so a build (and local
// dev without a token) never fails. When the status file is reachable, its
// live deliverables override the ones here per milestone. Sourced from
// spec/00-overview/roadmap.md and lemonfiber/IMPLEMENTATION-STATUS.md.

import type { Milestone } from "../lib/types";

export type RawMilestone = Omit<Milestone, "done" | "total" | "pct">;

export const seedMilestonesRaw: RawMilestone[] = [
  {
    id: "M0",
    title: "Specification",
    status: "done",
    repo: "spec",
    blurb: "Decisions recorded, contracts defined, standards set. Everything starts here.",
    deliverables: [
      { title: "Architecture & decisions (ADRs)", status: "done" },
      { title: "Contracts: stack.toml schema, versioning", status: "done" },
      { title: "Quality & governance standards", status: "done" },
    ],
  },
  {
    id: "M0.5",
    title: "Governance in force",
    status: "done",
    repo: "spec",
    blurb: "The rules that bind every repo, standing up before the first line of code.",
    deliverables: [
      { title: "50-governance accepted", status: "done" },
      { title: "spec-check workflow (citation gating)", status: "done" },
      { title: "Repo templates + Spec: trailer", status: "done" },
      { title: "OVERRIDES.md (append-only)", status: "done" },
      { title: "Spec-side CI (dup-ID, link resolution)", status: "done" },
      { title: "Branch protection on all repos", status: "done" },
    ],
  },
  {
    id: "M1",
    title: "media-stack works standalone",
    status: "done",
    repo: "media-stack",
    blurb: "The 19-service Compose stack, usable with bare docker compose — no Rust involved.",
    deliverables: [
      { title: "compose.yml + per-profile fragments", status: "done" },
      { title: "stack.toml manifest", status: "done" },
      { title: ".env.example, every var documented", status: "done" },
      { title: "Storage overlay (NAS)", status: "done" },
      { title: "Service configs (recyclarr, homepage, caddy)", status: "done" },
      { title: "CI: parity + per-form config + lints", status: "done" },
      { title: "Standalone README", status: "done" },
    ],
  },
  {
    id: "M2",
    title: "Core: manifest, compose driver, CLI",
    status: "done",
    repo: "lemonfiber",
    blurb: "Headless core. Every capability reachable as a plain, scriptable subcommand.",
    deliverables: [
      { title: "Workspace + cargo-dist scaffold", status: "done" },
      { title: "stack.toml parser + compile-time schema check", status: "done" },
      { title: "Embedded assets (include_dir! + --stack-dir)", status: "done" },
      { title: "Platform detection (macOS/Linux/WSL2)", status: "done" },
      { title: "Compose command builder (pure, golden-tested)", status: "done" },
      { title: "Form closure + composition", status: "done", spec: "B1-R4" },
      { title: "up / down / restart / ps / logs / pull", status: "done" },
      { title: ".env read/write (comment-preserving)", status: "done" },
      { title: "config get/set/show (secret redaction)", status: "done" },
    ],
  },
  {
    id: "M3",
    title: "Setup wizard + doctor",
    status: "partial",
    repo: "lemonfiber",
    blurb: "The product thesis: guided setup and diagnostics that prove things work.",
    deliverables: [
      { title: "doctor — Check trait, remedy per finding", status: "done", spec: "C1-R1" },
      { title: "VPN leak test (compare public IPs)", status: "done", spec: "C2" },
      { title: "Preflight / environment check", status: "done", spec: "A2-R9" },
      { title: "Prerequisites / account guidance", status: "partial", spec: "A1-R1" },
      { title: "Empirical hardlink test", status: "todo", spec: "C5-R1" },
      { title: "Storage-mode detection", status: "todo", spec: "C5-R2" },
      { title: "Credential validation against live services", status: "todo", spec: "A3-R1" },
      { title: "VPN port-forward + ProtonVPN NAT-PMP guidance", status: "todo", spec: "A3-R8" },
      { title: "Wizard state machine (resumable)", status: "todo", spec: "A2-R1" },
      { title: "Jellyfin native-mode + PUID/PGID offers", status: "todo", spec: "A2-R6" },
    ],
  },
  {
    id: "M4",
    title: "Seed",
    status: "todo",
    repo: "lemonfiber",
    blurb: "Wire services to each other and record it, turning config from precious into reproducible.",
    deliverables: [
      { title: "service::Client port (Servarr shape)", status: "done", spec: "D1" },
      { title: "Servarr-shape adapter", status: "todo", spec: "D1" },
      { title: "Seed orchestration (idempotent)", status: "todo", spec: "D1" },
      { title: "Change journal (read-back + undo)", status: "todo" },
      { title: "Cross-service wiring (Prowlarr, Jellyfin→Seerr…)", status: "todo", spec: "D1-R7" },
    ],
  },
  {
    id: "M5",
    title: "TUI",
    status: "todo",
    repo: "lemonfiber",
    blurb: "A second surface over the same core — a terminal dashboard (ratatui).",
    deliverables: [{ title: "ratatui surface over core", status: "todo" }],
  },
  {
    id: "M6",
    title: "Release engineering",
    status: "partial",
    repo: "homebrew-tap",
    blurb: "Signed, multi-platform releases and a generated Homebrew formula.",
    deliverables: [
      { title: "cargo-dist scaffold", status: "done" },
      { title: "CI hardening (OpenSSF, CodeQL, Scorecard)", status: "done" },
      { title: "Signed multi-platform release automation", status: "todo" },
      { title: "Generated Homebrew formula", status: "todo" },
    ],
  },
];
