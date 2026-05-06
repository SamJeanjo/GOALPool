"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Save, Share2, Trophy } from "lucide-react";
import { MatchCard } from "./MatchCard";
import {
  createLocalBracket,
  featuredBracket,
  getTeam,
  resolveBracketMatches,
  rounds,
  tournament,
  updatePicksWithReset,
  type Bracket,
  type BracketPick,
  type Match,
} from "@/lib/tournament-data";
import { cn } from "@/lib/utils";

export function TournamentHeader({
  title = tournament.name,
  subtitle = "48 national teams / 12 demo groups / 32-team knockout bracket",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[13px] font-bold uppercase tracking-wide text-emerald-700">GoalPool bracket</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-base text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
        <Trophy className="h-4 w-4 text-emerald-600" />
        Champion path updates live
      </div>
    </div>
  );
}

export function ShareBracketButton({ bracket }: { bracket?: Bracket }) {
  const href = `/b/${bracket?.shareSlug ?? featuredBracket.shareSlug}`;

  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-950 shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-emerald-300"
    >
      <Share2 className="h-4 w-4" />
      Share bracket
    </a>
  );
}

export function WinnerPathAnimation({ championId }: { championId?: string }) {
  const champion = getTeam(championId);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={champion?.id ?? "pending"}
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: -8 }}
        className="soccer-panel gold-glow flex min-h-[220px] w-[220px] shrink-0 flex-col items-center justify-center rounded-full border border-slate-200 p-5 text-center text-slate-950"
      >
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Center winner</span>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-5xl">{champion?.flagEmoji ?? "⚽"}</span>
          <div>
            <div className="text-lg font-black">{champion?.name ?? "Pick the final"}</div>
            <div className="text-sm text-slate-600">{champion ? `Seed ${champion.seed}` : "The puzzle ends here"}</div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function RoundColumn({
  label,
  short,
  matches,
  readonly,
  onPick,
}: {
  label: string;
  short: string;
  matches: Match[];
  readonly?: boolean;
  onPick?: (match: Match, teamId: string) => void;
}) {
  return (
    <section className="min-w-[244px] snap-start">
      <div className="sticky top-0 z-10 mb-4 rounded-full border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="text-[11px] font-black uppercase tracking-wide text-emerald-700">{short}</div>
        <h2 className="text-base font-semibold text-slate-950">{label}</h2>
      </div>
      <div className="flex flex-col gap-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} readonly={readonly} onPick={onPick} />
        ))}
      </div>
    </section>
  );
}

export function MobileBracketScroller({ children }: { children: React.ReactNode }) {
  return (
    <div className="scrollbar-none -mx-4 flex snap-x gap-6 overflow-x-auto px-4 pb-28 lg:mx-0 lg:px-0 lg:pb-0">
      {children}
    </div>
  );
}

export function BracketCanvas({
  readonly = false,
  initialPicks = {},
  title,
  showSaveBar = true,
  favoriteTeamIds = [],
}: {
  readonly?: boolean;
  initialPicks?: BracketPick;
  title?: string;
  showSaveBar?: boolean;
  favoriteTeamIds?: string[];
}) {
  const [picks, setPicks] = useState<BracketPick>(initialPicks);
  const [savedBracket, setSavedBracket] = useState<Bracket | undefined>();
  const matches = useMemo(() => resolveBracketMatches(picks), [picks]);
  const championId = matches.find((match) => match.id === "final-1")?.winnerTeamId;
  const pickedCount = Object.keys(picks).length;
  const favoriteTeam = getTeam(favoriteTeamIds[0]);
  const primary = favoriteTeam?.colors.primary ?? "#2563EB";
  const secondary = favoriteTeam?.colors.secondary ?? "#22C55E";

  const onPick = (match: Match, teamId: string) => {
    setPicks((current) => updatePicksWithReset(current, match, teamId));
  };

  const saveBracket = () => {
    const bracket = createLocalBracket("My GoalPool Bracket", picks);
    const existing = JSON.parse(localStorage.getItem("goalpool.brackets") ?? "[]") as Bracket[];
    localStorage.setItem("goalpool.brackets", JSON.stringify([bracket, ...existing]));
    setSavedBracket(bracket);
  };

  return (
    <div
      className="min-h-screen bg-[#FBF7EC] world-noise"
      style={{
        backgroundImage: `radial-gradient(circle at 12% 8%, ${primary}22, transparent 32rem), radial-gradient(circle at 88% 16%, ${secondary}22, transparent 30rem)`,
      }}
    >
      <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8 md:py-10">
        <TournamentHeader title={title ?? tournament.name} />
        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white/82 p-4 board-shadow backdrop-blur md:p-6">
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-wide text-emerald-700">Prediction puzzle</p>
              <p className="text-sm text-slate-500">
                {pickedCount}/31 picks completed. Downstream picks reset when an earlier result changes.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
                Tap cards
              </span>
              <span className="rounded-full border px-3 py-1 text-xs font-bold text-white" style={{ background: primary, borderColor: primary }}>
                {favoriteTeam ? `${favoriteTeam.name} theme` : "Auto-advance"}
              </span>
            </div>
          </div>
          <MobileBracketScroller>
            {rounds.map((round) => (
              <RoundColumn
                key={round.key}
                label={round.label}
                short={round.short}
                matches={matches.filter((match) => match.round === round.key)}
                readonly={readonly}
                onPick={onPick}
              />
            ))}
            <section className="flex min-w-[244px] snap-start flex-col justify-center">
              <div className="sticky top-0 z-10 mb-4 rounded-full border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
                <div className="text-[11px] font-black uppercase tracking-wide text-emerald-700">Center</div>
                <h2 className="text-base font-semibold text-slate-950">Winner</h2>
              </div>
              <WinnerPathAnimation championId={championId} />
            </section>
          </MobileBracketScroller>
        </div>
      </main>
      {showSaveBar ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl gap-2">
            <button
              type="button"
              disabled={readonly}
              onClick={saveBracket}
              className={cn(
                "goal-gradient inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-black text-white transition active:scale-[0.98]",
                readonly && "opacity-60",
              )}
            >
              <Save className="h-4 w-4" />
              Save bracket
            </button>
            <ShareBracketButton bracket={savedBracket} />
          </div>
        </div>
      ) : null}
      <div className="hidden justify-center gap-3 pb-10 lg:flex">
        <button
          type="button"
          disabled={readonly}
          onClick={saveBracket}
          className={cn(
            "goal-gradient inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 active:scale-[0.98]",
            readonly && "opacity-60",
          )}
        >
          <Save className="h-4 w-4" />
          Save bracket
        </button>
        <ShareBracketButton bracket={savedBracket} />
      </div>
    </div>
  );
}
