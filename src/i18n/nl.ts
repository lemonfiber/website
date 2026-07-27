// Dutch copy. Typed against the English dictionary, so a key added to en.ts
// and forgotten here is a build error rather than a page that silently falls
// back to English.
//
// Translation notes, so later edits stay consistent with these choices:
//   - "self-hosten" is used as the verb; it is what the Dutch-speaking
//     homelab community actually says, and "zelf hosten" reads as a literal
//     translation of a term they already use in English.
//   - Service names (Jellyfin, Sonarr, Prowlarr) and the CLI's own words
//     (`up`, the form names) are never translated — they are what you type.
//   - Milestone titles stay English on the roadmap: they name deliverables the
//     spec defines in English, and inventing Dutch names would put this page
//     out of step with the repository it mirrors.

import type { Copy } from "./index";

export const nl: Copy = {
  meta: {
    lang: "nl",
    tagline: "Self-host je media — zonder sysadmin te worden",
    description:
      "Een volledig open source, self-hosted media-automatiseringsstack die zichzelf opzet, draait in precies de vorm die je nodig hebt, en aantoont dat het werkt in plaats van het te hopen.",
  },

  nav: {
    home: "Home",
    roadmap: "Roadmap",
    transparency: "Transparantie",
    contribute: "Meedoen",
    install: "Installeren",
    changelog: "Wijzigingen",
    faq: "FAQ",
    colophon: "Colofon",
    skip: "Naar de inhoud",
    theme: "Wissel kleurthema",
    language: "Taal",
    menu: "Menu",
    github: "Lemonfiber op GitHub",
    discord: "Discord",
  },

  cta: {
    install: "Installeer Lemonfiber",
    repo: "Broncode op GitHub",
    spec: "Lees de specificatie",
    discord: "Kom op Discord",
    roadmap: "Bekijk de roadmap",
    goodFirstIssues: "Klussen om mee te beginnen",
  },

  footer: {
    project: "Project",
    source: "Broncode",
    community: "Community",
    org: "Organisatie",
    alsoFrom: "Ook uit dezelfde werkplaats",
    license: "Hippocratic License 3.0",
    sourceAvailable: "ethisch, source-available",
    colophon: "Colofon",
    builtInOpen: "In de open gebouwd — deze pagina komt uit de repo's van de organisatie.",
    beatrax: "Lokale persoonlijke financiën, op je eigen machine",
    happklaar: "Avondeten geregeld, zonder het doordeweekse gedoe",
  },

  status: {
    eyebrow: "Status",
    liveNote: "Gegenereerd uit de organisatie tijdens de build.",
    snapshotNote:
      "GitHub was niet bereikbaar tijdens de build — dit is de laatst vastgelegde momentopname.",
  },

  roadmap: {
    title: "Roadmap",
    lead: "Elke mijlpaal, gegenereerd uit de implementatiestatus die de makers toch al bijhouden.",
    overall: "Totale voortgang",
    milestones: "mijlpalen",
    deliverables: "onderdelen",
    releasedOn: "Uitgebracht",
    planned: "Gepland",
  },

  install: {
    binaries: "Kant-en-klare binaries",
    macos: "macOS",
    linux: "Linux",
    windows: "Windows",
    checksums: "Checksums en handtekeningen",
    other: "Overig",
    noRelease: "Er is nog geen release gepubliceerd. De kanalen hierboven bouwen in de tussentijd vanaf de broncode.",
    noAssets: "Bij deze release zitten nog geen binaries — bouw vanaf de broncode, of bekijk de release notes:",
    verifyNote:
      "Bij elke release hoort een checksum-bestand. Controleer je download daartegen voordat je hem uitvoert; het installatiescript doet dit voor je.",
  },

  changelog: {
    eyebrow: "Releases",
    title: "Wijzigingen",
    lead: "Elke gepubliceerde release binnen de organisatie, gegenereerd uit de release notes zelf — er is hier geen bestand dat je kunt vergeten bij te werken.",
    prerelease: "Pre-release",
    assets: "Downloads",
    source: "Alle releases op GitHub",
    onGitHub: "Bekijk op GitHub",
    unavailable: "Er zijn nog geen releases gepubliceerd.",
    statReleases: "releases",
    statChanges: "wijzigingen",
    statLatest: "nieuwste",
    filterLabel: "Filter de wijzigingen",
    searchLabel: "Zoek in de wijzigingen",
    searchPlaceholder: "Zoek wijzigingen…",
    matchCount: "{n} gevonden",
    reset: "Wissen",
    byType: "Op type",
    byRepo: "Op repo",
    byComponent: "Op onderdeel",
    noComponents: "Onderdeel-labels verschijnen zodra releases conventional-commit scopes bevatten.",
    noMatches: "Niets komt overeen met deze filters.",
  },

  faq: {
    eyebrow: "Vragen",
    title: "Veelgestelde vragen",
    lead: "Eén keer beantwoord, in de specificatie, en hier weergegeven — zodat het antwoord op deze pagina en het antwoord in de spec niet uit elkaar kunnen lopen.",
    unavailable:
      "De specificatie heeft nog geen FAQ-bijlage. Zodra 90-appendix/faq.md daar staat, verschijnt die hier vanzelf.",
    source: "Blader door de specificatie",
  },

  colophon: {
    eyebrow: "Met dank aan",
    title: "Colofon",
    lead: "Lemonfiber orkestreert het uitstekende werk van anderen. Deze lijst staat in de specificatie en wordt hier weergegeven, zodat de credits niet los kunnen raken van wat er werkelijk gebruikt wordt.",
    unavailable:
      "De specificatie heeft nog geen colofon-bijlage. Zodra 90-appendix/colophon.md daar staat, verschijnt die hier vanzelf.",
    readInSpec: "Blader door de specificatie",
    source: "Blader door de specificatie",
  },

  notFound: {
    title: "Deze pagina bestaat niet.",
    body: "De link is misschien verouderd, of de pagina is verplaatst. Op de voorpagina pak je de draad weer op.",
    cta: "Terug naar de voorpagina",
  },
};
