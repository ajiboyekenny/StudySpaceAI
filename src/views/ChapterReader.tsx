import { useState } from 'react';
import { ArrowLeft, BookOpen, ClipboardCheck, Layers, Timer, WifiOff, type LucideIcon } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import FlashcardDeck from '@/components/study/FlashcardDeck';
import QuizEngine from '@/components/study/QuizEngine';
import StudyTimer from '@/components/study/StudyTimer';
import SummaryReader from '@/components/study/SummaryReader';
import SubjectIcon from '@/components/SubjectIcon';
import { getSubject } from '@/data/catalog';
import type { Chapter, ChapterTab } from '@/types/study';

interface ChapterReaderProps {
  chapter: Chapter | null;
  initialTab: ChapterTab;
  onClose: () => void;
}

const TABS: { id: ChapterTab; label: string; icon: LucideIcon }[] = [
  { id: 'read', label: 'Read', icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz', label: 'Quiz', icon: ClipboardCheck },
  { id: 'timer', label: 'Timer', icon: Timer },
];

export default function ChapterReader({ chapter, initialTab, onClose }: ChapterReaderProps) {
  const [tab, setTab] = useState<ChapterTab>(initialTab);
  const subject = chapter ? getSubject(chapter.subject) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={chapter?.title ?? 'Chapter'}
      className="fixed inset-0 z-40 overflow-y-auto bg-slate-950"
    >
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <header className="sticky top-0 z-10 -mx-4 border-b border-slate-800 bg-slate-950/95 px-4 pb-3 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chapter"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition hover:border-cyan-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {subject && (
              <SubjectIcon subject={subject.id} accent={subject.accent} className="h-10 w-10 p-2" iconClassName="h-5 w-5" />
            )}
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-slate-50">{chapter?.title ?? 'Chapter unavailable'}</h2>
              {subject && <p className="text-xs text-slate-400">{subject.label}</p>}
            </div>
          </div>

          {chapter && (
            <div role="tablist" aria-label="Study modes" className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-slate-800 p-1">
              {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = id === tab;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTab(id)}
                    className={`flex min-h-10 items-center justify-center gap-2 rounded-lg text-xs font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:text-sm ${
                      isActive ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </header>

        <div className="pt-6">
          {chapter ? (
            <>
              {tab === 'read' && <SummaryReader sections={chapter.summary} />}
              {tab === 'flashcards' && <FlashcardDeck chapterId={chapter.id} cards={chapter.flashcards} />}
              {tab === 'quiz' && (
                <QuizEngine chapterId={chapter.id} subject={chapter.subject} questions={chapter.quiz} />
              )}
              {tab === 'timer' && <StudyTimer />}
            </>
          ) : (
            <EmptyState
              icon={WifiOff}
              title="Not saved for offline study"
              body="Zero-bandwidth mode only opens chapters saved on this device. Save this chapter first, or switch zero-bandwidth mode off."
            />
          )}
        </div>
      </div>
    </div>
  );
}
