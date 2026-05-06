"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Crown } from "lucide-react";
import { stageLabels, type Matchup, type StageKey, type Team } from "@/data/worldCup2026";
import { MatchupCard } from "./MatchupCard";

export function PuzzleBracketBall({
  stage,
  matchups,
  picks,
  champion,
  onPick,
  onInspect,
}: {
  stage: Exclude<StageKey, "groups">;
  matchups: Matchup[];
  picks: Record<string, string>;
  champion?: Team;
  onPick: (matchup: Matchup, team: Team) => void;
  onInspect: (matchup: Matchup) => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#080B12] p-4 shadow-[0_30px_120px_rgb(0_0_0_/_0.45)] md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgb(255_255_255_/_0.12),transparent_35%),radial-gradient(circle_at_20%_15%,rgb(247_215_116_/_0.16),transparent_22%),radial-gradient(circle_at_80%_76%,rgb(37_99_235_/_0.18),transparent_26%)]" />
      <div className="relative mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">Puzzle bracket ball</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-white md:text-5xl">{stageLabels[stage]}</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-white/55">
          Pick a team piece. Winners light up and move into the next ball. The final ball crowns the champion in the center.
        </p>
      </div>

      <div className="relative mx-auto min-h-[720px] overflow-x-auto scrollbar-none lg:min-h-[900px]">
        <motion.div
          key={stage}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="puzzle-ball relative mx-auto aspect-square min-w-[760px] max-w-[900px] rounded-full border border-white/15 p-8"
        >
          <div className="absolute inset-[8%] rounded-full border border-dashed border-white/12" />
          <div className="absolute inset-[18%] rounded-full border border-dashed border-[#F7D774]/18" />
          <div className="absolute left-1/2 top-1/2 z-20 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#F7D774]/45 bg-[#05070A]/90 text-center shadow-[0_0_70px_rgb(247_215_116_/_0.28)] backdrop-blur">
            <AnimatePresence mode="wait">
              <motion.div
                key={champion?.id ?? stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-4"
              >
                <Crown className="mx-auto mb-2 h-6 w-6 text-[#F7D774]" />
                <div className="text-4xl">{champion?.flag ?? "⚽"}</div>
                <div className="mt-2 text-sm font-black text-white">{champion?.name ?? "Winner"}</div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-wide text-white/40">Center piece</div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 grid h-full grid-cols-4 content-between gap-3">
            {matchups.map((matchup) => (
              <MatchupCard
                key={matchup.id}
                matchup={matchup}
                winner={matchup.teamA?.id === picks[matchup.id] ? matchup.teamA : matchup.teamB?.id === picks[matchup.id] ? matchup.teamB : undefined}
                onPick={(team) => onPick(matchup, team)}
                onInspect={() => onInspect(matchup)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
