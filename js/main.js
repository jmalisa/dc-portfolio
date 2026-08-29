/*
 * Boot: locale, first render, mobile nav, sticky-header state, scroll reveal.
 */
(function () {
  "use strict";

  var I18n = window.I18n;

  /*
   * Scroll-reveal starts elements at opacity 0, which would leave the whole
   * page blank if this script ever failed. So the CSS only hides them while
   * this attribute is set, and anything thrown below takes it straight back
   * off — a broken script degrades to a plain, fully visible page.
   */
  document.documentElement.dataset.reveal = "on";
  window.addEventListener("error", function () {
    delete document.documentElement.dataset.reveal;
  });

  /* ---------- Locale ---------- */
  I18n.apply(I18n.detect(), { persist: false });
  window.Work.renderAll();

  document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      I18n.apply(btn.getAttribute("data-lang-btn"));
    });
  });

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.dataset.open = String(open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });
    /* The nav is only a drawer below the layout breakpoint. */
    if (typeof window.matchMedia === "function") {
      window.matchMedia("(min-width: 48em)").addEventListener("change", function () {
        setNav(false);
      });
    }
  }

  /* ---------- Sticky header hairline ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.dataset.scrolled = String(window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  var reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (node) {
      node.dataset.visible = "true";
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    var observeAll = function () {
      document.querySelectorAll(".reveal:not([data-visible])").forEach(function (node) {
        observer.observe(node);
      });
    };
    observeAll();
    /* Cards are created after the first pass, so pick them up too. */
    document.addEventListener("gridrendered", observeAll);
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
