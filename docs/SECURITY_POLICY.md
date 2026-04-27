# VetScan Security Policy

> Vulnerability disclosure rules of engagement.
> Published per [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116).
> Machine-readable contact: [`/.well-known/security.txt`](/.well-known/security.txt)

**Last reviewed:** April 27, 2026

---

## 1. Summary

VetScan welcomes security researchers. If you find a vulnerability that could
affect our users, our infrastructure, or our pets-health data, please tell us
before you tell anyone else, and we'll work with you to fix it on a reasonable
timeline.

This document describes:
- **What's in scope** (and what isn't)
- **How to report** (channels, what to include)
- **What you can expect from us** (acknowledgment, triage, fix, disclosure)
- **What we ask of you** (responsible disclosure, no harm to users)
- **Safe harbor** — we will not pursue legal action against good-faith
  research conducted within these rules

This policy is for **independent security researchers**. Vendor and partner
security disclosures should go through contractual / B2B channels.

---

## 2. Scope

### 2.1 In scope

- **`vetscan.app`** and any direct subdomain (e.g., `www.vetscan.app`,
  future `app.vetscan.app`, `api.vetscan.app`).
- **Static-site infrastructure** (Vercel-hosted) where it specifically
  exposes VetScan content.
- **VetScan mobile applications** (when published — iOS, Android).
- **VetScan public APIs** (when published).
- **Authentication / waitlist forms** that store user data on our side.
- **Account take-over** scenarios on any user-facing surface.
- **Cookie consent banner / Consent Mode v2** misconfigurations that
  cause analytics to fire without user consent.

### 2.2 Out of scope

The following are **not eligible** for vulnerability reporting and may be
**legally restricted**:

- **Third-party services we use but do not control** — Vercel platform
  itself, Google Analytics 4, Google Workspace, Cloudflare, Namecheap,
  Mailchimp / Kit / ConvertKit, Respondent.io. Report to those vendors.
- **Denial of Service (DoS / DDoS)** attacks of any kind. Volumetric or
  resource-exhaustion testing is forbidden — coordinate with us before
  any rate-intensive testing.
- **Phishing / vishing / smishing / social engineering** of VetScan staff,
  contractors, or users.
- **Physical attacks** against any premises, devices, or personnel.
- **Spam** through contact forms or email.
- **Self-XSS** (XSS that requires the victim to type the payload into
  their own browser).
- **Tab-nabbing, clickjacking on pages without sensitive actions.**
- **Click-jacking** on static marketing pages with no authenticated state.
- **Missing CSP / HSTS headers on minor static assets** unless leveraged
  into something exploitable.
- **Reports based purely on outdated browsers / outdated TLS** (e.g.,
  TLS 1.0 support) — we ship modern defaults; old-browser quirks are
  acceptable.
- **Username / email enumeration** unless leveraged into a real attack.
- **Reports on the absence of a "best practice"** without a concrete
  impact (e.g., "you don't have BIMI", "no DMARC = none policy"). These
  are useful but won't be triaged as vulnerabilities.
- **Vulnerabilities in user-uploaded content** that don't affect other
  users (we don't accept uploads in v1 anyway).

### 2.3 Special note: pet medical safety

We are **especially interested** in any flaw that could:
- Cause our triage engine to give **systematically wrong urgency advice**
  (e.g., classify a real emergency as "watch and wait" through input
  manipulation).
- Allow a **third party to inject misinformation** into a user's
  symptom-evaluation result.
- Leak **veterinary advisor PII** (we list named DVMs on the site).

These are treated as **High** severity at minimum, regardless of CVSS.

---

## 3. How to report

### 3.1 Channels (in order of preference)

1. **Email:** [`hello@vetscan.app`](mailto:hello@vetscan.app)
   - Subject line: `Security: [short summary]`
   - PGP encryption is welcomed — request our key by email if needed.
2. **Machine-readable contact:** see [`/.well-known/security.txt`](/.well-known/security.txt)
3. **Future:** when our HackerOne / YesWeHack program is live, this page
   will be updated with the program URL.

### 3.2 What to include

Please send:
- A **clear, concise description** of the vulnerability.
- **Steps to reproduce** — preferably including a minimal proof-of-concept.
- **Impact** — what an attacker could do, and at what scale.
- The **affected URL / endpoint / asset.**
- Suggested **mitigation**, if you have one.
- Your name and how you'd like to be credited (or "anonymous").

### 3.3 What NOT to include

- **Real user data.** If you found a way to access real user records,
  describe it but **do not exfiltrate** any production data. Stop at proof
  of access and tell us.
- **Mass-extracted databases or backups.** Demonstrate read access on a
  single record, then stop.
- **Logs or screenshots that contain third-party PII** beyond what is
  needed to demonstrate the issue.

---

## 4. What you can expect from us

| Stage | SLA |
|---|---|
| **Acknowledgment of receipt** | within **48 hours** of email |
| **Initial triage / severity assignment** | within **5 business days** |
| **Status update cadence** | at least once every **14 days** until resolution |
| **Critical fix target** | **30 days** from triage (best-effort, may extend on complex fixes) |
| **High fix target** | **60 days** from triage |
| **Medium / Low fix target** | next regular release cycle |
| **Public disclosure window** | **90 days** by default; we will coordinate faster disclosure if severity demands or slower if needed for safe deployment |

We will:
- **Confirm receipt** in writing.
- **Assign a tracking ID** (internal) and share it with you.
- **Keep you updated** during the fix.
- **Credit you publicly** on `security.html` (with your permission) once
  the fix is shipped.
- **Not retaliate** legally or otherwise against good-faith research
  within these rules.

---

## 5. Severity rubric

We follow [CVSS v3.1](https://www.first.org/cvss/v3.1/) for technical
severity, and additionally apply the pet-medical-safety overlay (Section
2.3 above).

| Severity | Examples |
|---|---|
| **Critical** | Pre-auth RCE on production; full database read/write; account takeover affecting any user; systematic medical-advice manipulation. |
| **High** | Authenticated SQL injection; stored XSS in user-visible content; privilege escalation; SSRF reaching internal services; PII leak of veterinary advisors. |
| **Medium** | CSRF on sensitive actions; reflected XSS without persistence; insecure direct object reference (IDOR) on non-PII data; subdomain takeover on dormant subdomain. |
| **Low** | Clickjacking on non-sensitive pages; verbose error messages; missing security headers without exploit; low-impact information disclosure. |

---

## 6. Reward structure

VetScan is in **pre-launch** at the time of writing. We **do not currently
operate a paid bug-bounty program.** Recognition is offered:

- **Public credit** on the security acknowledgments page (`security.html`).
- **Reference letter** for the researcher's professional record, if
  requested.
- **First crack at the paid bounty** when we launch one (HackerOne or
  YesWeHack), with retroactive credit.

**Once a paid program launches**, this section will be updated with reward
tiers (typically: Critical $$$, High $$, Medium $, Low — recognition).
Researchers who reported before that point will have their valid findings
acknowledged in the launch announcement.

---

## 7. Safe harbor

VetScan **will not** initiate or support legal action against security
researchers who:

1. Report findings through the channels in Section 3.1.
2. Stay within the scope defined in Section 2.
3. Make a **good-faith effort** to avoid privacy violations, service
   disruption, and data destruction.
4. Give us **reasonable time to fix** before public disclosure (default 90
   days; faster if user safety is at stake; slower if safe deployment
   requires it).
5. Do **not extort, threaten, or attempt to monetize** their findings
   outside the disclosure process described here.

This safe harbor applies to:
- Federal and state computer-fraud statutes in the U.S. (CFAA, DMCA
  §1201 — except where preempted).
- The U.S. EFF "Coders' Rights" framing of CFAA research-friendly
  interpretations.
- Anti-circumvention claims under DMCA §1201 to the extent we can grant
  permission.

This safe harbor **does not** apply to:
- Third-party services (see Section 2.2).
- Conduct outside the rules above.
- Researchers acting as agents of competitors or state actors.

If you are uncertain whether a planned action falls within scope, **ask
first** — email `hello@vetscan.app` with subject `Security: scope
question`.

---

## 8. Coordinated disclosure

**Default window:** 90 days from initial report, regardless of fix
status. We expect researchers to respect this and not disclose before:

- We have shipped a fix, or
- The 90-day window has elapsed, or
- We have explicitly agreed to a different timeline in writing.

**Exceptions:**
- If user safety is at active risk, we will coordinate **immediate**
  partial disclosure with you (e.g., a workaround or service disable)
  while a full fix is developed.
- If we cannot fix within 90 days due to legitimate operational
  constraints, we will request and document an extension with you.

---

## 9. Hall of Fame

Public acknowledgments are listed at the bottom of [security.html](https://vetscan.app/security.html).
The format is `Name (or alias), date of fix, severity, brief one-line summary`.

We do not list:
- Reports below the Low threshold.
- Duplicates of an earlier-reported issue (the first reporter is credited).
- Reports the researcher requested to remain anonymous.

---

## 10. Changes to this policy

We may update this document. The `Last reviewed` date at the top reflects
the most recent revision. Material changes (e.g., scope expansion, paid-
bounty launch, contact email change) will be noted in the Hall of Fame
section as a dated entry.

The machine-readable [`/.well-known/security.txt`](/.well-known/security.txt)
will be updated in lockstep.

---

## 11. Acknowledgment of standards

This policy is informed by:
- [RFC 9116 — Security Disclosure](https://www.rfc-editor.org/rfc/rfc9116)
- [disclose.io Core Terms](https://disclose.io/) — open-source standard
  vulnerability disclosure language
- [Bugcrowd Standard Disclosure Terms](https://www.bugcrowd.com/resources/essentials/what-is-a-vulnerability-disclosure-program/)
- ISO 29147 / 30111 (vulnerability disclosure / handling)

---

**Contact for policy questions (not vulnerabilities):**
[`hello@vetscan.app`](mailto:hello@vetscan.app) with subject `Security: policy question`.
