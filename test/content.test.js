/*
 * Content and asset checks. Plain Node, no dependencies.
 *
 * This is the one that matters day to day: it fails the moment a project is
 * added with a missing image, an unknown category, a half-finished translation
 * or an oversized export.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

let fail = 0;
const bad = (m) => {
  console.log("  FAIL " + m);
  fail++;
};

/* Image budget. Covers are served to everyone, so they get the tighter cap. */
const MAX_COVER_KB = 300;
const MAX_GALLERY_KB = 800;

/* --- load the site scripts against a stub document --- */
const stubDoc = {
  documentElement: {},
  title: "",
  querySelector: () => null,
  querySelectorAll: () => [],
  dispatchEvent: () => {},
  addEventListener: () => {},
};
const sandbox = {
  window: { document: stubDoc },
  document: stubDoc,
  navigator: { language: "hr" },
  localStorage: { getItem: () => null, setItem: () => {} },
  CustomEvent: function () {},
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "js/i18n.js"), "utf8"), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8"), sandbox);
const I18n = sandbox.window.I18n;
const SITE = sandbox.window.SITE;

const LOCALES = ["hr", "en"];

/* --- 1. every i18n key in the markup resolves in both locales --- */
const keys = new Set();
for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) keys.add(m[1]);
for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g))
  m[1].trim().split(/\s+/).forEach((pair) => keys.add(pair.split(":")[1]));

for (const loc of LOCALES) {
  I18n.apply(loc, { persist: false });
  for (const k of keys) if (I18n.t(k) === k) bad(`i18n key missing in ${loc}: ${k}`);
}
console.log(`  ok   ${keys.size} markup i18n keys x ${LOCALES.length} locales`);

/* --- 2. keys used from the JS modules --- */
const jsKeys = new Set();
for (const f of ["work.js", "lightbox.js"]) {
  const src = fs.readFileSync(path.join(ROOT, "js", f), "utf8");
  for (const m of src.matchAll(/I18n\.t\("([^"]+)"\)/g)) jsKeys.add(m[1]);
}
for (const loc of LOCALES) {
  I18n.apply(loc, { persist: false });
  for (const k of jsKeys) if (I18n.t(k) === k) bad(`i18n key used in JS missing in ${loc}: ${k}`);
}
console.log(`  ok   ${jsKeys.size} JS-side i18n keys`);

/* --- 3. every local file referenced from the markup exists --- */
const refs = new Set();
for (const m of html.matchAll(/(?:src|href)="(?!#|mailto:|https?:)([^"]+)"/g)) refs.add(m[1]);
for (const r of refs) if (!fs.existsSync(path.join(ROOT, r))) bad(`missing file referenced in HTML: ${r}`);
console.log(`  ok   ${refs.size} HTML asset references`);

/* --- 4. project data: categories, files, image weight, both languages --- */
const catIds = new Set(SITE.categories.map((c) => c.id));
const bilingual = (v, where) => {
  if (typeof v === "string") return;
  if (!v || !v.hr || !v.en) bad(`missing hr/en on ${where}`);
};
const weigh = (rel, capKB, where) => {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return bad(`missing image: ${rel} (${where})`);
  const kb = Math.round(fs.statSync(abs).size / 1024);
  if (kb > capKB) bad(`${rel} is ${kb} KB, over the ${capKB} KB budget — resize it (see README)`);
};

for (const p of SITE.projects) {
  if (!catIds.has(p.category)) bad(`unknown category "${p.category}" on ${p.id}`);
  weigh(p.cover, MAX_COVER_KB, `${p.id}.cover`);
  ["title", "summary", "coverAlt", "role"].forEach((f) => bilingual(p[f], `${p.id}.${f}`));
  if (!p.images || !p.images.length) bad(`${p.id} has no gallery images`);
  (p.images || []).forEach((img, i) => {
    weigh(img.src, MAX_GALLERY_KB, `${p.id}.images[${i}]`);
    bilingual(img.alt, `${p.id}.images[${i}].alt`);
  });
}
for (const group of ["education", "experience"])
  SITE[group].forEach((e, i) => {
    bilingual(e.role, `${group}[${i}].role`);
    bilingual(e.org, `${group}[${i}].org`);
  });
SITE.skills.forEach((g, i) => {
  bilingual(g.title, `skills[${i}].title`);
  g.items.forEach((it, j) => bilingual(it, `skills[${i}].items[${j}]`));
});
SITE.languages.forEach((l, i) => bilingual(l, `languages[${i}]`));
console.log(`  ok   ${SITE.projects.length} projects, image budgets, about content`);

/* --- 5. the hooks the JS reaches for --- */
const ids = ["work-grid", "work-filters", "work-empty", "education", "experience", "skills",
  "languages", "contact-mail", "contact-links", "lightbox", "year", "site-nav", "main"];
for (const id of ids) if (!html.includes(`id="${id}"`)) bad(`HTML is missing id="${id}"`);

const hooks = ["data-lb-title", "data-lb-meta", "data-lb-summary", "data-lb-stage",
  "data-lb-counter", "data-lb-nav", "data-lb-close", "data-lb-prev", "data-lb-next"];
for (const h of hooks) if (!html.includes(h)) bad(`HTML is missing lightbox hook ${h}`);
console.log(`  ok   ${ids.length} element ids and ${hooks.length} lightbox hooks`);

/* --- 6. nothing loads from an external host (works offline, no consent question) --- */
for (const m of html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)) bad(`external resource in HTML: ${m[1]}`);
for (const f of fs.readdirSync(path.join(ROOT, "css")))
  for (const m of fs.readFileSync(path.join(ROOT, "css", f), "utf8").matchAll(/url\((['"]?)(https?:[^)]+)\1\)/g))
    bad(`external url in css/${f}: ${m[2]}`);

/* --- 7. og:image, if present, must not be an SVG (no platform renders those) --- */
const og = html.match(/<meta property="og:image" content="([^"]+)"/);
if (og && /\.svg$/i.test(og[1])) bad(`og:image is an SVG (${og[1]}) — social previews need PNG or JPEG`);

/* --- 8. no CSS custom property is used without being defined --- */
const css = ["tokens", "base", "layout", "components"]
  .map((f) => fs.readFileSync(path.join(ROOT, "css", f + ".css"), "utf8"))
  .join("\n");
const defined = new Set([...css.matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1]));
const used = new Set([...css.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]));
for (const v of used) if (!defined.has(v) && v !== "--card-ratio") bad(`css var used but never defined: ${v}`);
console.log(`  ok   ${used.size} css custom properties, no external hosts`);

console.log(fail ? `\n${fail} PROBLEM(S)\n` : "\ncontent checks passed\n");
process.exit(fail ? 1 : 0);
