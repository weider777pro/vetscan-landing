# Monitoring Setup Guide

**Status:** Lightweight monitoring sufficient for validation stage. Heavier observability (Sentry, Datadog, New Relic) deferred until product-market fit.

---

## What we're already monitoring

### ✅ GA4 (Google Analytics 4) — already deployed
- **Property ID:** G-2NJ79MK250
- **Realtime traffic** visible at https://analytics.google.com
- **Custom events:** consent_choice (from analytics.js)
- **Standard events:** page_view, session_start, user_engagement

### ✅ Vercel built-in monitoring
- **Deployment status:** auto-emails on failed deploys
- **Edge function metrics:** latency, error rate (visible in dashboard)
- **Bandwidth usage:** monthly quota tracking
- **Domain health:** SSL cert renewal automatic, DNS valid checks

### ✅ Search Console
- **Indexing status:** sitemap submission tracked
- **Search performance:** queries, impressions, CTR
- **Crawl errors:** automatic email alerts for serious issues

---

## What to add (free, 15 min total)

### 1. GA4 alerts — get email on traffic anomalies (5 min)

GA4 has built-in **custom insights** that email you when metrics deviate from baseline.

**Setup:**
1. Open https://analytics.google.com → property G-2NJ79MK250
2. Bottom-left: **"Insights"** → **"Custom"**
3. Create alert: **"Traffic spike"**
   - Condition: `daily users` > `300% week-over-week average`
   - Why: catches viral moments OR bot attacks
4. Create alert: **"Conversion drop"**
   - Condition: `consent_choice` events drop > `50% week-over-week`
   - Why: catches broken cookie banner or tracking
5. Create alert: **"Bounce rate spike"**
   - Condition: `bounce rate` > `90%` for any locale
   - Why: catches broken page in specific market

### 2. Uptime monitoring — UptimeRobot (free, 5 min)

Vercel has 99.99% SLA, but you should know within 5 minutes if site goes down (DNS issue, deployment failure, payment lapse on Vercel).

**Setup:**
1. Sign up at https://uptimerobot.com (free for 50 monitors, 5-min checks)
2. Add monitors:
   - `https://vetscan.app/` (HEAD check, 5-min interval)
   - `https://vetscan.app/uk/` (one localized variant — sample)
   - `https://vetscan.app/sitemap.xml` (catches if static files broken)
3. Configure email alerts to hello@vetscan.app
4. Optional: SMS alerts (paid tier $7/mo) for critical incidents

### 3. Search Console email alerts (5 min)

Default Search Console emails are passive. Make them actionable:

1. https://search.google.com/search-console
2. Settings → Email preferences
3. Enable:
   - ✅ Critical issues (always)
   - ✅ Coverage issues (catches if /es-ES/ pages don't index)
   - ✅ Mobile usability (catches our mobile overflow bugs we just fixed)
   - ✅ Manual actions (catches if Google penalizes us)
   - ✅ Security issues (catches if site hacked)

---

## Things worth measuring weekly (5 min each Monday)

### Conversion funnel snapshot

Open GA4 → "Reports" → "Engagement" → "Events":

| Metric | Healthy range | Action if outside |
|---|---|---|
| Total users (last 7d) | Growing 10-50%/week | If flat: increase ad spend or test new copy |
| Session duration | >30s avg | If <30s: page content not engaging |
| Pages per session | >1.5 | If 1.0: visitors bounce immediately |
| `consent_choice` count | Should match user count roughly | If lower: cookie banner broken |

### Locale breakdown

GA4 → "Demographics" → "Country":

- Are paid traffic users converting? (US/CA/UK if running ads)
- Is es-ES getting any traffic? (validates EU expansion was right)
- Surprise traffic from any country? (could indicate viral moment somewhere)

### Search Console weekly check

- Are new pages indexing? (Total indexed should grow each week)
- Any new "Coverage" errors? (Click "Pages" → "Why pages aren't indexed")
- Top-performing queries? (Use as content marketing inspiration)

---

## What NOT to add yet

These are common "best practices" but premature for validation stage:

- ❌ **Sentry / Bugsnag** — JS error tracking. Useful for production product (real users). Static landing has minimal JS, low error surface.
- ❌ **Datadog / New Relic** — Application monitoring. For backend services we don't have.
- ❌ **LogRocket / FullStory** — Session replay. Privacy concerns + costs $99+/mo. Only useful when you have a real product UX to optimize.
- ❌ **Hotjar heatmaps** — Useful but redundant with Plausible/GA4 funnel. Add later if needed.
- ❌ **PagerDuty** — On-call alerting. Solo founder, you ARE the pager.

**Trigger to revisit:** When you have $5K+/mo recurring revenue OR a real product (not landing) in production.

---

## Health check command (manual, when needed)

Save this in your shell as `vetscan-health.sh`:

```bash
#!/bin/bash
# Quick production health check — run anytime
echo "=== VetScan health check ==="
echo

for url in \
  "https://vetscan.app/" \
  "https://vetscan.app/uk/" \
  "https://vetscan.app/es-ES/" \
  "https://vetscan.app/sitemap.xml" \
  "https://vetscan.app/.well-known/security.txt" \
; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" = "200" ]; then
    echo "✅ $url → $status"
  else
    echo "❌ $url → $status"
  fi
done

echo
echo "=== SSL cert ==="
echo | openssl s_client -connect vetscan.app:443 -servername vetscan.app 2>/dev/null \
  | openssl x509 -noout -dates

echo
echo "=== DNS ==="
dig vetscan.app +short
dig www.vetscan.app +short
```

Run when you suspect issues: `bash vetscan-health.sh`

---

## Decision rule for adding monitoring

> "Don't add a monitor unless you'll act on it."

- ✅ **Add:** Uptime alert → I'll restart Vercel deploy if down
- ✅ **Add:** Conversion drop alert → I'll check tracking pixel
- ❌ **Skip:** CPU graphs → I have nothing to do with that data on a static site
- ❌ **Skip:** "Cool dashboards" → Vanity, not actionable

Apply this filter to every new monitoring tool someone recommends.

---

## Related docs

- `DEPLOYMENT_CHECKLIST.md` — pre-deploy checklist
- `SECURITY_POLICY.md` — incident response if security alert fires
- `NEXT_WEEK_PRIORITIES.md` — operational rhythm
