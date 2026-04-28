"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function CreateBracketModal() {
  const [name, setName] = useState("My 2026 Global Football Bracket");

  return (
    <div className="gold-glow rounded-3xl border border-white/10 bg-[#07111F]/85 p-5 shadow-sm md:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">Create your bracket</h1>
      <p className="mt-2 max-w-xl text-slate-400">
        Name it, jump into picks, and GoalPool will keep the share link ready as soon as you save.
      </p>
      <label className="mt-8 block text-[13px] font-bold uppercase tracking-wide text-[#D4AF37]" htmlFor="bracket-name">
        Bracket name
      </label>
      <input
        id="bracket-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-base font-semibold text-white outline-none ring-[#D4AF37] transition placeholder:text-slate-600 focus:border-[#D4AF37]/40 focus:ring-2"
      />
      <a
        href={`/bracket?name=${encodeURIComponent(name)}`}
        className="goal-gradient mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-black text-[#05070A] shadow-lg shadow-[#D4AF37]/15 transition hover:-translate-y-0.5 active:scale-[0.98]"
      >
        Start picking
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
