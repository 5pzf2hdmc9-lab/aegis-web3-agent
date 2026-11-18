import type { ThreatLevel } from "./types";

export function extractRiskScore(analysis: string): number {
  const match = analysis.match(/risk\s*score[^0-9]{0,20}(\d{1,3})/i)
    || analysis.match(/\b(\d{1,3})\s*\/\s*100\b/);
  if (!match) return 72;
  const n = Number(match[1]);
  if (Number.isNaN(n)) return 72;
  return Math.min(100, Math.max(0, n));
}

export function threatFromScore(score: number): ThreatLevel {
  if (score >= 80) return "Critical / High Risk";
  if (score >= 60) return "High Risk";
  if (score >= 35) return "Moderate Risk";
  return "Low Risk";
}

export function defaultFlags(score: number): string[] {
  if (score >= 70) {
    return [
      "Unverified Bytecode / Proxy Pattern",
      "High Velocity Outflows detected",
      "Suspicious Mint/Freeze Authority Exposure",
    ];
  }
  if (score >= 40) {
    return [
      "Limited audit trail",
      "Ownership concentration review advised",
      "Monitor liquidity depth",
    ];
  }
  return [
    "Standard verified contract profile",
    "No critical mint/freeze anomalies flagged",
    "Routine monitoring recommended",
  ];
}

export function formatClock(date = new Date()): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
}
