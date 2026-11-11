export type SubjectId = 'biology' | 'physics' | 'chemistry' | 'mathematics';

export type ChapterTab = 'read' | 'flashcards' | 'quiz' | 'timer';

export interface SummarySection {
  heading: string;
  paragraphs: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  subject: SubjectId;
  number: number;
  title: string;
  summary: SummarySection[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface SubjectInfo {
  id: SubjectId;
  label: string;
  tagline: string;
  icon: 'dna' | 'atom' | 'flask' | 'calculator';
  accent: string;
}

export const TOTAL_CHAPTERS_PER_SUBJECT = 20;
