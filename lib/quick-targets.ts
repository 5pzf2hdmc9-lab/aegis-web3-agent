import type { QuickTarget } from "./types";

/** Curated demo targets — labels must be factually honest (no fake “High-Risk”). */
export const QUICK_TEST_TARGETS: QuickTarget[] = [
  {
    id: "usdc",
    label: "Safe Token — USDC",
    description: "Ethereum USDC (Circle) — known blue-chip ERC-20",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    chain: "ethereum",
    tone: "safe",
  },
  {
    id: "eip55-demo",
    label: "EIP-55 Checksum Demo",
    description:
      "Canonical EIP-55 example address from the checksum spec — not a known honeypot. Use to verify EOA vs contract detection.",
    // EIP-55 mixed-case checksum example (Ethereum Yellow Paper / EIP-55 docs)
    address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    chain: "ethereum",
    tone: "demo",
  },
  {
    id: "sol-pool",
    label: "Live Solana Pool",
    description: "Raydium SOL–USDC AMM pool (live account data)",
    address: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
    chain: "solana",
    tone: "live",
  },
];
