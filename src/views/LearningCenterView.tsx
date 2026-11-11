import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ChapterCard from '@/components/ChapterCard';
import SubjectIcon from '@/components/SubjectIcon';
import { SUBJECTS, getChaptersForSubject } from '@/data/catalog';
import { useZeroBandwidthMode } from '@/lib/appMode';
import type { Chapter, ChapterTab, SubjectId } from '@/types/study';

interface LearningCenterViewProps {
  initialSubject: SubjectId | null;
  onOpenChapter: (chapterId: string, tab: ChapterTab) => void;
}

export default function LearningCenterView({ initialSubject, onOpenChapter }: LearningCenterViewProps) {
  const { enabled: zeroBandwidth } = useZeroBandwidthMode();
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(initialSubject ?? 'biology');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const chapters = getChaptersForSubject(selectedSubject);
  const isExpanded = (chapter: Chapter) => expanded.has(chapter.id);

  const toggle = (chapter: Chapter) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(chapter.id)) next.delete(chapter.id);
      else next.add(chapter.id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <section>
        <h2 className="mb-3 text-base font-bold text-slate-100">Choose a subject</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SUBJECTS.map((subject) => {
            const isActive = subject.id === selectedSubject;
            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => setSelectedSubject(subject.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                  isActive
                    ? 'border-cyan-500/60 bg-cyan-500/10'
                    : 'border-slate-800 bg-slate-800/60 hover:border-slate-600'
                }`}
              >
                <SubjectIcon subject={subject.id} accent={subject.accent} className="h-10 w-10 p-2.5" iconClassName="h-5 w-5" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">{subject.label}</p>
                  <p className="truncate text-[11px] text-slate-400">20 chapters</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">All chapters</h2>
          <span className="text-xs text-slate-400">{chapters.length} chapters</span>
        </div>
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <div key={chapter.id}>
              <button
                type="button"
                onClick={() => toggle(chapter)}
                aria-expanded={isExpanded(chapter)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/60 px-4 py-3 text-left transition hover:border-slate-600"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-slate-300">
                  {chapter.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-100">{chapter.title}</span>
                  <span className="block text-[11px] text-slate-400">
                    {chapter.flashcards.length} cards · {chapter.quiz.length} quiz · ~45 KB
                  </span>
                </span>
                {isExpanded(chapter) ? (
                  <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                )}
              </button>
              {isExpanded(chapter) && (
                <div className="mt-2">
                  <ChapterCard chapter={chapter} zeroBandwidth={zeroBandwidth} onOpen={onOpenChapter} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
