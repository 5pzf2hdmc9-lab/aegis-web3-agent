import type {
  FlagSeverity,
  RiskFlag,
  ThreatLevel,
  VerdictKind,
} from "./types";

const SEVERITY_WEIGHT: Record<FlagSeverity, number> = {
  info: 2,
  low: 8,
  moderate: 16,
  high: 28,
  critical: 40,
};

/** Score only from evidence-backed flags. Returns null if no scorable evidence. */
export function scoreFromFlags(flags: RiskFlag[]): number | null {
  const scorable = flags.filter((f) => f.severity !== "info" || f.source.startsWith("rpc:"));
  if (flags.length === 0) return null;
  const hasRpc = flags.some((f) => f.source.startsWith("rpc:"));
  if (!hasRpc && scorable.every((f) => f.severity === "info")) return null;

  let score = flags.reduce((sum, f) => sum + SEVERITY_WEIGHT[f.severity], 0);
  score = Math.min(100, Math.max(0, score));
  return score;
}

export function threatFromScore(score: number | null): ThreatLevel {
  if (score === null) return "UNKNOWN";
  if (score >= 80) return "Critical / High Risk";
  if (score >= 60) return "High Risk";
  if (score >= 35) return "Moderate Risk";
  return "Low Risk";
}

export function verdictFromFlags(
  flags: RiskFlag[],
  score: number | null
): { verdict: VerdictKind; reason: string; nextAction: string } {
  const critical = flags.filter((f) => f.severity === "critical" || f.severity === "high");
  if (score === null) {
    return {
      verdict: "CAUTION_REVOKE_FIRST",
      reason: "Insufficient on-chain evidence for a scored verdict (RPC partial or unavailable).",
      nextAction:
        "Do not treat this as a clean bill of health. Retry when RPC is available, or verify on a block explorer before signing.",
    };
  }
  if (critical.length > 0) {
    return {
      verdict: "DO_NOT_SIGN",
      reason: critical.map((f) => f.title).slice(0, 2).join("; "),
      nextAction:
        "Do not approve or sign until you understand each high/critical flag. Prefer a burner wallet if you must interact.",
    };
  }
  if (score >= 35) {
    return {
      verdict: "CAUTION_REVOKE_FIRST",
      reason: "Moderate residual risk from deterministic checks.",
      nextAction:
        "Review flags, revoke unused approvals at revoke.cash, and size down any exposure.",
    };
  }
  return {
    verdict: "SAFE_TO_PROCEED_WITH_SIZE_CAP",
    reason: "No high/critical deterministic findings on checks that completed.",
    nextAction:
      "Passed checks ≠ unrugable. Keep size caps, never paste a seed, and re-scan after any new approval.",
  };
}

export function formatClock(date = new Date()): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
}
