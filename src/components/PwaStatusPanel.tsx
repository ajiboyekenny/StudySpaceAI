import { useEffect, useState } from 'react';
import { CheckCircle2, Download, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaStatusPanel() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    const onAppInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener('appinstalled', onAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const statuses = [
    {
      icon: installed ? CheckCircle2 : Download,
      label: installed ? 'Installed on device' : 'Installable',
      color: installed ? 'text-emerald-300 bg-emerald-500/15 ring-emerald-500/30' : 'text-slate-300 bg-slate-700/50 ring-slate-600',
      action: !installed && installPrompt ? { label: 'Install', onClick: handleInstall } : null,
    },
    {
      icon: isOnline ? Wifi : WifiOff,
      label: isOnline ? 'Online' : 'Offline mode',
      color: isOnline ? 'text-cyan-300 bg-cyan-500/15 ring-cyan-500/30' : 'text-amber-300 bg-amber-500/15 ring-amber-500/30',
      action: null,
    },
    {
      icon: CheckCircle2,
      label: 'App shell cached for offline use',
      color: 'text-emerald-300 bg-emerald-500/15 ring-emerald-500/30',
      action: null,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
      <h2 className="text-sm font-bold text-slate-100">App status</h2>
      <div className="mt-3 space-y-2.5">
        {statuses.map((status, i) => {
          const Icon = status.icon;
          return (
            <div key={i} className="flex items-center gap-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${status.color}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex-1 text-xs font-semibold text-slate-200">{status.label}</span>
              {status.action && (
                <button
                  type="button"
                  onClick={status.action.onClick}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-[11px] font-bold text-slate-950 transition hover:bg-cyan-400"
                >
                  <Download className="h-3 w-3" aria-hidden="true" />
                  {status.action.label}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 space-y-2 border-t border-slate-700 pt-3 text-[11px] text-slate-400">
        <p className="flex items-center gap-1.5 text-slate-500">
          <RefreshCw className="h-3 w-3" aria-hidden="true" />
          Updates install automatically when online
        </p>
        {!installed && !installPrompt && (
          <p className="leading-[1.5]">
            On iPhone: tap the browser Share button, then choose <span className="font-semibold text-slate-300">Add to Home Screen</span>. On Android, open the browser menu and choose <span className="font-semibold text-slate-300">Install app</span> or <span className="font-semibold text-slate-300">Add to Home screen</span>.
          </p>
        )}
      </div>
    </section>
  );
}
