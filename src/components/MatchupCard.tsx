"use client";

import { motion } from "framer-motion";
import type { Matchup, Team } from "@/data/worldCup2026";
import { PuzzlePiece } from "./PuzzlePiece";

export function MatchupCard({
  matchup,
  winner,
  onPick,
  onInspect,
}: {
  matchup: Matchup;
  winner?: Team;
  onPick: (team: Team) => void;
  onInspect: () => void;
}) {
  const loserSelected = Boolean(winner);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-[26px] border border-white/12 bg-[#0E141D]/82 p-2.5 shadow-2xl shadow-black/30 backdrop-blur"
    >
      <button
        type="button"
        onClick={onInspect}
        className="mb-2 flex w-full items-center justify-between px-1 text-left"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F7D774]/80">
          Match {matchup.position + 1}
        </span>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white/45">
          Details
        </span>
      </button>
      <div className="grid gap-1.5">
        <PuzzlePiece
          team={matchup.teamA}
          selected={winner?.id === matchup.teamA?.id}
          dimmed={loserSelected && winner?.id !== matchup.teamA?.id}
          onPick={matchup.teamA ? () => onPick(matchup.teamA as Team) : undefined}
        />
        <div className="mx-auto -my-0.5 grid h-7 w-7 place-items-center rounded-full border border-[#F7D774]/40 bg-[#05070A] text-[10px] font-black text-[#F7D774] shadow-[0_0_20px_rgb(247_215_116_/_0.18)]">
          VS
        </div>
        <PuzzlePiece
          team={matchup.teamB}
          selected={winner?.id === matchup.teamB?.id}
          dimmed={loserSelected && winner?.id !== matchup.teamB?.id}
          onPick={matchup.teamB ? () => onPick(matchup.teamB as Team) : undefined}
        />
      </div>
    </motion.article>
  );
}
