"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const saveEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) return;

    const leads = JSON.parse(localStorage.getItem("goalpool.emailLeads") ?? "[]") as string[];
    localStorage.setItem("goalpool.emailLeads", JSON.stringify(Array.from(new Set([trimmed, ...leads]))));
    setSaved(true);
  };

  return (
    <form onSubmit={saveEmail} className="rounded-3xl border border-white/10 bg-[#07111F]/80 p-4 shadow-2xl shadow-black/20">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Get launch access</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Save your email for pool invites, leaderboard access, and followed-team alerts.</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSaved(false);
          }}
          type="email"
          placeholder="you@email.com"
          className="min-h-12 flex-1 rounded-full border border-white/10 bg-black/30 px-4 text-sm font-medium text-white outline-none ring-[#D4AF37] transition placeholder:text-slate-600 focus:border-[#D4AF37]/35 focus:ring-2"
        />
        <button className="goal-gradient min-h-12 rounded-full px-5 text-sm font-black text-[#05070A] transition active:scale-[0.98]">
          Join
        </button>
      </div>
      {saved ? <p className="mt-3 text-xs font-semibold text-[#F8E7A4]">Saved locally. Supabase capture is ready for wiring.</p> : null}
    </form>
  );
}
