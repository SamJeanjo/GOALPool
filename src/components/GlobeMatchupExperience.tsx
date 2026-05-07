"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Eye,
  Lock,
  Mail,
  Minus,
  RotateCcw,
  Save,
  Settings,
  Share2,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { groups, stageLabels, type Group, type Matchup, type StageKey, type Team } from "@/data/worldCup2026";
import { cn } from "@/lib/utils";
import { EarthGlobePreview } from "./EarthGlobePreview";

type RankKey = "first" | "second" | "third";
type GroupSelection = Record<string, { first?: string; second?: string; third?: string }>;
type PickMap = Record<string, string>;
type BracketStatus = "incomplete" | "draft" | "ready" | "locked" | "live";
type MainSection = "dashboard" | "picks" | "bracket" | "friends" | "leaderboard" | "settings";
type PickStage = StageKey | "review";

type StandingRow = {
  team: Team;
  points: number;
  wins: number;
  originalIndex: number;
};

type Invite = {
  id: string;
  invitedEmail: string;
  inviteCode: string;
  status: "pending" | "accepted";
  createdAt: string;
};

const stageOrder: PickStage[] = ["groups", "r32", "r16", "qf", "sf", "final", "review"];
const knockoutStages: Exclude<StageKey, "groups">[] = ["r32", "r16", "qf", "sf", "final"];
const lockDeadline = new Date("2026-06-10T23:59:59-04:00");
const firstMatchAt = new Date("2026-06-11T15:00:00-04:00");

const scoringConfig = {
  groupFirst: 3,
  groupSecond: 2,
  groupThird: 1,
  r32: 2,
  r16: 4,
  qf: 8,
  sf: 12,
  final: 18,
  championBonus: 30,
};

const mockUser = {
  id: "user-sam",
  name: "Sam Jeanjo",
  email: "sam@goalpool.app",
  avatar: "SJ",
  createdAt: "2026-05-06",
};

const friendRows = [
  { id: "mia", name: "Mia", championTeamId: "bra", points: 84, correct: 21, prediction: 66, movement: "up", locked: true },
  { id: "leo", name: "Leo", championTeamId: "fra", points: 79, correct: 19, prediction: 61, movement: "same", locked: true },
  { id: "nora", name: "Nora", championTeamId: "arg", points: 73, correct: 17, prediction: 58, movement: "down", locked: true },
  { id: "kai", name: "Kai", championTeamId: "eng", points: 0, correct: 0, prediction: 0, movement: "same", locked: false },
] as const;

const realResultsPlaceholder = {
  groupFirst: Object.fromEntries(groups.map((group) => [group.id, group.teams[0].id])),
  groupSecond: Object.fromEntries(groups.map((group) => [group.id, group.teams[1].id])),
  groupThird: Object.fromEntries(groups.slice(0, 8).map((group) => [group.id, group.teams[2].id])),
  knockout: {
    "r32-1": groups[0].teams[0].id,
    "r32-2": groups[1].teams[0].id,
    "r16-1": groups[0].teams[0].id,
  } as Record<string, string>,
};

const allTeams = groups.flatMap((group) => group.teams);
const teamById = new Map(allTeams.map((team) => [team.id, team]));

export function GlobeMatchupExperience() {
  const [section, setSection] = useState<MainSection>("picks");
  const [activeStage, setActiveStage] = useState<PickStage>("groups");
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [groupSelections, setGroupSelections] = useState<GroupSelection>({});
  const [knockoutPicks, setKnockoutPicks] = useState<PickMap>({});
  const [status, setStatus] = useState<BracketStatus>("incomplete");
  const [lockedAt, setLockedAt] = useState<string | undefined>();
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [inviteEmail, setInviteEmail] = useState("");
  const [invites, setInvites] = useState<Invite[]>([
    { id: "invite-1", invitedEmail: "mia@example.com", inviteCode: "POOL-MIA", status: "accepted", createdAt: "2026-05-06" },
  ]);

  const autoLocked = new Date() > lockDeadline;
  const locked = status === "locked" || autoLocked;

  const standings = useMemo(() => calculateStandings(groupSelections), [groupSelections]);
  const r32 = useMemo(() => buildRoundOf32FromStandings(standings), [standings]);
  const r32Winners = winnersFor(r32, knockoutPicks);
  const r16 = useMemo(() => buildNextRound("r16", r32Winners), [r32Winners]);
  const r16Winners = winnersFor(r16, knockoutPicks);
  const qf = useMemo(() => buildNextRound("qf", r16Winners), [r16Winners]);
  const qfWinners = winnersFor(qf, knockoutPicks);
  const sf = useMemo(() => buildNextRound("sf", qfWinners), [qfWinners]);
  const sfWinners = winnersFor(sf, knockoutPicks);
  const final = useMemo(() => buildNextRound("final", sfWinners), [sfWinners]);
  const champion = winnersFor(final, knockoutPicks)[0];
  const effectiveStatus: BracketStatus = new Date() >= firstMatchAt && locked ? "live" : locked ? "locked" : champion ? "ready" : status;

  const matchupsByStage = { r32, r16, qf, sf, final };
  const groupProgress = getGroupProgress(groupSelections);
  const knockoutProgress = Object.fromEntries(
    knockoutStages.map((stage) => [stage, getRoundProgress(matchupsByStage[stage], knockoutPicks)]),
  ) as Record<Exclude<StageKey, "groups">, { completed: number; total: number; complete: boolean }>;
  const completion = getOverallCompletion(groupProgress, knockoutProgress, Boolean(champion));
  const stats = calculateStats(groupSelections, knockoutPicks, champion);
  const selectedChampion = champion ?? teamById.get(friendRows[0].championTeamId);
  const nextImpact = getNextImpact(matchupsByStage, knockoutPicks);

  const canEdit = !locked;
  const currentStageComplete = activeStage === "groups" ? groupProgress.complete : activeStage === "review" ? Boolean(champion) : knockoutProgress[activeStage].complete;

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(undefined), 2200);
  };

  const updateGroupRank = (group: Group, team: Team, rank: RankKey) => {
    if (!canEdit) {
      showMessage("This bracket is locked. Picks can no longer be edited.");
      return;
    }
    setGroupSelections((current) => ({
      ...current,
      [group.id]: applyGroupRank(current[group.id] ?? {}, team.id, rank),
    }));
    setKnockoutPicks({});
    setStatus("incomplete");
  };

  const selectWinner = (matchup: Matchup, team: Team) => {
    if (!canEdit) {
      showMessage("This bracket is locked. Picks can no longer be edited.");
      return;
    }
    setKnockoutPicks((current) => {
      const next = { ...current, [matchup.id]: team.id };
      downstreamStages(matchup.stage).forEach((stage) => {
        Object.keys(next).forEach((key) => {
          if (key.startsWith(`${stage}-`)) delete next[key];
        });
      });
      return next;
    });
    setStatus("incomplete");
  };

  const goToStage = (nextStage: PickStage) => {
    const validation = validateStageAccess(nextStage, groupProgress, knockoutProgress, Boolean(champion));
    if (!validation.allowed) {
      showMessage(validation.message);
      return;
    }
    setActiveStage(nextStage);
    setSection("picks");
  };

  const continueFromStage = () => {
    const currentIndex = stageOrder.indexOf(activeStage);
    const nextStage = stageOrder[currentIndex + 1];
    if (!nextStage) return;
    if (!currentStageComplete) {
      showMessage(activeStage === "groups" ? "Select 1st and 2nd in every group before Round of 32." : "Pick every winner in this round before advancing.");
      return;
    }
    goToStage(nextStage);
  };

  const saveDraft = () => {
    const nextStatus: BracketStatus = champion ? "ready" : completion.requiredStarted ? "draft" : "incomplete";
    setStatus(nextStatus);
    persistMockBracket(nextStatus, lockedAt, champion, stats);
    showMessage(nextStatus === "draft" ? "Draft saved. You can keep editing until lock." : "Start your picks before saving a draft.");
  };

  const lockBracket = () => {
    if (!champion) {
      showMessage("Complete the final and champion pick before locking.");
      return;
    }
    const time = new Date().toISOString();
    setStatus("locked");
    setLockedAt(time);
    setShowLockConfirm(false);
    persistMockBracket("locked", time, champion, stats);
    setSection("bracket");
    showMessage("Bracket locked. Your dashboard is ready.");
  };

  const addInvite = () => {
    if (!inviteEmail.includes("@")) {
      showMessage("Enter a valid email invite.");
      return;
    }
    setInvites((current) => [
      {
        id: `invite-${Date.now()}`,
        invitedEmail: inviteEmail,
        inviteCode: `POOL-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setInviteEmail("");
    showMessage("Invite created. Share link is ready.");
  };

  const reset = () => {
    setGroupSelections({});
    setKnockoutPicks({});
    setStatus("incomplete");
    setLockedAt(undefined);
    setActiveStage("groups");
    setActiveGroupIndex(0);
    setSection("picks");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#06101C] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgb(255_255_255_/_0.13),transparent_24rem),radial-gradient(circle_at_24%_48%,rgb(34_197_94_/_0.14),transparent_26rem),radial-gradient(circle_at_82%_68%,rgb(37_99_235_/_0.2),transparent_30rem),radial-gradient(circle_at_50%_95%,rgb(250_204_21_/_0.1),transparent_28rem)]" />
      <section className="relative mx-auto max-w-7xl px-4 py-5 md:px-8 md:py-8">
        <Header
          section={section}
          setSection={setSection}
          status={effectiveStatus}
          completion={completion.percent}
          lockedAt={lockedAt}
          onReset={reset}
          onSave={saveDraft}
          onLock={() => setShowLockConfirm(true)}
          canLock={Boolean(champion) && !locked}
          locked={locked}
        />

        <AnimatePresence mode="wait">
          {section === "dashboard" ? (
            <DashboardView key="dashboard" status={effectiveStatus} champion={selectedChampion} stats={stats} nextImpact={nextImpact} setSection={setSection} locked={locked} />
          ) : section === "picks" ? (
            <PickView
              key="picks"
              activeStage={activeStage}
              activeGroupIndex={activeGroupIndex}
              setActiveGroupIndex={setActiveGroupIndex}
              groupSelections={groupSelections}
              standings={standings}
              matchupsByStage={matchupsByStage}
              knockoutPicks={knockoutPicks}
              champion={champion}
              groupProgress={groupProgress}
              knockoutProgress={knockoutProgress}
              locked={locked}
              goToStage={goToStage}
              onRankPick={updateGroupRank}
              onWinnerPick={selectWinner}
              onContinue={continueFromStage}
              onReview={() => setActiveStage("review")}
              onLock={() => setShowLockConfirm(true)}
              onSave={saveDraft}
            />
          ) : section === "bracket" ? (
            <BracketReview key="bracket" champion={champion} matchupsByStage={matchupsByStage} picks={knockoutPicks} locked={locked} onEdit={() => setSection("picks")} onLock={() => setShowLockConfirm(true)} />
          ) : section === "friends" ? (
            <FriendsView key="friends" invites={invites} inviteEmail={inviteEmail} setInviteEmail={setInviteEmail} addInvite={addInvite} locked={locked} />
          ) : section === "leaderboard" ? (
            <LeaderboardView key="leaderboard" champion={champion} stats={stats} locked={locked} />
          ) : (
            <SettingsView key="settings" locked={locked} lockDeadline={lockDeadline} scoringConfig={scoringConfig} />
          )}
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {message ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-[#0A101A]/95 px-5 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur">
            {message}
          </motion.div>
        ) : null}
        {showLockConfirm ? (
          <LockConfirmModal onCancel={() => setShowLockConfirm(false)} onConfirm={lockBracket} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function Header({
  section,
  setSection,
  status,
  completion,
  lockedAt,
  onReset,
  onSave,
  onLock,
  canLock,
  locked,
}: {
  section: MainSection;
  setSection: (section: MainSection) => void;
  status: BracketStatus;
  completion: number;
  lockedAt?: string;
  onReset: () => void;
  onSave: () => void;
  onLock: () => void;
  canLock: boolean;
  locked: boolean;
}) {
  const sections: { id: MainSection; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "picks", label: "Make Picks", icon: Trophy },
    { id: "bracket", label: "My Bracket", icon: ShieldCheck },
    { id: "friends", label: "Friends", icon: Users },
    { id: "leaderboard", label: "Leaderboard", icon: ArrowUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="mb-6">
      <nav className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/10 shadow-[0_0_32px_rgb(255_255_255_/_0.12)]">
            <Trophy className="h-5 w-5 text-[#F7D774]" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight">GoalPool</div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-white/40">2026 Global Soccer Bracket</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={status} lockedAt={lockedAt} />
          <button type="button" onClick={onReset} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/[0.1] hover:text-white" aria-label="Reset bracket">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button type="button" onClick={onSave} disabled={locked} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-white transition hover:bg-white/[0.1] disabled:opacity-45">
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button type="button" onClick={onLock} disabled={!canLock || locked} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#F7D774] to-white px-5 text-sm font-black text-[#06101C] shadow-[0_0_32px_rgb(247_215_116_/_0.22)] disabled:opacity-45">
            <Lock className="h-4 w-4" />
            Lock My Bracket
          </button>
        </div>
      </nav>

      <div className="mb-5 rounded-[28px] border border-white/10 bg-white/[0.045] p-2 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {sections.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  "relative inline-flex min-h-12 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-black transition",
                  active ? "text-[#06101C]" : "text-white/58 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                {active ? <motion.span layoutId="main-nav-pill" className="absolute inset-0 rounded-2xl bg-white" /> : null}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h1 className="text-4xl font-black leading-[0.98] tracking-tight md:text-6xl">Premium 2026 Bracket Pool</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/58">Make your picks, lock your bracket, invite friends, and track the path to the champion.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <div className="mb-2 flex items-center justify-between gap-8 text-xs font-black uppercase tracking-wide text-white/45">
            <span>Bracket completion</span>
            <span>{completion}%</span>
          </div>
          <div className="h-2 w-full min-w-56 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-[#F7D774]" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PickView({
  activeStage,
  activeGroupIndex,
  setActiveGroupIndex,
  groupSelections,
  standings,
  matchupsByStage,
  knockoutPicks,
  champion,
  groupProgress,
  knockoutProgress,
  locked,
  goToStage,
  onRankPick,
  onWinnerPick,
  onContinue,
  onLock,
  onSave,
}: {
  activeStage: PickStage;
  activeGroupIndex: number;
  setActiveGroupIndex: (index: number) => void;
  groupSelections: GroupSelection;
  standings: Record<string, StandingRow[]>;
  matchupsByStage: Record<Exclude<StageKey, "groups">, Matchup[]>;
  knockoutPicks: PickMap;
  champion?: Team;
  groupProgress: { completed: number; total: number; complete: boolean };
  knockoutProgress: Record<Exclude<StageKey, "groups">, { completed: number; total: number; complete: boolean }>;
  locked: boolean;
  goToStage: (stage: PickStage) => void;
  onRankPick: (group: Group, team: Team, rank: RankKey) => void;
  onWinnerPick: (matchup: Matchup, team: Team) => void;
  onContinue: () => void;
  onReview: () => void;
  onLock: () => void;
  onSave: () => void;
}) {
  const currentGroup = groups[activeGroupIndex];
  const selectedGroup = groupSelections[currentGroup.id] ?? {};
  const activeProgress = activeStage === "groups" ? groupProgress : activeStage === "review" ? { completed: champion ? 1 : 0, total: 1, complete: Boolean(champion) } : knockoutProgress[activeStage];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <section className="rounded-[36px] border border-white/10 bg-[#080A0E] p-4 shadow-[0_30px_120px_rgb(0_0_0_/_0.48)] md:p-6">
        <StageRail activeStage={activeStage} goToStage={goToStage} groupProgress={groupProgress} knockoutProgress={knockoutProgress} champion={champion} />
        {activeStage === "groups" ? (
          <GroupStagePanel
            group={currentGroup}
            groupIndex={activeGroupIndex}
            selection={selectedGroup}
            locked={locked}
            onRankPick={onRankPick}
            onPrevious={() => setActiveGroupIndex(Math.max(0, activeGroupIndex - 1))}
            onNext={() => setActiveGroupIndex(Math.min(groups.length - 1, activeGroupIndex + 1))}
          />
        ) : activeStage === "review" ? (
          <BracketReview champion={champion} matchupsByStage={matchupsByStage} picks={knockoutPicks} locked={locked} onEdit={() => goToStage("groups")} onLock={onLock} />
        ) : (
          <KnockoutStagePanel stage={activeStage} matchups={matchupsByStage[activeStage]} picks={knockoutPicks} locked={locked} onWinnerPick={onWinnerPick} />
        )}

        {activeStage !== "review" ? (
          <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-black text-white">{activeProgress.completed}/{activeProgress.total} complete</div>
              <p className="mt-1 text-sm text-white/45">{activeProgress.complete ? "This stage is complete. You can advance." : "Finish the required picks to unlock the next step."}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onSave} className="min-h-12 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-black text-white transition hover:bg-white/[0.1]">
                Save Draft
              </button>
              <button
                type="button"
                onClick={onContinue}
                disabled={!activeProgress.complete}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#06101C] transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </section>
      <ProgressAside activeStage={activeStage} groupProgress={groupProgress} knockoutProgress={knockoutProgress} standings={standings} champion={champion} locked={locked} />
    </motion.div>
  );
}

function StageRail({
  activeStage,
  goToStage,
  groupProgress,
  knockoutProgress,
  champion,
}: {
  activeStage: PickStage;
  goToStage: (stage: PickStage) => void;
  groupProgress: { completed: number; total: number; complete: boolean };
  knockoutProgress: Record<Exclude<StageKey, "groups">, { completed: number; total: number; complete: boolean }>;
  champion?: Team;
}) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-none">
      {stageOrder.map((stage) => {
        const progress = stage === "groups" ? groupProgress : stage === "review" ? { complete: Boolean(champion), completed: champion ? 1 : 0, total: 1 } : knockoutProgress[stage];
        const active = activeStage === stage;
        return (
          <button
            key={stage}
            type="button"
            onClick={() => goToStage(stage)}
            className={cn(
              "shrink-0 rounded-2xl border px-4 py-3 text-left transition",
              active ? "border-[#F7D774]/60 bg-[#F7D774]/15" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]",
            )}
          >
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-white/45">
              {progress.complete ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <span className="h-3.5 w-3.5 rounded-full border border-white/20" />}
              {stage === "review" ? "Review" : stageLabels[stage]}
            </div>
            <div className="mt-1 text-sm font-black text-white">{progress.completed}/{progress.total}</div>
          </button>
        );
      })}
    </div>
  );
}

function GroupStagePanel({
  group,
  groupIndex,
  selection,
  locked,
  onRankPick,
  onPrevious,
  onNext,
}: {
  group: Group;
  groupIndex: number;
  selection: { first?: string; second?: string; third?: string };
  locked: boolean;
  onRankPick: (group: Group, team: Team, rank: RankKey) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div key={group.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative min-h-[720px] overflow-hidden rounded-[30px] bg-[#020407]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgb(255_255_255_/_0.12),transparent_30rem),linear-gradient(180deg,transparent,rgb(0_0_0_/_0.66))]" />
      <EarthGlobePreview />
      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">Group Stage</p>
          <h2 className="mt-1 text-2xl font-black text-white">Group {group.id}</h2>
          <p className="mt-1 text-sm text-white/45">Group {groupIndex + 1}/12</p>
        </div>
        <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-black text-white/60">
          {selection.first && selection.second ? "Complete" : "Needs 1st + 2nd"}
        </span>
      </div>
      <div className="absolute bottom-20 left-4 right-4 z-20 grid gap-3 md:grid-cols-4">
        {group.teams.map((team) => (
          <GroupRankCard key={team.id} team={team} rank={rankForTeam(selection, team.id)} locked={locked} onRankPick={(rank) => onRankPick(group, team, rank)} />
        ))}
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
        <IconCircle onClick={onPrevious} disabled={groupIndex === 0} label="Previous group" icon="left" />
        <div className="rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs font-black uppercase tracking-wide text-white/55">
          Select 1st, 2nd, optional 3rd
        </div>
        <IconCircle onClick={onNext} disabled={groupIndex >= groups.length - 1} label="Next group" icon="right" />
      </div>
    </motion.div>
  );
}

function GroupRankCard({ team, rank, locked, onRankPick }: { team: Team; rank?: RankKey; locked: boolean; onRankPick: (rank: RankKey) => void }) {
  return (
    <motion.div
      layout
      animate={{ y: rank ? -6 : 0, scale: rank ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={cn("rounded-2xl border bg-black/66 p-3 backdrop-blur transition", rankClass(rank), locked && "opacity-80")}
    >
      <div className="flex items-center gap-2">
        <FlagImage team={team} className="h-8 w-11 rounded-md object-cover" />
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-white">{team.name}</div>
          <div className="text-[10px] font-black uppercase tracking-wide text-white/40">{team.countryCode}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {(["first", "second", "third"] as RankKey[]).map((key) => (
          <button
            key={key}
            type="button"
            disabled={locked}
            onClick={() => onRankPick(key)}
            className={cn(
              "rounded-xl border px-2 py-2 text-xs font-black uppercase tracking-wide transition disabled:cursor-not-allowed",
              rank === key ? rankButtonClass(key) : "border-white/10 bg-white/[0.06] text-white/50 hover:bg-white/[0.12] hover:text-white",
            )}
          >
            {key === "first" ? "1st" : key === "second" ? "2nd" : "3rd"}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function KnockoutStagePanel({
  stage,
  matchups,
  picks,
  locked,
  onWinnerPick,
}: {
  stage: Exclude<StageKey, "groups">;
  matchups: Matchup[];
  picks: PickMap;
  locked: boolean;
  onWinnerPick: (matchup: Matchup, team: Team) => void;
}) {
  return (
    <div className="min-h-[620px] rounded-[30px] bg-black/45 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">Knockout Bracket</p>
          <h2 className="mt-1 text-3xl font-black text-white">{stageLabels[stage]}</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black text-white/55">{matchups.filter((matchup) => picks[matchup.id]).length}/{matchups.length} picked</span>
      </div>
      {matchups.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {matchups.map((matchup) => (
            <MatchPickCard key={matchup.id} matchup={matchup} selectedId={picks[matchup.id]} locked={locked} onPick={onWinnerPick} />
          ))}
        </div>
      ) : (
        <EmptyRound />
      )}
    </div>
  );
}

function MatchPickCard({ matchup, selectedId, locked, onPick }: { matchup: Matchup; selectedId?: string; locked: boolean; onPick: (matchup: Matchup, team: Team) => void }) {
  return (
    <motion.article layout className="rounded-3xl border border-white/10 bg-white/[0.045] p-3">
      <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wide text-white/35">
        <span>Match {matchup.position + 1}</span>
        {selectedId ? <span className="text-emerald-200">Picked</span> : <span>Open</span>}
      </div>
      <div className="space-y-2">
        {[matchup.teamA, matchup.teamB].filter((team): team is Team => Boolean(team)).map((team) => {
          const selected = selectedId === team.id;
          const dimmed = Boolean(selectedId && !selected);
          return (
            <motion.button
              key={team.id}
              type="button"
              disabled={locked}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(matchup, team)}
              className={cn(
                "flex min-h-16 w-full items-center justify-between rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed",
                selected ? "border-emerald-300/70 bg-emerald-300/12 shadow-[0_0_30px_rgb(34_197_94_/_0.2)]" : "border-white/10 bg-black/35 hover:border-white/25",
                dimmed && "opacity-35 grayscale",
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <FlagImage team={team} className="h-8 w-11 rounded-md object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-white">{team.name}</span>
                  <span className="text-xs font-black uppercase tracking-wide text-white/38">{team.countryCode}</span>
                </span>
              </span>
              {selected ? <CheckCircle2 className="h-5 w-5 text-emerald-200" /> : null}
            </motion.button>
          );
        })}
      </div>
    </motion.article>
  );
}

function BracketReview({
  champion,
  matchupsByStage,
  picks,
  locked,
  onEdit,
  onLock,
}: {
  champion?: Team;
  matchupsByStage: Record<Exclude<StageKey, "groups">, Matchup[]>;
  picks: PickMap;
  locked: boolean;
  onEdit: () => void;
  onLock: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="rounded-[36px] border border-white/10 bg-[#080A0E] p-5 shadow-[0_30px_120px_rgb(0_0_0_/_0.48)]">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">Final review</p>
          <h2 className="mt-2 text-4xl font-black">Share-ready bracket</h2>
          <p className="mt-2 text-sm text-white/50">Review your path before locking. Friends can compare only after lock.</p>
        </div>
        <div className="flex gap-2">
          {!locked ? (
            <button type="button" onClick={onEdit} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-black text-white">
              <Edit3 className="h-4 w-4" />
              Edit Picks
            </button>
          ) : null}
          <button type="button" onClick={onLock} disabled={!champion || locked} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-[#06101C] disabled:opacity-40">
            <Lock className="h-4 w-4" />
            Save & Lock Bracket
          </button>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/35 p-4 scrollbar-none">
          <div className="grid min-w-[920px] grid-cols-5 gap-4">
            {knockoutStages.map((stage) => (
              <div key={stage} className="space-y-3">
                <div className="sticky top-0 rounded-full bg-white/[0.06] px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-white/45">{stageLabels[stage]}</div>
                {matchupsByStage[stage].map((matchup) => {
                  const winner = teamById.get(picks[matchup.id]);
                  return <ReviewNode key={matchup.id} team={winner} label={`M${matchup.position + 1}`} highlight={stage === "final"} />;
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-[#F7D774]/25 bg-[#F7D774]/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">Champion</p>
          {champion ? (
            <div className="mt-5 text-center">
              <FlagImage team={champion} className="mx-auto h-24 w-32 rounded-2xl object-cover shadow-2xl" />
              <div className="mt-4 text-4xl font-black">{champion.countryCode}</div>
              <div className="text-sm font-black uppercase tracking-wide text-white/55">{champion.name}</div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/55">Complete the final to reveal your champion.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DashboardView({ status, champion, stats, nextImpact, setSection, locked }: { status: BracketStatus; champion?: Team; stats: ReturnType<typeof calculateStats>; nextImpact?: Matchup; setSection: (section: MainSection) => void; locked: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-[1fr_380px]">
      <section className="rounded-[36px] border border-white/10 bg-[#080A0E] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">Main dashboard</p>
            <h2 className="mt-2 text-4xl font-black">{statusLabel(status)} bracket</h2>
            <p className="mt-2 text-sm text-white/50">Your bracket command center updates as results come in.</p>
          </div>
          <button type="button" onClick={() => setSection(locked ? "bracket" : "picks")} className="min-h-12 rounded-full bg-white px-5 text-sm font-black text-[#06101C]">
            {locked ? "View Bracket" : "Continue Picks"}
          </button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <MetricCard label="Total points" value={stats.points} />
          <MetricCard label="Prediction %" value={`${stats.predictionPercentage}%`} />
          <MetricCard label="Correct picks" value={stats.correct} />
          <MetricCard label="Missed picks" value={stats.missed} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <MetricCard label="Current rank" value="#2" />
          <MetricCard label="Pool-winning chance" value={`${Math.min(94, Math.max(8, stats.predictionPercentage + 18))}%`} />
          <MetricCard label="Perfect bracket" value={stats.missed === 0 && stats.correct > 0 ? "Alive" : "Broken"} />
          <MetricCard label="Friends pool" value="5 users" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs font-black uppercase tracking-wide text-white/40">Champion pick</p>
            {champion ? <TeamLine team={champion} large /> : <p className="mt-3 text-sm text-white/45">No champion yet.</p>}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs font-black uppercase tracking-wide text-white/40">Next match affecting bracket</p>
            {nextImpact?.teamA && nextImpact.teamB ? (
              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <TeamLine team={nextImpact.teamA} />
                <span className="text-xs font-black text-white/35">VS</span>
                <TeamLine team={nextImpact.teamB} alignRight />
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/45">Complete more picks to identify the next impact match.</p>
            )}
          </div>
        </div>
      </section>
      <LeaderboardPreview champion={champion} stats={stats} locked={locked} />
    </motion.div>
  );
}

function FriendsView({ invites, inviteEmail, setInviteEmail, addInvite, locked }: { invites: Invite[]; inviteEmail: string; setInviteEmail: (value: string) => void; addInvite: () => void; locked: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-5 lg:grid-cols-[420px_1fr]">
      <section className="rounded-[36px] border border-white/10 bg-[#080A0E] p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">Invite system</p>
        <h2 className="mt-2 text-3xl font-black">Build your pool</h2>
        <p className="mt-2 text-sm text-white/50">Invite friends by email. {locked ? "Your locked bracket is visible for comparison." : "Your bracket stays hidden until you lock."}</p>
        <div className="mt-5 flex gap-2">
          <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="friend@email.com" className="min-h-12 min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-white/30" />
          <button type="button" onClick={addInvite} className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#06101C]">
            <Mail className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-xs font-black uppercase tracking-wide text-white/35">Invite link</p>
          <p className="mt-2 truncate font-mono text-sm text-white/70">https://goalpool.app/pools/GOAL-2026</p>
        </div>
      </section>
      <section className="rounded-[36px] border border-white/10 bg-[#080A0E] p-5">
        <h3 className="text-2xl font-black">Friends brackets</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {friendRows.map((friend) => (
            <article key={friend.id} className="rounded-3xl border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-black">{friend.name}</div>
                {friend.locked ? <Lock className="h-4 w-4 text-emerald-200" /> : <Eye className="h-4 w-4 text-white/35" />}
              </div>
              {friend.locked ? (
                <div className="mt-4">
                  <TeamLine team={teamById.get(friend.championTeamId)} />
                  <p className="mt-3 text-sm text-white/45">{friend.points} pts · {friend.prediction}% prediction</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-white/45">Hidden until this friend locks their bracket.</p>
              )}
            </article>
          ))}
        </div>
        <div className="mt-5">
          {invites.map((invite) => (
            <div key={invite.id} className="mb-2 flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm">
              <span>{invite.invitedEmail}</span>
              <span className="font-black uppercase text-white/45">{invite.status}</span>
            </div>
          ))}
        </div>
        {!invites.length ? <EmptyInviteState /> : null}
      </section>
    </motion.div>
  );
}

function LeaderboardView({ champion, stats, locked }: { champion?: Team; stats: ReturnType<typeof calculateStats>; locked: boolean }) {
  const currentUser = { id: mockUser.id, name: "You", championTeamId: champion?.id ?? "tbd", points: stats.points, correct: stats.correct, prediction: stats.predictionPercentage, movement: "up", locked };
  const rows = [...friendRows, currentUser].sort((a, b) => b.points - a.points);
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="rounded-[36px] border border-white/10 bg-[#080A0E] p-5">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">My Pool</p>
          <h2 className="mt-2 text-4xl font-black">Friends leaderboard</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black">{rows.length} users</span>
      </div>
      {rows.length <= 1 ? (
        <EmptyInviteState />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10">
          {rows.map((row, index) => (
            <div key={row.id} className={cn("grid grid-cols-[48px_1fr_110px_80px_90px] items-center gap-3 border-b border-white/10 p-4 last:border-b-0", row.id === mockUser.id ? "bg-[#F7D774]/12" : "bg-white/[0.025]")}>
              <div className="text-lg font-black text-white/60">#{index + 1}</div>
              <div>
                <div className="font-black">{row.name}</div>
                <div className="text-xs text-white/42">{teamById.get(row.championTeamId)?.name ?? "Not picked"}</div>
              </div>
              <div className="font-black">{row.points} pts</div>
              <div className="text-sm text-white/60">{row.correct} correct</div>
              <div className="flex items-center justify-end gap-2">
                <Movement movement={row.movement} />
                <span className="font-black">{row.prediction}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

function SettingsView({ locked, lockDeadline, scoringConfig }: { locked: boolean; lockDeadline: Date; scoringConfig: Record<string, number> }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="rounded-[36px] border border-white/10 bg-[#080A0E] p-5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">Settings</p>
      <h2 className="mt-2 text-4xl font-black">Bracket rules</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
          <p className="text-sm font-black">Lock deadline</p>
          <p className="mt-2 text-white/55">{lockDeadline.toLocaleString()} - {locked ? "Locked" : "Editable until deadline"}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
          <p className="text-sm font-black">Privacy</p>
          <p className="mt-2 text-white/55">Friends cannot view your bracket until you lock it.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {Object.entries(scoringConfig).map(([key, value]) => (
          <div key={key} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs font-black uppercase tracking-wide text-white/35">{key.replace(/([A-Z])/g, " $1")}</div>
            <div className="mt-2 text-2xl font-black">{value} pts</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function ProgressAside({ activeStage, groupProgress, knockoutProgress, standings, champion, locked }: { activeStage: PickStage; groupProgress: { completed: number; total: number }; knockoutProgress: Record<Exclude<StageKey, "groups">, { completed: number; total: number }>; standings: Record<string, StandingRow[]>; champion?: Team; locked: boolean }) {
  const active = activeStage === "groups" ? groupProgress : activeStage === "review" ? { completed: champion ? 1 : 0, total: 1 } : knockoutProgress[activeStage];
  return (
    <aside className="h-fit rounded-[32px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur lg:sticky lg:top-6">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">{activeStage === "review" ? "Review" : stageLabels[activeStage]}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight">{active.completed}/{active.total} picked</h2>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-yellow-300" style={{ width: `${active.total ? (active.completed / active.total) * 100 : 0}%` }} />
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black">Bracket state</span>
          {locked ? <Lock className="h-4 w-4 text-[#F7D774]" /> : <Edit3 className="h-4 w-4 text-white/45" />}
        </div>
        <p className="mt-2 text-sm text-white/50">{locked ? "Locked and share-ready." : "Draft editable until lock deadline."}</p>
      </div>
      {champion ? (
        <div className="mt-5 rounded-3xl border border-[#F7D774]/20 bg-[#F7D774]/10 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-[#F7D774]">Champion pick</p>
          <TeamLine team={champion} large />
        </div>
      ) : null}
      <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-black">Live group leaders</span>
          <span className="text-xs font-black text-white/35">mock</span>
        </div>
        <div className="space-y-3">
          {groups.slice(0, 4).map((group) => (
            <div key={group.id} className="rounded-2xl bg-white/[0.04] p-3">
              <div className="mb-2 text-xs font-black uppercase tracking-wide text-emerald-200">Group {group.id}</div>
              {standings[group.id].slice(0, 3).map((row) => (
                <div key={row.team.id} className="flex items-center justify-between py-1 text-sm">
                  <span className="font-bold text-white/75">{row.team.countryCode}</span>
                  <span className="font-black text-white">{row.points}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function LeaderboardPreview({ champion, stats, locked }: { champion?: Team; stats: ReturnType<typeof calculateStats>; locked: boolean }) {
  const userRow = { id: "you", name: "You", championTeamId: champion?.id ?? "tbd", points: stats.points, correct: stats.correct, prediction: stats.predictionPercentage, movement: "up", locked };
  const rows = [userRow, ...friendRows.slice(0, 3)].sort((a, b) => b.points - a.points);
  return (
    <aside className="rounded-[36px] border border-white/10 bg-[#080A0E] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-black">Leaderboard preview</h3>
        <Share2 className="h-4 w-4 text-white/35" />
      </div>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={row.id} className={cn("flex items-center justify-between rounded-2xl border border-white/10 p-3", row.id === "you" ? "bg-[#F7D774]/12" : "bg-white/[0.035]")}>
            <div>
              <div className="font-black">#{index + 1} {row.name}</div>
              <div className="text-xs text-white/42">{teamById.get(row.championTeamId)?.countryCode ?? "TBD"} champion</div>
            </div>
            <div className="text-right">
              <div className="font-black">{row.points}</div>
              <div className="text-xs text-white/42">{row.prediction}%</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function LockConfirmModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur">
      <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#0A101A] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#F7D774]/15 text-[#F7D774]">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-black">Lock your bracket?</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">Once locked, you cannot edit your predictions.</p>
          </div>
          <button type="button" onClick={onCancel} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={onCancel} className="min-h-12 rounded-full border border-white/10 bg-white/[0.06] text-sm font-black text-white">Keep Editing</button>
          <button type="button" onClick={onConfirm} className="min-h-12 rounded-full bg-white text-sm font-black text-[#06101C]">Save & Lock</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReviewNode({ team, label, highlight }: { team?: Team; label: string; highlight?: boolean }) {
  return (
    <div className={cn("min-h-16 rounded-2xl border p-3", highlight ? "border-[#F7D774]/40 bg-[#F7D774]/12" : "border-white/10 bg-white/[0.045]")}>
      <div className="text-[10px] font-black uppercase tracking-wide text-white/35">{label}</div>
      {team ? <TeamLine team={team} /> : <div className="mt-2 text-sm font-bold text-white/35">Pending</div>}
    </div>
  );
}

function TeamLine({ team, large, alignRight }: { team?: Team; large?: boolean; alignRight?: boolean }) {
  if (!team) return <span className="text-sm text-white/35">TBD</span>;
  return (
    <div className={cn("mt-3 flex items-center gap-3", alignRight && "justify-end text-right", large && "mt-4")}>
      {!alignRight ? <FlagImage team={team} className={cn("rounded-md object-cover", large ? "h-10 w-14" : "h-7 w-10")} /> : null}
      <div>
        <div className={cn("font-black", large ? "text-xl" : "text-sm")}>{team.name}</div>
        <div className="text-xs font-black uppercase tracking-wide text-white/38">{team.countryCode}</div>
      </div>
      {alignRight ? <FlagImage team={team} className={cn("rounded-md object-cover", large ? "h-10 w-14" : "h-7 w-10")} /> : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-4">
      <div className="text-xs font-black uppercase tracking-wide text-white/35">{label}</div>
      <div className="mt-2 text-3xl font-black">{value}</div>
    </div>
  );
}

function StatusPill({ status, lockedAt }: { status: BracketStatus; lockedAt?: string }) {
  return (
    <div
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-black",
        status === "locked" || status === "live"
          ? "border-[#F7D774]/30 bg-[#F7D774]/12 text-[#F7D774]"
          : status === "ready"
            ? "border-emerald-300/30 bg-emerald-300/12 text-emerald-100"
            : status === "draft"
              ? "border-sky-300/25 bg-sky-300/10 text-sky-100"
              : "border-white/10 bg-white/[0.06] text-white/55",
      )}
    >
      {status === "locked" || status === "live" ? <Lock className="h-4 w-4" /> : status === "ready" ? <ShieldCheck className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
      {statusLabel(status)}
      {lockedAt ? <span className="hidden text-white/35 md:inline">· {new Date(lockedAt).toLocaleDateString()}</span> : null}
    </div>
  );
}

function Movement({ movement }: { movement: string }) {
  if (movement === "up") return <ArrowUp className="h-4 w-4 text-emerald-300" />;
  if (movement === "down") return <ArrowDown className="h-4 w-4 text-red-300" />;
  return <Minus className="h-4 w-4 text-white/35" />;
}

function EmptyRound() {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.025] text-center">
      <div>
        <Trophy className="mx-auto mb-4 h-10 w-10 text-white/25" />
        <h3 className="text-2xl font-black">Previous round required</h3>
        <p className="mt-2 max-w-sm text-sm text-white/45">Winners will advance here automatically once the previous stage is complete.</p>
      </div>
    </div>
  );
}

function EmptyInviteState() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-8 text-center">
      <Users className="mx-auto mb-4 h-9 w-9 text-white/25" />
      <h3 className="text-xl font-black">Invite friends to start your pool.</h3>
      <p className="mt-2 text-sm text-white/45">Your leaderboard gets exciting as more brackets lock.</p>
    </div>
  );
}

function IconCircle({ onClick, disabled, label, icon }: { onClick: () => void; disabled: boolean; label: string; icon: "left" | "right" }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/55 text-white disabled:opacity-35">
      <ChevronRight className={cn("h-5 w-5", icon === "left" && "rotate-180")} />
    </button>
  );
}

function FlagImage({ team, className }: { team: Team; className?: string }) {
  return <Image src={team.flagUrl} alt={`${team.name} flag`} width={320} height={240} className={className} unoptimized priority />;
}

function calculateStandings(groupPicks: GroupSelection): Record<string, StandingRow[]> {
  return Object.fromEntries(
    groups.map((group) => {
      const rows = group.teams.map((team, originalIndex) => ({ team, points: 0, wins: 0, originalIndex }));
      const selection = groupPicks[group.id] ?? {};
      rows.forEach((row) => {
        if (row.team.id === selection.first) {
          row.points = 7;
          row.wins = 2;
        } else if (row.team.id === selection.second) {
          row.points = 5;
          row.wins = 1;
        } else if (row.team.id === selection.third) {
          row.points = 3;
        }
      });
      return [group.id, rows.sort((a, b) => b.points - a.points || b.wins - a.wins || a.originalIndex - b.originalIndex)];
    }),
  );
}

function applyGroupRank(selection: { first?: string; second?: string; third?: string }, teamId: string, rank: RankKey) {
  const next = { ...selection };
  (["first", "second", "third"] as RankKey[]).forEach((key) => {
    if (next[key] === teamId) next[key] = undefined;
  });
  next[rank] = selection[rank] === teamId ? undefined : teamId;
  return next;
}

function rankForTeam(selection: { first?: string; second?: string; third?: string }, teamId: string): RankKey | undefined {
  if (selection.first === teamId) return "first";
  if (selection.second === teamId) return "second";
  if (selection.third === teamId) return "third";
  return undefined;
}

function rankClass(rank?: RankKey) {
  if (rank === "first") return "border-yellow-300/70 bg-yellow-300/10 shadow-[0_0_28px_rgb(250_204_21_/_0.24)]";
  if (rank === "second") return "border-slate-100/70 bg-white/10 shadow-[0_0_24px_rgb(226_232_240_/_0.18)]";
  if (rank === "third") return "border-amber-700/80 bg-amber-700/10 shadow-[0_0_24px_rgb(180_83_9_/_0.2)]";
  return "border-white/10";
}

function rankButtonClass(rank: RankKey) {
  if (rank === "first") return "border-yellow-200 bg-yellow-200 text-[#06101C]";
  if (rank === "second") return "border-white bg-white text-[#06101C]";
  return "border-amber-500 bg-amber-500 text-[#06101C]";
}

function getGroupProgress(groupSelections: GroupSelection) {
  const completed = groups.filter((group) => Boolean(groupSelections[group.id]?.first && groupSelections[group.id]?.second)).length;
  return { completed, total: groups.length, complete: completed === groups.length };
}

function getRoundProgress(matchups: Matchup[], picks: PickMap) {
  const playable = matchups.filter((matchup) => matchup.teamA && matchup.teamB);
  const completed = playable.filter((matchup) => picks[matchup.id]).length;
  return { completed, total: playable.length, complete: playable.length > 0 && completed === playable.length };
}

function getOverallCompletion(groupProgress: { completed: number; total: number }, knockoutProgress: Record<Exclude<StageKey, "groups">, { completed: number; total: number }>, championPicked: boolean) {
  const total = groupProgress.total + knockoutStages.reduce((sum, stage) => sum + knockoutProgress[stage].total, 0) + 1;
  const completed = groupProgress.completed + knockoutStages.reduce((sum, stage) => sum + knockoutProgress[stage].completed, 0) + (championPicked ? 1 : 0);
  return { completed, total, percent: Math.round((completed / total) * 100), requiredStarted: completed > 0 };
}

function buildRoundOf32FromStandings(standings: Record<string, StandingRow[]>): Matchup[] {
  const directTeams = groups.flatMap((group) => standings[group.id].slice(0, 2).map((row) => row.team));
  const thirdTeams = groups
    .map((group) => standings[group.id][2])
    .sort((a, b) => b.points - a.points || b.wins - a.wins || a.originalIndex - b.originalIndex)
    .slice(0, 8)
    .map((row) => row.team);
  const field = [...directTeams, ...thirdTeams];
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

function buildNextRound(stage: Exclude<StageKey, "groups" | "r32">, winners: Team[]): Matchup[] {
  return Array.from({ length: Math.ceil(winners.length / 2) }, (_, index) => ({
    id: `${stage}-${index + 1}`,
    stage,
    position: index,
    teamA: winners[index * 2],
    teamB: winners[index * 2 + 1],
  }));
}

function winnersFor(matchups: Matchup[], picks: PickMap) {
  return matchups
    .map((matchup) => {
      const pickedId = picks[matchup.id];
      return pickedId === matchup.teamA?.id ? matchup.teamA : pickedId === matchup.teamB?.id ? matchup.teamB : undefined;
    })
    .filter(Boolean) as Team[];
}

function downstreamStages(stage: StageKey) {
  const order: StageKey[] = ["groups", "r32", "r16", "qf", "sf", "final"];
  return order.slice(order.indexOf(stage) + 1);
}

function validateStageAccess(stage: PickStage, groupProgress: { complete: boolean }, knockoutProgress: Record<Exclude<StageKey, "groups">, { complete: boolean }>, championPicked: boolean) {
  if (stage === "groups") return { allowed: true, message: "" };
  if (!groupProgress.complete) return { allowed: false, message: "Complete all 12 groups first: every group needs 1st and 2nd." };
  if (stage === "r32") return { allowed: true, message: "" };
  if (!knockoutProgress.r32.complete) return { allowed: false, message: "Complete Round of 32 before advancing." };
  if (stage === "r16") return { allowed: true, message: "" };
  if (!knockoutProgress.r16.complete) return { allowed: false, message: "Complete Round of 16 before advancing." };
  if (stage === "qf") return { allowed: true, message: "" };
  if (!knockoutProgress.qf.complete) return { allowed: false, message: "Complete Quarter Final before advancing." };
  if (stage === "sf") return { allowed: true, message: "" };
  if (!knockoutProgress.sf.complete) return { allowed: false, message: "Complete Semi Final before advancing." };
  if (stage === "final") return { allowed: true, message: "" };
  if (!knockoutProgress.final.complete || !championPicked) return { allowed: false, message: "Pick your Final winner before review." };
  return { allowed: true, message: "" };
}

function calculateStats(groupSelections: GroupSelection, knockoutPicks: PickMap, champion?: Team) {
  let correct = 0;
  let completed = 0;
  let points = 0;

  groups.forEach((group) => {
    const pick = groupSelections[group.id];
    if (pick?.first) {
      completed += 1;
      if (pick.first === realResultsPlaceholder.groupFirst[group.id]) {
        correct += 1;
        points += scoringConfig.groupFirst;
      }
    }
    if (pick?.second) {
      completed += 1;
      if (pick.second === realResultsPlaceholder.groupSecond[group.id]) {
        correct += 1;
        points += scoringConfig.groupSecond;
      }
    }
    if (pick?.third) {
      completed += 1;
      if (pick.third === realResultsPlaceholder.groupThird[group.id]) {
        correct += 1;
        points += scoringConfig.groupThird;
      }
    }
  });

  Object.entries(knockoutPicks).forEach(([matchId, winnerId]) => {
    completed += 1;
    if (realResultsPlaceholder.knockout[matchId] === winnerId) {
      correct += 1;
      const stage = matchId.split("-")[0] as keyof typeof scoringConfig;
      points += typeof scoringConfig[stage] === "number" ? scoringConfig[stage] : 0;
    }
  });

  if (champion) {
    completed += 1;
    if (champion.id === "bra") {
      correct += 1;
      points += scoringConfig.championBonus;
    }
  }

  return {
    points,
    correct,
    missed: Math.max(0, completed - correct),
    predictionPercentage: completed ? Math.round((correct / completed) * 100) : 0,
  };
}

function getNextImpact(matchupsByStage: Record<Exclude<StageKey, "groups">, Matchup[]>, picks: PickMap) {
  for (const stage of knockoutStages) {
    const matchup = matchupsByStage[stage].find((item) => item.teamA && item.teamB && !picks[item.id]);
    if (matchup) return matchup;
  }
  return undefined;
}

function persistMockBracket(status: BracketStatus, lockedAt: string | undefined, champion: Team | undefined, stats: ReturnType<typeof calculateStats>) {
  const existing = JSON.parse(localStorage.getItem("goalpool.brackets") ?? "[]") as Array<Record<string, unknown>>;
  const bracket = {
    id: "goalpool-mock-bracket",
    name: "My 2026 GoalPool Bracket",
    status,
    lockedAt,
    championTeamId: champion?.id,
    championTeamName: champion?.name,
    totalPoints: stats.points,
    predictionPercentage: stats.predictionPercentage,
    shareSlug: "my-goalpool-bracket-dc1zf",
    createdAt: new Date().toISOString(),
  };
  const others = existing.filter((item) => item.id !== bracket.id);
  localStorage.setItem("goalpool.brackets", JSON.stringify([bracket, ...others]));
  window.dispatchEvent(new StorageEvent("storage", { key: "goalpool.brackets" }));
}

function statusLabel(status: BracketStatus) {
  if (status === "live") return "Live";
  if (status === "locked") return "Locked";
  if (status === "ready") return "Ready to Lock";
  if (status === "draft") return "Draft";
  return "Incomplete";
}
