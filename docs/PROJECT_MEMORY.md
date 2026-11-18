# AegisWeb3 — Project Memory

> Read this file before any change. Update it at the end of every task.

## Overview

**AegisWeb3** is a Next.js multi-chain Web3 risk agent. Users submit a wallet/contract address, the server fetches live RPC context, and Gemini AI produces a structured security audit.

- **Product name:** AegisWeb3 // Autonomous Multi-Chain Risk Agent
- **Author:** Chris Traios
- **Live demo:** https://web3-risk-agent.vercel.app/
- **Framework:** Next.js 16.4.6 (App Router) + React 19 + Tailwind CSS 4

## Architecture

```
Browser (app/page.tsx + components/*)
    │  POST /api/rag { query, chain }
    ▼
app/api/rag/route.ts
    │  JSON/size → validate → rate-limit → audit
    ▼
blockchain snapshot → detectors → score/verdict → Gemini JSON (optional)
```

### Layers

| Layer | Path | Role |
| --- | --- | --- |
| UI | `app/page.tsx`, `components/`, `app/methodology` | Verdict strip, checked/not-checked, compliance footer |
| API | `app/api/rag/route.ts` | Returns `{ report, answer }` |
| Validation / security | `lib/validation.ts`, `lib/rate-limit.ts`, `lib/spend-cap.ts`, `lib/prompt-guard.ts` | Zod, RL, Gemini caps, injection scrubbing |
| Domain services | `services/blockchain.ts`, `services/gemini.ts`, `services/audit.ts` | Snapshot, structured AI, orchestration |
| Detectors | `lib/detectors.ts`, `lib/audit-helpers.ts` | Evidence flags + null-safe score |

## API Routes

### `POST /api/rag`

- **Body:** `{ query: string, chain: "solana" \| "ethereum" \| "base" \| "bnb" }`
- **Limits:** max **10 requests / minute / IP** → HTTP `429` when exceeded
- **Validation:** Zod schema + address regex (Solana base58 or EVM `0x` + 40 hex)
- **Response (200):** `{ report: AuditReport, answer: string }`
- **Errors:** `400` malformed JSON / validation / oversized body, `429` rate limit or AI spend cap, `500` internal (no secret leakage)

Secrets used here are **server-only** (`process.env.*`, never `NEXT_PUBLIC_*`).

## Env / secrets (server-only)

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Optional model override (default `gemini-3.8-flash`) |
| `SOLANA_RPC_URL` | Alchemy/Solana JSON-RPC |
| `ETHEREUM_RPC_URL` | Alchemy/Ethereum JSON-RPC |
| `BASE_RPC_URL` | Alchemy/Base JSON-RPC |
| `BNB_RPC_URL` | Alchemy/BNB JSON-RPC |

`.env*` is gitignored (with `!.env.example` exception). See `.env.example` for placeholders.

**Local note:** Vercel “Secret” values may pull as `[SENSITIVE]` placeholders — replace with real local keys. Production demo uses Vercel-hosted secrets.

**Supabase:** not used (no DB persistence). Audits feed is client-session state.

## RPC behavior

- **Solana:** `getAccountInfo` → lamports + owner
- **EVM (ethereum/base/bnb):** `eth_getCode` → contract vs EOA + bytecode length

## UI modules

- `components/Header.tsx` — brand + portfolio link (**Gemini AI** branding)
- `components/ChainSelector.tsx` — solana / base / ethereum / bnb
- `components/SearchForm.tsx` — address input + audit submit
- `components/QuickTestTargets.tsx` — Safe USDC, High-Risk contract, Live Solana pool
- `components/AuditsFeed.tsx` — live recent audits list (replaces static Recharts chart)
- `components/ScanResults.tsx` — AI report + vulnerability flags

## Quick Test Targets

| Label | Chain | Address |
| --- | --- | --- |
| Safe Token — USDC | ethereum | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| EIP-55 Checksum Demo | ethereum | `0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed` |
| Live Solana Pool | solana | `58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2` |

## Change history

### 2026-11-17 — Next patch, Quick Target chain sync, NFA footer

- Upgraded `next` and `eslint-config-next` from **16.4.4 → 16.4.6** (security advisory patch).
- Quick Test Targets now `flushSync` address + `setChain(target.chain)` so the active chain tab (ethereum / solana) updates immediately before the audit runs; chain badge shown on each target card.
- Added `components/Footer.tsx` with NFA disclaimer: “For informational & research purposes only. Not financial advice.” wired into `app/page.tsx`.

**Files:** `package.json`, `package-lock.json`, `app/page.tsx`, `components/QuickTestTargets.tsx`, `components/Footer.tsx`, `docs/PROJECT_MEMORY.md`

### 2026-11-17 — Permanent memory, security hardening, UX upgrade, QA

**Memory / agent rules**

- Added `docs/PROJECT_MEMORY.md` and root `.cursorrules` (read memory first, ≤250 lines/file, no frontend secrets, update memory after work).

**Security**

- Confirmed no `NEXT_PUBLIC_*` secret exposure; Gemini/Alchemy keys only via server `process.env`.
- `/api/rag`: IP rate limit (10/min → 429), Zod + chain-specific address regex, prompt-injection scrubbing in `lib/prompt-guard.ts`.
- API 500 responses return generic `Internal Agent Failure` (no stack/key leakage).
- Added `.env.example`; gitignore allows committing it.

**UX / modules**

- Split monolith into `components/`, `lib/`, `services/` (all files under 250 lines).
- Quick Test Targets under search bar; Recent Audits Feed replaces static AreaChart; removed `recharts`.
- Rebranded UI copy from “Gemini 3.8-Flash” → **Gemini AI**.
- Professional `README.md`; layout metadata updated.

**QA**

- `npm run build` — success (Next.js 16.4.4).
- Browser QA on `http://127.0.0.1:3000`:
  - Chain buttons (solana/ethereum/base/bnb) update placeholder/selection.
  - Invalid input → `Invalid Solana address…` (no crash).
  - Quick Targets fill address + switch chain and call `/api/rag`.
  - Without local `GEMINI_API_KEY`, audits return graceful `Internal Agent Failure` (expected); 0 client JS runtime errors.
- API curl: invalid → `400`; after 10 hits → `429` rate limit confirmed.
- Next.js reports a known security vulnerability on 16.4.4 (upgrade nudge during `next dev`).

### 2026-11-18 — ROUND 1 Zero-Base Code Audit (no code changes)

- Full radiography of `app/`, `components/`, `lib/`, `services/`, `next.config.ts`, `package.json` + `git diff HEAD` on `feat/production-security-upgrade` (uncommitted modularization).
- `npm run build` exit 0 on Next.js **16.4.6** (Turbopack).
- Critical findings logged for archivist → `COMPANY_OS/00` §0/§5: fabricated vulnerability flags (`defaultFlags`), default risk score 72 bias, EIP-55 demo address mislabeled as High-Risk, “Neural RAG” false claim, RPC bytecode length unit bug, in-memory rate-limit non-durable, no HTTP security headers, shallow on-chain context vs portfolio scanner bar.
- All audited source files ≤250 lines (largest: `app/page.tsx` 147).

**Files read (audit only):** inventory under app/components/lib/services + configs; no fixes applied.

### 2026-11-18 — Round 1 Baseline Security Audit (`@security-auditor`)

- Wrote full baseline into `COMPANY_OS/05_SECURITY_&_QA_SIGN_OFF.md` (replaced TEMPLATE). Branch `feat/production-security-upgrade` including uncommitted modularization.
- **Secrets:** PASS — no `NEXT_PUBLIC_*` secrets; Gemini/RPC via server `process.env` only; `.env*` gitignored; `.env.example` placeholders.
- **RLS:** N/A — no Supabase/DB (`package.json` has no `@supabase/*`; feed is `useState` only).
- **API:** sole route `POST /api/rag` has Zod + regex + in-memory 10/min RL + prompt-guard + generic 500s.
- **P0:** (1) zero CSP/security headers (`next.config.ts`, no `middleware.ts`); (2) process-local `Map` rate limit ineffective on serverless + public Gemini spend.
- **P1:** XFF IP trust; unbounded `req.json()`; no RPC/Gemini timeouts.
- **P2:** ON_CHAIN_CONTEXT prompt scrub shallow; unconstrained `GEMINI_MODEL`.
- **XSS:** PASS — AI report is React text (`ScanResults.tsx`), no `dangerouslySetInnerHTML`/markdown HTML.
- **E2E:** NOT RUN (Round 1 static). **Build:** `npm run build` exit 0 (Next 16.4.6).
- **Score:** 5/10 — ship gate CLOSED. Relay → `@e2e-adversarial-tester` / `@red-team-enforcer`.

**Files touched:** `COMPANY_OS/05_SECURITY_&_QA_SIGN_OFF.md`, `docs/PROJECT_MEMORY.md`

### 2026-11-18 — Round 1 Venture Strategy (`@venture-strategist`)

- Filled `COMPANY_OS/00_MASTER_LEDGER.md` §0 Venture Identity (AegisWeb3 / AegisChain Risk Agent, SaaS, build/live demo, Greece founder, English market).
- Mission **M-002**, Founder decision **D-003**, ideas I-001–I-009, issues B-002–B-012, competitive strategy brief §10 with Firecrawl-cited competitors (GoPlus, De.Fi, Blowfish, Arkham, CertiK).
- Pricing draft in `04` §4 (Free / Builder $9 est / Pro $29 est / API custom). Seeded `01` §4 competitor table for psychologist.
- TAM left **UNVERIFIED**; GoPlus $4.7M revenue cited only as competitor monetization clue (CoinDesk sponsored research).
- Status: strategy **IN_REVIEW** for `@red-team-enforcer`; next baton `@human-psychologist`.

**Files touched:** `COMPANY_OS/00_MASTER_LEDGER.md`, `COMPANY_OS/04_PRODUCT_UX_&_SUPPLY_CHAIN.md`, `COMPANY_OS/01_HUMAN_PSYCHOLOGY_&_MARKET.md`, `docs/PROJECT_MEMORY.md`

### 2026-11-18 — Round 1 Human Psychology (`@human-psychologist`)

- Fully rewrote `COMPANY_OS/01_HUMAN_PSYCHOLOGY_&_MARKET.md` with live Firecrawl + Alexandria Reddit research for AegisWeb3 ICP (retail + degens).
- Voice bank: **18** verbatim quote rows (12 pain + 6 delight/adjacent) with URLs + scrape dates; Reddit via `scrapecreators` (direct reddit.com scrape blocked); Blowfish.xyz TLS fail logged UNVERIFIED.
- Competitor tear-down **5/5** (GoPlus pricing tiers, De.Fi free scanner, Blowfish→Phantom, Arkham $1,500/mo, CertiK Skynet + Reddit “audit worthless”).
- Schwartz primary launch: Level **2→3**; Cialdini scarcity deferred; §8 roadmap **13** upgrade items; handoff ready pending `@red-team-enforcer`.

**Files touched:** `COMPANY_OS/01_HUMAN_PSYCHOLOGY_&_MARKET.md`, `docs/PROJECT_MEMORY.md`, `~/.cursor/global-vault/SAAS_STYLE_VAULT.md`

### 2026-11-18 — Round 1 Company OS closeout (RT-002 PASS)

- Bootstrapped Company OS via `bash ~/company-os-template/init-venture.sh` (`cp -n`): `.cursor/rules/00-ironclad-constitution.mdc` + 7 `COMPANY_OS/*` templates.
- Relay: security baseline **5/10 ship CLOSED** (`05`) · fullstack radiography (`00` §0.1) · Firecrawl competitor/user research (`01`) · venture strategy (`00` §10).
- **RT-001 FAIL** → remediations: hard Reddit permalinks (incl. `…/comment/lxgcswy/`), GoPlus dual-surface pricing (A token-security-api no $ / B security-api $199–$3499), CertiK audit $ → UNVERIFIED, `05` theater cross-ref → **Q-P06**.
- **RT-002 PASS** — Round 1 research gate OPEN; Round 2 **planning** allowed; **no security/product coding** until P0 sequence (headers, durable RL, structured score, GoPlus-class detectors, fake-flags removal).
- Key product integrity bugs for Round 2: `defaultFlags` fabrication, default score 72, EIP-55 Quick Target mislabel, shallow RPC, no CSP.

**Files touched:** `COMPANY_OS/00_MASTER_LEDGER.md`, `01_HUMAN_PSYCHOLOGY_&_MARKET.md`, `05_SECURITY_&_QA_SIGN_OFF.md`, `.cursor/rules/00-ironclad-constitution.mdc`, `docs/PROJECT_MEMORY.md`, global vaults

### 2026-11-18 — Late merge: fullstack radiography residuals

- Appended BUG-12…16 to `COMPANY_OS/00_MASTER_LEDGER.md` §0.1 from completed [fullstack audit](c5d8232b-fcea-4d9f-8b37-d4a4f46e4a5a): hex bytecode length, Solana null→“empty account”, false “Neural RAG” label, malformed JSON→500, RL-before-validate.
- No RT re-open (research pack already RT-002 PASS); items queued for Round 2 coding.

### 2026-11-18 — Round 2 full implementation (RT-003 PASS · 9/10)

- Killed scanner theater: removed `defaultFlags` + default score `72`; EIP-55 Quick Target honest demo label; no “Neural RAG” product claim.
- Deterministic risk engine: `OnChainSnapshot` + detectors (EVM bytecode bytes / proxy heuristic, Solana null≠empty, mint/freeze) + `AuditReport` with completeness / checked / notChecked / plain-English verdict.
- API: validate + size before RL; malformed JSON → **400**; Gemini structured JSON + spend cap; RPC/Gemini timeouts.
- Security headers in `next.config.ts`; compliance footer + `/methodology`; MiCA **2023/1114** + AI Act **2024/1689** in `COMPANY_OS/03` (Firecrawl EUR-Lex).
- Portfolio `README.md` (architecture Mermaid, API contract, threat model).
- `npm run lint` + `npm run build` exit **0**. Repo-only writes (no `~/.cursor/global-vault`).

**Files:** `lib/*`, `services/*`, `app/api/rag/route.ts`, `app/page.tsx`, `app/methodology/page.tsx`, `components/{ScanResults,AuditsFeed,QuickTestTargets,Footer}.tsx`, `next.config.ts`, `README.md`, `.env.example`, `COMPANY_OS/{00,03,05}`, `docs/PROJECT_MEMORY.md`, `.cursorrules`

### 2026-11-18 — Round 3 residuals + Playwright E2E (RT-004 PASS · 10/10)

- **XFF trusted-proxy:** `getClientIp` prefers `x-vercel-forwarded-for`; honors `X-Forwarded-For` only when `TRUSTED_PROXY=true` or `VERCEL=1`; else bucket `"direct"`.
- **BUG-04…11 CLOSED:** AbortController+req id; EVM balance/nonce + Solana signatures; skip Gemini on RPC UNAVAILABLE; verdict/threat/completeness chrome; await clipboard; GitHub repo portfolio URL; sessionStorage feed; address-only SearchForm placeholder.
- **Playwright:** `e2e/aegischain.spec.ts` + `playwright.config.ts` · desktop 1280×800 + mobile 390×844 · **20 passed / 0 failed / 0 skipped**.
- Proof: `npm run lint` exit 0 · `npm run build` exit 0 · `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright test` exit 0.
- Company OS: `00` + `05` updated · **RT-004 PASS** Production & Portfolio Ready.

**Files:** `lib/rate-limit.ts`, `services/{blockchain,audit}.ts`, `app/page.tsx`, `components/{ScanResults,Header,SearchForm}.tsx`, `.env.example`, `e2e/aegischain.spec.ts`, `playwright.config.ts`, `package.json`, `.gitignore`, `COMPANY_OS/{00,05}`, `docs/PROJECT_MEMORY.md`
