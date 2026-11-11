import { Inbox, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  body: string;
  icon?: LucideIcon;
}

export default function EmptyState({ title, body, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-800/50 px-6 py-12 text-center">
      <span className="rounded-full bg-slate-800 p-3 text-cyan-300 ring-1 ring-slate-700">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="max-w-sm text-sm leading-[1.5] text-slate-400">{body}</p>
    </div>
  );
}
