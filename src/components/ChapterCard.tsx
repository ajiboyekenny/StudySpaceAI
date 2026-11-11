import { useState } from 'react';
import { BookOpen, Check, ClipboardCheck, HardDrive, Layers, Trash2, Zap } from 'lucide-react';
import SubjectIcon from '@/components/SubjectIcon';
import { getSubject } from '@/data/catalog';
import { removeSavedChapter, saveChapterOffline, useSavedChapterIds } from '@/lib/offlineLibrary';
import type { Chapter } from '@/types/study';

interface ChapterCardProps {
  chapter: Chapter;
  zeroBandwidth: boolean;
  onOpen: (chapterId: string, tab: 'read' | 'flashcards' | 'quiz') => void;
}

export default function ChapterCard({ chapter, zeroBandwidth, onOpen }: ChapterCardProps) {
  const savedIds = useSavedChapterIds();
  const [saveFailed, setSaveFailed] = useState(false);
  const isSaved = savedIds.includes(chapter.id);
  const subject = getSubject(chapter.subject);
  const canOpen = isSaved || !zeroBandwidth;

  const handleSave = () => {
    const saved = saveChapterOffline(chapter);
    setSaveFailed(!saved);
  };

  const handleRemove = () => {
    removeSavedChapter(chapter.id);
    setSaveFailed(false);
  };

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-800/80 p-4 shadow-lg shadow-black/20 transition duration-300 hover:border-cyan-500/40">
      <div className="flex items-start gap-3">
        <SubjectIcon subject={subject.id} accent={subject.accent} className="h-11 w-11 p-2.5" iconClassName="h-5 w-5" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-[1.3] text-slate-50">{chapter.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <HardDrive className="h-3 w-3" aria-hidden="true" />
              ~45 KB
            </span>
            <span>{chapter.flashcards.length} cards · {chapter.quiz.length} quiz</span>
          </div>
        </div>
        {isSaved && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
            <Check className="h-3 w-3" aria-hidden="true" />
            Saved Offline
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => canOpen && onOpen(chapter.id, 'read')}
          disabled={!canOpen}
          aria-label={`Read ${chapter.title}`}
          className="inline-flex min-h-10 flex-col items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/60 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Read
        </button>
        <button
          type="button"
          onClick={() => canOpen && onOpen(chapter.id, 'flashcards')}
          disabled={!canOpen}
          aria-label={`Flashcards for ${chapter.title}`}
          className="inline-flex min-h-10 flex-col items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/60 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Layers className="h-4 w-4" aria-hidden="true" />
          Flashcards
        </button>
        <button
          type="button"
          onClick={() => canOpen && onOpen(chapter.id, 'quiz')}
          disabled={!canOpen}
          aria-label={`Quiz for ${chapter.title}`}
          className="inline-flex min-h-10 flex-col items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/60 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
          Quiz
        </button>
      </div>

      {isSaved ? (
        <button
          type="button"
          onClick={handleRemove}
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-600 text-xs font-semibold text-slate-300 transition hover:border-rose-500/60 hover:text-rose-300"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Remove from Offline Cache
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.98]"
        >
          <Zap className="h-4 w-4" aria-hidden="true" />
          Save Offline
        </button>
      )}

      {saveFailed && <p className="text-center text-[11px] text-rose-300">Not enough space on this device to save this chapter.</p>}
      {!canOpen && !isSaved && (
        <p className="text-center text-[11px] text-slate-400">Zero-bandwidth mode is on. Save offline first to open this chapter.</p>
      )}
    </article>
  );
}
