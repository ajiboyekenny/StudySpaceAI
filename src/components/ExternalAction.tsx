import type { ReactNode } from 'react';

interface ExternalActionProps {
  href: string;
  label: string;
  icon: ReactNode;
  disabledReason: string | null;
  variant: 'primary' | 'secondary';
}

const BASE_CLASS =
  'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400';

const VARIANT_CLASS = {
  primary: 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/20 hover:bg-cyan-400 active:scale-[0.98]',
  secondary: 'border border-slate-600 text-slate-100 hover:border-cyan-500/60 hover:bg-slate-700/60 active:scale-[0.98]',
};

export default function ExternalAction({ href, label, icon, disabledReason, variant }: ExternalActionProps) {
  if (disabledReason !== null || !href) {
    return (
      <div className="flex w-full flex-col gap-1">
        <span
          aria-disabled="true"
          className={`${BASE_CLASS} cursor-not-allowed border border-slate-700 bg-slate-700/60 text-slate-400`}
        >
          {icon}
          {label}
        </span>
        <p className="text-center text-xs text-slate-400">{disabledReason ?? 'Link not available'}</p>
      </div>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${BASE_CLASS} ${VARIANT_CLASS[variant]}`}>
      {icon}
      {label}
    </a>
  );
}
