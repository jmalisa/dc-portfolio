/*
 * Tiny i18n layer. No dependencies, no build step.
 *
 * In the HTML:
 *   <h2 data-i18n="work.title">Odabrani radovi</h2>
 *   <img data-i18n-attr="alt:about.portraitAlt" ...>
 *   <a data-i18n-attr="aria-label:contact.mailAria" ...>
 *
 * The HTML always contains the Croatian text as its literal content, so the
 * page is readable and indexable even before JS runs.
 *
 * Croatian is the source of truth. When you add a key, add both hr and en.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "dc-locale";
  var DEFAULT = "hr";

  var I18N = {
    hr: {
      "meta.title": "Dora Cvetković — grafički dizajn i vizualni identiteti",
      "meta.description":
        "Portfolio Dore Cvetković, magistre grafičke tehnologije: vizualni identiteti, priprema za tisak i vizuali za društvene mreže.",

      "a11y.skip": "Prijeđi na sadržaj",
      "nav.aria": "Glavna navigacija",
      "nav.toggle": "Izbornik",
      "nav.work": "Rad",
      "nav.about": "O meni",
      "nav.contact": "Kontakt",
      "lang.aria": "Jezik stranice",
      "lang.hr": "Hrvatski",
      "lang.en": "Engleski",

      "hero.eyebrow": "Portfolio",
      "hero.role": "Grafički dizajn i vizualne komunikacije",
      "hero.intro":
        "Magistra inženjerka grafičke tehnologije. Radim vizualne identitete, pripremu za tisak i vizuale za digitalne kanale — s iskustvom u složenim poslovnim sustavima i koordinaciji procesa, pa projekt dovodim do kraja, a ne samo do makete.",
      "hero.ctaWork": "Pogledaj radove",
      "hero.ctaContact": "Javi mi se",

      "work.eyebrow": "Rad",
      "work.title": "Odabrani projekti",
      "work.note":
        "Radovi u pripremi — prikazani su rezervirani vizuali dok se ne postave stvarni projekti.",
      "work.filterAria": "Filtriraj radove po kategoriji",
      "work.empty": "Nema projekata u ovoj kategoriji.",
      "work.open": "Otvori projekt",

      "about.eyebrow": "O meni",
      "about.title": "Dizajn s razumijevanjem proizvodnje",
      "about.portraitAlt": "Portret — rezervirano mjesto za fotografiju",
      "about.p1":
        "Izražene kreativne i analitičke vještine, timski rad i osjećaj za kvalitetu i detalje. Studij grafičke tehnologije dao mi je ono što se u dizajnu često izgubi: razumijevanje kako se datoteka pretvara u tiskani proizvod.",
      "about.p2":
        "Kroz Erasmus na Sapienzi u Rimu radila sam na design thinkingu, dizajnu usluga i interakcija — s naglaskom na korisničko iskustvo i timski rad na međunarodnim projektima.",
      "about.education": "Obrazovanje",
      "about.experience": "Iskustvo",
      "about.languages": "Jezici",
      "about.cv": "Preuzmi CV (PDF)",

      "contact.eyebrow": "Kontakt",
      "contact.title": "Kontakt",
      "contact.lead": "Otvorena za suradnje i nove projekte.",
      "contact.mailAria": "Pošalji e-poruku",
      "contact.location": "Zagreb, Hrvatska",
      "contact.linksTitle": "Profili",
      "contact.linksEmpty": "Poveznice na profile uskoro.",

      "footer.rights": "Sva prava pridržana.",
      "footer.top": "Na vrh",

      "lightbox.aria": "Pregled projekta",
      "lightbox.close": "Zatvori",
      "lightbox.prev": "Prethodna slika",
      "lightbox.next": "Sljedeća slika",
      "lightbox.client": "Klijent",
      "lightbox.year": "Godina",
      "lightbox.role": "Uloga",
      "lightbox.tools": "Alati"
    },

    en: {
      "meta.title": "Dora Cvetković — graphic design and visual identities",
      "meta.description":
        "Portfolio of Dora Cvetković, MSc in Graphic Technology: visual identities, prepress and social media visuals.",

      "a11y.skip": "Skip to content",
      "nav.aria": "Main navigation",
      "nav.toggle": "Menu",
      "nav.work": "Work",
      "nav.about": "About",
      "nav.contact": "Contact",
      "lang.aria": "Page language",
      "lang.hr": "Croatian",
      "lang.en": "English",

      "hero.eyebrow": "Portfolio",
      "hero.role": "Graphic design and visual communication",
      "hero.intro":
        "MSc in Graphic Technology. I work on visual identities, prepress and visuals for digital channels — with a background in complex business systems and process coordination, so a project gets finished, not just mocked up.",
      "hero.ctaWork": "See the work",
      "hero.ctaContact": "Get in touch",

      "work.eyebrow": "Work",
      "work.title": "Selected projects",
      "work.note":
        "Work in progress — placeholder visuals are shown until the real projects are added.",
      "work.filterAria": "Filter work by category",
      "work.empty": "No projects in this category.",
      "work.open": "Open project",

      "about.eyebrow": "About",
      "about.title": "Design that understands production",
      "about.portraitAlt": "Portrait — photo placeholder",
      "about.p1":
        "Creative and analytical in equal measure, collaborative, and exacting about quality and detail. Studying graphic technology gave me what design education often skips: how a file actually becomes a printed product.",
      "about.p2":
        "During an Erasmus term at Sapienza in Rome I worked on design thinking, service and interaction design — focused on user experience and teamwork on international projects.",
      "about.education": "Education",
      "about.experience": "Experience",
      "about.languages": "Languages",
      "about.cv": "Download CV (PDF)",

      "contact.eyebrow": "Contact",
      "contact.title": "Contact",
      "contact.lead": "Open to collaborations and new projects.",
      "contact.mailAria": "Send an email",
      "contact.location": "Zagreb, Croatia",
      "contact.linksTitle": "Profiles",
      "contact.linksEmpty": "Profile links coming soon.",

      "footer.rights": "All rights reserved.",
      "footer.top": "Back to top",

      "lightbox.aria": "Project viewer",
      "lightbox.close": "Close",
      "lightbox.prev": "Previous image",
      "lightbox.next": "Next image",
      "lightbox.client": "Client",
      "lightbox.year": "Year",
      "lightbox.role": "Role",
      "lightbox.tools": "Tools"
    }
  };

  var locale = DEFAULT;

  function t(key) {
    var table = I18N[locale] || I18N[DEFAULT];
    if (Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    if (Object.prototype.hasOwnProperty.call(I18N[DEFAULT], key)) return I18N[DEFAULT][key];
    return key;
  }

  /* Pick the right half of a { hr, en } pair; pass plain strings through. */
  function pick(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[locale] || value[DEFAULT] || "";
  }

  function detect() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && I18N[stored]) return stored;
    } catch (err) {
      /* private mode / storage disabled — fall through to the browser hint */
    }
    var nav = (navigator.language || "").slice(0, 2).toLowerCase();
    return I18N[nav] ? nav : DEFAULT;
  }

  function applyLocale(next, options) {
    if (!I18N[next]) next = DEFAULT;
    locale = next;

    document.documentElement.lang = locale;

    if (!options || options.persist !== false) {
      try {
        localStorage.setItem(STORAGE_KEY, locale);
      } catch (err) {
        /* nothing to do — the toggle still works for this visit */
      }
    }

    document.title = t("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    /* data-i18n-attr="alt:about.portraitAlt aria-label:nav.aria" */
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(/\s+/).forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length === 2) el.setAttribute(bits[0], t(bits[1]));
      });
    });

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-btn") === locale));
    });

    document.dispatchEvent(new CustomEvent("localechange", { detail: { locale: locale } }));
  }

  window.I18n = {
    t: t,
    pick: pick,
    detect: detect,
    apply: applyLocale,
    get current() {
      return locale;
    }
  };
})();
