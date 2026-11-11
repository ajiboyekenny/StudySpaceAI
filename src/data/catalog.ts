import type { Chapter, SubjectInfo, SubjectId } from '@/types/study';
import { TOTAL_CHAPTERS_PER_SUBJECT } from '@/types/study';
import { biologyChapters } from '@/data/chapters/biology';
import { physicsChapters } from '@/data/chapters/physics';
import { chemistryChapters } from '@/data/chapters/chemistry';
import { mathematicsChapters } from '@/data/chapters/mathematics';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'biology',
    label: 'Biology',
    tagline: 'Cell, genetics, ecology & life processes',
    icon: 'dna',
    accent: 'emerald',
  },
  {
    id: 'physics',
    label: 'Physics',
    tagline: 'Mechanics, waves, electricity & modern physics',
    icon: 'atom',
    accent: 'sky',
  },
  {
    id: 'chemistry',
    label: 'Chemistry',
    tagline: 'Atomic theory, reactions & organic chemistry',
    icon: 'flask',
    accent: 'cyan',
  },
  {
    id: 'mathematics',
    label: 'Mathematics',
    tagline: 'Algebra, calculus, geometry & statistics',
    icon: 'calculator',
    accent: 'amber',
  },
];

const ALL_CHAPTERS: Chapter[] = [
  ...biologyChapters,
  ...physicsChapters,
  ...chemistryChapters,
  ...mathematicsChapters,
];

export function getSubject(subjectId: SubjectId): SubjectInfo {
  return SUBJECTS.find((s) => s.id === subjectId) as SubjectInfo;
}

export function getSubjectLabel(subjectId: SubjectId): string {
  return getSubject(subjectId).label;
}

export function getChaptersForSubject(subjectId: SubjectId): Chapter[] {
  return ALL_CHAPTERS.filter((chapter) => chapter.subject === subjectId).sort((a, b) => a.number - b.number);
}

export function getChapter(chapterId: string): Chapter | undefined {
  return ALL_CHAPTERS.find((chapter) => chapter.id === chapterId);
}

export function getAllChapters(): Chapter[] {
  return ALL_CHAPTERS;
}

export function totalChapterCount(): number {
  return SUBJECTS.length * TOTAL_CHAPTERS_PER_SUBJECT;
}
