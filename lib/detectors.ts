import type { OnChainSnapshot, RiskFlag } from "./types";
import type { ChainId } from "./validation";

/** EIP-1967 implementation slot (hex, no 0x) — appears in many proxy bytecodes */
const EIP1967_SLOT =
  "360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

function hexBytecodeBytes(code: string): number {
  if (!code || code === "0x") return 0;
  const hex = code.startsWith("0x") ? code.slice(2) : code;
  return Math.floor(hex.length / 2);
}

export function runDeterministicDetectors(
  chain: ChainId,
  snap: OnChainSnapshot
): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const f = snap.facts;

  if (snap.completeness === "UNAVAILABLE") {
    flags.push({
      id: "rpc-unavailable",
      title: "On-chain RPC unavailable",
      severity: "high",
      confidence: "H",
      evidence: snap.summary,
      source: "rpc:status",
    });
    return flags;
  }

  flags.push({
    id: "no-wallet-connect",
    title: "View-only scan (we never ask to connect a wallet)",
    severity: "info",
    confidence: "H",
    evidence: "Paste-address mode only — no seed, no WalletConnect session.",
    source: "product:policy",
  });

  flags.push({
    id: "approvals-not-enumerated",
    title: "Token approvals not enumerated in paste mode",
    severity: "moderate",
    confidence: "H",
    evidence:
      "Unlimited approve / setApprovalForAll requires a wallet session or indexer. Use revoke.cash or Rabby after any past dApp use.",
    source: "limit:paste-mode",
    commonOnLegit: true,
  });

  if (chain === "solana") {
    if (f.accountExists === false) {
      flags.push({
        id: "sol-missing",
        title: "Solana account not found on-chain",
        severity: "moderate",
        confidence: "H",
        evidence: "getAccountInfo returned null value — address has no account data at this RPC.",
        source: "rpc:getAccountInfo",
      });
    } else if (f.accountExists === true) {
      flags.push({
        id: "sol-live",
        title: "Solana account present",
        severity: "info",
        confidence: "H",
        evidence: `Lamports=${f.lamports ?? "?"} Owner=${f.owner ?? "?"}`,
        source: "rpc:getAccountInfo",
      });
      if (f.mintAuthority === true || f.freezeAuthority === true) {
        flags.push({
          id: "sol-authority",
          title: "Mint or freeze authority still set",
          severity: "high",
          confidence: "M",
          evidence: `mintAuthority=${String(f.mintAuthority)} freezeAuthority=${String(f.freezeAuthority)}`,
          source: "rpc:getAccountInfo:jsonParsed",
          commonOnLegit: true,
        });
      }
    }
  } else {
    const bytes = typeof f.bytecodeBytes === "number" ? f.bytecodeBytes : 0;
    const isContract = f.isContract === true;
    if (isContract) {
      flags.push({
        id: "evm-contract",
        title: "EVM smart contract bytecode present",
        severity: "info",
        confidence: "H",
        evidence: `Bytecode size ${bytes} bytes (hex-decoded, not string length).`,
        source: "rpc:eth_getCode",
      });
      if (f.likelyProxy === true) {
        flags.push({
          id: "evm-proxy",
          title: "Likely proxy pattern (EIP-1967 slot / DELEGATECALL density)",
          severity: "moderate",
          confidence: "M",
          evidence: String(f.proxyEvidence ?? "proxy heuristic matched"),
          source: "rpc:eth_getCode:heuristic",
          commonOnLegit: true,
        });
      }
      if (bytes > 0 && bytes < 100) {
        flags.push({
          id: "evm-tiny",
          title: "Unusually small contract bytecode",
          severity: "moderate",
          confidence: "M",
          evidence: `${bytes} bytes — may be a minimal proxy or stub.`,
          source: "rpc:eth_getCode",
        });
      }
    } else if (f.isContract === false) {
      flags.push({
        id: "evm-eoa",
        title: "Externally owned account (no code)",
        severity: "info",
        confidence: "H",
        evidence: "eth_getCode returned empty — wallet address, not a deployed contract.",
        source: "rpc:eth_getCode",
      });
    }
  }

  flags.push({
    id: "clean-not-safe",
    title: "CLEAN ≠ SAFE",
    severity: "info",
    confidence: "H",
    evidence:
      "Surface RPC checks cannot prove honeypot-free trading, LP integrity, or social-engineering safety.",
    source: "product:honesty",
  });

  return flags;
}

export function detectEvmProxy(code: string): { likely: boolean; evidence: string } {
  const lower = code.toLowerCase();
  const hasSlot = lower.includes(EIP1967_SLOT);
  const delegatecalls = (lower.match(/f4/g) || []).length;
  if (hasSlot) return { likely: true, evidence: "EIP-1967 implementation slot bytes present in code" };
  if (delegatecalls >= 3) {
    return { likely: true, evidence: `DELEGATECALL opcode density≈${delegatecalls}` };
  }
  return { likely: false, evidence: "" };
}

export { hexBytecodeBytes };
