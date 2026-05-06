"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Share2, Sparkles, Trophy, X } from "lucide-react";
import {
  buildNextRound,
  buildRoundOf32,
  defaultGroupWinners,
  defaultThirdPlaceIds,
  stageLabels,
  type Matchup,
  type StageKey,
  type Team,
} from "@/data/worldCup2026";
import { GroupSelector } from "./GroupSelector";
import { PuzzleBracketBall } from "./PuzzleBracketBall";
import { StageTabs } from "./StageTabs";

type PickMap = Record<string, string>;

export function WinnerPicker() {
  const [activeStage, setActiveStage] = useState<StageKey>("groups");
  const [groupWinners, setGroupWinners] = useState<Record<string, string[]>>(defaultGroupWinners);
  const [thirdPlaceIds, setThirdPlaceIds] = useState<string[]>(defaultThirdPlaceIds);
  const [picks, setPicks] = useState<PickMap>({});
  const [inspectedMatchup, setInspectedMatchup] = useState<Matchup | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const r32 = useMemo(() => buildRoundOf32(groupWinners, thirdPlaceIds), [groupWinners, thirdPlaceIds]);
  const r32Winners = winnersFor(r32, picks);
  const r16 = useMemo(() => buildNextRound("r16", r32Winners), [r32Winners]);
  const r16Winners = winnersFor(r16, picks);
  const qf = useMemo(() => buildNextRound("qf", r16Winners), [r16Winners]);
  const qfWinners = winnersFor(qf, picks);
  const sf = useMemo(() => buildNextRound("sf", qfWinners), [qfWinners]);
  const sfWinners = winnersFor(sf, picks);
  const final = useMemo(() => buildNextRound("final", sfWinners), [sfWinners]);
  const finalWinner = winnersFor(final, picks)[0];

  const matchupsByStage = {
    r32,
    r16,
    qf,
    sf,
    final,
  };

  const resetBracket = () => {
    setGroupWinners(defaultGroupWinners);
    setThirdPlaceIds(defaultThirdPlaceIds);
    setPicks({});
    setInspectedMatchup(null);
    setActiveStage("groups");
  };

  const shareBracket = async () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1800);
  };

  const pickGroupRank = (groupId: string, teamId: string, rank: 0 | 1) => {
    setGroupWinners((current) => {
      const ids = current[groupId] ?? [];
      const next = [...ids.filter((id) => id !== teamId)];
      next[rank] = ids[rank] === teamId ? "" : teamId;
      const compacted = next.filter(Boolean).slice(0, 2);
      return { ...current, [groupId]: compacted };
    });
    setPicks({});
  };

  const pickThirdPlace = (teamId: string) => {
    setThirdPlaceIds((current) => {
      if (current.includes(teamId)) return current.filter((id) => id !== teamId);
      return current.length < 8 ? [...current, teamId] : [...current.slice(1), teamId];
    });
    setPicks({});
  };

  const pickWinner = (matchup: Matchup, team: Team) => {
    setPicks((current) => {
      const next = { ...current, [matchup.id]: team.id };
      const downstream = downstreamStages(matchup.stage);
      Object.keys(next).forEach((key) => {
        if (downstream.some((stage) => key.startsWith(`${stage}-`))) delete next[key];
      });
      return next;
    });
  };

  const currentMatchups = activeStage === "groups" ? [] : matchupsByStage[activeStage];

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070A] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgb(247_215_116_/_0.22),transparent_24rem),radial-gradient(circle_at_80%_20%,rgb(37_99_235_/_0.22),transparent_28rem),radial-gradient(circle_at_50%_100%,rgb(34_197_94_/_0.13),transparent_30rem)]" />
      <section className="relative mx-auto max-w-7xl px-4 py-5 md:px-8 md:py-8">
        <nav className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full border border-[#F7D774]/35 bg-[#F7D774]/12 shadow-[0_0_32px_rgb(247_215_116_/_0.2)]">
              <Trophy className="h-5 w-5 text-[#F7D774]" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight">GoalPool</div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-white/40">2026 Global Soccer Bracket</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetBracket}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/[0.1] hover:text-white"
              aria-label="Reset bracket"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={shareBracket}
              className="hidden rounded-full bg-white px-5 py-3 text-sm font-black text-[#05070A] shadow-[0_0_32px_rgb(255_255_255_/_0.18)] md:inline-flex"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {shareCopied ? "Copied" : "Share bracket"}
            </button>
          </div>
        </nav>

        <div className="mb-7 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-[#F7D774]/25 bg-[#F7D774]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              48 teams, one champion piece
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-tight md:text-7xl">
              Build the bracket like a soccer ball puzzle.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/58 md:text-lg">
              Choose group qualifiers, generate the Round of 32, then tap connected team pieces until the champion lands in the center.
            </p>
          </div>
          <StageTabs activeStage={activeStage} onStageChange={setActiveStage} />
        </div>

        {activeStage === "groups" ? (
          <GroupSelector
            groupWinners={groupWinners}
            thirdPlaceIds={thirdPlaceIds}
            onGroupRankPick={pickGroupRank}
            onThirdPick={pickThirdPlace}
            onGenerate={() => setActiveStage("r32")}
          />
        ) : (
          <PuzzleBracketBall
            stage={activeStage}
            matchups={currentMatchups}
            picks={picks}
            champion={finalWinner}
            onPick={pickWinner}
            onInspect={setInspectedMatchup}
          />
        )}
      </section>

      <AnimatePresence>
        {inspectedMatchup ? (
          <MatchupPanel matchup={inspectedMatchup} winnerId={picks[inspectedMatchup.id]} onPick={pickWinner} onClose={() => setInspectedMatchup(null)} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function winnersFor(matchups: Matchup[], picks: PickMap) {
  return matchups
    .map((matchup) => {
      const pickedId = picks[matchup.id];
      return pickedId === matchup.teamA?.id ? matchup.teamA : pickedId === matchup.teamB?.id ? matchup.teamB : undefined;
    })
    .filter(Boolean) as Team[];
}

function downstreamStages(stage: Exclude<StageKey, "groups">) {
  const order: Array<Exclude<StageKey, "groups">> = ["r32", "r16", "qf", "sf", "final"];
  return order.slice(order.indexOf(stage) + 1);
}

function MatchupPanel({
  matchup,
  winnerId,
  onPick,
  onClose,
}: {
  matchup: Matchup;
  winnerId?: string;
  onPick: (matchup: Matchup, team: Team) => void;
  onClose: () => void;
}) {
  const teams = [matchup.teamA, matchup.teamB].filter(Boolean) as Team[];

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="ml-auto h-full w-full max-w-md border-l border-white/10 bg-[#0B1018] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} aria-label="Close matchup details" className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/70">
          <X className="h-4 w-4" />
        </button>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">{stageLabels[matchup.stage]}</p>
        <h2 className="mt-2 text-3xl font-black text-white">Match {matchup.position + 1}</h2>
        <div className="mt-6 space-y-3">
          {teams.map((team) => (
            <button
              key={team.id}
              type="button"
              onClick={() => onPick(matchup, team)}
              className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-left transition hover:border-[#F7D774]/45"
            >
              <span className="flex items-center gap-3">
                <span className="text-4xl">{team.flag}</span>
                <span>
                  <span className="block text-xl font-black text-white">{team.name}</span>
                  <span className="text-xs font-black uppercase tracking-wide text-white/40">Group {team.group}</span>
                </span>
              </span>
              {winnerId === team.id ? <span className="rounded-full bg-[#F7D774] px-3 py-1 text-xs font-black text-[#05070A]">Picked</span> : null}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}
