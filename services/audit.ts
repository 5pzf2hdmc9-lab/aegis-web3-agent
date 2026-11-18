import type { ChainId } from "@/lib/validation";
import { fetchOnChainContext } from "@/services/blockchain";
import { generateAuditReport } from "@/services/gemini";

export async function runAutonomousAudit(
  target: string,
  chain: ChainId
): Promise<{ answer: string }> {
  const blockchainContext = await fetchOnChainContext(target, chain);
  const answer = await generateAuditReport({
    target,
    chain,
    blockchainContext,
  });
  return { answer };
}
