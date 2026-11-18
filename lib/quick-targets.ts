import type { QuickTarget } from "./types";

/** Curated demo targets for recruiter / portfolio one-click audits. */
export const QUICK_TEST_TARGETS: QuickTarget[] = [
  {
    id: "usdc",
    label: "Safe Token — USDC",
    description: "Ethereum USDC (Circle)",
    // Official Circle USDC on Ethereum
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    chain: "ethereum",
    tone: "safe",
  },
  {
    id: "high-risk",
    label: "High-Risk Contract",
    description: "Suspicious unverified proxy pattern",
    // Public demo address often used in honeypot / unverified bytecode walkthroughs
    address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    chain: "ethereum",
    tone: "risk",
  },
  {
    id: "sol-pool",
    label: "Live Solana Pool",
    description: "Raydium SOL–USDC AMM pool",
    address: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
    chain: "solana",
    tone: "live",
  },
];
