/* ============================================================
   VetScan analytics.js — GA4 events + consent integration

   Hooks into the EXISTING .cookie-banner element on the page:
   - Reads `vetscan_consent` cookie (legacy storage already in use)
   - Wires .cookie-btn-primary (Accept) and .cookie-btn-secondary (Reject)
     via CLASS selectors so it works on every locale
     (the original inline JS uses localized IDs and breaks on uk/ru/es/pt)
   - Applies gtag Consent Mode on choice and on subsequent visits
   - Tracks consent_choice + page-level events
   ============================================================ */
(function () {
  'use strict';

  // ----- Locale detection (mirrors i18n.js) -----
  function detectLocale() {
    var p = window.location.pathname;
    if (p.indexOf('/es-mx') === 0) return 'es-mx';
    if (p.indexOf('/es-ar') === 0) return 'es-ar';
    if (p.indexOf('/pt-BR') === 0) return 'pt-BR';
    if (p.indexOf('/uk') === 0) return 'uk';
    if (p.indexOf('/ru') === 0) return 'ru';
    return 'en';
  }
  var LOCALE = detectLocale();

  // ----- Track helper -----
  function track(name, params) {
    if (typeof gtag === 'function') {
      var p = Object.assign({ locale: LOCALE }, params || {});
      gtag('event', name, p);
    }
  }
  window.vsTrack = track;

  // ============================================================
  // CONSENT
  // ============================================================

  var COOKIE_NAME = 'vetscan_consent';

  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, value) {
    var expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = name + '=' + encodeURIComponent(value) +
      '; expires=' + expires.toUTCString() + '; path=/; SameSite=Lax';
  }

  function applyConsent(state) {
    if (typeof gtag !== 'function') return;
    if (state === 'granted') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    } else {
      gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  }

  function hideBanner(banner) {
    banner.classList.remove('visible');
    setTimeout(function () { banner.style.display = 'none'; }, 400);
  }

  function setupConsent() {
    var banner = document.getElementById('cookieBanner');

    // Apply stored choice on every page load (gtag default is 'denied' from <head>)
    var existing = getCookie(COOKIE_NAME);
    if (existing === 'accepted') applyConsent('granted');
    // 'rejected' or null → stay at default denied

    if (!banner) return;

    // If choice already made, hide banner defensively (inline JS already does this on EN)
    if (existing) {
      banner.style.display = 'none';
      return;
    }

    // Wire buttons via CLASS selectors (locale-agnostic — fixes the inline JS bug
    // where uk/ru/es/pt have translated IDs that getElementById can't find)
    var acceptBtn = banner.querySelector('.cookie-btn-primary');
    var rejectBtn = banner.querySelector('.cookie-btn-secondary');

    if (acceptBtn && !acceptBtn._vsHooked) {
      acceptBtn._vsHooked = true;
      acceptBtn.addEventListener('click', function () {
        setCookie(COOKIE_NAME, 'accepted');
        applyConsent('granted');
        track('consent_choice', { choice: 'granted' });
        hideBanner(banner);
      });
    }
    if (rejectBtn && !rejectBtn._vsHooked) {
      rejectBtn._vsHooked = true;
      rejectBtn.addEventListener('click', function () {
        setCookie(COOKIE_NAME, 'rejected');
        // stay denied
        track('consent_choice', { choice: 'denied' });
        hideBanner(banner);
      });
    }
  }

  // ============================================================
  // EVENT WIRING
  // ============================================================

  function wireEvents() {
    document.addEventListener('click', function (e) {
      if (!e.target || !e.target.closest) return;

      // Coming-soon store buttons (App Store / Google Play)
      var btn = e.target.closest('.store-btn');
      if (btn) {
        var href = btn.getAttribute('href') || '';
        var store = href.indexOf('apple.com') !== -1 ? 'ios' :
                    href.indexOf('google.com') !== -1 ? 'android' : 'unknown';
        track('coming_soon_click', { store: store });
      }

      // Interactive demo flow
      if (e.target.closest('#demoNext1')) track('demo_started');
      if (e.target.closest('#demoNext2')) track('demo_completed');

      // Generic data-track attribute on any element
      var trackEl = e.target.closest('[data-track]');
      if (trackEl) {
        var name = trackEl.getAttribute('data-track');
        if (name) track(name);
      }
    });

    // Wrap language switcher to track choice
    if (typeof window.VetScanSwitchLang === 'function' && !window._vsLangWrapped) {
      var orig = window.VetScanSwitchLang;
      window.VetScanSwitchLang = function (target) {
        track('language_switched', { from: LOCALE, to: target });
        return orig.apply(this, arguments);
      };
      window._vsLangWrapped = true;
    }
  }

  // ============================================================
  // INIT
  // ============================================================

  function init() {
    setupConsent();
    wireEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
