// English copy. Every user-facing string that lives in shared chrome (nav,
// footer, status furniture) belongs here or in nl.ts — no prose in those
// templates, so the two locales cannot drift apart structurally.
//
// Page prose is not here yet. The content pages still carry their own copy
// inline; they move into i18n/pages-en.ts as each one is converted to the
// DocPage renderer. Until then this file covers the chrome only, and adding a
// key here means adding the same key to nl.ts.

export const en = {
  meta: {
    lang: "en",
    tagline: "Self-host your media — without becoming a sysadmin",
    description:
      "A fully open-source, self-hosted media automation stack that sets itself up, runs in the exact slice you need, and proves it's working instead of hoping.",
  },

  nav: {
    home: "Home",
    roadmap: "Roadmap",
    transparency: "Transparency",
    contribute: "Contribute",
    install: "Install",
    changelog: "Changelog",
    faq: "FAQ",
    colophon: "Colophon",
    skip: "Skip to content",
    theme: "Switch colour theme",
    language: "Language",
    menu: "Menu",
    github: "Lemonfiber on GitHub",
    discord: "Discord",
  },

  cta: {
    install: "Install Lemonfiber",
    repo: "Source on GitHub",
    spec: "Read the specification",
    discord: "Join the Discord",
    roadmap: "See the roadmap",
    goodFirstIssues: "Good first issues",
  },

  footer: {
    project: "Project",
    source: "Source",
    community: "Community",
    org: "Organisation",
    alsoFrom: "Also from the same workshop",
    license: "Hippocratic License 3.0",
    sourceAvailable: "ethical, source-available",
    colophon: "Colophon",
    builtInOpen: "Built in the open — this page is generated from the org's repos.",
    // Blurbs for the sibling projects listed in data/site.ts.
    beatrax: "Local-first personal finance, on your own machine",
    happklaar: "Dinner sorted, without the weeknight scramble",
  },

  status: {
    eyebrow: "Status",
    // Shown under the progress bar, depending on whether GitHub answered at
    // build time. The distinction matters: a stale number presented as live
    // is the one thing this page must never do.
    liveNote: "Generated from the org at build time.",
    snapshotNote: "GitHub was unreachable at build time — showing the last committed snapshot.",
  },

  roadmap: {
    title: "Roadmap",
    lead: "Every milestone, generated from the implementation status the maintainers already keep current.",
    overall: "Overall progress",
    milestones: "milestones",
    deliverables: "deliverables",
    releasedOn: "Released",
    planned: "Planned",
  },

  install: {
    binaries: "Prebuilt binaries",
    macos: "macOS",
    linux: "Linux",
    windows: "Windows",
    checksums: "Checksums & signatures",
    other: "Other",
    noRelease: "No release has been published yet. The install channels above build from source in the meantime.",
    noAssets: "This release ships no attached binaries yet — build from source, or see the release notes:",
    verifyNote:
      "Every release carries a checksum file. Verify the download against it before running it; the install script does this for you.",
  },

  changelog: {
    eyebrow: "Releases",
    title: "Changelog",
    lead: "Every published release across the org, generated from the release notes themselves — there is no file here to forget to update.",
    prerelease: "Pre-release",
    assets: "Downloads",
    source: "All releases on GitHub",
    onGitHub: "View on GitHub",
    unavailable: "No releases have been published yet.",
    statReleases: "releases",
    statChanges: "changes",
    statLatest: "latest",
    filterLabel: "Filter the changelog",
    searchLabel: "Search the changelog",
    searchPlaceholder: "Search changes…",
    matchCount: "{n} matching",
    reset: "Clear",
    byType: "By type",
    byRepo: "By repo",
    byComponent: "By component",
    noComponents: "Component tags appear once releases carry conventional-commit scopes.",
    noMatches: "Nothing matches those filters.",
  },

  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions",
    lead: "Answered once, in the specification, and rendered here — so the answer on this page and the answer in the spec cannot disagree.",
    unavailable:
      "The specification does not carry an FAQ appendix yet. When 90-appendix/faq.md lands there, it renders here automatically.",
    source: "Browse the specification",
  },

  colophon: {
    eyebrow: "Credits",
    title: "Colophon",
    lead: "Lemonfiber orchestrates other people's excellent work. This list is authored in the specification and rendered here, so the credits cannot drift from what is actually used.",
    unavailable:
      "The specification does not carry a colophon appendix yet. When 90-appendix/colophon.md lands there, it renders here automatically.",
    readInSpec: "Browse the specification",
    source: "Browse the specification",
  },

  notFound: {
    title: "That page isn't here.",
    body: "The link may be out of date, or the page may have moved. The front page is a good place to pick the thread back up.",
    cta: "Back to the front page",
  },
};
