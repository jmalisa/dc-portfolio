/*
 * Accessible project lightbox: focus trap, Esc to close, arrow keys to page
 * through images, backdrop click to close, focus returned to the card.
 */
(function () {
  "use strict";

  var SITE = window.SITE;
  var I18n = window.I18n;

  var root = document.getElementById("lightbox");
  if (!root) return;

  var titleEl = root.querySelector("[data-lb-title]");
  var metaEl = root.querySelector("[data-lb-meta]");
  var summaryEl = root.querySelector("[data-lb-summary]");
  var stageEl = root.querySelector("[data-lb-stage]");
  var counterEl = root.querySelector("[data-lb-counter]");
  var navEl = root.querySelector("[data-lb-nav]");
  var closeBtn = root.querySelector("[data-lb-close]");
  var prevBtn = root.querySelector("[data-lb-prev]");
  var nextBtn = root.querySelector("[data-lb-next]");

  var current = null;
  var index = 0;
  var lastFocused = null;

  var FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

  function meta(project) {
    var bits = [I18n.pick(project.client), project.year, I18n.pick(project.role)];
    if (project.tools && project.tools.length) bits.push(project.tools.join(", "));
    return bits.filter(Boolean).join(" · ");
  }

  function paint() {
    if (!current) return;
    var image = current.images[index];

    titleEl.textContent = I18n.pick(current.title);
    metaEl.textContent = meta(current);
    summaryEl.textContent = I18n.pick(current.summary);

    stageEl.textContent = "";
    var img = document.createElement("img");
    img.src = image.src;
    img.alt = I18n.pick(image.alt);
    stageEl.appendChild(img);

    var many = current.images.length > 1;
    navEl.hidden = !many;
    counterEl.textContent = index + 1 + " / " + current.images.length;
  }

  function open(projectId, trigger) {
    current = SITE.projects.filter(function (p) {
      return p.id === projectId;
    })[0];
    if (!current) return;

    index = 0;
    lastFocused = trigger || document.activeElement;
    paint();

    root.dataset.open = "true";
    root.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    var projectId = current ? current.id : null;

    root.dataset.open = "false";
    root.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    current = null;

    /*
     * The grid is re-rendered on a locale change, so the card we came from may
     * have been replaced while the dialog was open. Fall back to its successor
     * rather than dropping focus on the body.
     */
    var target = lastFocused && document.contains(lastFocused) ? lastFocused : null;
    if (!target && projectId) {
      target = document.querySelector('[data-project-id="' + projectId + '"]');
    }
    if (target) target.focus();
  }

  function step(delta) {
    if (!current || current.images.length < 2) return;
    index = (index + delta + current.images.length) % current.images.length;
    paint();
  }

  function trapFocus(event) {
    var items = Array.prototype.slice.call(root.querySelectorAll(FOCUSABLE)).filter(function (node) {
      return node.offsetParent !== null;
    });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("click", function (event) {
    var card = event.target.closest("[data-project-id]");
    if (card) open(card.dataset.projectId, card);
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () {
    step(-1);
  });
  nextBtn.addEventListener("click", function () {
    step(1);
  });

  root.addEventListener("click", function (event) {
    if (event.target === root) close();
  });

  document.addEventListener("keydown", function (event) {
    if (root.dataset.open !== "true") return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowRight") {
      step(1);
    } else if (event.key === "ArrowLeft") {
      step(-1);
    } else if (event.key === "Tab") {
      trapFocus(event);
    }
  });

  /* Keep the open dialog in sync when the visitor flips language mid-view. */
  document.addEventListener("localechange", paint);
})();
