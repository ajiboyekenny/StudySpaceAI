import { useState } from 'react';
import { ArrowRight, Check, GraduationCap, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';
import SubjectIcon from '@/components/SubjectIcon';
import { SUBJECTS } from '@/data/catalog';
import { setOnboardingComplete } from '@/lib/profileSync';
import type { EducationLevel } from '@/types/gamify';
import type { SubjectId } from '@/types/study';

const LEVELS: { id: EducationLevel; label: string; desc: string }[] = [
  { id: 'secondary', label: 'Secondary School', desc: 'SS1–SS3 / WAEC prep' },
  { id: 'utme', label: 'UTME / JAMB', desc: 'Preparing for JAMB exam' },
  { id: 'university', label: 'University 100-Level', desc: 'First-year undergrad' },
];

interface OnboardingViewProps {
  onComplete: () => void;
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<EducationLevel>('secondary');
  const [subjects, setSubjects] = useState<SubjectId[]>([]);

  const toggleSubject = (id: SubjectId) => {
    setSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const finish = () => {
    const finalName = name.trim() || 'Student';
    const finalSubjects = subjects.length > 0 ? subjects : SUBJECTS.map((s) => s.id);
    setOnboardingComplete(finalName, level, finalSubjects as string[]);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-10 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <Logo size="md" />
          <h1 className="mt-5 text-2xl font-bold text-slate-50">Welcome aboard!</h1>
          <p className="mt-2 text-sm text-slate-400">
            Let's set up your study space. This takes less than a minute.
          </p>

          <div className="mt-5 flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-cyan-400' : i < step ? 'w-2 bg-cyan-500/50' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your name (shown in the app)</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-h-12 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-slate-100 placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="What should we call you?"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="mt-8 space-y-3">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <GraduationCap className="h-5 w-5 text-cyan-300" aria-hidden="true" />
              Education level
            </div>
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  level === l.id
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{l.label}</p>
                  <p className="text-xs text-slate-400">{l.desc}</p>
                </div>
                {level === l.id && (
                  <Check className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                )}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-600 px-5 text-sm font-bold text-slate-100 transition hover:border-cyan-500/60"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-3">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Sparkles className="h-5 w-5 text-cyan-300" aria-hidden="true" />
              Pick your subjects
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => {
                const selected = subjects.includes(subject.id);
                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition ${
                      selected
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
                    }`}
                  >
                    <SubjectIcon subject={subject.id} accent={subject.accent} className="h-10 w-10 p-2.5" iconClassName="h-5 w-5" />
                    <p className="text-sm font-semibold text-slate-100">{subject.label}</p>
                    {selected && <Check className="h-4 w-4 text-cyan-300" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            <p className="pt-1 text-center text-xs text-slate-500">
              {subjects.length === 0 ? 'All subjects will be selected by default' : `${subjects.length} selected`}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-600 px-5 text-sm font-bold text-slate-100 transition hover:border-cyan-500/60"
              >
                Back
              </button>
              <button
                type="button"
                onClick={finish}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 active:scale-[0.98]"
              >
                Start studying
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
