"use client";

import { useSyncExternalStore } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import { type Bracket } from "@/lib/tournament-data";
import { EmptyState } from "./EmptyState";

function subscribeToBrackets(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getBracketSnapshot() {
  return localStorage.getItem("goalpool.brackets") ?? "[]";
}

export function DashboardClient() {
  const bracketSnapshot = useSyncExternalStore(subscribeToBrackets, getBracketSnapshot, () => "[]");
  const brackets = JSON.parse(bracketSnapshot) as Bracket[];

  if (!brackets.length) {
    return (
      <EmptyState
        title="No saved brackets yet"
        description="Create your first bracket, save it locally, and your dashboard will fill in here."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {brackets.map((bracket) => (
        <article key={bracket.id} className="rounded-3xl border border-white/10 bg-[#07111F]/75 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{bracket.name}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {new Date(bracket.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-xs font-black text-[#F8E7A4]">
              Public
            </span>
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-[13px] font-bold uppercase tracking-wide text-slate-500">Share link</div>
            <div className="mt-1 truncate font-mono text-sm text-slate-300">/b/{bracket.shareSlug}</div>
          </div>
          <a
            href={`/b/${bracket.shareSlug}`}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-black text-white transition hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10"
          >
            Open share page
            <ExternalLink className="h-4 w-4" />
          </a>
        </article>
      ))}
    </div>
  );
}
