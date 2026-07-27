// Dutch content pages. Typed against the English set, so a page added there
// and forgotten here is a build error rather than a 404 in one language.
//
// Commands, flags and form names are never translated — they are what you type.

import type { Doc } from "../lib/doc";
import { pagesEn } from "./pages-en";

export const pagesNl: Record<keyof typeof pagesEn, Doc> = {
  install: {
    eyebrow: "Installeren",
    title: "Lemonfiber aan de praat krijgen",
    lead: "Eén binary die de stack opzet, de vorm start waar je om vroeg, en zijn eigen werk controleert. Kies het kanaal dat je toch al vertrouwt.",
    sections: [
      {
        heading: "Homebrew",
        body: [
          "De formule wordt door de release-CI geschreven en niet met de hand, dus de tap kan nooit naar een versie wijzen die niet daadwerkelijk is uitgebracht.",
        ],
        code: "brew install lemonfiber/tap/lemonfiber",
      },
      {
        heading: "Installatiescript",
        body: [
          "Herkent je platform, haalt de bijbehorende binary uit de GitHub-release en controleert de checksum voordat het bestand op zijn plek komt.",
        ],
        code: "curl -fsSL https://lemonfiber.app/install.sh | sh",
        note: "Een script rechtstreeks in je shell pipen betekent dat je dit domein en de opgehaalde release vertrouwt. Wil je het liever eerst lezen: het script is hetzelfde bestand — download het, lees het, en voer het daarna uit.",
        tone: "warn",
      },
      {
        heading: "Docker Compose",
        body: [
          "Wil je liever helemaal niets op de host installeren: de stack is een Compose-project en Lemonfiber is wat het aanstuurt. Kloon de stack en draai hem rechtstreeks.",
        ],
        code: [
          "git clone https://github.com/lemonfiber/media-stack",
          "cd media-stack",
          "docker compose up -d",
        ].join("\n"),
      },
      {
        heading: "Vanaf de broncode",
        body: [
          "Rust-toolchain, stable channel. Bouwt dezelfde binary als de release-workflow.",
        ],
        code: ["cargo install --git https://github.com/lemonfiber/lemonfiber"].join("\n"),
      },
      {
        slot: true,
      },
      {
        heading: "En dan",
        body: [
          "Start een vorm in plaats van de hele stack. `lemonfiber up tv` start zoeken, downloaden, ordenen en ondertitels — verder niets. `lemonfiber up full` start alle negentien services. `lemonfiber status` vertelt je of het echt werkt, inclusief een hardlink-test en een vergelijking van publieke IP's die aantoont dat de VPN niet lekt.",
        ],
        code: ["lemonfiber up tv", "lemonfiber status", "lemonfiber down"].join("\n"),
      },
    ],
    cta: {
      label: "Bekijk de roadmap",
      href: "/nl/roadmap",
      secondaryLabel: "Lees de specificatie",
      secondaryHref: "https://github.com/lemonfiber/spec",
    },
  },
};
