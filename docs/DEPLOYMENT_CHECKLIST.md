# Deployment Checklist — VetScan

> Step-by-step verification to perform after pushing to Vercel and before
> spending real money on paid traffic. Each item ends with a green-light
> criterion.

**Project:** vetscan.app (static marketing site)
**Stack:** GitHub → Vercel (auto-deploy on push to `main`)
**Owner:** Yura
**Last updated:** April 27, 2026

---

## 0. Pre-deploy sanity (run locally before push)

- [ ] **Project size:** `du -sh "vetscan-deploy 13"` should be ~10–12 MB.
      _Green-light:_ size is reasonable; no node_modules / venv accidentally committed.
- [ ] **No stub pages:** `grep -rn "Translation in progress\|Ця сторінка перекладається\|Эта страница переводится\|Esta página se está traduciendo\|Esta página está sendo traduzida" --include="*.html"` should return **empty**.
      _Green-light:_ 0 matches.
- [ ] **No .DS_Store / .env / secrets:** `find . -name ".DS_Store" -o -name ".env*" -o -name "*.pem"` should return **empty**.
- [ ] **Local preview:** `cd "vetscan-deploy 13" && python3 -m http.server 8000` → open <http://localhost:8000/>, click 5 random links across 3 locales, confirm no 404s.
      _Green-light:_ all internal links resolve.

---

## 1. Initial deploy (Vercel)

1. [ ] Push to `main` branch on GitHub. Vercel auto-deploys.
2. [ ] In Vercel dashboard, wait for deploy to **succeed** (green check).
3. [ ] Click the deployment URL (e.g., `vetscan-deploy-13-xxxxx.vercel.app`) — site loads, English homepage renders.
       _Green-light:_ build succeeded; preview URL serves the homepage.
4. [ ] **Promote to production** if behind a preview-only setup. Confirm `vetscan.app` now points at this build.

---

## 2. DNS + Domain

- [ ] **Apex `vetscan.app` resolves**: `dig +short vetscan.app A` → returns Vercel IPs (76.76.19.x or 76.76.21.x).
- [ ] **www subdomain redirects to apex**: `curl -sI https://www.vetscan.app/ | head -3` →
      ```
      HTTP/2 308
      location: https://vetscan.app/
      ```
      _Green-light:_ status `308` (permanent redirect), location is apex. **Anything else (302, 200) is broken.**
- [ ] **HTTPS enforced**: `curl -sI http://vetscan.app/ | head -3` → status `308`, location is `https://vetscan.app/`.

---

## 3. SSL + Security headers

- [ ] **SSL Labs A+**: visit <https://www.ssllabs.com/ssltest/analyze.html?d=vetscan.app> — score must be **A or A+**.
      _Green-light:_ A or A+. B is acceptable for week 1; anything below B is a blocker.
- [ ] **securityheaders.com A+**: visit <https://securityheaders.com/?q=vetscan.app> — must be **A or A+**.
      _Expected headers (from `vercel.json`):_
      - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
      - `X-Content-Type-Options: nosniff`
      - `X-Frame-Options: SAMEORIGIN`
      - `Referrer-Policy: strict-origin-when-cross-origin`
      - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- [ ] **HSTS preload submission** (optional, do once site is stable for 14+ days): submit `vetscan.app` at <https://hstspreload.org/>.
      _Note:_ HSTS preload is a one-way commitment. Do NOT submit until you are sure HTTPS will never be turned off.

---

## 4. `.well-known/security.txt`

- [ ] `curl -s https://vetscan.app/.well-known/security.txt` returns the file with:
      - `Contact: mailto:hello@vetscan.app`
      - `Expires:` date in 2027
      - `Canonical: https://vetscan.app/.well-known/security.txt`
- [ ] Content-Type is `text/plain`.
- [ ] **Security.txt validator**: paste content into <https://securitytxt.org/> and confirm it parses without errors.
      _Green-light:_ "Your security.txt file is valid".

---

## 5. Localization — geo & redirect smoke test

Run each test in an **incognito window** to avoid cookie pollution.

| Test from | Expected behavior |
|---|---|
| **Ukrainian VPN** (Kyiv) → `https://vetscan.app/` | Edge middleware redirects to `https://vetscan.app/uk/` (HTTP 307). `<html lang="uk">` and Ukrainian copy in hero. |
| **Russian VPN** (Moscow or any KZ city) → `https://vetscan.app/` | Redirects to `https://vetscan.app/ru/`. |
| **Mexican VPN** (CDMX) → `/` | Redirects to `/es-mx/`. |
| **Argentinian VPN** (Buenos Aires) → `/` | Redirects to `/es-ar/`. |
| **Brazilian VPN** (São Paulo) → `/` | Redirects to `/pt-BR/`. |
| **US VPN** → `/` | Stays on `/` (English). |

Verification commands (from any client, simulating geo via header):
```bash
curl -sI -H "x-vercel-ip-country: UA" https://vetscan.app/ | head -3
curl -sI -H "x-vercel-ip-country: AR" https://vetscan.app/ | head -3
```

- [ ] All 6 above behaviors confirmed.
- [ ] **Locale stickiness:** after auto-redirect, `vs_lang_chosen` is set in sessionStorage. Refreshing the page does NOT re-redirect.
- [ ] **Manual override works:** `https://vetscan.app/ru/` directly always serves Russian, regardless of geo.

---

## 6. Page-level checks per locale

For **each of 6 locales** (`en`, `uk`, `ru`, `es-mx`, `es-ar`, `pt-BR`), open the homepage and verify:

- [ ] Hero h1, CTA buttons, and footer links display in the correct language (no English fallthrough).
- [ ] Navigation menu items are localized.
- [ ] Footer language switcher shows the current locale as "current" (non-link).
- [ ] All 5 Tier 1 pages (index, about, pricing, how-it-works, faq) load without errors.
- [ ] All 6 Tier 3 pages (privacy, terms, disclaimer, cookies, security, accessibility) display the **yellow translation banner** at the top (locales other than EN).
- [ ] Spot-check an `og:image` URL: `view-source:` on `/uk/index.html` → search `og:image` → URL ends in `og-image-uk.png`.

---

## 7. SEO meta — sample-check

Open <https://vetscan.app/uk/disclaimer.html> and view source:
- [ ] `<title>` = "Застереження — VetScan"
- [ ] `<link rel="canonical" href="https://vetscan.app/uk/disclaimer.html">`
- [ ] `<meta property="og:locale" content="uk_UA">`
- [ ] `<meta property="og:image" content="https://vetscan.app/og-image-uk.png">`
- [ ] **5 hreflang alternate** links + 1 `x-default` link present.

Repeat for one Spanish locale (`es-ar/security.html`) and `pt-BR/cookies.html` to catch regressions.

---

## 8. Sitemap + robots.txt

- [ ] `curl -s https://vetscan.app/robots.txt` returns 200, includes:
      `Sitemap: https://vetscan.app/sitemap.xml`
- [ ] `curl -s https://vetscan.app/sitemap.xml | head -20` returns valid XML, contains `<urlset>` and starts with the homepage.
- [ ] Sitemap URL count: `curl -s https://vetscan.app/sitemap.xml | grep -c '<url>'` should be **84**.
- [ ] **Sitemap validator**: paste URL into <https://www.xml-sitemaps.com/validate-xml-sitemap.html>. Must validate.

---

## 9. Cookie consent (GDPR/LGPD critical)

In **incognito**, visit `/uk/privacy.html` (i.e. NOT homepage):
- [ ] Yellow cookie banner appears at the bottom (auto-injected by `analytics.js`).
- [ ] Banner text is in Ukrainian: "Ми використовуємо cookies".
- [ ] Click **"Відхилити"** → banner disappears, page works fine.
- [ ] In DevTools → Application → Cookies → confirm `vetscan_consent=rejected` is set.
- [ ] Refresh page → banner does NOT reappear.
- [ ] Network tab → confirm `_ga` cookie is **NOT** set (consent denied = no analytics).

Now in another incognito window, visit `/`:
- [ ] Click **Accept** on banner → `vetscan_consent=accepted` is set.
- [ ] Network tab → `_ga` cookie IS set, `gtag` events are fired (visible in GA4 DebugView within ~30s).

Repeat the **decline** test on at least one other locale (e.g., `pt-BR/disclaimer.html`) to confirm injection works on direct-landing pages.

---

## 10. GA4 Realtime — events & dimensions

In Google Analytics → Reports → Realtime:

- [ ] After accepting cookies on `/uk/`, your session shows up with:
      - Country: Ukraine (or your VPN's country)
      - **Custom dimension `locale = uk`** present on the page_view event
- [ ] Click an internal link (e.g., from `/uk/` to `/uk/about.html`) → second `page_view` event fires.
- [ ] Test the language switcher: click footer "English" link → `language_switched` event fires with `from=uk, to=en`.
- [ ] Click a `Coming soon — App Store` button → `coming_soon_click` event with `store=ios`.
- [ ] Confirm GA4 measurement ID in source matches `G-2NJ79MK250` (and **only that** — no stray testing IDs).

---

## 11. Forms (Kit / waitlist)

- [ ] **Email signup form (top of homepage)**: enter a real test email → submit → no JS errors in console → confirmation message appears.
- [ ] Check Kit (ConvertKit) dashboard: the email is in the subscriber list, tagged with the correct locale source.
- [ ] **Position counter**: on `/index.html`, the "You'll be #1247th" counter is visible in the hero. Confirm it's not literally `#1247th` for everyone — should reflect waitlist size from your backend OR a hardcoded baseline (1247) + locale-specific increment.

---

## 12. Search Console submission

In Google Search Console:

- [ ] Verify domain ownership for `vetscan.app` (DNS TXT record method recommended).
- [ ] Submit sitemap: `https://vetscan.app/sitemap.xml`.
- [ ] Within 24h, Search Console should report **84 discovered URLs**.
- [ ] **Hreflang validation** in Search Console → International Targeting → Languages tab should show **0 errors** after first crawl (typically 3–7 days).

---

## 13. Performance baseline

Run [PageSpeed Insights](https://pagespeed.web.dev/) on:
- `https://vetscan.app/`
- `https://vetscan.app/uk/pricing.html`
- `https://vetscan.app/pt-BR/disclaimer.html` (longest legal page)

Mobile scores target:
- [ ] Performance: ≥85
- [ ] Accessibility: ≥95
- [ ] Best Practices: 100
- [ ] SEO: 100

If Performance < 70 on mobile for any page: investigate (likely culprit: render-blocking CSS or large images).

---

## 14. Legal review (per-jurisdiction green-light)

Before paid traffic in each market, complete the workflow in [`docs/LEGAL_REVIEW.md`](LEGAL_REVIEW.md):

1. [ ] Send 6 Tier-3 page URLs + relevant `docs/jurisdiction-briefs/{country}.md` to local lawyer.
2. [ ] Apply any requested wording changes.
3. [ ] Get written approval (email; archive in Google Drive).
4. [ ] Add locale code to `LEGAL_REVIEWED_LOCALES` array in `analytics.js`. Push to main.
5. [ ] Verify yellow banner is gone for that locale.
6. [ ] Update status grid in `docs/LEGAL_REVIEW.md` with lawyer name + sign-off date.

**Recommended order (by enforceability risk and market priority):**
1. Argentina (highest consumer-protection risk, most restrictive jurisdiction)
2. Brazil (LGPD + CDC complexity)
3. Mexico
4. Ukraine
5. (English EN is the source-of-truth, no banner; review by US counsel optional but recommended before any US traffic.)

---

## 15. Final green-light criteria for paid traffic

| Criterion | Target |
|---|---|
| Production site live on `vetscan.app` | ✅ |
| `www → apex` 308 redirect | ✅ |
| SSL Labs grade | A or A+ |
| securityheaders.com grade | A or A+ |
| Sitemap submitted to Search Console | ✅, 0 hreflang errors |
| Mobile PageSpeed performance | ≥80 |
| Cookie banner working on all 6 locales | ✅ (manual smoke test) |
| GA4 Realtime sees events with `locale` dimension | ✅ |
| At least 1 Tier-3 locale legally cleared | ✅ for that market |
| Test email captured in Kit | ✅ |

Once all green: spend on first 50€/$50 worth of paid traffic in the cleared market. Validate CPC + waitlist conversion before scaling.

---

## 16. After launch — recurring tasks

| Cadence | Task |
|---|---|
| **Weekly** | Check GA4 for unusual error rates, drop-offs in waitlist conversion. |
| **Monthly** | Refresh `/sitemap.xml` `<lastmod>` if added. Check for new Tier-3 changes. |
| **Quarterly** | Re-review accessibility (WCAG audit). Update `Last reviewed` date in security.html. |
| **Annually** | **Renew `Expires:` in `/.well-known/security.txt`** — must be < 1 year ahead. Calendar reminder for April 1, 2027. |
| **Annually** | Refresh legal review (jurisdictions update consumer-protection laws). |

---

## 17. Emergency rollback

If a deploy breaks production:

1. Vercel dashboard → Deployments → find last green deploy → **"Promote to Production"**.
2. Or: `git revert <commit-sha> && git push` (Vercel will redeploy in ~30s).
3. **DO NOT** delete the broken deployment until you've root-caused the failure — the logs are valuable.
