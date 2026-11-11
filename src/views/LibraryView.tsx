import { useState } from 'react';
import { BookDown, Check, ExternalLink, FileText, MessageCircle } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import SubjectIcon from '@/components/SubjectIcon';
import { getSubject } from '@/data/catalog';
import { TEXTBOOKS, TEXTBOOK_CATEGORIES, getTextbooksByCategory, type TextbookCategory } from '@/data/textbooks';
import { useZeroBandwidthMode } from '@/lib/appMode';

const VISITED_KEY = 'studyspace:visited-textbooks';
const WHATSAPP_LINK = 'https://wa.me/2347044833791?text=Hello%20StudySpace%20AI%2C%20I%20would%20like%20to%20suggest%20a%20textbook%20for%20the%20library.';

function getVisitedBooks(): string[] {
  try {
    const stored = localStorage.getItem(VISITED_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

export default function LibraryView() {
  const { enabled: zeroBandwidth } = useZeroBandwidthMode();
  const [selectedCategory, setSelectedCategory] = useState<TextbookCategory | 'all'>('all');
  const [visitedIds, setVisitedIds] = useState<string[]>(() => getVisitedBooks());
  const visibleTextbooks = selectedCategory === 'all' ? TEXTBOOKS : getTextbooksByCategory(selectedCategory);

  const visitSource = (id: string, url: string) => {
    const next = visitedIds.includes(id) ? visitedIds : [...visitedIds, id];
    setVisitedIds(next);
    localStorage.setItem(VISITED_KEY, JSON.stringify(next));
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-slate-800 to-slate-950 p-5 shadow-xl shadow-black/20 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30">
            <BookDown className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold leading-[1.2] text-slate-50 sm:text-lg">Open Textbook Library</h2>
            <p className="mt-1 text-xs leading-[1.6] text-slate-300 sm:text-sm">
              Browse trusted resources and download study files once. After a file is downloaded to your phone, you can open it again without mobile data.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-xs leading-[1.5] text-amber-100">
          <ExternalLink className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <span>Use Wi-Fi or mobile data to open a source and download a file. The downloaded file stays on your phone for offline study.</span>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-bold text-slate-100">Browse by subject</h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            aria-pressed={selectedCategory === 'all'}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${selectedCategory === 'all' ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 text-slate-300 hover:border-cyan-500/50'}`}
          >
            All ({TEXTBOOKS.length})
          </button>
          {TEXTBOOK_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              aria-pressed={selectedCategory === category.id}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${selectedCategory === category.id ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 text-slate-300 hover:border-cyan-500/50'}`}
            >
              {category.label} ({getTextbooksByCategory(category.id).length})
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visibleTextbooks.length === 0 ? (
          <div className="sm:col-span-2"><EmptyState icon={FileText} title="No textbooks here yet" body="More open resources will be added over time." /></div>
        ) : visibleTextbooks.map((textbook) => {
          const subject = getSubject(textbook.iconSubject);
          const visited = visitedIds.includes(textbook.id);
          return (
            <article key={textbook.id} className="group flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-800/80 p-5 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50">
              <div className="flex items-start gap-3">
                <SubjectIcon subject={subject.id} accent={subject.accent} className="h-12 w-12 shrink-0 p-3" iconClassName="h-6 w-6" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold leading-[1.35] text-slate-50">{textbook.title}</h4>
                  <p className="mt-1 text-[11px] text-slate-400">{textbook.author}</p>
                  <span className="mt-2 inline-flex rounded-full bg-slate-700 px-2.5 py-1 text-[10px] font-medium text-slate-200">{textbook.level}</span>
                </div>
                {visited && <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-label="Source visited" />}
              </div>
              <p className="text-xs leading-[1.6] text-slate-300">{textbook.description}</p>
              <div className="mt-auto">
                <button
                  type="button"
                  title="This opens the textbook source page. Download the book there."
                  onClick={() => visitSource(textbook.id, textbook.sourceUrl)}
                  disabled={zeroBandwidth}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open source & download once
                </button>
                {zeroBandwidth ? (
                  <p className="mt-1.5 text-center text-[11px] text-slate-400">Turn off zero-bandwidth mode to visit the source.</p>
                ) : (
                  <p className="mt-1.5 text-center text-[11px] text-slate-500">Download the PDF or book on the source page, then find it in your phone’s Downloads or Files app.</p>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5 text-center">
        <p className="text-sm font-semibold text-slate-100">More textbooks are coming</p>
        <p className="mx-auto mt-1 max-w-lg text-xs leading-[1.6] text-slate-400">We’ll keep growing this library as time goes on. Have a textbook suggestion for Nigerian STEM students?</p>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Suggest it on WhatsApp
        </a>
      </section>
    </div>
  );
}
