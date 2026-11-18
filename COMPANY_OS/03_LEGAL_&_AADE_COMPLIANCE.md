# 03 — LEGAL & AADE COMPLIANCE

> Owner bots: `@legal-counsel` (legal/GDPR/consumer) + `@cfo-tax-controller` (ΚΑΔ/ΓΕΜΗ/myDATA/ΦΠΑ/ΕΦΚΑ)  
> Constitution §2.2: **ΑΠΑΓΟΡΕΥΕΤΑΙ** ισχυρισμός από μνήμη. Κάθε κανονιστική γραμμή χρειάζεται live URL + ημερομηνία ελέγχου + Firecrawl.  
> Αν δεν επαληθεύεται 100%: `UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF`

---

## 0. Entity Snapshot

| Πεδίο | Τιμή | Verified? |
|---|---|---|
| Νομική επωνυμία | PENDING FOUNDER INPUT | |
| Διακριτικός τίτλος | | |
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
| ΑΑΔΕ portal | https://www.aade.gr | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| myDATA / timologio | (fill from live aade.gr navigation) | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| ΓΕΜΗ / business portal | https://www.businessportal.gr | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| Εθνικό Τυπογραφείο | https://www.et.gr | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| GDPR / DPA Greece | https://www.dpa.gr | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| EUR-Lex (GDPR / AI Act) | https://eur-lex.europa.eu | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| Καταναλωτής Ν. 2251/1994 | (live ET / gov source) | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| ΕΦΚΑ | (live efka.gov.gr) | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| VIES | (live EC VIES) | NOT RUN | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |

---

## 2. Tax & Corporate Checklist (CFO)

| Item | Required action | Live URL + citation | Checked (ISO) | Owner | Status |
|---|---|---|---|---|---|
| Επιλογή ΚΑΔ που ταιριάζει στη δραστηριότητα | Confirm vs official ΚΑΔ list | | | `@cfo-tax-controller` | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| Έναρξη / μεταβολή στην ΑΑΔΕ | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| ΓΕΜΗ registration / announcements | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| myDATA διαβιβάσεις (παραστατικά) | ERP/provider + obligations | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| ΦΠΑ καθεστώς (κανονικό / απαλλαγή / OSS) | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| Intra-EU B2B / VIES | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| ΕΦΚΑ ασφαλιστικές υποχρεώσεις ιδρυτή/προσωπικού | | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| Τιμολόγηση Stripe/payments → λογιστική ροή | Map payouts to books | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |

### Unit economics bridge (from ops into tax reality)

| Metric | Formula | Current value | Notes |
|---|---|---|---|
| CAC | | PENDING | |
| LTV | | PENDING | |
| Gross margin % | | PENDING | |
| Net margin after tax/VAT handling | | PENDING | HUMAN ACCOUNTANT |

---

## 3. Consumer Law & E-Commerce (Ν. 2251/1994 κ.ά.)

| Requirement | Our implementation plan | Live law URL + article | Checked (ISO) | Status |
|---|---|---|---|---|
| Προσυμβατική ενημέρωση (ταυτότητα εμπόρου, τιμή, χαρακτηριστικά) | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| Δικαίωμα υπαναχώρησης 14 ημερών (αν εφαρμόζεται) | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| Εξαιρέσεις υπαναχώρησης (ψηφιακό περιεχόμενο κ.λπ.) | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| Πολιτική επιστροφών / ακυρώσεων (ευθυγράμμιση με νόμο + ops) | Link to `04` / ops SOPs | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |
| Εγγυήσεις / ελαττωματικά | | | | UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF |

---

## 4. GDPR / Privacy / Cookies / AI Transparency

| Artifact | Path or URL when live | Controllers / processors listed | Legal basis documented | Live citations | Status |
|---|---|---|---|---|---|
| Πολιτική Απορρήτου | `/privacy` (to be written in full) | | | | NOT DRAFTED |
| Όροι Χρήσης | `/terms` | | | | NOT DRAFTED |
| Πολιτική Cookies | `/cookies` | | | | NOT DRAFTED |
| Πολιτική Επιστροφών | `/returns` | | | | NOT DRAFTED |
| AI Transparency notice | `/ai` or section in privacy | | | EU AI Act via eur-lex live | NOT DRAFTED |
| DPA with processors (Supabase, Stripe, ESP, analytics) | `COMPANY_OS` attachments / vendor folder | | | | NOT DRAFTED |
| RoPA / records of processing | internal | | | | NOT DRAFTED |
| Data subject request SOP | `@ops-support-director` | | | Art.15–22 live | NOT DRAFTED |

### Cookie / tracking inventory

| Tool | Cookies / pixels | Purpose | Consent required? | Configured in CMP? |
|---|---|---|---|---|
| GA4 | | analytics | typically yes | PENDING |
| Meta Pixel / CAPI | | ads | yes | PENDING |
| TikTok Pixel | | ads | yes | PENDING |
| PostHog | | product analytics | depends on config | PENDING |

---

## 5. Full Legal Document Draft Status

Όταν γραφτούν, τα κείμενα μπαίνουν **ολόκληρα** σε repo paths (όχι περίληψη εδώ). Εδώ κρατάμε index:

| Document | Repo path | Word/char count | Last legal review | Human lawyer sign-off |
|---|---|---|---|---|
| Terms | | 0 | | REQUIRED before publish |
| Privacy | | 0 | | REQUIRED before publish |
| Cookies | | 0 | | REQUIRED before publish |
| Returns | | 0 | | REQUIRED before publish |
| AI Transparency | | 0 | | REQUIRED before publish |

---

## 6. Sign-Off Block

| Role | Name | Date | Statement |
|---|---|---|---|
| `@legal-counsel` (bot draft) | | | Draft only — not legal advice |
| `@cfo-tax-controller` (bot draft) | | | Draft only — not tax advice |
| `@red-team-enforcer` | | | |
| Human lawyer | PENDING | | |
| Human accountant | PENDING | | |

**Document status:** TEMPLATE — all regulatory rows default to `UNVERIFIED — REQUIRES HUMAN ACCOUNTANT/LAWYER SIGN-OFF` until live Firecrawl verification + human sign-off.
