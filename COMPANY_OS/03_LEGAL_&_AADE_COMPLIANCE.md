# 03 — LEGAL & AADE COMPLIANCE

> Owner bots: `@legal-counsel` (legal/GDPR/consumer) + `@cfo-tax-controller` (ΚΑΔ/ΓΕΜΗ/myDATA/ΦΠΑ/ΕΦΚΑ)  
> Constitution §2.2: **ΑΠΑΓΟΡΕΥΕΤΑΙ** ισχυρισμός από μνήμη. Κάθε κανονιστική γραμμή χρειάζεται live URL + ημερομηνία ελέγχου + Firecrawl.  
> Αν δεν επαληθεύεται 100%: `UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF`

---

## 0. Entity Snapshot

| Πεδίο | Τιμή | Verified? |
|---|---|---|
| Νομική επωνυμία | PENDING FOUNDER INPUT | |
| Διακριτικός τίτλος | AegisWeb3 | Product name only |
| ΑΦΜ | | HUMAN ONLY — never invent |
| ΔΟΥ | | |
| ΓΕΜΗ αριθμός | | |
| Έδρα (πλήρης διεύθυνση) | | |
| Νόμιμος εκπρόσωπος | | |
| Email επικοινωνίας / DPO contact | | |
| ΚΑΔ κύριος | | live check required |
| ΚΑΔ δευτερεύοντες | | |

---

## 1. Live Source Registry (υποχρεωτικό)

| Topic | Official URL used | Firecrawl run ID | Checked (ISO date) | Doc/Law citation | Status |
|---|---|---|---|---|---|
| MiCA (markets in crypto-assets) | https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng | `01a1eef1-be39-71d9-ab55-1fd7a09fb927` | 2026-11-18 | Regulation (EU) **2023/1114** of 31 May 2023; OJ L 150, 9.6.2023, p. 40; ELI http://data.europa.eu/eli/reg/2023/1114/oj | **VERIFIED (EUR-Lex)** |
| EU AI Act | https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng | `01a1eef1-be35-73aa-98af-234c5f0ddf2d` | 2026-11-18 | Regulation (EU) **2024/1689** of 13 June 2024 (Artificial Intelligence Act); OJ L, 2024/1689, 12.7.2024; ELI http://data.europa.eu/eli/reg/2024/1689/oj | **VERIFIED (EUR-Lex)** |
| EUR-Lex portal | https://eur-lex.europa.eu | (parent of above) | 2026-11-18 | Official EU law publication | VERIFIED as source host |
| GDPR / DPA Greece | https://www.dpa.gr | NOT RUN Round 2 | | Regulation (EU) 2016/679 | UNVERIFIED — REQUIRES HUMAN LAWYER for Greek ops |
| ΑΑΔΕ portal | https://www.aade.gr | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| myDATA / timologio | (fill from live aade.gr navigation) | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| ΓΕΜΗ / business portal | https://www.businessportal.gr | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| Καταναλωτής Ν. 2251/1994 | (live ET / gov source) | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN LAWYER |
| ΕΦΚΑ | (live efka.gov.gr) | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| VIES | (live EC VIES) | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |

---

## 2. MiCA — Product Classification (live-cited)

**Citation:** Regulation (EU) 2023/1114 on markets in crypto-assets (MiCA) — EUR-Lex: https://eur-lex.europa.eu/eli/reg/2023/1114/oj/eng · Firecrawl search id `01a1eef1-be39-71d9-ab55-1fd7a09fb927` · Checked **2026-11-18**.

| Claim | Position | Evidence / note | Status |
|---|---|---|---|
| Official number | **2023/1114** | Title line on EUR-Lex OJ Eng page | VERIFIED |
| Adoption date | 31 May 2023 | Same | VERIFIED |
| OJ cite | OJ L 150, 9.6.2023, p. 40 | Summary + act text | VERIFIED |
| AegisWeb3 offers CASP services? | **No (product intent)** | Paste-only risk heuristics; no custody, exchange, transfer, or advice-as-service execution | PRODUCT ASSERTION — human counsel must confirm vs Art. 3 definitions before commercial launch in EU |
| UI disclaimer | Footer + `COMPANY_OS/03` | States we do not offer crypto-asset services as defined in MiCA | Implemented Round 2 |

**Human lawyer required** before claiming MiCA exemption or registration status publicly beyond “informational tool” framing.

---

## 3. EU AI Act — Transparency Posture (live-cited)

**Citation:** Regulation (EU) 2024/1689 (Artificial Intelligence Act) — EUR-Lex: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng · Firecrawl search id `01a1eef1-be35-73aa-98af-234c5f0ddf2d` · Checked **2026-11-18**.

| Claim | Position | Evidence / note | Status |
|---|---|---|---|
| Official number | **2024/1689** | Title on EUR-Lex OJ Eng | VERIFIED |
| Adoption date | 13 June 2024 | Same | VERIFIED |
| OJ cite | OJ L, 2024/1689, 12.7.2024 | Act text / summary | VERIFIED |
| Product AI use | LLM interpretive brief on top of deterministic RPC flags | Separated in UI (`aiSummary` vs evidence flags) | Implemented |
| Transparency | Footer + `/methodology` disclose AI-assisted output; no “Neural RAG” false claim | Round 2 UI | Implemented |
| Risk-class filing | Not asserted | High-risk / GPAI obligations **UNVERIFIED — REQUIRES HUMAN LAWYER** before EU commercial claims | OPEN |

---

## 4. Tax & Corporate Checklist (CFO)

| Item | Required action | Live URL + citation | Checked (ISO) | Owner | Status |
|---|---|---|---|---|---|
| Επιλογή ΚΑΔ που ταιριάζει στη δραστηριότητα | Confirm vs official ΚΑΔ list | | | `@cfo-tax-controller` | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| Έναρξη / μεταβολή στην ΑΑΔΕ | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| ΓΕΜΗ registration / announcements | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| myDATA διαβιβάσεις | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| ΦΠΑ καθεστώς | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| Intra-EU B2B / VIES | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| ΕΦΚΑ | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |
| Stripe/payments → books | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT |

---

## 5. Consumer Law & E-Commerce (Ν. 2251/1994 κ.ά.)

| Requirement | Our implementation plan | Live law URL + article | Checked (ISO) | Status |
|---|---|---|---|---|
| Προσυμβατική ενημέρωση | Entity + NFA in footer; pricing when monetized | | | UNVERIFIED — REQUIRES HUMAN LAWYER |
| 14-day withdrawal | Digital service / SaaS analysis needed | | | UNVERIFIED — REQUIRES HUMAN LAWYER |
| Returns / cancellations | Align with `@ops-support-director` when paid | | | UNVERIFIED — REQUIRES HUMAN LAWYER |

---

## 6. GDPR / Privacy / Cookies / AI Transparency

| Artifact | Path or URL when live | Controllers / processors listed | Legal basis documented | Live citations | Status |
|---|---|---|---|---|---|
| In-product compliance banner | `components/Footer.tsx` | N/A (product notice) | NFA + AI transparency + zero seed storage | MiCA 2023/1114 · AI Act 2024/1689 EUR-Lex | **SHIPPED Round 2** |
| Methodology / AI honesty | `/methodology` | | Deterministic vs AI split | | **SHIPPED Round 2** |
| Πολιτική Απορρήτου | `/privacy` | | | GDPR | NOT DRAFTED — human lawyer |
| Όροι Χρήσης | `/terms` | | | | NOT DRAFTED |
| Πολιτική Cookies | `/cookies` | | | | NOT DRAFTED (no analytics pixels yet) |

### Data minimization (product)

| Data | Stored? | Note |
|---|---|---|
| Seed / private key | **Never** | Paste scan only; banner on home |
| Wallet connect session | **No** | Not requested |
| Pasted address | Processed per request; session feed is client-only | No Supabase persistence in current build |
| IP for rate limit | Ephemeral / Upstash TTL when configured | Security control |

---

## 7. Sign-Off Block

| Role | Name | Date | Statement |
|---|---|---|---|
| `@legal-counsel` (bot draft) | Round 2 | 2026-11-18 | MiCA 2023/1114 + AI Act 2024/1689 EUR-Lex verified via Firecrawl; UI disclaimers shipped. Not legal advice. |
| `@cfo-tax-controller` (bot draft) | | | Draft only — tax rows remain UNVERIFIED |
| `@red-team-enforcer` | | | Pending RT-003 |
| Human lawyer | PENDING | | Required before EU commercial marketing claims |
| Human accountant | PENDING | | |

**Document status:** Round 2 — MiCA + AI Act citation rows **VERIFIED**; Greek tax/consumer rows remain `UNVERIFIED — REQUIRES HUMAN…`.
