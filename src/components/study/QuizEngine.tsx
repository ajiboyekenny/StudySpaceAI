import { useState } from 'react';
import { ClipboardCheck, RotateCcw, Trophy } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import {
  recordQuestionResult,
  recordQuizAttempt,
  useQuizHistory,
  useRetention,
} from '@/lib/studyProgress';
import type { QuizQuestion } from '@/types/study';

interface QuizEngineProps {
  chapterId: string;
  subject: string;
  questions: QuizQuestion[];
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

function optionClass(option: number, selected: number | null, answerIndex: number): string {
  if (selected === null) {
    return 'border-slate-700 bg-slate-800 hover:border-cyan-500/50 hover:bg-slate-700/60';
  }
  if (option === answerIndex) return 'border-emerald-500 bg-emerald-500/15 text-emerald-50';
  if (option === selected) return 'border-rose-500 bg-rose-500/15 text-rose-50';
  return 'border-slate-800 bg-slate-800/50 text-slate-400';
}

export default function QuizEngine({ chapterId, subject, questions }: QuizEngineProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const retention = useRetention(chapterId);
  const history = useQuizHistory().filter((attempt) => attempt.chapterId === chapterId);

  const question = questions[index];
  const percent = Math.round((score / questions.length) * 100);

  if (!question && !finished) {
    return <EmptyState title="No questions yet" body="This chapter does not have quiz questions yet." icon={ClipboardCheck} />;
  }

  const choose = (option: number) => {
    if (!question) return;
    if (selected !== null) return;
    const correct = option === question.answerIndex;
    setSelected(option);
    if (correct) setScore((value) => value + 1);
    recordQuestionResult(chapterId, question.id, correct);
  };

  const next = () => {
    if (index === questions.length - 1) {
      recordQuizAttempt({ chapterId, subject, score, total: questions.length, takenAt: new Date().toISOString() });
      setFinished(true);
      return;
    }
    setIndex(index + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const retentionPanel = (
    <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
      <p className="text-sm font-semibold text-slate-100">Memory retention</p>
      <p className="mb-4 mt-1 text-xs text-slate-400">Rises when you answer a question correctly and falls when you miss it.</p>
      <ul className="space-y-3">
        {questions.map((q, position) => {
          const value = retention[q.id] ?? 0;
          return (
            <li key={q.id} className="flex items-center gap-3 text-xs">
              <span className="w-8 shrink-0 font-semibold text-slate-300">Q{position + 1}</span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value}
                aria-label={`Retention for question ${position + 1}`}
              >
                <div className="h-full rounded-full bg-cyan-500 transition-all duration-500" style={{ width: `${value}%` }} />
              </div>
              <span className="w-10 shrink-0 text-right text-slate-300">{value}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  if (finished) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-cyan-500/30 bg-slate-800 p-8 text-center">
          <span className="rounded-full bg-cyan-500/15 p-3 text-cyan-300 ring-1 ring-cyan-500/30">
            <Trophy className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Quiz complete</p>
          <p className="text-4xl font-bold text-slate-50">
            {score} / {questions.length}
          </p>
          <p className="text-base text-slate-300">
            {percent}% correct.{' '}
            {percent >= 80 ? 'Excellent recall.' : percent >= 50 ? 'Good progress. Review the misses.' : 'Keep revising these topics.'}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Retake quiz
          </button>
        </div>
        {retentionPanel}
        {history.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-100">Score history</p>
            <ul className="divide-y divide-slate-700">
              {history.slice(0, 5).map((attempt) => (
                <li key={attempt.takenAt} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-slate-400">{new Date(attempt.takenAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-slate-100">
                    {attempt.score} / {attempt.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (!question) {
    return <EmptyState title="No questions yet" body="This chapter does not have quiz questions yet." icon={ClipboardCheck} />;
  }

  const answered = selected !== null;
  const isCorrect = selected === question.answerIndex;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-300">
          Question {index + 1} of {questions.length}
        </span>
        <span className="text-slate-400">Score: {score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-500"
          style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <h3 className="text-lg font-semibold leading-[1.5] text-slate-50 sm:text-xl">{question.question}</h3>

      <div className="space-y-3">
        {question.options.map((option, position) => (
          <button
            key={option}
            type="button"
            onClick={() => choose(position)}
            disabled={answered}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition duration-200 disabled:cursor-default sm:text-base ${optionClass(
              position,
              selected,
              question.answerIndex
            )}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900/70 text-xs font-bold text-slate-200">
              {OPTION_LABELS[position]}
            </span>
            <span className="leading-[1.5]">{option}</span>
          </button>
        ))}
      </div>

      {answered && (
        <div
          role="status"
          className={`rounded-xl border p-4 ${
            isCorrect ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-rose-500/40 bg-rose-500/10'
          }`}
        >
          <p className={`font-semibold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
            {isCorrect
              ? 'Correct!'
              : `Not quite. The answer is ${OPTION_LABELS[question.answerIndex]}.`}
          </p>
          <p className="mt-2 text-sm leading-[1.5] text-slate-200">{question.explanation}</p>
        </div>
      )}

      {answered && (
        <button
          type="button"
          onClick={next}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-cyan-500 px-4 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 active:scale-[0.98]"
        >
          {index === questions.length - 1 ? 'See my score' : 'Next question'}
        </button>
      )}

      {retentionPanel}
    </div>
  );
}
