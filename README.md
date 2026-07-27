<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/logo-on-ink.svg">
    <img alt="lemonfiber" src=".github/logo.svg" height="72">
  </picture>
</p>

<h1 align="center">website</h1>

<p align="center">
  The lemonfiber frontpage — a <b>build-in-the-open</b> site whose roadmap,
  progress and repo state are read from the org, not written by hand.<br>
  Astro, static, self-hosted assets. Zero maintenance for maintainers.
</p>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-building-F0C419?labelColor=17160F">
  <img alt="Astro" src="https://img.shields.io/badge/built%20with-Astro-E07A17?labelColor=17160F">
  <img alt="Licence" src="https://img.shields.io/badge/licence-Hippocratic%203.0-17160F">
</p>

---

## The idea

Most project sites rot: the roadmap on the homepage drifts from the real one, the
"in progress" list is months stale, and keeping them honest is a chore nobody
signs up for. This site removes the chore. **The GitHub org is the motor.**

At build time it reads:

- **the org** — repositories, languages, releases, open issues, good-first-issues, stars
- **`spec/00-overview/roadmap.md`** — the sequenced milestones
- **`lemonfiber/IMPLEMENTATION-STATUS.md`** — per-deliverable status (✅ / ◐ / ☐)

…and renders them. When a maintainer pushes to any of those repos, CI rebuilds
and the site moves. Nobody edits a page to ship a milestone.

If the network is unreachable at build time, a committed snapshot
(`src/data/seed.ts`) keeps the build green — live data always overrides it.

## Pages

| Route | What it shows |
|-------|---------------|
| `/` | The pitch, a live status strip, the "runs in slices" switcher, the 19 services |
| `/roadmap` | Every milestone with progress, derived from the status file |
| `/transparency` | Every repo, release and open issue — read live from GitHub |
| `/contribute` | Ways to help + live good-first-issues |

## Develop

```console
$ npm ci          # or: just install
$ npm run dev     # local dev at http://localhost:4321
$ npm run build   # production build (fetches live org data)
$ just ci         # type-check + typos + build — what CI runs
```

Node ≥ 20. `GITHUB_TOKEN` is optional locally (raises the API rate limit).

## Layout

```
src/lib/github.ts     the motor — fetch + parse, with a resilient fallback
src/data/site.ts      editorial copy; the service / profile / form model
src/data/seed.ts      offline snapshot
src/components/        Nav · Footer · Console · FormsSwitcher · RepoCard · …
src/pages/             index · roadmap · transparency · contribute · 404
src/styles/tokens.css  design tokens mirrored from lemonfiber/brand
```

## Contributing

This project's spec is **canonical**: every change cites a spec identifier that
already exists. Before your first PR, read [AGENTS.md](AGENTS.md) and the
[contributing guide](https://github.com/lemonfiber/spec/blob/main/50-governance/contributing.md).

## Licence

[Hippocratic License 3.0](LICENSE) — ethical-source, source-available. See the
[rationale](https://github.com/lemonfiber/spec/blob/main/90-appendix/license-rationale.md).

---

<p align="center">
  <a href="https://nightworks.io">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/nightworks-white.png">
      <img alt="NightWorks.io" src=".github/nightworks-dark.png" height="20">
    </picture>
  </a>
  &nbsp;&middot;&nbsp;<a href="https://discord.gg/FYuV9CbTHR"><img alt="Discord" src=".github/discord.svg" height="20"></a>
</p>
