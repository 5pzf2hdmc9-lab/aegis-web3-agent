# 06 — GTM · ADS · OUTBOUND · BI

> Owner bots: `@performance-media-buyer` (paid) · `@revenue-outbound-engine` (B2B outbound) · `@data-bi-architect` (taxonomy/dashboards)  
> Inputs: `01` (voice) · `02` (offer/hooks) · `03` (consent/cookies) · `05` (no tracking that breaks CSP/security)

---

## 0. GTM Objectives

| Πεδίο | Τιμή |
|---|---|
| Primary business goal (90 days) | PENDING FOUNDER INPUT |
| Primary KPI | |
| Guardrail KPIs | CAC ≤ ___ · MER ≥ ___ · Refund rate ≤ ___ |
| Channels in scope | Meta / TikTok / Google / Outbound / Organic / Other |
| Budget (monthly €) | |
| Attribution model | |

---

## 1. Event Taxonomy (PostHog + GA4)

Κάθε event έχει: name, description, properties, when fired, owner, PII rules.

| Event name | Description | Properties (schema) | Source (web/server) | GA4? | PostHog? | Consent gate | Owner |
|---|---|---|---|---|---|---|---|
| `page_view` | Standard page view | `path`, `title`, `referrer` | web | Y | Y | analytics | `@data-bi-architect` |
| `cta_click` | Primary CTA click | `cta_id`, `page` | web | Y | Y | analytics | |
| `sign_up_started` | Auth form start | `method` | web | Y | Y | analytics | |
| `sign_up_completed` | Account created | `method` | server preferred | Y | Y | analytics | |
| `onboarding_step_completed` | Step N done | `step`, `step_name` | web | Y | Y | analytics | |
| `purchase` | Paid conversion | `value`, `currency`, `plan` | server | Y | Y | ads+analytics | |
| `subscribe` | Subscription start | `plan`, `interval` | server | Y | Y | ads+analytics | |
| `refund` | Refund processed | `value`, `reason` | server | Y | Y | ads+analytics | |
| `lead_submitted` | Lead form | `form_id` | web/server | Y | Y | ads+analytics | |
| `email_click` | Lifecycle email CTA | `campaign`, `link_id` | ESP → server | optional | Y | email | |
| `outbound_reply` | Cold email reply | `sequence_id`, `persona` | CRM | N | Y | N/A internal | |
| PENDING custom | | | | | | | |

### Funnel definitions
| Funnel | Steps (ordered events) | Target conversion % |
|---|---|---|
| Acquisition | `page_view` → `sign_up_completed` | PENDING |
| Activation | `sign_up_completed` → `onboarding_step_completed`(final) | |
| Revenue | `sign_up_completed` → `purchase`/`subscribe` | |
| Retention | cohort D1/D7/D30 active | |

---

## 2. Meta Ads Structure

| Level | Name convention | Notes |
|---|---|---|
| Campaign | `[VENTURE]_META_[OBJ]_[GEO]_[YYYYMM]` | OBJ = OUTCOME/TRAFFIC/LEADS |
| Ad set | `[AUDIENCE]_[PLACEMENT]_[OPT]` | |
| Ad | `[CREATIVE_ID]_[HOOK_ID]_[FORMAT]` | Hook IDs from `02` §3 |

| Campaign | Objective | Budget (€/day) | Audience | Pixel/CAPI events optimized | Status |
|---|---|---|---|---|---|
| PENDING | | | | `purchase` via CAPI | NOT LIVE |

### Meta CAPI / server-side
| Item | Spec | Status |
|---|---|---|
| Browser Pixel ID | | PENDING |
| CAPI access token storage | server env only | PENDING |
| Event dedup (`event_id`) | required | PENDING |
| EMQ / match quality monitoring | weekly | PENDING |

---

## 3. TikTok Ads Structure

| Campaign | Objective | Budget | Audience | Pixel events | Creative IDs | Status |
|---|---|---|---|---|---|---|
| PENDING | | | | | from `02` | NOT LIVE |

| Item | Spec | Status |
|---|---|---|
| TikTok Pixel | | PENDING |
| Events API (server) | | PENDING |
| Spark Ads / organic bridge | | PENDING |

---

## 4. Google Ads Structure

| Campaign type | Name | Keywords / assets | Conversion goals | Budget | Status |
|---|---|---|---|---|---|
| Search | PENDING | | | | NOT LIVE |
| Performance Max | | | | | NOT LIVE |
| Demand Gen / YouTube | | | | | NOT LIVE |

| Item | Spec | Status |
|---|---|---|
| GA4 linked | | PENDING |
| Google Ads conversion tags / enhanced conversions | server preferred | PENDING |
| Brand vs non-brand split | mandatory if Search live | PENDING |

---

## 5. Creative Testing Matrix

| Test ID | Hook ID (`02`) | Angle | Format | Platform | Primary metric | Kill rule | Status |
|---|---|---|---|---|---|---|---|---|
| CT-001 | | | UGC 15s | Meta/TikTok | CPA / CTR | see §7 | DRAFT |
| CT-002 | | | | | | | |
| CT-003 | | | | | | | |
| CT-004 | | | | | | | |
| CT-005 | | | | | | | |

---

## 6. B2B Cold Outbound Infrastructure

| Component | Spec | Status |
|---|---|---|
| Secondary / sending domains | PENDING FOUNDER INPUT | NOT SET |
| SPF | TXT record | NOT SET |
| DKIM | provider keys | NOT SET |
| DMARC | `p=none` → `quarantine` → `reject` ramp | NOT SET |
| Mailbox provider | Google / Microsoft / other | NOT SET |
| Warmup plan | daily send ramp | NOT SET |
| CRM / sequencer | | NOT SET |
| Lead enrichment sources | | compliant use only |
| Suppression / unsubscribe handling | | required |

### Sequences (1-to-1)

| Seq ID | Persona | Step | Day | Subject | Body purpose | CTA | Objection branch |
|---|---|---|---|---|---|---|---|
| OUT-1 | PENDING | 1 | 0 | | pattern interrupt + relevance | | |
| OUT-1 | | 2 | 3 | | proof / case | | |
| OUT-1 | | 3 | 7 | | breakup | | |

### Objection-handling scripts
| Objection | Reply script (human voice) | Source |
|---|---|---|
| «Είμαστε OK με το τωρινό» | PENDING from `01` language | |
| «Στείλτε info» | | |
| «Ακριβό» | | |
| «Χωρίς budget» | | |
| «Καλέστε με σε X μήνες» | | |

---

## 7. Automation Stop-Loss Rules

| Rule ID | Condition | Action | Channel |
|---|---|---|---|
| SL-01 | CPA > 1.5× target for 3 days + ≥50 conv attempts | Pause ad set | Meta/TikTok/Google |
| SL-02 | Frequency > 3.5 with CTR collapse | Rotate creative | Meta |
| SL-03 | Refund rate > threshold | Pause scaling · alert Founder | All paid |
| SL-04 | EMQ / match quality drop | Fix CAPI before scale | Meta |
| SL-05 | Domain reputation / bounce > threshold | Halt outbound | Email |

---

## 8. Dashboards & KPI Cadence

| Dashboard | Tool | Audience | Cadence | Widgets |
|---|---|---|---|---|
| Acquisition | GA4 + ad platforms | Founder + media buyer | daily | spend, CPA, CTR, CPM |
| Product funnel | PostHog | Founder + product | weekly | activation, drop-offs |
| Revenue | Stripe + BI | Founder + CFO | weekly | MRR/GMV, refunds, LTV |
| Outbound | CRM | Founder + sales | weekly | sends, replies, meetings |
| Cohorts | PostHog | Founder | monthly | D1/D7/D30 retention |

| KPI | Definition | Target | Actual | As of |
|---|---|---|---|---|
| CAC | | PENDING | | |
| LTV | | | | |
| LTV:CAC | | ≥3 unless Founder override | | |
| Activation rate | | | | |
| Paid conversion | | | | |
| MER | | | | |
| Reply rate (outbound) | | | | |

---

## 9. Consent & Compliance Bridge

| Check | Status |
|---|---|
| Ads pixels fire only after consent per `03` | PENDING |
| CAPI does not bypass required consent unlawfully | PENDING — legal review |
| Outbound complies with applicable e-privacy / marketing rules | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| No fabricated social proof in ads | REQUIRED |

---

## 10. Handoff Gates

| Gate | Owner | Status |
|---|---|---|
| Taxonomy implemented in code | `@data-bi-architect` + `@fullstack-builder` | NOT STARTED |
| CAPI/Pixel tested with real events | `@performance-media-buyer` | NOT STARTED |
| Domains authenticated | `@revenue-outbound-engine` | NOT STARTED |
| Red Team GTM PASS | `@red-team-enforcer` | NOT RUN |
| Ledger updated | `@enterprise-archivist` | PENDING |

**Document status:** TEMPLATE — no paid spend or cold outbound until infrastructure + consent gates PASS.
