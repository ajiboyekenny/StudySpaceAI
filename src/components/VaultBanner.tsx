import { FolderOpen } from 'lucide-react';
import ExternalAction from '@/components/ExternalAction';

const VAULT_LINKS = { hundredLevel: '' };

interface VaultBannerProps {
  zeroBandwidth: boolean;
}

export default function VaultBanner({ zeroBandwidth }: VaultBannerProps) {
  const disabledReason = zeroBandwidth ? 'Turn off zero-bandwidth mode to open Google Drive' : null;

  return (
    <section className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-800 to-slate-950 p-5 shadow-xl shadow-black/30">
      <div className="flex items-start gap-3">
        <span className="shrink-0 rounded-xl bg-cyan-500/15 p-2.5 text-cyan-300 ring-1 ring-cyan-500/30">
          <FolderOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-bold leading-[1.2] text-slate-50 sm:text-lg">
            Lecture Notes, Past Questions & Practicals
          </h2>
          <p className="mt-1 text-xs leading-[1.5] text-slate-400 sm:text-sm">
            Open the shared 100-Level Science folder to download lecture slides, past questions, and practical manuals. Download once, learn everywhere.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-xs text-slate-300 sm:grid-cols-3">
        <p><span className="font-bold text-cyan-300">1.</span> Open the folder</p>
        <p><span className="font-bold text-cyan-300">2.</span> Tap a file and download it</p>
        <p><span className="font-bold text-cyan-300">3.</span> Reuse it offline from Files</p>
      </div>
      <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">
        StudySpace opens the folder; Google Drive handles the download. Once downloaded, the file remains on your phone until you remove it.
      </p>
      <div className="mt-4">
        <ExternalAction
          href={VAULT_LINKS.hundredLevel}
          label="Open 100L Science Vault on Google Drive"
          icon={<FolderOpen className="h-4 w-4" aria-hidden="true" />}
          disabledReason={disabledReason}
          variant="primary"
        />
      </div>
    </section>
  );
}
