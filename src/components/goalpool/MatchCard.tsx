"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTeam, type Match } from "@/lib/goalpool-data";
import { TeamPill } from "./TeamPill";

export function ScoreBadge({ completed }: { completed: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wide",
        completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500",
      )}
    >
      {completed ? "Picked" : "Open"}
    </span>
  );
}

export function MatchCard({
  match,
  readonly,
  onPick,
}: {
  match: Match;
  readonly?: boolean;
  onPick?: (match: Match, teamId: string) => void;
}) {
  const teamA = getTeam(match.teamAId);
  const teamB = getTeam(match.teamBId);
  const completed = Boolean(match.winnerTeamId);
  const locked = match.status === "locked" || match.status === "final";

  const pick = (teamId?: string) => {
    if (!teamId || readonly || locked) return;
    onPick?.(match, teamId);
  };

  return (
    <motion.div
      layout
      whileHover={readonly ? undefined : { y: -3 }}
      className="relative w-[220px] shrink-0 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Match {match.position + 1}
        </span>
        <ScoreBadge completed={completed} />
      </div>
      <div className="space-y-2">
        <button
          type="button"
          disabled={!teamA || readonly || locked}
          onClick={() => pick(match.teamAId)}
          className="block w-full rounded-xl text-left disabled:cursor-default"
        >
          <TeamPill team={teamA} selected={match.winnerTeamId === match.teamAId} locked={locked} score={match.scoreA} />
        </button>
        <button
          type="button"
          disabled={!teamB || readonly || locked}
          onClick={() => pick(match.teamBId)}
          className="block w-full rounded-xl text-left disabled:cursor-default"
        >
          <TeamPill team={teamB} selected={match.winnerTeamId === match.teamBId} locked={locked} score={match.scoreB} />
        </button>
      </div>
      {completed ? <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-gradient-to-r from-blue-500 to-emerald-400 lg:block" /> : null}
    </motion.div>
  );
}
