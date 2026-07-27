// Dutch content pages. Typed against the English set, so a page added there
// and forgotten here is a build error rather than a 404 in one language.
//
// Commands, flags and form names are never translated — they are what you type.
// See pages-en.ts for why the install page leads with building from source.

import type { Doc } from "../lib/doc";
import { pagesEn } from "./pages-en";

export const pagesNl: Record<keyof typeof pagesEn, Doc> = {
  install: {
    eyebrow: "Installeren",
    title: "Lemonfiber aan de praat krijgen",
    lead: "Nog vroeg: de binary bouw je vanaf de broncode en de stack draait vanuit Compose. Kant-en-klare installaties komen met de eerste volledige release.",
    sections: [
      {
        heading: "Bouw de binary",
        body: [
          "Een stabiele Rust-toolchain is genoeg. Dit bouwt dezelfde binary als de release-workflow straks publiceert.",
        ],
        code: "cargo install --git https://github.com/lemonfiber/lemonfiber",
      },
      {
        heading: "Draai de stack",
        body: [
          "De stack is een Compose-project en Lemonfiber is het gereedschap dat hem aanstuurt. Je kunt hem ook zelf klonen en rechtstreeks draaien — handig als je eerst wilt lezen wat er precies gestart wordt.",
        ],
        code: [
          "git clone https://github.com/lemonfiber/media-stack",
          "cd media-stack",
          "docker compose up -d",
        ].join("\n"),
        note: "Downloads en media moeten onder één mountpunt staan, anders kopieert een import in plaats van te hardlinken — trager, dubbel zoveel schijf, en het breekt seeding. Lemonfiber controleert dit in plaats van het aan te nemen.",
        tone: "warn",
      },
      {
        heading: "Nog niet: kant-en-klare installaties",
        body: [
          "Homebrew, de shell- en PowerShell-installers en ondertekende binaries voor macOS, Linux en Windows komen allemaal uit de release-pijplijn. Dat is mijlpaal M6 en die is nog niet af. De tap bestaat wel, maar bevat een gegenereerde placeholder, dus `brew install` werkt nog niet.",
          "Zodra M6 klaar is, wordt de formule door CI geschreven in plaats van met de hand en hangen de binaries aan de GitHub-release — waarna ze vanzelf hieronder verschijnen, omdat deze pagina ze uit de release leest en niet uit een lijst die hier wordt bijgehouden.",
        ],
        tone: "accent",
      },
      {
        slot: true,
      },
      {
        heading: "En dan",
        body: [
          "Start een vorm in plaats van de hele stack. `lemonfiber up tv` start zoeken, downloaden, ordenen en ondertitels — verder niets. `lemonfiber up full` start achttien services. `lemonfiber doctor` vertelt je of het echt werkt, inclusief een hardlink-test en een vergelijking van publieke IP's die aantoont dat de VPN niet lekt.",
        ],
        code: ["lemonfiber up tv", "lemonfiber doctor", "lemonfiber down"].join("\n"),
      },
    ],
    cta: {
      label: "Bekijk wat er af is",
      href: "/nl/roadmap",
      secondaryLabel: "Lees de specificatie",
      secondaryHref: "https://github.com/lemonfiber/spec",
    },
  },
};
