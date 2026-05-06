import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Team } from "@/lib/goalpool-data";

export function TeamPill({
  team,
  selected,
  locked,
  score,
}: {
  team?: Team;
  selected?: boolean;
  locked?: boolean;
  score?: number;
}) {
  return (
    <div
      className={cn(
        "flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition",
        selected
          ? "bg-emerald-50 text-slate-950 ring-1 ring-emerald-300 shadow-[0_12px_28px_rgb(34_197_94_/_0.12)]"
          : "bg-white text-slate-700 hover:bg-slate-50",
        !team && "border border-dashed border-slate-200 bg-slate-50 text-slate-400",
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-lg ring-1 ring-slate-200">
          {team?.flagEmoji ?? "TBD"}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{team?.name ?? "Winner advances"}</div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {team ? `Seed ${team.seed} / Group ${team.group}` : "Pending pick"}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {typeof score === "number" ? (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{score}</span>
        ) : null}
        {locked ? <Lock className="h-4 w-4 text-slate-400" /> : null}
        {selected ? <Check className="h-4 w-4 text-emerald-600" /> : null}
      </div>
    </div>
  );
}
