import { Globe } from "lucide-react";
import { SUPPORTED_CHAINS, type ChainId } from "@/lib/validation";

type Props = {
  chain: ChainId;
  onChange: (chain: ChainId) => void;
};

export function ChainSelector({ chain, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {SUPPORTED_CHAINS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center ${
            chain === c
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700"
          }`}
        >
          <Globe className="w-3.5 h-3.5 mr-2 text-cyan-400" /> {c}
        </button>
      ))}
    </div>
  );
}
