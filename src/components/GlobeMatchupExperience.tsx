"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Globe2, RotateCcw, Share2, Trophy } from "lucide-react";
import {
  groups,
  stageLabels,
  toGlobeMatchups,
  type GlobeMatchup,
  type Matchup,
  type StageKey,
  type Team,
} from "@/data/worldCup2026";
import { StageTabs } from "./StageTabs";
import { cn } from "@/lib/utils";

type PickMap = Record<string, string>;
type GroupSelection = Record<string, { first?: string; second?: string; third?: string }>;

type StandingRow = {
  team: Team;
  points: number;
  played: number;
  wins: number;
  originalIndex: number;
};

type RankKey = "first" | "second" | "third";

export function GlobeMatchupExperience() {
  const [activeStage, setActiveStage] = useState<StageKey>("groups");
  const [matchIndexByStage, setMatchIndexByStage] = useState<Record<StageKey, number>>({
    groups: 0,
    r32: 0,
    r16: 0,
    qf: 0,
    sf: 0,
    final: 0,
  });
  const [groupSelections, setGroupSelections] = useState<GroupSelection>({});
  const [knockoutPicks, setKnockoutPicks] = useState<PickMap>({});
  const [copied, setCopied] = useState(false);

  const standings = useMemo(() => calculateStandings(groupSelections), [groupSelections]);
  const r32 = useMemo(() => buildRoundOf32FromStandings(standings), [standings]);
  const r32Winners = winnersFor(r32, knockoutPicks);
  const r16 = useMemo(() => buildNextRound("r16", r32Winners), [r32Winners]);
  const r16Winners = winnersFor(r16, knockoutPicks);
  const qf = useMemo(() => buildNextRound("qf", r16Winners), [r16Winners]);
  const qfWinners = winnersFor(qf, knockoutPicks);
  const sf = useMemo(() => buildNextRound("sf", qfWinners), [qfWinners]);
  const sfWinners = winnersFor(sf, knockoutPicks);
  const final = useMemo(() => buildNextRound("final", sfWinners), [sfWinners]);
  const champion = winnersFor(final, knockoutPicks)[0];

  const matchupsByStage: Record<Exclude<StageKey, "groups">, GlobeMatchup[]> = {
    r32: toGlobeMatchups("r32", r32),
    r16: toGlobeMatchups("r16", r16),
    qf: toGlobeMatchups("qf", qf),
    sf: toGlobeMatchups("sf", sf),
    final: toGlobeMatchups("final", final),
  };

  const currentMatchups = activeStage === "groups" ? [] : matchupsByStage[activeStage];
  const activeIndex = Math.min(matchIndexByStage[activeStage], Math.max((activeStage === "groups" ? groups.length : currentMatchups.length) - 1, 0));
  const currentMatchup = activeStage === "groups" ? undefined : currentMatchups[activeIndex];
  const selectedWinnerId = currentMatchup ? knockoutPicks[currentMatchup.id] : undefined;
  const completedGroups = groups.filter((group) => {
    const selection = groupSelections[group.id];
    return Boolean(selection?.first && selection.second);
  }).length;
  const completedCount = activeStage === "groups" ? completedGroups : currentMatchups.filter((matchup) => Boolean(knockoutPicks[matchup.id])).length;
  const totalCount = activeStage === "groups" ? groups.length : currentMatchups.length;
  const setStageIndex = (stage: StageKey, nextIndex: number) => {
    const length = stage === "groups" ? groups.length : matchupsByStage[stage].length;
    setMatchIndexByStage((current) => ({
      ...current,
      [stage]: Math.max(0, Math.min(nextIndex, Math.max(length - 1, 0))),
    }));
  };

  const pickWinner = (matchup: GlobeMatchup, team: Team) => {
    setKnockoutPicks((current) => {
      const next = { ...current, [matchup.id]: team.id };
      downstreamStages(matchup.stage).forEach((stage) => {
        Object.keys(next).forEach((key) => {
          if (key.startsWith(`${stage}-`)) delete next[key];
        });
      });
      return next;
    });

    window.setTimeout(() => {
      setStageIndex(matchup.stage, activeIndex + 1);
    }, 220);
  };

  const reset = () => {
    setGroupSelections({});
    setKnockoutPicks({});
    setMatchIndexByStage({ groups: 0, r32: 0, r16: 0, qf: 0, sf: 0, final: 0 });
    setActiveStage("groups");
  };

  const share = async () => {
    if (navigator.clipboard) await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#06101C] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgb(255_255_255_/_0.13),transparent_24rem),radial-gradient(circle_at_24%_48%,rgb(34_197_94_/_0.16),transparent_26rem),radial-gradient(circle_at_82%_68%,rgb(37_99_235_/_0.22),transparent_30rem),radial-gradient(circle_at_50%_95%,rgb(250_204_21_/_0.1),transparent_28rem)]" />
      <section className="relative mx-auto max-w-7xl px-4 py-5 md:px-8 md:py-8">
        <nav className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/10 shadow-[0_0_32px_rgb(255_255_255_/_0.12)]">
              <Globe2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight">GoalPool</div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-white/40">2026 Global Soccer Bracket</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={reset} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/[0.1] hover:text-white" aria-label="Reset bracket">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button type="button" onClick={share} className="hidden rounded-full bg-white px-5 py-3 text-sm font-black text-[#05070A] shadow-[0_0_32px_rgb(255_255_255_/_0.18)] md:inline-flex">
              <Share2 className="mr-2 h-4 w-4" />
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </nav>

        <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
              The globe is the matchup engine
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-tight md:text-6xl">
              2026 Global Soccer Bracket
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/58 md:text-lg">
              Set each group on a cinematic world globe. Top two plus the best third-place teams feed the knockout path.
            </p>
          </div>
          <StageTabs activeStage={activeStage} onStageChange={setActiveStage} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="rounded-[36px] border border-white/10 bg-[#080A0E] p-4 shadow-[0_30px_120px_rgb(0_0_0_/_0.48)] md:p-6">
            {activeStage === "groups" ? (
              <GroupGlobeCard
                group={groups[activeIndex]}
                selection={groupSelections[groups[activeIndex].id] ?? {}}
                index={activeIndex}
                total={groups.length}
                onRankPick={(team, rank) => {
                  setGroupSelections((current) => ({
                    ...current,
                    [groups[activeIndex].id]: applyGroupRank(current[groups[activeIndex].id] ?? {}, team.id, rank),
                  }));
                  setKnockoutPicks({});
                }}
                onPrevious={() => setStageIndex("groups", activeIndex - 1)}
                onNext={() => setStageIndex("groups", activeIndex + 1)}
              />
            ) : currentMatchup ? (
              <GlobeMatchupCard
                matchup={currentMatchup}
                winnerId={selectedWinnerId}
                stage={activeStage}
                index={activeIndex}
                total={currentMatchups.length}
                onPick={pickWinner}
                onPrevious={() => setStageIndex(activeStage, activeIndex - 1)}
                onNext={() => setStageIndex(activeStage, activeIndex + 1)}
              />
            ) : (
              <div className="grid min-h-[660px] place-items-center text-center">
                <div>
                  <Trophy className="mx-auto mb-4 h-10 w-10 text-white/35" />
                  <h2 className="text-3xl font-black">Complete the previous round</h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/50">This stage unlocks as winners advance from the current path.</p>
                </div>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-[32px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur lg:sticky lg:top-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">{stageLabels[activeStage]}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              {completedCount}/{totalCount} picked
            </h2>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-yellow-300" style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }} />
            </div>

            {champion ? (
              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs font-black uppercase tracking-wide text-white/40">Champion pick</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-4xl">{champion.flag}</span>
                  <div>
                    <div className="text-xl font-black">{champion.name}</div>
                    <div className="text-xs font-black uppercase tracking-wide text-white/35">{champion.countryCode}</div>
                  </div>
                </div>
              </div>
            ) : null}

            <StandingsPanel standings={standings} />
          </aside>
        </div>
      </section>
    </main>
  );
}

function GlobeMatchupCard({
  matchup,
  winnerId,
  stage,
  index,
  total,
  onPick,
  onPrevious,
  onNext,
}: {
  matchup: GlobeMatchup;
  winnerId?: string;
  stage: StageKey;
  index: number;
  total: number;
  onPick: (matchup: GlobeMatchup, team: Team) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div key={matchup.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative min-h-[660px] overflow-hidden rounded-[30px] bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgb(255_255_255_/_0.16),transparent_30rem),linear-gradient(180deg,transparent,rgb(0_0_0_/_0.62))]" />
      <GlobeVisual teamA={matchup.teamA} teamB={matchup.teamB} />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">{stageLabels[stage]}</p>
          <h2 className="mt-1 text-xl font-black text-white">
            {matchup.group ? `Group ${matchup.group}` : `Match ${matchup.position + 1}`}
          </h2>
        </div>
        <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-black text-white/60">
          {index + 1}/{total}
        </span>
      </div>

      <div className="absolute inset-x-4 top-[39%] z-20 mx-auto grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
        <FlagPick team={matchup.teamA} selected={winnerId === matchup.teamA.id} dimmed={Boolean(winnerId && winnerId !== matchup.teamA.id)} onClick={() => onPick(matchup, matchup.teamA)} />
        <div className="rounded-2xl border border-white/20 bg-black/65 px-4 py-3 text-2xl font-black shadow-[0_0_30px_rgb(255_255_255_/_0.16)]">VS</div>
        <FlagPick team={matchup.teamB} selected={winnerId === matchup.teamB.id} dimmed={Boolean(winnerId && winnerId !== matchup.teamB.id)} onClick={() => onPick(matchup, matchup.teamB)} />
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
        <button type="button" onClick={onPrevious} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/55 text-white disabled:opacity-35" disabled={index === 0} aria-label="Previous matchup">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/55">
          Tap a flag to choose the winner
        </div>
        <button type="button" onClick={onNext} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/55 text-white disabled:opacity-35" disabled={index >= total - 1} aria-label="Next matchup">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

function FlagPick({ team, selected, dimmed, onClick }: { team: Team; selected: boolean; dimmed: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group rounded-2xl border bg-black/70 p-2 text-center shadow-2xl backdrop-blur transition",
        selected ? "border-emerald-300 shadow-[0_0_46px_rgb(34_197_94_/_0.38)]" : "border-white/15 hover:border-white/35",
        dimmed && "opacity-40 grayscale",
      )}
    >
      <div className="overflow-hidden rounded-xl border border-white/15 bg-white shadow-[inset_0_0_0_1px_rgb(0_0_0_/_0.08)]">
        <FlagImage team={team} className="aspect-[4/3] w-full object-cover" />
      </div>
      <div className="mt-2 text-2xl font-black tracking-tight text-white md:text-4xl">{team.countryCode}</div>
      <div className="text-xs font-black uppercase tracking-wide text-white/45 md:text-sm">{team.name}</div>
    </motion.button>
  );
}

function GroupGlobeCard({
  group,
  selection,
  index,
  total,
  onRankPick,
  onPrevious,
  onNext,
}: {
  group: { id: string; teams: Team[] };
  selection: { first?: string; second?: string; third?: string };
  index: number;
  total: number;
  onRankPick: (team: Team, rank: RankKey) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div key={group.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative min-h-[720px] overflow-hidden rounded-[30px] bg-[#020407]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgb(255_255_255_/_0.12),transparent_30rem),linear-gradient(180deg,transparent,rgb(0_0_0_/_0.66))]" />
      <AtmosphericGlobe />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">Group Stage</p>
          <h2 className="mt-1 text-2xl font-black text-white">Group {group.id}</h2>
        </div>
        <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-black text-white/60">
          {index + 1}/{total}
        </span>
      </div>

      <div className="absolute bottom-20 left-4 right-4 z-20 grid gap-3 md:grid-cols-4">
        {group.teams.map((team) => (
          <GroupRankCard
            key={team.id}
            team={team}
            rank={rankForTeam(selection, team.id)}
            onRankPick={onRankPick}
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
        <button type="button" onClick={onPrevious} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/55 text-white disabled:opacity-35" disabled={index === 0} aria-label="Previous group">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/55">
          Select 1st, 2nd, and optional 3rd
        </div>
        <button type="button" onClick={onNext} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/55 text-white disabled:opacity-35" disabled={index >= total - 1} aria-label="Next group">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

function AtmosphericGlobe() {
  return (
    <div className="absolute left-1/2 top-[42%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-[#050505] shadow-[inset_-80px_-70px_120px_rgb(0_0_0_/_0.9),inset_42px_30px_90px_rgb(255_255_255_/_0.22),0_0_120px_rgb(34_197_94_/_0.08),0_0_160px_rgb(37_99_235_/_0.12)]">
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          className="atmospheric-globe-texture absolute -inset-[8%] rounded-full"
        />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_18%,rgb(255_255_255_/_0.34),transparent_14%),radial-gradient(circle_at_60%_44%,rgb(255_255_255_/_0.08),transparent_28%),linear-gradient(90deg,rgb(255_255_255_/_0.08),transparent_32%,transparent_70%,rgb(255_255_255_/_0.12))]" />
        <div className="absolute inset-[8%] rounded-full border border-white/6" />
        <div className="absolute left-[16%] top-[18%] h-28 w-44 rotate-[-18deg] rounded-full bg-white/10 blur-2xl" />
      </div>
      <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgb(255_255_255_/_0.08),transparent_66%)] blur-xl" />
    </div>
  );
}

function GroupRankCard({ team, rank, onRankPick }: { team: Team; rank?: RankKey; onRankPick: (team: Team, rank: RankKey) => void }) {
  return (
    <div className={cn("rounded-2xl border bg-black/62 p-3 backdrop-blur", rankClass(rank))}>
      <div className="flex items-center gap-2">
        <FlagImage team={team} className="h-8 w-11 rounded-md object-cover" />
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-white">{team.name}</div>
          <div className="text-[10px] font-black uppercase tracking-wide text-white/40">{team.countryCode}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <RankButton active={rank === "first"} label="1st" onClick={() => onRankPick(team, "first")} />
        <RankButton active={rank === "second"} label="2nd" onClick={() => onRankPick(team, "second")} />
        <RankButton active={rank === "third"} label="3rd" onClick={() => onRankPick(team, "third")} />
      </div>
    </div>
  );
}

function RankButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-2 py-2 text-xs font-black uppercase tracking-wide transition",
        active ? "border-white/40 bg-white text-[#06101C]" : "border-white/10 bg-white/[0.06] text-white/50 hover:bg-white/[0.12] hover:text-white",
      )}
    >
      {label}
    </button>
  );
}

function FlagImage({ team, className }: { team: Team; className?: string }) {
  return <Image src={team.flagUrl} alt={`${team.name} flag`} width={320} height={240} className={className} unoptimized priority />;
}

function GlobeVisual({ teamA, teamB }: { teamA: Team; teamB: Team }) {
  const pinA = project(teamA);
  const pinB = project(teamB);

  return (
    <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#050505] shadow-[inset_-70px_-65px_110px_rgb(0_0_0_/_0.9),inset_38px_28px_80px_rgb(255_255_255_/_0.2),0_0_100px_rgb(255_255_255_/_0.14)]">
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="globe-grid absolute inset-0 opacity-65" />
        <LandMass className="left-[5%] top-[4%] h-[34%] w-[24%] rotate-[-18deg]" />
        <LandMass className="left-[15%] top-[38%] h-[39%] w-[20%] rotate-[13deg]" />
        <LandMass className="left-[43%] top-[6%] h-[28%] w-[18%] rotate-[8deg]" />
        <LandMass className="left-[50%] top-[29%] h-[42%] w-[22%] rotate-[-10deg]" />
        <LandMass className="left-[69%] top-[18%] h-[28%] w-[23%] rotate-[15deg]" />
        <LandMass className="left-[72%] top-[55%] h-[24%] w-[18%] rotate-[-8deg]" />
        <Pin team={teamA} x={pinA.x} y={pinA.y} />
        <Pin team={teamB} x={pinB.x} y={pinB.y} />
      </div>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_18%,rgb(255_255_255_/_0.38),transparent_16%),linear-gradient(90deg,rgb(255_255_255_/_0.08),transparent_32%,transparent_70%,rgb(255_255_255_/_0.12))]" />
    </div>
  );
}

function LandMass({ className }: { className: string }) {
  return <div className={cn("absolute rounded-[45%_55%_42%_58%] bg-white shadow-[0_0_18px_rgb(255_255_255_/_0.2)]", className)} />;
}

function Pin({ team, x, y }: { team: Team; x: number; y: number }) {
  return (
    <div className="absolute z-20 -translate-x-1/2 -translate-y-full" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="relative grid h-10 w-10 place-items-center rounded-full bg-red-600 text-xs font-black text-white shadow-[0_0_22px_rgb(239_68_68_/_0.75)] after:absolute after:bottom-[-8px] after:h-5 after:w-5 after:rotate-45 after:rounded-br-full after:bg-red-600">
        <span className="relative z-10">{team.countryCode}</span>
      </div>
    </div>
  );
}

function StandingsPanel({ standings }: { standings: Record<string, StandingRow[]> }) {
  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-black">Live group leaders</span>
        <span className="text-xs font-black text-white/35">auto</span>
      </div>
      <div className="space-y-3">
        {groups.slice(0, 4).map((group) => (
          <div key={group.id} className="rounded-2xl bg-white/[0.04] p-3">
            <div className="mb-2 text-xs font-black uppercase tracking-wide text-emerald-200">Group {group.id}</div>
            {standings[group.id].slice(0, 3).map((row) => (
              <div key={row.team.id} className="flex items-center justify-between py-1 text-sm">
                <span className="font-bold text-white/75">{row.team.countryCode}</span>
                <span className="font-black text-white">{row.points}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateStandings(groupPicks: GroupSelection): Record<string, StandingRow[]> {
  return Object.fromEntries(
    groups.map((group) => {
      const rows = group.teams.map((team, originalIndex) => ({ team, points: 0, played: 0, wins: 0, originalIndex }));
      const selection = groupPicks[group.id] ?? {};

      rows.forEach((row) => {
        if (row.team.id === selection.first) {
          row.points = 7;
          row.wins = 2;
          row.played = 3;
        } else if (row.team.id === selection.second) {
          row.points = 5;
          row.wins = 1;
          row.played = 3;
        } else if (row.team.id === selection.third) {
          row.points = 3;
          row.played = 3;
        }
      });

      return [
        group.id,
        rows.sort((a, b) => b.points - a.points || b.wins - a.wins || a.originalIndex - b.originalIndex),
      ];
    }),
  );
}

function applyGroupRank(selection: { first?: string; second?: string; third?: string }, teamId: string, rank: RankKey) {
  const next = { ...selection };
  (["first", "second", "third"] as RankKey[]).forEach((key) => {
    if (next[key] === teamId) next[key] = undefined;
  });
  next[rank] = selection[rank] === teamId ? undefined : teamId;
  return next;
}

function rankForTeam(selection: { first?: string; second?: string; third?: string }, teamId: string): RankKey | undefined {
  if (selection.first === teamId) return "first";
  if (selection.second === teamId) return "second";
  if (selection.third === teamId) return "third";
  return undefined;
}

function rankClass(rank?: RankKey) {
  if (rank === "first") return "border-yellow-300/70 shadow-[0_0_28px_rgb(250_204_21_/_0.24)]";
  if (rank === "second") return "border-slate-100/70 shadow-[0_0_24px_rgb(226_232_240_/_0.18)]";
  if (rank === "third") return "border-amber-700/80 shadow-[0_0_24px_rgb(180_83_9_/_0.2)]";
  return "border-white/10";
}

function buildRoundOf32FromStandings(standings: Record<string, StandingRow[]>): Matchup[] {
  const directTeams = groups.flatMap((group) => standings[group.id].slice(0, 2).map((row) => row.team));
  const thirdTeams = groups
    .map((group) => standings[group.id][2])
    .sort((a, b) => b.points - a.points || b.wins - a.wins || a.originalIndex - b.originalIndex)
    .slice(0, 8)
    .map((row) => row.team);
  const field = [...directTeams, ...thirdTeams];
  const topHalf = field.slice(0, 16);
  const bottomHalf = field.slice(16, 32).reverse();

  return topHalf.map((team, index) => ({
    id: `r32-${index + 1}`,
    stage: "r32" as const,
    position: index,
    teamA: team,
    teamB: bottomHalf[index],
  }));
}

function buildNextRound(stage: Exclude<StageKey, "groups" | "r32">, winners: Team[]): Matchup[] {
  return Array.from({ length: Math.ceil(winners.length / 2) }, (_, index) => ({
    id: `${stage}-${index + 1}`,
    stage,
    position: index,
    teamA: winners[index * 2],
    teamB: winners[index * 2 + 1],
  }));
}

function winnersFor(matchups: Matchup[], picks: PickMap) {
  return matchups
    .map((matchup) => {
      const pickedId = picks[matchup.id];
      return pickedId === matchup.teamA?.id ? matchup.teamA : pickedId === matchup.teamB?.id ? matchup.teamB : undefined;
    })
    .filter(Boolean) as Team[];
}

function downstreamStages(stage: StageKey) {
  const order: StageKey[] = ["groups", "r32", "r16", "qf", "sf", "final"];
  return order.slice(order.indexOf(stage) + 1);
}

function project(team: Team) {
  return {
    x: Math.max(9, Math.min(91, ((team.lng + 180) / 360) * 100)),
    y: Math.max(9, Math.min(91, ((90 - team.lat) / 180) * 100)),
  };
}
