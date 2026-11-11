import { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft, ArrowRight, Check, Clock, Crown, Loader2,
  Swords, Trophy, X, Zap,
} from 'lucide-react';
import type { WeeklyChallenge, ChallengeQuestion } from '@/types/gamify';
import {
  fetchActiveChallenge, submitChallenge,
  useChallengeSubmissions, useLeaderboard,
} from '@/lib/challengeSync';
import { useProfile } from '@/lib/profileSync';

type Phase = 'intro' | 'quiz' | 'result';

export default function ChallengeView() {
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<{ score: number; total: number; points: number; time: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submissions = useChallengeSubmissions();
  const leaderboard = useLeaderboard();
  const profile = useProfile();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const ch = await fetchActiveChallenge();
      if (mounted) {
        setChallenge(ch);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const alreadyDone = challenge
    ? submissions.some((s) => s.challenge_id === challenge.id)
    : false;

  const startQuiz = useCallback(() => {
    if (!challenge) return;
    setPhase('quiz');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setShowFeedback(false);
    setTimeLeft(challenge.time_limit_seconds);
  }, [challenge]);

  useEffect(() => {
    if (phase !== 'quiz' || !challenge) return;
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft, challenge]);

  const handleAnswer = (index: number) => {
    if (showFeedback || !challenge) return;
    setSelected(index);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (!challenge || selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    setShowFeedback(false);
    if (currentQ + 1 < challenge.questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = useCallback(async (allAnswers?: number[]) => {
    if (!challenge) return;
    const finalAnswers = allAnswers ?? answers;
    const score = finalAnswers.reduce(
      (sum, ans, i) => sum + (ans === challenge.questions[i]?.answerIndex ? 1 : 0),
      0
    );
    const total = challenge.questions.length;
    const timeUsed = challenge.time_limit_seconds - timeLeft;
    setSubmitting(true);
    const { pointsEarned, error: submitError } = await submitChallenge(challenge, score, total, timeUsed);
    setSubmitting(false);
    if (submitError && submitError !== 'You have already completed this challenge.') {
      setError(submitError);
    }
    setResult({ score, total, points: pointsEarned, time: timeUsed });
    setPhase('result');
  }, [challenge, answers, timeLeft]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" aria-hidden="true" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-100">Weekly Challenge</h2>
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-12 text-center">
          <Swords className="mx-auto h-10 w-10 text-slate-600" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-400">No active challenge right now. Check back soon!</p>
        </div>
      </div>
    );
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const question: ChallengeQuestion | undefined = challenge.questions[currentQ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-cyan-900/40 to-slate-950 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30">
            <Swords className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-50">Weekly Challenge</h2>
            <p className="text-xs text-slate-400">{challenge.title}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-[1.5] text-slate-300">{challenge.description}</p>
        <div className="mt-4 flex gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 font-semibold text-slate-300">
            <Clock className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
            {Math.floor(challenge.time_limit_seconds / 60)} min
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 font-semibold text-slate-300">
            <Zap className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            {challenge.max_points} pts max
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 font-semibold text-slate-300">
            {challenge.questions.length} questions
          </span>
        </div>
      </section>

      {phase === 'intro' && (
        <section className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5">
          {alreadyDone ? (
            <div className="text-center">
              <Check className="mx-auto h-10 w-10 text-emerald-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-slate-100">You've completed this challenge!</p>
              <p className="mt-1 text-xs text-slate-400">
                You earned {submissions.find((s) => s.challenge_id === challenge.id)?.points_earned ?? 0} points.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-bold text-slate-100">Ready to test yourself?</h3>
              <p className="mt-2 text-xs leading-[1.5] text-slate-400">
                Answer {challenge.questions.length} questions as fast as you can. Higher accuracy and
                faster times earn more points on the leaderboard.
              </p>
              <button
                type="button"
                onClick={startQuiz}
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 active:scale-[0.98]"
              >
                Start Challenge
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}
        </section>
      )}

      {phase === 'quiz' && question && (
        <section className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400">
              Question {currentQ + 1} of {challenge.questions.length}
            </p>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              timeLeft < 30 ? 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30' : 'bg-slate-800 text-cyan-300'
            }`}>
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${((currentQ) / challenge.questions.length) * 100}%` }}
            />
          </div>

          <h3 className="mt-5 text-base font-bold leading-[1.3] text-slate-50">{question.question}</h3>

          <div className="mt-4 space-y-2.5">
            {question.options.map((option, index) => {
              const isCorrect = index === question.answerIndex;
              const isSelected = selected === index;
              let className = 'border-slate-700 bg-slate-900/60 hover:border-slate-600 text-slate-200';
              if (showFeedback) {
                if (isCorrect) {
                  className = 'border-emerald-500 bg-emerald-500/10 text-emerald-200';
                } else if (isSelected) {
                  className = 'border-rose-500 bg-rose-500/10 text-rose-200';
                } else {
                  className = 'border-slate-700 bg-slate-900/60 text-slate-500';
                }
              } else if (isSelected) {
                className = 'border-cyan-500 bg-cyan-500/10 text-cyan-200';
              }
              return (
                <button
                  key={index}
                  type="button"
                  disabled={showFeedback}
                  onClick={() => handleAnswer(index)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition ${className}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                  {showFeedback && isCorrect && <Check className="ml-auto h-4 w-4" aria-hidden="true" />}
                  {showFeedback && isSelected && !isCorrect && <X className="ml-auto h-4 w-4" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/80 p-3.5">
              <p className="text-xs leading-[1.5] text-slate-300">{question.explanation}</p>
            </div>
          )}

          {showFeedback && (
            <button
              type="button"
              onClick={nextQuestion}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.98]"
            >
              {currentQ + 1 < challenge.questions.length ? 'Next Question' : 'See Results'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </section>
      )}

      {phase === 'result' && result && (
        <section className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5 text-center">
          {submitting ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400" aria-hidden="true" />
          ) : (
            <>
              <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                result.score / result.total >= 0.7
                  ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
              }`}>
                <Trophy className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-50">
                {result.score} / {result.total}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {result.score / result.total >= 0.7 ? 'Excellent work!' : 'Keep practising!'}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                  <p className="text-2xl font-bold text-amber-300">+{result.points}</p>
                  <p className="text-[11px] text-slate-400">Points earned</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                  <p className="text-2xl font-bold text-cyan-300">{formatTime(result.time)}</p>
                  <p className="text-[11px] text-slate-400">Time taken</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhase('intro')}
                className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 text-sm font-bold text-slate-100 transition hover:border-cyan-500/60"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Challenge
              </button>
            </>
          )}
        </section>
      )}

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-100">
          <Crown className="h-5 w-5 text-amber-300" aria-hidden="true" />
          Leaderboard
        </h3>
        {leaderboard.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-8 text-center text-sm text-slate-400">
            No entries yet. Be the first to score!
          </div>
        ) : (
          <ul className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-800/40">
            {leaderboard.slice(0, 10).map((entry, i) => {
              const isYou = entry.display_name === profile.display_name && profile.display_name !== '';
              return (
                <li key={i} className={`flex items-center gap-3 px-4 py-3 ${isYou ? 'bg-cyan-500/5' : ''}`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0 ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                    : i === 1 ? 'bg-slate-400/20 text-slate-200 ring-1 ring-slate-400/30'
                    : i === 2 ? 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/30'
                    : 'text-slate-400'
                  }`}>
                    {i + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-100">
                    {entry.display_name}
                    {isYou && <span className="ml-2 text-[10px] text-cyan-300">(You)</span>}
                  </p>
                  <span className="text-sm font-bold text-amber-300">{entry.total_points}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {error && (
        <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
