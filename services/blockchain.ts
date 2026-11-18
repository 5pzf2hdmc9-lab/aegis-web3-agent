import { detectEvmProxy, hexBytecodeBytes } from "@/lib/detectors";
import type { OnChainSnapshot } from "@/lib/types";
import type { ChainId } from "@/lib/validation";

const RPC_TIMEOUT_MS = 8_000;

const RPC_ENDPOINTS: Record<ChainId, string | undefined> = {
  solana: process.env.SOLANA_RPC_URL,
  ethereum: process.env.ETHEREUM_RPC_URL,
  base: process.env.BASE_RPC_URL,
  bnb: process.env.BNB_RPC_URL,
};

const NOT_CHECKED_BASE = [
  "token approvals / allowance enumeration",
  "honeypot sell simulation",
  "LP lock / ownership renounce",
  "social / website phishing",
  "historical drainer graph",
];

export async function fetchOnChainSnapshot(
  target: string,
  chain: ChainId
): Promise<OnChainSnapshot> {
  const rpcUrl = RPC_ENDPOINTS[chain];
  if (!rpcUrl) {
    return {
      completeness: "UNAVAILABLE",
      summary: `RPC not configured for ${chain.toUpperCase()}.`,
      checked: [],
      notChecked: [`${chain} JSON-RPC`, ...NOT_CHECKED_BASE],
      facts: {},
    };
  }

  try {
    if (chain === "solana") {
      return await fetchSolana(rpcUrl, target);
    }
    return await fetchEvm(rpcUrl, target, chain);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "RPC failure";
    return {
      completeness: "UNAVAILABLE",
      summary: `RPC error/timeout for ${chain.toUpperCase()}: ${msg}`,
      checked: [],
      notChecked: [`${chain} JSON-RPC`, ...NOT_CHECKED_BASE],
      facts: {},
    };
  }
}

async function rpcPost(rpcUrl: string, body: object): Promise<unknown> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchSolana(rpcUrl: string, target: string): Promise<OnChainSnapshot> {
  const data = (await rpcPost(rpcUrl, {
    jsonrpc: "2.0",
    id: 1,
    method: "getAccountInfo",
    params: [target, { encoding: "jsonParsed" }],
  })) as { result?: { value: null | SolAccount } };

  const value = data?.result?.value ?? null;
  const checked = ["rpc:getAccountInfo"];
  const notChecked = [...NOT_CHECKED_BASE];

  if (value === null) {
    return {
      completeness: "PARTIAL",
      summary: "Solana getAccountInfo returned null — account does not exist or has no data at this RPC.",
      checked,
      notChecked,
      facts: { accountExists: false, lamports: null, owner: null },
    };
  }

  const parsed = value.data?.parsed;
  const info = parsed?.info as Record<string, unknown> | undefined;
  const mintAuthority = authoritySet(info?.mintAuthority);
  const freezeAuthority = authoritySet(info?.freezeAuthority);

  return {
    completeness: "PARTIAL",
    summary: `Solana account live — Lamports=${value.lamports}, Owner=${value.owner}`,
    checked: [...checked, "rpc:account-presence", "rpc:mint-freeze-if-token"],
    notChecked,
    facts: {
      accountExists: true,
      lamports: value.lamports,
      owner: value.owner,
      mintAuthority,
      freezeAuthority,
    },
  };
}

type SolAccount = {
  lamports: number;
  owner: string;
  data?: { parsed?: { info?: Record<string, unknown>; type?: string } };
};

function authoritySet(v: unknown): boolean | null {
  if (v === undefined) return null;
  if (v === null) return false;
  return true;
}

async function fetchEvm(
  rpcUrl: string,
  target: string,
  chain: ChainId
): Promise<OnChainSnapshot> {
  const data = (await rpcPost(rpcUrl, {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_getCode",
    params: [target, "latest"],
  })) as { result?: string };

  const code = data?.result;
  if (typeof code !== "string") {
    return {
      completeness: "UNAVAILABLE",
      summary: `RPC responded without code data for ${chain.toUpperCase()}.`,
      checked: [],
      notChecked: [`eth_getCode`, ...NOT_CHECKED_BASE],
      facts: {},
    };
  }

  const bytes = hexBytecodeBytes(code);
  const isContract = bytes > 0;
  const proxy = isContract ? detectEvmProxy(code) : { likely: false, evidence: "" };
  const checked = ["rpc:eth_getCode", "rpc:bytecode-bytes", "rpc:proxy-heuristic"];

  return {
    completeness: "PARTIAL",
    summary: isContract
      ? `EVM contract on ${chain.toUpperCase()} — bytecode ${bytes} bytes` +
        (proxy.likely ? `; proxy heuristic: ${proxy.evidence}` : "")
      : `EVM EOA on ${chain.toUpperCase()} — no bytecode`,
    checked,
    notChecked: NOT_CHECKED_BASE,
    facts: {
      isContract,
      bytecodeBytes: bytes,
      likelyProxy: proxy.likely,
      proxyEvidence: proxy.evidence || null,
    },
  };
}

/** @deprecated Prefer fetchOnChainSnapshot — string form for legacy prompts */
export async function fetchOnChainContext(
  target: string,
  chain: ChainId
): Promise<string> {
  const snap = await fetchOnChainSnapshot(target, chain);
  return `${snap.summary} | completeness=${snap.completeness}`;
}
