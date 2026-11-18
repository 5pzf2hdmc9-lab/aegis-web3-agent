import type { ChainId } from "./validation";

export type ThreatLevel = "Low Risk" | "Moderate Risk" | "High Risk" | "Critical / High Risk";

export type AuditFeedItem = {
  id: string;
  address: string;
  chain: ChainId;
  riskScore: number;
  threatLevel: ThreatLevel;
  timestamp: string;
};

export type ScanResult = {
  address: string;
  chain: string;
  status: string;
  threatLevel: ThreatLevel;
  riskScore: number;
  aiAnalysis: string;
  flags: string[];
};

export type QuickTarget = {
  id: string;
  label: string;
  description: string;
  address: string;
  chain: ChainId;
  tone: "safe" | "risk" | "live";
};
