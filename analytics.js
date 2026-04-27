/* ============================================================
   VetScan analytics.js — GA4 events + consent banner

   - gtag.js loads from <head> of each HTML page (async)
   - This file: defines events, consent banner, locale tagging
   - Consent Mode v2: default denied → granted only if user accepts
   - Choice persists in localStorage (vs_consent: 'granted'|'denied')

   Loaded as: <script src="/analytics.js" defer></script>
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

  // ----- Safe event helper -----
  function track(name, params) {
    if (typeof gtag === 'function') {
      var p = Object.assign({ locale: LOCALE }, params || {});
      gtag('event', name, p);
    }
  }
  // Expose globally for inline call sites (handleSubmit, etc.)
  window.vsTrack = track;

  // ============================================================
  // CONSENT BANNER
  // ============================================================

  var STORAGE_KEY = 'vs_consent';

  var BANNER_COPY = {
    'en':    { text: "We use cookies to measure how the site performs. No ads, no third-party tracking.",
               accept: "Accept", decline: "Decline", privacy: "Privacy" },
    'uk':    { text: "Ми використовуємо cookie, щоб зрозуміти, як працює сайт. Без реклами та сторонніх трекерів.",
               accept: "Прийняти", decline: "Відхилити", privacy: "Приватність" },
    'ru':    { text: "Мы используем cookies, чтобы понимать, как работает сайт. Без рекламы и сторонних трекеров.",
               accept: "Принять", decline: "Отклонить", privacy: "Приватность" },
    'es-mx': { text: "Usamos cookies para medir el rendimiento del sitio. Sin anuncios ni rastreo de terceros.",
               accept: "Aceptar", decline: "Rechazar", privacy: "Privacidad" },
    'es-ar': { text: "Usamos cookies para medir el rendimiento del sitio. Sin anuncios ni rastreo de terceros.",
               accept: "Aceptar", decline: "Rechazar", privacy: "Privacidad" },
    'pt-BR': { text: "Usamos cookies para entender como o site funciona. Sem anúncios nem rastreadores de terceiros.",
               accept: "Aceitar", decline: "Recusar", privacy: "Privacidade" }
  };

  function privacyHref() {
    return LOCALE === 'en' ? '/privacy.html' : '/' + LOCALE + '/privacy.html';
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

  function getStoredConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setStoredConsent(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  function injectBanner() {
    var stored = getStoredConsent();
    if (stored === 'granted' || stored === 'denied') {
      applyConsent(stored);
      return;
    }

    var copy = BANNER_COPY[LOCALE] || BANNER_COPY.en;
    var bar = document.createElement('div');
    bar.className = 'vs-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie consent');
    bar.innerHTML =
      '<div class="vs-consent-inner">' +
        '<div class="vs-consent-text">' + copy.text +
          ' <a href="' + privacyHref() + '" class="vs-consent-link">' + copy.privacy + '</a></div>' +
        '<div class="vs-consent-buttons">' +
          '<button type="button" class="vs-consent-btn vs-consent-decline">' + copy.decline + '</button>' +
          '<button type="button" class="vs-consent-btn vs-consent-accept">' + copy.accept + '</button>' +
        '</div>' +
      '</div>';

    function dismiss(choice) {
      setStoredConsent(choice);
      applyConsent(choice);
      track('consent_choice', { choice: choice });
      bar.classList.add('vs-consent-hide');
      setTimeout(function () { if (bar.parentNode) bar.remove(); }, 250);
    }

    bar.querySelector('.vs-consent-accept').addEventListener('click', function () { dismiss('granted'); });
    bar.querySelector('.vs-consent-decline').addEventListener('click', function () { dismiss('denied'); });

    document.body.appendChild(bar);
  }

  function injectStyles() {
    var css =
      '.vs-consent{position:fixed;bottom:16px;left:16px;right:16px;z-index:9999;' +
        'background:#fff;color:#0a0a0f;border:1px solid rgba(10,10,15,0.08);' +
        'border-radius:14px;padding:14px 16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);' +
        'font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;' +
        'font-size:13px;line-height:1.45;max-width:720px;margin:0 auto;' +
        'animation:vsConsentIn .3s ease}' +
      '@media (prefers-color-scheme:dark){' +
        '.vs-consent{background:#14141a;color:#f5f5f7;border-color:rgba(255,255,255,0.1)}}' +
      '.vs-consent-inner{display:flex;align-items:center;gap:14px;flex-wrap:wrap}' +
      '.vs-consent-text{flex:1;min-width:240px}' +
      '.vs-consent-link{color:inherit;text-decoration:underline;opacity:.7;margin-left:4px}' +
      '.vs-consent-link:hover{opacity:1}' +
      '.vs-consent-buttons{display:flex;gap:8px;flex-shrink:0}' +
      '.vs-consent-btn{padding:8px 18px;border-radius:8px;border:1px solid currentColor;' +
        'background:transparent;color:inherit;font:inherit;font-weight:600;cursor:pointer;' +
        'transition:opacity .15s,transform .1s}' +
      '.vs-consent-btn:hover{opacity:.7}' +
      '.vs-consent-btn:active{transform:scale(.97)}' +
      '.vs-consent-accept{background:#0064FF;color:#fff;border-color:#0064FF}' +
      '.vs-consent-accept:hover{opacity:.9}' +
      '.vs-consent-hide{opacity:0;transform:translateY(8px);transition:opacity .25s,transform .25s}' +
      '@keyframes vsConsentIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
      '@media (max-width:520px){' +
        '.vs-consent-buttons{width:100%}.vs-consent-btn{flex:1}}';

    var s = document.createElement('style');
    s.setAttribute('data-vs-consent', '');
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ============================================================
  // EVENT WIRING
  // ============================================================

  function wireEvents() {
    // Coming-soon store buttons (App Store / Google Play)
    document.addEventListener('click', function (e) {
      if (!e.target || !e.target.closest) return;
      var btn = e.target.closest('.store-btn');
      if (!btn) return;
      var href = btn.getAttribute('href') || '';
      var store = href.indexOf('apple.com') !== -1 ? 'ios' :
                  href.indexOf('google.com') !== -1 ? 'android' : 'unknown';
      track('coming_soon_click', { store: store });
    });

    // Interactive demo flow
    document.addEventListener('click', function (e) {
      if (!e.target || !e.target.closest) return;
      if (e.target.closest('#demoNext1')) track('demo_started');
      if (e.target.closest('#demoNext2')) track('demo_completed');
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

    // Pricing/CTA generic clicks (any button with data-track attribute)
    document.addEventListener('click', function (e) {
      if (!e.target || !e.target.closest) return;
      var el = e.target.closest('[data-track]');
      if (!el) return;
      var name = el.getAttribute('data-track');
      if (name) track(name);
    });
  }

  // ============================================================
  // INIT
  // ============================================================

  function init() {
    injectStyles();
    injectBanner();
    wireEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
