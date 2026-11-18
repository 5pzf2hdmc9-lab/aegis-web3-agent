import type { ChainId } from "./validation";

export type ThreatLevel =
  | "Low Risk"
  | "Moderate Risk"
  | "High Risk"
  | "Critical / High Risk"
  | "UNKNOWN";

export type ScanCompleteness = "COMPLETE" | "PARTIAL" | "UNAVAILABLE";

export type FlagSeverity = "info" | "low" | "moderate" | "high" | "critical";

export type RiskFlag = {
  id: string;
  title: string;
  severity: FlagSeverity;
  confidence: "H" | "M" | "L";
  evidence: string;
  source: string;
  commonOnLegit?: boolean;
};

export type VerdictKind =
  | "SAFE_TO_PROCEED_WITH_SIZE_CAP"
  | "CAUTION_REVOKE_FIRST"
  | "DO_NOT_SIGN";

export type AuditReport = {
  address: string;
  chain: string;
  completeness: ScanCompleteness;
  checked: string[];
  notChecked: string[];
  riskScore: number | null;
  threatLevel: ThreatLevel;
  verdict: VerdictKind;
  verdictReason: string;
  nextAction: string;
  flags: RiskFlag[];
  aiSummary: string | null;
  cleanIsNotSafeNote: string;
  methodologyPath: string;
};

/** @deprecated Prefer AuditReport — kept for feed list rows */
export type AuditFeedItem = {
  id: string;
  address: string;
  chain: ChainId;
  riskScore: number | null;
  threatLevel: ThreatLevel;
  verdict: VerdictKind;
  timestamp: string;
};

export type QuickTarget = {
  id: string;
  label: string;
  description: string;
  address: string;
  chain: ChainId;
  tone: "safe" | "demo" | "live";
};

export type OnChainSnapshot = {
  completeness: ScanCompleteness;
  summary: string;
  checked: string[];
  notChecked: string[];
  facts: Record<string, string | number | boolean | null>;
};
