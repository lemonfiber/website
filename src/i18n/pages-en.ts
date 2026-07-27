// English content pages, expressed as data. See lib/doc.ts for why.
//
// Only pages added since the DocPage renderer landed live here. The original
// hand-built pages (index, roadmap, transparency, contribute) keep their own
// templates; they can move into this file one at a time if that ever looks
// worth doing.

import type { Doc } from "../lib/doc";

export const pagesEn: Record<string, Doc> = {
  install: {
    eyebrow: "Install",
    title: "Get Lemonfiber running",
    lead: "One binary that sets up the stack, boots the slice you asked for, and checks its own work. Pick whichever channel you already trust.",
    sections: [
      {
        heading: "Homebrew",
        body: [
          "The formula is written by release CI rather than by hand, so the tap can never point at a version that was not actually published.",
        ],
        code: "brew install lemonfiber/tap/lemonfiber",
      },
      {
        heading: "Install script",
        body: [
          "Detects your platform, downloads the matching binary from the GitHub release, and verifies its checksum before moving it into place.",
        ],
        code: "curl -fsSL https://lemonfiber.app/install.sh | sh",
        note: "Piping a script into a shell means trusting this domain and the release it fetches. If you would rather read it first, the script is the same file — download it, read it, then run it.",
        tone: "warn",
      },
      {
        heading: "Docker Compose",
        body: [
          "If you would rather not install anything on the host at all, the stack is a Compose project and Lemonfiber is the thing that drives it. Clone the stack and run it directly.",
        ],
        code: [
          "git clone https://github.com/lemonfiber/media-stack",
          "cd media-stack",
          "docker compose up -d",
        ].join("\n"),
      },
      {
        heading: "From source",
        body: ["Rust toolchain, stable channel. Builds the same binary the release workflow does."],
        code: ["cargo install --git https://github.com/lemonfiber/lemonfiber"].join("\n"),
      },
      {
        // The live asset table renders here, from the newest GitHub release.
        slot: true,
      },
      {
        heading: "Then what",
        body: [
          "Boot a slice rather than the whole stack. `lemonfiber up tv` starts search, download, organise and subtitles — nothing else. `lemonfiber up full` starts all nineteen services. `lemonfiber status` tells you whether it is genuinely working, including a hardlink test and a public-IP comparison that proves the VPN is not leaking.",
        ],
        code: ["lemonfiber up tv", "lemonfiber status", "lemonfiber down"].join("\n"),
      },
    ],
    cta: {
      label: "See the roadmap",
      href: "/roadmap",
      secondaryLabel: "Read the specification",
      secondaryHref: "https://github.com/lemonfiber/spec",
    },
  },
};
