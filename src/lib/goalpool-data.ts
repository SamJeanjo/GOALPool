export type Team = {
  id: string;
  name: string;
  countryCode: string;
  flagEmoji: string;
  seed: number;
  groupName: string;
};

export type RoundKey = "r32" | "r16" | "qf" | "sf" | "final" | "champion";

export type Match = {
  id: string;
  round: Exclude<RoundKey, "champion">;
  position: number;
  teamAId?: string;
  teamBId?: string;
  winnerTeamId?: string;
  startsAt?: string;
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

export const demoTeams: Team[] = [
  ["arg", "Argentina", "AR", "🇦🇷"], ["jpn", "Japan", "JP", "🇯🇵"],
  ["fra", "France", "FR", "🇫🇷"], ["mar", "Morocco", "MA", "🇲🇦"],
  ["bra", "Brazil", "BR", "🇧🇷"], ["usa", "United States", "US", "🇺🇸"],
  ["eng", "England", "GB-ENG", "🏴"], ["kor", "South Korea", "KR", "🇰🇷"],
  ["esp", "Spain", "ES", "🇪🇸"], ["gha", "Ghana", "GH", "🇬🇭"],
  ["ned", "Netherlands", "NL", "🇳🇱"], ["can", "Canada", "CA", "🇨🇦"],
  ["por", "Portugal", "PT", "🇵🇹"], ["egy", "Egypt", "EG", "🇪🇬"],
  ["ger", "Germany", "DE", "🇩🇪"], ["aus", "Australia", "AU", "🇦🇺"],
  ["ita", "Italy", "IT", "🇮🇹"], ["mex", "Mexico", "MX", "🇲🇽"],
  ["uru", "Uruguay", "UY", "🇺🇾"], ["sen", "Senegal", "SN", "🇸🇳"],
  ["bel", "Belgium", "BE", "🇧🇪"], ["sui", "Switzerland", "CH", "🇨🇭"],
  ["col", "Colombia", "CO", "🇨🇴"], ["den", "Denmark", "DK", "🇩🇰"],
  ["cro", "Croatia", "HR", "🇭🇷"], ["nga", "Nigeria", "NG", "🇳🇬"],
  ["swe", "Sweden", "SE", "🇸🇪"], ["irl", "Ireland", "IE", "🇮🇪"],
  ["nor", "Norway", "NO", "🇳🇴"], ["cot", "Ivory Coast", "CI", "🇨🇮"],
  ["chi", "Chile", "CL", "🇨🇱"], ["qat", "Qatar", "QA", "🇶🇦"],
  ["pol", "Poland", "PL", "🇵🇱"], ["cam", "Cameroon", "CM", "🇨🇲"],
  ["tur", "Turkiye", "TR", "🇹🇷"], ["par", "Paraguay", "PY", "🇵🇾"],
  ["wal", "Wales", "GB-WLS", "🏴"], ["tun", "Tunisia", "TN", "🇹🇳"],
  ["ecu", "Ecuador", "EC", "🇪🇨"], ["rsa", "South Africa", "ZA", "🇿🇦"],
  ["ukr", "Ukraine", "UA", "🇺🇦"], ["jam", "Jamaica", "JM", "🇯🇲"],
  ["aut", "Austria", "AT", "🇦🇹"], ["per", "Peru", "PE", "🇵🇪"],
  ["sco", "Scotland", "GB-SCT", "🏴"], ["nz", "New Zealand", "NZ", "🇳🇿"],
  ["gre", "Greece", "GR", "🇬🇷"], ["cri", "Costa Rica", "CR", "🇨🇷"],
].map(([id, name, countryCode, flagEmoji], index) => ({
  id,
  name,
  countryCode,
  flagEmoji,
  seed: index + 1,
  groupName: String.fromCharCode(65 + Math.floor(index / 4)),
}));

const r32PairIds = [
  ["arg", "jpn"], ["fra", "mar"], ["bra", "usa"], ["eng", "kor"],
  ["esp", "gha"], ["ned", "can"], ["por", "egy"], ["ger", "aus"],
  ["ita", "mex"], ["uru", "sen"], ["bel", "sui"], ["col", "den"],
  ["cro", "nga"], ["swe", "irl"], ["nor", "cot"], ["chi", "qat"],
];

export const demoMatches: Match[] = [
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
  name: "Sam's Global Football Bracket",
  shareSlug: "demo-clean-bracket",
  ownerName: "Sam",
  createdAt: new Date("2026-04-28T12:00:00Z").toISOString(),
  picks: {
    "r32-1": "arg",
    "r32-2": "fra",
    "r32-3": "bra",
    "r32-4": "eng",
    "r32-5": "esp",
    "r32-6": "ned",
    "r32-7": "por",
    "r32-8": "ger",
    "r16-1": "arg",
    "r16-2": "bra",
    "r16-3": "esp",
    "r16-4": "por",
    "qf-1": "arg",
    "qf-2": "por",
    "sf-1": "arg",
    "final-1": "arg",
  },
};

export const leaderboardRows = [
  { rank: 1, name: "Maya C.", bracket: "Clean Sheet Special", points: 74, champion: "Argentina", trend: "+12" },
  { rank: 2, name: "Leo M.", bracket: "Left Side Chaos", points: 68, champion: "France", trend: "+8" },
  { rank: 3, name: "Nora S.", bracket: "Flag Tap FC", points: 61, champion: "Brazil", trend: "+4" },
  { rank: 4, name: "Ari P.", bracket: "Upset Energy", points: 56, champion: "Portugal", trend: "+2" },
];

const roundOrder: Array<Exclude<RoundKey, "champion">> = ["r32", "r16", "qf", "sf", "final"];

export function getTeam(teamId?: string) {
  return demoTeams.find((team) => team.id === teamId);
}

export function resolveBracketMatches(picks: BracketPick): Match[] {
  const resolved = demoMatches.map((match) => ({ ...match }));

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
    const pickedInDownstreamMatch = nextPicks[activeMatchId];
    if (!pickedInDownstreamMatch) break;
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
