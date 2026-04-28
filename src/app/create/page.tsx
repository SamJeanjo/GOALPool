import { CreateBracketModal } from "@/components/goalpool/CreateBracketModal";
import { scoringRules, tournament } from "@/lib/tournament-data";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-[#05070A] px-4 py-8 text-white md:px-8 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <CreateBracketModal />
        <div className="rounded-3xl border border-white/10 bg-[#07111F]/75 p-5 shadow-sm md:p-8">
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#D4AF37]">Default scoring</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Simple enough for everyone.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">{tournament.format}</p>
          <div className="mt-6 grid gap-3">
            {scoringRules.map((rule) => (
              <div key={rule.round} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                <span className="font-bold text-slate-200">{rule.round}</span>
                <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-sm font-black text-[#F8E7A4]">
                  {rule.points} {rule.points === 1 ? "point" : "points"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
