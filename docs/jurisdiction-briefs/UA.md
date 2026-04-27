# Ukraine — Jurisdiction Brief

> Country-specific points for local legal review of `uk/*.html` pages.
> Read alongside [`docs/LEGAL_REVIEW.md`](../LEGAL_REVIEW.md).

## Locale

`uk` — Ukrainian language, intended for users in Ukraine and Ukrainian-speaking
diaspora. (Russian-speaking users in Ukraine and Kazakhstan use the `ru` locale,
covered in a separate brief.)

## Applicable law

- **Закон України «Про захист персональних даних»** (Personal Data Protection
  Act of Ukraine, 2010 with subsequent amendments)
- **Закон України «Про електронну комерцію»** (E-Commerce Act, 2015)
- **Закон України «Про захист прав споживачів»** (Consumer Rights Protection
  Act, 1991 with major 2023 amendment harmonizing with EU consumer directives)
- **Цивільний кодекс України**, Articles 633–642 (consumer contract / public
  offer rules)
- **GDPR** — applies extraterritorially when the service targets EU residents
  or processes data of EU residents. Ukrainian privacy law is broadly
  GDPR-compatible since 2023 amendments.
- **Регламент 2018/1725 (EU)** — relevant for cross-border transfers if EU
  users are reached via the `uk` locale.

## Points to verify

### Privacy

1. Confirm that our Privacy Policy meets the format required by the
   Ukrainian Personal Data Protection Act — particularly the requirement to
   disclose the **mета обробки** (processing purpose), **строки зберігання**
   (retention periods), and **права суб’єкта** (data subject rights).
2. Verify that mention of cross-border transfers (Vercel US/EU, Google
   Workspace US/EU, Cloudflare global) satisfies adequacy requirements.
   Since 2023, Ukraine recognizes EU GDPR as equivalent — but US transfers
   may need explicit consent or SCCs equivalent.
3. Do we need to register with the Ukrainian Data Protection Commissioner
   (Уповноважений Верховної Ради України з прав людини, ombudsperson office)
   given that we're a non-Ukrainian entity? If yes, what's the threshold
   (number of users, type of data)?

### Terms — consumer rights

4. Закон «Про захист прав споживачів» Article 18 prohibits contract clauses
   that limit consumer rights. Confirm our Section 11 ($100 cap) and
   Section 16 (Delaware governing law + consumer carve-out) hold up.
5. Confirm wording of consumer carve-out in Section 16 of `uk/terms.html` is
   clear in Ukrainian legal terms ("імперативні норми законодавства про
   захист прав споживачів").

### Disclaimer — pet-medical AI specifics

6. Ukrainian veterinary law (Закон «Про ветеринарну медицину», 1992 + 2017
   amendments) regulates "veterinary services". Does AI-assisted symptom
   triage qualify as a "veterinary service" requiring licensure, or as
   informational content (which is what we claim)?
7. The disclaimer mentions only US poison hotlines. Recommend adding a
   Ukrainian emergency vet line — local counsel may know a public/charity
   line. Otherwise we direct to "your local veterinarian".

### Cookies

8. The current cookie banner is opt-in with two buttons (Accept/Reject)
   and default-denied state. Confirm this is sufficient under Ukrainian
   ePrivacy practice (which generally aligns with EU ePrivacy Directive).
9. Verify that cookie names listed in `cookies.html` (`_ga`, `_fbp`, etc.)
   accurately match what the page actually sets, and that retention periods
   are correct.

### Marketing claims (relevant when paid traffic launches)

10. Avoid medical-claims language in Ukrainian marketing copy. Closest local
    standard: Закон «Про рекламу» Article 21 (medical product advertising
    restrictions) — does it apply to pet AI services? Probably not, but
    confirm.

## Likely small fixes

These are common issues we expect a Ukrainian lawyer to flag:

- May suggest more formal Ukrainian terminology in `terms.html` Section 4
  (Accounts and Registration) — "обліковий запис" preferred over "акаунт"
  in formal legal text. Currently we use "акаунт" for friendliness; the
  lawyer may want "обліковий запис" in legal sections only.
- Add reference to Ukrainian Civil Code Article 634 (public offer) in
  Section 1 of Terms.
- Add specific timeframe for response to data-subject access requests
  (Ukrainian law: 30 days; GDPR: 30 days, extendable).

## After sign-off

Once approved, edit `analytics.js`:

```diff
- var LEGAL_REVIEWED_LOCALES = [];
+ var LEGAL_REVIEWED_LOCALES = ['uk'];
```

This hides the yellow translation banner across all 6 Tier 3 pages
(`uk/privacy.html`, `uk/terms.html`, `uk/disclaimer.html`, `uk/cookies.html`,
`uk/security.html`, `uk/accessibility.html`) on next page load.

Record the lawyer's name and sign-off date in the status grid in
`docs/LEGAL_REVIEW.md`, and keep their email approval as documentation.
