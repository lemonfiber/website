// The front page's copy, English.
//
// Split out of en.ts because the homepage carries more prose than all the
// chrome combined, and mixing the two made both harder to scan. The shape here
// is the shape Home.astro renders, section by section, in page order.
//
// The `forms` and `services` maps key into data/site.ts by the identifier the
// manifest uses. A key missing here falls back to the English text in site.ts
// rather than rendering blank — a missing translation should be visible, not
// lossy.

export const homeEn = {
  hero: {
    titleLead: "Self-host your media —",
    titleAccent: "without becoming a sysadmin.",
    ctaPrimary: "Join the Discord",
    ctaSecondary: "See the roadmap →",
    statusPill: "Spec complete · building",
    milestones: "milestones",
    ofDeliverables: "of deliverables",
    consoleTitle: "zsh — first run",
  },

  strip: {
    eyebrow: "Live from the repos",
    title: "The build, in the open.",
    sub: "These numbers are read from the org at build time — nobody updates this page by hand.",
    fresh: "Fresh now.",
    snapshot: "Showing the last known snapshot.",
    barLabel: "deliverables shipped",
    of: "of",
    milestonesDone: "milestones done",
    servicesWired: "services wired",
    publicRepos: "public repos",
    inDev: "in dev",
    inProgressNow: "In progress now",
  },

  promises: {
    eyebrow: "Three promises",
    title: "What you actually get.",
  },

  problem: {
    eyebrow: "The problem it kills",
    title: "Self-hosting works brilliantly — once it's running.",
    body: "Getting there means a weekend of config files pasted from Reddit, six different admin screens, keys copied by hand between them, and a nagging doubt about whether your VPN is really hiding you. Then something breaks in a way nothing warns you about, and you never touch it again.",
    lead: "Lemonfiber is one small program that does all of that for you — and then keeps checking it still works.",
    points: [
      {
        strong: "It checks your disk setup",
        rest: " — so importing a file moves it instead of making a second copy, which would quietly eat twice the space.",
      },
      {
        strong: "It checks the VPN is really hiding you",
        rest: " by comparing the address the internet sees from inside the downloader against your own.",
      },
      { strong: "Silence means healthy", rest: " — and it means it." },
    ],
    consoleTitle: "zsh — lemonfiber doctor",
    consoleDocker: "Docker reachable",
    consoleHardlinks: "Hardlinks work on /data",
    consoleVpn: "VPN isolating",
    consoleBound: "qBittorrent bound to gluetun namespace",
    consoleNone: "No findings. The stack is doing what it claims.",
  },

  slices: {
    eyebrow: "Run only the part you need",
    title: "Not “all sixteen services or nothing.”",
    lead: "A form is a name for one part of the stack. Ask for that name and only those apps start — the rest stays off. Pick one and see what actually runs.",
  },

  pipeline: {
    eyebrow: "How it flows",
    title: "Four stages, one hop each.",
    lead: "Media moves left to right. Torrents leave the machine only through the VPN gateway — and Lemonfiber checks that, rather than assuming it.",
    alongside: "Alongside every stage",
    stages: {
      Find: "Ask every indexer at once",
      Download: "Usenet direct, torrents via VPN",
      Organise: "Renamed, hardlinked, subtitled",
      Enjoy: "Served to every screen in the house",
    } as Record<string, string>,
    groups: {
      Find: "Find",
      Download: "Download",
      Organise: "Organise",
      Enjoy: "Enjoy",
      Tune: "Tune",
      Access: "Access",
    } as Record<string, string>,
  },

  inside: {
    eyebrow: "What's inside",
    title: "Nineteen apps, set up and talking to each other.",
    sub: "Jellyfin, Sonarr, Radarr and the rest — every one open-source, running on your own machine. Grouped by the job they do.",
  },

  household: {
    eyebrow: "Set up once",
    title: "Everyone else just watches.",
    bodyLead: "You run the setup. Your household never sees Lemonfiber at all — they get",
    bodyStrong: " one link, one account",
    bodyRest: ": ask for something in Seerr, and it turns up in Jellyfin on the TV. That's the whole experience.",
  },

  cta: {
    title: "Watch it come together — or help build it.",
    body: "The specification is complete and every decision is argued for in the open. You don't need to write code to help.",
    discord: "Join the Discord",
    spec: "Read the spec",
    contribute: "Ways to help →",
  },

  // Keyed by the `key` on each entry in site.ts `forms`.
  forms: {
    search: "Just find things.",
    dl: "Just download a link you have.",
    hunt: "Find and grab, no library.",
    tv: "Search → download → organise → subtitle.",
    movies: "The movie pipeline, end to end.",
    music: "Track down and file your music.",
    books: "Ebooks, fetched and shelved.",
    library: "Just serve what you already have.",
    full: "The lot — all nineteen services.",
  } as Record<string, string>,

  // Keyed by the service `name` in site.ts `services`.
  services: {
    Prowlarr: "Indexer manager",
    FlareSolverr: "Cloudflare solver",
    NZBHydra2: "Meta-indexer",
    SABnzbd: "Usenet downloader",
    Gluetun: "VPN gateway",
    qBittorrent: "Torrent client",
    Sonarr: "TV automation",
    Radarr: "Movie automation",
    Lidarr: "Music automation",
    Bindery: "Book automation",
    Bazarr: "Subtitles",
    Jellyfin: "Media server",
    Seerr: "Request portal",
    "Calibre-Web-Automated": "Ebook library",
    Audiobookshelf: "Audiobooks & podcasts",
    Recyclarr: "Quality profiles",
    Unpackerr: "Archive extraction",
    Homepage: "Dashboard",
    Caddy: "Reverse proxy",
  } as Record<string, string>,

  // Keyed by the `icon` on each entry in site.ts `promises`.
  promiseCards: {
    lemon: {
      title: "Genuinely open",
      body: "No closed-source media server, no paid tier, no phone-home. Every service is open-source and runs on your hardware. Jellyfin, the *arr apps, Seerr — the good stuff, all of it yours.",
    },
    slice: {
      title: "Runs in slices",
      body: "“Just search.” “Just download.” “Everything.” One config, one data folder, no separate installs — boot the shape that fits the moment.",
    },
    shield: {
      title: "Correct by construction",
      body: "It proves things rather than assuming them: that importing a file moves it instead of duplicating it, and that your VPN is really hiding you. Silence means healthy — and it means it.",
    },
  } as Record<string, { title: string; body: string }>,
};
