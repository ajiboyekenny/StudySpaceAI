import {
  Award, BookMarked, BookOpenCheck, Brain, Flame, GraduationCap,
  Layers, Library, Pencil, Star, Sword, Zap,
  type LucideIcon,
} from 'lucide-react';
import { ACHIEVEMENTS } from '@/types/gamify';
import { useUnlockedAchievements } from '@/lib/achievements';

const ICONS: Record<string, LucideIcon> = {
  BookMarked, Library, BookOpenCheck, Pencil, Brain, Star,
  Flame, Zap, Sword, Award, GraduationCap, Layers,
};

export default function AchievementsGrid() {
  const unlocked = new Set(useUnlockedAchievements());

  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-slate-100">Achievements</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.has(achievement.id);
          const Icon = ICONS[achievement.icon] ?? Award;
          return (
            <div
              key={achievement.id}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                isUnlocked
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-slate-800 bg-slate-800/40 opacity-60'
              }`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                isUnlocked
                  ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
                  : 'bg-slate-700/50 text-slate-500'
              }`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className={`text-xs font-bold ${isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                  {achievement.title}
                </p>
                <p className="mt-0.5 text-[10px] leading-[1.4] text-slate-500">
                  {achievement.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
