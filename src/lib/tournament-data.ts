export type Team = {
  id: string;
  name: string;
  countryCode: string;
  flagEmoji: string;
  confederation: string;
  group: string;
  seed: number;
  colors: {
    primary: string;
    secondary: string;
  };
};

export type Group = {
  id: string;
  name: string;
  teams: Team[];
};

export type RoundKey = "r32" | "r16" | "qf" | "sf" | "final" | "champion";

export type Match = {
  id: string;
  round: Exclude<RoundKey, "champion">;
  position: number;
  teamAId?: string;
  teamBId?: string;
  winnerTeamId?: string;
  status: "open" | "locked" | "final";
  scoreA?: number;
  scoreB?: number;
};

export type ScheduledMatch = {
  id: number;
  stage: "Group Stage" | "Round of 32" | "Round of 16" | "Quarterfinal" | "Semifinal" | "Final";
  date: string;
  localTime: string;
  city: string;
  country: string;
  venue: string;
  teamAId?: string;
  teamBId?: string;
  teamALabel?: string;
  teamBLabel?: string;
  status: "scheduled" | "live" | "final";
  scoreA?: number;
  scoreB?: number;
  source: "Official schedule release" | "Projected schedule slot";
};

export type LeaderboardScope = {
  rank: number;
  name: string;
  bracket: string;
  points: number;
  champion: string;
  trend: string;
  continent: string;
  country: string;
  city: string;
};

export type BracketPick = Record<string, string>;

export type Bracket = {
  id: string;
  name: string;
  shareSlug: string;
  ownerName: string;
  picks: BracketPick;
  createdAt: string;
};

export const tournament = {
  id: "global-football-2026",
  name: "2026 Global Football Tournament",
  label: "Draw demo",
  dates: "June 11 to July 19, 2026",
  hosts: ["Canada", "Mexico", "United States"],
  format: "48 teams, 12 groups, 32-team knockout bracket",
  note: "Demo bracket pairings only. Team list and groups should be updated when the official final tournament draw is available.",
  sources: [
    {
      label: "Official schedule release",
      url: "https://tickets.fifa.com/organisation/media-releases/updated-world-cup-2026-match-schedule-venues-kick-off-times-104-matches",
    },
    {
      label: "Official qualified teams tracker",
      url: "https://www.fifa.com/en/articles/world-cup-2026-who-has-qualified",
    },
    {
      label: "Reported group draw reference",
      url: "https://www.skysports.com/football/news/11095/13427475/world-cup-2026-who-has-qualified-full-list-of-teams-for-usa-canada-and-mexico-tournament",
    },
  ],
};

const flagFromCode = (countryCode: string) => {
  if (countryCode === "ENG" || countryCode === "SCO") return "🏴";

  return countryCode
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2)
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
};

const qualifiedTeams = [
  ["mex", "Mexico", "MX", "CONCACAF", "A", "#006847", "#CE1126"],
  ["cze", "Czech Republic", "CZ", "UEFA", "A", "#D7141A", "#11457E"],
  ["rsa", "South Africa", "ZA", "CAF", "A", "#007A4D", "#FFB612"],
  ["kor", "South Korea", "KR", "AFC", "A", "#DC2626", "#1D4ED8"],
  ["can", "Canada", "CA", "CONCACAF", "B", "#E21B2D", "#FFFFFF"],
  ["bih", "Bosnia and Herzegovina", "BA", "UEFA", "B", "#1D4ED8", "#FACC15"],
  ["qat", "Qatar", "QA", "AFC", "B", "#8A1538", "#FFFFFF"],
  ["sui", "Switzerland", "CH", "UEFA", "B", "#DC2626", "#FFFFFF"],
  ["bra", "Brazil", "BR", "CONMEBOL", "C", "#16A34A", "#FACC15"],
  ["hai", "Haiti", "HT", "CONCACAF", "C", "#1D4ED8", "#DC2626"],
  ["mar", "Morocco", "MA", "CAF", "C", "#C1272D", "#16A34A"],
  ["sco", "Scotland", "SCO", "UEFA", "C", "#1D4ED8", "#FFFFFF"],
  ["usa", "United States", "US", "CONCACAF", "D", "#1D4ED8", "#DC2626"],
  ["aus", "Australia", "AU", "AFC", "D", "#FACC15", "#16A34A"],
  ["par", "Paraguay", "PY", "CONMEBOL", "D", "#DC2626", "#2563EB"],
  ["tur", "Turkey", "TR", "UEFA", "D", "#E30A17", "#FFFFFF"],
  ["cuw", "Curacao", "CW", "CONCACAF", "E", "#1D4ED8", "#FACC15"],
  ["ecu", "Ecuador", "EC", "CONMEBOL", "E", "#FACC15", "#EF4444"],
  ["ger", "Germany", "DE", "UEFA", "E", "#111827", "#FACC15"],
  ["civ", "Ivory Coast", "CI", "CAF", "E", "#F97316", "#16A34A"],
  ["ned", "Netherlands", "NL", "UEFA", "F", "#F97316", "#1D4ED8"],
  ["jpn", "Japan", "JP", "AFC", "F", "#1D4ED8", "#EF4444"],
  ["swe", "Sweden", "SE", "UEFA", "F", "#2563EB", "#FACC15"],
  ["tun", "Tunisia", "TN", "CAF", "F", "#E70013", "#FFFFFF"],
  ["bel", "Belgium", "BE", "UEFA", "G", "#111827", "#FACC15"],
  ["egy", "Egypt", "EG", "CAF", "G", "#CE1126", "#111827"],
  ["irn", "Iran", "IR", "AFC", "G", "#16A34A", "#EF4444"],
  ["nzl", "New Zealand", "NZ", "OFC", "G", "#111827", "#FFFFFF"],
  ["cpv", "Cape Verde", "CV", "CAF", "H", "#2563EB", "#FACC15"],
  ["ksa", "Saudi Arabia", "SA", "AFC", "H", "#15803D", "#FFFFFF"],
  ["esp", "Spain", "ES", "UEFA", "H", "#EF4444", "#FACC15"],
  ["uru", "Uruguay", "UY", "CONMEBOL", "H", "#60A5FA", "#FFFFFF"],
  ["fra", "France", "FR", "UEFA", "I", "#1D4ED8", "#EF4444"],
  ["nor", "Norway", "NO", "UEFA", "I", "#BA0C2F", "#00205B"],
  ["sen", "Senegal", "SN", "CAF", "I", "#16A34A", "#FACC15"],
  ["irq", "Iraq", "IQ", "AFC", "I", "#CE1126", "#16A34A"],
  ["alg", "Algeria", "DZ", "CAF", "J", "#16A34A", "#FFFFFF"],
  ["arg", "Argentina", "AR", "CONMEBOL", "J", "#75AADB", "#F6C453"],
  ["aut", "Austria", "AT", "UEFA", "J", "#DC2626", "#FFFFFF"],
  ["jor", "Jordan", "JO", "AFC", "J", "#EF4444", "#16A34A"],
  ["col", "Colombia", "CO", "CONMEBOL", "K", "#FACC15", "#2563EB"],
  ["jam", "Jamaica", "JM", "CONCACAF", "K", "#16A34A", "#FACC15"],
  ["por", "Portugal", "PT", "UEFA", "K", "#EF4444", "#16A34A"],
  ["uzb", "Uzbekistan", "UZ", "AFC", "K", "#22C55E", "#38BDF8"],
  ["cro", "Croatia", "HR", "UEFA", "L", "#DC2626", "#2563EB"],
  ["eng", "England", "ENG", "UEFA", "L", "#FFFFFF", "#DC2626"],
  ["gha", "Ghana", "GH", "CAF", "L", "#FACC15", "#16A34A"],
  ["pan", "Panama", "PA", "CONCACAF", "L", "#DC2626", "#2563EB"],
] as const;

// Team list and groups should be updated when the official final tournament draw is available.
export const teams: Team[] = qualifiedTeams.map(
  ([id, name, countryCode, confederation, group, primary, secondary], index) => ({
    id,
    name,
    countryCode,
    flagEmoji: flagFromCode(countryCode),
    confederation,
    group,
    seed: index + 1,
    colors: {
      primary,
      secondary,
    },
  }),
);

export const groups: Group[] = Array.from({ length: 12 }, (_, index) => {
  const id = String.fromCharCode(65 + index);
  return {
    id,
    name: `Group ${id}`,
    teams: teams.filter((team) => team.group === id),
  };
});

export const scoringRules = [
  { round: "Round of 32", points: 1 },
  { round: "Round of 16", points: 2 },
  { round: "Quarterfinal", points: 4 },
  { round: "Semifinal", points: 8 },
  { round: "Final", points: 16 },
  { round: "Champion", points: 32 },
];

export const rounds: Array<{ key: Exclude<RoundKey, "champion">; label: string; short: string }> = [
  { key: "r32", label: "Round of 32", short: "R32" },
  { key: "r16", label: "Round of 16", short: "R16" },
  { key: "qf", label: "Quarterfinal", short: "QF" },
  { key: "sf", label: "Semifinal", short: "SF" },
  { key: "final", label: "Final", short: "Final" },
];

const r32PairIds = [
  ["mex", "sco"],
  ["can", "sui"],
  ["bra", "mar"],
  ["usa", "tur"],
  ["ned", "tun"],
  ["bel", "nzl"],
  ["fra", "irq"],
  ["arg", "jor"],
  ["col", "uzb"],
  ["cro", "pan"],
  ["kor", "cze"],
  ["qat", "bih"],
  ["ecu", "ger"],
  ["aus", "par"],
  ["esp", "uru"],
  ["eng", "gha"],
];

export const sampleKnockoutMatches: Match[] = [
  ...r32PairIds.map(([teamAId, teamBId], index) => ({
    id: `r32-${index + 1}`,
    round: "r32" as const,
    position: index,
    teamAId,
    teamBId,
    status: "open" as const,
  })),
  ...Array.from({ length: 8 }, (_, index) => ({
    id: `r16-${index + 1}`,
    round: "r16" as const,
    position: index,
    status: "open" as const,
  })),
  ...Array.from({ length: 4 }, (_, index) => ({
    id: `qf-${index + 1}`,
    round: "qf" as const,
    position: index,
    status: "open" as const,
  })),
  ...Array.from({ length: 2 }, (_, index) => ({
    id: `sf-${index + 1}`,
    round: "sf" as const,
    position: index,
    status: "open" as const,
  })),
  { id: "final-1", round: "final", position: 0, status: "open" },
];

export const featuredBracket: Bracket = {
  id: "demo-bracket",
  name: "Projected 2026 Bracket Demo",
  shareSlug: "projected-2026-demo",
  ownerName: "GoalPool",
  createdAt: new Date("2026-04-28T12:00:00Z").toISOString(),
  picks: {
    "r32-1": "can",
    "r32-2": "arg",
    "r32-3": "mex",
    "r32-4": "bra",
    "r32-5": "usa",
    "r32-6": "uru",
    "r32-7": "col",
    "r32-8": "jpn",
    "r16-1": "arg",
    "r16-2": "bra",
    "r16-3": "usa",
    "r16-4": "col",
    "qf-1": "arg",
    "qf-2": "usa",
    "sf-1": "arg",
    "final-1": "arg",
  },
};

export const leaderboardRows = [
  { rank: 1, name: "Maya C.", bracket: "Gold Path", points: 74, champion: "Argentina", trend: "+12", continent: "North America", country: "United States", city: "New York" },
  { rank: 2, name: "Leo M.", bracket: "North Hosts", points: 68, champion: "Brazil", trend: "+8", continent: "North America", country: "Canada", city: "Toronto" },
  { rank: 3, name: "Nora S.", bracket: "Clean Sheet", points: 61, champion: "United States", trend: "+4", continent: "Europe", country: "England", city: "London" },
  { rank: 4, name: "Ari P.", bracket: "Knockout Map", points: 56, champion: "Colombia", trend: "+2", continent: "South America", country: "Colombia", city: "Bogota" },
  { rank: 5, name: "Yuki T.", bracket: "Tokyo Press", points: 53, champion: "Japan", trend: "+6", continent: "Asia", country: "Japan", city: "Tokyo" },
  { rank: 6, name: "Sam R.", bracket: "Atlas Route", points: 49, champion: "Morocco", trend: "+3", continent: "Africa", country: "Morocco", city: "Casablanca" },
] satisfies LeaderboardScope[];

const officialScheduleHighlights: ScheduledMatch[] = [
  {
    id: 1,
    stage: "Group Stage",
    date: "2026-06-11",
    localTime: "13:00",
    city: "Mexico City",
    country: "Mexico",
    venue: "Mexico City Stadium",
    teamAId: "mex",
    teamALabel: "Mexico",
    teamBLabel: "South Africa",
    status: "scheduled",
    source: "Official schedule release",
  },
  {
    id: 2,
    stage: "Group Stage",
    date: "2026-06-12",
    localTime: "15:00",
    city: "Toronto",
    country: "Canada",
    venue: "Toronto Stadium",
    teamAId: "can",
    teamALabel: "Canada",
    teamBLabel: "European play-off winner",
    status: "scheduled",
    source: "Official schedule release",
  },
  {
    id: 3,
    stage: "Group Stage",
    date: "2026-06-12",
    localTime: "18:00",
    city: "Los Angeles",
    country: "United States",
    venue: "Los Angeles Stadium",
    teamAId: "usa",
    teamALabel: "United States",
    teamBId: "par",
    teamBLabel: "Paraguay",
    status: "scheduled",
    source: "Official schedule release",
  },
  {
    id: 4,
    stage: "Group Stage",
    date: "2026-06-13",
    localTime: "18:00",
    city: "New York New Jersey",
    country: "United States",
    venue: "New York New Jersey Stadium",
    teamAId: "bra",
    teamALabel: "Brazil",
    teamBId: "mar",
    teamBLabel: "Morocco",
    status: "scheduled",
    source: "Official schedule release",
  },
  {
    id: 10,
    stage: "Group Stage",
    date: "2026-06-14",
    localTime: "12:00",
    city: "Houston",
    country: "United States",
    venue: "Houston Stadium",
    teamALabel: "Curacao",
    teamBLabel: "Germany",
    status: "scheduled",
    source: "Official schedule release",
  },
  {
    id: 25,
    stage: "Group Stage",
    date: "2026-06-17",
    localTime: "15:00",
    city: "Dallas",
    country: "United States",
    venue: "Dallas Stadium",
    teamALabel: "England",
    teamBLabel: "Croatia",
    status: "scheduled",
    source: "Official schedule release",
  },
  {
    id: 44,
    stage: "Group Stage",
    date: "2026-06-20",
    localTime: "22:00",
    city: "Monterrey",
    country: "Mexico",
    venue: "Monterrey Stadium",
    teamAId: "tun",
    teamALabel: "Tunisia",
    teamBId: "jpn",
    teamBLabel: "Japan",
    status: "scheduled",
    source: "Official schedule release",
  },
];

const projectedScheduleSlots: ScheduledMatch[] = Array.from({ length: 104 }, (_, index) => {
  const matchNumber = index + 1;
  const isKnown = officialScheduleHighlights.find((match) => match.id === matchNumber);
  if (isKnown) return isKnown;

  const stage: ScheduledMatch["stage"] =
    matchNumber <= 72
      ? "Group Stage"
      : matchNumber <= 88
        ? "Round of 32"
        : matchNumber <= 96
          ? "Round of 16"
          : matchNumber <= 100
            ? "Quarterfinal"
            : matchNumber <= 102
              ? "Semifinal"
              : "Final";

  return {
    id: matchNumber,
    stage,
    date: matchNumber <= 72 ? "2026-06-11" : "2026-06-28",
    localTime: "TBD",
    city: "TBD",
    country: "TBD",
    venue: "TBD",
    teamALabel: stage === "Group Stage" ? `Team slot ${matchNumber}A` : `${stage} slot A`,
    teamBLabel: stage === "Group Stage" ? `Team slot ${matchNumber}B` : `${stage} slot B`,
    status: "scheduled",
    source: "Projected schedule slot",
  };
});

export const scheduledMatches = projectedScheduleSlots;

const roundOrder: Array<Exclude<RoundKey, "champion">> = ["r32", "r16", "qf", "sf", "final"];

export function getTeam(teamId?: string) {
  return teams.find((team) => team.id === teamId);
}

export function resolveBracketMatches(picks: BracketPick): Match[] {
  const resolved = sampleKnockoutMatches.map((match) => ({ ...match }));

  for (const round of roundOrder) {
    const currentRound = resolved.filter((match) => match.round === round);
    currentRound.forEach((match) => {
      match.winnerTeamId = picks[match.id];
      const nextRound = nextRoundFor(round);
      if (!nextRound || !match.winnerTeamId) return;

      const nextMatch = resolved.find(
        (candidate) => candidate.round === nextRound && candidate.position === Math.floor(match.position / 2),
      );
      if (!nextMatch) return;
      if (match.position % 2 === 0) {
        nextMatch.teamAId = match.winnerTeamId;
      } else {
        nextMatch.teamBId = match.winnerTeamId;
      }
    });
  }

  return resolved;
}

export function updatePicksWithReset(currentPicks: BracketPick, match: Match, pickedTeamId: string) {
  const nextPicks = { ...currentPicks, [match.id]: pickedTeamId };
  let activeRound = nextRoundFor(match.round);
  let activePosition = Math.floor(match.position / 2);

  while (activeRound) {
    const activeMatchId = `${activeRound}-${activePosition + 1}`;
    if (!nextPicks[activeMatchId]) break;
    delete nextPicks[activeMatchId];
    activePosition = Math.floor(activePosition / 2);
    activeRound = nextRoundFor(activeRound);
  }

  return nextPicks;
}

export function nextRoundFor(round: Exclude<RoundKey, "champion">) {
  const index = roundOrder.indexOf(round);
  return roundOrder[index + 1];
}

export function createLocalBracket(name: string, picks: BracketPick): Bracket {
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;

  return {
    id: crypto.randomUUID(),
    name,
    shareSlug: slug,
    ownerName: "You",
    createdAt: new Date().toISOString(),
    picks,
  };
}
