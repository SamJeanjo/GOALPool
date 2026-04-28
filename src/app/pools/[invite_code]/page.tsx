import { PoolLeaderboard } from "@/components/goalpool/PoolLeaderboard";

export default async function PoolPage({
  params,
}: {
  params: Promise<{ invite_code: string }>;
}) {
  const { invite_code } = await params;

  return (
    <main className="min-h-screen bg-[#05070A] px-4 py-8 text-white md:px-8 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-white/10 bg-[#07111F]/75 p-6 shadow-sm md:p-8">
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#D4AF37]">Invite code {invite_code}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Join the pool</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Bring one bracket, compare every round, and keep the leaderboard easy to understand at a glance.
          </p>
          <a href="/create" className="goal-gradient mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-black text-[#05070A]">
            Create bracket for this pool
          </a>
        </section>
        <PoolLeaderboard />
      </div>
    </main>
  );
}
