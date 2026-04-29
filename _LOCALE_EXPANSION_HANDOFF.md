# VetScan Locale Expansion v3 — Handoff

**Build:** vetscan-deploy_42_LOCALES_19_total
**Date:** 2026-04-30
**Author decisions:** Yura, signed in chat session 2026-04-30

---

## What this archive contains

### 12 NEW locale directories (English content placeholder, awaiting translation)

- `pt-PT/` — Portuguese (Portugal), EUR
- `fr/` — French, EUR
- `de/` — German, EUR
- `it/` — Italian, EUR
- `nl/` — Dutch, EUR
- `sv/` — Swedish, SEK
- `da/` — Danish, DKK
- `pl/` — Polish, PLN
- `cs/` — Czech, CZK
- `hu/` — Hungarian, HUF
- `ro/` — Romanian, RON
- `ka/` — Georgian, GEL

Each contains 14 HTML pages (index, pricing, faq, how-it-works, methodology, about, terms, privacy, cookies, accessibility, security, disclaimer, compare, veterinary-advisors).

**Important:** content in these files is **English**, not translated. Each file has a TODO banner near `<body>` indicating it needs native translation.

### 7 EXISTING locales — updated metadata (content untouched)

- `en/` (root), `es-mx/`, `es-ar/`, `es-ES/`, `pt-BR/`, `ru/`, `uk/`

What changed:
- Hreflang block expanded to include all 19 locales (en + 12 new + 6 existing-non-en)
- og:locale:alternate list expanded
- canonical URL verified

What did NOT change:
- Translated content (still in original languages)
- Page structure
- Form integration (Form ID 9373906 in code)

### currency.js v3 — major rewrite

**21 currencies supported:**
USD, GBP, EUR, CAD, AUD, CLP, UYU, MXN, BRL, COP, PEN, ARS, KZT, UAH,
**SEK, DKK, PLN, CZK, HUF, RON, GEL** (7 new)

**19 page languages supported** in locale-aware entries (previously 6).

**Pricing rationalized** per Yura's directive: 12.5% Founder monthly discount, ~33% Founder yearly discount across ALL currencies. This **changes existing locale pricing** — see "PRICING CHANGES" section below.

**Detection:**
- Timezone-based primary detection added for: Stockholm/Copenhagen/Warsaw/Prague/Budapest/Bucharest/Tbilisi
- URL path fallback added for: `/pt-PT/`, `/fr/`, `/de/`, `/it/`, `/nl/`, `/sv/`, `/da/`, `/pl/`, `/cs/`, `/hu/`, `/ro/`, `/ka/`

### sitemap.xml — regenerated

266 URLs (19 locales × 14 pages) with full hreflang alternates inline per Google guidelines.

---

## ⚠️ PRICING CHANGES — read carefully before deploy

**Per Yura's directive (2026-04-30 chat session):** all existing locales rebalanced under uniform 12.5% Founder monthly discount.

This changes existing live pricing. Specifically:

| Currency | Old Founder mo | New Founder mo | Change |
|---|---|---|---|
| USD | $6.99 | $6.99 | unchanged |
| GBP | £5.99 | £5.99 | unchanged (was 0% discount) — but Standard now £6.99 (was £5.99) |
| EUR | €6.99 | €6.99 | unchanged — but Standard now €7.99 (was €6.99) |
| CAD | C$9.99 | C$8.49 | -15% |
| AUD | A$10.99 | A$8.49 | -23% (was bug: founder > standard) |
| CLP | $5.990 | $6.990 | +17% |
| UYU | $U 280 | $U 280 | unchanged |
| MXN | MX$109 | MX$119 | +9% |
| BRL | R$ 24,90 | R$ 34,90 | +40% |
| COP | $15.900 | $27.900 | +75% |
| PEN | S/ 14,90 | S/ 24,90 | +67% |
| ARS | AR$ 3.500 | AR$ 7.890 | +125% |
| KZT | ₸2.490 | ₸3.490 | +40% |
| UAH | ₴159 | ₴279 | +75% |

**Rationale documented in chat session:** Yura accepted pushback risk re: psychological pricing in LATAM/CEE markets where larger Founder discounts had been in place. Decision to align under uniform discount was made consciously.

**If a customer has already subscribed at old founder rate** — this is "locked for life" pricing per Email 4 of welcome sequence. Existing subscribers should keep their grandfathered price. NEW signups will see new prices.

**Action item:** if there are existing paid subscribers in BRL/COP/PEN/ARS/KZT/UAH at old prices, verify Stripe is honoring grandfathered rate before deploying.

---

## What's NOT done — translation work remaining

Each new locale has 14 HTML pages × 12 locales = **168 files needing translation**.

### Recommended workflow

**Tier 1 (priority, do first):**
- `index.html` — most important page, all SEO + conversion impact
- `pricing.html` — second most important

**Tier 2 (do after Tier 1):**
- `faq.html`, `how-it-works.html`, `methodology.html`, `about.html`

**Tier 3 (last):**
- `terms.html`, `privacy.html`, `cookies.html` — these are LEGAL documents.
   **Strongly recommend professional legal-translator review**, not AI.
- `accessibility.html`, `security.html`, `disclaimer.html`, `compare.html`, `veterinary-advisors.html`

### Translation seeds — minimal critical strings

For each new locale, at minimum, translate these key strings in `index.html`:

1. `<title>` tag
2. `<meta name="description">`
3. `<meta property="og:title">`
4. `<meta property="og:description">`
5. Hero H1 headline
6. Hero subheadline
7. Primary CTA button text
8. Email form label text
9. Footer disclaimer

These ~9 strings unlock 80% of SEO + conversion value. Rest of page can remain English temporarily.

### Tool recommendations for translation

**Free / cheap:**
- DeepL (free tier 500K chars/mo) — best quality for de, fr, it, nl, sv, da, pl, cs, hu, ro, pt-PT
- Google Translate — fallback for ka (Georgian)

**Paid / professional:**
- Gengo, Smartling, Lokalise — $0.05-0.20/word, native speakers
- For terms/privacy/cookies pages — recommend hiring a localization lawyer-translator service like Acclaro or TextMaster. Budget ~$200-500 per locale for legal pages.

**For your stage (smoke test pre-validation):**
- Use DeepL for content pages
- Hold off on legal page translation until you have paying customers in those regions
- Add a banner in non-translated pages: "Legal documents currently available in English only"

### TODO banner cleanup

Each new locale file has this comment near `<body>`:
```html
<!-- TRANSLATION_TODO: This page is in English. Native [Language] translation needed. -->
```

When a file is translated, **remove this comment** as part of the translation commit. This serves as a tracking mechanism — `grep -r TRANSLATION_TODO` shows what's still pending.

---

## Deployment notes

### Pre-deploy checklist

- [ ] Verify Form ID `9373906` is still correct in all locale `index.html` files
- [ ] Test currency switcher on a new locale (e.g., open `/sv/?currency=SEK` and verify SEK prices appear)
- [ ] Test timezone detection by changing system timezone to Europe/Stockholm and visiting site
- [ ] Verify sitemap.xml is accessible at `/sitemap.xml`
- [ ] Verify robots.txt allows all locale paths

### Post-deploy actions

- [ ] Submit updated sitemap.xml to Google Search Console
- [ ] Submit updated sitemap.xml to Bing Webmaster Tools
- [ ] Verify hreflang tags via Google's hreflang testing tool
- [ ] Monitor Search Console for "Discovered - currently not indexed" errors on new locales (normal for first 1-4 weeks)

### Risk areas

1. **Pricing changes affect existing customers** — see PRICING CHANGES section
2. **English content in new locales** could hurt SEO ranking if Google sees it as duplicate content. Hreflang tags should mitigate this, but expect 2-4 weeks for new locales to start indexing properly.
3. **EU compliance** — VAT not displayed on prices. For EU locales (pt-PT, fr, de, it, nl), B2C law requires showing VAT-inclusive prices for consumers. Currently displaying tax-exclusive. **Resolve before paid traffic in EU.**

---

## Files modified summary

**New files (168):**
- `pt-PT/`, `fr/`, `de/`, `it/`, `nl/`, `sv/`, `da/`, `pl/`, `cs/`, `hu/`, `ro/`, `ka/` × 14 HTML each

**Modified files (98):**
- `currency.js` — major rewrite v3
- `sitemap.xml` — full regeneration
- `index.html` (root, en) — hreflang + og:locale updates
- All 14 HTML files in `en/`, `es-mx/`, `es-ar/`, `es-ES/`, `pt-BR/`, `ru/`, `uk/` — hreflang + og:locale updates

**Total HTML files in archive:** 266 (across 19 locales)

**Total file count change vs. v41:** +168 new files, ~98 modified

---

## Questions when resuming

If/when picking this up in a new session, useful starting questions:

1. **Are translations done?** `grep -r TRANSLATION_TODO` shows pending files
2. **Did paid traffic start in any new locale?** If yes, tier-1 translations should be priority
3. **Any pricing complaints from existing customers?** Verify pricing changes didn't break grandfathered rates
4. **EU VAT regulation status?** Stripe Tax / Paddle should be set up before ad spend in EU locales
