/* ============================================================
   VetScan currency.js — v3 (21 currencies, 18 page locales)
   Auto-detects user country via timezone, swaps prices to local
   currency on DOMContentLoaded. No cookies, no API calls, no IP.

   Currencies: USD, GBP, EUR, CAD, AUD, CLP, UYU, MXN, BRL,
               COP, PEN, ARS, KZT, UAH,
               SEK, DKK, PLN, CZK, HUF, RON, GEL

   Page languages: en, es-mx, es-ar, es-ES, pt-BR, pt-PT, uk, ru,
                   fr, de, it, nl, sv, da, pl, cs, hu, ro, ka

   Pricing: 12.5% Founder monthly discount, ~33% Founder yearly discount.
   Per Yura's 2026-04-30 directive: align all locales under uniform Founder/Standard ratio.
   ============================================================ */
(function () {
  'use strict';

  function detectCurrency() {
    try {
      var params = new URLSearchParams(window.location.search);
      var override = params.get('currency');
      if (override) {
        override = override.toUpperCase();
        if (['USD','GBP','EUR','CAD','AUD','CLP','UYU','MXN','BRL',
             'COP','PEN','ARS','KZT','UAH',
             'SEK','DKK','PLN','CZK','HUF','RON','GEL'].indexOf(override) !== -1) {
          return override;
        }
      }
    } catch (e) {}

    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }
    catch (e) {}

    var tzCurrency = currencyFromTimezone(tz);
    if (tzCurrency) return tzCurrency;

    var pathCurrency = currencyFromPath(window.location.pathname);
    if (pathCurrency) return pathCurrency;

    return 'USD';
  }

  function currencyFromTimezone(tz) {
    if (!tz) return null;

    if (tz === 'Europe/London' || tz === 'Europe/Belfast' ||
        tz === 'Europe/Jersey' || tz === 'Europe/Guernsey' ||
        tz === 'Europe/Isle_of_Man' || tz === 'Europe/Gibraltar') return 'GBP';

    if (tz === 'Europe/Kyiv' || tz === 'Europe/Kiev' ||
        tz === 'Europe/Uzhgorod' || tz === 'Europe/Zaporozhye' ||
        tz === 'Europe/Simferopol') return 'UAH';

    var kzZones = ['Asia/Almaty','Asia/Aqtau','Asia/Aqtobe','Asia/Atyrau',
                   'Asia/Oral','Asia/Qostanay','Asia/Qyzylorda'];
    if (kzZones.indexOf(tz) !== -1) return 'KZT';

    if (tz === 'Europe/Stockholm') return 'SEK';
    if (tz === 'Europe/Copenhagen') return 'DKK';
    if (tz === 'Europe/Warsaw') return 'PLN';
    if (tz === 'Europe/Prague') return 'CZK';
    if (tz === 'Europe/Budapest') return 'HUF';
    if (tz === 'Europe/Bucharest') return 'RON';
    if (tz === 'Asia/Tbilisi') return 'GEL';

    var canadaZones = [
      'America/Toronto','America/Vancouver','America/Edmonton',
      'America/Winnipeg','America/Halifax','America/St_Johns',
      'America/Regina','America/Whitehorse','America/Yellowknife',
      'America/Iqaluit','America/Moncton','America/Goose_Bay',
      'America/Glace_Bay','America/Cambridge_Bay','America/Inuvik',
      'America/Rankin_Inlet','America/Resolute','America/Atikokan',
      'America/Blanc-Sablon','America/Creston','America/Dawson',
      'America/Dawson_Creek','America/Fort_Nelson','America/Nipigon',
      'America/Pangnirtung','America/Rainy_River','America/Swift_Current',
      'America/Thunder_Bay'
    ];
    if (canadaZones.indexOf(tz) !== -1) return 'CAD';

    if (tz.indexOf('America/Argentina/') === 0 ||
        tz === 'America/Buenos_Aires' || tz === 'America/Catamarca' ||
        tz === 'America/Cordoba' || tz === 'America/Jujuy' ||
        tz === 'America/Mendoza' || tz === 'America/Rosario') return 'ARS';

    var mxZones = [
      'America/Mexico_City','America/Cancun','America/Merida',
      'America/Monterrey','America/Mazatlan','America/Chihuahua',
      'America/Hermosillo','America/Tijuana','America/Bahia_Banderas',
      'America/Matamoros','America/Ojinaga'
    ];
    if (mxZones.indexOf(tz) !== -1) return 'MXN';

    var brZones = [
      'America/Sao_Paulo','America/Bahia','America/Fortaleza',
      'America/Recife','America/Manaus','America/Cuiaba',
      'America/Campo_Grande','America/Belem','America/Boa_Vista',
      'America/Eirunepe','America/Araguaina','America/Maceio',
      'America/Noronha','America/Porto_Velho','America/Rio_Branco',
      'America/Santarem'
    ];
    if (brZones.indexOf(tz) !== -1) return 'BRL';

    if (tz === 'America/Santiago' || tz === 'America/Punta_Arenas' ||
        tz === 'Pacific/Easter') return 'CLP';
    if (tz === 'America/Montevideo') return 'UYU';
    if (tz === 'America/Bogota') return 'COP';
    if (tz === 'America/Lima') return 'PEN';

    if (tz.indexOf('Australia/') === 0) return 'AUD';
    if (tz.indexOf('Europe/') === 0) return 'EUR';

    return null;
  }

  function currencyFromPath(path) {
    if (!path) return null;
    if (path.indexOf('/es-mx/') === 0 || path.indexOf('/es-mx') === 0) return 'MXN';
    if (path.indexOf('/es-ar/') === 0 || path.indexOf('/es-ar') === 0) return 'ARS';
    if (path.indexOf('/es-ES/') === 0 || path.indexOf('/es-ES') === 0) return 'EUR';
    if (path.indexOf('/pt-BR/') === 0 || path.indexOf('/pt-BR') === 0) return 'BRL';
    if (path.indexOf('/pt-PT/') === 0 || path.indexOf('/pt-PT') === 0) return 'EUR';
    if (path.indexOf('/uk/')    === 0 || path === '/uk')                return 'UAH';
    if (path.indexOf('/ru/')    === 0 || path === '/ru')                return 'KZT';
    if (path.indexOf('/fr/')    === 0 || path === '/fr')                return 'EUR';
    if (path.indexOf('/de/')    === 0 || path === '/de')                return 'EUR';
    if (path.indexOf('/it/')    === 0 || path === '/it')                return 'EUR';
    if (path.indexOf('/nl/')    === 0 || path === '/nl')                return 'EUR';
    if (path.indexOf('/sv/')    === 0 || path === '/sv')                return 'SEK';
    if (path.indexOf('/da/')    === 0 || path === '/da')                return 'DKK';
    if (path.indexOf('/pl/')    === 0 || path === '/pl')                return 'PLN';
    if (path.indexOf('/cs/')    === 0 || path === '/cs')                return 'CZK';
    if (path.indexOf('/hu/')    === 0 || path === '/hu')                return 'HUF';
    if (path.indexOf('/ro/')    === 0 || path === '/ro')                return 'RON';
    if (path.indexOf('/ka/')    === 0 || path === '/ka')                return 'GEL';
    return null;
  }

  var PRICES = {
    'founder-monthly': {
      USD:'$6.99', GBP:'£5.99', EUR:'€6.99', CAD:'C$8.49', AUD:'A$8.49',
      CLP:'$6.990', UYU:'$U 280', MXN:'MX$119', BRL:'R$ 34,90',
      COP:'$27.900', PEN:'S/ 24,90', ARS:'AR$ 7.890',
      KZT:'₸3.490', UAH:'₴279',
      SEK:'79 kr', DKK:'52 kr', PLN:'21,99 zł', CZK:'149 Kč',
      HUF:'2.190 Ft', RON:'29,99 lei', GEL:'17 ₾'
    },
    'founder-monthly-with-unit': {
      USD:'$6.99/month', GBP:'£5.99/month', EUR:'€6.99/month',
      CAD:'C$8.49/month', AUD:'A$8.49/month',
      CLP:'$6.990/mes', UYU:'$U 280/mes', MXN:'MX$119/mes',
      BRL:'R$ 34,90/mês', COP:'$27.900/mes', PEN:'S/ 24,90/mes',
      ARS:'AR$ 7.890/mes', KZT:'₸3.490/мес', UAH:'₴279/міс',
      SEK:'79 kr/mån', DKK:'52 kr/md', PLN:'21,99 zł/mies',
      CZK:'149 Kč/měs', HUF:'2.190 Ft/hó', RON:'29,99 lei/lună',
      GEL:'17 ₾/თვე'
    },
    'founder-yearly': {
      USD:'$59.99', GBP:'£49.99', EUR:'€54.99', CAD:'C$79.99', AUD:'A$84.99',
      CLP:'$59.000', UYU:'$U 2.290', MXN:'MX$999',
      BRL:'R$ 299', COP:'$239.000', PEN:'S/ 219',
      ARS:'AR$ 69.900', KZT:'₸29.900', UAH:'₴2.290',
      SEK:'649 kr', DKK:'449 kr', PLN:'189 zł', CZK:'1.249 Kč',
      HUF:'18.490 Ft', RON:'249 lei', GEL:'149 ₾'
    },
    'founder-yearly-with-unit': {
      USD:'$59.99/year', GBP:'£49.99/year', EUR:'€54.99/year',
      CAD:'C$79.99/year', AUD:'A$84.99/year',
      CLP:'$59.000/año', UYU:'$U 2.290/año', MXN:'MX$999/año',
      BRL:'R$ 299/ano', COP:'$239.000/año', PEN:'S/ 219/año',
      ARS:'AR$ 69.900/año', KZT:'₸29.900/год', UAH:'₴2.290/рік',
      SEK:'649 kr/år', DKK:'449 kr/år', PLN:'189 zł/rok',
      CZK:'1.249 Kč/rok', HUF:'18.490 Ft/év', RON:'249 lei/an',
      GEL:'149 ₾/წელი'
    },
    'vetscan-monthly': {
      USD:'$7.99', GBP:'£6.99', EUR:'€7.99', CAD:'C$9.99', AUD:'A$9.99',
      CLP:'$7.990', UYU:'$U 320', MXN:'MX$139', BRL:'R$ 39,90',
      COP:'$31.900', PEN:'S/ 28,90', ARS:'AR$ 8.990',
      KZT:'₸3.990', UAH:'₴319',
      SEK:'89 kr', DKK:'59 kr', PLN:'24,99 zł', CZK:'169 Kč',
      HUF:'2.490 Ft', RON:'34,99 lei', GEL:'19 ₾'
    },
    'vetscan-monthly-with-unit': {
      USD:'$7.99/month', GBP:'£6.99/month', EUR:'€7.99/month',
      CAD:'C$9.99/month', AUD:'A$9.99/month',
      CLP:'$7.990/mes', UYU:'$U 320/mes', MXN:'MX$139/mes',
      BRL:'R$ 39,90/mês', COP:'$31.900/mes', PEN:'S/ 28,90/mes',
      ARS:'AR$ 8.990/mes', KZT:'₸3.990/мес', UAH:'₴319/міс',
      SEK:'89 kr/mån', DKK:'59 kr/md', PLN:'24,99 zł/mies',
      CZK:'169 Kč/měs', HUF:'2.490 Ft/hó', RON:'34,99 lei/lună',
      GEL:'19 ₾/თვე'
    },
    'vetscan-yearly': {
      USD:'$89.99', GBP:'£74.99', EUR:'€84.99', CAD:'C$119.99', AUD:'A$129.99',
      CLP:'$89.000', UYU:'$U 3.490', MXN:'MX$1.490',
      BRL:'R$ 449', COP:'$359.000', PEN:'S/ 329',
      ARS:'AR$ 104.900', KZT:'₸44.900', UAH:'₴3.490',
      SEK:'999 kr', DKK:'669 kr', PLN:'279 zł', CZK:'1.899 Kč',
      HUF:'27.990 Ft', RON:'379 lei', GEL:'219 ₾'
    },
    'vetscan-yearly-with-unit': {
      USD:'$89.99/year', GBP:'£74.99/year', EUR:'€84.99/year',
      CAD:'C$119.99/year', AUD:'A$129.99/year',
      CLP:'$89.000/año', UYU:'$U 3.490/año', MXN:'MX$1.490/año',
      BRL:'R$ 449/ano', COP:'$359.000/año', PEN:'S/ 329/año',
      ARS:'AR$ 104.900/año', KZT:'₸44.900/год', UAH:'₴3.490/рік',
      SEK:'999 kr/år', DKK:'669 kr/år', PLN:'279 zł/rok',
      CZK:'1.899 Kč/rok', HUF:'27.990 Ft/év', RON:'379 lei/an',
      GEL:'219 ₾/წელი'
    },
    'vetscan-additional-dog': {
      USD:'$4.99', GBP:'£3.99', EUR:'€4.49', CAD:'C$6.99', AUD:'A$7.99',
      CLP:'$4.990', UYU:'$U 199', MXN:'MX$89', BRL:'R$ 24,90',
      COP:'$19.900', PEN:'S/ 18,90', ARS:'AR$ 5.900',
      KZT:'₸2.490', UAH:'₴199',
      SEK:'49 kr', DKK:'29 kr', PLN:'12,99 zł', CZK:'89 Kč',
      HUF:'1.490 Ft', RON:'19,99 lei', GEL:'9 ₾'
    },
    'vetscan-family': {
      USD:'$19.99', GBP:'£15.99', EUR:'€17.99', CAD:'C$27.99', AUD:'A$29.99',
      CLP:'$19.990', UYU:'$U 800', MXN:'MX$359', BRL:'R$ 99,90',
      COP:'$79.900', PEN:'S/ 73,90', ARS:'AR$ 23.400',
      KZT:'₸9.990', UAH:'₴799',
      SEK:'199 kr', DKK:'129 kr', PLN:'59 zł', CZK:'399 Kč',
      HUF:'5.990 Ft', RON:'79,99 lei', GEL:'45 ₾'
    },
    'pawp-monthly': {
      USD:'$24/mo', GBP:'£19/mo', EUR:'€22/mo', CAD:'C$32/mo', AUD:'A$36/mo',
      CLP:'$24.000/mes', UYU:'$U 960/mes', MXN:'MX$429/mes',
      BRL:'R$ 119/mês', COP:'$95.000/mes', PEN:'S/ 89/mes',
      ARS:'AR$ 28.000/mes', KZT:'₸11.900/мес', UAH:'₴960/міс',
      SEK:'249 kr/mån', DKK:'159 kr/md', PLN:'89 zł/mies',
      CZK:'499 Kč/měs', HUF:'7.490 Ft/hó', RON:'109 lei/lună',
      GEL:'59 ₾/თვე'
    },
    'airvet-visit': {
      USD:'$40/visit', GBP:'£32/visit', EUR:'€36/visit',
      CAD:'C$55/visit', AUD:'A$60/visit',
      CLP:'$40.000/visita', UYU:'$U 1.600/visita', MXN:'MX$719/visita',
      BRL:'R$ 199/consulta', COP:'$159.000/visita', PEN:'S/ 149/visita',
      ARS:'AR$ 47.000/visita', KZT:'₸19.900/визит', UAH:'₴1.600/візит',
      SEK:'399 kr/besök', DKK:'259 kr/besøg', PLN:'149 zł/wizyta',
      CZK:'849 Kč/návštěva', HUF:'12.490 Ft/látogatás',
      RON:'179 lei/vizită', GEL:'99 ₾/ვიზიტი'
    },
    'fuzzy-monthly': {
      USD:'$20/mo', GBP:'£16/mo', EUR:'€18/mo', CAD:'C$28/mo', AUD:'A$30/mo',
      CLP:'$19.990/mes', UYU:'$U 800/mes', MXN:'MX$359/mes',
      BRL:'R$ 99,90/mês', COP:'$79.900/mes', PEN:'S/ 73,90/mes',
      ARS:'AR$ 23.400/mes', KZT:'₸9.990/мес', UAH:'₴799/міс',
      SEK:'199 kr/mån', DKK:'129 kr/md', PLN:'74 zł/mies',
      CZK:'419 Kč/měs', HUF:'6.290 Ft/hó', RON:'89 lei/lună',
      GEL:'49 ₾/თვე'
    },
    'er-visit-low': {
      USD:'$400', GBP:'£200', EUR:'€180', CAD:'C$400', AUD:'A$400',
      CLP:'$200.000', UYU:'$U 6.000', MXN:'MX$3.500',
      BRL:'R$ 800', COP:'$600.000', PEN:'S/ 600',
      ARS:'AR$ 80.000', KZT:'₸80.000', UAH:'₴6.000',
      SEK:'2.000 kr', DKK:'1.300 kr', PLN:'600 zł', CZK:'4.000 Kč',
      HUF:'60.000 Ft', RON:'800 lei', GEL:'500 ₾'
    },
    'er-visit-mid': {
      USD:'$500', GBP:'£300', EUR:'€280', CAD:'C$550', AUD:'A$500',
      CLP:'$300.000', UYU:'$U 8.000', MXN:'MX$5.000',
      BRL:'R$ 1.200', COP:'$900.000', PEN:'S/ 900',
      ARS:'AR$ 120.000', KZT:'₸120.000', UAH:'₴9.000',
      SEK:'3.000 kr', DKK:'2.000 kr', PLN:'900 zł', CZK:'6.000 Kč',
      HUF:'90.000 Ft', RON:'1.200 lei', GEL:'750 ₾'
    },
    'er-visit-range': {
      USD:'$500-$1,500', GBP:'£200-£700', EUR:'€150-€600',
      CAD:'C$400-C$1,500', AUD:'A$400-A$1,400',
      CLP:'$200.000-$1.000.000', UYU:'$U 6.000-$U 25.000',
      MXN:'MX$3.500-MX$15.000', BRL:'R$ 800-R$ 4.000',
      COP:'$600.000-$2.500.000', PEN:'S/ 600-S/ 2.500',
      ARS:'AR$ 80.000-AR$ 400.000', KZT:'₸80.000-₸350.000',
      UAH:'₴6.000-₴25.000',
      SEK:'2.000-7.000 kr', DKK:'1.300-4.500 kr', PLN:'600-2.500 zł',
      CZK:'4.000-15.000 Kč', HUF:'60.000-250.000 Ft',
      RON:'800-3.500 lei', GEL:'500-2.000 ₾'
    },
    'er-visit-range-short': {
      USD:'$400-$1,500', GBP:'£200-£700', EUR:'€150-€600',
      CAD:'C$400-C$1,500', AUD:'A$400-A$1,400',
      CLP:'$200.000-$1.000.000', UYU:'$U 6.000-$U 25.000',
      MXN:'MX$3.500-MX$15.000', BRL:'R$ 800-R$ 4.000',
      COP:'$600.000-$2.500.000', PEN:'S/ 600-S/ 2.500',
      ARS:'AR$ 80.000-AR$ 400.000', KZT:'₸80.000-₸350.000',
      UAH:'₴6.000-₴25.000',
      SEK:'2.000-7.000 kr', DKK:'1.300-4.500 kr', PLN:'600-2.500 zł',
      CZK:'4.000-15.000 Kč', HUF:'60.000-250.000 Ft',
      RON:'800-3.500 lei', GEL:'500-2.000 ₾'
    },
    'calc-er-avg': {
      USD:500, GBP:300, EUR:280, CAD:550, AUD:500,
      CLP:300000, UYU:8000, MXN:5000, BRL:1200,
      COP:900000, PEN:900, ARS:120000, KZT:120000, UAH:9000,
      SEK:3000, DKK:2000, PLN:900, CZK:6000, HUF:90000, RON:1200, GEL:750
    },
    'calc-vetscan-year': {
      USD:69, GBP:59, EUR:69, CAD:99, AUD:109,
      CLP:59000, UYU:2800, MXN:1090, BRL:249,
      COP:159000, PEN:149, ARS:35000, KZT:24900, UAH:1590,
      SEK:799, DKK:529, PLN:229, CZK:1499, HUF:21990, RON:299, GEL:179
    },
    'currency-symbol': {
      USD:'$', GBP:'£', EUR:'€', CAD:'C$', AUD:'A$',
      CLP:'$', UYU:'$U ', MXN:'MX$', BRL:'R$ ', COP:'$',
      PEN:'S/ ', ARS:'AR$ ', KZT:'₸', UAH:'₴',
      SEK:'kr', DKK:'kr', PLN:'zł', CZK:'Kč',
      HUF:'Ft', RON:'lei', GEL:'₾'
    }
  };

  var currentCurrency = detectCurrency();

  function detectPageLanguage() {
    var htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang.indexOf('es-es') === 0) return 'es-ES';
    if (htmlLang.indexOf('es-mx') === 0) return 'es-mx';
    if (htmlLang.indexOf('es-ar') === 0) return 'es-ar';
    if (htmlLang.indexOf('pt-br') === 0) return 'pt-BR';
    if (htmlLang.indexOf('pt-pt') === 0) return 'pt-PT';
    if (htmlLang.indexOf('pt') === 0)    return 'pt-BR';
    if (htmlLang.indexOf('uk') === 0)    return 'uk';
    if (htmlLang.indexOf('ru') === 0)    return 'ru';
    if (htmlLang.indexOf('fr') === 0)    return 'fr';
    if (htmlLang.indexOf('de') === 0)    return 'de';
    if (htmlLang.indexOf('it') === 0)    return 'it';
    if (htmlLang.indexOf('nl') === 0)    return 'nl';
    if (htmlLang.indexOf('sv') === 0)    return 'sv';
    if (htmlLang.indexOf('da') === 0)    return 'da';
    if (htmlLang.indexOf('pl') === 0)    return 'pl';
    if (htmlLang.indexOf('cs') === 0)    return 'cs';
    if (htmlLang.indexOf('hu') === 0)    return 'hu';
    if (htmlLang.indexOf('ro') === 0)    return 'ro';
    if (htmlLang.indexOf('ka') === 0)    return 'ka';
    if (htmlLang.indexOf('es') === 0)    return 'es-mx';
    return 'en';
  }
  var currentPageLang = detectPageLanguage();

  function applyCurrency() {
    var els = document.querySelectorAll('.curr');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-key');
      if (!key || !PRICES[key]) continue;
      var entry = PRICES[key][currentCurrency];
      if (entry === undefined) continue;
      var localized;
      if (typeof entry === 'object' && entry !== null) {
        localized = entry[currentPageLang] || entry['en'] || '';
      } else {
        localized = entry;
      }
      el.textContent = localized;
    }
  }

  window.VetScanCurrency = {
    code: currentCurrency,
    symbol: PRICES['currency-symbol'][currentCurrency],
    erAvg: PRICES['calc-er-avg'][currentCurrency],
    yearPrice: PRICES['calc-vetscan-year'][currentCurrency],
    formatNumber: function (n) {
      var sym = PRICES['currency-symbol'][currentCurrency];
      var locale = 'en-US';
      if (currentCurrency === 'EUR') locale = 'de-DE';
      else if (currentCurrency === 'BRL') locale = 'pt-BR';
      else if (currentCurrency === 'UAH') locale = 'uk-UA';
      else if (['CLP','UYU','MXN','COP','PEN','ARS'].indexOf(currentCurrency) !== -1) locale = 'es-419';
      else if (currentCurrency === 'KZT') locale = 'ru-RU';
      else if (currentCurrency === 'SEK') locale = 'sv-SE';
      else if (currentCurrency === 'DKK') locale = 'da-DK';
      else if (currentCurrency === 'PLN') locale = 'pl-PL';
      else if (currentCurrency === 'CZK') locale = 'cs-CZ';
      else if (currentCurrency === 'HUF') locale = 'hu-HU';
      else if (currentCurrency === 'RON') locale = 'ro-RO';
      else if (currentCurrency === 'GEL') locale = 'ka-GE';
      try { return sym + Math.round(n).toLocaleString(locale); }
      catch (e) { return sym + Math.round(n).toLocaleString('en-US'); }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCurrency);
  } else {
    applyCurrency();
  }
})();
