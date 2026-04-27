/* ============================================================
   VetScan currency.js
   Auto-detects user country via timezone, swaps prices to local
   currency on DOMContentLoaded. No cookies, no API calls, no IP.

   Markup contract:
     <span class="curr" data-key="vetscan-monthly"></span>
     → replaced with currency-appropriate price text on load.

   Add new price by:
     1. Adding entry to PRICES below for all 5 currencies
     2. Putting <span class="curr" data-key="your-key"></span> in HTML
   ============================================================ */
(function () {
  'use strict';

  // -------------------------------------------------------------
  // CURRENCY DETECTION via timezone
  // We use Intl.DateTimeFormat().resolvedOptions().timeZone — which
  // returns IANA names like "America/New_York", "Europe/London",
  // "Australia/Sydney". This is built into every modern browser,
  // requires no external service, and works without consent banners.
  // -------------------------------------------------------------
  function detectCurrency() {
    var tz;
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (e) {
      return 'USD';
    }

    // United Kingdom
    if (tz === 'Europe/London' || tz === 'Europe/Belfast' ||
        tz === 'Europe/Jersey' || tz === 'Europe/Guernsey' ||
        tz === 'Europe/Isle_of_Man' || tz === 'Europe/Gibraltar') {
      return 'GBP';
    }

    // Canada — explicit list (NOT all America/* — that includes US)
    var canadaZones = [
      'America/Toronto', 'America/Vancouver', 'America/Edmonton',
      'America/Winnipeg', 'America/Halifax', 'America/St_Johns',
      'America/Regina', 'America/Whitehorse', 'America/Yellowknife',
      'America/Iqaluit', 'America/Moncton', 'America/Goose_Bay',
      'America/Glace_Bay', 'America/Cambridge_Bay', 'America/Inuvik',
      'America/Rankin_Inlet', 'America/Resolute', 'America/Atikokan',
      'America/Blanc-Sablon', 'America/Creston', 'America/Dawson',
      'America/Dawson_Creek', 'America/Fort_Nelson', 'America/Nipigon',
      'America/Pangnirtung', 'America/Rainy_River', 'America/Swift_Current',
      'America/Thunder_Bay'
    ];
    if (canadaZones.indexOf(tz) !== -1) return 'CAD';

    // Australia
    if (tz.indexOf('Australia/') === 0) return 'AUD';

    // Eurozone — Europe/* but NOT UK (handled above)
    if (tz.indexOf('Europe/') === 0) return 'EUR';

    // Default: USD (covers US, plus all other countries — fallback to
    // app's primary advertised currency rather than auto-converting
    // to something that might not even be a launch market)
    return 'USD';
  }

  // -------------------------------------------------------------
  // PRICE TABLE
  // Each entry is keyed by data-key value in markup and holds the
  // display string (with currency symbol and unit suffix already
  // applied) for each of the 5 supported currencies.
  //
  // Important: these are NOT pure FX conversions. They reflect:
  //   - Psychological pricing (.99 endings preserved per locale)
  //   - Real regional ER vet costs (not USD × FX rate)
  //   - Realistic competitor pricing in each market
  // -------------------------------------------------------------
  var PRICES = {
    // ============================================================
    // FOUNDER PRICING — locked for life for beta participants
    // (40% discount vs Standard. The marketing hook for early access.)
    // ============================================================
    'founder-monthly': {
      USD: '$5.99', GBP: '£4.99', EUR: '€5.99', CAD: 'C$7.99', AUD: 'A$8.99'
    },
    'founder-monthly-with-unit': {
      USD: '$5.99/month', GBP: '£4.99/month', EUR: '€5.99/month',
      CAD: 'C$7.99/month', AUD: 'A$8.99/month'
    },
    'founder-yearly': {
      USD: '$59', GBP: '£49', EUR: '€59', CAD: 'C$79', AUD: 'A$89'
    },
    'founder-yearly-with-unit': {
      USD: '$59/year', GBP: '£49/year', EUR: '€59/year',
      CAD: 'C$79/year', AUD: 'A$89/year'
    },

    // ============================================================
    // STANDARD PRICING — applies to new sign-ups after first 12 months.
    // Beta participants on founder pricing keep their rate FOREVER.
    // ============================================================
    // ---- VetScan own pricing ----
    'vetscan-monthly': {
      USD: '$9.99', GBP: '£7.99', EUR: '€8.99', CAD: 'C$13.99', AUD: 'A$14.99'
    },
    'vetscan-monthly-with-unit': {
      USD: '$9.99/month', GBP: '£7.99/month', EUR: '€8.99/month',
      CAD: 'C$13.99/month', AUD: 'A$14.99/month'
    },
    'vetscan-yearly': {
      USD: '$99', GBP: '£79', EUR: '€89', CAD: 'C$139', AUD: 'A$149'
    },
    'vetscan-yearly-with-unit': {
      USD: '$99/year', GBP: '£79/year', EUR: '€89/year',
      CAD: 'C$139/year', AUD: 'A$149/year'
    },
    'vetscan-additional-dog': {
      USD: '$4.99', GBP: '$3.99', EUR: '€4.49', CAD: 'C$6.99', AUD: 'A$7.99'
    },
    'vetscan-family': {
      USD: '$19.99', GBP: '£15.99', EUR: '€17.99', CAD: 'C$27.99', AUD: 'A$29.99'
    },
    // Competitor pricing — adjusted to realistic regional figures
    'pawp-monthly': {
      USD: '$24/mo', GBP: '£19/mo', EUR: '€22/mo', CAD: 'C$32/mo', AUD: 'A$36/mo'
    },
    'airvet-visit': {
      USD: '$40/visit', GBP: '£32/visit', EUR: '€36/visit',
      CAD: 'C$55/visit', AUD: 'A$60/visit'
    },
    'fuzzy-monthly': {
      USD: '$20/mo', GBP: '£16/mo', EUR: '€18/mo', CAD: 'C$28/mo', AUD: 'A$30/mo'
    },

    // ---- ER vet visit cost references ----
    // These reflect REAL regional pricing, not FX-converted USD.
    'er-visit-low': {
      USD: '$400', GBP: '£200', EUR: '€180', CAD: 'C$400', AUD: 'A$400'
    },
    'er-visit-mid': {
      USD: '$500', GBP: '£300', EUR: '€280', CAD: 'C$550', AUD: 'A$500'
    },
    'er-visit-range': {
      USD: '$500-$1,500', GBP: '£200-£700', EUR: '€150-€600',
      CAD: 'C$400-C$1,500', AUD: 'A$400-A$1,400'
    },
    'er-visit-range-short': {
      USD: '$400-$1,500', GBP: '£200-£700', EUR: '€150-€600',
      CAD: 'C$400-C$1,500', AUD: 'A$400-A$1,400'
    },

    // Calculator-specific values — uses FOUNDER pricing because everyone
    // signing up via this landing locks in Founder rate for life.
    'calc-er-avg': {
      USD: 500, GBP: 300, EUR: 280, CAD: 550, AUD: 500
    },
    'calc-vetscan-year': {
      USD: 59, GBP: 49, EUR: 59, CAD: 79, AUD: 89
    },
    'currency-symbol': {
      USD: '$', GBP: '£', EUR: '€', CAD: 'C$', AUD: 'A$'
    },

    // Localized text snippets — region label and source citation
    'er-region-label': {
      USD: 'US',
      GBP: 'UK',
      EUR: 'EU',
      CAD: 'Canadian',
      AUD: 'Australian'
    },
    'er-source-citation': {
      USD: 'American Animal Hospital Association, 2024',
      GBP: 'RVC and RSPCA data',
      EUR: 'European Veterinary Association estimates',
      CAD: 'Canadian Veterinary Medical Association',
      AUD: 'Australian Veterinary Association'
    }
  };

  // -------------------------------------------------------------
  // Apply currency to all elements with class="curr"
  // -------------------------------------------------------------
  var currentCurrency = detectCurrency();

  function applyCurrency() {
    var els = document.querySelectorAll('.curr');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute('data-key');
      if (!key || !PRICES[key]) continue;
      var localized = PRICES[key][currentCurrency];
      if (localized !== undefined) {
        el.textContent = localized;
      }
    }
  }

  // Expose helper for the calculator (which does live computation,
  // not static substitution) so it can read the right base values.
  window.VetScanCurrency = {
    code: currentCurrency,
    symbol: PRICES['currency-symbol'][currentCurrency],
    erAvg: PRICES['calc-er-avg'][currentCurrency],
    yearPrice: PRICES['calc-vetscan-year'][currentCurrency],
    formatNumber: function (n) {
      // Format number with thousands separator appropriate to currency
      // EUR commonly uses period as thousands sep but for English
      // pages we'll keep commas to match site language.
      return PRICES['currency-symbol'][currentCurrency] +
             Math.round(n).toLocaleString('en-US');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCurrency);
  } else {
    applyCurrency();
  }
})();
