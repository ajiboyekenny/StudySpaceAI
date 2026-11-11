import { ArrowRight, BookOpen, CloudOff, GraduationCap, LineChart, Sparkles, Swords, Trophy, Zap } from 'lucide-react';
import Logo from '@/components/Logo';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const PILLARS = [
  { icon: CloudOff, title: 'Offline Access', body: 'Download once, study with no mobile data.' },
  { icon: Sparkles, title: 'AI Powered', body: 'Summaries, flashcards and quizzes built in.' },
  { icon: BookOpen, title: 'Multi-Subject Learning', body: 'Biology, Physics, Chemistry, Mathematics.' },
  { icon: LineChart, title: 'Track Progress', body: 'Quiz scores, retention and study streaks.' },
];

const FEATURES = [
  { icon: Trophy, title: 'Weekly Challenges', body: 'Compete with students across Nigeria in timed quizzes and climb the leaderboard.' },
  { icon: Swords, title: 'Achievement Badges', body: 'Unlock 12 unique badges by saving chapters, mastering flashcards, and building streaks.' },
  { icon: GraduationCap, title: 'Personalized Onboarding', body: 'Tell us your education level and subjects. We tailor your dashboard from day one.' },
  { icon: CloudOff, title: 'Zero-Bandwidth Mode', body: 'Simulate offline learning. Save chapters on Wi-Fi and study anywhere with no data cost.' },
];

const STATS = [
  { value: '80', label: 'Chapters across 4 subjects' },
  { value: '12', label: 'Achievement badges to earn' },
  { value: '100%', label: 'Works offline after first load' },
];

export default function LandingView({ onGetStarted, onLogin }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-10 sm:px-6 sm:py-16">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Nigeria's offline STEM learning hub</p>
          <h1 className="mt-6 text-3xl font-bold leading-[1.15] text-slate-50 sm:text-4xl">
            StudySpace AI
          </h1>
          <p className="mt-3 text-base font-medium text-cyan-300">
            Download Once, Learn Everywhere
          </p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Learn · Practice · Excel
          </p>
          <p className="mt-5 max-w-md text-sm leading-[1.6] text-slate-400 sm:text-base">
            An AI-powered offline learning hub for Nigerian STEM students across UTME/JAMB,
            SSCE/WAEC, and University 100-Level. Save chapters to your phone and study with zero bandwidth.
          </p>

          <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 active:scale-[0.98]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-600 px-5 text-sm font-bold text-slate-100 transition hover:border-cyan-500/60 hover:bg-slate-800/60"
            >
              Login
            </button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-800/60 p-4"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
              <p className="text-xs leading-[1.5] text-slate-400">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-center text-lg font-bold text-slate-50">Why StudySpace matters</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm leading-[1.6] text-slate-400">
            Millions of Nigerian students lack reliable internet for online study. StudySpace AI
            brings quality STEM content to their phones, works without data, and keeps them motivated
            through gamified challenges and achievements.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4 text-center">
              <p className="text-2xl font-bold text-cyan-300">{stat.value}</p>
              <p className="mt-1 text-[10px] leading-[1.4] text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-800/60 p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
                <p className="mt-0.5 text-xs leading-[1.5] text-slate-400">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Zap className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
          Download once · Learn everywhere · Built for Nigerian STEM students
        </div>
      </div>
    </div>
  );
}
