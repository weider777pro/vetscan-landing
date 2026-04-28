/* ============================================================
   VetScan currency.js — v2 (14 currencies)
   Auto-detects user country via timezone, swaps prices to local
   currency on DOMContentLoaded. No cookies, no API calls, no IP.
   Currencies: USD, GBP, EUR, CAD, AUD, CLP, UYU, MXN, BRL,
               COP, PEN, ARS, KZT, UAH
   ============================================================ */
(function () {
  'use strict';

  /**
   * Detect currency using HYBRID logic:
   *
   *   1. PRIMARY: Browser timezone — if it identifies one of our 9 target
   *      countries (UA, KZ, AR, MX, BR, CL, UY, CO, PE) or the original 5
   *      (US, UK, EU, CA, AU), use that currency.
   *
   *   2. FALLBACK: URL path language directory (/es-mx/, /pt-BR/, /uk/, etc.)
   *      Used when timezone gives no signal OR points to a country outside
   *      our target list (e.g., a Spaniard on /es-ar/ → ARS instead of EUR).
   *
   *   3. DEFAULT: USD
   *
   * Why this hybrid: An Argentinian who clicks "Português (Brasil)" in the
   * footer should still see ARS prices because that's their actual market.
   * But a Spanish speaker in Spain who lands on /es-ar/ should see ARS
   * because the page is labeled for Argentina.
   *
   * Manual currency override via ?currency=XXX query string is also supported
   * for testing.
   */
  function detectCurrency() {
    // ---- Manual override via query string (for testing) ----
    try {
      var params = new URLSearchParams(window.location.search);
      var override = params.get('currency');
      if (override) {
        override = override.toUpperCase();
        if (['USD','GBP','EUR','CAD','AUD','CLP','UYU','MXN','BRL',
             'COP','PEN','ARS','KZT','UAH'].indexOf(override) !== -1) {
          return override;
        }
      }
    } catch (e) {}

    // ---- 1. PRIMARY: timezone-based detection ----
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }
    catch (e) {}

    var tzCurrency = currencyFromTimezone(tz);
    if (tzCurrency) return tzCurrency;

    // ---- 2. FALLBACK: URL path language directory ----
    var pathCurrency = currencyFromPath(window.location.pathname);
    if (pathCurrency) return pathCurrency;

    // ---- 3. DEFAULT ----
    return 'USD';
  }

  /**
   * Map timezone → currency. Returns null if timezone is unknown
   * (so caller can fall through to URL-path detection).
   */
  function currencyFromTimezone(tz) {
    if (!tz) return null;

    // United Kingdom
    if (tz === 'Europe/London' || tz === 'Europe/Belfast' ||
        tz === 'Europe/Jersey' || tz === 'Europe/Guernsey' ||
        tz === 'Europe/Isle_of_Man' || tz === 'Europe/Gibraltar') return 'GBP';

    // Ukraine
    if (tz === 'Europe/Kyiv' || tz === 'Europe/Kiev' ||
        tz === 'Europe/Uzhgorod' || tz === 'Europe/Zaporozhye' ||
        tz === 'Europe/Simferopol') return 'UAH';

    // Kazakhstan
    var kzZones = ['Asia/Almaty','Asia/Aqtau','Asia/Aqtobe','Asia/Atyrau',
                   'Asia/Oral','Asia/Qostanay','Asia/Qyzylorda'];
    if (kzZones.indexOf(tz) !== -1) return 'KZT';

    // Canada — explicit list (NOT all America/* — that includes US)
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

    // Argentina
    if (tz.indexOf('America/Argentina/') === 0 ||
        tz === 'America/Buenos_Aires' || tz === 'America/Catamarca' ||
        tz === 'America/Cordoba' || tz === 'America/Jujuy' ||
        tz === 'America/Mendoza' || tz === 'America/Rosario') return 'ARS';

    // Mexico
    var mxZones = [
      'America/Mexico_City','America/Cancun','America/Merida',
      'America/Monterrey','America/Mazatlan','America/Chihuahua',
      'America/Hermosillo','America/Tijuana','America/Bahia_Banderas',
      'America/Matamoros','America/Ojinaga'
    ];
    if (mxZones.indexOf(tz) !== -1) return 'MXN';

    // Brazil
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

    // Timezone is unknown to us — return null so caller falls through
    return null;
  }

  /**
   * Map URL path language directory → default currency for that language.
   * Used as fallback when timezone gives no useful signal.
   */
  function currencyFromPath(path) {
    if (!path) return null;
    if (path.indexOf('/es-mx/') === 0 || path.indexOf('/es-mx') === 0) return 'MXN';
    if (path.indexOf('/es-ar/') === 0 || path.indexOf('/es-ar') === 0) return 'ARS';
    if (path.indexOf('/pt-BR/') === 0 || path.indexOf('/pt-BR') === 0) return 'BRL';
    if (path.indexOf('/uk/')    === 0 || path === '/uk')                return 'UAH';
    if (path.indexOf('/ru/')    === 0 || path === '/ru')                return 'KZT';
    return null;  // EN root or unknown — caller will default to USD
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
      USD:'$59.99', GBP:'£49.99', EUR:'€59.99', CAD:'C$84.99', AUD:'A$94.99',
      CLP:'$49.900', UYU:'$U 2.290', MXN:'MX$899',
      BRL:'R$ 199', COP:'$129.900', PEN:'S/ 119',
      ARS:'AR$ 29.900', KZT:'₸19.900', UAH:'₴1.290'
    },
    'founder-yearly-with-unit': {
      USD:'$59.99/year', GBP:'£49.99/year', EUR:'€59.99/year',
      CAD:'C$84.99/year', AUD:'A$94.99/year',
      CLP:'$49.900/año', UYU:'$U 2.290/año', MXN:'MX$899/año',
      BRL:'R$ 199/ano', COP:'$129.900/año', PEN:'S/ 119/año',
      ARS:'AR$ 29.900/año', KZT:'₸19.900/год', UAH:'₴1.290/рік'
    },
    'vetscan-monthly': {
      USD:'$7.99', GBP:'£5.99', EUR:'€6.99', CAD:'C$9.99', AUD:'A$9.99',
      CLP:'$7.990', UYU:'$U 320', MXN:'MX$139', BRL:'R$ 39,90',
      COP:'$31.900', PEN:'S/ 28,90', ARS:'AR$ 8.990',
      KZT:'₸3.990', UAH:'₴319'
    },
    'vetscan-monthly-with-unit': {
      USD:'$7.99/month', GBP:'£5.99/month', EUR:'€6.99/month',
      CAD:'C$9.99/month', AUD:'A$9.99/month',
      CLP:'$7.990/mes', UYU:'$U 320/mes', MXN:'MX$139/mes',
      BRL:'R$ 39,90/mês', COP:'$31.900/mes', PEN:'S/ 28,90/mes',
      ARS:'AR$ 8.990/mes', KZT:'₸3.990/мес', UAH:'₴319/міс'
    },
    'vetscan-yearly': {
      USD:'$89.99', GBP:'£69.99', EUR:'€79.99', CAD:'C$119.99', AUD:'A$129.99',
      CLP:'$89.000', UYU:'$U 3.690', MXN:'MX$1.590',
      BRL:'R$ 449', COP:'$359.000', PEN:'S/ 329',
      ARS:'AR$ 104.900', KZT:'₸44.900', UAH:'₴3.690'
    },
    'vetscan-yearly-with-unit': {
      USD:'$89.99/year', GBP:'£69.99/year', EUR:'€79.99/year',
      CAD:'C$119.99/year', AUD:'A$129.99/year',
      CLP:'$89.000/año', UYU:'$U 3.690/año', MXN:'MX$1.590/año',
      BRL:'R$ 449/ano', COP:'$359.000/año', PEN:'S/ 329/año',
      ARS:'AR$ 104.900/año', KZT:'₸44.900/год', UAH:'₴3.690/рік'
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
      /* Country label per (currency × page-language). The page language is detected
         from <html lang> attribute. Falls back to English if no match. */
      USD: { en:'US',     'es-mx':'EE. UU.',   'es-ar':'EE. UU.',   'pt-BR':'EUA',         uk:'США',           ru:'США' },
      GBP: { en:'UK',     'es-mx':'Reino Unido','es-ar':'Reino Unido','pt-BR':'Reino Unido', uk:'Велика Британія',ru:'Великобритания' },
      EUR: { en:'EU',     'es-mx':'UE',         'es-ar':'UE',         'pt-BR':'UE',         uk:'ЄС',             ru:'ЕС' },
      CAD: { en:'Canadian','es-mx':'canadiense','es-ar':'canadiense','pt-BR':'canadense',  uk:'канадський',     ru:'канадский' },
      AUD: { en:'Australian','es-mx':'australiano','es-ar':'australiano','pt-BR':'australiano',uk:'австралійський',ru:'австралийский' },
      CLP: { en:'Chilean','es-mx':'chileno',    'es-ar':'chileno',    'pt-BR':'chileno',    uk:'чилійський',    ru:'чилийский' },
      UYU: { en:'Uruguayan','es-mx':'uruguayo','es-ar':'uruguayo',   'pt-BR':'uruguaio',   uk:'уругвайський',  ru:'уругвайский' },
      MXN: { en:'Mexican','es-mx':'mexicano',   'es-ar':'mexicano',   'pt-BR':'mexicano',   uk:'мексиканський', ru:'мексиканский' },
      BRL: { en:'Brazilian','es-mx':'brasileño','es-ar':'brasileño',  'pt-BR':'brasileiro', uk:'бразильський',  ru:'бразильский' },
      COP: { en:'Colombian','es-mx':'colombiano','es-ar':'colombiano','pt-BR':'colombiano', uk:'колумбійський', ru:'колумбийский' },
      PEN: { en:'Peruvian','es-mx':'peruano',   'es-ar':'peruano',    'pt-BR':'peruano',    uk:'перуанський',   ru:'перуанский' },
      ARS: { en:'Argentine','es-mx':'argentino','es-ar':'argentino',  'pt-BR':'argentino',  uk:'аргентинський', ru:'аргентинский' },
      KZT: { en:'Kazakh', 'es-mx':'kazajo',     'es-ar':'kazajo',     'pt-BR':'cazaque',    uk:'казахський',    ru:'казахстанский' },
      UAH: { en:'Ukrainian','es-mx':'ucraniano','es-ar':'ucraniano',  'pt-BR':'ucraniano',  uk:'український',   ru:'украинский' }
    },
    'er-source-citation': {
      USD: { en:'American Animal Hospital Association, 2024',
             'es-mx':'Asociación Estadounidense de Hospitales para Animales, 2024',
             'es-ar':'Asociación Estadounidense de Hospitales para Animales, 2024',
             'pt-BR':'Associação Americana de Hospitais Veterinários, 2024',
             uk:'Американська асоціація лікарень для тварин, 2024',
             ru:'Американская ассоциация ветеринарных госпиталей, 2024' },
      GBP: { en:'RVC and RSPCA data',
             'es-mx':'Datos de RVC y RSPCA', 'es-ar':'Datos de RVC y RSPCA',
             'pt-BR':'Dados de RVC e RSPCA',
             uk:'Дані RVC та RSPCA', ru:'Данные RVC и RSPCA' },
      EUR: { en:'European Veterinary Association estimates',
             'es-mx':'Estimaciones de la Asociación Veterinaria Europea',
             'es-ar':'Estimaciones de la Asociación Veterinaria Europea',
             'pt-BR':'Estimativas da Associação Veterinária Europeia',
             uk:'Оцінки Європейської ветеринарної асоціації',
             ru:'Оценки Европейской ветеринарной ассоциации' },
      CAD: { en:'Canadian Veterinary Medical Association',
             'es-mx':'Asociación Veterinaria Médica Canadiense',
             'es-ar':'Asociación Veterinaria Médica Canadiense',
             'pt-BR':'Associação Médica Veterinária Canadense',
             uk:'Канадська ветеринарна медична асоціація',
             ru:'Канадская ветеринарная медицинская ассоциация' },
      AUD: { en:'Australian Veterinary Association',
             'es-mx':'Asociación Veterinaria de Australia',
             'es-ar':'Asociación Veterinaria de Australia',
             'pt-BR':'Associação Veterinária Australiana',
             uk:'Австралійська ветеринарна асоціація',
             ru:'Австралийская ветеринарная ассоциация' },
      CLP: { en:'Colegio Médico Veterinario de Chile estimates',
             'es-mx':'Estimaciones del Colegio Médico Veterinario de Chile',
             'es-ar':'Estimaciones del Colegio Médico Veterinario de Chile',
             'pt-BR':'Estimativas do Colegio Médico Veterinario de Chile',
             uk:'Оцінки Колегіуму медичних ветеринарів Чилі',
             ru:'Оценки Коллегии ветеринарных врачей Чили' },
      UYU: { en:'Sociedad de Medicina Veterinaria del Uruguay estimates',
             'es-mx':'Estimaciones de la Sociedad de Medicina Veterinaria del Uruguay',
             'es-ar':'Estimaciones de la Sociedad de Medicina Veterinaria del Uruguay',
             'pt-BR':'Estimativas da Sociedade de Medicina Veterinária do Uruguai',
             uk:'Оцінки Товариства ветеринарної медицини Уругваю',
             ru:'Оценки Общества ветеринарной медицины Уругвая' },
      MXN: { en:'FedMVZ (Mexico) estimates',
             'es-mx':'Estimaciones de FedMVZ (México)',
             'es-ar':'Estimaciones de FedMVZ (México)',
             'pt-BR':'Estimativas da FedMVZ (México)',
             uk:'Оцінки FedMVZ (Мексика)',
             ru:'Оценки FedMVZ (Мексика)' },
      BRL: { en:'CFMV (Brazil) estimates',
             'es-mx':'Estimaciones del CFMV (Brasil)',
             'es-ar':'Estimaciones del CFMV (Brasil)',
             'pt-BR':'Estimativas do CFMV (Brasil)',
             uk:'Оцінки CFMV (Бразилія)',
             ru:'Оценки CFMV (Бразилия)' },
      COP: { en:'Comvezcol (Colombia) estimates',
             'es-mx':'Estimaciones de Comvezcol (Colombia)',
             'es-ar':'Estimaciones de Comvezcol (Colombia)',
             'pt-BR':'Estimativas da Comvezcol (Colômbia)',
             uk:'Оцінки Comvezcol (Колумбія)',
             ru:'Оценки Comvezcol (Колумбия)' },
      PEN: { en:'Colegio Médico Veterinario del Perú estimates',
             'es-mx':'Estimaciones del Colegio Médico Veterinario del Perú',
             'es-ar':'Estimaciones del Colegio Médico Veterinario del Perú',
             'pt-BR':'Estimativas do Colégio Médico Veterinário do Peru',
             uk:'Оцінки Колегіуму медичних ветеринарів Перу',
             ru:'Оценки Коллегии ветеринарных врачей Перу' },
      ARS: { en:'AVECCAR (Argentina) estimates',
             'es-mx':'Estimaciones de AVECCAR (Argentina)',
             'es-ar':'Estimaciones de AVECCAR (Argentina)',
             'pt-BR':'Estimativas da AVECCAR (Argentina)',
             uk:'Оцінки AVECCAR (Аргентина)',
             ru:'Оценки AVECCAR (Аргентина)' },
      KZT: { en:'Kazakhstan veterinary clinics, average estimates',
             'es-mx':'Estimaciones promedio de clínicas veterinarias de Kazajistán',
             'es-ar':'Estimaciones promedio de clínicas veterinarias de Kazajistán',
             'pt-BR':'Estimativas médias de clínicas veterinárias do Cazaquistão',
             uk:'Середні оцінки ветеринарних клінік Казахстану',
             ru:'Средние оценки ветеринарных клиник Казахстана' },
      UAH: { en:'Ukrainian Veterinary Association estimates',
             'es-mx':'Estimaciones de la Asociación Veterinaria de Ucrania',
             'es-ar':'Estimaciones de la Asociación Veterinaria de Ucrania',
             'pt-BR':'Estimativas da Associação Veterinária da Ucrânia',
             uk:'Оцінки Української ветеринарної асоціації',
             ru:'Оценки Ассоциации ветеринаров Украины' }
    }
  };

  var currentCurrency = detectCurrency();

  /**
   * Detect the current page language from <html lang> attribute.
   * Returns one of: 'en', 'es-mx', 'es-ar', 'pt-BR', 'uk', 'ru'.
   */
  function detectPageLanguage() {
    var htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang.indexOf('es-es') === 0) return 'es-ES';
    if (htmlLang.indexOf('es-mx') === 0) return 'es-mx';
    if (htmlLang.indexOf('es-ar') === 0) return 'es-ar';
    if (htmlLang.indexOf('pt-br') === 0) return 'pt-BR';
    if (htmlLang.indexOf('pt') === 0)    return 'pt-BR';
    if (htmlLang.indexOf('uk') === 0)    return 'uk';
    if (htmlLang.indexOf('ru') === 0)    return 'ru';
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

      // Some entries are locale-aware: { en:'X', uk:'Y', ... }
      // Others are simple strings: 'X'
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
