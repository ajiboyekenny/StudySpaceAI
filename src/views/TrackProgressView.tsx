import { useMemo } from 'react';
import { Flame, Target, TrendingUp, AlertCircle } from 'lucide-react';
import SubjectIcon from '@/components/SubjectIcon';
import AchievementsGrid from '@/components/AchievementsGrid';
import { SUBJECTS, getChaptersForSubject, totalChapterCount } from '@/data/catalog';
import { useSavedChapterIds } from '@/lib/offlineLibrary';
import { useQuizHistory, useStudyStreak, useCardStatuses } from '@/lib/studyProgress';
import { useChallengeSubmissions } from '@/lib/challengeSync';
import { readJson } from '@/lib/localStore';

interface SubjectStat {
  subjectId: string;
  label: string;
  accent: string;
  saved: number;
  total: number;
  bestScore: number | null;
  attempts: number;
  avgScore: number | null;
}

export default function TrackProgressView() {
  const savedIds = useSavedChapterIds();
  const quizHistory = useQuizHistory();
  const streak = useStudyStreak();
  const challengeSubs = useChallengeSubmissions();

  const overallSaved = savedIds.length;
  const totalChapters = totalChapterCount();
  const completionPct = Math.round((overallSaved / totalChapters) * 100);

  const subjectStats = useMemo<SubjectStat[]>(() => {
    return SUBJECTS.map((subject) => {
      const chapters = getChaptersForSubject(subject.id);
      const subjectSaved = chapters.filter((c) => savedIds.includes(c.id)).length;
      const attempts = quizHistory.filter((a) => a.subject === subject.id);
      const scores = attempts.map((a) => Math.round((a.score / a.total) * 100));
      const bestScore = scores.length > 0 ? Math.max(...scores) : null;
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length) : null;
      return {
        subjectId: subject.id,
        label: subject.label,
        accent: subject.accent,
        saved: subjectSaved,
        total: chapters.length,
        bestScore,
        avgScore,
        attempts: attempts.length,
      };
    });
  }, [savedIds, quizHistory]);

  const totalAttempts = quizHistory.length;
  const avgAccuracy =
    totalAttempts > 0
      ? Math.round(quizHistory.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) / totalAttempts)
      : 0;

  const totalChallengePoints = challengeSubs.reduce((sum, s) => sum + s.points_earned, 0);

  const weakSubjects = useMemo(() => {
    return subjectStats
      .filter((s) => s.avgScore !== null && s.avgScore < 60)
      .sort((a, b) => (a.avgScore ?? 100) - (b.avgScore ?? 100));
  }, [subjectStats]);

  const masteredCardCount = useMemo(() => {
    let count = 0;
    savedIds.forEach((chId) => {
      const map = readJson<Record<string, string>>(`studyspace:cards:${chId}`, {});
      Object.values(map).forEach((status) => {
        if (status === 'mastered') count += 1;
      });
    });
    return count;
  }, [savedIds]);

  const quizScoreData = useMemo(() => {
    return quizHistory.slice(0, 10).reverse().map((a) => Math.round((a.score / a.total) * 100));
  }, [quizHistory]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800 to-slate-950 p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-100">Overall completion</h2>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-3xl font-bold text-slate-50">{completionPct}%</p>
          <p className="pb-1 text-xs text-slate-400">{overallSaved} of {totalChapters} chapters saved</p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-700" role="meter" aria-valuenow={completionPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500" style={{ width: `${completionPct}%` }} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
            <Flame className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-2 text-2xl font-bold text-slate-50">{streak.currentStreak}</p>
          <p className="text-[11px] text-slate-400">Day streak</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30">
            <Target className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-2 text-2xl font-bold text-slate-50">{avgAccuracy}%</p>
          <p className="text-[11px] text-slate-400">Avg accuracy</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-2 text-2xl font-bold text-slate-50">{totalAttempts}</p>
          <p className="text-[11px] text-slate-400">Quizzes taken</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-2 text-2xl font-bold text-slate-50">{totalChallengePoints}</p>
          <p className="text-[11px] text-slate-400">Challenge points</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
        <h2 className="text-sm font-bold text-slate-100">Quiz score trend</h2>
        {quizScoreData.length === 0 ? (
          <p className="mt-3 text-xs text-slate-400">No quiz data yet. Take a quiz to see your trend.</p>
        ) : (
          <div className="mt-4 flex items-end gap-1.5" style={{ height: '120px' }}>
            {quizScoreData.map((score, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all duration-500 ${
                    score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ height: `${Math.max(4, score)}%` }}
                  title={`${score}%`}
                />
                <span className="text-[9px] text-slate-500">{score}</span>
              </div>
            ))}
          </div>
        )}
        {masteredCardCount > 0 && (
          <p className="mt-3 border-t border-slate-700 pt-3 text-xs text-slate-400">
            Flashcards mastered: <span className="font-bold text-emerald-300">{masteredCardCount}</span>
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold text-slate-100">Subject mastery</h2>
        <div className="space-y-3">
          {subjectStats.map((stat) => {
            const savedPct = Math.round((stat.saved / stat.total) * 100);
            return (
              <div key={stat.subjectId} className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                <div className="flex items-center gap-3">
                  <SubjectIcon subject={stat.subjectId as 'biology'} accent={stat.accent} className="h-10 w-10 p-2.5" iconClassName="h-5 w-5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100">{stat.label}</p>
                    <p className="text-[11px] text-slate-400">{stat.saved}/{stat.total} saved · {stat.attempts} quiz attempts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-50">{stat.bestScore === null ? '—' : `${stat.bestScore}%`}</p>
                    <p className="text-[10px] text-slate-400">Best score</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full rounded-full bg-cyan-500 transition-all duration-500" style={{ width: `${savedPct}%` }} />
                </div>
                {stat.avgScore !== null && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    Average: <span className={`font-semibold ${stat.avgScore >= 70 ? 'text-emerald-300' : stat.avgScore >= 50 ? 'text-amber-300' : 'text-rose-300'}`}>{stat.avgScore}%</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {weakSubjects.length > 0 && (
        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-amber-200">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
            Focus areas
          </h2>
          <p className="mt-2 text-xs text-slate-400">These subjects need more practice:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {weakSubjects.map((s) => (
              <span key={s.subjectId} className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-500/30">
                {s.label} · {s.avgScore}%
              </span>
            ))}
          </div>
        </section>
      )}

      <AchievementsGrid />

      <section>
        <h2 className="mb-3 text-base font-bold text-slate-100">Recent quiz activity</h2>
        {quizHistory.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-8 text-center text-sm text-slate-400">
            No quizzes taken yet. Open a chapter and take its quiz to start tracking your progress.
          </div>
        ) : (
          <ul className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-800/40">
            {quizHistory.slice(0, 8).map((attempt) => {
              const subject = SUBJECTS.find((s) => s.id === attempt.subject);
              const pct = Math.round((attempt.score / attempt.total) * 100);
              return (
                <li key={attempt.takenAt} className="flex items-center gap-3 px-4 py-3">
                  {subject && (
                    <SubjectIcon subject={subject.id} accent={subject.accent} className="h-8 w-8 p-2" iconClassName="h-4 w-4" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-200">{subject?.label ?? 'Quiz'}</p>
                    <p className="text-[11px] text-slate-400">{new Date(attempt.takenAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-bold ${pct >= 80 ? 'text-emerald-300' : pct >= 50 ? 'text-amber-300' : 'text-rose-300'}`}>
                    {attempt.score}/{attempt.total}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
