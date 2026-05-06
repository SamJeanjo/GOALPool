"use client";

import { motion } from "framer-motion";
import type { Team } from "@/data/worldCup2026";
import { cn } from "@/lib/utils";

export function PuzzlePiece({
  team,
  selected,
  dimmed,
  onPick,
}: {
  team?: Team;
  selected?: boolean;
  dimmed?: boolean;
  onPick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      disabled={!team}
      onClick={onPick}
      whileHover={team ? { y: -2 } : undefined}
      whileTap={team ? { scale: 0.97 } : undefined}
      className={cn(
        "group relative flex min-h-16 w-full items-center gap-2 overflow-visible px-3 py-2 text-left transition",
        "border border-white/15 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16)]",
        "before:absolute before:-right-3 before:top-1/2 before:h-6 before:w-6 before:-translate-y-1/2 before:rounded-full before:border before:border-white/15 before:bg-[#111720]",
        "after:absolute after:-left-2 after:top-1/2 after:h-5 after:w-5 after:-translate-y-1/2 after:rounded-full after:bg-[#080B12]",
        selected && "z-10 border-[#F7D774]/80 bg-[#F7D774]/18 shadow-[0_0_30px_rgb(247_215_116_/_0.3),inset_0_1px_0_rgb(255_255_255_/_0.22)]",
        dimmed && "opacity-35 grayscale",
        !team && "border-dashed text-white/40",
      )}
      style={{
        clipPath: "polygon(0 0, 86% 0, 100% 50%, 86% 100%, 0 100%, 7% 50%)",
      }}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-lg"
        style={{
          boxShadow: selected && team ? `0 0 22px ${team.colors.primary}66` : undefined,
        }}
      >
        {team?.flag ?? "?"}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-black leading-5">{team?.name ?? "Winner pending"}</span>
        <span className="block text-[10px] font-black uppercase tracking-wide text-white/45">
          {team ? `Group ${team.group} / ${team.confederation}` : "Pick previous round"}
        </span>
      </span>
    </motion.button>
  );
}
