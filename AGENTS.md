# AGENTS.md — website

Guidance for any AI agent working in this repo.

> **Common rules for every lemonfiber repo are canonical in the spec:**
> [50-governance/ai-contributors.md](https://github.com/lemonfiber/spec/blob/main/50-governance/ai-contributors.md).
> Read them. This file is the `website`-specific header only.

## What this repo is

The public frontpage at the root of the org — a static site built with
[Astro](https://astro.build). Its defining property: **the roadmap, progress and
repo state are not written here.** They are read from the org at build time — the
GitHub API plus two Markdown files the maintainers already keep current
([`spec/00-overview/roadmap.md`](https://github.com/lemonfiber/spec/blob/main/00-overview/roadmap.md)
and
[`lemonfiber/IMPLEMENTATION-STATUS.md`](https://github.com/lemonfiber/lemonfiber/blob/main/IMPLEMENTATION-STATUS.md)).
A maintainer never edits this site to update a milestone; they push to the repo
that owns the fact, and CI rebuilds. Spec:
[`30-repos/website.md`](https://github.com/lemonfiber/spec/blob/main/30-repos/website.md).

## Layout

```
src/
├── lib/github.ts     the motor — build-time fetch + Markdown parse, with fallback
├── lib/types.ts      shapes everything derives from
├── data/site.ts      editorial content; the service/profile/form model
├── data/seed.ts      offline fallback snapshot (never the source of truth when live)
├── components/       Nav, Footer, Console, FormsSwitcher, RepoCard, …
├── layouts/Base.astro
├── pages/            index · roadmap · transparency · contribute · 404
└── styles/tokens.css design tokens mirrored from lemonfiber/brand
public/brand/         logo + mark, copied from the brand repo
```

## The rules you cannot break

- **No hand-authored roadmap or status.** If a fact lives in a repo (a milestone,
  a deliverable, a release, an open issue), read it — never transcribe it here.
  New dynamic data means a new getter in `src/lib/github.ts`, not a new constant.
- **Every fetch falls back.** A failed or offline build must still produce a
  correct page from `src/data/seed.ts`. Never let a network call throw into a page.
- **Tokens come from `brand`.** Colours, type and spacing mirror
  `lemonfiber/brand`. Don't invent a colour here; add it there and mirror it.
- **Nothing renders in `lib`.** The motor returns data; components render it.
- **Self-hosted assets only.** No external fonts, scripts or trackers at runtime
  — privacy is a promise the site itself must keep.

## Checks

```
just check     # astro type-check across .astro / .ts
just build     # the real build — fetches live org data
just ci        # check + typos + build, what CI runs
```

`GITHUB_TOKEN` is optional locally (raises the API rate limit); CI passes the
job token automatically.

## Before you open a PR

- `just ci` is clean.
- Cite a spec identifier in a commit `Spec:` trailer and the PR body.
- No AI attribution in commits.
