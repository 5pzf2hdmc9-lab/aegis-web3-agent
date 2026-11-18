import { AlertTriangle, Check, Copy, ExternalLink, Lock, Shield } from "lucide-react";
import type { AuditReport, VerdictKind } from "@/lib/types";

type Props = {
  result: AuditReport;
  copied: boolean;
  onCopy: (text: string) => void;
};

const VERDICT_LABEL: Record<VerdictKind, string> = {
  SAFE_TO_PROCEED_WITH_SIZE_CAP: "Safe to Proceed (size-cap)",
  CAUTION_REVOKE_FIRST: "Caution — Revoke First",
  DO_NOT_SIGN: "Do Not Sign",
};

const VERDICT_CLASS: Record<VerdictKind, string> = {
  SAFE_TO_PROCEED_WITH_SIZE_CAP:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  CAUTION_REVOKE_FIRST: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  DO_NOT_SIGN: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

export function ScanResults({ result, copied, onCopy }: Props) {
  const copyText = [
    result.verdict,
    result.verdictReason,
    result.nextAction,
    result.aiSummary ?? "",
    ...result.flags.map((f) => `[${f.severity}] ${f.title}: ${f.evidence}`),
  ].join("\n");

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
      <div
        className={`rounded-xl border px-4 py-3 ${VERDICT_CLASS[result.verdict]}`}
      >
        <div className="flex items-start gap-3">
          {result.verdict === "DO_NOT_SIGN" ? (
            <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
          ) : (
            <Shield className="h-6 w-6 shrink-0 mt-0.5" />
          )}
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-bold font-mono tracking-wide">
              {VERDICT_LABEL[result.verdict]}
            </p>
            <p className="text-xs font-mono opacity-90">{result.verdictReason}</p>
            <p className="text-xs font-mono font-semibold mt-2">
              Next: {result.nextAction}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-b border-slate-800 pb-4 gap-3 flex-wrap">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-200 font-mono truncate">
            {result.address}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {result.chain} · Completeness: {result.completeness} · Score:{" "}
            {result.riskScore === null ? "n/a" : `${result.riskScore}/100`} ·{" "}
            {result.threatLevel}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(copyText)}
          className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center transition"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 mr-1.5" />
          )}
          {copied ? "Copied Report" : "Copy Report"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 uppercase tracking-wider mb-2">Checked</p>
          <ul className="space-y-1 text-slate-300">
            {result.checked.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 uppercase tracking-wider mb-2">Not checked</p>
          <ul className="space-y-1 text-slate-400">
            {result.notChecked.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </div>
      </div>

      {result.aiSummary && (
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            AI interpretive brief (not a vector RAG store)
          </h4>
          <div className="text-sm text-slate-200 bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono whitespace-pre-line leading-relaxed">
            {result.aiSummary}
          </div>
        </div>
      )}

      {!result.aiSummary && (
        <p className="text-xs text-amber-400/90 font-mono border border-amber-500/20 bg-amber-500/5 rounded-xl px-4 py-3">
          AI brief unavailable — showing deterministic RPC flags only ({result.completeness}).
        </p>
      )}

      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Evidence-backed flags
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.flags.map((flag) => (
            <div
              key={flag.id}
              className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1 text-xs text-slate-300 font-mono"
            >
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-bold">{flag.title}</span>
                <span className="ml-auto text-[10px] uppercase text-slate-500">
                  {flag.severity} · {flag.confidence}
                  {flag.commonOnLegit ? " · common on legit" : ""}
                </span>
              </div>
              <p className="text-slate-400 pl-6">{flag.evidence}</p>
              <p className="text-slate-600 pl-6">{flag.source}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
        <p className="text-[11px] text-slate-500 font-mono max-w-xl">
          {result.cleanIsNotSafeNote}
        </p>
        <a
          href={result.methodologyPath}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
        >
          Methodology <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="text-[11px] text-slate-500 font-mono space-y-1">
        <p>We never ask for your seed or a wallet connection for paste scans.</p>
        <p>
          Revoke unused approvals:{" "}
          <a
            className="text-cyan-400 hover:underline"
            href="https://revoke.cash"
            target="_blank"
            rel="noreferrer"
          >
            revoke.cash
          </a>{" "}
          · hardware-safe batch revoke via Rabby + Ledger.
        </p>
        <p>
          Burner for ape risk · cold wallet for stack · never store a seed in cloud notes.
        </p>
      </div>
    </div>
  );
}
