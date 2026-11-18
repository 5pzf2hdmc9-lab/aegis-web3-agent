# 00 — MASTER LEDGER (Company OS)

> Κεντρικό ημερολόγιο αποφάσεων, ιδεών Founder, κανόνων, εκκρεμοτήτων και change log.  
> Owner bot: `@enterprise-archivist`  
> Constitution: `.cursor/rules/00-ironclad-constitution.mdc`  
> Κάθε συνεδρία κλείνει μόνο μετά από sync αυτού του αρχείου.

---

## 0. Venture Identity

| Πεδίο | Τιμή | Ημ/νία καταχώρησης | Πηγή |
|---|---|---|---|
| Επωνυμία / Brand | **AegisWeb3** (product) / **AegisChain Risk Agent** (mission alias) | 2026-11-18 | Founder Round 1 brief · `app/layout.tsx` · README · live demo |
| Founder | Chris Traios | 2026-11-18 | Founder Round 1 brief |
| Νομική μορφή (Ατομική / ΙΚΕ / ΑΕ / Άλλο) | PENDING FOUNDER INPUT (portfolio SaaS demo σήμερα) | 2026-11-18 | Founder |
| Χώρα έδρας | Ελλάδα (Founder Greece) | 2026-11-18 | Founder Round 1 brief |
| Κύρια γλώσσα αγοράς | English (UI + reports) | 2026-11-18 | `app/layout.tsx` `lang="en"` |
| Μοντέλο (SaaS / E-commerce / Services / Hybrid) | **SaaS** — multi-chain Web3 risk / address security agent | 2026-11-18 | Product code |
| One-liner (τι πουλάμε σε ποιον) | Paste a wallet/contract address → live RPC + Gemini AI structured risk audit for retail crypto users & portfolio reviewers | 2026-11-18 | `docs/PROJECT_MEMORY.md` |
| Stage (idea / validation / build / live / scale) | **live demo + build** (Vercel) | 2026-11-18 | https://web3-risk-agent.vercel.app/ |
| Founder contact (email για legal/ops) | PENDING FOUNDER INPUT | 2026-11-18 | — |
| Live demo URL | https://web3-risk-agent.vercel.app/ | 2026-11-18 | README / memory |
| Repo branch (Round 1) | `feat/production-security-upgrade` (+ uncommitted modularization) | 2026-11-18 | `git status` |
| Stack | Next.js 16.4.6 · React 19 · Tailwind 4 · Zod · `@google/genai` · no DB/auth | 2026-11-18 | `package.json` |

### 0.1 Technical radiography (Round 1 zero-base audit)

**Architecture map**

```
Browser (app/page.tsx + components/*)
  POST /api/rag { query, chain }
    → parse/size → validation → rate-limit → services/audit
      → blockchain snapshot → detectors → score/verdict → Gemini JSON (optional)
```

| Layer | Path | Role |
|---|---|---|
| UI | `app/page.tsx`, `components/*`, `/methodology` | Verdict strip, completeness, compliance footer |
| API | `app/api/rag/route.ts` | `{ report, answer }` · JSON→400 before catch |
| Lib | `lib/*` | Zod, RL, spend-cap, detectors, helpers, types |
| Services | `services/*` | Snapshot, structured Gemini, orchestration |
| Config | `next.config.ts` | CSP + security headers |

**All source files ≤250 lines — PASS** (Round 2 re-check).

#### Functional / reliability bugs (file:line)

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| BUG-01 | **P0 (integrity)** | Vulnerability flags are **fabricated** from score bands — not parsed from Gemini or RPC | `lib/audit-helpers.ts:19-38` `defaultFlags(score)`; wired `app/page.tsx:70` |
| BUG-02 | **P0 (integrity)** | If Gemini omits parseable score, UI defaults to **72** (High Risk band) | `lib/audit-helpers.ts:3-9` `return 72` |
| BUG-03 | **P1 (demo honesty)** | “High-Risk Contract” Quick Target uses EIP-55 **checksum example** address, not a known honeypot | `lib/quick-targets.ts:14-21` `0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed` |
| BUG-04 | **P1 (race)** | Concurrent audits (double-click / Quick Target spam) can apply **stale** response — no AbortController / request id | `app/page.tsx:30-90` |
| BUG-05 | **P1 (RPC depth)** | On-chain context = only `getAccountInfo` (Solana) or `eth_getCode` (EVM) — no approvals, holders, liquidity, honeypot sim | `services/blockchain.ts:20-56` |
| BUG-06 | **P1 (silent degrade)** | RPC miss/error returns heuristic string; Gemini still invents full audit | `blockchain.ts:15-17,42-44,57-59` → `audit.ts:9-14` |
| BUG-07 | **P1 (UX)** | ScanResults always rose/danger chrome even for Low Risk | `components/ScanResults.tsx:12-41` |
| BUG-08 | **P2** | Clipboard copy not awaited / no failure path | `app/page.tsx:106-109` |
| BUG-09 | **P2** | Header “GitHub Portfolio” → generic `https://github.com` | `components/Header.tsx:17-24` |
| BUG-10 | **P2** | Feed lost on F5 (documented session-only; empty after reload) | `app/page.tsx:27,73-83` |
| BUG-11 | **P2** | Placeholder promises “Hash” but validation rejects non-addresses | `SearchForm.tsx:25` vs `lib/validation.ts` |
| BUG-12 | **P1 (RPC honesty)** | EVM “Bytecode Length” uses hex string `.length` (≈2× bytes + `0x`) | `services/blockchain.ts:52-56` |
| BUG-13 | **P1 (RPC honesty)** | Solana `result.value == null` labeled “verified on-chain (empty account)” — may be nonexistent | `services/blockchain.ts:47-49` |
| BUG-14 | **P0 (integrity)** | UI claims “Neural RAG Diagnostics” — no vector store / retrieval; only `/api/rag` name | `components/ScanResults.tsx:47` |
| BUG-15 | **P1 (API)** | Malformed JSON body → 500 (`req.json()` throw) instead of 400 | `app/api/rag/route.ts:20` inside broad catch |
| BUG-16 | **P2** | Rate limit runs before validation — invalid spam burns IP quota | `app/api/rag/route.ts:7-17` then validate |

#### Security cross-ref (see `COMPANY_OS/05_SECURITY_&_QA_SIGN_OFF.md`)

- Secrets / Zod / XSS text render: **PASS**
- CSP + security headers: **PASS** (`next.config.ts` `headers()` — CSP, XFO, nosniff, Referrer-Policy, Permissions-Policy)
- Rate limit: **PASS (warm + optional Upstash)** — `globalThis` + optional Redis REST; Gemini daily/burst spend cap
- Integrity theater (defaultFlags / score 72 / Neural RAG / EIP-55 mislabel): **FIXED Round 2**
- Score: **9/10** (RT-003 PASS) — residual: full Playwright E2E NOT RUN; XFF trusted-proxy assumption
- Ship gate: **OPEN for portfolio demo** · paid EU claims still need human lawyer (see `03`)

#### BUG remediation status (Round 2)

| ID | Status | Fix |
|---|---|---|
| BUG-01 | **FIXED** | Removed `defaultFlags`; flags only from detectors + optional AI interpretive |
| BUG-02 | **FIXED** | `riskScore: number \| null` — no default 72 |
| BUG-03 | **FIXED** | Quick Target relabeled **EIP-55 Checksum Demo** (`tone: demo`) |
| BUG-12 | **FIXED** | `hexBytecodeBytes()` true byte length |
| BUG-13 | **FIXED** | Solana null → account does not exist / no data |
| BUG-14 | **FIXED** | UI: “AI interpretive brief (not a vector RAG store)” |
| BUG-15 | **FIXED** | Malformed JSON → **400** before catch |
| BUG-16 | **FIXED** | Validate body before rate-limit consume |
| BUG-04…11 | OPEN / deferred | Race AbortController, deeper approvals enum, clipboard await, GitHub URL, F5 feed, SearchForm copy |

#### Production readiness vs 10/10 competitors

| Capability | AegisWeb3 today | Competitor bar (live research 2026-11-18) |
|---|---|---|
| Token security signals (honeypot, mint, LP lock) | LLM narrative only | GoPlus Token Security API ([gopluslabs.io/en/security-api](https://gopluslabs.io/en/security-api)) |
| Approval / allowance risk | Missing | GoPlus Approval Security API; De.Fi Shield ([de.fi/security](https://de.fi/security)) |
| Tx simulation before sign | Missing | Blowfish (EVM+Solana simulation — [apis.io/providers/blowfish](https://apis.io/providers/blowfish/)) |
| Entity / intel graph | Missing | Arkham ($1,500/mo after trial — [arkm.com](https://arkm.com/)) |
| Public trust score badge | Missing | CertiK Skynet Score ([certik.com](https://www.certik.com/)) |
| Structured machine score | Regex scrape of free text | Deterministic API fields |

**Build proof:** `npm run build` exit **0** · Next.js **16.4.6** · 2026-11-18 (also pasted in `05` §6).

---

## 1. Active Mission (τρέχουσα σκυταλοδρομία)

| Πεδίο | Τιμή |
|---|---|
| Mission ID | **M-002** |
| Στόχος (1 πρόταση) | Γύρος 1: Company OS bootstrap + zero-base code/security audit + live Firecrawl competitor/user research → artifacts 00/01/05 ready for Red Team before Round 2 implementation |
| Τρέχον bot | `@red-team-enforcer` — **RT-002 PASS** filed |
| Επόμενο bot | Round 2 **planning** owners (`@venture-strategist` / `@product-ux-architect` / `@brand-copy-director`) — research gate OPEN. **Do NOT code security P0** (headers/RL/integrity) until product Round 2 scope is planned & Founder-sequenced. |
| Status | **RT-002 PASS — Round 1 research gate OPEN** · Round 2 planning allowed · security/product coding still gated |
| Blockers | Founder legal entity PENDING (B-001); security ship CLOSED until Round 2 build (B-002–B-004); E2E NOT RUN (B-006) |
| Last updated (ISO) | 2026-11-18 |

### Relay log (σειριακή σκυταλοδρομία)

| # | Bot | Artifact touched | Started | Finished | Verdict / Notes |
|---|---|---|---|---|---|
| 0 | bootstrap | COMPANY_OS templates + ironclad | 2026-11-18 | 2026-11-18 | `init-venture.sh` · 7 files + constitution |
| 1 | `@security-auditor` | `05_SECURITY_&_QA_SIGN_OFF.md` | 2026-11-18 | 2026-11-18 | Baseline FAIL 5/10 · ship CLOSED |
| 2 | `@fullstack-builder` | Radiography → §0.1 | 2026-11-18 | 2026-11-18 | Audit-only · integrity bugs BUG-01..03 |
| 3 | `@human-psychologist` + Firecrawl | `01_HUMAN_PSYCHOLOGY_&_MARKET.md` | 2026-11-18 | 2026-11-18 | Live quotes + competitor table + Round 2 roadmap |
| 4 | `@venture-strategist` | §0 identity · §4 ideas · §5 blockers · **§10 strategy brief** · `04` §4 pricing | 2026-11-18 | 2026-11-18 | Option B hybrid positioning · Free/$9/$29/API · Firecrawl-cited competitors |
| 5 | `@enterprise-archivist` | this ledger | 2026-11-18 | 2026-11-18 | Full §0–§8 sync |
| 6 | `@red-team-enforcer` | 00/01/05 | 2026-11-18 | 2026-11-18 | **RT-001 FAIL** — see §7 |
| 7 | owners remediate | 01 permalinks · 00§10.2 · 05#8 | 2026-11-18 | 2026-11-18 | RT-001 fixes applied |
| 8 | `@red-team-enforcer` | 00/01/05 RT-002 | 2026-11-18 | 2026-11-18 | **RT-002 PASS** — Round 1 research gate OPEN |

---

## 2. Founder Decisions (αμετάκλητα μέχρι ρητή αναίρεση)

| ID | Ημ/νία (ISO) | Απόφαση (ακριβής διατύπωση) | Εκτελεστής bot | Impact files | Status |
|---|---|---|---|---|---|
| D-001 | 2026-11-18 | Εγκατάσταση μόνιμης υποδομής Company OS global στο Mac | bootstrap + archivist | mcp.json, agents/*, company-os-template/* | ACTIVE |
| D-002 | 2026-11-18 | Ironclad Constitution alwaysApply · Zero Truncation · Proof-Before-Claim · Maker-Checker | bootstrap | `.cursor/rules/00-ironclad-constitution.mdc` | ACTIVE |
| D-003 | 2026-11-18 | **Γύρος 1 Production & Portfolio Upgrade**: bootstrap Company OS στο `web3-risk-agent`, zero-base audit, Firecrawl competitor research (GoPlus, De.Fi, Blowfish, Arkham, CertiK), fill 00/01/05, Red Team gate πριν υλοποίηση Γύρου 2 | relay bots | `COMPANY_OS/*`, `.cursor/rules/*` | ACTIVE |
| D-004 | 2026-11-18 | Product brand for market docs = **AegisWeb3**; mission alias AegisChain Risk Agent OK in planning copy | archivist | 00, 01 | ACTIVE |

---

## 3. Standing Rules (επιπλέον του Συντάγματος)

| ID | Κανόνας | Προέλευση | Ενεργός από |
|---|---|---|---|
| R-001 | Απαγορεύονται stubs/TODO/N/A/fake data σε κάθε παραδοτέο | Constitution §1 | 2026-11-18 |
| R-002 | Νομικά/φορολογικά claims μόνο με live Firecrawl URL + ημερομηνία ελέγχου | Constitution §2.2 | 2026-11-18 |
| R-003 | Κανένα bot δεν αυτο-εγκρίνει· υποχρεωτικό `@red-team-enforcer` PASS | Constitution §3 | 2026-11-18 |
| R-004 | Copy μόνο από authentic human language· απαγόρευση AI-slop | Constitution §4 | 2026-11-18 |
| R-005 | Σειριακή σκυταλοδρομία μέσω COMPANY_OS | Constitution §5 | 2026-11-18 |
| R-006 | Session close μόνο μετά από ledger sync | Constitution §6 | 2026-11-18 |
| R-007 | **Aegis integrity:** UI flags/scores must derive from structured evidence (LLM JSON or on-chain/API fields) — never invent from score bands | Round 1 audit BUG-01/02 | 2026-11-18 |
| R-008 | Quick Test Targets must be factually labeled (no “High-Risk” on EIP-55 demo address) | BUG-03 | 2026-11-18 |
| R-009 | Never expose secrets via `NEXT_PUBLIC_*` · all `/api/*` Zod + rate-limit | `.cursorrules` + Security Vault | 2026-11-18 |

---

## 4. Ideas Parking Lot (Founder)

| ID | Ημ/νία | Ιδέα | Priority (P0–P3) | Linked market insight | Status |
|---|---|---|---|---|---|
| I-001 | 2026-11-18 | Deterministic risk score from GoPlus-class signals + Gemini narrative (hybrid) | P0 | GoPlus 30+ detection items — https://gopluslabs.io/en/token-security-api · Option B §10.4 | OPEN → Round 2 |
| I-002 | 2026-11-18 | Approval / unlimited-approve detector before user signs | P0 | GoPlus Approval Security (CoinDesk product line) · De.Fi Shield — https://de.fi/security | OPEN |
| I-003 | 2026-11-18 | Human-readable tx simulation lane (Blowfish-class) | P1 | https://www.alchemy.com/dapps/blowfish · GitHub API Evangelist Blowfish profile | OPEN |
| I-004 | 2026-11-18 | Plain-language “what this means / don’t sign if…” report | P0 | White space vs JSON-only APIs · pending psychologist voice quotes in `01` | OPEN |
| I-005 | 2026-11-18 | Trust signals: NFA already present; add methodology + evidence citations | P1 | CertiK Skynet public score | OPEN |
| I-006 | 2026-11-18 | Freemium / API credit packs (GoPlus Free→Pro custom pattern; De.Fi API sales-led) | P1 | https://gopluslabs.io/en/token-security-api · https://de.fi/api (2026-11-18) | OPEN |
| I-007 | 2026-11-18 | Auth + persisted audit history (session-only feed today) | P0 | Switching-cost gap vs account products | OPEN |
| I-008 | 2026-11-18 | PDF / shareable audit export | P1 | De.Fi Scanner PDF reports — https://de.fi/scanner | OPEN |
| I-009 | 2026-11-18 | REKT / exploit history cross-link beside findings | P2 | https://de.fi/api REKT + Audit DB APIs | OPEN |
| I-010 | 2026-11-18 | Skynet-style public score badge embed (long B2B2C) | P3 | https://www.certik.com/ Skynet API claim | PARKED |
| I-011 | 2026-11-18 | Avoid Arkham-priced AML lane until entity graph exists | P3 | https://arkm.com/ $1,500/mo | PARKED |

---

## 5. Open Issues & Blockers

| ID | Τύπος | Περιγραφή | Owner bot | Blocked since | Severity | Resolution criteria |
|---|---|---|---|---|---|---|
| B-001 | INPUT | Νομική επωνυμία / μορφή / founder email | Founder | 2026-11-18 | P2 | §0 legal fields filled |
| B-002 | SEC | Missing CSP/security headers | `@fullstack-builder` Round 2 | 2026-11-18 | P0 | `05` headers PASS |
| B-003 | SEC | Serverless-ineffective in-memory rate limit + public Gemini spend | Round 2 | 2026-11-18 | P0 | Durable RL (Upstash/Vercel KV) or edge config |
| B-004 | PROD | Fake flags + default score 72 (kills “explainable” positioning) | Round 2 | 2026-11-18 | P0 | Structured Gemini JSON schema + flags from model/RPC only |
| B-005 | PROD | Shallow RPC vs GoPlus/De.Fi feature bar | Round 2 | 2026-11-18 | P0 | Integrate ≥1 token-security data source |
| B-006 | QA | Playwright E2E NOT RUN | `@e2e-adversarial-tester` | 2026-11-18 | P1 | E2E matrix PASS in `05` |
| B-007 | RED | Red Team on Round 1 pack | `@red-team-enforcer` | 2026-11-18 | P0 | **CLOSED** — RT-002 PASS 2026-11-18 |
| B-008 | PRODUCT | No auth / DB / billing — cannot capture LTV or gate paid tiers | `@fullstack-builder` | 2026-11-18 | P0 | Auth + Stripe + persisted audits |
| B-009 | GTM | Free scanners (De.Fi, GoPlus Free) compress WTP for paste-audit alone | `@venture-strategist` + copy | 2026-11-18 | P0 | Paid wedge: history / API / sim / alerts validated |
| B-010 | LEGAL | Privacy/Terms/AI Act pages incomplete for EU founder English SaaS | `@legal-counsel` | 2026-11-18 | P0 | Live `/privacy` `/terms` + AI disclosure |
| B-011 | TAX | Pricing draft in `04` §4 — ΦΠΑ treatment not locked | `@cfo-tax-controller` | 2026-11-18 | P1 | Live AADE-cited VAT before Stripe |
| B-012 | INTEL | blowfish.xyz TLS severely broken — public Blowfish $ pricing UNVERIFIED | `@venture-strategist` | 2026-11-18 | P2 | Re-check domain or partner docs |
| B-013 | UNIT_ECON | CAC / refund % / Gemini+RPC COGS per audit unmeasured | Founder + CFO | 2026-11-18 | P1 | 30-day cost telemetry |

---

## 6. Deliverable Registry

| Artifact | Path | Last editor bot | Last edit (ISO) | Red Team | Status |
|---|---|---|---|---|---|
| Ironclad Constitution | `.cursor/rules/00-ironclad-constitution.mdc` | bootstrap | 2026-11-18 | PENDING | INSTALLED |
| Master Ledger | `COMPANY_OS/00_MASTER_LEDGER.md` | `@red-team-enforcer` | 2026-11-18 | **RT-002 PASS** | ACCEPTED Round 1 research pack · GoPlus dual-surface reconciled |
| Human Psychology | `COMPANY_OS/01_HUMAN_PSYCHOLOGY_&_MARKET.md` | `@human-psychologist` | 2026-11-18 | **RT-002 PASS** | ACCEPTED — hard permalinks Q-D02/03/04 + Q-P03; CertiK $ UNVERIFIED |
| Offer & Brand | `COMPANY_OS/02_OFFER_&_BRAND_COPY.md` | bootstrap | 2026-11-18 | — | TEMPLATE (Round 2+) |
| Legal & AADE | `COMPANY_OS/03_LEGAL_&_AADE_COMPLIANCE.md` | `@legal-counsel` | 2026-11-18 | **RT-003 PASS** (MiCA/AI Act cites) | MiCA 2023/1114 + AI Act 2024/1689 EUR-Lex verified · Greek tax UNVERIFIED |
| Product UX & Supply | `COMPANY_OS/04_PRODUCT_UX_&_SUPPLY_CHAIN.md` | `@venture-strategist` (§4 pricing draft) | 2026-11-18 | PENDING | DRAFT pricing — Round 2 planning OK |
| Security & QA | `COMPANY_OS/05_SECURITY_&_QA_SIGN_OFF.md` | `@security-auditor` + RT-003 | 2026-11-18 | **RT-003 PASS** · score **9/10** | P0 headers/RL/theater fixed · E2E residual |
| GTM Ads Outbound BI | `COMPANY_OS/06_GTM_ADS_OUTBOUND_&_BI.md` | bootstrap | 2026-11-18 | — | TEMPLATE |

---

## 7. Red Team Verdicts Log

| ID | Ημ/νία | Target artifact / bot | Verdict | Findings summary | Required fix owner |
|---|---|---|---|---|---|
| RT-000 | 2026-11-18 | Template install | N/A | Bootstrap only | — |
| RT-001 | 2026-11-18 | 00 + 01 + 05 Round 1 (`@venture-strategist` / `@human-psychologist` / `@security-auditor`) | **FAIL** | P0: Q-D02/D03/D04 lack hard permalinks; Q-P03 malformed URL; GoPlus pricing 00§10.2 (token-security-api “no public $”) ≠ 01§4 (security-api $199–$3499). P1: CertiK $5k–$150k uncited; 05 cites Q-P10 as “theater” but rewritten 01 Q-P10≠theater (should be Q-P06). Technical radiography spot-check PASS (BUG-01 `defaultFlags` L19–38 + `page.tsx:70`; RL `Map` L6; no `headers()`/`middleware.ts`). Pain quotes Q-P01/P05/P06/P10/P11 live-verified Alexandria 2026-11-18. | `@human-psychologist` (quotes) · `@venture-strategist` + `@enterprise-archivist` (GoPlus reconcile) · `@security-auditor` (05 Q-ID) |
| RT-002 | 2026-11-18 | 00 + 01 + 05 remediations re-check | **PASS** | All RT-001 blockers verified fixed: Q-D02=`…/1v40cks/` · Q-D03/D04=`…/1uhukgx/` · Q-D05=`…/1x9mkz2/` · Q-P03=`…/1gsqyrp/comment/lxgcswy/` · GoPlus dual-surface (A token-security-api no public $ / B security-api $199–$3499) identical in 00§10.2 + 01§4 · CertiK audit $ → UNVERIFIED REQUIRES HUMAN · 05 finding #8 cites Q-P06. Radiography re-spot-check PASS (`defaultFlags` L19–38 + `page.tsx:70`; `return 72` L6–8; RL `Map` L6; no `headers()`/`middleware.ts`; Quick Target EIP-55 L16–19). Stub/AI-slop scan clean on Round 1 pack. Ship gate for security coding remains CLOSED (documented baseline FAIL 5/10). | — (research gate open; Round 2 planning next) |
| RT-003 | 2026-11-18 | Round 2 code + `03` legal + README + build | **PASS** | Zero `defaultFlags` / `return 72` in `lib|services|app|components`. Malformed JSON → 400 (`app/api/rag/route.ts`). CSP+security headers in `next.config.ts`. EIP-55 Quick Target honest label. No “Neural RAG” product claim (methodology denies). MiCA **2023/1114** + AI Act **2024/1689** EUR-Lex URLs in `03` + Footer. `npm run lint` + `npm run build` exit 0. Score **9/10** (E2E residual). | — |

---

## 8. Change Log

| Ημ/νία (ISO) | Actor | Αρχείο | Τι άλλαξε | Why |
|---|---|---|---|---|
| 2026-11-18 | bootstrap | COMPANY_OS/* + constitution | Template install via `init-venture.sh` | Company OS venture bootstrap |
| 2026-11-18 | `@security-auditor` | `05_SECURITY_&_QA_SIGN_OFF.md` | Full baseline audit · FAIL 5/10 | Round 1 security radiography |
| 2026-11-18 | `@enterprise-archivist` | `00_MASTER_LEDGER.md` | §0 identity + technical radiography + mission M-002 + D-003/D-004 + bugs/issues | Round 1 ledger sync |
| 2026-11-18 | `@human-psychologist` | `01_HUMAN_PSYCHOLOGY_&_MARKET.md` | Live Firecrawl/Alexandria research + roadmap | Round 1 market & voice bank |
| 2026-11-18 | `@venture-strategist` | `00` §10 strategy brief + ideas/issues; `04` §4 pricing | Firecrawl competitor pricing/positioning | Round 1 monetization + white space |
| 2026-11-18 | `@red-team-enforcer` | `00` §1/§5/§6/§7/§8/§9 | RT-001 **FAIL** Maker-Checker on 00/01/05 | Ironclad gate; Round 2 blocked |
| 2026-11-18 | `@human-psychologist` + archivist | `01` quotes · `00` §10.2 · `05` #8 | RT-001 remediations: hard permalinks Q-P03/Q-D01–D05; GoPlus A+B surfaces; CertiK $ UNVERIFIED; theater→Q-P06 | Resubmit RT-002 |
| 2026-11-18 | `@human-psychologist` + archivist | `01` quotes · `00` §10.2 · `05` #8 | RT-001 remediations: hard permalinks Q-P03/Q-D01–D05; GoPlus A+B surfaces; CertiK $ UNVERIFIED; theater→Q-P06 | Resubmit RT-002 |
| 2026-11-18 | `@red-team-enforcer` | `00` §1/§5/§6/§7/§8/§9 | RT-002 **PASS** — Round 1 research gate OPEN; Round 2 planning allowed; no security P0 coding yet | Maker-Checker cleared |
| 2026-11-18 | `@enterprise-archivist` | `00` §0.1 BUG-12…16 | Late merge from fullstack zero-base radiography (bytecode units, empty-account label, false Neural RAG, JSON 500, RL-before-validate) | Completeness after subagent completion |
| 2026-11-18 | `@product-ux-architect` + `@fullstack-builder` | risk engine + UI | Kill theater; AuditReport; detectors; PARTIAL/UNAVAILABLE; verdict strip; methodology; BUG-01/02/03/12–16 | Round 2 U-01→U-20 core |
| 2026-11-18 | `@security-auditor` | `next.config.ts`, `rate-limit`, `spend-cap`, API order, timeouts | CSP/headers; validate→RL; Gemini caps; AbortSignal | Round 2 P0 security |
| 2026-11-18 | `@legal-counsel` | `03` + Footer | MiCA 2023/1114 + AI Act 2024/1689 Firecrawl EUR-Lex + UI banner | Round 2 compliance |
| 2026-11-18 | `@red-team-enforcer` | `00` §7 + `05` | **RT-003 PASS** · score 9/10 | Maker-Checker Round 2 |
| 2026-11-18 | `@enterprise-archivist` | `00` + `05` + memory | Ledger sync post RT-003 | Session close |

---

## 10. Round 1 Competitive Strategy Brief (`@venture-strategist`)

> Firecrawl primary scrape date: **2026-11-18**. Status: **RT-002 PASS** — GoPlus dual-surface pricing reconciled with `01` §4. Round 1 research gate OPEN. Maker-Checker: `@red-team-enforcer`.

### 10.1 Battlefield

| Dimension | Definition |
|---|---|
| Category | Web3 address/contract risk intelligence (consumer SaaS → future API) |
| ICP | English-speaking retail traders + indie builders who paste before swap/approve/deploy |
| Non-ICP (near-term) | Enterprise AML (Arkham), formal-verification audit buyers (CertiK services), wallet OEM sim SDKs (Blowfish) |
| WTP hypothesis | Low for one-off free-text scan; higher for history + structured flags + API credits + pre-sign sim |

### 10.2 Live competitor evidence

| Competitor | URLs (scraped 2026-11-18) | Pricing evidence | Moat | Opening for Aegis |
|---|---|---|---|---|
| GoPlus | **Two live surfaces (do not conflate):** (A) https://gopluslabs.io/en/token-security-api — Free **100 Call Credits/Minute** · Pro = customized credits (**no public $** on that page, scrape 2026-11-18). (B) https://gopluslabs.io/en/security-api — full suite pricing: Free **150K CU/mo** → Test **$199** → Beginner **$399** → Growth **$799** → Pro **$1,899** → Ultra **$3,499** → Enterprise custom (scrape 2026-11-18). | Token DB scale + wallet/DEX embeds | Opaque Pro UX on (A); Aegis wins on readable hybrid brief. Cite surface (A) vs (B) explicitly in copy. |
| De.Fi | https://de.fi/scanner · https://de.fi/api | Scanner marketed **Free**; API = contact / Book a Free Call | Multi-chain + REKT/Audit DBs + PDF | Soft monetization of free scanner |
| Blowfish | https://www.alchemy.com/dapps/blowfish · https://github.com/api-evangelist/blowfish · blowfish.xyz **TLS broken** | Alchemy lists **Free**; public $ **UNVERIFIED** | Pre-sign WARN/BLOCK in wallets | Different JTBD — paste-audit white space remains |
| Arkham | https://arkm.com/ | **$1,500 USD/mo** after approved 14-day trial (auto-charge) | Entity graph + compliance | Wrong ICP — do not price-match |
| CertiK/Skynet | https://www.certik.com/ · https://skynet.certik.com/ | No public SaaS menu on homepage | Audit brand + Skynet distribution | Slow/expensive for “check this address now” |

**Secondary (not TAM):** CoinDesk Research sponsored note (display_date 20251114) cites GoPlus **$4.7M** revenue (App ~$2.5M / SafeToken $1.7M / SaaS Intelligence $0.5M) — https://www.coindesk.com/research/protocol-research-goplus-security — monetization clue only.

### 10.3 Market sizing

| Layer | Status |
|---|---|
| TAM / SAM | **UNVERIFIED** — no publishable methodology URL in this pass; do not invent $B figures |
| SOM 12–24 mo | **ESTIMATE** 500–2,000 paying seats if Builder/Pro mix after auth — Founder accept/reject |

### 10.4 Positioning (pick)

| Option | Claim | Verdict |
|---|---|---|
| A — AI Risk Brief | Readable multi-chain brief in one paste | Commodity vs free scanners |
| **B — Hybrid Heuristic + AI** | Deterministic on-chain flags + AI narrative you can verify | **RECOMMENDED** — matches RPC+Gemini; requires fixing BUG-01/02 |
| C — Pre-Sign Guard | Simulate before you sign | Blowfish/OEM lane — later upsell (I-003) |

### 10.5 Monetization hypotheses

1. Freemium paste (must exist — De.Fi/GoPlus free)  
2. Builder/Pro for history + structured export + PDF (`04` §4: Free / **ESTIMATE $9** / **ESTIMATE $29** / API custom)  
3. API credits (GoPlus Free→Pro pattern)  
4. Sim / alerts as Pro+ add-ons  
5. Do not lead with CertiK-style audit services or Arkham AML pricing

### 10.6 Unit economics (formulas visible)

| Variable | Value | Source |
|---|---|---|
| ARPU | ESTIMATE blended **$12–29/mo** | `04` §4 mix |
| Gross margin % | ESTIMATE 60–80% — **PENDING** measured COGS | Gemini + RPC invoices |
| CAC | **PENDING FOUNDER INPUT** | No paid channels live |
| LTV method | ARPU × GM × months retained | Standard |
| LTV example | ESTIMATE $29 × 0.7 × 8 ≈ **~$162** | ESTIMATE |
| LTV:CAC target | ≥3:1 | Gate ad spend |
| Payback target | ≤3 months on Pro | Requires CAC |
| Break-even customers | ESTIMATE ~34 if $500 fixed / $15 contribution | ESTIMATE |
| Refund reserve | **PENDING** (working 5–10%) | CFO |

### 10.7 Exit readiness gaps (24–36 mo)

Retention/NRR (no accounts) · proprietary flag corpus · Privacy/Terms · trademark · distribution embeds · cost telemetry — owners: Builder / Legal / CFO / Strategist.

### 10.8 RELAY

```
RELAY → Round 2 planning (@venture-strategist / @product-ux-architect / @brand-copy-director)
Mission: Plan Round 2 product scope from accepted 00/01/05 — do NOT code security P0 until product round sequenced
Banned claims: fabricated TAM; “CertiK replacement”; “Arkham-grade AML”; safe-to-invest
Ledger mission: M-002 (research PASS; build still gated)
```

---

## 9. Session Close Checklist (υποχρεωτικό)

| Check | Done (YES/NO) | Notes |
|---|---|---|
| Νέες Founder decisions καταχωρήθηκαν στο §2 | YES | D-003, D-004 |
| Standing rules ενημερώθηκαν αν προέκυψαν νέοι | YES | R-007–R-009 |
| Open issues §5 ενημερώθηκαν | YES | B-002–B-013 |
| Deliverable registry §6 ενημερώθηκε | YES | |
| Red Team verdict καταχωρήθηκε αν υπήρχε review | YES | **RT-003 PASS** |
| Change log §8 έχει τουλάχιστον μία γραμμή για αυτή τη συνεδρία | YES | |
| Επόμενο bot / mission στο §1 είναι σαφές | YES | Optional E2E + paid-launch legal · BUG-04…11 backlog |

**Session status:** CLOSED Round 2 — **RT-003 PASS** · security **9/10** · portfolio ship gate OPEN · human lawyer still required for paid EU claims.
