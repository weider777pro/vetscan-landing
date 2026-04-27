# Legal Review Email Template — Argentina

> **Цель:** найти аргентинского юриста по consumer protection law
> и получить formal review 6 Tier-3 страниц на испанском (es-AR locale)
> для запуска paid traffic в Аргентине.

---

## Где искать юриста

### Вариант A — Colegio Público de Abogados (рекомендуется)

Зайди на сайт **Colegio Público de Abogados de la Capital Federal**: https://www.cpacf.org.ar/

Там есть онлайн-каталог юристов по специализациям. Тебе нужны:
- **Especialidad:** Derecho del Consumidor (Consumer protection law)
- **Адrress:** CABA (Ciudad Autónoma de Buenos Aires) — самый удобный
- Минимум 5 лет practice (Matrícula выдаётся раз)

### Вариант B — Upwork / Freelancer / LinkedIn

Поиск: `argentine consumer protection lawyer Ley 24.240 review`

⚠️ **Красные флаги:**
- "I can do it for $50" — слишком дёшево, скорее всего не proper review
- Нет matrícula del Colegio (профильный номер юриста)
- Не специализируется на потребительском праве — а только "general contract law"
- Не отвечает на вопрос: "Will you be reviewing under Ley 24.240 specifically, or general civil code?"

### Реалистичная цена и сроки

- **Цена:** $200-500 USD за full review 6 страниц + 2-3 round'а правок
- **Сроки:** 1-2 недели от первого ответа до final approval
- **Формат:** signed PDF letter (оригинал в архив на Google Drive)

---

## Email на испанском

**Subject:** Solicitud de revisión legal — sitio web de salud animal con audiencia argentina

```
Estimado/a Dr./Dra. [APELLIDO],

Le escribo desde VetScan (vetscan.app), una plataforma en pre-lanzamiento que
ofrecerá triaje veterinario asistido por inteligencia artificial para perros.
Estoy preparando el lanzamiento dirigido al mercado argentino y necesito una
revisión legal de nuestras páginas en español rioplatense (voseo) bajo:

  1. Ley 24.240 de Defensa del Consumidor
  2. Artículos 37 y 65 (cláusulas abusivas)
  3. Decreto 1798/94 reglamentario
  4. Código Civil y Comercial de la Nación
  5. Resoluciones de la Secretaría de Comercio Interior aplicables

Adjunto un documento de "jurisdiction brief" que prepara nuestro equipo con un
análisis preliminar de áreas de riesgo, junto con los enlaces a las 6 páginas
a revisar en producción.

ÁREAS QUE NECESITAMOS CONFIRMAR:

A. Términos de uso (Términos): cláusulas de responsabilidad, indemnización,
   limitación de responsabilidad, ley aplicable, jurisdicción, arbitraje.

B. Aviso médico (Medical Disclaimer): redacción del descargo de responsabilidad
   médico-veterinaria. ¿Es suficiente para evitar reclamos por daño?

C. Privacidad y cookies (Privacy + Cookies): cumplimiento con Ley 25.326 de
   Protección de Datos Personales y mejores prácticas internacionales (GDPR).

D. Página de seguridad y accesibilidad: representaciones públicas sobre
   compromisos. ¿Hay riesgo de publicidad engañosa si no se cumplen 100%?

E. Voseo y términos coloquiales: ¿alguno de los términos de marketing podría
   considerarse engañoso bajo el régimen de defensa del consumidor?

ENLACES A REVISAR:

- https://vetscan.app/es-ar/privacy.html
- https://vetscan.app/es-ar/terms.html
- https://vetscan.app/es-ar/disclaimer.html
- https://vetscan.app/es-ar/cookies.html
- https://vetscan.app/es-ar/security.html
- https://vetscan.app/es-ar/accessibility.html

ENTREGABLES SOLICITADOS:

1. Informe escrito identificando puntos no conformes con la legislación
   argentina (high/medium/low priority).
2. Redacciones sugeridas para cada cláusula que requiera modificación.
3. Confirmación final por escrito de que las páginas, una vez aplicados los
   cambios, son aptas para el mercado argentino.
4. Disponibilidad para 1-2 rondas de revisión adicionales si surgen dudas.

PRESUPUESTO Y CRONOGRAMA:

- Quisiera saber su honorario estimado para este alcance.
- ¿Cuál sería el plazo realista para la primera entrega?

Quedo a la espera de su respuesta y disponibilidad.

Cordialmente,
[ТВОЁ ИМЯ]
[Tu cargo, ej: Founder]
VetScan
hello@vetscan.app
+54 [твой телефон, если есть аргентинский, иначе оставь пустым]
```

---

## Что приложить к email

1. **PDF файл** `docs/jurisdiction-briefs/AR.md` — переведи в PDF через любой
   markdown-to-pdf инструмент (например, https://md-to-pdf.fly.dev/) или
   просто прикрепи `.md` файл — юрист откроет в любом текстовом редакторе.

2. **Опционально:** одностраничный summary продукта (если есть pitch deck).
   Помогает юристу понять business context за 30 секунд.

---

## Что делать пока ждёшь ответа

1. **Mark Argentina как "in legal review" в `docs/LEGAL_REVIEW.md`**:
   ```markdown
   | Locale | Status | Legal counsel | Date sent | Approved |
   |---|---|---|---|---|
   | es-AR | 🟡 In review | [Lawyer name] | 2026-04-27 | TBD |
   ```

2. **НЕ запускать paid traffic в Аргентине** до approval.

3. **Можешь параллельно:** запустить paid traffic в США/Канаде на EN-версию
   (английский — это source of truth, formal lawyer review для US менее
   критичен поскольку у тебя стандартный SaaS Terms of Use, не consumer
   credit / медицинский devise / etc.).

4. **Рассылка остальным юрисдикциям:** аналогичные templates можно сделать
   для Mexico (`MX.md`), Brazil (`BR.md`), Ukraine (`UA.md`). Argentina —
   первая потому что это самый высокий риск и самый сложный voseo perfection
   test. Если AR прошёл — остальные 3 будут проще.

---

## После получения approval

1. Получи signed PDF от юриста, сохрани в Google Drive под `legal-reviews/AR-2026-XX-XX.pdf`
2. Открой `analytics.js` → найди строку `LEGAL_REVIEWED_LOCALES = []`
3. Измени на: `LEGAL_REVIEWED_LOCALES = ['es-ar']`
4. `git add . && git commit -m "Argentina legal review approved" && git push`
5. Vercel auto-deploys → жёлтый translation banner на `/es-ar/*` страницах **исчезает**
6. Argentina готова к paid traffic 🚀
