import { demoTeams, scoringRules } from "@/lib/goalpool-data";

export default function SeedAdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-[13px] font-bold uppercase tracking-wide text-blue-600">Admin seed data</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Demo tournament payload</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Neutral 48-team Global Football Tournament data for Supabase. Run the SQL files in
            <span className="font-mono"> supabase/migrations</span>, then seed from
            <span className="font-mono"> supabase/seed.sql</span>.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-3xl font-black text-slate-950">{demoTeams.length}</div>
              <div className="text-sm font-semibold text-slate-500">National teams</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-3xl font-black text-slate-950">A-L</div>
              <div className="text-sm font-semibold text-slate-500">Group labels</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-3xl font-black text-slate-950">{scoringRules.length}</div>
              <div className="text-sm font-semibold text-slate-500">Scoring rules</div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {demoTeams.map((team) => (
            <div key={team.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <span className="text-2xl">{team.flagEmoji}</span>
              <div>
                <div className="font-bold text-slate-950">{team.name}</div>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Seed {team.seed} · Group {team.groupName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
