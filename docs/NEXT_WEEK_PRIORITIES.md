# Next-Week Priorities — VetScan post-launch

> Created: April 27, 2026 (launch day)
> Owner: Yura
> Use this as a self-managed checklist for the next 7 days.

---

## Day 1 (today) — DONE ✅

- ✅ Production deploy on `vetscan.app`
- ✅ DNS migrated to new Vercel infrastructure (`216.198.79.1`)
- ✅ www→apex 308 redirect working
- ✅ SSL/TLS verified (TLS 1.3 + ChaCha20)
- ✅ Security headers grade A
- ✅ All 6 locales smoke-tested (no /uk/uk/ redirect bug after hotfix)
- ✅ Cookie banner GDPR-compliant on all locales
- ✅ GA4 Realtime confirmed working with `consent_choice` event
- ✅ Sitemap submitted to Google Search Console
- ✅ Domain ownership verified

---

## Day 2-3 — Legal & paid traffic prep

### Priority 1 — Send AR lawyer email
- [ ] Find consumer-protection lawyer through Colegio Público de Abogados
- [ ] Send template from `docs/AR_LAWYER_EMAIL_TEMPLATE.md`
- [ ] Mark `es-AR` as "🟡 In review" in `docs/LEGAL_REVIEW.md`
- [ ] Expected response: 2-3 days

### Priority 2 — Prepare EN paid traffic test
EN doesn't need legal review for soft-launch (you have standard Terms,
Medical Disclaimer, Privacy Policy that are best-practice for US/CA).

- [ ] Set up Meta Ads Manager account (or use existing)
- [ ] Create first ad campaign:
  - Audience: US dog owners 25-55, with interests in pet health
  - Budget: $30-50/day (low signal-validation budget)
  - Creative: hero image + headline "Know if your dog needs a vet — in 60 seconds"
  - Landing: `https://vetscan.app/`
  - Conversion tracking: `waitlist_signup` event in GA4

- [ ] Same setup on Google Ads (search + display)
- [ ] Ad creative variants: minimum 2 to A/B test

### Priority 3 — Setup Kit (ConvertKit) email automation
- [ ] In Kit dashboard: create welcome email sequence (3-5 emails)
- [ ] Email 1 (Day 0): "Welcome — here's what to expect"
- [ ] Email 2 (Day 2): "How VetScan triages — methodology"
- [ ] Email 3 (Day 5): "Real example: dog limping"
- [ ] Email 4 (Day 10): "Beta access details + position update"
- [ ] Email 5 (Day 14): "Founder Q&A — ask me anything"

---

## Day 4-5 — Validate & iterate

### Priority 1 — Watch GA4 daily
- [ ] Open GA4 → Acquisition → Traffic acquisition
- [ ] Check: paid traffic actually arrives (UTM tags from ads)
- [ ] Check: bounce rate <70% on landing page
- [ ] Check: at least 3-5% of visitors submit waitlist email
- [ ] If <3% conversion: investigate why (heatmap via Hotjar, copy revisions)

### Priority 2 — Respondent.io interviews
- [ ] Sign up at https://www.respondent.io/ as researcher
- [ ] Create study: "30-min interview with US dog owners about pet emergencies"
- [ ] Compensation: $30/interview (industry standard)
- [ ] Goal: 5-10 completed interviews in first week
- [ ] Questions to ask:
  - "Walk me through last time your dog acted strange — what did you do?"
  - "How did you decide whether to call a vet vs. wait it out?"
  - "If a tool gave you a triage answer in 60 seconds, what would make
     you trust it vs. not trust it?"
  - "What's an acceptable price per use? Per month?"

### Priority 3 — Hreflang validation in Search Console
- [ ] Search Console → Legacy tools → International Targeting → Languages
- [ ] Should show 0 errors after Google has crawled the sitemap
- [ ] If errors: paste first 3 in chat, will diagnose

---

## Day 6-7 — Decisions & next steps

### Decision point #1: AR legal review status

**If lawyer responded with green light (with or without changes):**
- [ ] Apply requested changes to `es-ar/*` HTML files
- [ ] Set `LEGAL_REVIEWED_LOCALES = ['es-ar']` in `analytics.js`
- [ ] Push to main, Vercel deploys
- [ ] Verify yellow banner is gone on `/es-ar/privacy.html`
- [ ] **Begin AR paid traffic** (budget $30-50/day same as US)

**If lawyer hasn't responded yet:**
- [ ] Send polite follow-up
- [ ] Continue without AR traffic this week

### Decision point #2: EN traffic results

After 5-7 days of $30-50/day on EN:
- [ ] **CPC**: should be $0.50-2.00 (US) or below
- [ ] **CTR**: should be 1-3% on display, 3-5% on search
- [ ] **Conversion to waitlist**: 3-5% of landings
- [ ] **CPL** (cost per lead): should be <$10

If above hold true: scale ad budget 2x for next week.
If they don't: stop spend, iterate copy/audience.

### Decision point #3: Performance optimization?

PageSpeed mobile is at **55**. Worth investing time in:
- Compress + lazy-load the dog mascot SVG
- Inline critical CSS, defer non-critical
- Subset Pretendard font to only used glyphs

Only do this if:
- Daily traffic >500 visits (otherwise rounding error)
- Bounce rate is high (>70%) AND analytics blame slow load
- Core Web Vitals matter for SEO (it does, eventually)

Otherwise: defer to month 2.

---

## Recurring tasks

### Weekly
- [ ] Check GA4 dashboards (10 min)
- [ ] Review ad spend & CPL across platforms (10 min)
- [ ] Reply to user emails / Kit replies (varies)

### Monthly
- [ ] Refresh `<lastmod>` in sitemap.xml (if content changed)
- [ ] Update `Last reviewed:` dates in legal pages if anything changed
- [ ] Re-run PageSpeed Insights — track Performance score over time

### Annually (calendar reminder!)
- [ ] **April 1, 2027**: renew `Expires:` in `/.well-known/security.txt`
- [ ] Refresh AR/BR/MX/UA legal review (laws update)
- [ ] Verify SSL cert auto-renewal happened (Let's Encrypt every 90 days, but check)

---

## When to expand to other locales

In order of priority (already discussed):

1. ✅ **EN (already live)** — soft-launch this week
2. 🟡 **AR (in legal review)** — go-live within 2 weeks
3. ⏳ **BR** — start lawyer email after AR approval (different lawyer needed —
   Brazilian + LGPD specialist)
4. ⏳ **MX** — start lawyer email when AR has data showing Latam works
5. ⏳ **UA** — kick off translation refinement based on early UA feedback;
   legal review with Ukrainian lawyer
6. (Tier 4 maybe later: PL, DE, FR, JP — only after first 3 markets validate)

---

## When to celebrate 🎉

- First waitlist signup that's NOT from your test traffic
- First customer interview that says "I'd pay for this"
- First $100 spent on ads with positive unit economics
- 100 emails on waitlist
- First media mention / Twitter share by stranger
- Lawyer green-light on AR (= unblock first non-US market)

---

## When to NOT panic

- PageSpeed mobile <80 — okay for marketing site, focus on conversion
- 0 organic Google traffic in week 1 — Google takes 2-4 weeks to rank new domains
- High bounce rate (60-80%) on first day — it's normal, optimize copy
- AR lawyer not responding for 3 days — they're busy, send follow-up

---

## When to actually panic

- Sudden GA4 drop to 0 events for >24 hours — site might be broken, check it
- Vercel deploys failing — check logs, possibly revert
- Cease-and-desist from any veterinary association — lawyer up immediately
  (this is a real risk in some jurisdictions for AI-medical adjacent products)
- Domain registrar email "your domain is suspended" — pay renewal NOW
