// Static, editorial content — the parts of the site that are prose, not motor
// data. The service/profile/form model mirrors media-stack/stack.toml exactly,
// so the "runs in slices" switcher shows what `lemonfiber up <form>` truly boots.

export const site = {
  name: "Lemonfiber",
  tagline: "Self-host your media — without becoming a sysadmin",
  description:
    "A fully open-source, self-hosted media automation stack that sets itself up, runs in the exact slice you need, and proves it's working instead of hoping.",
  org: "lemonfiber",
  githubOrg: "https://github.com/lemonfiber",
  repo: "https://github.com/lemonfiber/website",
  discord: "https://discord.gg/FYuV9CbTHR",
  specUrl: "https://github.com/lemonfiber/spec",
  roadmapUrl: "https://github.com/lemonfiber/spec/blob/main/00-overview/roadmap.md",
  license: "Hippocratic License 3.0",
  licenseUrl: "https://firstdonoharm.dev",
  by: { name: "NightWorks.io", url: "https://nightworks.io" },

  // Path to the 1200×630 share card in public/, or undefined while none
  // exists. og:image and twitter:card=summary_large_image are emitted only
  // when this is set — a large-image card pointing at nothing is downgraded by
  // every crawler, and an og:image pointing at a missing file is worse than no
  // tag at all. The brand repo ships SVG only; crawlers do not accept SVG, so
  // this needs a rendered PNG before it can be switched on.
  ogImage: undefined as string | undefined,
};

// Sibling projects from the same workshop. Listed in the footer so the three
// find each other; each is an independent product with its own org and site.
// The blurbs are prose, so they live in the locale dictionaries under
// `footer[key]` rather than here.
export const siblings = [
  { key: "beatrax", label: "Beatrax", url: "https://beatrax.app" },
  { key: "happklaar", label: "Happklaar", url: "https://happklaar.nl" },
];

export const promises = [
  {
    icon: "lemon",
    title: "Genuinely open",
    body: "No closed-source media server, no paid tier, no phone-home. Every service is open-source and runs on your hardware. Jellyfin, the *arr apps, Seerr — the good stuff, all of it yours.",
  },
  {
    icon: "slice",
    title: "Runs in slices",
    body: "“Just search.” “Just download.” “Everything.” One config, one data folder, no separate installs — boot the shape that fits the moment.",
  },
  {
    icon: "shield",
    title: "Correct by construction",
    body: "It tests hardlinks instead of assuming them. It compares public IPs to prove your VPN isn't leaking. Silence means healthy — and it means it.",
  },
] as const;

// profile key → the services it starts. Mirrors stack.toml [[service]].profile.
export const profiles: Record<string, { label: string; services: string[] }> = {
  search: { label: "Indexers", services: ["Prowlarr", "FlareSolverr", "NZBHydra2"] },
  usenet: { label: "Usenet", services: ["SABnzbd"] },
  torrent: { label: "Torrents", services: ["Gluetun", "qBittorrent"] },
  tv: { label: "Television", services: ["Sonarr"] },
  movies: { label: "Movies", services: ["Radarr"] },
  music: { label: "Music", services: ["Lidarr"] },
  books: { label: "Books", services: ["Bindery"] },
  subs: { label: "Subtitles", services: ["Bazarr"] },
  media: {
    label: "Library",
    services: ["Jellyfin", "Seerr", "Calibre-Web-Automated", "Audiobookshelf"],
  },
  tuning: { label: "Tuning", services: ["Recyclarr", "Unpackerr"] },
  dash: { label: "Dashboard", services: ["Homepage"] },
  proxy: { label: "Proxy", services: ["Caddy"] },
};

// Named forms — the slices you actually type. `lemonfiber up tv`, etc.
export const forms: {
  key: string;
  label: string;
  blurb: string;
  profiles: string[];
  featured?: boolean;
}[] = [
  { key: "search", label: "search", blurb: "Just find things.", profiles: ["search"] },
  { key: "dl", label: "dl", blurb: "Just download a link you have.", profiles: ["usenet", "torrent"] },
  { key: "hunt", label: "hunt", blurb: "Find and grab, no library.", profiles: ["search", "usenet", "torrent"] },
  {
    key: "tv",
    label: "tv",
    blurb: "Search → download → organise → subtitle.",
    profiles: ["search", "usenet", "torrent", "tv", "subs"],
    featured: true,
  },
  { key: "movies", label: "movies", blurb: "The movie pipeline, end to end.", profiles: ["search", "usenet", "torrent", "movies", "subs"] },
  { key: "music", label: "music", blurb: "Track down and file your music.", profiles: ["search", "usenet", "torrent", "music"] },
  { key: "books", label: "books", blurb: "Ebooks, fetched and shelved.", profiles: ["search", "usenet", "torrent", "books"] },
  {
    key: "library",
    label: "library",
    blurb: "Just serve what you already have.",
    profiles: ["media"],
  },
  {
    key: "full",
    label: "full",
    blurb: "The lot — all nineteen services.",
    profiles: ["search", "usenet", "torrent", "tv", "movies", "music", "books", "subs", "media", "tuning", "dash"],
    featured: true,
  },
];

export interface Service {
  name: string;
  role: string;
  profile: string;
  group: string;
  vpn?: boolean;
  household?: boolean;
}

// The 19 services, in the order the pipeline flows.
export const services: Service[] = [
  { name: "Prowlarr", role: "Indexer manager", profile: "search", group: "Find" },
  { name: "FlareSolverr", role: "Cloudflare solver", profile: "search", group: "Find" },
  { name: "NZBHydra2", role: "Meta-indexer", profile: "search", group: "Find" },
  { name: "SABnzbd", role: "Usenet downloader", profile: "usenet", group: "Download" },
  { name: "Gluetun", role: "VPN gateway", profile: "torrent", group: "Download", vpn: true },
  { name: "qBittorrent", role: "Torrent client", profile: "torrent", group: "Download", vpn: true },
  { name: "Sonarr", role: "TV automation", profile: "tv", group: "Organise" },
  { name: "Radarr", role: "Movie automation", profile: "movies", group: "Organise" },
  { name: "Lidarr", role: "Music automation", profile: "music", group: "Organise" },
  { name: "Bindery", role: "Book automation", profile: "books", group: "Organise" },
  { name: "Bazarr", role: "Subtitles", profile: "subs", group: "Organise" },
  { name: "Jellyfin", role: "Media server", profile: "media", group: "Enjoy", household: true },
  { name: "Seerr", role: "Request portal", profile: "media", group: "Enjoy", household: true },
  { name: "Calibre-Web-Automated", role: "Ebook library", profile: "media", group: "Enjoy", household: true },
  { name: "Audiobookshelf", role: "Audiobooks & podcasts", profile: "media", group: "Enjoy", household: true },
  { name: "Recyclarr", role: "Quality profiles", profile: "tuning", group: "Tune" },
  { name: "Unpackerr", role: "Archive extraction", profile: "tuning", group: "Tune" },
  { name: "Homepage", role: "Dashboard", profile: "dash", group: "Access" },
  { name: "Caddy", role: "Reverse proxy", profile: "proxy", group: "Access" },
];

// Compute the container set a form boots, from its profiles. Pure — used by
// the switcher so the UI can never disagree with the manifest.
export function servicesForForm(profileKeys: string[]): Service[] {
  const wanted = new Set(profileKeys);
  return services.filter((s) => wanted.has(s.profile));
}

export const helpWays = [
  { emoji: "🧪", title: "Try it and tell us what broke", body: "Once there's something to run, bug reports and rough edges are gold." },
  { emoji: "📝", title: "Improve the docs", body: "Something unclear? Fix it — every repo's docs are open, and a docs PR is a real contribution." },
  { emoji: "🎨", title: "Design & UX", body: "The web UI and the brand welcome a good eye." },
  { emoji: "💬", title: "Hang out on Discord", body: "Answer a question, share your setup, help shape the roadmap." },
  { emoji: "⭐", title: "Spread the word", body: "A star or a mention genuinely helps a young project find people." },
];
