# Brazil — Jurisdiction Brief

> Country-specific points for local legal review of `pt-BR/*.html` pages.
> Read alongside [`docs/LEGAL_REVIEW.md`](../LEGAL_REVIEW.md).

## Locale

`pt-BR` — Brazilian Portuguese, conversational tone (tutor de cão, pet,
fale com a gente). Targeted at users in Brazil.

## Applicable law

- **LGPD — Lei Geral de Proteção de Dados Pessoais** (Lei 13.709/2018,
  in force since September 2020). Brazil's GDPR equivalent. Enforced by
  **ANPD** (Autoridade Nacional de Proteção de Dados), which has been
  ramping up enforcement since 2022.
- **CDC — Código de Defesa do Consumidor** (Lei 8.078/1990). One of the
  most consumer-friendly regimes globally. **Article 51** voids unfair
  contract terms — broad scope.
- **Marco Civil da Internet** (Lei 12.965/2014). Internet bill of rights.
  Mandates privacy-by-default, requires explicit consent for data
  processing in many cases.
- **Decreto 8.771/2016** — implementing regulation for Marco Civil.
- **Resolução CD/ANPD 2/2022** — small-business processing exception.
  Confirm if VetScan qualifies during waitlist phase.

## Points to verify (Brazil-specific risks)

### Privacy — LGPD compliance

1. **LGPD legal basis** for each processing activity must be documented.
   Confirm `pt-BR/privacy.html` clearly states the legal basis (consent,
   legitimate interest, contract, etc.) per Article 7 of LGPD for each
   data processing purpose.
2. **DPO requirement** — LGPD Article 41 requires designation of an
   "Encarregado pelo Tratamento de Dados Pessoais" (DPO equivalent) for
   any controller, with limited exceptions for small businesses (Resolução
   CD/ANPD 2/2022). Confirm if VetScan needs a Brazilian DPO at this
   stage. May be deferred until paid-traffic launch.
3. **ANPD registration** — confirm if our processing activities require
   ANPD registration or just internal record-keeping (Article 37).
4. **Cross-border transfers** — LGPD Articles 33–36 require adequacy or
   safeguards. ANPD has not yet issued an adequacy list. Confirm SCCs
   or equivalent are in place for Vercel (US/EU), Google Workspace
   (US/EU), Cloudflare (global).
5. **Children's data** — LGPD Article 14 requires specific consent for
   under-12 data. Our service is 18+ (per `terms.html` Section 2), but
   confirm we have age-gate mechanism if a minor signs up.
6. **Data subject rights workflow** — LGPD Article 18 lists 9 rights.
   Confirm `pt-BR/privacy.html` enumerates all 9 and provides a
   functional mechanism (`privacy@vetscan.app`) with 15-day response
   commitment.

### Disclaimer — pet-medical AI in Brazil

7. **CFMV** (Conselho Federal de Medicina Veterinária) regulates veterinary
   practice in Brazil. Confirm AI-assisted triage is **not** classified as
   "ato privativo do médico veterinário" under CFMV resolutions.
   Resolução CFMV 1.321/2020 may apply.
8. CDC Article 6 requires **clear and adequate information** about products
   and services, including risks. Confirm our disclaimer language meets
   this standard in Brazilian terms.
9. **CDC Article 8 and 9** — provider has duty to warn of dangers.
   Section 16 (When to Seek Emergency Care) of `pt-BR/disclaimer.html`
   addresses this — confirm wording is sufficient.
10. **Emergency vet contacts** — Brazil does not have a national pet
    poison hotline equivalent to ASPCA. Recommend adding regional 24h
    veterinary clinic numbers (São Paulo, Rio, Brasília) or directing
    to "veterinário de emergência mais próximo".

### Terms — CDC trumps US-style waivers

11. **CDC Article 51** voids: liability waivers (i, ii), arbitrary
    indemnification (iv), waiver of consumer rights (xv), foreign
    jurisdiction clauses that disadvantage the consumer (xvii after 2022
    amendment).
12. Section 16 dual-jurisdiction carve-out is **critical** in Brazil.
    Brazilian courts routinely refuse to enforce Delaware-only clauses
    against consumers. Confirm wording is sufficient or strengthen with
    explicit reference to "foro do domicílio do consumidor".
13. **$100 liability cap** in Section 11 — almost certainly **void** in
    Brazil under CDC Article 51(I). Confirm whether to remove the cap
    entirely for Brazilian consumers or set a CDC-compliant minimum.
14. **Indemnification (Section 12)** — Brazilian consumer law prohibits
    consumer indemnification of suppliers. Confirm enforceability for
    non-business-use case.

### Cookies — Marco Civil + LGPD

15. Marco Civil Article 7(VIII) requires "claras e completas" information
    about data collection, storage, use. LGPD compounds this for cookies.
    Confirm `pt-BR/cookies.html` meets both standards.
16. **Default consent state** — LGPD requires consent to be "specific,
    informed, free". Default-denied opt-in meets this standard. Confirm
    no further granularity needed.
17. **Cookie banner wording** — confirm Portuguese wording is acceptable
    and that it provides meaningful choice (not just "Accept" with no
    real "Reject" path).

### Marketing language

18. CDC Article 36–38 regulates **publicidade enganosa** (misleading
    advertising). Avoid claims that AI "diagnostica" or "trata" — use
    "ajuda a triagem" / "orienta sobre quando procurar veterinário".
19. **PROCON** (state-level consumer protection agencies) will scrutinize
    advertising once paid traffic launches. São Paulo, Rio, and Distrito
    Federal PROCONs are most aggressive.

### Brand mark

20. Confirm "VetScan" can be used as a brand in Brazil — INPI database
    check for conflicts with existing Brazilian veterinary trademarks.

## Likely small fixes

- May require explicit DPO designation in `pt-BR/privacy.html` with
  contact details, or "Encarregado: [Name], encarregado@vetscan.app".
- May require explicit listing of all 9 LGPD data-subject rights in
  enumerated form (currently they're in prose).
- May require "foro do domicílio do consumidor" reference in Section 16
  of `pt-BR/terms.html` carve-out.
- May require removal of $100 liability cap for consumers (or moving it
  to a B2B-only annex).
- May require Brazilian emergency vet contacts in disclaimer.

## After sign-off

Once approved, edit `analytics.js`:

```diff
- var LEGAL_REVIEWED_LOCALES = [];
+ var LEGAL_REVIEWED_LOCALES = ['pt-BR'];
```

Record lawyer's OAB number (Ordem dos Advogados do Brasil registration)
and sign-off date in the status grid in `docs/LEGAL_REVIEW.md`.

## Special note on the small-business exemption

ANPD's Resolução CD/ANPD 2/2022 provides a partial exemption from full
LGPD compliance for small-scale processors. During the waitlist phase
VetScan likely qualifies. Once paid traffic launches and user count grows,
the exemption no longer applies. **Plan for the transition** — ask the
lawyer what the timeline / triggers are.
