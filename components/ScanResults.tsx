import { Check, Copy, Lock, ShieldAlert } from "lucide-react";
import type { ScanResult } from "@/lib/types";

type Props = {
  result: ScanResult;
  copied: boolean;
  onCopy: (text: string) => void;
};

export function ScanResults({ result, copied, onCopy }: Props) {
  return (
    <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 gap-3 flex-wrap">
        <div className="flex items-center space-x-3 min-w-0">
          <ShieldAlert className="h-8 w-8 text-rose-500 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-200 font-mono truncate">
              {result.address}
            </h3>
            <p className="text-xs text-rose-400 font-mono mt-0.5">
              Ecosystem: {result.chain} | Status: {result.status} | Score:{" "}
              {result.riskScore}/100
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => onCopy(result.aiAnalysis)}
            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center transition"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            {copied ? "Copied Report" : "Copy AI Report"}
          </button>
          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-1.5 rounded-full text-xs font-bold font-mono">
            {result.threatLevel}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Autonomous AI Agent & Neural RAG Diagnostics
        </h4>
        <div className="text-sm text-slate-200 bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono whitespace-pre-line leading-relaxed">
          {result.aiAnalysis}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Identified Vulnerability Flags
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {result.flags.map((flag) => (
            <div
              key={flag}
              className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center space-x-2 text-xs text-slate-300 font-mono"
            >
              <Lock className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{flag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
