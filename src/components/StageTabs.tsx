"use client";

import { motion } from "framer-motion";
import { stageLabels, type StageKey } from "@/data/worldCup2026";
import { cn } from "@/lib/utils";

const stages: StageKey[] = ["groups", "r32", "r16", "qf", "sf", "final"];

export function StageTabs({
  activeStage,
  onStageChange,
}: {
  activeStage: StageKey;
  onStageChange: (stage: StageKey) => void;
}) {
  return (
    <div className="sticky top-0 z-30 -mx-4 border-b border-white/10 bg-[#080B12]/85 px-4 py-3 backdrop-blur-xl md:static md:mx-0 md:rounded-full md:border md:px-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {stages.map((stage) => {
          const active = activeStage === stage;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => onStageChange(stage)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2.5 text-sm font-black uppercase tracking-wide transition",
                active ? "text-[#080B12]" : "text-white/65 hover:text-white",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="stage-tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F7D774] to-white shadow-[0_0_30px_rgb(247_215_116_/_0.35)]"
                />
              ) : null}
              <span className="relative">{stageLabels[stage]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
