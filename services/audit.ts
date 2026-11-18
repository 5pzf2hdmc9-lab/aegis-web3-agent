import {
  scoreFromFlags,
  threatFromScore,
  verdictFromFlags,
} from "@/lib/audit-helpers";
import { runDeterministicDetectors } from "@/lib/detectors";
import type { AuditReport, RiskFlag, ScanCompleteness } from "@/lib/types";
import type { ChainId } from "@/lib/validation";
import { fetchOnChainSnapshot } from "@/services/blockchain";
import {
  generateStructuredAudit,
  type AiAuditPayload,
} from "@/services/gemini";

const CLEAN_NOTE =
  "CLEAN ≠ SAFE: Passed surface RPC checks do not prove honeypot-free trading, LP integrity, or social-engineering safety.";

const RPC_UNAVAILABLE_AI: AiAuditPayload = {
  plainEnglishSummary: "",
  suggestedVerdict: null,
  nextAction: null,
  additionalFlags: [],
  uncertaintyNote:
    "AI interpretive layer skipped — on-chain RPC unavailable; deterministic flags only.",
  unavailable: true,
  reason: "rpc-unavailable",
};

export async function runAutonomousAudit(
  target: string,
  chain: ChainId
): Promise<AuditReport> {
  const snap = await fetchOnChainSnapshot(target, chain);
  const deterministic = runDeterministicDetectors(chain, snap);

  // BUG-06: never invent an AI audit when RPC layer is UNAVAILABLE
  const ai: AiAuditPayload =
    snap.completeness === "UNAVAILABLE"
      ? RPC_UNAVAILABLE_AI
      : await generateStructuredAudit({
          target,
          chain,
          blockchainContext: `${snap.summary} | checked=${snap.checked.join(",")} | notChecked=${snap.notChecked.join(",")}`,
          deterministicFlags: deterministic,
        });

  // Merge: deterministic always kept; AI interpretive flags only if AI available
  const flags: RiskFlag[] = [...deterministic];
  if (!ai.unavailable) {
    for (const f of ai.additionalFlags) {
      if (!flags.some((x) => x.id === f.id)) flags.push(f);
    }
  }

  const riskScore = scoreFromFlags(flags.filter((f) => f.source.startsWith("rpc:")));
  const threatLevel = threatFromScore(riskScore);
  const localVerdict = verdictFromFlags(flags, riskScore);

  // Prefer stricter of AI vs deterministic when both present
  let verdict = localVerdict.verdict;
  let verdictReason = localVerdict.reason;
  let nextAction = localVerdict.nextAction;

  if (!ai.unavailable && ai.suggestedVerdict) {
    const rank = {
      SAFE_TO_PROCEED_WITH_SIZE_CAP: 0,
      CAUTION_REVOKE_FIRST: 1,
      DO_NOT_SIGN: 2,
    } as const;
    if (rank[ai.suggestedVerdict] > rank[verdict]) {
      verdict = ai.suggestedVerdict;
      if (ai.plainEnglishSummary) verdictReason = ai.plainEnglishSummary.slice(0, 280);
      if (ai.nextAction) nextAction = ai.nextAction;
    } else if (ai.nextAction && verdict === localVerdict.verdict) {
      nextAction = ai.nextAction;
    }
  }

  const completeness: ScanCompleteness =
    snap.completeness === "UNAVAILABLE"
      ? "UNAVAILABLE"
      : ai.unavailable
        ? "PARTIAL"
        : snap.completeness;

  const checked = [...snap.checked, "detectors:deterministic"];
  if (!ai.unavailable) checked.push("ai:interpretive-summary");
  const notChecked = [
    ...snap.notChecked,
    ...(ai.unavailable ? ["ai:gemini-summary"] : []),
  ];

  const aiSummary = ai.unavailable
    ? null
    : [ai.plainEnglishSummary, ai.uncertaintyNote].filter(Boolean).join("\n\n") || null;

  return {
    address: target,
    chain: chain.toUpperCase(),
    completeness,
    checked,
    notChecked,
    riskScore,
    threatLevel,
    verdict,
    verdictReason,
    nextAction,
    flags,
    aiSummary,
    cleanIsNotSafeNote: CLEAN_NOTE,
    methodologyPath: "/methodology",
  };
}
