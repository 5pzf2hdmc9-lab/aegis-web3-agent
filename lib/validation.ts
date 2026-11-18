import { z } from "zod";

export const SUPPORTED_CHAINS = ["solana", "ethereum", "base", "bnb"] as const;
export type ChainId = (typeof SUPPORTED_CHAINS)[number];

const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export const auditRequestSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Target address is required.")
    .max(128, "Target address is too long."),
  chain: z.enum(SUPPORTED_CHAINS).default("solana"),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;

export function isAddressValidForChain(address: string, chain: ChainId): boolean {
  if (chain === "solana") return SOLANA_ADDRESS_RE.test(address);
  return EVM_ADDRESS_RE.test(address);
}

export function validateAuditPayload(body: unknown): {
  ok: true;
  data: AuditRequest;
} | {
  ok: false;
  error: string;
} {
  const parsed = auditRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request payload.";
    return { ok: false, error: message };
  }

  const { query, chain } = parsed.data;
  if (!isAddressValidForChain(query, chain)) {
    return {
      ok: false,
      error:
        chain === "solana"
          ? "Invalid Solana address. Expected base58 (32–44 chars)."
          : "Invalid EVM address. Expected 0x followed by 40 hex characters.",
    };
  }

  return { ok: true, data: { query, chain } };
}
