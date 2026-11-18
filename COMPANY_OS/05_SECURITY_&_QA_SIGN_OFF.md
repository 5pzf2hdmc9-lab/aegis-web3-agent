# 05 — SECURITY & QA SIGN-OFF

> Owner bots: `@security-auditor` (CISO) + `@e2e-adversarial-tester` (VP QA)  
> Final gate: `@red-team-enforcer`  
> Hard fail thresholds: `0` console errors · `0` CSP violations · `0` HTTP 5xx in E2E · RLS must use `auth.uid()` multi-tenant patterns · zero hardcoded admin emails/secrets in client

---

## 0. Scope

| Πεδίο | Τιμή |
|---|---|
| App / repo path | `/Users/chistraios/web3 agent/web3-risk-agent` |
| Product | AegisWeb3 / AegisChain Risk Agent |
| Branch audited | `feat/production-security-upgrade` (includes uncommitted + untracked `components/`, `lib/`, `services/`, `.env.example`, `docs/`, `COMPANY_OS/`) |
| Environments | local (`.env.local` gitignored) · production demo `https://web3-risk-agent.vercel.app/` |
| Auth provider | **None** — public unauthenticated audit API (no Supabase Auth, no session cookies) |
| Multi-tenant model | **N/A** — no persisted user data / no DB |
| Last security pass (ISO) | **2026-11-18** — Round 1 Baseline static audit (`@security-auditor`) |
| Last E2E pass (ISO) | **NOT RUN** (Round 1 = static audit only) |

### Inventory (every source surface scanned)

| Path | Role |
|---|---|
| `app/page.tsx`, `app/layout.tsx`, `app/globals.css` | Client dashboard + layout |
| `app/api/rag/route.ts` | Sole `/api/*` route (`POST`) |
| `components/*` (7 files) | Header, ChainSelector, SearchForm, QuickTestTargets, AuditsFeed, ScanResults, Footer |
| `lib/*` (6 files) | validation, rate-limit, prompt-guard, audit-helpers, types, quick-targets |
| `services/*` (3 files) | blockchain RPC, Gemini, audit orchestration |
| `next.config.ts`, `package.json`, `.env.example`, `.gitignore` | Config / deps / secrets hygiene |
| `middleware.ts` | **ABSENT** (confirmed via filesystem glob) |
| Supabase / Stripe / webhooks | **ABSENT** from runtime source (only template mentions in other COMPANY_OS docs) |

---

## 1. Secrets & Client Exposure Audit

| Check | Result (PASS/FAIL/NOT RUN) | Evidence |
|---|---|---|
| No service-role / secret keys in `NEXT_PUBLIC_*` or `REACT_APP_*` | **PASS** | Repo-wide ripgrep (`*.{ts,tsx,js,jsx,mjs,json,md,env*}` excluding `node_modules`/`.next`): **zero** `NEXT_PUBLIC_` / `REACT_APP_` assignments in app source. Only documentation warnings in `README.md:52`, `.env.example:1`, `docs/PROJECT_MEMORY.md:45,104`. |
| No Stripe secret / webhook secret in client bundle | **PASS (N/A)** | No Stripe dependency in `package.json`; no webhook routes under `app/api/`. |
| No Firecrawl / AI provider keys in client | **PASS** | `GEMINI_API_KEY` read only in `services/gemini.ts:5-9` via `process.env.GEMINI_API_KEY` (server module imported by `services/audit.ts` → `app/api/rag/route.ts`). No client import of `services/gemini.ts`. |
| No hardcoded admin email allowlists in client source | **PASS** | No admin email / allowlist strings in `app/`, `components/`, `lib/`, `services/`. |
| `.env*` gitignored · example env without secrets committed | **PASS** | `.gitignore:34-35` → `.env*` with `!.env.example`. `git check-ignore -v .env.local` → `.gitignore:34:.env*`. `.env.example:2-9` uses placeholders (`your_gemini_api_key`, `YOUR_KEY`) only. |
| Secrets only in server env / secret manager | **PASS** | RPC URLs: `services/blockchain.ts:3-8` (`process.env.SOLANA_RPC_URL` / `ETHEREUM_RPC_URL` / `BASE_RPC_URL` / `BNB_RPC_URL`). Model: `services/gemini.ts:18`. |

**§1 verdict: PASS**

---

## 2. Supabase RLS Matrix

| Table | FORCE RLS? | SELECT policy (summary) | INSERT | UPDATE | DELETE | Uses `auth.uid()`? | Tested? |
|---|---|---|---|---|---|---|---|
| — | **N/A** | No database | — | — | — | — | **N/A** |

### Evidence that Supabase / DB is not in this app

| Check | Evidence |
|---|---|
| No `@supabase/*` dependency | `package.json:11-28` dependencies = `@google/genai`, `lucide-react`, `next`, `react`, `react-dom`, `zod` only |
| No Supabase client / service role in source | ripgrep `supabase|@supabase|createClient|service_role` across `*.{ts,tsx,js}` → **no matches** in runtime code |
| Project memory states no DB | `docs/PROJECT_MEMORY.md:62` — “Supabase: not used (no DB persistence). Audits feed is client-session state.” |
| Audits persistence | `app/page.tsx:27,73-83` — `useState<AuditFeedItem[]>([])` session-only feed |

### RLS adversarial cases
| Case | Expected | Result | Evidence |
|---|---|---|---|
| User A cannot read User B rows | deny | **N/A** | No tables / no auth tenants |
| User A cannot update User B rows | deny | **N/A** | No tables / no auth tenants |
| Anon cannot read private tables | deny | **N/A** | No private tables |
| Service role not used from browser | N/A client | **PASS (N/A)** | No service-role key pattern in repo source |

**§2 verdict: N/A (documented) — does not block ship for this architecture**

---

## 3. API Hardening (`/api/*`)

| Route | Method | Zod schema | Auth check | Rate limit | IDOR guard | CSP/security headers inherit | Status |
|---|---|---|---|---|---|---|---|
| `/api/rag` | `POST` only (`app/api/rag/route.ts:6`) | **YES** — `validateAuditPayload` → `auditRequestSchema` (`lib/validation.ts:9-16,25-50`) + chain address regex (`lib/validation.ts:6-7,20-23,39-47`) | **NONE** (public by design) | **YES in-process** — `checkRateLimit` 10/min (`lib/rate-limit.ts:3-4,17-31`; wired `route.ts:8-17`) | **N/A** (no user-owned resources; target is public chain address) | **FAIL** — no headers middleware/config | **PARTIAL** |

### Request flow (evidence)

1. IP rate limit → `route.ts:7-17`
2. `req.json()` + legacy `{ address }` normalize → `route.ts:20-25`
3. Zod + regex → `route.ts:27-30` / `lib/validation.ts`
4. Audit orchestration → `route.ts:32-34` → `services/audit.ts:5-15`
5. Generic 500 → `route.ts:35-42` returns `{ error: "Internal Agent Failure" }` only (message logged server-side, not returned)

### Global HTTP security headers
| Header | Expected | Observed | Status |
|---|---|---|---|
| Content-Security-Policy | strict, no drive-by inline where avoidable | **Absent** — `next.config.ts:3-15` has only `cacheComponents` / `partialPrefetching` / `turbopack`; **no** `headers()` export; **no** `middleware.ts` | **FAIL** |
| X-Frame-Options / frame-ancestors | deny/sameorigin | Absent (same evidence) | **FAIL** |
| X-Content-Type-Options | nosniff | Absent | **FAIL** |
| Referrer-Policy | strict-origin-when-cross-origin (or tighter) | Absent | **FAIL** |
| Permissions-Policy | restrictive | Absent | **FAIL** |
| HSTS (prod) | present | Absent from app config (may rely on Vercel platform default — **not verified in-repo**) | **FAIL (in-repo)** |

### API hardening gaps (detail → § findings)

| Gap | Severity | Evidence |
|---|---|---|
| In-memory `Map` rate limit ineffective across serverless isolates | **P0** | `lib/rate-limit.ts:6` `const buckets = new Map<string, Bucket>()` — per-process only; Vercel multi-instance bypasses 10/min |
| Trusted IP from client-controlled `x-forwarded-for` | **P1** | `lib/rate-limit.ts:8-13` takes first XFF hop without platform-trust validation |
| No body size / Content-Type guard | **P1** | `route.ts:20` `await req.json()` unbounded |
| No upstream timeout on RPC / Gemini | **P1** | `services/blockchain.ts:35-39` `fetch(rpcUrl, …)` no `AbortSignal`; `services/gemini.ts:21-24` `generateContent` no timeout |
| Public unauthenticated Gemini spend surface | **P0** (paired with weak RL) | No auth on `POST /api/rag`; README markets public live demo |

**§3 verdict: FAIL** (headers missing + production rate-limit efficacy)

---

## 4. Input Validation & XSS

| Surface | Attack input examples | Expected safe behavior | Result | Evidence |
|---|---|---|---|---|
| Auth fields | N/A | N/A | **N/A** | No auth UI / routes |
| Profile / display name | N/A | N/A | **N/A** | No profiles |
| Search / address input | invalid base58 / non-`0x` hex / overflow | 400 + client reject | **PASS** | Client: `app/page.tsx:35-41` `isAddressValidForChain`; Server: `lib/validation.ts:39-47`. Max length Zod `.max(128)` (`lib/validation.ts:14`). |
| Prompt injection in address | `ignore previous instructions` etc. | scrubbed before LLM | **PASS (address path)** | `lib/prompt-guard.ts:1-21` patterns + charset strip `[^0-9a-zA-Z]`; prompt labels untrusted (`prompt-guard.ts:37-39`). Note: valid addresses cannot carry those phrases after regex gate. |
| ON_CHAIN_CONTEXT injection | adversarial RPC/owner string | scrub / treat untrusted | **PARTIAL / P2** | `lib/prompt-guard.ts:31-33` strips control chars + `.slice(0, 2000)` only — **no** injection-phrase scrub on context. Context built in `services/blockchain.ts:46-56` from RPC JSON. |
| Markdown / rich text / AI HTML | `<script>`, `img onerror` | no HTML execution | **PASS** | `components/ScanResults.tsx:49-51` renders `{result.aiAnalysis}` as React **text** child inside `<div>` with `whitespace-pre-line`. **No** `dangerouslySetInnerHTML`, **no** markdown/HTML renderer in dependencies (`package.json`). Repo grep: zero `dangerouslySetInnerHTML` / `innerHTML` / `ReactMarkdown` / `rehype` / `marked` / `DOMPurify`. |
| Error string reflection | stack / secret in UI | generic / Zod messages only | **PASS** | API 500: `route.ts:39-41` fixed string. Client displays `data.error` (`app/page.tsx:55-56,85-86,127-130`) — values are controlled API strings (`400` validation, `429` rate limit, `500` generic). |
| Webhook payloads | forged signatures | 401/400 | **N/A** | No webhooks |
| RPC failure modes | missing RPC URL / RPC error / throw | graceful fallback, no secret leak | **PASS** | Missing URL: `blockchain.ts:15-17` returns heuristic string. Non-OK result: `blockchain.ts:42-44`. Catch-all: `blockchain.ts:57-59`. RPC URL never returned to client. Missing Gemini key throws server-side (`gemini.ts:6-7`) → caught as `Internal Agent Failure` (`route.ts:35-42`). |

**§4 verdict: PASS** for XSS / address validation / error hygiene; residual **P2** on RPC context prompt scrubbing

---

## 5. Playwright E2E Matrix

### Environment
| Item | Value |
|---|---|
| Runner | Playwright · Chromium |
| Desktop viewport | 1280×720 (or project default desktop) |
| Mobile viewport | **390×844** (mandatory) |
| Base URL | NOT SET for Round 1 |
| Test user A / B | N/A (no auth) |

### Critical flows

| ID | Flow | Desktop | Mobile 390 | F5 persistence | Isolation A vs B | Console errors | CSP violations | 5xx | Status |
|---|---|---|---|---|---|---|---|---|---|
| E2E-01 | Register | NOT RUN | NOT RUN | NOT RUN | N/A | | | | **NOT RUN** |
| E2E-02 | Login | NOT RUN | NOT RUN | NOT RUN | N/A | | | | **NOT RUN** |
| E2E-03 | Core create/read entity (audit submit) | NOT RUN | NOT RUN | NOT RUN | N/A | | | | **NOT RUN** |
| E2E-04 | Reload F5 keeps session + data | NOT RUN | NOT RUN | NOT RUN | N/A (session feed only) | | | | **NOT RUN** |
| E2E-05 | User A data invisible to User B | NOT RUN | NOT RUN | | N/A (no tenants) | | | | **N/A** |
| E2E-06 | Checkout / billing happy path | NOT RUN | NOT RUN | | | | | | **N/A** |
| E2E-07 | XSS payloads in inputs | NOT RUN | NOT RUN | | | | | | **NOT RUN** |
| E2E-08 | Legal pages reachable | NOT RUN | NOT RUN | | | | | | **NOT RUN** |

### Hard thresholds (any breach = overall FAIL)
| Metric | Threshold | Observed | Pass? |
|---|---|---|---|
| `console.error` count during E2E | **0** | NOT RUN | — |
| CSP violation count | **0** | NOT RUN (CSP not configured → cannot measure violations) | — |
| HTTP 5xx responses | **0** | NOT RUN | — |
| Uncaught page errors | **0** | NOT RUN | — |

### Command proof paste area
```
# Round 1 Baseline — E2E intentionally NOT RUN
# Date (ISO): 2026-11-18
# Relay → @e2e-adversarial-tester for Round 2
```

---

## 6. Build Proof

```
$ npm run build
Date (ISO): 2026-11-18
Exit code: 0

▲ Next.js 16.4.6 (Turbopack)
- Environments: .env.local
✓ Running next.config.ts took 17ms
- Cache Components enabled
- Partial Prefetching enabled

  Creating an optimized production build ...
✓ Compiled successfully in 82ms
  Running TypeScript ...
  Finished TypeScript in 785ms ...
  Collecting page data using 1 worker ...
  Generating static pages using 1 worker (0/5) ...
✓ Generating static pages using 1 worker (5/5) in 80ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
└ ƒ /api/rag

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 7. Sign-Off

| Role | Verdict | Date | Notes |
|---|---|---|---|
| `@security-auditor` | **FAIL (Round 1 baseline)** — ship gate CLOSED for Security | 2026-11-18 | Secrets/Zod/XSS text-escape/error hygiene **PASS**. P0: no CSP/security headers; in-memory rate limit ineffective on serverless AI spend. P1: XFF trust, unbounded JSON body, no RPC/Gemini timeouts. P2: RPC context prompt scrub. E2E NOT RUN. Score **5/10**. |
| `@e2e-adversarial-tester` | **NOT RUN** | 2026-11-18 | Round 1 static only — relay required |
| `@red-team-enforcer` | **PASS (RT-002)** pack · security baseline still FAIL | 2026-11-18 | RT-001 blockers cleared (Q-P06 theater cite; research pack). Static security findings #1–#10 stand. Ship gate **CLOSED** until Round 2 security build. Round 1 research gate OPEN (ledger §7 RT-002). |
| Founder accept residual risk | | | Pending — list accepted residuals explicitly after remediations or formal accept |

### Findings register (Round 1 — file:line evidence)

#### P0
1. **Missing HTTP security headers (CSP, XFO/frame-ancestors, nosniff, Referrer-Policy, Permissions-Policy, HSTS)** — `next.config.ts:3-15` defines no `headers()`; filesystem confirms **no** `middleware.ts`. Hard-fail checklist criterion 6.
2. **Rate limit not production-effective for serverless** — `lib/rate-limit.ts:6` process-local `Map`; paired with unauthenticated Gemini spend on `POST /api/rag` (`app/api/rag/route.ts:6-34`, `services/gemini.ts:5-24`). Checklist criterion 5 fails under multi-instance deploy.

#### P1
3. **Client-spoofable rate-limit identity via `x-forwarded-for`** — `lib/rate-limit.ts:8-13` uses first XFF hop / `x-real-ip` without documenting trusted-proxy contract.
4. **Unbounded JSON body parse** — `app/api/rag/route.ts:20` `await req.json()` with no Content-Length / size guard.
5. **No AbortSignal / timeout on RPC or Gemini upstreams** — `services/blockchain.ts:35-39`; `services/gemini.ts:21-24` — hung upstream can pin serverless concurrency.

#### P2
6. **ON_CHAIN_CONTEXT only control-char stripped** — `lib/prompt-guard.ts:31-33` vs full phrase scrub on target (`:14-21`); residual prompt-injection surface if RPC payload is adversarial.
7. **`GEMINI_MODEL` unconstrained env string** — `services/gemini.ts:18` — misconfiguration / unexpected model risk (server-only, not client exposure).

#### Product integrity (trust / misleading security UX — cross-ref `00` §0.1)
8. **P0 integrity — fabricated vulnerability flags** — `lib/audit-helpers.ts:19-38` `defaultFlags(score)` invents flags from score bands; wired `app/page.tsx:70`. Not a classic CVE class, but **false security theater** vs user research **Q-P06** (`01` — scam-checker distrust / “borderline scams themselves”).
9. **P0 integrity — default risk score 72** when parse fails — `lib/audit-helpers.ts:3-9`.
10. **P1 integrity — “High-Risk Contract” Quick Target** is EIP-55 checksum example address — `lib/quick-targets.ts:14-21`.

### Positive controls (do not regress)
- Server-only secrets (`services/gemini.ts`, `services/blockchain.ts`); `.env*` gitignored; `.env.example` placeholders.
- Zod + chain regex (`lib/validation.ts`) on the only mutating route.
- Prompt-injection scrubbing on target address (`lib/prompt-guard.ts`).
- Generic 500 responses (`app/api/rag/route.ts:39-41`).
- AI output rendered as escaped React text (`components/ScanResults.tsx:49-51`).
- Next.js patched to `16.4.6` (`package.json:14`).

**Overall ship gate:** **CLOSED** until Security remediations (P0) + E2E PASS + Red Team PASS.

**Overall security score: 5/10**  
Justification: Strong secrets posture, input validation, prompt-guard on addresses, safe AI text rendering, and clean 500 hygiene earn the mid-band. Score is capped by complete absence of CSP/security headers and a rate limiter that cannot enforce spend limits on the public Gemini endpoint in a multi-instance Vercel deployment.

**Document status:** Round 1 Baseline Audit COMPLETE (static) — E2E NOT RUN · Red Team **RT-002 PASS** (research pack) · security score **5/10 ship CLOSED** (findings #1–#10 stand for Round 2 build).

---

## Relay

```
RELAY → @e2e-adversarial-tester / @red-team-enforcer
P0 security findings: (1) no CSP/security headers in next.config.ts / no middleware.ts; (2) in-memory Map rate limit ineffective on serverless + public Gemini /api/rag
P1: XFF IP spoof trust; unbounded req.json(); no RPC/Gemini timeouts
P2: RPC context prompt scrub; unconstrained GEMINI_MODEL
RLS tables reviewed: 0 (N/A — no Supabase/DB; evidence in §2)
API routes reviewed: 1 (POST /api/rag)
Secrets audit: PASS
CSP status: FAIL
E2E: NOT RUN (Round 1)
Build: PASS (npm run build exit 0, Next.js 16.4.6)
Score: 5/10 — ship gate CLOSED
```
