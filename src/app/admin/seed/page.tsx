import { scoringRules, teams, tournament } from "@/lib/tournament-data";

export default function SeedAdminPage() {
  return (
    <main className="min-h-screen bg-[#05070A] px-4 py-8 text-white md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-[#07111F]/75 p-6 shadow-sm md:p-8">
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#D4AF37]">Admin seed data</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Demo tournament payload</h1>
          <p className="mt-3 max-w-3xl text-slate-400">
            Neutral 48-team Global Football Tournament data for Supabase. Demo groups should be updated when the final tournament draw is available.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-3xl font-black text-white">{teams.length}</div>
              <div className="text-sm font-semibold text-slate-500">National teams</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-3xl font-black text-white">A-L</div>
              <div className="text-sm font-semibold text-slate-500">Demo group labels</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-3xl font-black text-white">{scoringRules.length}</div>
              <div className="text-sm font-semibold text-slate-500">Scoring rules</div>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500">{tournament.note}</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#07111F]/70 p-3 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-black/30 text-2xl ring-1 ring-white/10">{team.flagEmoji}</span>
              <div>
                <div className="font-bold text-white">{team.name}</div>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Seed {team.seed} / Group {team.group}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
