import { QUICK_TEST_TARGETS } from "@/lib/quick-targets";
import type { QuickTarget } from "@/lib/types";

type Props = {
  disabled?: boolean;
  onSelect: (target: QuickTarget) => void;
};

const toneClass: Record<QuickTarget["tone"], string> = {
  safe: "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10",
  risk: "border-rose-500/40 text-rose-300 hover:bg-rose-500/10",
  live: "border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10",
};

export function QuickTestTargets({ disabled, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">
        Quick Test Targets
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {QUICK_TEST_TARGETS.map((target) => (
          <button
            key={target.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(target)}
            className={`text-left border rounded-xl px-4 py-3 transition disabled:opacity-50 ${toneClass[target.tone]} bg-slate-950`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-bold font-mono">{target.label}</div>
              <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">
                {target.chain}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{target.description}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-2 truncate">
              {target.address}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
