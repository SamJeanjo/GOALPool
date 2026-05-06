"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Medal } from "lucide-react";
import { groups, type Group, type Team } from "@/data/worldCup2026";
import { cn } from "@/lib/utils";

const groupPositions = [
  "left-[8%] top-[9%]",
  "left-[37%] top-[4%]",
  "right-[8%] top-[9%]",
  "left-[3%] top-[32%]",
  "left-[37%] top-[27%]",
  "right-[3%] top-[32%]",
  "left-[3%] bottom-[32%]",
  "left-[37%] bottom-[27%]",
  "right-[3%] bottom-[32%]",
  "left-[8%] bottom-[9%]",
  "left-[37%] bottom-[4%]",
  "right-[8%] bottom-[9%]",
];

export function GroupSelector({
  groupWinners,
  thirdPlaceIds,
  onGroupRankPick,
  onThirdPick,
  onGenerate,
}: {
  groupWinners: Record<string, string[]>;
  thirdPlaceIds: string[];
  onGroupRankPick: (groupId: string, teamId: string, rank: 0 | 1) => void;
  onThirdPick: (teamId: string) => void;
  onGenerate: () => void;
}) {
  const [activeGroupId, setActiveGroupId] = useState("A");
  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? groups[0];
  const selectedCount = Object.values(groupWinners).reduce((total, ids) => total + ids.length, 0);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_370px]">
      <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#080B12] p-4 shadow-[0_30px_120px_rgb(0_0_0_/_0.45)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgb(255_255_255_/_0.13),transparent_34%),radial-gradient(circle_at_20%_15%,rgb(247_215_116_/_0.16),transparent_22%),radial-gradient(circle_at_78%_76%,rgb(34_197_94_/_0.16),transparent_26%)]" />
        <div className="relative mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">Group stage ball</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-white md:text-5xl">48 team pieces</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/55">
            Tap a group pod to set 1st, 2nd, and the third-place candidate. The qualified pieces feed the knockout ball.
          </p>
        </div>

        <div className="relative mx-auto min-h-[720px] overflow-x-auto scrollbar-none lg:min-h-[840px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="puzzle-ball relative mx-auto aspect-square min-w-[760px] max-w-[860px] rounded-full border border-white/15 p-7"
          >
            <div className="absolute left-1/2 top-1/2 z-20 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#F7D774]/45 bg-[#05070A]/90 text-center shadow-[0_0_70px_rgb(247_215_116_/_0.28)] backdrop-blur">
              <div className="px-4">
                <Medal className="mx-auto mb-2 h-6 w-6 text-[#F7D774]" />
                <div className="text-3xl font-black text-white">{selectedCount}</div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-wide text-white/40">direct picks</div>
                <div className="mt-2 rounded-full bg-[#F7D774]/15 px-3 py-1 text-[10px] font-black text-[#F7D774]">
                  {thirdPlaceIds.length}/8 thirds
                </div>
              </div>
            </div>

            {groups.map((group, index) => (
              <GroupPod
                key={group.id}
                group={group}
                className={groupPositions[index]}
                active={activeGroup.id === group.id}
                winnerIds={groupWinners[group.id] ?? []}
                thirdPlaceIds={thirdPlaceIds}
                onOpen={() => setActiveGroupId(group.id)}
              />
            ))}
          </motion.div>
        </div>
      </div>

      <aside className="h-fit rounded-[32px] border border-[#F7D774]/20 bg-[#0E141D]/95 p-5 shadow-[0_0_80px_rgb(247_215_116_/_0.12)] lg:sticky lg:top-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">Advance rules</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">24 direct + 8 thirds</h2>
        <p className="mt-3 text-sm leading-6 text-white/55">
          The group ball is playable from the first round. Pick top two from each group, then the eight best third-place teams.
        </p>

        <button
          type="button"
          onClick={onGenerate}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-[#F7D774] to-white px-5 py-4 text-sm font-black uppercase tracking-wide text-[#080B12] shadow-[0_0_40px_rgb(247_215_116_/_0.28)] transition hover:scale-[1.01] active:scale-[0.99]"
        >
          Generate Round of 32
        </button>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-black text-white">Open group</span>
            <span className="text-xs font-black text-[#F7D774]">Group {activeGroup.id}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroupId(group.id)}
                className={cn(
                  "rounded-2xl border px-2 py-3 text-sm font-black transition",
                  activeGroup.id === group.id
                    ? "border-[#F7D774]/55 bg-[#F7D774]/16 text-[#F7D774]"
                    : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.08]",
                )}
              >
                {group.id}
              </button>
            ))}
          </div>
        </div>

        <GroupDetail
          group={activeGroup}
          winnerIds={groupWinners[activeGroup.id] ?? []}
          thirdPlaceIds={thirdPlaceIds}
          onRankPick={(teamId, rank) => onGroupRankPick(activeGroup.id, teamId, rank)}
          onThirdPick={onThirdPick}
        />

        <p className="mt-4 text-center text-xs font-bold text-white/35">
          {selectedCount}/24 direct qualifiers selected. Defaults start ready so users can play instantly.
        </p>
      </aside>

      <div className="fixed inset-x-3 bottom-3 z-40 rounded-[28px] border border-[#F7D774]/25 bg-[#0E141D]/95 p-3 shadow-[0_0_70px_rgb(0_0_0_/_0.7)] backdrop-blur-xl lg:hidden">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wide text-white/55">Groups ready</span>
          <span className="text-xs font-black text-[#F7D774]">{selectedCount}/24 + {thirdPlaceIds.length}/8</span>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          className="w-full rounded-full bg-gradient-to-r from-[#F7D774] to-white px-5 py-4 text-sm font-black uppercase tracking-wide text-[#080B12] shadow-[0_0_40px_rgb(247_215_116_/_0.28)]"
        >
          Generate Round of 32
        </button>
      </div>
    </section>
  );
}

function GroupPod({
  group,
  className,
  active,
  winnerIds,
  thirdPlaceIds,
  onOpen,
}: {
  group: Group;
  className: string;
  active: boolean;
  winnerIds: string[];
  thirdPlaceIds: string[];
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "absolute z-10 w-[190px] rounded-[28px] border p-3 text-left backdrop-blur transition",
        "bg-white/[0.08] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16),0_18px_50px_rgb(0_0_0_/_0.28)]",
        active ? "border-[#F7D774]/70 shadow-[0_0_38px_rgb(247_215_116_/_0.18)]" : "border-white/12 hover:border-white/25",
        className,
      )}
      style={{
        clipPath: "polygon(7% 0, 93% 0, 100% 22%, 92% 100%, 8% 100%, 0 22%)",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F7D774]">Group {group.id}</span>
        <ChevronRight className="h-4 w-4 text-white/40" />
      </div>
      <div className="space-y-1.5">
        {group.teams.map((team) => {
          const rank = winnerIds.indexOf(team.id);
          const third = thirdPlaceIds.includes(team.id);
          return (
            <div
              key={team.id}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-2 py-1.5",
                rank >= 0
                  ? "border-[#F7D774]/45 bg-[#F7D774]/14 text-white"
                  : third
                    ? "border-sky-300/30 bg-sky-400/10 text-white/75"
                    : "border-white/8 bg-black/10 text-white/52",
              )}
            >
              <span className="text-lg">{team.flag}</span>
              <span className="min-w-0 flex-1 truncate text-xs font-black">{team.name}</span>
              {rank >= 0 ? <span className="text-[10px] font-black text-[#F7D774]">{rank + 1}</span> : null}
            </div>
          );
        })}
      </div>
    </motion.button>
  );
}

function GroupDetail({
  group,
  winnerIds,
  thirdPlaceIds,
  onRankPick,
  onThirdPick,
}: {
  group: Group;
  winnerIds: string[];
  thirdPlaceIds: string[];
  onRankPick: (teamId: string, rank: 0 | 1) => void;
  onThirdPick: (teamId: string) => void;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={group.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F7D774]">Group {group.id}</p>
            <h3 className="text-xl font-black text-white">Set advancing pieces</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/45">
            {winnerIds.length}/2
          </span>
        </div>

        <div className="space-y-2">
          {group.teams.map((team) => (
            <GroupTeamRow
              key={team.id}
              team={team}
              first={winnerIds[0] === team.id}
              second={winnerIds[1] === team.id}
              third={thirdPlaceIds.includes(team.id)}
              onFirst={() => onRankPick(team.id, 0)}
              onSecond={() => onRankPick(team.id, 1)}
              onThird={() => onThirdPick(team.id)}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function GroupTeamRow({
  team,
  first,
  second,
  third,
  onFirst,
  onSecond,
  onThird,
}: {
  team: Team;
  first: boolean;
  second: boolean;
  third: boolean;
  onFirst: () => void;
  onSecond: () => void;
  onThird: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 text-xl">
          {team.flag}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-black text-white">{team.name}</div>
          <div className="text-[10px] font-black uppercase tracking-wide text-white/35">{team.confederation}</div>
        </div>
        {first || second ? <CheckCircle2 className="h-5 w-5 text-[#F7D774]" /> : null}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <MiniPickButton active={first} onClick={onFirst}>
          1st
        </MiniPickButton>
        <MiniPickButton active={second} onClick={onSecond}>
          2nd
        </MiniPickButton>
        <MiniPickButton active={third} onClick={onThird}>
          3rd
        </MiniPickButton>
      </div>
    </div>
  );
}

function MiniPickButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-2 py-2 text-xs font-black uppercase tracking-wide transition",
        active
          ? "border-[#F7D774]/60 bg-[#F7D774] text-[#05070A]"
          : "border-white/10 bg-black/10 text-white/45 hover:bg-white/[0.08] hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
