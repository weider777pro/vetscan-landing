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

  // ============================================================
  // LEGAL REVIEW STATUS — auto-hide translation disclaimer banner
  // ============================================================
  // After a local lawyer signs off on the translated legal pages
  // (privacy/terms/disclaimer/cookies/security/accessibility) for a given
  // locale, add the locale code to this list. The yellow translation banner
  // on Tier 3 legal pages will automatically be hidden for that locale.
  //
  // See docs/LEGAL_REVIEW.md for the per-jurisdiction sign-off checklist.
  //
  // Example after Brazilian lawyer approval:
  //   var LEGAL_REVIEWED_LOCALES = ['pt-BR'];
  //
  // (en is implicitly the source-of-truth and never has the banner.)
  var LEGAL_REVIEWED_LOCALES = [];

  function hideTranslationBannerIfReviewed() {
    if (LEGAL_REVIEWED_LOCALES.indexOf(LOCALE) === -1) return;
    var banner = document.querySelector('[aria-label="Translation disclaimer"]');
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
  }

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

  // ----- Localized banner strings -----
  var BANNER_STRINGS = {
    'en':    { title: 'We use cookies',         body: 'For analytics and to improve your experience. See our ', link: 'Cookie Policy', accept: 'Accept', reject: 'Reject', aria: 'Cookie consent' },
    'uk':    { title: 'Ми використовуємо cookies', body: 'Для аналітики та покращення досвіду. Дивіться нашу ',  link: 'Політику cookies', accept: 'Прийняти', reject: 'Відхилити', aria: 'Згода на cookies' },
    'ru':    { title: 'Мы используем cookies',  body: 'Для аналитики и улучшения опыта. Смотрите нашу ',         link: 'Политику cookies', accept: 'Принять', reject: 'Отклонить', aria: 'Согласие на cookies' },
    'es-mx': { title: 'Usamos cookies',         body: 'Para análisis y mejorar tu experiencia. Ver nuestra ',    link: 'Política de cookies', accept: 'Aceptar', reject: 'Rechazar', aria: 'Consentimiento de cookies' },
    'es-ar': { title: 'Usamos cookies',         body: 'Para análisis y mejorar tu experiencia. Mirá nuestra ',   link: 'Política de cookies', accept: 'Aceptar', reject: 'Rechazar', aria: 'Consentimiento de cookies' },
    'pt-BR': { title: 'Usamos cookies',         body: 'Para análises e melhorar sua experiência. Veja nossa ',   link: 'Política de cookies', accept: 'Aceitar', reject: 'Rejeitar', aria: 'Consentimento de cookies' }
  };

  function cookiesPolicyHref() {
    return LOCALE === 'en' ? '/cookies.html' : '/' + LOCALE + '/cookies.html';
  }

  // Inject cookie banner DOM + inline CSS on pages that don't already have one.
  // CSS is inlined to avoid depending on per-page <style> blocks.
  function injectBanner() {
    if (document.getElementById('cookieBanner')) return null; // already exists (e.g. index.html)
    var s = BANNER_STRINGS[LOCALE] || BANNER_STRINGS.en;

    // Inject styles once
    if (!document.getElementById('vsCookieBannerCSS')) {
      var style = document.createElement('style');
      style.id = 'vsCookieBannerCSS';
      style.textContent =
        '.vs-cookie-banner{position:fixed;left:50%;bottom:20px;transform:translateX(-50%) translateY(120%);' +
        'max-width:640px;width:calc(100% - 32px);background:#fff;border:1px solid rgba(10,10,15,0.08);' +
        'border-radius:14px;box-shadow:0 16px 48px rgba(10,10,15,0.18);padding:18px 20px;display:flex;' +
        'gap:14px;align-items:center;z-index:9999;font-family:inherit;color:#0a0a0f;transition:transform .35s ease;}' +
        '.vs-cookie-banner.visible{transform:translateX(-50%) translateY(0);}' +
        '.vs-cookie-banner .vs-cookie-icon{font-size:28px;flex-shrink:0;}' +
        '.vs-cookie-banner .vs-cookie-text{flex:1;font-size:0.92rem;line-height:1.45;}' +
        '.vs-cookie-banner .vs-cookie-text strong{display:block;margin-bottom:2px;font-size:0.95rem;}' +
        '.vs-cookie-banner .vs-cookie-text a{color:#0a0a0f;text-decoration:underline;}' +
        '.vs-cookie-banner .vs-cookie-buttons{display:flex;gap:8px;flex-shrink:0;}' +
        '.vs-cookie-banner .cookie-btn{padding:9px 18px;border-radius:10px;border:0;cursor:pointer;' +
        'font:inherit;font-weight:600;font-size:0.88rem;transition:opacity .2s,transform .2s,background .2s;}' +
        '.vs-cookie-banner .cookie-btn-secondary{background:transparent;color:#0a0a0f;}' +
        '.vs-cookie-banner .cookie-btn-secondary:hover{background:rgba(10,10,15,0.08);}' +
        '.vs-cookie-banner .cookie-btn-primary{background:#0a0a0f;color:#fff;}' +
        '.vs-cookie-banner .cookie-btn-primary:hover{transform:translateY(-1px);opacity:0.92;}' +
        '@media (max-width:600px){.vs-cookie-banner{flex-direction:column;align-items:stretch;gap:10px;padding:14px 16px;bottom:12px;}' +
        '.vs-cookie-banner .vs-cookie-buttons{justify-content:flex-end;}.vs-cookie-banner .cookie-btn{flex:1;padding:11px 12px;}}';
      document.head.appendChild(style);
    }

    // Build banner DOM (use textContent for user-visible strings → no XSS surface even though strings are static)
    var banner = document.createElement('div');
    banner.className = 'vs-cookie-banner cookie-banner';
    banner.id = 'cookieBanner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', s.aria);

    var icon = document.createElement('div');
    icon.className = 'vs-cookie-icon';
    icon.textContent = '🍪';

    var text = document.createElement('div');
    text.className = 'vs-cookie-text';
    var strong = document.createElement('strong');
    strong.textContent = s.title;
    text.appendChild(strong);
    text.appendChild(document.createTextNode(s.body));
    var a = document.createElement('a');
    a.href = cookiesPolicyHref();
    a.textContent = s.link;
    text.appendChild(a);
    text.appendChild(document.createTextNode('.'));

    var buttons = document.createElement('div');
    buttons.className = 'vs-cookie-buttons';
    var rejectBtn = document.createElement('button');
    rejectBtn.className = 'cookie-btn cookie-btn-secondary';
    rejectBtn.type = 'button';
    rejectBtn.textContent = s.reject;
    var acceptBtn = document.createElement('button');
    acceptBtn.className = 'cookie-btn cookie-btn-primary';
    acceptBtn.type = 'button';
    acceptBtn.textContent = s.accept;
    buttons.appendChild(rejectBtn);
    buttons.appendChild(acceptBtn);

    banner.appendChild(icon);
    banner.appendChild(text);
    banner.appendChild(buttons);
    document.body.appendChild(banner);

    // Fade in next tick
    requestAnimationFrame(function () { banner.classList.add('visible'); });
    return banner;
  }

  function setupConsent() {
    // Apply stored choice on every page load (gtag default is 'denied' from <head>)
    var existing = getCookie(COOKIE_NAME);
    if (existing === 'accepted') applyConsent('granted');
    // 'rejected' or null → stay at default denied

    var banner = document.getElementById('cookieBanner');

    // If consent already given/denied, no banner needed at all on any page
    if (existing) {
      if (banner) banner.style.display = 'none';
      return;
    }

    // No prior choice → ensure banner exists on this page (inject if missing)
    if (!banner) banner = injectBanner();
    if (!banner) return;

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
    hideTranslationBannerIfReviewed();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
