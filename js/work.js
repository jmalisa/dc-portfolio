/*
 * Renders the work grid and the About/Experience lists from window.SITE,
 * and drives the category filter. Re-renders on every locale change.
 */
(function () {
  "use strict";

  var SITE = window.SITE;
  var I18n = window.I18n;

  var grid = document.getElementById("work-grid");
  var filters = document.getElementById("work-filters");
  var empty = document.getElementById("work-empty");

  var activeCategory = "all";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /* ---------- Work grid ---------- */

  function renderFilters() {
    if (!filters) return;
    filters.textContent = "";
    SITE.categories.forEach(function (cat) {
      var btn = el("button", "chip", I18n.pick(cat.label));
      btn.type = "button";
      btn.dataset.category = cat.id;
      btn.setAttribute("aria-pressed", String(cat.id === activeCategory));
      filters.appendChild(btn);
    });
  }

  function buildCard(project) {
    var card = el("button", "card reveal");
    card.type = "button";
    card.dataset.projectId = project.id;
    if (project.placeholder) card.dataset.placeholder = "true";
    card.setAttribute("aria-label", I18n.t("work.open") + ": " + I18n.pick(project.title));

    var media = el("div", "card__media");
    if (project.ratio) media.style.setProperty("--card-ratio", project.ratio);

    var img = el("img", "card__img");
    img.src = project.cover;
    img.alt = I18n.pick(project.coverAlt);
    img.loading = "lazy";
    img.decoding = "async";
    media.appendChild(img);

    var category = SITE.categories.filter(function (c) {
      return c.id === project.category;
    })[0];
    if (category) media.appendChild(el("span", "card__badge", I18n.pick(category.label)));

    var body = el("div", "card__body");
    body.appendChild(el("h3", "card__title", I18n.pick(project.title)));
    body.appendChild(el("p", "card__meta", I18n.pick(project.client) + " · " + project.year));
    body.appendChild(el("p", "card__summary", I18n.pick(project.summary)));

    card.appendChild(media);
    card.appendChild(body);
    return card;
  }

  function renderGrid() {
    if (!grid) return;
    grid.textContent = "";

    var visible = SITE.projects.filter(function (p) {
      return activeCategory === "all" || p.category === activeCategory;
    });

    visible.forEach(function (project) {
      grid.appendChild(buildCard(project));
    });

    if (empty) {
      empty.hidden = visible.length > 0;
      empty.textContent = I18n.t("work.empty");
    }

    document.dispatchEvent(new CustomEvent("gridrendered"));
  }

  /* ---------- About / experience lists ---------- */

  function renderEntries(containerId, entries) {
    var host = document.getElementById(containerId);
    if (!host) return;
    host.textContent = "";
    entries.forEach(function (item) {
      var entry = el("div", "entry");
      entry.appendChild(el("p", "entry__role", I18n.pick(item.role)));
      entry.appendChild(el("p", "entry__org", I18n.pick(item.org)));
      entry.appendChild(el("p", "entry__when", I18n.pick(item.when)));
      if (item.note) entry.appendChild(el("p", "block__note", I18n.pick(item.note)));
      host.appendChild(entry);
    });
  }

  function renderSkills() {
    var host = document.getElementById("skills");
    if (!host) return;
    host.textContent = "";
    SITE.skills.forEach(function (group) {
      var block = el("div", "block");
      block.appendChild(el("h3", "block__title", I18n.pick(group.title)));
      var list = el("ul", "block__list");
      group.items.forEach(function (item) {
        list.appendChild(el("li", null, I18n.pick(item)));
      });
      block.appendChild(list);
      host.appendChild(block);
    });
  }

  function renderLanguages() {
    var host = document.getElementById("languages");
    if (!host) return;
    host.textContent = "";
    SITE.languages.forEach(function (lang) {
      host.appendChild(el("li", null, I18n.pick(lang)));
    });
  }

  /* ---------- Contact ---------- */

  function renderContact() {
    var mail = document.getElementById("contact-mail");
    if (mail) {
      var address = SITE.email.user + "@" + SITE.email.domain;
      mail.href = "mailto:" + address;
      mail.textContent = address;
    }

    var host = document.getElementById("contact-links");
    if (!host) return;
    host.textContent = "";
    var withHref = SITE.links.filter(function (link) {
      return link.href;
    });
    if (!withHref.length) {
      host.appendChild(el("p", "block__note", I18n.t("contact.linksEmpty")));
      return;
    }
    withHref.forEach(function (link) {
      var a = el("a", null, link.label);
      a.href = link.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      host.appendChild(a);
    });
  }

  function renderAll() {
    renderFilters();
    renderGrid();
    renderEntries("education", SITE.education);
    renderEntries("experience", SITE.experience);
    renderSkills();
    renderLanguages();
    renderContact();
  }

  if (filters) {
    filters.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-category]");
      if (!btn) return;
      activeCategory = btn.dataset.category;
      filters.querySelectorAll("[data-category]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.category === activeCategory));
      });
      renderGrid();
    });
  }

  document.addEventListener("localechange", renderAll);

  window.Work = { renderAll: renderAll };
})();
