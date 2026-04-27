# Mexico — Jurisdiction Brief

> Country-specific points for local legal review of `es-mx/*.html` pages.
> Read alongside [`docs/LEGAL_REVIEW.md`](../LEGAL_REVIEW.md).

## Locale

`es-mx` — Neutral Latin American Spanish using **tú** (informal, not voseo).
Targeted at users in Mexico, Colombia, Peru, and other LATAM markets where
voseo is not used.

## Applicable law

- **Ley Federal de Protección de Datos Personales en Posesión de los
  Particulares (LFPDPPP)** — 2010, comprehensive private-sector data
  protection law. Mexico's GDPR equivalent.
- **Reglamento de la LFPDPPP** — implementing regulation, 2011.
- **Lineamientos del Aviso de Privacidad** — INAI (Instituto Nacional de
  Transparencia, Acceso a la Información y Protección de Datos Personales)
  guidelines on how privacy notices must be structured.
- **Ley Federal de Protección al Consumidor (LFPC)** — 1992, with major
  reforms 2004 and 2017. Enforced by **PROFECO** (Procuraduría Federal del
  Consumidor) — known for being aggressive against foreign companies.
- **Código de Comercio**, Articles 89–114bis (electronic commerce rules,
  2003 reform).
- **NOM-151-SCFI-2016** — official norm on conservation of digital messages.

## Points to verify (Mexico-specific risks)

### Privacy — most rigorous in LATAM

1. Mexico requires a **specific structure for the Aviso de Privacidad**
   (Privacy Notice) under INAI Lineamientos. Confirm `es-mx/privacy.html`
   meets this structure:
   - Identity and address of "Responsable" (the data controller)
   - Personal data being processed (categories and types)
   - Purposes of processing (primary and secondary, with opt-out for
     secondary)
   - Mechanisms to exercise ARCO rights (Acceso, Rectificación,
     Cancelación, Oposición)
   - Mechanisms to revoke consent
   - Cross-border transfers disclosure
   - Procedures to communicate changes to the privacy notice
2. **Aviso integral vs. simplificado** — Mexico distinguishes between
   short-form and full-form privacy notices. Our current `es-mx/privacy.html`
   is closer to "aviso integral". Confirm we don't also need a "short-form"
   summary on the homepage or signup page.
3. **ARCO rights workflow** — confirm we have a documented mechanism (email
   `privacy@vetscan.app` is referenced) and a 20-business-day response time.
4. **Designar a un "Responsable"** — Mexican law requires naming a person
   or department responsible for handling privacy requests. Our current
   privacy.html names "VetScan Privacy Team" generically. Confirm if a
   specific person/registered entity name is required.

### Disclaimer

5. Mexican consumer law (LFPC) and PROFECO take a strong stance on
   disclaiming liability for harm. Confirm our Section 13 disclaimer
   language survives PROFECO scrutiny — they have been aggressive against
   foreign tech companies.
6. **Veterinary practice regulation** — Ley General de Salud Animal does not
   directly regulate AI triage, but provincial (state-level) regulations
   may apply. Confirm we don't trigger licensing.
7. Add Mexican emergency vet contacts. UNAM Faculty of Veterinary Medicine
   has a 24h emergency line; CDMX has private 24h clinics.

### Terms — consumer carve-out

8. **PROFECO views Delaware governing-law clauses with suspicion** for
   consumers. Confirm Section 16 dual-jurisdiction carve-out is robust
   under Mexican consumer law. May need explicit reference to "tribunales
   competentes mexicanos" or "PROFECO" as alternative dispute resolution.
9. **$100 liability cap** in Section 11 — Mexican consumer law prohibits
   abusive limitations under Article 86 LFPC. Confirm cap is enforceable.
10. **Class actions** — Mexico has class-action procedure since 2012.
    Confirm we don't have a class-action waiver (we don't currently),
    and that adding one would not be enforceable.

### Cookies

11. Mexico does not have a specific cookie law, but **INAI guidelines
    require explicit disclosure** of cookies in the Aviso de Privacidad.
    Confirm our `cookies.html` is reachable from the privacy notice (it is,
    via Section 18 of `privacy.html`).
12. Default-denied opt-in mechanism is best practice but not strictly
    required. Confirm we're aligned.

### Marketing language

13. PROFECO has authority over advertising. Avoid overstated claims about
    AI capabilities. Use "asistido por IA" not "veterinario IA" in ad copy.
14. **NOM-022-SSA1-1994** (and successor norms) regulate health-related
    advertising. Confirm pet-AI services don't trigger this.

## Tax / VAT note

When charging fees later (post-launch), Mexico requires VAT
collection from foreign service providers via the **REPRESVAT** registration
(Article 18-J of Ley del IVA). Out of scope for current legal review but
flag for the lawyer so they're aware of next-step needs.

## Likely small fixes

- May require explicit ARCO procedure section in `es-mx/privacy.html` (one
  paragraph per right with concrete steps).
- May require designation of a specific "Responsable" with name and contact.
- May require registration with **INAI** before processing exceeds certain
  thresholds — confirm threshold.
- May require Mexican emergency vet line in disclaimer.

## After sign-off

Once approved, edit `analytics.js`:

```diff
- var LEGAL_REVIEWED_LOCALES = [];
+ var LEGAL_REVIEWED_LOCALES = ['es-mx'];
```

Record lawyer's name, cédula profesional number, and sign-off date in the
status grid in `docs/LEGAL_REVIEW.md`.
