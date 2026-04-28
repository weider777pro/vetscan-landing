# EU Expansion Plan — For Execution After Validation

**Status:** Planning, not implementation
**Created:** 2026-04-28 (after launch night, deferred to fresh-mind execution)
**Decision needed:** After 1-2 weeks of paid traffic data on existing 6 locales

---

## Strategic context

VetScan launched with 6 locales (en, uk, ru, es-mx, es-ar, pt-BR). EU expansion candidates discussed: Germany, Spain, Italy, Poland, France, Hungary, Greece, Romania.

**Decision:** Spain-first as Phase 1 EU expansion. Other markets follow after Spain validates conversion.

## Why Spain first

- 9.3M dogs (3rd largest in EU)
- Ley de Bienestar Animal 2023 → mandatory pet welfare → drives demand for AI tools
- 80% content reuse from existing es-MX (Mexican Spanish) locale → lowest incremental cost
- Strong pet-tech ecosystem (Barkibu, Kivet) proves market readiness
- Spanish speaker market = next largest after English globally
- Lower regulatory friction than Germany (CNIL/Toubon strict)

## Phase 1: Spain (es-ES) — Estimated 1 hour focused work

### Tone & language adaptations from es-MX

**Vocabulary shifts** (Mexican → Castilian):
- "perro" stays
- "carro" → "coche"
- "celular" → "móvil"
- "computadora" → "ordenador"
- "estacionar" → "aparcar"
- "manejar" → "conducir"
- Verb forms generally consistent (tu form OK in Spain casual context)
- "mascota" stays universal
- "veterinario" / "vete" stays universal

**Specific to vet context:**
- "consulta veterinaria" stays
- "urgencia" stays
- "trato" → "tratamiento" (more formal in ES)

### EUR pricing for Spain market

Cannot reuse Mexico pricing. Spain has higher disposable income but more price-sensitive on subscriptions vs US/UK.

**Proposed:**
- Standard monthly: €5.99
- Standard yearly: €49.99 (save 30% vs monthly × 12 = €71.88)
- Founder monthly: €4.99 (locked for life)
- Founder yearly: €39.99 (save 33% vs founder monthly × 12 = €59.88)

**Reasoning:**
- Below Pawp €8 equivalent
- Above LATAM Spanish prices (Spain higher PPP than Mexico)
- Below Germany €6.99 (Spain more price-sensitive)
- Aggressive founder discount drives early adoption

### Legal/regulatory references to update

| es-MX reference | es-ES replacement |
|---|---|
| LFPDPPP (Mexican data protection) | LOPDGDD + EU GDPR |
| INAI | AEPD (Agencia Española Protección Datos) |
| PROFECO | AGCM equivalent: Dirección General de Consumo |
| Mexican Federal Consumer Protection Law | Real Decreto Legislativo 1/2007 |
| Mexican mandatory invoice (CFDI) | Spanish IVA invoice |
| Mexico City jurisdiction | Madrid jurisdiction |
| Spanish vet professional body reference: Consejo General de Colegios Veterinarios de España (CGCVE) |

### File scope

14 HTML pages × 1 locale = 14 files:
1. index.html
2. how-it-works.html
3. pricing.html
4. faq.html
5. compare.html
6. founder-letter.html
7. privacy.html
8. terms.html
9. cookies.html
10. disclaimer.html
11. security.html
12. accessibility.html
13. press.html
14. about.html

### Infrastructure changes

- `i18n.js`: add 'es-ES' to locale list, timezone Europe/Madrid → es-ES
- `currency.js`: ensure EUR pricing block reflects Spain values (currently EUR is shared between all EU markets — may need split)
- `middleware.js`: add Spain timezone detection
- `sitemap.xml`: add 14 new URLs with hreflang="es-ES"
- `robots.txt`: confirm crawling
- All existing index.html footer language switcher: add Spain option
- `og-image-es-ES.png`: create new social share image

### After Spain launch — validation criteria

Decide next EU market based on:
- Conversion rate Spain vs other locales (target: ≥3% waitlist → ≥1% paid)
- CAC Spain via Meta/Google ads (target: <€10 CPA)
- Time-to-first-paying-customer (target: <2 weeks)

If Spain validates → proceed to Italy (Romance language family, similar user expectations).

If Spain doesn't validate → analyze why (translation quality? Pricing? Market fit?) before scaling.

---

## Phase 2: Italy (it) — After Spain validates

- 8.8M dogs, fastest-growing pet care market in EU
- Romance language family — translation manageable
- Tu form with "Lei" formal alternative for legal pages
- Pricing: €5.99/mo (similar to Spain)
- Legal: AGCM consumer authority, Decreto Legislativo 70/2003

## Phase 3: Germany (de) — Highest revenue potential, highest complexity

- 10.7M dogs (largest EU market)
- Pricing: €6.99/mo (German purchasing power higher)
- Legal: TKG/UWG, Kündigungsbutton mandatory, Datenschutzerklärung formal
- **Requires:** Native German speaker review of legal docs (€500-1000)
- Timeline: 4-6 weeks after Spain validates

## Phase 4: Poland (pl) — Underrated opportunity

- 7.8M dogs, fastest-growing pet care market 12%/year
- Pricing: 19.99 zł/mo (PPP-adjusted)
- Legal: UOKiK, mandatory Polish language for ToS
- **Requires:** Native Polish translator (€200-500) — Polish grammar complexity makes LLM-only translation risky
- Timeline: 6-8 weeks after Spain validates

---

## Cost estimates (cumulative)

| Phase | Market | Translation | Legal review | Total cost |
|---|---|---|---|---|
| 1 | Spain | $0 (LLM + my time) | €200-400 (optional native review) | €0-400 |
| 2 | Italy | €200-400 native review | €300-500 | €500-900 |
| 3 | Germany | €300-500 native review | €500-1000 (essential) | €800-1500 |
| 4 | Poland | €200-400 native review | €300-500 | €500-900 |
| **Total** | All 4 markets | | | **€1.8-3.7K** |

## Decision tree

```
End of week 1: Review paid traffic data
  ├─ Conversion solid (≥3% waitlist) on existing 6 locales
  │   └─ Proceed to Phase 1 (Spain)
  │       ├─ Spain converts → Phase 2 (Italy)
  │       │   └─ Italy converts → Phase 3 (Germany) + Phase 4 (Poland) parallel
  │       └─ Spain doesn't convert → Diagnose, fix, retry OR pivot
  └─ Conversion weak on existing locales
      └─ DON'T expand. Fix conversion first.
```

---

## Notes

- Soft-launch stub approach considered and rejected — looks unprofessional
- Full 4-market launch in single sprint considered and rejected — too much without validation
- Spain-first chosen as best risk/reward balance
- Native speaker review marked as "optional" for Spain only because es-MX content already reviewed; legal references must still be updated to ES jurisdiction

## Related docs

- `LEGAL_REVIEW.md` — current AR legal review process (template for future markets)
- `NEXT_WEEK_PRIORITIES.md` — Day 2-7 roadmap
- `AR_LAWYER_OUTREACH_TRACKER.csv` — outreach process template
