import type { Chapter } from '@/types/study';
import type { QuizAttempt, StudyStreak } from '@/lib/studyProgress';
import type { ChallengeSubmission } from '@/types/gamify';
import { readJson, removeKey, useStoredValue, writeJson } from '@/lib/localStore';
import { persistSavedChapter, removeRemoteSavedChapter } from '@/lib/cloudStudySync';
import { evaluateAchievements, type AchievementStats } from '@/lib/achievements';
import { SUBJECTS, getChaptersForSubject } from '@/data/catalog';

export const APP_KEY_PREFIX = 'studyspace:';
export const CHAPTER_KEY_PREFIX = 'studyspace:chapter:';

const INDEX_KEY = 'studyspace:saved-chapters';

export interface SavedChapterSnapshot {
  savedAt: string;
  chapter: Chapter;
}

const chapterKey = (chapterId: string) => `${CHAPTER_KEY_PREFIX}${chapterId}`;

export function useSavedChapterIds(): string[] {
  return useStoredValue<string[]>(INDEX_KEY, []);
}

export function getSavedSnapshot(chapterId: string): SavedChapterSnapshot | null {
  return readJson<SavedChapterSnapshot | null>(chapterKey(chapterId), null);
}

export function saveChapterOffline(chapter: Chapter): boolean {
  const snapshot: SavedChapterSnapshot = { savedAt: new Date().toISOString(), chapter };
  if (!writeJson(chapterKey(chapter.id), snapshot)) return false;
  void persistSavedChapter(snapshot);
  const ids = readJson<string[]>(INDEX_KEY, []);
  if (!ids.includes(chapter.id)) writeJson(INDEX_KEY, [...ids, chapter.id]);
  void checkAchievementsOnSave();
  return true;
}

async function checkAchievementsOnSave() {
  const savedIds = readJson<string[]>(INDEX_KEY, []);
  const quizHistory = readJson<QuizAttempt[]>('studyspace:quiz-history', []);
  const streak = readJson<StudyStreak>('studyspace:study-streak', { lastStudyDate: '', currentStreak: 0, longestStreak: 0 });
  const challengeSubs = readJson<ChallengeSubmission[]>('studyspace:challenge-submissions', []);

  const subjectsCovered = SUBJECTS.filter((subject) => {
    const chapters = getChaptersForSubject(subject.id);
    return chapters.some((c) => savedIds.includes(c.id));
  }).length;

  let masteredCards = 0;
  savedIds.forEach((chId) => {
    const map = readJson<Record<string, string>>(`studyspace:cards:${chId}`, {});
    Object.values(map).forEach((status) => {
      if (status === 'mastered') masteredCards += 1;
    });
  });

  const bestScore = quizHistory.length > 0
    ? Math.max(...quizHistory.map((a) => Math.round((a.score / a.total) * 100)))
    : 0;

  const stats: AchievementStats = {
    saved_chapters: savedIds.length,
    quiz_count: quizHistory.length,
    best_score: bestScore,
    streak: streak.currentStreak,
    challenges_done: challengeSubs.length,
    total_points: challengeSubs.reduce((sum, s) => sum + s.points_earned, 0),
    subjects_covered: subjectsCovered,
    mastered_cards: masteredCards,
  };
  evaluateAchievements(stats);
}

export function removeSavedChapter(chapterId: string) {
  removeKey(chapterKey(chapterId));
  void removeRemoteSavedChapter(chapterId);
  const ids = readJson<string[]>(INDEX_KEY, []);
  writeJson(INDEX_KEY, ids.filter((id) => id !== chapterId));
}

export function clearSavedChapters() {
  const ids = readJson<string[]>(INDEX_KEY, []);
  ids.forEach((id) => void removeRemoteSavedChapter(id));
  ids.forEach((id) => removeKey(chapterKey(id)));
  removeKey(INDEX_KEY);
}
