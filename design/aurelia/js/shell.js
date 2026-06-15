/* =============================================================
   AURELIA — shared application shell
   Injects the SAME navbar, off-canvas menus, contact/settings
   panels, booking modal and footer into every page so the whole
   site is one consistent ecosystem (single source of truth).
   ============================================================= */
(function () {
  "use strict";

  // ---- icon set (inline SVG, stroke uses currentColor) ----
  const I = {
    compass:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.2"/><polygon points="16.2 7.8 13.4 13.4 7.8 16.2 10.6 10.6" fill="currentColor" stroke="none"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="15" y2="17"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
    settings:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 7 2.6 1.6 1.6 0 0 0 8 1.1V1a2 2 0 0 1 4 0v.1A1.6 1.6 0 0 0 14.9 2.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4.4"/><line x1="12" y1="2" x2="12" y2="4.4"/><line x1="12" y1="19.6" x2="12" y2="22"/><line x1="2" y1="12" x2="4.4" y2="12"/><line x1="19.6" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.6" y2="6.6"/><line x1="17.4" y1="17.4" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.6" y2="17.4"/><line x1="17.4" y1="6.6" x2="19.1" y2="4.9"/></svg>',
  };
  window.AureliaIcons = I;

  const NAV_LINKS = [
    { href: "index.html", label: "Home", n: "01" },
    { href: "atlas.html", label: "The Atlas", n: "02" },
    { href: "planner.html", label: "Planner", n: "03" },
  ];

  function navMarkup() {
    const links = NAV_LINKS.map(
      (l) => `<a class="nav__link" href="${l.href}" data-transition>${l.label}</a>`
    ).join("");
    return `
    <div class="scroll-progress"></div>
    <div class="curtain" aria-hidden="true"><div class="curtain__logo">${I.compass}</div></div>
    <header class="nav" id="nav">
      <div class="nav__inner">
        <a class="brand" href="index.html" data-transition aria-label="Aurelia home">
          <span class="brand__mark">${I.compass}</span>
          <span>Aurelia<small>Heritage Studio</small></span>
        </a>
        <nav class="nav__links" aria-label="Primary">${links}</nav>
        <div class="nav__actions">
          <button class="icon-btn" data-theme-cycle aria-label="Toggle day / night theme" title="Toggle theme">${I.sun}</button>
          <button class="icon-btn" data-open="#settingsPanel" aria-label="Open settings">${I.settings}</button>
          <a class="btn btn--primary btn--sm" data-open="#bookingModal" href="#book"><span class="nav__cta-text">Plan a visit</span>${I.arrow}</a>
          <button class="icon-btn nav__burger" data-open="#menuPanel" aria-label="Open menu">${I.menu}</button>
        </div>
      </div>
    </header>`;
  }

  function overlaysMarkup() {
    const bigLinks = NAV_LINKS.concat([{ href: "atlas.html", label: "Journal", n: "04" }])
      .map((l) => `<a class="menu-link" href="${l.href}" data-transition data-close>${l.label}<span>${l.n}</span></a>`)
      .join("");
    return `
    <div class="scrim" data-scrim></div>

    <!-- OFF-CANVAS NAV (left) -->
    <aside class="panel panel--left" id="menuPanel" aria-hidden="true" aria-label="Navigation menu">
      <div class="panel__head">
        <span class="panel__title">Explore</span>
        <button class="panel__close" data-close aria-label="Close menu">${I.close}</button>
      </div>
      <div class="panel__body">
        <nav>${bigLinks}</nav>
        <div style="margin-top:var(--s-7)">
          <p class="eyebrow">Get in touch</p>
          <p class="muted" style="margin-top:var(--s-3)">Studio of immersive heritage &amp; landscape experiences.</p>
          <button class="btn btn--ghost btn--sm" data-open="#contactPanel" style="margin-top:var(--s-4)">${I.mail} Contact us</button>
        </div>
      </div>
    </aside>

    <!-- CONTACT PANEL (right) -->
    <aside class="panel" id="contactPanel" aria-hidden="true" aria-label="Contact">
      <div class="panel__head">
        <span class="panel__title">Say hello</span>
        <button class="panel__close" data-close aria-label="Close">${I.close}</button>
      </div>
      <div class="panel__body">
        <p class="muted" style="margin-bottom:var(--s-5)">Tell us about the journey you have in mind. We usually reply within a day.</p>
        <form class="flow" data-demo-form="Message sent — we'll be in touch">
          <div class="field"><label for="cn">Name</label><input class="input" id="cn" placeholder="Your name" required></div>
          <div class="field"><label for="ce">Email</label><input class="input" id="ce" type="email" placeholder="you@email.com" required></div>
          <div class="field"><label for="cm">Message</label><textarea class="textarea" id="cm" placeholder="Where would you like to wander?"></textarea></div>
          <button class="btn btn--primary btn--block" type="submit">Send message ${I.arrow}</button>
        </form>
      </div>
    </aside>

    <!-- SETTINGS PANEL (right) -->
    <aside class="panel" id="settingsPanel" aria-hidden="true" aria-label="Settings">
      <div class="panel__head">
        <span class="panel__title">Settings</span>
        <button class="panel__close" data-close aria-label="Close">${I.close}</button>
      </div>
      <div class="panel__body">
        <p class="eyebrow">Appearance</p>
        <div class="theme-picker" style="margin:var(--s-3) 0 var(--s-5)">
          <button class="theme-swatch" data-theme-swatch="day">
            <span class="dots"><i style="background:#ebd7ae"></i><i style="background:#1b3a34"></i><i style="background:#c2702f"></i></span>
            <span>Daybreak</span>
          </button>
          <button class="theme-swatch" data-theme-swatch="night">
            <span class="dots"><i style="background:#0b1626"></i><i style="background:#1d3a63"></i><i style="background:#d98a45"></i></span>
            <span>Cinematic</span>
          </button>
        </div>
        <div class="setting-row">
          <div class="label"><strong>Reduced motion</strong><span>Calmer transitions</span></div>
          <label class="toggle"><input type="checkbox"><span class="toggle__track"></span></label>
        </div>
        <div class="setting-row">
          <div class="label"><strong>Email digest</strong><span>New destinations weekly</span></div>
          <label class="toggle"><input type="checkbox" checked><span class="toggle__track"></span></label>
        </div>
        <div class="setting-row">
          <div class="label"><strong>Metric units</strong><span>Distances in km</span></div>
          <label class="toggle"><input type="checkbox" checked><span class="toggle__track"></span></label>
        </div>
      </div>
    </aside>

    <!-- BOOKING MODAL -->
    <div class="modal" id="bookingModal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Plan a visit">
      <div class="modal__card">
        <button class="panel__close" data-close aria-label="Close" style="position:absolute;top:var(--s-4);right:var(--s-4)">${I.close}</button>
        <p class="eyebrow">Plan a visit</p>
        <h3 style="margin:var(--s-3) 0 var(--s-2)">Begin your expedition</h3>
        <p class="muted" style="margin-bottom:var(--s-5)">Reserve a curated heritage journey. No payment required to hold a date.</p>
        <form class="flow" data-demo-form="Expedition request received">
          <div class="grid" style="grid-template-columns:1fr 1fr">
            <div class="field"><label for="bd">Destination</label>
              <select class="select" id="bd">
                <option>Cliffside Citadel</option><option>Amber Valley</option>
                <option>The Lower Falls</option><option>Old Aqueduct Trail</option>
              </select>
            </div>
            <div class="field"><label for="bdate">Start date</label><input class="input" id="bdate" type="date"></div>
          </div>
          <div class="field"><label for="bg">Travellers</label><input class="input" id="bg" type="number" min="1" value="2"></div>
          <button class="btn btn--primary btn--block" type="submit">Request expedition ${I.arrow}</button>
        </form>
      </div>
    </div>`;
  }

  function footerMarkup() {
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <a class="brand" href="index.html" data-transition style="color:var(--cream-100)">
              <span class="brand__mark">${I.compass}</span>
              <span>Aurelia<small style="color:rgba(243,230,204,.5)">Heritage Studio</small></span>
            </a>
            <p>Crafting immersive heritage &amp; landscape journeys — where architecture meets the horizon.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="index.html" data-transition>Home</a><br>
            <a href="atlas.html" data-transition>The Atlas</a><br>
            <a href="planner.html" data-transition>Planner</a>
          </div>
          <div>
            <h4>Studio</h4>
            <a href="#" data-open="#contactPanel">Contact</a><br>
            <a href="#">Our story</a><br>
            <a href="#">Journal</a>
          </div>
          <div>
            <h4>Stay in touch</h4>
            <a href="#">Instagram</a><br>
            <a href="#">Newsletter</a><br>
            <a href="#">Press kit</a>
          </div>
        </div>
        <div class="footer__bottom">
          <span>&copy; ${new Date().getFullYear()} Aurelia Heritage Studio. Crafted for the horizon.</span>
          <span>Designed &amp; built as a design-system showcase.</span>
        </div>
      </div>
    </footer>`;
  }

  window.AureliaShell = {
    render() {
      document.body.insertAdjacentHTML("afterbegin", navMarkup());
      const footerSlot = document.querySelector("[data-footer]");
      if (footerSlot) footerSlot.outerHTML = footerMarkup();
      document.body.insertAdjacentHTML("beforeend", overlaysMarkup());
    },
  };

  // render immediately so app.js can wire everything up
  if (document.body) {
    window.AureliaShell.render();
  } else {
    document.addEventListener("DOMContentLoaded", window.AureliaShell.render);
  }
})();
