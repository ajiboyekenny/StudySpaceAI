import { LogOut, Wifi, WifiOff } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/lib/auth';
import { useZeroBandwidthMode } from '@/lib/appMode';
import { useProfile } from '@/lib/profileSync';

export default function AppHeader() {
  const { enabled, setEnabled } = useZeroBandwidthMode();
  const { user, signOut } = useAuth();
  const profile = useProfile();
  const displayName = profile.display_name || user?.email?.split('@')[0] || '';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold leading-[1.2] text-slate-50 sm:text-lg">StudySpace AI</h1>
            <p className="truncate text-xs text-slate-400">Download once · Learn everywhere</p>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-[10rem] truncate text-xs text-slate-400 sm:inline">{displayName}</span>
              <button
                type="button"
                onClick={() => signOut()}
                aria-label="Log out"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-700 px-3 text-xs font-semibold text-slate-200 transition hover:border-rose-500/60 hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label="Simulate zero-bandwidth mode"
              onClick={() => setEnabled(!enabled)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                enabled ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  enabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-xs font-semibold tracking-wide text-slate-100 sm:text-sm">
              SIMULATE ZERO-BANDWIDTH MODE
            </span>
          </div>

          {enabled ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-300 ring-1 ring-emerald-500/40">
              <WifiOff className="h-3 w-3" aria-hidden="true" />
              OFFLINE CACHE ACTIVE
            </span>
          ) : (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-700 px-2.5 py-1 text-[11px] font-bold tracking-wide text-slate-300">
              <Wifi className="h-3 w-3" aria-hidden="true" />
              LIVE
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
