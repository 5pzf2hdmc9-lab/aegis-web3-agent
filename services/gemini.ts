import { GoogleGenAI } from "@google/genai";
import { buildAuditPrompt } from "@/lib/prompt-guard";
import type { RiskFlag, VerdictKind } from "@/lib/types";
import { checkAndConsumeGeminiQuota } from "@/lib/spend-cap";

const GEMINI_TIMEOUT_MS = 25_000;

export type AiAuditPayload = {
  plainEnglishSummary: string;
  suggestedVerdict: VerdictKind | null;
  nextAction: string | null;
  additionalFlags: RiskFlag[];
  uncertaintyNote: string | null;
  unavailable: boolean;
  reason?: string;
};

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return new GoogleGenAI({ apiKey });
}

function parseJsonLoose(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1].trim() : trimmed;
  return JSON.parse(raw);
}

function mapFlags(raw: unknown): RiskFlag[] {
  if (!Array.isArray(raw)) return [];
  const out: RiskFlag[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const severity = o.severity;
    const confidence = o.confidence;
    if (
      typeof o.id !== "string" ||
      typeof o.title !== "string" ||
      typeof o.evidence !== "string" ||
      !["info", "low", "moderate", "high", "critical"].includes(String(severity)) ||
      !["H", "M", "L"].includes(String(confidence))
    ) {
      continue;
    }
    out.push({
      id: o.id.slice(0, 64),
      title: o.title.slice(0, 160),
      severity: severity as RiskFlag["severity"],
      confidence: confidence as RiskFlag["confidence"],
      evidence: o.evidence.slice(0, 500),
      source: "ai:interpretive",
    });
  }
  return out.slice(0, 8);
}

export async function generateStructuredAudit(params: {
  target: string;
  chain: string;
  blockchainContext: string;
  deterministicFlags: RiskFlag[];
}): Promise<AiAuditPayload> {
  const quota = await checkAndConsumeGeminiQuota();
  if (!quota.ok) {
    return {
      plainEnglishSummary: "",
      suggestedVerdict: null,
      nextAction: null,
      additionalFlags: [],
      uncertaintyNote: quota.error,
      unavailable: true,
      reason: quota.error,
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    return {
      plainEnglishSummary: "",
      suggestedVerdict: null,
      nextAction: null,
      additionalFlags: [],
      uncertaintyNote: "GEMINI_API_KEY missing — AI layer skipped.",
      unavailable: true,
      reason: "GEMINI_API_KEY missing",
    };
  }

  const ai = getClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const prompt = buildAuditPrompt({
    ...params,
    deterministicFlagsJson: JSON.stringify(params.deterministicFlags),
  });

  try {
    const response = await Promise.race([
      ai.models.generateContent({ model, contents: prompt }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini timeout")), GEMINI_TIMEOUT_MS)
      ),
    ]);

    const text = response.text || "";
    if (!text) {
      return {
        plainEnglishSummary: "",
        suggestedVerdict: null,
        nextAction: null,
        additionalFlags: [],
        uncertaintyNote: "Empty model response",
        unavailable: true,
        reason: "Empty model response",
      };
    }

    const parsed = parseJsonLoose(text) as Record<string, unknown>;
    const verdicts = new Set([
      "SAFE_TO_PROCEED_WITH_SIZE_CAP",
      "CAUTION_REVOKE_FIRST",
      "DO_NOT_SIGN",
    ]);
    const sv = String(parsed.suggestedVerdict ?? "");
    return {
      plainEnglishSummary: String(parsed.plainEnglishSummary ?? "").slice(0, 800),
      suggestedVerdict: verdicts.has(sv) ? (sv as VerdictKind) : null,
      nextAction: parsed.nextAction ? String(parsed.nextAction).slice(0, 400) : null,
      additionalFlags: mapFlags(parsed.additionalFlags),
      uncertaintyNote: parsed.uncertaintyNote
        ? String(parsed.uncertaintyNote).slice(0, 400)
        : null,
      unavailable: false,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gemini failure";
    return {
      plainEnglishSummary: "",
      suggestedVerdict: null,
      nextAction: null,
      additionalFlags: [],
      uncertaintyNote: msg,
      unavailable: true,
      reason: msg,
    };
  }
}
