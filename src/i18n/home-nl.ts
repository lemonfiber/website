// The front page's copy, Dutch. Typed against home-en.ts, so a key added there
// and forgotten here is a build error.
//
// Translation notes:
//   - "self-hosten" is the verb the Dutch homelab community actually uses.
//   - Service names, form names and commands stay as they are — `lemonfiber up
//     tv` is what you type, and "tv" is not a word being translated.
//   - "hardlink" stays English: it is the filesystem term, and "vaste koppeling"
//     would send someone searching for the wrong thing.
//   - Milestone identifiers (M0…M6) are not translated; they name work items
//     the specification defines in English.

import type { homeEn } from "./home-en";

export const homeNl: typeof homeEn = {
  hero: {
    titleLead: "Self-host je media —",
    titleAccent: "zonder sysadmin te worden.",
    ctaPrimary: "Kom op Discord",
    ctaSecondary: "Bekijk de roadmap →",
    statusPill: "Spec af · in aanbouw",
    milestones: "mijlpalen",
    ofDeliverables: "van de onderdelen",
    consoleTitle: "zsh — eerste keer",
  },

  strip: {
    eyebrow: "Live uit de repo's",
    title: "De bouw, in de open lucht.",
    sub: "Deze cijfers worden tijdens de build uit de organisatie gelezen — niemand werkt deze pagina met de hand bij.",
    fresh: "Zojuist opgehaald.",
    snapshot: "Dit is de laatst bekende momentopname.",
    barLabel: "onderdelen opgeleverd",
    of: "van de",
    milestonesDone: "mijlpalen af",
    servicesWired: "services aangesloten",
    publicRepos: "publieke repo's",
    inDev: "in ontwikkeling",
    inProgressNow: "Nu mee bezig",
  },

  promises: {
    eyebrow: "Drie beloftes",
    title: "Wat je er echt aan hebt.",
  },

  problem: {
    eyebrow: "Het probleem dat het oplost",
    title: "Self-hosten werkt uitstekend — zodra het draait.",
    body: "Zover komen kost een weekend aan configuratiebestanden die je van Reddit plakt, zes verschillende beheerschermen, sleutels die je met de hand overtikt, en een knagend gevoel of je VPN je nou echt wel verbergt. Daarna gaat er iets stuk zonder dat iets je waarschuwt, en raak je het nooit meer aan.",
    lead: "Lemonfiber is één klein programma dat dat allemaal voor je doet — en daarna blijft controleren of het nog werkt.",
    points: [
      {
        strong: "Het controleert je schijfindeling",
        rest: " — zodat een binnengehaald bestand verplaatst wordt in plaats van er een tweede kopie van te maken, wat stilletjes het dubbele aan ruimte zou kosten.",
      },
      {
        strong: "Het controleert of de VPN je echt verbergt",
        rest: " door het adres dat het internet vanuit de downloader ziet te vergelijken met dat van jezelf.",
      },
      { strong: "Stilte betekent gezond", rest: " — en dat is het dan ook." },
    ],
    consoleTitle: "zsh — lemonfiber doctor",
    consoleDocker: "Docker bereikbaar",
    consoleHardlinks: "Hardlinks werken op /data",
    consoleVpn: "VPN isoleert",
    consoleBound: "qBittorrent zit in de netwerknamespace van gluetun",
    consoleNone: "Niets gevonden. De stack doet wat hij belooft.",
  },

  slices: {
    eyebrow: "Draai alleen wat je nodig hebt",
    title: "Niet “alle zestien services of niets.”",
    lead: "Een vorm is een naam voor één deel van de stack. Vraag om die naam en alleen die apps starten — de rest blijft uit. Kies er een en zie wat er werkelijk draait.",
  },

  pipeline: {
    eyebrow: "Hoe het loopt",
    title: "Vier stappen, telkens één sprong.",
    lead: "Media beweegt van links naar rechts. Torrents verlaten de machine uitsluitend via de VPN-gateway — en Lemonfiber controleert dat, in plaats van het aan te nemen.",
    alongside: "Naast elke stap",
    stages: {
      Find: "Vraag het alle indexers tegelijk",
      Download: "Usenet rechtstreeks, torrents via VPN",
      Organise: "Hernoemd, gehardlinkt, ondertiteld",
      Enjoy: "Naar elk scherm in huis",
    },
    groups: {
      Find: "Zoeken",
      Download: "Downloaden",
      Organise: "Ordenen",
      Enjoy: "Kijken",
      Tune: "Afstemmen",
      Access: "Toegang",
    },
  },

  inside: {
    eyebrow: "Wat er in zit",
    title: "Negentien apps, opgezet en met elkaar verbonden.",
    sub: "Jellyfin, Sonarr, Radarr en de rest — stuk voor stuk open source, draaiend op je eigen machine. Gegroepeerd naar het werk dat ze doen.",
  },

  household: {
    eyebrow: "Eén keer opzetten",
    title: "De rest kijkt gewoon.",
    bodyLead: "Jij doet de installatie. Je huisgenoten zien Lemonfiber nooit — zij krijgen",
    bodyStrong: " één link, één account",
    bodyRest: ": vraag iets aan in Seerr, en het staat op de tv in Jellyfin. Dat is de hele ervaring.",
  },

  cta: {
    title: "Kijk hoe het ontstaat — of bouw mee.",
    body: "De specificatie is af en elke beslissing is in de open lucht beargumenteerd. Je hoeft geen code te schrijven om te helpen.",
    discord: "Kom op Discord",
    spec: "Lees de spec",
    contribute: "Manieren om te helpen →",
  },

  forms: {
    search: "Gewoon dingen vinden.",
    dl: "Gewoon een link downloaden die je al hebt.",
    hunt: "Vinden en binnenhalen, zonder bibliotheek.",
    tv: "Zoeken → downloaden → ordenen → ondertitelen.",
    movies: "De filmketen, van begin tot eind.",
    music: "Je muziek opsporen en netjes wegzetten.",
    books: "E-boeken, opgehaald en in de kast.",
    library: "Gewoon serveren wat je al hebt.",
    full: "Alles — alle negentien services.",
  },

  services: {
    Prowlarr: "Indexerbeheer",
    FlareSolverr: "Cloudflare-oplosser",
    NZBHydra2: "Meta-indexer",
    SABnzbd: "Usenet-downloader",
    Gluetun: "VPN-gateway",
    qBittorrent: "Torrentclient",
    Sonarr: "Serie-automatisering",
    Radarr: "Film-automatisering",
    Lidarr: "Muziek-automatisering",
    Bindery: "Boek-automatisering",
    Bazarr: "Ondertiteling",
    Jellyfin: "Mediaserver",
    Seerr: "Aanvraagportaal",
    "Calibre-Web-Automated": "E-boekenbibliotheek",
    Audiobookshelf: "Luisterboeken en podcasts",
    Recyclarr: "Kwaliteitsprofielen",
    Unpackerr: "Archieven uitpakken",
    Homepage: "Dashboard",
    Caddy: "Reverse proxy",
  },

  promiseCards: {
    lemon: {
      title: "Echt open",
      body: "Geen mediaserver met gesloten broncode, geen betaalde variant, geen stiekem contact met een server. Elke service is open source en draait op jouw hardware. Jellyfin, de *arr-apps, Seerr — al het goede spul, allemaal van jou.",
    },
    slice: {
      title: "Draait in stukken",
      body: "“Alleen zoeken.” “Alleen downloaden.” “Alles.” Eén configuratie, één datamap, geen aparte installaties — start de vorm die op dat moment past.",
    },
    shield: {
      title: "Kloppend van opzet",
      body: "Het bewijst dingen in plaats van ze aan te nemen: dat een binnengehaald bestand verplaatst wordt en niet gedupliceerd, en dat je VPN je echt verbergt. Stilte betekent gezond — en dat is het dan ook.",
    },
  },
};
