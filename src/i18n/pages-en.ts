// English content pages, expressed as data. See lib/doc.ts for why.
//
// Only pages added since the DocPage renderer landed live here. The original
// hand-built pages (index, roadmap, transparency, contribute) keep their own
// templates; they can move into this file one at a time if that ever looks
// worth doing.
//
// The install page states what works TODAY. Prebuilt binaries, the shell
// installer and a working Homebrew formula all arrive with M6 (release
// engineering), which has not shipped: the tap currently holds a generated
// placeholder and v0.1.0 carries no attached binaries. Listing those as if
// they worked would be the exact failure this site exists to prevent — a page
// that says one thing while the repositories say another.

import type { Doc } from "../lib/doc";

export const pagesEn: Record<string, Doc> = {
  install: {
    eyebrow: "Install",
    title: "Get Lemonfiber running",
    lead: "Early days: the binary builds from source and the stack runs from Compose. Packaged installs arrive with the first full release.",
    sections: [
      {
        heading: "Build the binary",
        body: [
          "A stable Rust toolchain is all you need. This builds the same binary the release workflow will publish.",
        ],
        code: "cargo install --git https://github.com/lemonfiber/lemonfiber",
      },
      {
        heading: "Run the stack",
        body: [
          "The stack is a Compose project, and Lemonfiber is the tool that drives it. You can also clone and run it directly — useful if you want to read exactly what is being started before anything starts it for you.",
        ],
        code: [
          "git clone https://github.com/lemonfiber/media-stack",
          "cd media-stack",
          "docker compose up -d",
        ].join("\n"),
        note: "Downloads and media must sit under one mount point, or imports copy instead of hardlinking — slower, double the disk, and it breaks seeding. Lemonfiber checks this rather than assuming it.",
        tone: "warn",
      },
      {
        heading: "Not yet: packaged installs",
        body: [
          "Homebrew, the shell and PowerShell installers, and signed binaries for macOS, Linux and Windows are all produced by the release pipeline, which is milestone M6 and has not shipped. The tap exists but holds a generated placeholder, so `brew install` will not work yet.",
          "When M6 lands, the formula is written by CI rather than by hand and the binaries attach to the GitHub release — at which point they appear in the section below automatically, because this page reads them from the release rather than from a list kept here.",
        ],
        tone: "accent",
      },
      {
        // The live asset table renders here, from the newest GitHub release.
        slot: true,
      },
      {
        heading: "Then what",
        body: [
          "Boot a slice rather than the whole stack. `lemonfiber up tv` starts search, download, organise and subtitles — nothing else. `lemonfiber up full` starts eighteen services. `lemonfiber doctor` tells you whether it is genuinely working, including a hardlink test and a public-IP comparison that proves the VPN is not leaking.",
        ],
        code: ["lemonfiber up tv", "lemonfiber doctor", "lemonfiber down"].join("\n"),
      },
    ],
    cta: {
      label: "See what's shipped",
      href: "/roadmap",
      secondaryLabel: "Read the specification",
      secondaryHref: "https://github.com/lemonfiber/spec",
    },
  },
};
