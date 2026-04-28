import { Crown, TrendingUp } from "lucide-react";
import { leaderboardRows } from "@/lib/tournament-data";

export function PoolLeaderboard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#07111F]/85 shadow-2xl shadow-black/25">
      <div className="goal-gradient flex items-center justify-between p-5 text-[#05070A]">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-wide text-black/55">Pool leaderboard</p>
          <h2 className="text-2xl font-semibold">Clean Bracket Club</h2>
        </div>
        <Crown className="h-8 w-8 text-black/70" />
      </div>
      <div className="divide-y divide-white/10">
        {leaderboardRows.map((row) => (
          <div key={row.rank} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 p-4">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-sm font-black text-[#F8E7A4]">
              {row.rank}
            </div>
            <div className="min-w-0">
              <div className="truncate font-bold text-white">{row.name}</div>
              <div className="truncate text-sm text-slate-500">
                {row.bracket} / Champion: {row.champion}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-white">{row.points}</div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#D4AF37]">
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
