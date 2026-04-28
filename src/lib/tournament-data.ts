export type Team = {
  id: string;
  name: string;
  countryCode: string;
  flagEmoji: string;
  confederation: string;
  group: string;
  seed: number;
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
  label: "Projected bracket demo",
  dates: "June 11 to July 19, 2026",
  hosts: ["Canada", "Mexico", "United States"],
  format: "48 teams, 12 demo groups, 32-team knockout bracket",
  note: "Demo groups only. Final groups should be updated after the official final tournament draw is available.",
};

const qualifiedTeams = [
  ["can", "Canada", "CA", "🇨🇦", "CONCACAF"],
  ["mex", "Mexico", "MX", "🇲🇽", "CONCACAF"],
  ["usa", "United States", "US", "🇺🇸", "CONCACAF"],
  ["arg", "Argentina", "AR", "🇦🇷", "CONMEBOL"],
  ["bra", "Brazil", "BR", "🇧🇷", "CONMEBOL"],
  ["uru", "Uruguay", "UY", "🇺🇾", "CONMEBOL"],
  ["col", "Colombia", "CO", "🇨🇴", "CONMEBOL"],
  ["ecu", "Ecuador", "EC", "🇪🇨", "CONMEBOL"],
  ["par", "Paraguay", "PY", "🇵🇾", "CONMEBOL"],
  ["jpn", "Japan", "JP", "🇯🇵", "AFC"],
  ["kor", "South Korea", "KR", "🇰🇷", "AFC"],
  ["irn", "Iran", "IR", "🇮🇷", "AFC"],
  ["aus", "Australia", "AU", "🇦🇺", "AFC"],
  ["uzb", "Uzbekistan", "UZ", "🇺🇿", "AFC"],
  ["jor", "Jordan", "JO", "🇯🇴", "AFC"],
  ["ksa", "Saudi Arabia", "SA", "🇸🇦", "AFC"],
  ["qat", "Qatar", "QA", "🇶🇦", "AFC"],
  ["mar", "Morocco", "MA", "🇲🇦", "CAF"],
  ["tun", "Tunisia", "TN", "🇹🇳", "CAF"],
  ["egy", "Egypt", "EG", "🇪🇬", "CAF"],
  ["alg", "Algeria", "DZ", "🇩🇿", "CAF"],
  ["gha", "Ghana", "GH", "🇬🇭", "CAF"],
  ["cpv", "Cape Verde", "CV", "🇨🇻", "CAF"],
  ["nzl", "New Zealand", "NZ", "🇳🇿", "OFC"],
] as const;

const placeholders = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1;
  return [`q${number}`, `Qualifier ${number}`, `Q${number}`, "◆", "TBD"] as const;
});

// Team list and groups should be updated when the official final tournament draw is available.
export const teams: Team[] = [...qualifiedTeams, ...placeholders].map(
  ([id, name, countryCode, flagEmoji, confederation], index) => ({
    id,
    name,
    countryCode,
    flagEmoji,
    confederation,
    group: String.fromCharCode(65 + Math.floor(index / 4)),
    seed: index + 1,
  }),
);

export const groups: Group[] = Array.from({ length: 12 }, (_, index) => {
  const id = String.fromCharCode(65 + index);
  return {
    id,
    name: `Demo Group ${id}`,
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
  ["can", "q1"],
  ["arg", "q2"],
  ["mex", "q3"],
  ["bra", "q4"],
  ["usa", "q5"],
  ["uru", "q6"],
  ["col", "q7"],
  ["jpn", "q8"],
  ["kor", "q9"],
  ["mar", "q10"],
  ["ecu", "q11"],
  ["irn", "q12"],
  ["aus", "q13"],
  ["egy", "q14"],
  ["par", "q15"],
  ["gha", "q16"],
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
  { rank: 1, name: "Maya C.", bracket: "Gold Path", points: 74, champion: "Argentina", trend: "+12" },
  { rank: 2, name: "Leo M.", bracket: "North Hosts", points: 68, champion: "Brazil", trend: "+8" },
  { rank: 3, name: "Nora S.", bracket: "Clean Sheet", points: 61, champion: "United States", trend: "+4" },
  { rank: 4, name: "Ari P.", bracket: "Knockout Map", points: 56, champion: "Colombia", trend: "+2" },
];

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
