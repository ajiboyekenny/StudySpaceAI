import { HardDrive, Trash2 } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import SubjectIcon from '@/components/SubjectIcon';
import { getChapter, getSubject } from '@/data/catalog';
import { clearSavedChapters, getSavedSnapshot, removeSavedChapter, useSavedChapterIds } from '@/lib/offlineLibrary';
import { useZeroBandwidthMode } from '@/lib/appMode';
import { formatBytes, STUDY_STORAGE_ALLOWANCE_BYTES, useStorageBytes } from '@/lib/storageUsage';
import type { ChapterTab } from '@/types/study';

interface OfflineVaultViewProps {
  onOpenChapter: (chapterId: string, tab: ChapterTab) => void;
}

export default function OfflineVaultView({ onOpenChapter }: OfflineVaultViewProps) {
  const savedIds = useSavedChapterIds();
  const { enabled: zeroBandwidth } = useZeroBandwidthMode();
  const bytes = useStorageBytes('studyspace:');
  const storagePct = Math.min(100, Math.round((bytes / STUDY_STORAGE_ALLOWANCE_BYTES) * 100));

  const snapshots = savedIds
    .map((id) => getSavedSnapshot(id))
    .filter((snapshot): snapshot is NonNullable<typeof snapshot> => snapshot !== null)
    .sort((a, b) => a.chapter.subject.localeCompare(b.chapter.subject) || a.chapter.number - b.chapter.number);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30">
            <HardDrive className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-100">Offline storage</h2>
            <p className="text-xs text-slate-400">{formatBytes(bytes)} / {formatBytes(STUDY_STORAGE_ALLOWANCE_BYTES)} used</p>
          </div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-700" role="meter" aria-valuenow={storagePct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-cyan-500 transition-all duration-500" style={{ width: `${storagePct}%` }} />
        </div>
        {zeroBandwidth && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
            Zero-bandwidth mode is ON — only saved chapters will open.
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">Saved chapters ({snapshots.length})</h2>
          {snapshots.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Remove all saved chapters from this device?')) clearSavedChapters();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-rose-500/60 hover:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clear all
            </button>
          )}
        </div>

        {snapshots.length === 0 ? (
          <EmptyState
            icon={HardDrive}
            title="No saved chapters yet"
            body="Open the Learning Center and tap Save Offline on any chapter. It will appear here and stay available without mobile data."
          />
        ) : (
          <ul className="space-y-3">
            {snapshots.map(({ chapter, savedAt }) => {
              const subject = getSubject(chapter.subject);
              return (
                <li key={chapter.id} className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
                  <div className="flex items-start gap-3">
                    <SubjectIcon subject={subject.id} accent={subject.accent} className="h-10 w-10 p-2.5" iconClassName="h-5 w-5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-100">{chapter.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {subject.label} · Saved {new Date(savedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSavedChapter(chapter.id)}
                      aria-label={`Remove ${chapter.title} from offline cache`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-rose-500/60 hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenChapter(chapter.id, 'read')}
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-700 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300"
                    >
                      Read
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenChapter(chapter.id, 'flashcards')}
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-700 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300"
                    >
                      Flashcards
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenChapter(chapter.id, 'quiz')}
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-700 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300"
                    >
                      Quiz
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="text-center text-xs text-slate-500">
        Saved chapters are stored only on this device in your browser. Clearing your browser data will remove them.
      </p>
    </div>
  );
}
