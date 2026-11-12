import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import RichText from '@/components/RichText';
import { setCardStatus, useCardStatuses, type CardStatus } from '@/lib/studyProgress';
import type { Flashcard } from '@/types/study';

interface FlashcardDeckProps {
  chapterId: string;
  cards: Flashcard[];
}

const STATUS_LABELS: Record<CardStatus, string> = { mastered: 'Mastered', review: 'Needs review' };
const STATUS_BADGE: Record<CardStatus, string> = {
  mastered: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/40',
  review: 'bg-amber-500/15 text-amber-300 ring-amber-500/40',
};

export default function FlashcardDeck({ chapterId, cards }: FlashcardDeckProps) {
  const statuses = useCardStatuses(chapterId);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  const masteredCount = cards.filter((c) => statuses[c.id] === 'mastered').length;
  const reviewCount = cards.filter((c) => statuses[c.id] === 'review').length;
  const allRated = masteredCount + reviewCount === cards.length;

  if (!card) {
    return <p className="rounded-lg border border-slate-700 p-4 text-sm text-slate-300">No flashcards are available for this chapter.</p>;
  }

  const cardStatus = statuses[card.id];

  const goTo = (next: number) => {
    setIndex(next);
    setFlipped(false);
  };

  const mark = (status: CardStatus) => {
    setCardStatus(chapterId, card.id, status);
    if (index < cards.length - 1) goTo(index + 1);
  };

  const restart = () => goTo(0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
        <div className="rounded-xl bg-slate-800 px-2 py-3">
          <p className="font-bold text-emerald-300">{masteredCount}</p>
          <p className="text-slate-400">Mastered</p>
        </div>
        <div className="rounded-xl bg-slate-800 px-2 py-3">
          <p className="font-bold text-amber-300">{reviewCount}</p>
          <p className="text-slate-400">Needs review</p>
        </div>
        <div className="rounded-xl bg-slate-800 px-2 py-3">
          <p className="font-bold text-slate-100">
            {index + 1} / {cards.length}
          </p>
          <p className="text-slate-400">Card</p>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Show the term' : 'Reveal the explanation'}
        onClick={() => setFlipped((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setFlipped((value) => !value);
          }
        }}
        className="cursor-pointer [perspective:1200px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl"
      >
        <div
          className="relative min-h-[16rem] w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center shadow-xl [backface-visibility:hidden]">
            <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-cyan-300">Term</span>
            <p className="text-2xl font-bold leading-[1.2] text-slate-50">
              <RichText text={card.front} />
            </p>
            {cardStatus && (
              <span className={`mt-5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_BADGE[cardStatus]}`}>
                {STATUS_LABELS[cardStatus]}
              </span>
            )}
            <p className="mt-6 text-xs text-slate-400">Tap to reveal the meaning</p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-cyan-500/40 bg-slate-800 p-6 text-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-300">Plain English</span>
            <p className="text-lg leading-[1.5] text-slate-100">
              <RichText text={card.back} />
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => mark('review')}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20 active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Needs Review
        </button>
        <button
          type="button"
          onClick={() => mark('mastered')}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 active:scale-[0.98]"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Mastered
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </button>
        {allRated ? (
          <button
            type="button"
            onClick={restart}
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            Review from the start
          </button>
        ) : (
          <span className="text-xs text-slate-400">Tap the card to flip it</span>
        )}
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === cards.length - 1}
          className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
