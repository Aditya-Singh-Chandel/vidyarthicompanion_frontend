/* =============================================================
   AURELIA — shared interaction layer
   Sticky nav, scroll reveal, parallax, off-canvas panels,
   modals, theme switching, page-transition curtain, skeletons.
   ============================================================= */
(function () {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- THEME (day / night) shared across pages ---------------- */
  const THEME_KEY = "aurelia-theme";
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    $$("[data-theme-swatch]").forEach((el) =>
      el.classList.toggle("is-active", el.dataset.themeSwatch === theme)
    );
    $$("[data-theme-toggle-icon]").forEach((el) => {
      el.dataset.themeToggleIcon = theme;
    });
  }
  function initTheme() {
    let saved = "day";
    try { saved = localStorage.getItem(THEME_KEY) || "day"; } catch (e) {}
    applyTheme(saved);
  }
  window.AureliaTheme = { apply: applyTheme, get: () => document.documentElement.getAttribute("data-theme") };

  /* ---------------- STICKY NAV + SCROLL PROGRESS ---------------- */
  function initNav() {
    const nav = $(".nav");
    const progress = $(".scroll-progress");
    const onScroll = () => {
      const y = window.scrollY;
      if (nav) nav.classList.toggle("is-stuck", y > 40);
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- SCROLL REVEAL (IntersectionObserver) ---------------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------------- PARALLAX (hero scene layers + floats) ---------------- */
  function initParallax() {
    if (prefersReduced) return;
    const layers = $$("[data-parallax]");
    if (!layers.length) return;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      layers.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } },
      { passive: true }
    );

    // pointer-based subtle parallax on hero
    const hero = $(".hero");
    if (hero) {
      hero.addEventListener("pointermove", (e) => {
        const rx = (e.clientX / window.innerWidth - 0.5);
        const ry = (e.clientY / window.innerHeight - 0.5);
        $$("[data-tilt]", hero).forEach((el) => {
          const d = parseFloat(el.dataset.tilt) || 10;
          el.style.transform = `translate3d(${rx * d}px, ${ry * d}px, 0)`;
        });
      });
    }
  }

  /* ---------------- OFF-CANVAS PANELS & MODALS ---------------- */
  let lastFocused = null;
  function openOverlay(el) {
    if (!el) return;
    lastFocused = document.activeElement;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    const scrim = $('[data-scrim]');
    if (scrim) scrim.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const focusable = el.querySelector("input, button, a, textarea, select");
    if (focusable) setTimeout(() => focusable.focus(), 80);
  }
  function closeOverlays() {
    $$(".panel.is-open, .modal.is-open").forEach((el) => {
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
    });
    const scrim = $('[data-scrim]');
    if (scrim) scrim.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  window.Aurelia = window.Aurelia || {};
  window.Aurelia.openOverlay = (sel) => openOverlay($(sel));
  window.Aurelia.closeOverlays = closeOverlays;

  function initOverlays() {
    $$("[data-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openOverlay($(btn.dataset.open));
      });
    });
    $$("[data-close]").forEach((btn) => btn.addEventListener("click", closeOverlays));
    const scrim = $('[data-scrim]');
    if (scrim) scrim.addEventListener("click", closeOverlays);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeOverlays();
    });
  }

  /* ---------------- THEME CONTROLS ---------------- */
  function initThemeControls() {
    $$("[data-theme-swatch]").forEach((el) =>
      el.addEventListener("click", () => applyTheme(el.dataset.themeSwatch))
    );
    $$("[data-theme-cycle]").forEach((el) =>
      el.addEventListener("click", () => {
        const next = window.AureliaTheme.get() === "day" ? "night" : "day";
        applyTheme(next);
      })
    );
  }

  /* ---------------- PROGRESS RINGS / BARS / CHARTS reveal ---------------- */
  function initMeters() {
    const setRing = (ring) => {
      const p = parseFloat(ring.dataset.ring) || 0;
      const bar = ring.querySelector(".ring__bar");
      const C = 326.7; // 2*pi*52
      if (bar) bar.style.strokeDashoffset = C - (C * p) / 100;
      const v = ring.querySelector(".ring__label .v");
      if (v && !v.dataset.done) {
        v.dataset.done = "1";
        animateCount(v, p, v.dataset.suffix || "%");
      }
    };
    const setBar = (bar) => {
      const fill = bar.querySelector(".progress__fill");
      if (fill) fill.style.width = (bar.dataset.progress || 0) + "%";
    };
    const setChart = (chart) => {
      $$(".chart__bar", chart).forEach((b) => { b.style.height = (b.dataset.value || 10) + "%"; });
    };

    if (prefersReduced || !("IntersectionObserver" in window)) {
      $$("[data-ring]").forEach(setRing);
      $$("[data-progress]").forEach(setBar);
      $$(".chart").forEach(setChart);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const t = e.target;
        if (t.hasAttribute("data-ring")) setRing(t);
        if (t.hasAttribute("data-progress")) setBar(t);
        if (t.classList.contains("chart")) setChart(t);
        io.unobserve(t);
      });
    }, { threshold: 0.4 });
    $$("[data-ring], [data-progress], .chart").forEach((el) => io.observe(el));
  }

  function animateCount(el, target, suffix) {
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const dur = 1200; const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target, parseFloat(e.target.dataset.count), e.target.dataset.suffix || "");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------- SKELETON -> CONTENT (simulated load) ---------------- */
  function initSkeletons() {
    const groups = $$("[data-skeleton]");
    groups.forEach((g) => {
      const delay = parseInt(g.dataset.skeleton, 10) || 1100;
      setTimeout(() => {
        g.querySelectorAll("[data-skel]").forEach((s) => (s.style.display = "none"));
        g.querySelectorAll("[data-real]").forEach((r) => {
          r.style.display = "";
          requestAnimationFrame(() => r.classList.add("is-visible"));
        });
      }, prefersReduced ? 0 : delay);
    });
  }

  /* ---------------- PAGE TRANSITION CURTAIN ---------------- */
  function initPageTransitions() {
    const curtain = $(".curtain");
    if (!curtain || prefersReduced) return;
    // intro
    requestAnimationFrame(() => curtain.classList.add("is-in"));
    setTimeout(() => curtain.classList.remove("is-in"), 600);

    // outro on internal nav links
    $$("a[data-transition]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href.startsWith("#") || a.target === "_blank") return;
        e.preventDefault();
        curtain.classList.add("is-out");
        setTimeout(() => (window.location.href = href), 520);
      });
    });
  }

  /* ---------------- SEGMENTED CONTROLS ---------------- */
  function initSegments() {
    $$(".segment").forEach((seg) => {
      seg.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        $$("button", seg).forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const t = seg.dataset.segmentTarget;
        if (t && btn.dataset.value) {
          const out = $(t);
          if (out) out.textContent = btn.dataset.value;
        }
      });
    });
  }

  /* ---------------- RANGE LIVE OUTPUT ---------------- */
  function initRanges() {
    $$("input.range[data-output]").forEach((r) => {
      const out = $(r.dataset.output);
      const sync = () => { if (out) out.textContent = r.value + (r.dataset.unit || ""); };
      r.addEventListener("input", sync);
      sync();
    });
  }

  /* ---------------- TOAST ---------------- */
  function toast(msg) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg><span></span>';
      document.body.appendChild(t);
    }
    t.querySelector("span").textContent = msg;
    t.classList.add("is-show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("is-show"), 2800);
  }
  window.Aurelia.toast = toast;

  /* ---------------- FORM DEMO HANDLING ---------------- */
  function initForms() {
    $$("[data-demo-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        if (btn) {
          const orig = btn.innerHTML;
          btn.disabled = true;
          btn.innerHTML = "Sending\u2026";
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = orig;
            toast(form.dataset.demoForm || "Saved successfully");
            closeOverlays();
            form.reset();
          }, 1100);
        }
      });
    });
  }

  /* ---------------- ITINERARY add (dashboard interactivity) ---------------- */
  function initItinerary() {
    const addBtn = $("[data-add-iti]");
    const list = $("[data-iti-list]");
    if (!addBtn || !list) return;
    let day = list.children.length + 1;
    const places = [
      ["Cliffside Citadel", "Sunrise walk + guided history tour"],
      ["The Lower Falls", "Cascade viewpoint & photography"],
      ["Amber Valley Mess", "Heritage tasting dinner"],
      ["Old Aqueduct Trail", "3 km ridge hike, moderate"],
      ["Lantern Night Market", "Local crafts & live folk music"],
    ];
    addBtn.addEventListener("click", () => {
      const pick = places[(day - 1) % places.length];
      const el = document.createElement("div");
      el.className = "iti";
      el.innerHTML =
        '<div class="iti__day">D' + day + '</div>' +
        '<div class="iti__body"><strong>' + pick[0] + "</strong><p>" + pick[1] + "</p></div>" +
        '<button class="iti__drag" aria-label="remove" data-remove-iti><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>';
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      list.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transition = "opacity .4s ease, transform .4s ease";
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      day++;
      updateItiCount();
      toast("Added to itinerary");
    });
    list.addEventListener("click", (e) => {
      const rm = e.target.closest("[data-remove-iti]");
      if (!rm) return;
      const row = rm.closest(".iti");
      row.style.transition = "opacity .3s ease, transform .3s ease";
      row.style.opacity = "0";
      row.style.transform = "translateX(20px)";
      setTimeout(() => { row.remove(); updateItiCount(); }, 300);
    });
    function updateItiCount() {
      const c = $("[data-iti-count]");
      if (c) c.textContent = list.children.length;
    }
  }

  /* ---------------- ACTIVE NAV LINK by path ---------------- */
  function initActiveLink() {
    const path = location.pathname.split("/").pop() || "index.html";
    $$(".nav__link, .menu-link").forEach((a) => {
      const href = (a.getAttribute("href") || "").split("/").pop();
      if (href === path) a.classList.add("is-active");
    });
  }

  /* ---------------- INIT ---------------- */
  function init() {
    initTheme();
    initNav();
    initActiveLink();
    initReveal();
    initParallax();
    initOverlays();
    initThemeControls();
    initMeters();
    initCounters();
    initSkeletons();
    initPageTransitions();
    initSegments();
    initRanges();
    initForms();
    initItinerary();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
