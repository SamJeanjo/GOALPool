import { CreateBracketModal } from "@/components/goalpool/CreateBracketModal";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <CreateBracketModal />
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <p className="text-[13px] font-bold uppercase tracking-wide text-blue-600">Default scoring</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Simple enough for everyone.</h2>
          <div className="mt-6 grid gap-3">
            {[
              ["Round of 32", "1 point"],
              ["Round of 16", "2 points"],
              ["Quarterfinal", "4 points"],
              ["Semifinal", "8 points"],
              ["Final", "16 points"],
              ["Champion", "32 points"],
            ].map(([round, points]) => (
              <div key={round} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="font-bold text-slate-800">{round}</span>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-blue-700 shadow-sm">{points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
