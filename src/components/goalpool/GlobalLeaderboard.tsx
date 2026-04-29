"use client";

import { useState } from "react";
import { Globe2 } from "lucide-react";
import { leaderboardRows } from "@/lib/tournament-data";

const all = "All";

export function GlobalLeaderboard() {
  const [continent, setContinent] = useState(all);
  const [country, setCountry] = useState(all);
  const [city, setCity] = useState(all);

  const continents = [all, ...Array.from(new Set(leaderboardRows.map((row) => row.continent)))];
  const countries = [all, ...Array.from(new Set(leaderboardRows.map((row) => row.country)))];
  const cities = [all, ...Array.from(new Set(leaderboardRows.map((row) => row.city)))];

  const rows = leaderboardRows.filter(
    (row) =>
      (continent === all || row.continent === continent) &&
      (country === all || row.country === country) &&
      (city === all || row.city === city),
  );

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#07111F]/75 p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#D4AF37]">
            <Globe2 className="h-4 w-4" />
            Worldwide leaderboard
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Filter by region without making the app feel busy.</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["Continent", continent, setContinent, continents],
            ["Country", country, setCountry, countries],
            ["City", city, setCity, cities],
          ].map(([label, value, setter, options]) => (
            <label key={label as string} className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {label as string}
              <select
                value={value as string}
                onChange={(event) => (setter as (value: string) => void)(event.target.value)}
                className="mt-1 h-10 w-full rounded-full border border-white/10 bg-black/30 px-3 text-sm normal-case tracking-normal text-slate-200 outline-none"
              >
                {(options as string[]).map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-5 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
        {rows.map((row) => (
          <div key={`${row.rank}-${row.name}`} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 bg-black/20 p-4">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#D4AF37]/10 text-sm font-black text-[#F8E7A4]">{row.rank}</div>
            <div>
              <div className="font-semibold text-white">{row.name}</div>
              <div className="text-xs text-slate-500">
                {row.city}, {row.country} / {row.bracket}
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-white">{row.points}</div>
              <div className="text-xs font-bold text-[#D4AF37]">{row.trend}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
