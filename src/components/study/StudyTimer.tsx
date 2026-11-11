import { useEffect, useRef, useState } from 'react';
import { Bell, Coffee, Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react';
import { readJson, writeJson } from '@/lib/localStore';

const TIMER_STATE_KEY = 'studyspace:study-timer';
const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

type Phase = 'focus' | 'break' | 'idle';

interface TimerState {
  phase: Phase;
  remaining: number;
  running: boolean;
  completedSessions: number;
}

const DEFAULT_STATE: TimerState = {
  phase: 'idle',
  remaining: FOCUS_MINUTES * 60,
  running: false,
  completedSessions: 0,
};

function loadState(): TimerState {
  return readJson<TimerState>(TIMER_STATE_KEY, DEFAULT_STATE);
}

function saveState(state: TimerState) {
  writeJson(TIMER_STATE_KEY, state);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function StudyTimer() {
  const [state, setState] = useState<TimerState>(loadState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.running) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.remaining <= 1) {
            const wasFocus = prev.phase === 'focus';
            const nextPhase: Phase = wasFocus ? 'break' : 'focus';
            const nextSeconds = (wasFocus ? BREAK_MINUTES : FOCUS_MINUTES) * 60;
            const completed = wasFocus ? prev.completedSessions + 1 : prev.completedSessions;
            const next: TimerState = {
              ...prev,
              phase: nextPhase,
              remaining: nextSeconds,
              running: false,
              completedSessions: completed,
            };
            saveState(next);
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(wasFocus ? 'Focus session complete!' : 'Break over!', {
                body: wasFocus ? 'Time for a 5-minute break.' : 'Ready for another focus session?',
              });
            }
            return next;
          }
          const next: TimerState = { ...prev, remaining: prev.remaining - 1 };
          saveState(next);
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.running]);

  const start = () => {
    if (state.phase === 'idle') {
      const next = { ...state, phase: 'focus' as Phase, running: true };
      setState(next);
      saveState(next);
    } else {
      const next = { ...state, running: true };
      setState(next);
      saveState(next);
    }
  };

  const pause = () => {
    const next = { ...state, running: false };
    setState(next);
    saveState(next);
  };

  const reset = () => {
    const next: TimerState = { ...DEFAULT_STATE, completedSessions: state.completedSessions };
    setState(next);
    saveState(next);
  };

  const requestNotifications = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const isFocus = state.phase === 'focus' || state.phase === 'idle';
  const accentColor = isFocus ? 'text-cyan-300' : 'text-amber-300';
  const ringColor = isFocus ? 'ring-cyan-500/40' : 'ring-amber-500/40';
  const bgColor = isFocus ? 'bg-cyan-500/10' : 'bg-amber-500/10';
  const borderColor = isFocus ? 'border-cyan-500/30' : 'border-amber-500/30';
  const progress = isFocus
    ? 1 - state.remaining / (FOCUS_MINUTES * 60)
    : 1 - state.remaining / (BREAK_MINUTES * 60);

  return (
    <div className={`rounded-2xl border ${borderColor} ${bgColor} p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${ringColor} ${accentColor}`}>
            {isFocus ? <TimerIcon className="h-5 w-5" aria-hidden="true" /> : <Coffee className="h-5 w-5" aria-hidden="true" />}
          </span>
          <div>
            <p className="text-sm font-bold text-slate-100">Focus Timer</p>
            <p className="text-[11px] text-slate-400">
              {state.phase === 'break' ? 'Break time' : state.phase === 'idle' ? 'Ready to focus' : 'Focusing'}
              {' · '}{state.completedSessions} session{state.completedSessions === 1 ? '' : 's'} done
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={requestNotifications}
          aria-label="Enable notifications"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-cyan-500/60 hover:text-cyan-300"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative h-28 w-28" role="timer" aria-label={`Time remaining: ${formatTime(state.remaining)}`}>
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" strokeWidth="6" className="stroke-slate-700" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className={isFocus ? 'stroke-cyan-400' : 'stroke-amber-400'}
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold tabular-nums ${accentColor}`}>{formatTime(state.remaining)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {state.running ? (
            <button
              type="button"
              onClick={pause}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-bold text-slate-100 transition hover:border-cyan-500/60"
            >
              <Pause className="h-4 w-4" aria-hidden="true" />
              Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              {state.phase === 'idle' ? 'Start focus' : 'Resume'}
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            aria-label="Reset timer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 text-slate-100 transition hover:border-rose-500/60 hover:text-rose-300"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
