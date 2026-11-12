import { Atom, FlaskConical, Dna, Calculator, type LucideIcon } from 'lucide-react';
import type { SubjectId } from '@/types/study';

const ICONS: Record<SubjectId, LucideIcon> = {
  biology: Dna,
  physics: Atom,
  chemistry: FlaskConical,
  mathematics: Calculator,
};

const ACCENT_BG: Record<string, string> = {
  emerald: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  sky: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 ring-cyan-500/30',
  amber: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
};

interface SubjectIconProps {
  subject: SubjectId;
  accent: string;
  className?: string;
  iconClassName?: string;
}

export default function SubjectIcon({ subject, accent, className = '', iconClassName = 'h-6 w-6' }: SubjectIconProps) {
  const Icon = ICONS[subject];
  const accentClass = ACCENT_BG[accent] ?? ACCENT_BG['cyan'];
  return (
    <span className={`inline-flex items-center justify-center rounded-xl ring-1 ${accentClass} ${className}`}>
      <Icon className={iconClassName} aria-hidden="true" />
    </span>
  );
}
