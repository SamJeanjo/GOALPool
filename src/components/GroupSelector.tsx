"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { defaultThirdPlaceIds, groups, type Team } from "@/data/worldCup2026";
import { cn } from "@/lib/utils";

export function GroupSelector({
  groupWinners,
  thirdPlaceIds,
  onGroupPick,
  onThirdPick,
  onGenerate,
}: {
  groupWinners: Record<string, string[]>;
  thirdPlaceIds: string[];
  onGroupPick: (groupId: string, teamId: string) => void;
  onThirdPick: (teamId: string) => void;
  onGenerate: () => void;
}) {
  const selectedCount = Object.values(groupWinners).reduce((total, ids) => total + ids.length, 0);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <aside className="h-fit rounded-[32px] border border-[#F7D774]/20 bg-[#0E141D]/95 p-5 shadow-[0_0_80px_rgb(247_215_116_/_0.12)] lg:sticky lg:top-6 lg:order-last">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">Advance rules</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">24 direct + 8 thirds</h2>
        <p className="mt-3 text-sm leading-6 text-white/55">
          Choose the top two from every group. Then select the eight strongest third-place teams to generate the Round of 32 ball.
        </p>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-black text-white">Best third-place teams</span>
            <span className="text-xs font-black text-[#F7D774]">{thirdPlaceIds.length}/8</span>
          </div>
          <div className="grid gap-2">
            {groups.map((group) => {
              const third = group.teams.find((team) => !(groupWinners[group.id] ?? []).includes(team.id)) ?? group.teams[2];
              return (
                <TeamSelectRow
                  key={group.id}
                  team={third}
                  selected={thirdPlaceIds.includes(third.id)}
                  compact
                  onClick={() => onThirdPick(third.id)}
                />
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-[#F7D774] to-white px-5 py-4 text-sm font-black uppercase tracking-wide text-[#080B12] shadow-[0_0_40px_rgb(247_215_116_/_0.28)] transition hover:scale-[1.01] active:scale-[0.99]"
        >
          Generate Round of 32
        </button>
        <p className="mt-3 text-center text-xs font-bold text-white/35">
          {selectedCount}/24 direct qualifiers selected. Default third-place picks start with groups {defaultThirdPlaceIds.length ? "A-H" : ""}.
        </p>
      </aside>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <motion.article
            key={group.id}
            layout
            className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F7D774]">Group {group.id}</p>
                <h3 className="text-xl font-black text-white">Pick top 2</h3>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/50">
                {(groupWinners[group.id] ?? []).length}/2
              </span>
            </div>
            <div className="space-y-2">
              {group.teams.map((team) => (
                <TeamSelectRow
                  key={team.id}
                  team={team}
                  selected={(groupWinners[group.id] ?? []).includes(team.id)}
                  onClick={() => onGroupPick(group.id, team.id)}
                />
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function TeamSelectRow({
  team,
  selected,
  compact,
  onClick,
}: {
  team: Team;
  selected: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl border px-3 text-left transition",
        compact ? "py-2" : "py-3",
        selected
          ? "border-[#F7D774]/55 bg-[#F7D774]/14 text-white shadow-[0_0_24px_rgb(247_215_116_/_0.14)]"
          : "border-white/10 bg-white/[0.04] text-white/72 hover:border-white/20 hover:bg-white/[0.07]",
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 text-lg">
          {team.flag}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-black">{team.name}</span>
          <span className="block text-[10px] font-black uppercase tracking-wide text-white/35">{team.confederation}</span>
        </span>
      </span>
      {selected ? <CheckCircle2 className="h-5 w-5 shrink-0 text-[#F7D774]" /> : null}
    </button>
  );
}
