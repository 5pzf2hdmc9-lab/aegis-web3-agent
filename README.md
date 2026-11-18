# AegisWeb3 — Autonomous Multi-Chain Risk Agent

AegisWeb3 is a recruiter-ready Web3 security dashboard that turns a contract or wallet address into a structured AI risk audit in seconds. It combines live multi-chain RPC context with Gemini AI to surface honeypot signals, rug-pull vectors, and authority exposure across Solana, Ethereum, Base, and BNB.

**Live demo:** [web3-risk-agent.vercel.app](https://web3-risk-agent.vercel.app/)

Architected & built by **Chris Traios**.

## Features

- **Autonomous AI audits** — Gemini AI reports with risk score, threat flags, and operational guidance
- **Multi-chain RPC context** — Solana `getAccountInfo` + EVM `eth_getCode` before synthesis
- **Quick Test Targets** — one-click Safe USDC, High-Risk contract, and Live Solana pool demos
- **Recent Audits Feed** — session-live feed of completed scans (replaces static charts)
- **Hardened API** — IP rate limiting (10/min), Zod + regex validation, prompt-injection scrubbing
- **Secret-safe architecture** — Gemini / Alchemy keys stay server-side only

## Tech stack

| Layer | Stack |
| --- | --- |
| App | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| AI | Google Gemini AI (`@google/genai`) |
| Data | Alchemy / JSON-RPC (Solana, Ethereum, Base, BNB) |
| Validation | Zod |

## Project structure

```
app/
  page.tsx                 # Dashboard orchestrator
  api/rag/route.ts         # Hardened audit API
components/                # UI modules (< 250 lines each)
lib/                       # validation, rate-limit, prompt-guard, helpers
services/                  # blockchain RPC, Gemini, audit orchestration
docs/PROJECT_MEMORY.md     # Living architecture + change log
```

## Getting started

```bash
npm install
cp .env.example .env.local
# fill GEMINI_API_KEY + RPC URLs (server-only)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required environment variables

See `.env.example`. Never expose these via `NEXT_PUBLIC_*`.

## API

`POST /api/rag`

```json
{ "query": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "chain": "ethereum" }
```

Responses: `200 { answer }`, `400` validation, `429` rate limit, `500` internal.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Security notes

- Rate limit: **10 requests / minute / IP**
- Address formats validated per chain (Solana base58 / EVM `0x` + 40 hex)
- User input is sanitized before prompt assembly
- Agent workflow rules live in `.cursorrules` and `docs/PROJECT_MEMORY.md`
