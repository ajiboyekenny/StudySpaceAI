import { useEffect, useMemo, useState } from 'react';
import { Bell, Flame, Target, TrendingUp } from 'lucide-react';
import { readJson, writeJson } from '@/lib/localStore';

const GOAL_KEY = 'studyspace:daily-goal';
const QUIZ_HISTORY_KEY = 'studyspace:quiz-history';

interface QuizAttempt {
  chapterId: string;
  subject: string;
  score: number;
  total: number;
  takenAt: string;
}

interface DailyGoalState {
  dailyTarget: number;
  lastReminderDate: string;
}

const DEFAULT_STATE: DailyGoalState = {
  dailyTarget: 3,
  lastReminderDate: '',
};

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DailyGoalCard() {
  const [state, setState] = useState<DailyGoalState>(() => readJson(GOAL_KEY, DEFAULT_STATE));
  const [quizHistory] = useState<QuizAttempt[]>(() => readJson(QUIZ_HISTORY_KEY, []));
  const [editing, setEditing] = useState(false);

  const today = todayString();
  const todayQuizCount = useMemo(
    () => quizHistory.filter((q) => q.takenAt.slice(0, 10) === today).length,
    [quizHistory, today]
  );

  const goalMet = todayQuizCount >= state.dailyTarget;
  const progress = Math.min(100, Math.round((todayQuizCount / state.dailyTarget) * 100));

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (state.lastReminderDate === today) return;
    if (goalMet) return;

    const todayQuizTaken = quizHistory.filter((q) => q.takenAt.slice(0, 10) === today).length;
    if (todayQuizTaken > 0) {
      writeJson(GOAL_KEY, { ...state, lastReminderDate: today });
      setState({ ...state, lastReminderDate: today });
    }
  }, [state, goalMet, quizHistory, today]);

  const setTarget = (target: number) => {
    const next = { ...state, dailyTarget: Math.min(10, Math.max(1, target)) };
    setState(next);
    writeJson(GOAL_KEY, next);
    setEditing(false);
  };

  const requestReminder = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    const next = { ...state, lastReminderDate: today };
    setState(next);
    writeJson(GOAL_KEY, next);
  };

  const reminderEnabled = 'Notification' in window && Notification.permission === 'granted';

  return (
    <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800 to-slate-950 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${goalMet ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' : 'bg-amber-500/15 text-amber-300 ring-amber-500/30'}`}>
            {goalMet ? <Target className="h-5 w-5" aria-hidden="true" /> : <Flame className="h-5 w-5" aria-hidden="true" />}
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-50">Daily study goal</h2>
            <p className="text-xs text-slate-400">
              {goalMet
                ? `Goal reached! ${todayQuizCount} quiz${todayQuizCount === 1 ? '' : 'es'} taken today.`
                : `${todayQuizCount} / ${state.dailyTarget} quizzes today`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/60 hover:text-cyan-300"
        >
          {editing ? 'Done' : 'Set goal'}
        </button>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-700" role="meter" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${goalMet ? 'bg-emerald-500' : 'bg-amber-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {editing && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="w-full text-xs text-slate-400">Daily target: {state.dailyTarget} quiz{state.dailyTarget === 1 ? '' : 'es'}</p>
          {[1, 3, 5, 7, 10].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setTarget(n)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                state.dailyTarget === n
                  ? 'bg-cyan-500 text-slate-950'
                  : 'border border-slate-700 text-slate-300 hover:border-cyan-500/60'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {!editing && (
        <div className="mt-4 flex items-center justify-between">
          <p className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            Keep your streak alive — study daily
          </p>
          {!reminderEnabled && (
            <button
              type="button"
              onClick={requestReminder}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-cyan-500/60 hover:text-cyan-300"
            >
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
              Enable nudge
            </button>
          )}
          {reminderEnabled && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
              Nudges on
            </span>
          )}
        </div>
      )}
    </section>
  );
}
