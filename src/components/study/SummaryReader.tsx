import { useEffect, useMemo, useState } from 'react';
import { Lightbulb, Minus, Pause, Plus, Play, Square, Type, Volume2 } from 'lucide-react';
import RichText from '@/components/RichText';
import { useStoredValue, writeJson } from '@/lib/localStore';
import type { SummarySection } from '@/types/study';

const FONT_SCALE_KEY = 'studyspace:font-scale';
const FONT_SCALES = ['sm', 'md', 'lg', 'xl'] as const;
type FontScale = (typeof FONT_SCALES)[number];

const SCALE_LABELS: Record<FontScale, string> = { sm: 'Small', md: 'Medium', lg: 'Large', xl: 'Extra large' };
const BODY_CLASS: Record<FontScale, string> = { sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl' };
const ANALOGY_PREFIX = 'Local analogy:';

interface SummaryReaderProps {
  sections: SummarySection[];
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .trim();
}

export default function SummaryReader({ sections }: SummaryReaderProps) {
  const storedScale = useStoredValue<FontScale>(FONT_SCALE_KEY, 'md');
  const scaleIndex = Math.max(0, FONT_SCALES.indexOf(storedScale));
  const scale = FONT_SCALES[scaleIndex];
  const bodyClass = BODY_CLASS[scale];

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const fullText = useMemo(() => {
    return sections
      .map((section) => {
        const paragraphs = section.paragraphs
          .map((p) => stripMarkdown(p.replace(ANALOGY_PREFIX, 'Nigerian analogy:')))
          .join('. ');
        return `${section.heading}. ${paragraphs}`;
      })
      .join('. ');
  }, [sections]);

  const changeScale = (delta: number) => {
    const next = FONT_SCALES[Math.min(FONT_SCALES.length - 1, Math.max(0, scaleIndex + delta))];
    writeJson(FONT_SCALE_KEY, next);
  };

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const onEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.addEventListener('end', onEnd);
    return () => {
      window.speechSynthesis.removeEventListener('end', onEnd);
      window.speechSynthesis.cancel();
    };
  }, []);

  const startSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const pauseSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resumeSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stopSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-800 px-4 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-300">
          <Type className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          Text size: {SCALE_LABELS[scale]}
        </p>
        <div className="flex items-center gap-2">
          {speechSupported && (
            <div className="flex items-center gap-1.5">
              {!isSpeaking && (
                <button
                  type="button"
                  onClick={startSpeaking}
                  aria-label="Read aloud"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold text-slate-100 transition hover:border-cyan-500/60 hover:text-cyan-300"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Listen
                </button>
              )}
              {isSpeaking && !isPaused && (
                <button
                  type="button"
                  onClick={pauseSpeaking}
                  aria-label="Pause narration"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold text-slate-100 transition hover:border-amber-500/60 hover:text-amber-300"
                >
                  <Pause className="h-4 w-4" aria-hidden="true" />
                  Pause
                </button>
              )}
              {isSpeaking && isPaused && (
                <button
                  type="button"
                  onClick={resumeSpeaking}
                  aria-label="Resume narration"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold text-slate-100 transition hover:border-emerald-500/60 hover:text-emerald-300"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Resume
                </button>
              )}
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  aria-label="Stop narration"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 text-slate-100 transition hover:border-rose-500/60 hover:text-rose-300"
                >
                  <Square className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
          <button
            type="button"
            aria-label="Decrease text size"
            disabled={scaleIndex === 0}
            onClick={() => changeScale(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 text-slate-100 transition hover:border-cyan-500/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Increase text size"
            disabled={scaleIndex === FONT_SCALES.length - 1}
            onClick={() =>changeScale(1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 text-slate-100 transition hover:border-cyan-500/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {sections.map((section) => (
        <section key={section.heading} className="space-y-4">
          <h3 className="text-xl font-bold leading-[1.2] text-slate-50 sm:text-2xl">{section.heading}</h3>
          {section.paragraphs.map((paragraph, index) =>
            paragraph.startsWith(ANALOGY_PREFIX) ? (
              <aside key={index} className="flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
                <p className={`${bodyClass} leading-[1.5] text-emerald-50`}>
                  <span className="font-semibold text-emerald-300">Nigerian analogy: </span>
                  <RichText text={paragraph.slice(ANALOGY_PREFIX.length).trim()} />
                </p>
              </aside>
            ) : (
              <p key={index} className={`${bodyClass} leading-[1.5] text-slate-200`}>
                <RichText text={paragraph} />
              </p>
            )
          )}
        </section>
      ))}
    </div>
  );
}
