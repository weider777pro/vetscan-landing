/* ============================================================
   VetScan i18n.js v2 — auto-redirect + language switcher
   18 non-English locales supported.
   ============================================================ */
(function () {
  'use strict';

  var LOCALES = [
    'es-ES', 'es-mx', 'es-ar', 'pt-BR', 'pt-PT',
    'uk', 'ru',
    'fr', 'de', 'it', 'nl',
    'sv', 'da', 'pl', 'cs', 'hu', 'ro', 'ka'
  ];

  function currentPathLang() {
    var p = window.location.pathname;
    for (var i = 0; i < LOCALES.length; i++) {
      var loc = LOCALES[i];
      if (p.indexOf('/' + loc + '/') === 0 || p === '/' + loc) {
        return loc;
      }
    }
    return 'en';
  }

  function detectTargetLang() {
    var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    var tz;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }
    catch (e) { tz = ''; }

    if (tz === 'Europe/Kyiv' || tz === 'Europe/Kiev' ||
        tz === 'Europe/Uzhgorod' || tz === 'Europe/Zaporozhye' ||
        tz === 'Europe/Simferopol') return 'uk';

    if (tz === 'Asia/Almaty' || tz === 'Asia/Aqtau' || tz === 'Asia/Aqtobe' ||
        tz === 'Asia/Atyrau' || tz === 'Asia/Oral' || tz === 'Asia/Qostanay' ||
        tz === 'Asia/Qyzylorda') return 'ru';

    if (tz === 'Europe/Madrid' || tz === 'Atlantic/Canary' ||
        tz === 'Africa/Ceuta') return 'es-ES';

    if (tz === 'Europe/Lisbon' || tz === 'Atlantic/Madeira' ||
        tz === 'Atlantic/Azores') return 'pt-PT';

    if (tz === 'Europe/Paris') return 'fr';
    if (tz === 'Europe/Berlin' || tz === 'Europe/Vienna' ||
        tz === 'Europe/Zurich') return 'de';
    if (tz === 'Europe/Rome') return 'it';
    if (tz === 'Europe/Amsterdam') return 'nl';
    if (tz === 'Europe/Stockholm') return 'sv';
    if (tz === 'Europe/Copenhagen') return 'da';
    if (tz === 'Europe/Warsaw') return 'pl';
    if (tz === 'Europe/Prague') return 'cs';
    if (tz === 'Europe/Budapest') return 'hu';
    if (tz === 'Europe/Bucharest') return 'ro';
    if (tz === 'Asia/Tbilisi') return 'ka';

    if (tz.indexOf('America/Argentina/') === 0 ||
        tz === 'America/Buenos_Aires' || tz === 'America/Catamarca' ||
        tz === 'America/Cordoba' || tz === 'America/Mendoza' ||
        tz === 'America/Rosario' ||
        tz === 'America/Santiago' || tz === 'America/Punta_Arenas' ||
        tz === 'Pacific/Easter' || tz === 'America/Montevideo') return 'es-ar';

    if (tz === 'America/Mexico_City' || tz === 'America/Cancun' ||
        tz === 'America/Merida' || tz === 'America/Monterrey' ||
        tz === 'America/Mazatlan' || tz === 'America/Chihuahua' ||
        tz === 'America/Hermosillo' || tz === 'America/Tijuana' ||
        tz === 'America/Bahia_Banderas' || tz === 'America/Matamoros' ||
        tz === 'America/Ojinaga' || tz === 'America/Bogota' ||
        tz === 'America/Lima') return 'es-mx';

    var brZones = ['America/Sao_Paulo','America/Bahia','America/Fortaleza',
      'America/Recife','America/Manaus','America/Cuiaba','America/Campo_Grande',
      'America/Belem','America/Boa_Vista','America/Eirunepe','America/Araguaina',
      'America/Maceio','America/Noronha','America/Porto_Velho','America/Rio_Branco',
      'America/Santarem'];
    if (brZones.indexOf(tz) !== -1) return 'pt-BR';

    if (lang.indexOf('es-es') === 0) return 'es-ES';
    if (lang.indexOf('es') === 0) return 'es-mx';
    if (lang.indexOf('pt-pt') === 0) return 'pt-PT';
    if (lang.indexOf('pt') === 0) return 'pt-BR';
    if (lang.indexOf('uk') === 0) return 'uk';
    if (lang.indexOf('fr') === 0) return 'fr';
    if (lang.indexOf('de') === 0) return 'de';
    if (lang.indexOf('it') === 0) return 'it';
    if (lang.indexOf('nl') === 0) return 'nl';
    if (lang.indexOf('sv') === 0) return 'sv';
    if (lang.indexOf('da') === 0) return 'da';
    if (lang.indexOf('pl') === 0) return 'pl';
    if (lang.indexOf('cs') === 0) return 'cs';
    if (lang.indexOf('hu') === 0) return 'hu';
    if (lang.indexOf('ro') === 0) return 'ro';
    if (lang.indexOf('ka') === 0) return 'ka';
    if (lang.indexOf('kk') === 0) return 'ru';

    return 'en';
  }

  function maybeRedirect() {
    var current = currentPathLang();
    if (current !== 'en') return;
    if (sessionStorage.getItem('vs_lang_chosen')) return;
    if (/(?:^|;\s*)vs_lang_chosen=1(?:;|$)/.test(document.cookie)) return;

    var target = detectTargetLang();
    if (target === 'en') return;

    sessionStorage.setItem('vs_lang_chosen', '1');

    var path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path === '') {
      window.location.replace('/' + target + '/');
    } else {
      var page = path.replace(/^\//, '');
      window.location.replace('/' + target + '/' + page + window.location.search);
    }
  }

  window.VetScanSwitchLang = function (targetLang) {
    sessionStorage.setItem('vs_lang_chosen', '1');
    var current = currentPathLang();
    var path = window.location.pathname;

    var page = path;
    if (current !== 'en') {
      page = path.replace(new RegExp('^/' + current + '/?'), '');
    } else {
      page = path.replace(/^\//, '');
    }
    if (!page || page === 'index.html') page = '';

    var newPath;
    if (targetLang === 'en') {
      newPath = '/' + page;
    } else {
      newPath = '/' + targetLang + '/' + page;
    }
    window.location.href = newPath;
  };

  maybeRedirect();
})();
