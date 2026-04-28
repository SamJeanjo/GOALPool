import { DashboardClient } from "@/components/goalpool/DashboardClient";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wide text-blue-600">My brackets</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Dashboard</h1>
            <p className="mt-2 text-slate-600">Saved brackets, share links, and pool status in one calm place.</p>
          </div>
          <a href="/create" className="goal-gradient inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-black text-white">
            Create your bracket
          </a>
        </div>
        <DashboardClient />
      </div>
    </main>
  );
}
