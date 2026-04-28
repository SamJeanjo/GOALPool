import { Crown, TrendingUp } from "lucide-react";
import { leaderboardRows } from "@/lib/goalpool-data";

export function PoolLeaderboard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="goal-gradient flex items-center justify-between p-5 text-white">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-wide text-white/75">Pool leaderboard</p>
          <h2 className="text-2xl font-black">Clean Bracket Club</h2>
        </div>
        <Crown className="h-8 w-8 text-amber-300" />
      </div>
      <div className="divide-y divide-slate-100">
        {leaderboardRows.map((row) => (
          <div key={row.rank} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 p-4">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-700">
              {row.rank}
            </div>
            <div className="min-w-0">
              <div className="truncate font-bold text-slate-950">{row.name}</div>
              <div className="truncate text-sm text-slate-500">
                {row.bracket} · Champion: {row.champion}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-slate-950">{row.points}</div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                {row.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
