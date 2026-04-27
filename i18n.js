/* ============================================================
   VetScan i18n.js — auto-redirect + language switcher
   
   Behavior:
   - On page load, detects browser language
   - If user is on EN page and browser is in es/pt/uk/ru/kk,
     auto-redirects to localized version (once per session)
   - Respects manual language switcher choice (sessionStorage)
   - Spanish dialect: Argentina/Chile/Uruguay → es-AR, others → es-MX
   - Kazakh (kk) → routed to /ru/ (Russian for Kazakhstan)
   ============================================================ */
(function () {
  'use strict';

  // -------------------------------------------------------------
  // Determine current language from URL path
  // -------------------------------------------------------------
  function currentPathLang() {
    var p = window.location.pathname;
    if (p.indexOf('/es-mx/') === 0 || p === '/es-mx' || p.indexOf('/es-mx') === 0) return 'es-mx';
    if (p.indexOf('/es-ar/') === 0 || p === '/es-ar' || p.indexOf('/es-ar') === 0) return 'es-ar';
    if (p.indexOf('/pt-BR/') === 0 || p === '/pt-BR' || p.indexOf('/pt-BR') === 0) return 'pt-BR';
    if (p.indexOf('/uk/')    === 0 || p === '/uk'    || p.indexOf('/uk') === 0)    return 'uk';
    if (p.indexOf('/ru/')    === 0 || p === '/ru'    || p.indexOf('/ru') === 0)    return 'ru';
    return 'en';
  }

  // -------------------------------------------------------------
  // Determine target language from browser + timezone
  // -------------------------------------------------------------
  function detectTargetLang() {
    var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    var tz;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }
    catch (e) { tz = ''; }

    // Spanish — split by region
    if (lang.indexOf('es') === 0) {
      // Rioplatense (Argentina, Chile, Uruguay) → es-AR
      if (tz.indexOf('America/Argentina/') === 0 ||
          tz === 'America/Buenos_Aires' || tz === 'America/Catamarca' ||
          tz === 'America/Cordoba' || tz === 'America/Mendoza' ||
          tz === 'America/Rosario' ||
          tz === 'America/Santiago' || tz === 'America/Punta_Arenas' ||
          tz === 'Pacific/Easter' || tz === 'America/Montevideo') {
        return 'es-ar';
      }
      // Default Spanish → es-MX (Mexico/Colombia/Peru/elsewhere)
      return 'es-mx';
    }

    if (lang.indexOf('pt') === 0) return 'pt-BR';
    if (lang.indexOf('uk') === 0) return 'uk';
    // Russian: covers Russian speakers in Kazakhstan + general ru
    if (lang.indexOf('ru') === 0 || lang.indexOf('kk') === 0) return 'ru';

    return 'en';
  }

  // -------------------------------------------------------------
  // Auto-redirect logic — runs only on EN root pages
  // -------------------------------------------------------------
  function maybeRedirect() {
    var current = currentPathLang();
    if (current !== 'en') return; // Already localized

    // Don't redirect if user manually chose a language this session
    if (sessionStorage.getItem('vs_lang_chosen')) return;

    // Don't redirect if middleware already set the cookie on a previous visit
    // (server-side edge redirect handles first-visit; this is just fallback)
    if (/(?:^|;\s*)vs_lang_chosen=1(?:;|$)/.test(document.cookie)) return;

    var target = detectTargetLang();
    if (target === 'en') return;

    // Mark redirect as done so we don't loop
    sessionStorage.setItem('vs_lang_chosen', '1');

    // Build target URL — preserve current page name
    var path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path === '') {
      window.location.replace('/' + target + '/');
    } else {
      // Strip leading slash, prepend lang folder
      var page = path.replace(/^\//, '');
      window.location.replace('/' + target + '/' + page + window.location.search);
    }
  }

  // -------------------------------------------------------------
  // Manual language switcher — called when user clicks switcher
  // -------------------------------------------------------------
  window.VetScanSwitchLang = function (targetLang) {
    sessionStorage.setItem('vs_lang_chosen', '1');
    var current = currentPathLang();
    var path = window.location.pathname;

    // Strip current language prefix if any
    var page = path;
    if (current !== 'en') {
      page = path.replace(new RegExp('^/' + current + '/?'), '');
    } else {
      page = path.replace(/^\//, '');
    }
    if (!page || page === 'index.html') page = '';

    // Build new URL
    var newPath;
    if (targetLang === 'en') {
      newPath = '/' + page;
    } else {
      newPath = '/' + targetLang + '/' + page;
    }
    if (newPath.endsWith('/')) {
      // already trailing slash, OK
    }
    window.location.href = newPath;
  };

  // -------------------------------------------------------------
  // Run redirect early (before page paint if possible)
  // -------------------------------------------------------------
  maybeRedirect();
})();
