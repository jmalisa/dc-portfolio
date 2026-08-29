/*
 * Behaviour tests: loads index.html in jsdom over a throwaway static server
 * and drives the real UI — render, language toggle, filter, lightbox, nav.
 *
 * jsdom is the only devDependency; the site itself has none.
 */
const { JSDOM } = require("jsdom");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});

let fail = 0;
const ok = (cond, msg) => {
  console.log((cond ? "  ok   " : "  FAIL ") + msg);
  if (!cond) fail++;
};
const tick = () => new Promise((r) => setTimeout(r, 20));

(async () => {
  await new Promise((r) => server.listen(0, r));
  const url = "http://127.0.0.1:" + server.address().port + "/index.html";

  const dom = await JSDOM.fromURL(url, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
  });
  const { window } = dom;
  window.addEventListener("error", (e) => {
    console.log("  JS ERROR:", e.error && e.error.stack);
    fail++;
  });
  await new Promise((r) => window.addEventListener("load", r));
  await tick();

  const d = window.document;
  const $ = (s) => d.querySelector(s);
  const $$ = (s) => [...d.querySelectorAll(s)];

  console.log("\n[render]");
  ok($$("#work-grid .card").length === 6, `6 cards rendered (got ${$$("#work-grid .card").length})`);
  ok($$("#work-filters .chip").length === 4, "4 filter chips");
  ok($$("#education .entry").length === 3, "education entries");
  ok($$("#experience .entry").length === 4, "experience entries");
  ok($$("#skills .block").length === 3, "skill groups");
  ok($$("#languages li").length === 4, "languages");
  ok($("#contact-mail").href.startsWith("mailto:"), "email assembled in JS: " + $("#contact-mail").href);
  ok(!/@gmail\.com/.test(fs.readFileSync(path.join(ROOT, "index.html"), "utf8")), "address is not literal in the HTML source");
  ok($$("#work-grid .card__img").every((i) => i.alt.trim().length > 10), "every card image has real alt text");
  ok(d.documentElement.dataset.reveal === "on", "reveal gate enabled once JS is running");

  console.log("\n[i18n]");
  // jsdom reports navigator.language = "en-US", so detection should land on EN.
  ok(d.documentElement.lang === "en", "auto-detects en from navigator.language");
  $('[data-lang-btn="hr"]').click();
  await tick();
  ok(d.documentElement.lang === "hr", "manual switch to hr");
  const hrTitle = $("#work-grid .card__title").textContent;
  ok($(".nav__link").textContent === "Rad", "hr nav text");
  $('[data-lang-btn="en"]').click();
  await tick();
  ok($(".nav__link").textContent === "Work", "static markup text translated");
  ok($("#work-grid .card__title").textContent !== hrTitle, "data-driven card titles translated");
  ok(d.title.includes("graphic design"), "document.title translated");
  ok($("meta[name=description]").content.startsWith("Portfolio of"), "meta description translated");
  ok($('[data-lang-btn="en"]').getAttribute("aria-pressed") === "true", "EN button aria-pressed");
  ok($('[data-lang-btn="hr"]').getAttribute("aria-pressed") === "false", "HR button not pressed");
  ok(window.localStorage.getItem("dc-locale") === "en", "locale persisted");
  ok($(".portrait img").alt === "Portrait — photo placeholder", "attribute-based i18n");
  $('[data-lang-btn="hr"]').click();
  await tick();
  ok($(".nav__link").textContent === "Rad", "switches back to hr");

  console.log("\n[filter]");
  const chip = (id) => $(`#work-filters [data-category="${id}"]`);
  chip("print").click();
  ok($$("#work-grid .card").length === 2, `print filter -> 2 cards (got ${$$("#work-grid .card").length})`);
  ok(chip("print").getAttribute("aria-pressed") === "true", "active chip marked");
  ok($("#work-empty").hidden === true, "empty message hidden when there are results");
  chip("all").click();
  ok($$("#work-grid .card").length === 6, "all filter restores every card");

  console.log("\n[lightbox]");
  const lb = $("#lightbox");
  const stage = () => lb.querySelector("[data-lb-stage] img").src;
  const counter = () => lb.querySelector("[data-lb-counter]").textContent;
  ok(lb.dataset.open !== "true", "closed initially");

  const firstCard = $("#work-grid .card");
  firstCard.click();
  ok(lb.dataset.open === "true", "opens on card click");
  ok(lb.getAttribute("aria-hidden") === null, "aria-hidden removed while open");
  ok(d.activeElement === lb.querySelector("[data-lb-close]"), "focus moves to the close button");
  ok(d.body.style.overflow === "hidden", "body scroll locked");
  ok(lb.querySelector("[data-lb-title]").textContent.length > 0, "title painted");
  ok(stage().includes("placeholder-01"), "first gallery image shown");
  ok(counter() === "1 / 2", "counter reads 1 / 2");
  ok(lb.querySelector("[data-lb-nav]").hidden === false, "nav shown for a multi-image project");

  const key = (k) => d.dispatchEvent(new window.KeyboardEvent("keydown", { key: k, bubbles: true }));
  key("ArrowRight");
  ok(stage().includes("placeholder-04") && counter() === "2 / 2", "ArrowRight advances");
  key("ArrowRight");
  ok(counter() === "1 / 2", "wraps around at the end");
  key("ArrowLeft");
  ok(counter() === "2 / 2", "ArrowLeft goes back");

  // Switching language re-renders the grid underneath the open dialog.
  $('[data-lang-btn="en"]').click();
  await tick();
  ok(lb.querySelector("[data-lb-title]").textContent.includes("project slot"), "open lightbox follows the locale change");
  $('[data-lang-btn="hr"]').click();
  await tick();

  key("Escape");
  ok(lb.dataset.open === "false", "Escape closes");
  ok(lb.getAttribute("aria-hidden") === "true", "aria-hidden restored");
  ok(d.body.style.overflow === "", "body scroll released");
  ok(
    d.activeElement && d.activeElement.dataset.projectId === firstCard.dataset.projectId,
    "focus returns to the originating card even after a re-render"
  );

  $$("#work-grid .card")[1].click();
  ok(lb.querySelector("[data-lb-nav]").hidden === true, "nav hidden for a single-image project");
  lb.querySelector("[data-lb-close]").click();
  ok(lb.dataset.open === "false", "close button closes");

  console.log("\n[mobile nav]");
  const toggle = $("[data-nav-toggle]");
  toggle.click();
  ok(toggle.getAttribute("aria-expanded") === "true", "toggle expands");
  ok($("#site-nav").dataset.open === "true", "nav marked open");
  $(".nav__link").click();
  ok(toggle.getAttribute("aria-expanded") === "false", "nav closes after following a link");

  console.log("\n[accessibility]");
  ok($(".skip-link").getAttribute("href") === "#main", "skip link targets #main");
  ok($$("img").every((i) => i.hasAttribute("alt")), "every img has an alt attribute");
  ok($$("#work-grid .card").every((c) => c.getAttribute("aria-label")), "cards have accessible names");
  ok($("#lightbox").getAttribute("role") === "dialog" && $("#lightbox").getAttribute("aria-modal") === "true", "lightbox is a modal dialog");
  ok($$("h1").length === 1, "exactly one h1");

  console.log(fail ? `\n${fail} PROBLEM(S)\n` : "\ndom checks passed\n");
  server.close();
  dom.window.close();
  process.exit(fail ? 1 : 0);
})();
