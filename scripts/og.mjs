// Renders the 1200×630 share cards into public/.
//
// The card is built from the site's own design tokens and the woff2 the build
// already emitted, so it cannot drift from the brand: change a token and the
// next render follows. Headless Chrome does the rasterising, which keeps this
// dependency-free — there is no image library in the tree and one card per
// locale does not justify adding one.
//
// Usage: npm run build && node scripts/og.mjs
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const token = (name) => {
  const m = new RegExp(String.raw`^\s*${name}:\s*([^;]+);`, "m").exec(
    readFileSync("src/styles/tokens.css", "utf8"),
  );
  if (!m) throw new Error(`token ${name} not found`);
  return m[1].trim();
};

const font = readdirSync("dist/_astro").find((f) =>
  /^bricolage-grotesque-latin-wght-normal.*\.woff2$/.test(f),
);
if (!font) throw new Error("run `npm run build` first — the font is taken from dist/");

const mark = readFileSync("public/brand/mark-small.svg", "utf8");
const [ink, lemon, fiber, paper] = ["--lf-ink", "--lf-lemon", "--lf-fiber", "--lf-paper"].map(token);

const card = ({ head, foot }) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Bricolage";src:url("/_astro/${font}") format("woff2");font-weight:200 800;font-display:block}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{font-family:"Bricolage",system-ui,sans-serif;background:${ink};color:${paper};
 background-image:
  radial-gradient(120% 80% at 88% -12%, rgba(240,196,25,.24), transparent 58%),
  radial-gradient(90% 62% at -4% 2%, rgba(224,122,23,.16), transparent 56%),
  radial-gradient(rgba(255,255,255,.045) .6px, transparent .6px);
 background-size:auto,auto,24px 24px;
 display:flex;flex-direction:column;justify-content:space-between;padding:74px 82px}
.top{display:flex;align-items:center;gap:22px}
.top svg{width:76px;height:76px}
.word{font-weight:800;font-size:52px;letter-spacing:-.045em}
h1{font-weight:800;font-size:76px;line-height:1.02;letter-spacing:-.048em;max-width:19ch}
h1 em{font-style:normal;color:${fiber}}
.foot{display:flex;align-items:center;gap:16px;font-size:25px;color:#b3ac93;letter-spacing:-.01em}
.dot{width:9px;height:9px;border-radius:50%;background:${lemon}}
</style></head><body>
<div class="top">${mark}<span class="word">Lemonfiber</span></div>
<h1>${head}</h1>
<div class="foot"><span class="dot"></span><span>${foot}</span></div>
</body></html>`;

const CARDS = {
  "og.png": {
    head: "Self-host your media —<br><em>without becoming a sysadmin.</em>",
    foot: "Nineteen apps, set up for you · open source · lemonfiber.app",
  },
  "og-nl.png": {
    head: "Self-host je media —<br><em>zonder sysadmin te worden.</em>",
    foot: "Negentien apps, voor je opgezet · open source · lemonfiber.app",
  },
};

// Rendered from dist/ so the @font-face URL resolves against the built assets.
//
// The intermediate render goes into a private 0700 directory rather than a
// fixed /tmp path: a predictable name in a world-writable directory can be
// pre-created as a symlink by any other local user, redirecting the write.
const work = mkdtempSync(join(tmpdir(), "lf-og-"));

// Absolute paths for both binaries, so neither resolves through PATH.
const SIPS = "/usr/bin/sips";

for (const [out, copy] of Object.entries(CARDS)) {
  const tmp = `dist/_og-tmp.html`;
  writeFileSync(tmp, card(copy));
  execFileSync(CHROME, [
    "--headless", "--disable-gpu", "--hide-scrollbars",
    "--force-device-scale-factor=2", "--window-size=1200,630",
    "--virtual-time-budget=3000", `--screenshot=${join(work, "raw.png")}`,
    `file://${process.cwd()}/${tmp}`,
  ], { stdio: "ignore" });
  rmSync(tmp);
  // Chrome renders at 2× for crispness; the published card is exactly 1200×630.
  execFileSync(SIPS, ["-z", "630", "1200", join(work, "raw.png"), "--out", `public/${out}`], {
    stdio: "ignore",
  });
  console.log(`wrote public/${out}`);
}

rmSync(work, { recursive: true, force: true });
