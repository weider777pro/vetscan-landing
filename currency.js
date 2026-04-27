/* ============================================================
   VetScan currency.js — v2 (14 currencies)
   Auto-detects user country via timezone, swaps prices to local
   currency on DOMContentLoaded. No cookies, no API calls, no IP.
   Currencies: USD, GBP, EUR, CAD, AUD, CLP, UYU, MXN, BRL,
               COP, PEN, ARS, KZT, UAH
   ============================================================ */
(function () {
  'use strict';

  function detectCurrency() {
    var tz;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }
    catch (e) { return 'USD'; }

    if (tz === 'Europe/London' || tz === 'Europe/Belfast' ||
        tz === 'Europe/Jersey' || tz === 'Europe/Guernsey' ||
        tz === 'Europe/Isle_of_Man' || tz === 'Europe/Gibraltar') return 'GBP';

    if (tz === 'Europe/Kyiv' || tz === 'Europe/Kiev' ||
        tz === 'Europe/Uzhgorod' || tz === 'Europe/Zaporozhye' ||
        tz === 'Europe/Simferopol') return 'UAH';

    var kzZones = ['Asia/Almaty','Asia/Aqtau','Asia/Aqtobe','Asia/Atyrau',
                   'Asia/Oral','Asia/Qostanay','Asia/Qyzylorda'];
    if (kzZones.indexOf(tz) !== -1) return 'KZT';

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
    return 'USD';
  }

  var PRICES = {
    'founder-monthly': {
      USD:'$6.99', GBP:'£5.99', EUR:'€6.99', CAD:'C$9.99', AUD:'A$10.99',
      CLP:'$5.990', UYU:'$U 280', MXN:'MX$109', BRL:'R$ 24,90',
      COP:'$15.900', PEN:'S/ 14,90', ARS:'AR$ 3.500',
      KZT:'₸2.490', UAH:'₴159'
    },
    'founder-monthly-with-unit': {
      USD:'$6.99/month', GBP:'£5.99/month', EUR:'€6.99/month',
      CAD:'C$9.99/month', AUD:'A$10.99/month',
      CLP:'$5.990/mes', UYU:'$U 280/mes', MXN:'MX$109/mes',
      BRL:'R$ 24,90/mês', COP:'$15.900/mes', PEN:'S/ 14,90/mes',
      ARS:'AR$ 3.500/mes', KZT:'₸2.490/мес', UAH:'₴159/міс'
    },
    'founder-yearly': {
      USD:'$69', GBP:'£59', EUR:'€69', CAD:'C$99', AUD:'A$109',
      CLP:'$59.000', UYU:'$U 2.800', MXN:'MX$1.090',
      BRL:'R$ 249', COP:'$159.000', PEN:'S/ 149',
      ARS:'AR$ 35.000', KZT:'₸24.900', UAH:'₴1.590'
    },
    'founder-yearly-with-unit': {
      USD:'$69/year', GBP:'£59/year', EUR:'€69/year',
      CAD:'C$99/year', AUD:'A$109/year',
      CLP:'$59.000/año', UYU:'$U 2.800/año', MXN:'MX$1.090/año',
      BRL:'R$ 249/ano', COP:'$159.000/año', PEN:'S/ 149/año',
      ARS:'AR$ 35.000/año', KZT:'₸24.900/год', UAH:'₴1.590/рік'
    },
    'vetscan-monthly': {
      USD:'$9.99', GBP:'£7.99', EUR:'€8.99', CAD:'C$13.99', AUD:'A$14.99',
      CLP:'$9.990', UYU:'$U 400', MXN:'MX$179', BRL:'R$ 49,90',
      COP:'$39.900', PEN:'S/ 36,90', ARS:'AR$ 11.700',
      KZT:'₸4.990', UAH:'₴399'
    },
    'vetscan-monthly-with-unit': {
      USD:'$9.99/month', GBP:'£7.99/month', EUR:'€8.99/month',
      CAD:'C$13.99/month', AUD:'A$14.99/month',
      CLP:'$9.990/mes', UYU:'$U 400/mes', MXN:'MX$179/mes',
      BRL:'R$ 49,90/mês', COP:'$39.900/mes', PEN:'S/ 36,90/mes',
      ARS:'AR$ 11.700/mes', KZT:'₸4.990/мес', UAH:'₴399/міс'
    },
    'vetscan-yearly': {
      USD:'$99', GBP:'£79', EUR:'€89', CAD:'C$139', AUD:'A$149',
      CLP:'$99.000', UYU:'$U 3.990', MXN:'MX$1.790',
      BRL:'R$ 499', COP:'$399.000', PEN:'S/ 369',
      ARS:'AR$ 117.000', KZT:'₸49.900', UAH:'₴3.999'
    },
    'vetscan-yearly-with-unit': {
      USD:'$99/year', GBP:'£79/year', EUR:'€89/year',
      CAD:'C$139/year', AUD:'A$149/year',
      CLP:'$99.000/año', UYU:'$U 3.990/año', MXN:'MX$1.790/año',
      BRL:'R$ 499/ano', COP:'$399.000/año', PEN:'S/ 369/año',
      ARS:'AR$ 117.000/año', KZT:'₸49.900/год', UAH:'₴3.999/рік'
    },
    'vetscan-additional-dog': {
      USD:'$4.99', GBP:'£3.99', EUR:'€4.49', CAD:'C$6.99', AUD:'A$7.99',
      CLP:'$4.990', UYU:'$U 199', MXN:'MX$89', BRL:'R$ 24,90',
      COP:'$19.900', PEN:'S/ 18,90', ARS:'AR$ 5.900',
      KZT:'₸2.490', UAH:'₴199'
    },
    'vetscan-family': {
      USD:'$19.99', GBP:'£15.99', EUR:'€17.99', CAD:'C$27.99', AUD:'A$29.99',
      CLP:'$19.990', UYU:'$U 800', MXN:'MX$359', BRL:'R$ 99,90',
      COP:'$79.900', PEN:'S/ 73,90', ARS:'AR$ 23.400',
      KZT:'₸9.990', UAH:'₴799'
    },
    'pawp-monthly': {
      USD:'$24/mo', GBP:'£19/mo', EUR:'€22/mo', CAD:'C$32/mo', AUD:'A$36/mo',
      CLP:'$24.000/mes', UYU:'$U 960/mes', MXN:'MX$429/mes',
      BRL:'R$ 119/mês', COP:'$95.000/mes', PEN:'S/ 89/mes',
      ARS:'AR$ 28.000/mes', KZT:'₸11.900/мес', UAH:'₴960/міс'
    },
    'airvet-visit': {
      USD:'$40/visit', GBP:'£32/visit', EUR:'€36/visit',
      CAD:'C$55/visit', AUD:'A$60/visit',
      CLP:'$40.000/visita', UYU:'$U 1.600/visita', MXN:'MX$719/visita',
      BRL:'R$ 199/consulta', COP:'$159.000/visita', PEN:'S/ 149/visita',
      ARS:'AR$ 47.000/visita', KZT:'₸19.900/визит', UAH:'₴1.600/візит'
    },
    'fuzzy-monthly': {
      USD:'$20/mo', GBP:'£16/mo', EUR:'€18/mo', CAD:'C$28/mo', AUD:'A$30/mo',
      CLP:'$19.990/mes', UYU:'$U 800/mes', MXN:'MX$359/mes',
      BRL:'R$ 99,90/mês', COP:'$79.900/mes', PEN:'S/ 73,90/mes',
      ARS:'AR$ 23.400/mes', KZT:'₸9.990/мес', UAH:'₴799/міс'
    },
    'er-visit-low': {
      USD:'$400', GBP:'£200', EUR:'€180', CAD:'C$400', AUD:'A$400',
      CLP:'$200.000', UYU:'$U 6.000', MXN:'MX$3.500',
      BRL:'R$ 800', COP:'$600.000', PEN:'S/ 600',
      ARS:'AR$ 80.000', KZT:'₸80.000', UAH:'₴6.000'
    },
    'er-visit-mid': {
      USD:'$500', GBP:'£300', EUR:'€280', CAD:'C$550', AUD:'A$500',
      CLP:'$300.000', UYU:'$U 8.000', MXN:'MX$5.000',
      BRL:'R$ 1.200', COP:'$900.000', PEN:'S/ 900',
      ARS:'AR$ 120.000', KZT:'₸120.000', UAH:'₴9.000'
    },
    'er-visit-range': {
      USD:'$500-$1,500', GBP:'£200-£700', EUR:'€150-€600',
      CAD:'C$400-C$1,500', AUD:'A$400-A$1,400',
      CLP:'$200.000-$1.000.000', UYU:'$U 6.000-$U 25.000',
      MXN:'MX$3.500-MX$15.000', BRL:'R$ 800-R$ 4.000',
      COP:'$600.000-$2.500.000', PEN:'S/ 600-S/ 2.500',
      ARS:'AR$ 80.000-AR$ 400.000', KZT:'₸80.000-₸350.000',
      UAH:'₴6.000-₴25.000'
    },
    'er-visit-range-short': {
      USD:'$400-$1,500', GBP:'£200-£700', EUR:'€150-€600',
      CAD:'C$400-C$1,500', AUD:'A$400-A$1,400',
      CLP:'$200.000-$1.000.000', UYU:'$U 6.000-$U 25.000',
      MXN:'MX$3.500-MX$15.000', BRL:'R$ 800-R$ 4.000',
      COP:'$600.000-$2.500.000', PEN:'S/ 600-S/ 2.500',
      ARS:'AR$ 80.000-AR$ 400.000', KZT:'₸80.000-₸350.000',
      UAH:'₴6.000-₴25.000'
    },
    'calc-er-avg': {
      USD:500, GBP:300, EUR:280, CAD:550, AUD:500,
      CLP:300000, UYU:8000, MXN:5000, BRL:1200,
      COP:900000, PEN:900, ARS:120000, KZT:120000, UAH:9000
    },
    'calc-vetscan-year': {
      USD:69, GBP:59, EUR:69, CAD:99, AUD:109,
      CLP:59000, UYU:2800, MXN:1090, BRL:249,
      COP:159000, PEN:149, ARS:35000, KZT:24900, UAH:1590
    },
    'currency-symbol': {
      USD:'$', GBP:'£', EUR:'€', CAD:'C$', AUD:'A$',
      CLP:'$', UYU:'$U ', MXN:'MX$', BRL:'R$ ', COP:'$',
      PEN:'S/ ', ARS:'AR$ ', KZT:'₸', UAH:'₴'
    },
    'er-region-label': {
      USD:'US', GBP:'UK', EUR:'EU', CAD:'Canadian', AUD:'Australian',
      CLP:'Chilean', UYU:'Uruguayan', MXN:'Mexican',
      BRL:'Brazilian', COP:'Colombian', PEN:'Peruvian',
      ARS:'Argentinian', KZT:'Kazakh', UAH:'Ukrainian'
    },
    'er-source-citation': {
      USD:'American Animal Hospital Association, 2024',
      GBP:'RVC and RSPCA data',
      EUR:'European Veterinary Association estimates',
      CAD:'Canadian Veterinary Medical Association',
      AUD:'Australian Veterinary Association',
      CLP:'Colegio Médico Veterinario de Chile estimates',
      UYU:'Sociedad de Medicina Veterinaria del Uruguay estimates',
      MXN:'FedMVZ (Mexico) estimates',
      BRL:'CFMV (Brazil) estimates',
      COP:'Comvezcol (Colombia) estimates',
      PEN:'Colegio Médico Veterinario del Perú estimates',
      ARS:'AVECCAR (Argentina) estimates',
      KZT:'Kazakhstan veterinary clinics, average estimates',
      UAH:'Ukrainian Veterinary Association estimates'
    }
  };

  var currentCurrency = detectCurrency();

  function applyCurrency() {
    var els = document.querySelectorAll('.curr');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-key');
      if (!key || !PRICES[key]) continue;
      var localized = PRICES[key][currentCurrency];
      if (localized !== undefined) el.textContent = localized;
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
