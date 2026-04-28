"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function CreateBracketModal() {
  const [name, setName] = useState("My Global Football Bracket");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Create your bracket</h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Name it, jump into picks, and GoalPool will keep the share link ready as soon as you save.
      </p>
      <label className="mt-8 block text-[13px] font-bold uppercase tracking-wide text-slate-500" htmlFor="bracket-name">
        Bracket name
      </label>
      <input
        id="bracket-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold outline-none ring-blue-500 transition focus:bg-white focus:ring-2"
      />
      <a
        href={`/bracket?name=${encodeURIComponent(name)}`}
        className="goal-gradient mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-black text-white shadow-lg shadow-blue-500/20"
      >
        Start picking
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
