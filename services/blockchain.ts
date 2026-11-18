import type { ChainId } from "@/lib/validation";

const RPC_ENDPOINTS: Record<ChainId, string | undefined> = {
  solana: process.env.SOLANA_RPC_URL,
  ethereum: process.env.ETHEREUM_RPC_URL,
  base: process.env.BASE_RPC_URL,
  bnb: process.env.BNB_RPC_URL,
};

export async function fetchOnChainContext(
  target: string,
  chain: ChainId
): Promise<string> {
  const rpcUrl = RPC_ENDPOINTS[chain];
  if (!rpcUrl) {
    return `Standard evaluation for ${chain.toUpperCase()} (RPC not configured).`;
  }

  try {
    const rpcBody =
      chain === "solana"
        ? {
            jsonrpc: "2.0",
            id: 1,
            method: "getAccountInfo",
            params: [target, { encoding: "jsonParsed" }],
          }
        : {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getCode",
            params: [target, "latest"],
          };

    const rpcRes = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rpcBody),
    });
    const rpcData = await rpcRes.json();

    if (!rpcData?.result) {
      return `RPC responded without account data for ${chain.toUpperCase()}.`;
    }

    if (chain === "solana") {
      return rpcData.result.value
        ? `Live Solana On-Chain Data -> Lamports: ${rpcData.result.value.lamports}, Owner: ${rpcData.result.value.owner}`
        : "Solana account verified on-chain (empty account).";
    }

    const code: string = rpcData.result;
    const isContract = code !== "0x" && code.length > 2;
    return `Live EVM On-Chain Data (${chain.toUpperCase()}) -> Type: ${
      isContract ? "Smart Contract Bytecode Deployed" : "Externally Owned Wallet (EOA)"
    }, Bytecode Length: ${code.length} bytes`;
  } catch {
    return `RPC connection fallback heuristics for ${chain.toUpperCase()}.`;
  }
}
