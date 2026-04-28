import { ArrowRight, BarChart3, CheckCircle2, Link2, MousePointer2, Trophy, Users } from "lucide-react";
import { BracketCanvas } from "@/components/goalpool/BracketCanvas";
import { featuredBracket, groups, tournament } from "@/lib/tournament-data";

const stats = ["48 teams", "12 groups", "104 matches", "32-team knockout"];

const features = [
  { icon: MousePointer2, title: "Pick winners fast", text: "Tap through every matchup with big, readable team cards." },
  { icon: Link2, title: "Share private pools", text: "Send one clean link and keep everyone on the same board." },
  { icon: BarChart3, title: "Follow live standings", text: "A leaderboard that stays simple as results come in." },
  { icon: Trophy, title: "Built for every tournament", text: "A reusable bracket platform beyond one event." },
];

const steps = [
  "Create your bracket",
  "Pick winners",
  "Invite friends",
  "Track leaderboard",
];

function BracketPreviewCard() {
  const previewRounds = ["Group Stage", "Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Final", "Champion"];
  const previewTeams = groups.slice(0, 3).flatMap((group) => group.teams.slice(0, 2));

  return (
    <div className="gold-glow relative overflow-hidden rounded-[28px] border border-white/10 bg-[#07111F]/90 p-4 backdrop-blur">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgb(212_175_55_/_0.16),transparent_22rem)]" />
      <div className="relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#D4AF37]">Projected bracket demo</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Live bracket preview</h2>
          </div>
          <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#F8E7A4]">
            Demo groups
          </span>
        </div>
        <div className="scrollbar-none mt-5 flex gap-3 overflow-x-auto pb-2">
          {previewRounds.map((round, index) => (
            <div key={round} className="min-w-[150px] rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="text-[10px] font-black uppercase tracking-wide text-slate-500">0{index + 1}</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">{round}</div>
              <div className="mt-4 space-y-2">
                {(index === 0 ? previewTeams.slice(0, 3) : previewTeams.slice(index - 1, index + 1)).map((team) => (
                  <div key={`${round}-${team.id}`} className="flex items-center gap-2 rounded-xl bg-white/[0.045] px-2.5 py-2 ring-1 ring-white/5">
                    <span>{team.flagEmoji}</span>
                    <span className="truncate text-xs font-semibold text-slate-200">{team.name}</span>
                  </div>
                ))}
                {index > 3 ? (
                  <div className="rounded-xl border border-dashed border-[#D4AF37]/25 bg-[#D4AF37]/10 px-2.5 py-2 text-xs font-semibold text-[#F8E7A4]">
                    Winner advances
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-[#05070A] text-white">
      <section className="dark-noise relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="w-fit rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-2 text-[13px] font-bold uppercase tracking-wide text-[#F8E7A4]">
              2026 bracket pools
            </div>
            <h1 className="mt-6 max-w-3xl text-[36px] font-semibold leading-tight tracking-tight text-white md:text-[56px]">
              Build your bracket. Share your picks. Track the path to the final.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              A clean, fast bracket experience for the 2026 global football tournament. No betting, no clutter, just beautiful pools.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/create" className="goal-gradient inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-black text-[#05070A] shadow-xl shadow-[#D4AF37]/15 transition hover:-translate-y-0.5 active:scale-[0.98]">
                Create bracket
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/bracket" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-6 text-sm font-black text-white transition hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 active:scale-[0.98]">
                View demo
              </a>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500">48 teams / 12 groups / 32-team knockout bracket</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-200">
                  {stat}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <BracketPreviewCard />
            <div className="h-[470px] overflow-hidden rounded-[28px] border border-white/10 bg-[#07111F]/80 p-2 shadow-2xl shadow-black/40">
              <div className="h-full overflow-hidden rounded-[22px]">
                <BracketCanvas initialPicks={featuredBracket.picks} readonly showSaveBar={false} title="Projected bracket demo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#07111F]/55">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-4 md:px-8">
          {[
            ["Dates", tournament.dates],
            ["Hosts", tournament.hosts.join(", ")],
            ["Advancement", "Top 2 plus 8 best third-place teams"],
            ["Label", "Projected bracket demo"],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-[11px] font-black uppercase tracking-wide text-[#D4AF37]">{label}</div>
              <div className="mt-1 text-sm font-semibold text-slate-200">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide text-[#D4AF37]">Demo bracket</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">NHL-simple, built for football pools.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">{tournament.note}</p>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#07111F]/80 shadow-2xl shadow-black/30">
          <BracketCanvas initialPicks={featuredBracket.picks} readonly showSaveBar={false} title={tournament.name} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-[#D4AF37]/25 hover:bg-white/[0.06]">
              <feature.icon className="h-6 w-6 text-[#D4AF37]" />
              <h2 className="mt-5 text-lg font-semibold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="rounded-[28px] border border-white/10 bg-[#07111F]/70 p-6 md:p-8">
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#D4AF37]">How it works</p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl bg-black/25 p-5 ring-1 ring-white/10">
                <CheckCircle2 className="h-5 w-5 text-[#D4AF37]" />
                <div className="mt-5 text-[11px] font-black uppercase tracking-wide text-slate-500">Step {index + 1}</div>
                <div className="mt-1 text-lg font-semibold text-white">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 md:px-8">
        <div className="goal-gradient mx-auto flex max-w-7xl flex-col gap-5 rounded-[28px] p-8 text-[#05070A] md:flex-row md:items-center md:justify-between">
          <div>
            <Users className="h-7 w-7" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Start a cleaner pool.</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium text-black/65">Create a bracket in seconds and send one polished link to your group.</p>
          </div>
          <a href="/create" className="inline-flex min-h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-black text-white transition hover:-translate-y-0.5">
            Create bracket
          </a>
        </div>
      </section>
    </main>
  );
}
