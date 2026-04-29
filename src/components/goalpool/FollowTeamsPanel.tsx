"use client";

import { useMemo, useState } from "react";
import { Bell, Plus } from "lucide-react";
import { getTeam, scheduledMatches, teams } from "@/lib/tournament-data";

function teamLabel(teamId?: string, fallback?: string) {
  const team = getTeam(teamId);
  return team ? `${team.flagEmoji} ${team.name}` : fallback ?? "TBD";
}

export function FollowTeamsPanel() {
  const [followed, setFollowed] = useState<string[]>(["usa", "mex", "can"]);

  const followedMatches = useMemo(
    () =>
      scheduledMatches
        .filter((match) => followed.some((teamId) => match.teamAId === teamId || match.teamBId === teamId))
        .slice(0, 5),
    [followed],
  );

  const addTeam = (teamId: string) => {
    setFollowed((current) => (current.includes(teamId) ? current : [...current, teamId]));
  };

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#07111F]/75 p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#D4AF37]">
            <Bell className="h-4 w-4" />
            Follow teams
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Next match and score hub.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Fans pick teams they follow, then GoalPool keeps the next fixture and score status close to the bracket.
          </p>
        </div>
        <select
          onChange={(event) => addTeam(event.target.value)}
          className="h-11 rounded-full border border-white/10 bg-black/30 px-4 text-sm font-semibold text-slate-200 outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            Add team
          </option>
          {teams
            .filter((team) => !team.name.startsWith("Qualifier"))
            .map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {followed.map((teamId) => {
          const team = getTeam(teamId);
          if (!team) return null;
          return (
            <button
              key={team.id}
              onClick={() => setFollowed((current) => current.filter((id) => id !== team.id))}
              className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-2 text-xs font-bold text-[#F8E7A4]"
            >
              {team.flagEmoji} {team.name}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {followedMatches.length ? (
          followedMatches.map((match) => (
            <article key={match.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">Match {match.id} / {match.stage}</div>
                <span className="rounded-full bg-[#D4AF37]/10 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#F8E7A4]">
                  {match.status}
                </span>
              </div>
              <div className="mt-4 text-lg font-semibold text-white">
                {teamLabel(match.teamAId, match.teamALabel)} vs {teamLabel(match.teamBId, match.teamBLabel)}
              </div>
              <div className="mt-2 text-sm text-slate-500">
                {match.date} / {match.localTime} / {match.city}
              </div>
              <div className="mt-3 text-xs font-semibold text-slate-600">Source: {match.source}</div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-slate-500">
            <Plus className="mb-3 h-5 w-5 text-[#D4AF37]" />
            Add a team to see next matches here.
          </div>
        )}
      </div>
    </section>
  );
}
