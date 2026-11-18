# 04 — PRODUCT UX & SUPPLY CHAIN

> Owner bots: `@product-ux-architect` (product/CRO/UX) + `@supply-chain-procurement` (physical or SaaS vendors)  
> Consumers: `@fullstack-builder`, `@e2e-adversarial-tester`, `@cfo-tax-controller`

---

## 0. Product Definition

| Πεδίο | Τιμή |
|---|---|
| Product name | PENDING FOUNDER INPUT |
| Type | SaaS / Physical / Hybrid / Services |
| Primary user persona | from `01` |
| North-star metric | |
| Secondary metrics | |
| Platforms (web / iOS / Android / retail) | |
| Must-work-offline? | Y/N |

---

## 1. Information Architecture

| Surface | Route / location | Job-to-be-done | Auth required | Notes |
|---|---|---|---|---|
| Marketing landing | `/` | Convert stranger → lead/buyer | N | Hero budget: brand, 1 headline, 1 sentence, CTA, 1 dominant visual |
| Auth | `/login` `/register` | Account creation | N | |
| Onboarding | `/onboarding` | Time-to-value | Y | Frictionless · max steps documented below |
| Core app home | `/app` | Daily use | Y | |
| Checkout | `/checkout` | Payment | Y/N | 1-click where legally/technically possible |
| Billing portal | `/billing` | Manage plan | Y | |
| Support | `/support` | Resolve issues | optional | |
| Legal | `/terms` `/privacy` `/cookies` `/returns` | Compliance | N | |

### Onboarding step map (no phantom steps)

| Step # | Screen name | User action | Data saved | Exit criteria | Drop-off risk |
|---|---|---|---|---|---|
| 1 | PENDING | | | | |
| 2 | | | | | |
| 3 | | | | | |

**Time-to-value target:** ___ minutes  
**5-second clarity test (home):** what user understands:

---

## 2. CRO Flow & Experiment Backlog

| Funnel stage | Current friction | Hypothesis | Experiment | Primary metric | Status |
|---|---|---|---|---|---|
| Visit → signup | PENDING | | | | |
| Signup → activated | | | | | |
| Activated → paid | | | | | |
| Paid → retained D30 | | | | | |
| Checkout abandon | | | | | |

### Checkout requirements
| Requirement | Spec | Status |
|---|---|---|
| Guest vs forced account | | |
| Payment methods | Stripe cards / Apple Pay / Google Pay / other | |
| Order summary clarity | tax incl/excl labeled per `03` | |
| Mobile 390px layout | no horizontal scroll, thumb-reachable CTA | |
| Error states | human language, no raw Stripe codes | |
| Success + receipt email | | |

---

## 3. UX Design System Notes (venture-local)

| Token / rule | Value |
|---|---|
| Visual direction (1 sentence) | PENDING — avoid purple-on-white, cream/terracotta cliché, broadsheet |
| Display font | Self-hosted · not Inter/Roboto/Arial/system default stacks |
| Body font | Self-hosted |
| CSS variables (`:root`) | list when implemented |
| Motion (2–3 purposeful) | |
| Empty state contract | glyph + title + hint + optional CTA |
| Skeleton loaders | match real layout |
| Cards policy | No cards in hero· cards only for interaction containers |

---

## 4. Pricing Architecture

> Draft by `@venture-strategist` 2026-11-18 (Round 1). **Not locked** — ΦΠΑ/`@cfo-tax-controller` + Red Team required before Stripe.  
> Competitor anchors (live scrape 2026-11-18): GoPlus Free 100 credits/min + Pro custom — https://gopluslabs.io/en/token-security-api · De.Fi Scanner free / API contact — https://de.fi/scanner · https://de.fi/api · Arkham Enterprise $1,500/mo — https://arkm.com/ · CertiK services/Skynet no public menu — https://www.certik.com/ · Blowfish public $ UNVERIFIED (blowfish.xyz TLS broken; Alchemy lists Free — https://www.alchemy.com/dapps/blowfish).

| Tier | Price | Billing period | Who it's for | Hard limits | Soft limits | Anchor vs decoy |
|---|---|---|---|---|---|---|
| Free | $0 | — | Curious retail users validating the demo | 10 audits / day / IP (align with current API rate spirit); 4 chains; no history persistence after session | Watermark “research / NFA” | Traffic acquisition vs De.Fi free scanner |
| Builder | **ESTIMATE $9 / mo** | Monthly (annual −20% later) | Indie builders / frequent checkers | 300 audits / mo; saved history 90 days; structured flags JSON export | Soft: email support 72h | Decoy under Pro; under Arkham by orders of magnitude |
| Pro | **ESTIMATE $29 / mo** | Monthly | Power users / small teams | 2,000 audits / mo; watchlist alerts; PDF export; 2 seats | Priority queue | **Recommended anchor** — history + PDF (De.Fi-like) without enterprise AML |
| API / Enterprise | Custom (floor ESTIMATE **$99 / mo** or usage credits) | Monthly + overage | Wallets, dashboards, bots | SLA, dedicated key, custom RPM (GoPlus Pro pattern); optional sim add-on | Sales call | Do **not** price-match Arkham $1,500 unless AML/entity graph ships |

| Metric | Value | Source |
|---|---|---|
| Target gross margin % | ESTIMATE ≥70% after AI/RPC — PENDING measurement | `@cfo-tax-controller` |
| Max COGS per user / order | PENDING — Gemini + Alchemy per audit | Instrument in production |
| Refund reserve % | PENDING FOUNDER INPUT (working assumption 5–10%) | CFO + Stripe policy |

**VAT / Greek SaaS:** PENDING `@cfo-tax-controller` live AADE check before charging EU cards.

---

## 5A. Physical Products — Supply Chain (if applicable)

| Field | Supplier A | Supplier B | Supplier C |
|---|---|---|---|
| Supplier name | PENDING | | |
| Country | | | |
| Contact | | | |
| MOQ | | | |
| Unit cost (EXW/FOB) | | | |
| Lead time | | | |
| Certifications | | | |
| Sample status | | | |

### Landed cost worksheet (per SKU)

| Cost component | Amount (€) | Notes |
|---|---|---|
| Unit product cost | | |
| Packaging | | |
| Inland freight origin | | |
| International freight | | |
| Insurance | | |
| Duties / τελωνεία | | UNVERIFIED until live customs class |
| VAT handling | | see `03` |
| 3PL inbound + storage | | |
| Pick/pack outbound | | |
| Payment fees | | |
| **Landed cost total** | | |
| Sell price | | |
| **Gross margin € / %** | | |

### Logistics / 3PL

| Item | Choice | SLA | Cost model |
|---|---|---|---|
| 3PL partner | PENDING | | |
| Shipping zones | | | |
| Returns logistics | | align with `03` returns | |

---

## 5B. SaaS — Vendors, APIs, DPAs, Infra Cost (if applicable)

| Vendor | Purpose | Data processed | DPA signed? | Subprocessors listed? | Monthly cost | Cost / MAU estimate |
|---|---|---|---|---|---|---|
| Supabase | DB/Auth | | PENDING | | | |
| Stripe | Payments | | PENDING | | | |
| Vercel / host | App hosting | | PENDING | | | |
| ESP | Email | | PENDING | | | |
| PostHog / GA4 | Analytics | | PENDING | | | |
| Firecrawl | Research (internal) | | PENDING | | | |
| AI provider | Features | | PENDING | | | |

### Infrastructure cost per user model

| Cost line | Monthly € | Driver | € / active user |
|---|---|---|---|
| Compute / hosting | PENDING | | |
| DB | | | |
| Auth MAU | | | |
| Storage / bandwidth | | | |
| AI tokens | | | |
| Email sends | | | |
| Observability | | | |
| **Total** | | | |

---

## 6. Build Handoff → `@fullstack-builder`

| Requirement | Priority | Acceptance criteria | Status |
|---|---|---|---|
| IA routes exist | P0 | matches §1 table | NOT STARTED |
| Onboarding complete | P0 | steps 1..n + persistence after F5 | NOT STARTED |
| Checkout live | P0 | Stripe webhook + success path | NOT STARTED |
| Mobile 390 layout | P0 | Playwright viewport pass | NOT STARTED |
| Self-hosted fonts | P1 | no remote font privacy leak unless consented | NOT STARTED |
| Empty/skeleton states | P1 | no blank panels | NOT STARTED |

**Document status:** TEMPLATE — awaiting Founder product type + first UX/supply pass.
