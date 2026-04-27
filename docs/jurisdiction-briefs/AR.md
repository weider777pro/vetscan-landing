# Argentina — Jurisdiction Brief

> Country-specific points for local legal review of `es-ar/*.html` pages.
> Read alongside [`docs/LEGAL_REVIEW.md`](../LEGAL_REVIEW.md).

## Locale

`es-ar` — Rioplatense Spanish (voseo: vos, sumate, escribinos, podés, querés).
Targeted at users in Argentina, Uruguay, and Chile (where voseo is also
common in informal contexts).

## Applicable law

- **Ley 24.240 — Ley de Defensa del Consumidor** (Consumer Protection Act,
  1993 with major 2008 reform). The most consumer-protective regime in
  Latin America. Many waivers/limitations valid in the US are void in
  Argentina under Articles 37 and 65.
- **Ley 25.326 — Ley de Protección de los Datos Personales** (Personal Data
  Protection Act, 2000 — under reform, see "Proyecto de Ley de Protección de
  Datos Personales 2024" which will harmonize with GDPR).
- **Código Civil y Comercial de la Nación**, Articles 1093–1122 (consumer
  contract rules).
- **Ley 26.361** (2008 reform of Defensa del Consumidor — strengthened
  consumer rights significantly).
- **Resolución SC 906/1998** — restrictions on "abusive clauses" (cláusulas
  abusivas) that mirror EU Directive 93/13.

## Points to verify (Argentina-specific risks)

### Disclaimer (highest risk in Argentina)

1. **Consumer protection trumps liability waivers.** Ley 24.240 Article 37
   declares void any clauses that disclaim liability for damages caused by
   the supplier. Our Section 13 of `disclaimer.html` ("not liable for harm,
   injury, illness, death of pet") is **likely partially void** under
   Argentine consumer law. Confirm with counsel whether reformulation is
   needed.
2. The Argentine "deber de información" (duty to inform, Article 4 of LDC)
   requires clear, accurate, complete information about the service's
   limitations. Confirm our disclaimer language meets this duty in
   Argentine legal terms.
3. **Veterinary services regulation** — Ley 14.346 (animal protection) and
   provincial veterinary practice laws. Confirm that AI-assisted triage
   does not require veterinary license registration.
4. Consider adding Argentine emergency vet contacts. Major cities
   (Buenos Aires, Córdoba, Rosario) have 24h emergency veterinary clinics
   — recommend adding 1-2 numbers to disclaimer.

### Terms — consumer carve-out & Delaware

5. Section 16 dual-jurisdiction carve-out is **strongly recommended for
   Argentina** because Argentine courts often refuse to enforce foreign
   jurisdiction clauses against consumers (Article 36 of LDC). Confirm
   our wording is sufficient or strengthen.
6. **$100 liability cap** in Section 11 — likely **void or substantially
   reduced** in Argentina under Article 37 LDC. Confirm whether to add a
   minimum statutory floor (e.g., reference to mandatory consumer-law
   damages).
7. Section 12 (Indemnification) — Argentine law restricts consumer
   indemnification of suppliers. Confirm enforceability for the
   non-business-use case.

### Privacy

8. Ley 25.326 currently requires registration with the **Dirección Nacional
   de Protección de Datos Personales (DNPDP)** for databases of personal
   data. Confirm if our scale/structure triggers registration.
9. The 2024 draft GDPR-aligned law may impose new requirements (DPO,
   72-hour breach notification, etc.). Status as of review date?
10. Cross-border transfers to US/EU — Article 12 of Ley 25.326 requires
    "adequate level of protection". US is not on the adequacy list; SCCs
    or explicit consent may be required.

### Cookies

11. Argentina does not yet have a dedicated ePrivacy/cookie law — it uses
    general consumer-protection + data-protection framework. Confirm that
    our current opt-in banner with default-denied state is acceptable.
12. The data-protection draft law mentioned above may introduce explicit
    cookie requirements.

### Marketing language (when paid traffic launches)

13. Argentine truth-in-advertising rules (Article 1101 of Civil and
    Commercial Code) — claim language like "AI veterinarian" may be
    flagged as misleading if interpretation suggests AI replaces a vet.
    Recommend "AI-assisted triage" framing in ad copy.

## Voseo-specific drafting notes

The translation already uses voseo (vos/sumate/podés). A lawyer reviewing
the document may suggest more formal usted in legal sections — we deliberately
chose voseo throughout for marketing voice consistency.

If lawyer requests usted-only legal text, we'd need a hybrid version
(voseo on landing pages, usted on terms/privacy). Let counsel know we
**prefer voseo throughout** unless legally required otherwise. This is
standard practice for Argentine-targeted SaaS (MercadoLibre, Despegar).

## Likely small fixes

- May require explicit reference to "Ley 24.240 de Defensa del Consumidor"
  in Terms Section 16 carve-out.
- May require registration of data activity with DNPDP before paid traffic.
- May require provincial registration depending on where users are
  primarily located (Buenos Aires province, CABA, etc.).

## After sign-off

Once approved, edit `analytics.js`:

```diff
- var LEGAL_REVIEWED_LOCALES = [];
+ var LEGAL_REVIEWED_LOCALES = ['es-ar'];
```

Record the lawyer's name, registration number (matrícula del Colegio Público
de Abogados), and sign-off date in the status grid in `docs/LEGAL_REVIEW.md`.
