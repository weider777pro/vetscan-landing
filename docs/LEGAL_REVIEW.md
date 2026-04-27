# Legal Review — Master Document

> **Purpose:** Coordinate local-counsel review of VetScan's translated legal pages
> before paid-traffic launch in each jurisdiction.

---

## 1. Why this exists

VetScan's English legal pages (`privacy.html`, `terms.html`, `disclaimer.html`,
`cookies.html`, `security.html`, `accessibility.html`) are written under
US law (Delaware governing law, $100 liability cap, US-style indemnification).

The translated versions are **literal translations of the EN source**, with
two safety nets pre-installed:

1. **Yellow translation banner** at the top of every Tier 3 page in every
   non-EN locale, stating: "Translation under legal review — English version
   takes precedence in case of conflict."

2. **Consumer carve-out** in Section 16 of `terms.html` (every locale):
   restores the consumer's right to bring claims in their home jurisdiction
   and the application of mandatory local consumer-protection laws.

These cover ~80% of the enforceability risk out of the box. **Local counsel
review is still required** before serious paid traffic in each market —
because mandatory local rules differ in detail, and what's enforceable in
Argentina is not identical to what's enforceable in Brazil.

---

## 2. Status grid

| Locale | Country target  | Reviewed by | Date | Banner removed |
|--------|-----------------|-------------|------|----------------|
| en     | US (source)     | n/a         | n/a  | n/a (no banner)|
| uk     | Ukraine         | ☐           |      | ☐              |
| ru     | Kazakhstan, RU diaspora | ☐   |      | ☐              |
| es-mx  | Mexico, CO, PE  | ☐           |      | ☐              |
| es-ar  | Argentina, CL, UY | ☐         |      | ☐              |
| pt-BR  | Brazil          | ☐           |      | ☐              |

When you commission a review, fill in the row.

---

## 3. The 6 pages a lawyer must look at, per locale

For each locale `{loc}`, the lawyer needs to review these 6 files:

```
{loc}/privacy.html        — GDPR/LGPD-style privacy policy
{loc}/terms.html          — Terms of use (incl. Section 16 dual-jurisdiction)
{loc}/disclaimer.html     — Medical / AI disclaimer (highest liability risk)
{loc}/cookies.html        — Cookie disclosure + consent mechanism
{loc}/security.html       — Security posture (informational; lower priority)
{loc}/accessibility.html  — WCAG 2.1 AA commitment (informational)
```

**Priority order if budget is tight:** disclaimer → terms → privacy → cookies
→ security → accessibility. The first three carry virtually all the legal risk.

---

## 4. Universal questions to send to local counsel

Send these alongside the 6 page URLs. Same questions for every jurisdiction.

### 4.1 Disclaimer (highest risk — pet medical AI)

1. Does the "informational only, not veterinary advice" disclaimer in Section
   1 of `disclaimer.html` survive scrutiny under your country's consumer
   protection / professional services regulation?
2. Section 13 (Limitation of Liability) waives claims for "harm, injury,
   illness, death" of the pet. Is this waiver enforceable for consumers?
   Does mandatory local law preserve any minimum liability we cannot contract
   out of?
3. Do veterinary practice acts in your country regulate "AI-assisted health
   triage"? Do we need any registration, disclaimer language, or licensing
   in addition to what's currently shown?
4. The page lists US-only emergency hotlines (ASPCA, Pet Poison Helpline).
   Should we add a country-specific emergency vet line for {locale}? If
   yes, please suggest a vetted public/private number.

### 4.2 Terms of Use

5. Section 11 caps total liability at $100. Is this enforceable for consumers
   in your jurisdiction, or does mandatory local consumer law set a higher
   floor?
6. Section 16 has a dual-jurisdiction consumer carve-out — Delaware courts
   for B2B, plus consumer's home courts and mandatory local consumer-protection
   laws. Is this drafting sufficient under your law, or does it need
   reinforcement (e.g., explicit Brazilian CDC §51 reference)?
7. Section 12 (Indemnification) — typical US-style. Are there mandatory local
   limits that override?

### 4.3 Privacy Policy

8. Does our privacy policy meet local data-protection requirements (GDPR for
   UA, LGPD for BR, LFPDPPP for MX, Ley 25.326 for AR, Закон о персональных
   данных for KZ/RU diaspora)?
9. Are the data-subject rights enumerated correctly for your country
   (access, rectification, erasure, portability, objection)?
10. Do we need a local Data Protection Officer (DPO) representative or
    registered data importer designation?
11. Cross-border transfers: we use Vercel (US/EU), Google Workspace (US/EU),
    Cloudflare (global). Are SCCs / equivalent local safeguards adequate?

### 4.4 Cookies

12. Cookie consent mechanism: site uses an opt-in banner with Accept/Reject
    buttons, default consent state is "denied" (Google Consent Mode v2).
    Does this comply with your local ePrivacy / cookie law?
13. The banner is text-only (no granular per-category toggles). Is this
    acceptable, or does local law require granular preferences (analytics
    on/off, marketing on/off, etc.)?

### 4.5 Cross-cutting

14. Is the yellow translation banner's wording itself acceptable, or does
    local law mandate specific phrasing?
15. Are there any document we are MISSING that's mandatory in your
    jurisdiction (e.g., a "Right to be forgotten" page, a Spanish-specific
    "Aviso Legal", a Brazilian "Termos e Condições" with specific clauses)?
16. Is "VetScan" usable as a brand mark in your jurisdiction, or are there
    conflicts with existing veterinary trademarks?

---

## 5. After lawyer sign-off — removing the yellow banner

Once a lawyer has reviewed all 6 pages for a given locale and given written
sign-off (record date and lawyer's name in the status grid above), do the
following **single edit** to remove the yellow translation banner across all
6 Tier 3 pages for that locale:

**File:** `analytics.js`

**Find:**
```js
var LEGAL_REVIEWED_LOCALES = [];
```

**Replace with** (example after Brazilian sign-off):
```js
var LEGAL_REVIEWED_LOCALES = ['pt-BR'];
```

After multiple sign-offs:
```js
var LEGAL_REVIEWED_LOCALES = ['pt-BR', 'es-ar', 'uk'];
```

That single edit hides the yellow banner across all 6 Tier 3 pages for
each listed locale, on next page load. No HTML edits required.

The English source page never has the banner — `en` is implicit and
should not be added to this list.

---

## 6. Per-jurisdiction briefs

See `docs/jurisdiction-briefs/`:

- [`UA.md`](jurisdiction-briefs/UA.md) — Ukraine
- [`AR.md`](jurisdiction-briefs/AR.md) — Argentina
- [`MX.md`](jurisdiction-briefs/MX.md) — Mexico
- [`BR.md`](jurisdiction-briefs/BR.md) — Brazil

Each brief lists country-specific risk points the lawyer should focus on,
on top of the universal questions above.

---

## 7. Cost expectations & how to find local counsel

Realistic ranges for a fixed-scope review of 6 pages of a US-style legal
template, translated into local language:

| Country  | Typical cost (USD) | Where to look |
|----------|--------------------|---------------|
| Ukraine  | $400 – $800        | Ukrainian Bar Association lawyer directory; LinkedIn search "юрист IT Україна" |
| Argentina| $500 – $1,200      | CABA Bar Association; "Abogado IT/protección de datos Buenos Aires" |
| Mexico   | $600 – $1,500      | Barra Mexicana CDMX; "Abogado tecnología CDMX privacidad" |
| Brazil   | $700 – $2,000      | OAB-SP / OAB-RJ TI committees; "Advogado tecnologia LGPD São Paulo" |

**Tips:**
- Ask for a fixed fee, not hourly, for this scope. Most IT-law firms quote
  flat fees for "termos e condições review" / "review legal de Términos".
- Send the 6 page URLs + this document + the relevant `jurisdiction-brief.md`
  in one email. Don't send pages one by one.
- Get the lawyer's **written confirmation by email** before flipping the
  banner switch. Save the email — it's your proof of due diligence if a
  consumer claim arises later.

---

## 8. What's NOT in scope for this review

The review covers **legal text on the marketing site**. It does not cover:

- Tax / VAT / consumer billing law (will be relevant once you start charging,
  not now during waitlist phase)
- Employment / contractor law for veterinary advisors (relevant when you
  formally engage your first vet)
- Trademark registration in each country (this is a separate workstream —
  consider WIPO Madrid Protocol after MVP traction)
- Marketing law / advertising restrictions specific to pet healthcare claims
  (relevant once paid creative starts running — review ad copy separately)

---

_Last updated: April 27, 2026._
