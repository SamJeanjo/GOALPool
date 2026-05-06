export type StageKey = "groups" | "r32" | "r16" | "qf" | "sf" | "final";

export type Team = {
  id: string;
  name: string;
  countryCode: string;
  flag: string;
  flagUrl: string;
  group: string;
  confederation: string;
  lat: number;
  lng: number;
  colors: {
    primary: string;
    secondary: string;
  };
};

export type Group = {
  id: string;
  teams: Team[];
};

export type Matchup = {
  id: string;
  stage: Exclude<StageKey, "groups">;
  position: number;
  teamA?: Team;
  teamB?: Team;
};

export type GlobeMatchup = {
  id: string;
  stage: StageKey;
  group?: string;
  position: number;
  teamA: Team;
  teamB: Team;
};

export const stageLabels: Record<StageKey, string> = {
  groups: "Groups",
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter Final",
  sf: "Semi Final",
  final: "Final",
};

const flagFromCode = (countryCode: string) => {
  if (countryCode === "ENG" || countryCode === "SCO") return "🏴";

  return countryCode
    .slice(0, 2)
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
};

const flagSlugByCode: Record<string, string> = {
  ENG: "gb-eng",
  SCO: "gb-sct",
};

const flagUrlFromCode = (countryCode: string) => {
  const slug = flagSlugByCode[countryCode] ?? countryCode.toLowerCase().slice(0, 2);
  return `https://flagcdn.com/w320/${slug}.png`;
};

const teamRows = [
  ["mex", "Mexico", "MX", "A", "CONCACAF", "#006847", "#CE1126"],
  ["rsa", "South Africa", "ZA", "A", "CAF", "#007A4D", "#FFB612"],
  ["kor", "South Korea", "KR", "A", "AFC", "#DC2626", "#1D4ED8"],
  ["cze", "Czech Republic", "CZ", "A", "UEFA", "#D7141A", "#11457E"],
  ["can", "Canada", "CA", "B", "CONCACAF", "#E21B2D", "#FFFFFF"],
  ["bih", "Bosnia and Herzegovina", "BA", "B", "UEFA", "#1D4ED8", "#FACC15"],
  ["qat", "Qatar", "QA", "B", "AFC", "#8A1538", "#FFFFFF"],
  ["sui", "Switzerland", "CH", "B", "UEFA", "#DC2626", "#FFFFFF"],
  ["bra", "Brazil", "BR", "C", "CONMEBOL", "#16A34A", "#FACC15"],
  ["mar", "Morocco", "MA", "C", "CAF", "#C1272D", "#16A34A"],
  ["hai", "Haiti", "HT", "C", "CONCACAF", "#1D4ED8", "#DC2626"],
  ["sco", "Scotland", "SCO", "C", "UEFA", "#1D4ED8", "#FFFFFF"],
  ["usa", "United States", "US", "D", "CONCACAF", "#1D4ED8", "#DC2626"],
  ["par", "Paraguay", "PY", "D", "CONMEBOL", "#DC2626", "#2563EB"],
  ["aus", "Australia", "AU", "D", "AFC", "#FACC15", "#16A34A"],
  ["tur", "Turkey", "TR", "D", "UEFA", "#E30A17", "#FFFFFF"],
  ["ger", "Germany", "DE", "E", "UEFA", "#111827", "#FACC15"],
  ["cuw", "Curacao", "CW", "E", "CONCACAF", "#1D4ED8", "#FACC15"],
  ["civ", "Ivory Coast", "CI", "E", "CAF", "#F97316", "#16A34A"],
  ["ecu", "Ecuador", "EC", "E", "CONMEBOL", "#FACC15", "#EF4444"],
  ["ned", "Netherlands", "NL", "F", "UEFA", "#F97316", "#1D4ED8"],
  ["jpn", "Japan", "JP", "F", "AFC", "#1D4ED8", "#EF4444"],
  ["swe", "Sweden", "SE", "F", "UEFA", "#2563EB", "#FACC15"],
  ["tun", "Tunisia", "TN", "F", "CAF", "#E70013", "#FFFFFF"],
  ["bel", "Belgium", "BE", "G", "UEFA", "#111827", "#FACC15"],
  ["egy", "Egypt", "EG", "G", "CAF", "#CE1126", "#111827"],
  ["irn", "Iran", "IR", "G", "AFC", "#16A34A", "#EF4444"],
  ["nzl", "New Zealand", "NZ", "G", "OFC", "#111827", "#FFFFFF"],
  ["esp", "Spain", "ES", "H", "UEFA", "#EF4444", "#FACC15"],
  ["cpv", "Cape Verde", "CV", "H", "CAF", "#2563EB", "#FACC15"],
  ["ksa", "Saudi Arabia", "SA", "H", "AFC", "#15803D", "#FFFFFF"],
  ["uru", "Uruguay", "UY", "H", "CONMEBOL", "#60A5FA", "#FFFFFF"],
  ["fra", "France", "FR", "I", "UEFA", "#1D4ED8", "#EF4444"],
  ["sen", "Senegal", "SN", "I", "CAF", "#16A34A", "#FACC15"],
  ["irq", "Iraq", "IQ", "I", "AFC", "#CE1126", "#16A34A"],
  ["nor", "Norway", "NO", "I", "UEFA", "#BA0C2F", "#00205B"],
  ["arg", "Argentina", "AR", "J", "CONMEBOL", "#75AADB", "#F6C453"],
  ["alg", "Algeria", "DZ", "J", "CAF", "#16A34A", "#FFFFFF"],
  ["aut", "Austria", "AT", "J", "UEFA", "#DC2626", "#FFFFFF"],
  ["jor", "Jordan", "JO", "J", "AFC", "#EF4444", "#16A34A"],
  ["por", "Portugal", "PT", "K", "UEFA", "#EF4444", "#16A34A"],
  ["cod", "DR Congo", "CD", "K", "CAF", "#2563EB", "#EF4444"],
  ["uzb", "Uzbekistan", "UZ", "K", "AFC", "#22C55E", "#38BDF8"],
  ["col", "Colombia", "CO", "K", "CONMEBOL", "#FACC15", "#2563EB"],
  ["eng", "England", "ENG", "L", "UEFA", "#FFFFFF", "#DC2626"],
  ["cro", "Croatia", "HR", "L", "UEFA", "#DC2626", "#2563EB"],
  ["gha", "Ghana", "GH", "L", "CAF", "#FACC15", "#16A34A"],
  ["pan", "Panama", "PA", "L", "CONCACAF", "#DC2626", "#2563EB"],
] as const;

const teamLocations: Record<string, [number, number]> = {
  mex: [23.6, -102.5],
  rsa: [-30.6, 22.9],
  kor: [36.5, 127.8],
  cze: [49.8, 15.5],
  can: [56.1, -106.3],
  bih: [44.2, 17.8],
  qat: [25.3, 51.2],
  sui: [46.8, 8.2],
  bra: [-14.2, -51.9],
  mar: [31.8, -7.1],
  hai: [18.9, -72.3],
  sco: [56.5, -4.2],
  usa: [39.8, -98.6],
  par: [-23.4, -58.4],
  aus: [-25.3, 133.8],
  tur: [39.0, 35.2],
  ger: [51.2, 10.4],
  cuw: [12.2, -69.0],
  civ: [7.5, -5.5],
  ecu: [-1.8, -78.2],
  ned: [52.1, 5.3],
  jpn: [36.2, 138.3],
  swe: [60.1, 18.6],
  tun: [33.9, 9.5],
  bel: [50.5, 4.5],
  egy: [26.8, 30.8],
  irn: [32.4, 53.7],
  nzl: [-40.9, 174.9],
  esp: [40.5, -3.7],
  cpv: [16.0, -24.0],
  ksa: [23.9, 45.1],
  uru: [-32.5, -55.8],
  fra: [46.2, 2.2],
  sen: [14.5, -14.5],
  irq: [33.2, 43.7],
  nor: [60.5, 8.5],
  arg: [-38.4, -63.6],
  alg: [28.0, 1.7],
  aut: [47.5, 14.6],
  jor: [30.6, 36.2],
  por: [39.4, -8.2],
  cod: [-2.9, 23.7],
  uzb: [41.4, 64.6],
  col: [4.6, -74.3],
  eng: [52.3, -1.5],
  cro: [45.1, 15.2],
  gha: [7.9, -1.0],
  pan: [8.5, -80.8],
};

export const teams: Team[] = teamRows.map(([id, name, countryCode, group, confederation, primary, secondary]) => ({
  id,
  name,
  countryCode,
  flag: flagFromCode(countryCode),
  flagUrl: flagUrlFromCode(countryCode),
  group,
  confederation,
  lat: teamLocations[id][0],
  lng: teamLocations[id][1],
  colors: { primary, secondary },
}));

export const groups: Group[] = Array.from({ length: 12 }, (_, index) => {
  const id = String.fromCharCode(65 + index);
  return {
    id,
    teams: teams.filter((team) => team.group === id),
  };
});

export const teamById = new Map(teams.map((team) => [team.id, team]));

export const defaultGroupWinners: Record<string, string[]> = Object.fromEntries(
  groups.map((group) => [group.id, group.teams.slice(0, 2).map((team) => team.id)]),
);

export const defaultThirdPlaceIds = groups.slice(0, 8).map((group) => group.teams[2].id);

export function buildRoundOf32(groupWinners: Record<string, string[]>, thirdPlaceIds: string[]): Matchup[] {
  const directTeams = groups.flatMap((group) => groupWinners[group.id] ?? group.teams.slice(0, 2).map((team) => team.id));
  const field = [...directTeams, ...thirdPlaceIds].map((id) => teamById.get(id)).filter(Boolean) as Team[];
  const topHalf = field.slice(0, 16);
  const bottomHalf = field.slice(16, 32).reverse();

  return topHalf.map((team, index) => ({
    id: `r32-${index + 1}`,
    stage: "r32",
    position: index,
    teamA: team,
    teamB: bottomHalf[index],
  }));
}

export function buildNextRound(stage: Exclude<StageKey, "groups" | "r32">, winners: Team[]): Matchup[] {
  return Array.from({ length: Math.ceil(winners.length / 2) }, (_, index) => ({
    id: `${stage}-${index + 1}`,
    stage,
    position: index,
    teamA: winners[index * 2],
    teamB: winners[index * 2 + 1],
  }));
}

const groupFixturePairs = [
  [0, 1],
  [2, 3],
  [0, 2],
  [1, 3],
  [0, 3],
  [1, 2],
] as const;

export const groupStageMatchups: GlobeMatchup[] = groups.flatMap((group, groupIndex) =>
  groupFixturePairs.map(([teamAIndex, teamBIndex], index) => ({
    id: `group-${group.id}-${index + 1}`,
    stage: "groups" as const,
    group: group.id,
    position: groupIndex * 6 + index,
    teamA: group.teams[teamAIndex],
    teamB: group.teams[teamBIndex],
  })),
);

export function toGlobeMatchups(stage: Exclude<StageKey, "groups">, matchups: Matchup[]): GlobeMatchup[] {
  return matchups
    .filter((matchup): matchup is Matchup & { teamA: Team; teamB: Team } => Boolean(matchup.teamA && matchup.teamB))
    .map((matchup) => ({
      id: matchup.id,
      stage,
      position: matchup.position,
      teamA: matchup.teamA,
      teamB: matchup.teamB,
    }));
}
