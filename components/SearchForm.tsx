import { Cpu, Loader2, Search } from "lucide-react";
import type { ChainId } from "@/lib/validation";

type Props = {
  address: string;
  chain: ChainId;
  loading: boolean;
  onAddressChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function SearchForm({
  address,
  chain,
  loading,
  onAddressChange,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder={
            chain === "solana"
              ? "Enter Solana wallet or program address (base58)…"
              : `Enter ${chain.toUpperCase()} wallet or contract address (0x…)…`
          }
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 font-mono transition"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl transition font-semibold flex items-center shadow-lg shadow-purple-600/20 disabled:opacity-50 shrink-0"
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
        ) : (
          <Cpu className="mr-2 h-5 w-5" />
        )}
        {loading ? "Synthesizing Heuristics..." : "Run Autonomous Audit"}
      </button>
    </form>
  );
}
