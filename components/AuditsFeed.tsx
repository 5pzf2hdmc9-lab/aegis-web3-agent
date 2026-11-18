import { Activity } from "lucide-react";
import type { AuditFeedItem } from "@/lib/types";

type Props = {
  items: AuditFeedItem[];
};

function scoreColor(score: number | null) {
  if (score === null) return "text-slate-400";
  if (score >= 75) return "text-rose-400";
  if (score >= 45) return "text-amber-400";
  return "text-emerald-400";
}

const VERDICT_SHORT: Record<AuditFeedItem["verdict"], string> = {
  SAFE_TO_PROCEED_WITH_SIZE_CAP: "SIZE-CAP",
  CAUTION_REVOKE_FIRST: "CAUTION",
  DO_NOT_SIGN: "DON'T SIGN",
};

export function AuditsFeed({ items }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <Activity className="text-cyan-400 mr-2 h-5 w-5" />
        Recent Audits Feed
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500 font-mono">
          No audits yet. Run a scan or pick a Quick Test Target to populate the live feed.
        </p>
      ) : (
        <ul className="space-y-3 max-h-56 overflow-y-auto pr-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-mono text-slate-200 truncate">{item.address}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {item.chain.toUpperCase()} · {item.timestamp} ·{" "}
                  {VERDICT_SHORT[item.verdict]} · {item.threatLevel}
                </p>
              </div>
              <div
                className={`text-sm font-bold font-mono shrink-0 ${scoreColor(item.riskScore)}`}
              >
                {item.riskScore === null ? "n/a" : `${item.riskScore}/100`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
