# 01 — HUMAN PSYCHOLOGY & MARKET

> Owner bot: `@human-psychologist`  
> Consumers: `@brand-copy-director`, `@venture-strategist`, `@performance-media-buyer`, `@revenue-outbound-engine`  
> Rule: Κάθε quote πρέπει να έχει live URL + ημερομηνία scrape μέσω Firecrawl. Απαγορεύονται κατασκευασμένα quotes.  
> Round: **R1 — 2026-11-18** · Venture: **AegisWeb3** (multi-chain Web3 risk agent / wallet+contract scanner)

---

## 0. Research Brief

| Πεδίο | Τιμή |
|---|---|
| Venture / Offer under study | AegisWeb3 — multi-chain Web3 risk agent: paste wallet/token/contract → risk flags + human-readable AI brief before interact |
| Primary ICP (who) | Crypto retail + degens who scan tokens/contracts/wallets before swapping, approving, bridging, or connecting |
| Primary job-to-be-done | “Tell me in plain English if this token/contract/approval can rug or drain me — before I sign” |
| Geography / language | Global English (primary voice bank); Greek secondary market later |
| Competitors in scope (min 3) | GoPlus Security · De.Fi Scanner · Blowfish · Arkham Intelligence · CertiK (Skynet / security score) |
| Research window (ISO dates) | 2026-11-18 (Round 1 live Firecrawl + Alexandria Reddit) |
| Firecrawl runs logged | 14 (see §6) |
| Platforms covered | Reddit (Alexandria scrapecreators) · Competitor product pages · Industry comparison articles · Phantom/Blowfish acquisition note |
| Blockers / scrape fails | Direct `firecrawl_scrape` of reddit.com = **not supported** → switched to Alexandria `scrapecreators/reddit/*`. `blowfish.xyz` TLS severely broken even with `skipTlsVerification` → used Phantom acquisition + FluidRWA + Alchemy listing as secondary sources (marked). |

---

## 1. Authentic Voice Bank (Raw Quotes)

Scraped (ISO) = **2026-11-18** unless noted. Exact wording preserved; ellipsis `…` only where truncated for length (full post available at URL).

### 1.1 Pain / Frustration (1★ energy, drains, rugs, unreadable reports)

| ID | Platform | Exact quote (verbatim) | URL | Scraped (ISO) | Theme tag |
|---|---|---|---|---|---|
| Q-P01 | Reddit r/CryptoCurrency | “I don’t even know how to start this. I’m sitting here shaking, feeling physically sick. I just lost $10,700 to a hack on the Polygon network (Metamask) That wasn’t just \"crypto money\" to me. That was my wedding fund. I have been saving for over 2 years. … Now, in a matter of minutes, it’s all gone. The wedding we’ve been planning might have to be canceled or postponed indefinitely.” | https://www.reddit.com/r/CryptoCurrency/comments/1vg48ll/i_got_hacked_for_10700_usdc_of_my_wedding_savings/ | 2026-11-18 | wallet_drain · emotional_loss |
| Q-P02 | Reddit r/solana | “My friends phantom wallet just got hacked and he lost $28000. Is there anything we can do? Or understand how it happened?” | https://www.reddit.com/r/solana/comments/1gsqyrp/drained_28000_worth_of_sol/ | 2026-11-18 | drain · helplessness |
| Q-P03 | Reddit r/solana (comment Tall_Run_2814) | “Only 2 ways this can happen: Seed phrase is compromised. … Wallet was attached to a shady site and a malicious contract was unwittingly approved which allowed withdraws.” | https://www.reddit.com/r/solana/comments/1gsqyrp/comment/lxgcswy/ | 2026-11-18 | malicious_approval · seed |
| Q-P04 | Reddit r/defi | “Hi, I read a lot that anyone should check existing contract approvals to revoke them regularly. However, it's not clear to me. When are they created exactly? Why are they not deleted automatically after each operation by the hardware wallet? Why we cannot see them in the hardware wallet? … It sounds strange to me that it's not fully native to any wallet, with alerts, reminders, auto-revoking, and so.” | https://www.reddit.com/r/defi/comments/1hc3ivu/looking_to_better_understand_contract_approvals/ | 2026-11-18 | approval_confusion · UX_gap |
| Q-P05 | Reddit r/ethereum | “Using de.fi/scanner has some red flags. Obviously this looks concerning or bad. But for all I know this is somewhat normal for even legitimate projects as I'm new to analyzing with these tools. … Is this terrible?” | https://www.reddit.com/r/ethereum/comments/193uunb/ethereum_scam_checker_tool_is_this_a_red_flag/ | 2026-11-18 | unreadable_report · false_alarm_anxiety |
| Q-P06 | Reddit r/ethereum (comment) | “If you need to rely a scam checking tool to check tokens you trade, and you do not understand what the tool is telling you, you are going to lose money. None of these tools can tell you whether a token is a scam or not. In fact some of these \"scam checker tools\" are borderline scams themselves.” | https://www.reddit.com/r/ethereum/comments/193uunb/ethereum_scam_checker_tool_is_this_a_red_flag/ (author moo9001) | 2026-11-18 | tool_distrust · literacy |
| Q-P07 | Reddit r/CryptoCurrency | “Certik is a junk grade audit firm that audits everything they can lay their hands on with a very basic checklist. They dont really identify if a project is susceptible to hacks. Hell, Certik audited projects have even rugpulled in the past (Eg: MOORE). … anything claiming to have passed a Certik audit is not a good look.” | https://www.reddit.com/r/CryptoCurrency/comments/s25ft2/lets_discuss_audits_a_certik_audit_is_worthless/ | 2026-11-18 | audit_badge_skepticism |
| Q-P08 | Reddit r/solana | “Wanted to trade on hyperliquid … Took a break for work and in an hour’s time I got drained … I copied the seed phrase to google keep so it would be faster for me to type it out by copy pasting I know, I’m a careless idiot for doing that …” | https://www.reddit.com/r/solana/comments/1iorwhh/wallet_drained_want_to_know_what_happened_so_it/ | 2026-11-18 | drain · self_blame · seed |
| Q-P09 | Reddit r/solana (comment) | “You can't believe how silly I feel now in hindsight. This was the one time ever I've put it on google Keep.” | https://www.reddit.com/r/solana/comments/1iorwhh/wallet_drained_want_to_know_what_happened_so_it/ (author PieceConfident7733) | 2026-11-18 | regret · one_mistake |
| Q-P10 | Reddit r/ethereum (comment) | “Dude, you are NOT going to make money off of these scam bullshit coins. … then RUG PULL THE SHIT out of you.” | https://www.reddit.com/r/ethereum/comments/193uunb/ethereum_scam_checker_tool_is_this_a_red_flag/ (author Achides) | 2026-11-18 | rug_pull · meme_coin_risk |
| Q-P11 | Reddit r/CryptoCurrency (comment) | “Not explaining HOW this happened is a choice. You literally just did nothing different and woke up to everything gone? You mentioned you had your seed phrase as a photo on your phone …” | https://www.reddit.com/r/CryptoCurrency/comments/1vg48ll/i_got_hacked_for_10700_usdc_of_my_wedding_savings/ (author ChunkyDickCheese) | 2026-11-18 | how_did_it_happen · forensic_need |
| Q-P12 | Reddit r/solana (comment) | “Don't listen to what thes people say here. It's always \"you did something wrong, exposed your seedphrase etc\" which is not quite right. There are literally exploits out there that are targetting users whereby they send you a token which you already have and drain you.” | https://www.reddit.com/r/solana/comments/1iorwhh/wallet_drained_want_to_know_what_happened_so_it/ (author DesperateSomewhere37) | 2026-11-18 | token_drain_exploit · victim_blame |

### 1.2 Desire / Delight (what “safe enough” sounds like)

| ID | Platform | Exact quote (verbatim) | URL | Scraped (ISO) | Theme tag |
|---|---|---|---|---|---|
| Q-D01 | Reddit r/defi (comment tervelix) | “Yes, Rabby have batch revoke so much suitable. You can connect your ledger to it and revoke approvals, don’t enter your seed phrase just connect with ledger.” | https://www.reddit.com/r/defi/comments/1hc3ivu/comment/m20hzco/ | 2026-11-18 | batch_revoke · hardware_safe |
| Q-D02 | Reddit r/CryptoScams | “It looks like an unlimited approve function. Is this a phishing scam designed to drain my wallet? I haven't signed it yet. Thanks!” | https://www.reddit.com/r/CryptoScams/comments/1v40cks/ | 2026-11-18 | catch_before_sign · unlimited_approve |
| Q-D03 | Reddit r/memecoinmoonshots | “genuinely asking bc i check it on every token before i touch anything but half the time the stuff that passes still rugs.” | https://www.reddit.com/r/memecoinmoonshots/comments/1uhukgx/ | 2026-11-18 | habit_scan_first · false_negative |
| Q-D04 | Reddit r/memecoinmoonshots | “feel like the dev wallet warnings are the only thing thats actually useful.” | https://www.reddit.com/r/memecoinmoonshots/comments/1uhukgx/ | 2026-11-18 | concrete_signals |
| Q-D05 | Reddit r/CryptoHelp | “I use the Jupiter extension to review transaction details before approving them. I'm still learning what to look for.” | https://www.reddit.com/r/CryptoHelp/comments/1x9mkz2/ | 2026-11-18 | pre_sign_review |
| Q-D06 | Product / market signal (Phantom blog — not end-user review) | “With 2.8 million scams prevented, 1.3 billion transactions scanned, and more than $18 billion worth of assets protected, Blowfish has protected countless users.” | https://phantom.com/learn/blog/phantom-acquires-blowfish | 2026-11-18 | pre_sign_defense_proof · **vendor claim** |

### 1.3 Slang / Idioms / Humor (native voice)

| ID | Phrase / slang | Context (when they say it) | URL | Scraped (ISO) | Usable in copy? (Y/N) |
|---|---|---|---|---|---|
| Q-S01 | “got drained” / “wallet drained” | After funds leave without recovery | https://www.reddit.com/r/solana/comments/1iorwhh/wallet_drained_want_to_know_what_happened_so_it/ | 2026-11-18 | Y |
| Q-S02 | “RUG PULL THE SHIT out of you” | Warning against meme coins | https://www.reddit.com/r/ethereum/comments/193uunb/ethereum_scam_checker_tool_is_this_a_red_flag/ | 2026-11-18 | Y (edgy ads / community) · N (corporate landing) |
| Q-S03 | “ape into” | Buying because of audit badge / hype | https://www.reddit.com/r/CryptoCurrency/comments/s25ft2/lets_discuss_audits_a_certik_audit_is_worthless/ (title: “Don't ape into something because it claims to be audited by Certik”) | 2026-11-18 | Y |
| Q-S04 | “rekt” / “getting rekt” | Loss after DeFi interaction | https://www.reddit.com/r/ethereum/comments/193uunb/comment/khcoex4/ (“Avoiding DeFi magic is the best way to mitigate getting rekt.” — simonmales) | 2026-11-18 | Y |
| Q-S05 | “hodl to the moon!” (sarcasm) | Mocking bait before rug | https://www.reddit.com/r/ethereum/comments/193uunb/ethereum_scam_checker_tool_is_this_a_red_flag/ | 2026-11-18 | Y (as enemy language) |

### 1.4 Status & Identity Signals

| ID | Quote / signal | What status they seek / fear losing | URL | Scraped (ISO) |
|---|---|---|---|---|
| Q-ST01 | Wedding fund wiped → “wedding we’ve been planning might have to be canceled” | Adult competence / provider identity · fear of looking reckless to partner | https://www.reddit.com/r/CryptoCurrency/comments/1vg48ll/i_got_hacked_for_10700_usdc_of_my_wedding_savings/ | 2026-11-18 |
| Q-ST02 | “I'm new to analyzing with these tools” | Want to feel like a careful researcher, not a degen bagholder | https://www.reddit.com/r/ethereum/comments/193uunb/ethereum_scam_checker_tool_is_this_a_red_flag/ | 2026-11-18 |
| Q-ST03 | “Don't ape into something because it claims to be audited by Certik” | Status = discerning skeptic who sees through marketing badges | https://www.reddit.com/r/CryptoCurrency/comments/s25ft2/lets_discuss_audits_a_certik_audit_is_worthless/ | 2026-11-18 |
| Q-ST04 | Humor coping: “does anybody know what car I can buy within the price of $28000?” | Peer group dark humor after someone else’s drain | https://www.reddit.com/r/solana/comments/1gsqyrp/drained_28000_worth_of_sol/ (Medical_Dig2332) | 2026-11-18 |

### 1.5 Hidden Fears (rarely said directly — inferred then verified)

| ID | Surface complaint | Hidden fear hypothesis | Evidence quote + URL | Confidence (H/M/L) |
|---|---|---|---|---|
| F-01 | “Is this a red flag?” / “Is this terrible?” | Fear of looking stupid *and* of missing a real danger — paralysis from unreadable scores | Q-P05 · https://www.reddit.com/r/ethereum/comments/193uunb/ | H |
| F-02 | “Certik audit” as trust signal | Fear that “official” security theater still leaves them rekt — badge ≠ safety | Q-P07 · https://www.reddit.com/r/CryptoCurrency/comments/s25ft2/ | H |
| F-03 | Blame on seed / “you did something wrong” | Fear that community will shame them instead of explaining the exploit path | Q-P12 · https://www.reddit.com/r/solana/comments/1iorwhh/ | M |
| F-04 | Approvals invisible in hardware wallet | Fear that self-custody is a trap — permissions they can’t see can still empty them | Q-P04 · https://www.reddit.com/r/defi/comments/1hc3ivu/ | H |
| F-05 | Scam checkers may themselves be scams | Fear of connecting wallet to “safety” tools that are honeypots | Q-P06 · https://www.reddit.com/r/ethereum/comments/193uunb/ | H |

---

## 2. Schwartz Five Levels of Awareness

Estimates labeled **estimate** from Round 1 Reddit + competitor landscape (not a survey).

| Level | Definition (operational) | Where audience sits (% est.) | Message angle | Proof they need | Channel | Hook IDs from §1 |
|---|---|---|---|---|---|---|
| 1. Unaware | Thinks “I just won’t click shady links” = enough | ~15% est. | Drains happen via approvals, poisoned tokens, and one seed paste — not only “obvious phishing” | Case stories with tx hashes · approval explainers | Reddit/X short video · Telegram | Q-P03, Q-P12, Q-P08 |
| 2. Problem-aware | Knows rugs/drainers exist; no reliable ritual before interact | ~35% est. **PRIMARY LAUNCH** | “Before you approve or swap — paste address, get plain-English risk” | Side-by-side: honeypot/owner mint/LP unlock in words not JSON | Landing · Twitter/X · Discord bots | Q-P01, Q-P02, Q-P04, Q-S01 |
| 3. Solution-aware | Uses GoPlus / De.Fi / TokenSniffer / Honeypot.is but confused by flags | ~30% est. | “Same checks + a brief that tells you what to do next (don’t sign / revoke / size down)” | Explainability vs raw score · false-positive honesty | SEO “alternative to De.Fi Scanner” · comparison pages | Q-P05, Q-P06, Q-D03 |
| 4. Product-aware | Heard of Aegis / tried demo; hesitates | ~15% est. | Show verifiable on-chain flags + AI brief; no wallet connect required for scan | Live demo · transparency of data sources · rate-limit clarity | Product UI · email nurture | Q-D01, Q-D05, F-05 |
| 5. Most aware | Ready to pay for history/API/alerts | ~5% est. | Offer math: free scan vs Pro history/watchlists/API | Pricing + risk reversal + SLA | Pricing page · outbound to wallets/DEX UIs | Q-D06 (vendor proof pattern) |

**Primary launch level (decision):** **Level 2 → 3 bridge** (problem-aware degens drowning in red flags).  
**Why:** Highest density of pain quotes is “I got drained / I don’t understand the report,” not “compare enterprise AML.” Badge skepticism (Level 3 CertiK distrust) is secondary hook for comparison creative.

---

## 3. Cialdini Influence Levers (mapped to evidence)

| Lever | How it will be used in this venture | Evidence from §1 | Risk if overused | Owner bot for execution |
|---|---|---|---|---|
| Reciprocity | Free paste-scan + plain-English brief with no wallet connect | F-05 (fear of connecting to “safety” sites); De.Fi guest mode pattern | Free forever kills WTP | `@brand-copy-director` |
| Commitment/Consistency | “Scan before every approve” checklist; limited-approval default education | Q-D05, Q-P04 | Nagging hygiene lectures → churn | `@product-ux-architect` |
| Social Proof | Volume of scans / drains caught — only with transparent methodology | Q-D06 (Phantom/Blowfish stats — **do not copy unverified**) | Fake “millions protected” = death (badge skepticism Q-P07) | `@brand-copy-director` |
| Authority | Cite on-chain facts + named check categories; optional third-party sources | Q-P07 (anti-authority against paid audit theater) | Renting CertiK-style badge language | `@brand-copy-director` |
| Liking | Peer degen voice: drained / rekt / don’t ape — not enterprise AML tone | Q-S01–Q-S04 | Trying too hard → cringe | `@brand-copy-director` |
| Scarcity | **Defer** for core scans; optional for alert seats / API rate | Not evidenced for retail scanners | Fake urgency around rugs = scam-adjacent | **not evidenced → do not use yet** |
| Unity | “For people who got burned once and refuse to be the next wedding-fund post” | Q-ST01, Q-P01 | Trauma porn exploitation | `@brand-copy-director` |

---

## 4. Competitor Tear-Down

All five competitors filled. Pricing/promises from live product pages 2026-11-18. Weaknesses from Reddit + industry analyses (URLs required).

| Competitor | URL | Price positioning | Primary promise | Strengths | Weaknesses (from real reviews / user talk) | Review / evidence URLs | Moat threat (H/M/L) |
|---|---|---|---|---|---|---|---|
| GoPlus Security | https://gopluslabs.io/ · **API suite pricing:** https://gopluslabs.io/en/security-api · **Token Security product page:** https://gopluslabs.io/en/token-security-api | **Do not conflate surfaces.** (A) `security-api` scrape 2026-11-18: Free 150K CU/mo → Test $199 → Beginner $399 → Growth $799 → Pro $1,899 → Ultra $3,499 → Enterprise custom. (B) `token-security-api` scrape 2026-11-18: Free 100 Call Credits/Minute · Pro = customized credits (**no public $** on that page). | “Most widely used user security service” — token/NFT/approval/malicious address/dApp/tx sim APIs | Scale + DEX/wallet integrations; free developer entry; broad API surface | Rule-based / “obvious” patterns; sophisticated tokens can look CLEAN while still draining; competitors claim ~40 checks vs deeper code analysis | Product: https://gopluslabs.io/en/security-api · Token page: https://gopluslabs.io/en/token-security-api · Critique study: https://chainaware.ai/blog/token-audit-10000-coingecko-results/ (“GoPlus returns CLEAN… investor loses capital”; “GoPlus-equivalent analysis leaves substantial risk categories”) | H |
| De.Fi Scanner | https://de.fi/scanner | Free consumer scanner; guest = “basic version”; login for full features; API sales-led | “Free smart contract audit” · Safety & AI scores · honeypot + governance report · PDF | Multi-chain EVM + Solana; DeFi Score; REKT + Audit DBs; Shield revoke | New users cannot interpret red flags (“is this terrible?”); literacy gap; guest-mode feature gating | Product: https://de.fi/scanner · User confusion: https://www.reddit.com/r/ethereum/comments/193uunb/ethereum_scam_checker_tool_is_this_a_red_flag/ · Tool distrust: same thread moo9001 | H |
| Blowfish | https://blowfish.xyz/ (**TLS broken 2026-11-18**) · https://phantom.com/learn/blog/phantom-acquires-blowfish · https://www.fluidrwa.com/blog/blockaid-vs-blowfish-vs-hypernative-web3-security · https://www.alchemy.com/dapps/blowfish | Public retail $ **UNVERIFIED**; enterprise quote-based (FluidRWA FAQ); Alchemy lists as wallet security dapp; **standalone service sunset after Phantom acquisition** | Pre-sign simulation + warnings so wallets stop fraud before signature | Best-in-class wallet UX control point; Phantom distribution; 2.8M scams prevented claim (vendor) | Not a paste-token auditor for degens; not protocol monitoring; homepage scrape failed (SSL); now captive to Phantom — OEM lane not consumer SaaS | Phantom: https://phantom.com/learn/blog/phantom-acquires-blowfish · FluidRWA: https://www.fluidrwa.com/blog/blockaid-vs-blowfish-vs-hypernative-web3-security · X: https://x.com/blowfishxyz | M (OEM) / L (direct retail) |
| Arkham Intelligence | https://www.arkhamintelligence.com/ → https://arkm.com/ | Free explorer/tags/visualizer; Enterprise **$1,500 USD/month** after 14-day trial (card on file) | “Premier on-chain analytics” — entity intel, tracer, risk scoring, cases, alerts | Massive entity graph; LE/compliance brand; traders love intel | Wrong JTBD for retail token scan before ape; expensive; not honeypot/approval explain; privacy/de-anon optics scare some retail | Pricing FAQ on https://arkm.com/ (scraped 2026-11-18) · Product suite same URL | L (adjacent category) |
| CertiK (Skynet / score) | https://www.certik.com/products/skynet → https://skynet.certik.com/ · https://www.certik.com/ | Skynet free/public scores + leaderboards on product pages (scrape 2026-11-18). Manual audit list pricing on CertiK homepage: **UNVERIFIED — REQUIRES HUMAN** (no $ band cited without live rate card URL). | Due diligence trust layer — security scores, audits, monitoring, social insights | Brand recognition; project leaderboards; “Team Verified” theater | Community: “Certik audit is worthless” / audited projects still rug; retail over-reads letter grades as safety | Reddit: https://www.reddit.com/r/CryptoCurrency/comments/s25ft2/lets_discuss_audits_a_certik_audit_is_worthless/ · Skynet: https://skynet.certik.com/ · Check-count critique: https://chainaware.ai/blog/token-audit-10000-coingecko-results/ (“CertiK Skynet’s free Token Scan runs 19”) · Homepage: https://www.certik.com/ | H (brand) / M (product fit) |

### Positioning white space

| Gap nobody owns well | Evidence | Our candidate claim | Risk |
|---|---|---|---|
| Paste address → **verifiable on-chain flags + plain-English next action** without wallet connect | Q-P05/P06 literacy gap · Q-P04 approval blindness · GoPlus JSON/API-first · Arkham $1500 enterprise · Blowfish wallet-OEM · CertiK badge skepticism | “Scan before you sign — flags you can check + a brief you can understand” | Free scanners compress WTP; must productize history, watchlists, tx-sim narrative, API |
| Honesty about false positives / “CLEAN ≠ safe” | ChainAware CLEAN-but-draining claim · Q-P06 | Confidence + uncertainty disclosure on every report | Sounds weak vs competitors’ green checks — actually trust moat |
| No-connect first aid after scare | F-05 · revoke delight Q-D01/D04 | “Scan without connecting; revoke guidance without pasting seed” | Must never ask for seed; copy must scream this |

---

## 5. Buyer Psychology Summary (for Copy & Ads)

| Element | Content (must cite quote IDs) |
|---|---|
| Enemy (τι μισούν) | Opaque “security” theater: letter-grade audits and red-flag dumps that still leave you drained (Q-P05, Q-P06, Q-P07) · Invisible infinite approvals (Q-P04) · Wallet drainers + rugs that hit in minutes (Q-P01, Q-P02, Q-S02) |
| Desired identity after purchase | The careful degen who scans first, never apes a CertiK badge, never pastes a seed, and can explain *why* they skipped a token (Q-ST02, Q-ST03, Q-D03) |
| Mechanism (πώς δουλεύει η λύση σε απλά λόγια) | Paste token/contract/wallet → multi-chain risk checks → show the raw flags you can verify → AI brief: “what this means + what to do (don’t sign / revoke / size down)” — no seed, no connect required for scan |
| Objections top 5 | 1. “Scanners can’t tell scam vs legit” (Q-P06) 2. “I’ll get a false positive and miss the trade” (Q-P05) 3. “Is this tool itself a drain site?” (F-05) 4. “GoPlus/De.Fi already free” (price) 5. “Audited = safe enough” (Q-P07 rebuttal) |
| Words to USE (from slang bank) | drained · rug / rug pull · approve / revoke · seed phrase (as warning: never share) · honeypot · red flag · don’t ape · rekt · before you sign · plain English · no wallet connect |
| Words to BAN (AI-slop + niche clichés) | ανακαλύψτε · κορυφαία λύση · ξεκλειδώστε · επαναστατικό · seamless · game-changer · cutting-edge · next-gen · leverage (verb) · empower · holistic · trustless utopia · “military-grade” · “100% safe” · “CertiK-secured” as proof · “AI-powered” without showing flags · moon / 100x (as promise) |

---

## 6. Research Run Log

| Run ID | Ημ/νία | Queries / URLs crawled | Firecrawl tool + ID | Quotes added | Notes |
|---|---|---|---|---|---|
| R-001 | 2026-11-18 | `site:reddit.com rug pull wallet drained approval…` | `firecrawl_search` id `01a1eed2-b3c7-70ee-9a4d-7dd9826cef2f` | source list | Found drain threads |
| R-002 | 2026-11-18 | `site:reddit.com token approval revoke… GoPlus CertiK Blowfish de.fi` | `firecrawl_search` id `01a1eed2-b3bd-70fb-a0f3-1fb4fc9630ea` | source list | Approvals + de.fi thread |
| R-003 | 2026-11-18 | Competitor names + review/worth it | `firecrawl_search` id `01a1eed2-b6d9-7249-abdd-7afb4856cf36` | — | ChainAware / Hodleh comps |
| R-004 | 2026-11-18 | wallet drainer / false positive / honeypot | `firecrawl_search` id `01a1eed2-bcbf-763c-9ebf-60de20b85ca2` | — | Industry articles |
| R-005 | 2026-11-18 | https://gopluslabs.io/ | `firecrawl_scrape` scrapeId `01a1eed3-0c55-711e-aad1-db397f485af9` | — | Competitor promise |
| R-006 | 2026-11-18 | https://de.fi/scanner | `firecrawl_scrape` scrapeId `01a1eed3-0e9c-739e-a7f2-536c377651ee` | — | Free scanner FAQ |
| R-007 | 2026-11-18 | https://www.certik.com/products/skynet | `firecrawl_scrape` scrapeId `01a1eed4-2ddf-73a7-9ef9-fab0fb60e7da` | — | Skynet scores UI |
| R-008 | 2026-11-18 | Reddit drain + wedding threads | `alexandria_library_read` scrapecreators `reddit/post-comments` · scrape_id `01a1eed6…` / file `21bc9578…` | Q-P01–P03, Q-P11, Q-ST01, Q-S01 | Direct reddit.com scrape unsupported |
| R-009 | 2026-11-18 | Approvals + de.fi red-flag threads | `alexandria_library_read` · requestId `df5fbd44-a365-4fcf-b3d0-e965857db26e` | Q-P04–P06, Q-P10, Q-D01, Q-S02, Q-S04–S05 | |
| R-010 | 2026-11-18 | CertiK worthless + drained SOL forensics | `alexandria_library_read` · requestId `e20f4fa8-0090-4957-944c-90e3a3aee1bd` | Q-P07–P09, Q-P12, Q-S03, Q-ST03 | |
| R-011 | 2026-11-18 | Delight: revoke / simulation comments | `alexandria_library_read` · file `33706995…` | Q-D02–D05 | Comment search noisy; kept on-theme only |
| R-012 | 2026-11-18 | Blowfish / Arkham / GoPlus pricing search | `firecrawl_search` id `01a1eed8-1403-709b-8e70-87f13e626574` | — | Phantom acquisition found |
| R-013 | 2026-11-18 | https://phantom.com/learn/blog/phantom-acquires-blowfish · FluidRWA comparison · ChainAware 10k study | `firecrawl_scrape` ids `01a1eed8-492c…`, `01a1eed8-4b34…`, file `4184d74c…` | Q-D06 + §4 weaknesses | blowfish.xyz TLS fail logged |
| R-014 | 2026-11-18 | https://www.arkhamintelligence.com/ · https://gopluslabs.io/en/security-api | `firecrawl_scrape` ids `01a1eed8-7d3c-711f-bcab-556f1a022e8f`, `01a1eed8-8274-7388-a196-3c1b53ab61b3` | — | Arkham $1500/mo · GoPlus tier table |

**UNVERIFIED / failed:** Direct scrape `reddit.com` (platform block) · `https://blowfish.xyz/` SSL severely broken — do not invent homepage copy.

---

## 7. Handoff Checklist → `@brand-copy-director`

| Check | Status |
|---|---|
| ≥10 verbatim quotes with URLs | **PASS** (12 pain + 6 desire/delight-adjacent) |
| Schwartz levels filled with hooks | **PASS** · Primary = Level 2→3 |
| ≥3 competitor rows with review evidence | **PASS** (5/5 rows + evidence URLs) |
| Words to USE / BAN lists non-empty | **PASS** |
| Cialdini all levers addressed | **PASS** (Scarcity deferred) |
| Ledger §1 mission updated | **PASS** (M-002 / RT-001 remediations) |
| Red Team authenticity review | **RT-002 PASS** — permalinks + GoPlus dual-surface + CertiK UNVERIFIED verified |

**Document status:** ROUND 1 **ACCEPTED** (RT-002 PASS) — Round 2 planning may consume voice bank.

```
RELAY → @brand-copy-director
Voice Bank ready: YES (RT-002 PASS)
Primary Schwartz level: 2 (bridge to 3)
Top 5 quote IDs for hooks: Q-P01, Q-P05, Q-P07, Q-P04, Q-S01
Enemy one-liner: Opaque security theater that still lets drainers empty you in minutes.
Ban-list path: COMPANY_OS/01 §5
```

---

## 8. 10/10 Actionable Upgrade Roadmap for Round 2

Exact product / UX / scoring / trust moves to beat GoPlus · De.Fi · Blowfish · Arkham · CertiK Skynet for the retail+degen ICP.

| # | Upgrade | Exact build (acceptance bar) | Beats whom | Maps to voice | Priority |
|---|---|---|---|---|---|
| 1 | **Plain-English verdict strip** | Top of report: `DON'T SIGN` / `REVOKE FIRST` / `PROCEED WITH SIZE CAP` + 1 sentence why — before any score chart | De.Fi red-flag dump (Q-P05) | Q-P05, Q-P06 | P0 |
| 2 | **No-wallet-connect scan** | Contract/token/wallet paste works without connect; banner: “We never ask for your seed” | Fear of fake scanners (F-05) | F-05, Q-P06 | P0 |
| 3 | **Approval risk translator** | For each approval: spender · allowance (∞ vs exact) · last used · one-click deep-link to revoke.cash / Rabby instructions | Invisible approvals (Q-P04) | Q-P04, Q-D01, Q-D05 | P0 |
| 4 | **“How you get drained” forensic mode** | Wallet scan shows likely drain path: shady approve · setApprovalForAll · known drainer interact · poisoned token receive | “How did this happen?” (Q-P11, Q-P12) | Q-P03, Q-P11, Q-P12 | P0 |
| 5 | **CLEAN ≠ SAFE honesty layer** | If only surface honeypot checks pass: show `Passed basic sell-sim — still check owner mint / LP / tax / proxy` | GoPlus “CLEAN” blind spots | ChainAware evidence §4 | P0 |
| 6 | **False-positive meter** | Each High finding: confidence H/M/L + “common on legit tokens?” toggle examples | “Is this terrible?” paralysis | Q-P05 | P1 |
| 7 | **Multi-source score fusion** | Show Aegis score + optional GoPlus/De.Fi-comparable flags side-by-side with disagreements highlighted | Solution-aware switchers | Schwartz L3 | P1 |
| 8 | **Pre-sign simulation narrative** (EVM first) | Decode: assets out · approvals granted · ETH/gas · “looks like” label; never claim guarantee | Blowfish OEM gap for paste users | Q-D02, Q-D03 | P1 |
| 9 | **Anti-badge education module** | UI callout: “Audit badge ≠ unrugable” with link to methodology; never sell “CertiK-level” language | CertiK badge theater | Q-P07, Q-S03 | P1 |
| 10 | **Trust signals pack** | Public methodology page · sample reports · rate limits · open flag definitions · optional “verify on explorer” deep links for every flag · SOC-ish posture without fake certs | Social proof without lying | Q-P06, F-05 | P1 |
| 11 | **Burner / hot-cold workflow tips** | Post-scan checklist: burner for ape · cold for stack · never seed in Keep | Self-blame drains | Q-P08, Q-P09 | P2 |
| 12 | **Watchlist + drain alerts** | Watch token owner/LP/tax changes; alert via email/Telegram | Arkham alerts at retail price | Arkham $1500 gap | P2 |
| 13 | **Round 2 research** | Scrape X/TikTok drain talk · G2/Trustpilot if any · Blowfish docs.blowfish.xyz · De.Fi Canny · Greek CryptoTalk forums · ≥5 more delight quotes | Expand delight bank beyond Reddit | §6 | P1 research |

**Round 2 research bar:** add ≥3 X/Tweet verbatim dumps; price-check De.Fi API; map Aegis current `/api` flags vs GoPlus item list; Red Team PASS on §1 before ads.

---

*End of Round 1 — `@human-psychologist` · 2026-11-18*
