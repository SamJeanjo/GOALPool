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
          ? "bg-[#D4AF37]/12 text-[#F8E7A4] ring-1 ring-[#D4AF37]/45 shadow-[0_0_28px_rgb(212_175_55_/_0.08)]"
          : "bg-white/[0.035] text-slate-200 hover:bg-white/[0.07]",
        !team && "border border-dashed border-white/10 bg-white/[0.025] text-slate-500",
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black/40 text-lg ring-1 ring-white/10">
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
          <span className="rounded-md bg-black/40 px-2 py-1 text-xs font-bold text-[#D4AF37]">{score}</span>
        ) : null}
        {locked ? <Lock className="h-4 w-4 text-slate-400" /> : null}
        {selected ? <Check className="h-4 w-4 text-[#D4AF37]" /> : null}
      </div>
    </div>
  );
}
