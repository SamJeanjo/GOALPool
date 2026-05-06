"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Mail, MapPin, ShieldCheck } from "lucide-react";
import { teams } from "@/lib/tournament-data";

const suggestedTeams = teams.filter((team) => !team.name.startsWith("Qualifier")).slice(0, 18);

export function AccountStart() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<string[]>(["usa"]);

  const favorites = useMemo(
    () => favoriteTeamIds.map((id) => teams.find((team) => team.id === id)).filter(Boolean),
    [favoriteTeamIds],
  );
  const primaryTeam = favorites[0];
  const primary = primaryTeam?.colors.primary ?? "#2563EB";
  const secondary = primaryTeam?.colors.secondary ?? "#22C55E";

  const toggleTeam = (teamId: string) => {
    setFavoriteTeamIds((current) => {
      if (current.includes(teamId)) return current.filter((id) => id !== teamId);
      return [...current, teamId].slice(-3);
    });
  };

  const bracketHref = `/bracket?teams=${favoriteTeamIds.join(",")}&email=${encodeURIComponent(email)}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;

  return (
    <section
      className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 md:p-6"
      style={{ boxShadow: `0 28px 90px ${primary}22` }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 18% 8%, ${primary}, transparent 26rem), radial-gradient(circle at 88% 22%, ${secondary}, transparent 24rem)`,
        }}
      />
      <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[26px] bg-slate-950 p-5 text-white md:p-7" style={{ background: `linear-gradient(145deg, ${primary}, #0F172A 58%, ${secondary})` }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 text-xs font-bold uppercase tracking-wide">
            <ShieldCheck className="h-4 w-4" />
            Create account
          </div>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Pick your teams. Build your bracket.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-white/82">
            GoalPool should feel personal before it feels competitive. Your team colors set the tone, then you go straight to predictions.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {favorites.map((team) =>
              team ? (
                <div key={team.id} className="rounded-2xl bg-white/14 p-3 ring-1 ring-white/20">
                  <div className="text-3xl">{team.flagEmoji}</div>
                  <div className="mt-2 text-sm font-black">{team.name}</div>
                </div>
              ) : null,
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              Email
              <div className="mt-2 flex min-h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
              </div>
            </label>
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              City / country
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" className="w-full bg-transparent text-sm font-semibold outline-none" />
                </div>
                <input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country" className="min-h-12 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none" />
              </div>
            </label>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Favorite teams</p>
                <p className="mt-1 text-sm text-slate-500">Choose up to 3. Your bracket adopts the first team’s colors.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{favoriteTeamIds.length}/3</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {suggestedTeams.map((team) => {
                const active = favoriteTeamIds.includes(team.id);
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => toggleTeam(team.id)}
                    className="min-h-14 rounded-2xl border p-3 text-left text-sm font-black transition active:scale-[0.98]"
                    style={{
                      borderColor: active ? team.colors.primary : "#E2E8F0",
                      background: active ? `${team.colors.primary}14` : "#FFFFFF",
                      color: active ? "#0F172A" : "#334155",
                    }}
                  >
                    <span className="mr-2 text-lg">{team.flagEmoji}</span>
                    {team.name}
                  </button>
                );
              })}
            </div>
          </div>

          <a
            href={bracketHref}
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
          >
            Go to bracket
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
