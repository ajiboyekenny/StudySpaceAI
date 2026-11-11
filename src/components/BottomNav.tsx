import { Home, HardDrive, Library, LineChart, BookOpen, Swords, type LucideIcon } from 'lucide-react';

export type TabId = 'hub' | 'learning' | 'challenge' | 'library' | 'progress' | 'offline';

const TABS: { id: TabId; label: string; fullLabel: string; icon: LucideIcon }[] = [
  { id: 'hub', label: 'Home', fullLabel: 'Home / Hub', icon: Home },
  { id: 'learning', label: 'Learn', fullLabel: 'Learning Center', icon: BookOpen },
  { id: 'challenge', label: 'Challenge', fullLabel: 'Weekly Challenge', icon: Swords },
  { id: 'library', label: 'Library', fullLabel: 'Textbook Library', icon: Library },
  { id: 'progress', label: 'Progress', fullLabel: 'Track Progress', icon: LineChart },
  { id: 'offline', label: 'Offline', fullLabel: 'Offline Vault', icon: HardDrive },
];

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto grid max-w-5xl grid-cols-6">
        {TABS.map(({ id, label, fullLabel, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-label={fullLabel}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-16 w-full flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400 ${
                  isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors duration-200 ${
                    isActive ? 'bg-cyan-500/15' : ''
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
