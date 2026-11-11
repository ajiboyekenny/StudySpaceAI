import { ArrowRight, BookOpen, HardDrive, Library, LineChart, Swords, Trophy } from 'lucide-react';
import SubjectIcon from '@/components/SubjectIcon';
import VaultBanner from '@/components/VaultBanner';
import PwaStatusPanel from '@/components/PwaStatusPanel';
import DailyGoalCard from '@/components/study/DailyGoalCard';
import { SUBJECTS, getChaptersForSubject } from '@/data/catalog';
import { useSavedChapterIds } from '@/lib/offlineLibrary';
import { useQuizHistory, useStudyStreak } from '@/lib/studyProgress';
import { useChallengeSubmissions, useLeaderboard } from '@/lib/challengeSync';
import { useZeroBandwidthMode } from '@/lib/appMode';
import { useStorageBytes, formatBytes, STUDY_STORAGE_ALLOWANCE_BYTES } from '@/lib/storageUsage';
import { useProfile } from '@/lib/profileSync';
import type { SubjectId } from '@/types/study';
import type { TabId } from '@/components/BottomNav';

interface HubViewProps {
  onNavigate: (tab: TabId) => void;
  onSelectSubject: (subject: SubjectId) => void;
}

export default function HubView({ onNavigate, onSelectSubject }: HubViewProps) {
  const { enabled: zeroBandwidth } = useZeroBandwidthMode();
  const savedIds = useSavedChapterIds();
  const quizHistory = useQuizHistory();
  const streak = useStudyStreak();
  const bytes = useStorageBytes('studyspace:');
  const challengeSubs = useChallengeSubmissions();
  const leaderboard = useLeaderboard();
  const profile = useProfile();

  const savedCount = savedIds.length;
  const totalChapters = SUBJECTS.length * 20;
  const storagePct = Math.min(100, Math.round((bytes / STUDY_STORAGE_ALLOWANCE_BYTES) * 100));
  const totalPoints = challengeSubs.reduce((sum, s) => sum + s.points_earned, 0);
  const myRank = profile.display_name
    ? leaderboard.findIndex((e) => e.display_name === profile.display_name) + 1
    : 0;

  const quickActions: { label: string; icon: typeof BookOpen; tab: TabId }[] = [
    { label: 'Learning Center', icon: BookOpen, tab: 'learning' },
    { label: 'Weekly Challenge', icon: Swords, tab: 'challenge' },
    { label: 'Textbook Library', icon: Library, tab: 'library' },
    { label: 'Track Progress', icon: LineChart, tab: 'progress' },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800 to-slate-950 p-5 sm:p-6">
        <h2 className="text-lg font-bold leading-[1.2] text-slate-50">
          {profile.display_name ? `Welcome back, ${profile.display_name}` : 'Welcome to your learning hub'}
        </h2>
        <p className="mt-1 text-sm leading-[1.5] text-slate-400">
          Pick a subject to open its 20 chapters, or jump straight to your study tools below.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SUBJECTS.map((subject) => {
            const chapters = getChaptersForSubject(subject.id);
            const subjectSaved = chapters.filter((c) => savedIds.includes(c.id)).length;
            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => onSelectSubject(subject.id)}
                className="flex flex-col items-start gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left transition hover:border-cyan-500/50 hover:bg-slate-800/60"
              >
                <SubjectIcon subject={subject.id} accent={subject.accent} className="h-10 w-10 p-2.5" iconClassName="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold text-slate-100">{subject.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{subjectSaved}/{chapters.length} saved</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <VaultBanner zeroBandwidth={zeroBandwidth} />

      <DailyGoalCard />

      <section>
        <h2 className="mb-3 text-base font-bold text-slate-100">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map(({ label, icon: Icon, tab }) => (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(tab)}
              className="group flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-800/60 p-4 text-left transition hover:border-cyan-500/50"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Icon className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                {label}
              </span>
              <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-300" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
          <p className="text-xs text-slate-400">Chapters saved</p>
          <p className="mt-1 text-2xl font-bold text-slate-50">
            {savedCount}
            <span className="text-base font-medium text-slate-400"> / {totalChapters}</span>
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${(savedCount / totalChapters) * 100}%` }} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
          <p className="text-xs text-slate-400">Quizzes taken</p>
          <p className="mt-1 text-2xl font-bold text-slate-50">{quizHistory.length}</p>
          <p className="mt-3 text-xs text-slate-400">Keep practising to raise your mastery.</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
          <p className="text-xs text-slate-400">Study streak</p>
          <p className="mt-1 text-2xl font-bold text-amber-300">
            {streak.currentStreak} <span className="text-base font-medium text-slate-400">day{streak.currentStreak === 1 ? '' : 's'}</span>
          </p>
          <p className="mt-3 text-xs text-slate-400">Longest: {streak.longestStreak} days</p>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-slate-950 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
            <Trophy className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-50">Challenge points</h2>
            <p className="text-xs text-slate-400">
              {totalPoints > 0
                ? `${totalPoints} points earned${myRank > 0 ? ` · Rank #${myRank}` : ''}`
                : 'Complete weekly challenges to earn points'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('challenge')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
          >
            <Swords className="h-4 w-4" aria-hidden="true" />
            Play
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-100">Offline storage</p>
          <p className="text-xs text-slate-400">{formatBytes(bytes)} / {formatBytes(STUDY_STORAGE_ALLOWANCE_BYTES)}</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700" role="meter" aria-valuenow={storagePct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-cyan-500 transition-all duration-500" style={{ width: `${storagePct}%` }} />
        </div>
        <button
          type="button"
          onClick={() => onNavigate('offline')}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          Manage storage
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </section>

      <PwaStatusPanel />
    </div>
  );
}
