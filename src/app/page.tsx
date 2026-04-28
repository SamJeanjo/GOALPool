import { ArrowRight, BarChart3, Link2, MousePointer2, Trophy } from "lucide-react";
import { BracketCanvas } from "@/components/goalpool/BracketCanvas";
import { featuredBracket } from "@/lib/goalpool-data";

const features = [
  { icon: MousePointer2, title: "Fast picks", text: "Tap winners and watch your bracket build itself." },
  { icon: Link2, title: "Shareable pools", text: "Invite friends with one clean link." },
  { icon: BarChart3, title: "Live leaderboard", text: "Track standings as results come in." },
  { icon: Trophy, title: "Built for every tournament", text: "Football, hockey, basketball, and custom pools." },
];

export default function LandingPage() {
  return (
    <main className="bg-slate-50">
      <section className="goal-gradient relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="w-fit rounded-full bg-white/15 px-4 py-2 text-[13px] font-bold uppercase tracking-wide">
              No betting. No clutter. Just beautiful brackets.
            </div>
            <h1 className="mt-6 max-w-3xl text-[36px] font-black leading-tight tracking-tight md:text-[56px]">
              The cleanest bracket experience for global sports pools.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">
              Create a beautiful tournament bracket, pick winners in seconds, share it with friends, and follow the leaderboard live.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/create" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-blue-700 shadow-xl shadow-slate-900/10">
                Create your bracket
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/bracket" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 px-6 text-sm font-black text-white">
                View demo bracket
              </a>
            </div>
          </div>
          <div className="min-h-[420px] overflow-hidden rounded-[32px] bg-white/12 p-3 shadow-2xl shadow-slate-900/20">
            <div className="h-[520px] overflow-hidden rounded-[24px] bg-slate-50 text-slate-950">
              <BracketCanvas initialPicks={featuredBracket.picks} readonly showSaveBar={false} title="Demo bracket" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <feature.icon className="h-6 w-6 text-blue-600" />
              <h2 className="mt-5 text-xl font-black text-slate-950">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
