import { BarChart3, MapPin, Trophy, Users } from "lucide-react";
import { AccountStart } from "@/components/goalpool/AccountStart";
import { featuredBracket, leaderboardRows, tournament } from "@/lib/tournament-data";
import { BracketCanvas } from "@/components/goalpool/BracketCanvas";

function RankingPreview() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-blue-600">Ranking grows with the crowd</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Small pool first. City, country, world when it matters.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Sports psychology is simple: people need belonging before competition. Start with your game ranking, then unlock wider ladders as the community grows.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["Game", "25"],
            ["City", "2.1k"],
            ["World", "5M"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 px-4 py-3">
              <div className="text-lg font-black text-slate-950">{value}</div>
              <div className="text-[11px] font-black uppercase tracking-wide text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {leaderboardRows.slice(0, 3).map((row) => (
          <article key={row.rank} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-black shadow-sm">#{row.rank}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{row.points} pts</span>
            </div>
            <div className="mt-4 font-black text-slate-950">{row.name}</div>
            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {row.city}, {row.country}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main className="world-noise min-h-screen bg-[#FBF7EC] text-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <nav className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white shadow-lg">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">GoalPool</div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Simple bracket game</div>
            </div>
          </div>
          <a href="/bracket" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm">
            Demo bracket
          </a>
        </nav>

        <AccountStart />

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            [Users, "Create account", "Email, city, country. Nothing heavy."],
            [Trophy, "Choose teams", "The app feels like your teams."],
            [BarChart3, "Make picks", "Correct predictions earn points."],
            [MapPin, "Chase ranking", "Game, city, country, world."],
          ].map(([Icon, title, text]) => (
            <article key={title as string} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-blue-600" />
              <h2 className="mt-4 text-lg font-black text-slate-950">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text as string}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Bracket-first</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">A soccer-ball puzzle. The center is the winner.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">{tournament.format}. Demo groups update when the final draw is available.</p>
        </div>
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-900/8">
          <BracketCanvas initialPicks={featuredBracket.picks} readonly showSaveBar={false} title="Demo bracket puzzle" favoriteTeamIds={["usa", "mex", "can"]} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-8">
        <RankingPreview />
      </section>
    </main>
  );
}
