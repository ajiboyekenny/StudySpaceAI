import type { Chapter } from '@/types/study';
import type { CardStatus, CardStatusMap, QuizAttempt, RetentionMap, StudyStreak } from '@/lib/studyProgress';
import type { SavedChapterSnapshot } from '@/lib/offlineLibrary';
import { readJson, writeJson } from '@/lib/localStore';
import { supabase } from '@/integrations/supabase/client';
import { syncProfile } from '@/lib/profileSync';
import { syncAchievements } from '@/lib/achievements';
import { syncChallengeSubmissions, syncLeaderboard } from '@/lib/challengeSync';

interface CardProgressRow {
  chapter_id: string;
  card_id: string;
  status: CardStatus;
}

interface QuestionProgressRow {
  chapter_id: string;
  question_id: string;
  retention: number;
}

interface QuizAttemptRow {
  chapter_id: string;
  subject: string;
  score: number;
  total: number;
  taken_at: string;
}

interface StreakRow {
  last_study_date: string | null;
  current_streak: number;
  longest_streak: number;
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

function isChapter(value: unknown): value is Chapter {
  if (typeof value !== 'object' || value === null) return false;
  const chapter = value as Record<string, unknown>;
  return (
    typeof chapter['id'] === 'string' &&
    typeof chapter['subject'] === 'string' &&
    typeof chapter['number'] === 'number' &&
    typeof chapter['title'] === 'string' &&
    Array.isArray(chapter['summary']) &&
    Array.isArray(chapter['flashcards']) &&
    Array.isArray(chapter['quiz'])
  );
}

export async function persistSavedChapter(snapshot: SavedChapterSnapshot): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await supabase.from('studyspace_saved_chapters').upsert({
    user_id: userId,
    chapter_id: snapshot.chapter.id,
    chapter_snapshot: snapshot.chapter,
    saved_at: snapshot.savedAt,
  });
}

export async function removeRemoteSavedChapter(chapterId: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await supabase.from('studyspace_saved_chapters').delete().eq('user_id', userId).eq('chapter_id', chapterId);
}

export async function persistCardProgress(chapterId: string, cardId: string, status: CardStatus): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await supabase.from('studyspace_card_progress').upsert({
    user_id: userId,
    chapter_id: chapterId,
    card_id: cardId,
    status,
    updated_at: new Date().toISOString(),
  });
}

export async function persistQuestionProgress(chapterId: string, questionId: string, retention: number): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await supabase.from('studyspace_question_progress').upsert({
    user_id: userId,
    chapter_id: chapterId,
    question_id: questionId,
    retention,
    updated_at: new Date().toISOString(),
  });
}

export async function persistQuizAttempt(attempt: QuizAttempt): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await supabase.from('studyspace_quiz_attempts').insert({
    user_id: userId,
    chapter_id: attempt.chapterId,
    subject: attempt.subject,
    score: attempt.score,
    total: attempt.total,
    taken_at: attempt.takenAt,
  });
}

export async function persistStudyStreak(streak: StudyStreak): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await supabase.from('studyspace_streaks').upsert({
    user_id: userId,
    last_study_date: streak.lastStudyDate || null,
    current_streak: streak.currentStreak,
    longest_streak: streak.longestStreak,
    updated_at: new Date().toISOString(),
  });
}

export async function syncStudyData(): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;

  const [savedResult, cardsResult, questionsResult, attemptsResult, streakResult] = await Promise.all([
    supabase.from('studyspace_saved_chapters').select('chapter_id, chapter_snapshot, saved_at'),
    supabase.from('studyspace_card_progress').select('chapter_id, card_id, status'),
    supabase.from('studyspace_question_progress').select('chapter_id, question_id, retention'),
    supabase.from('studyspace_quiz_attempts').select('chapter_id, subject, score, total, taken_at').order('taken_at', { ascending: false }),
    supabase.from('studyspace_streaks').select('last_study_date, current_streak, longest_streak').maybeSingle(),
  ]);

  const savedRows = savedResult.data ?? [];
  const localSavedIds = readJson<string[]>('studyspace:saved-chapters', []);
  const savedIds = new Set(localSavedIds);
  savedRows.forEach((row) => {
    if (!isChapter(row.chapter_snapshot)) return;
    const local = readJson<SavedChapterSnapshot | null>(`studyspace:chapter:${row.chapter_id}`, null);
    if (!local || new Date(row.saved_at).getTime() >= new Date(local.savedAt).getTime()) {
      const snapshot: SavedChapterSnapshot = { savedAt: row.saved_at, chapter: row.chapter_snapshot };
      writeJson(`studyspace:chapter:${row.chapter_id}`, snapshot);
    }
    savedIds.add(row.chapter_id);
  });
  writeJson('studyspace:saved-chapters', [...savedIds]);

  const cardRows = (cardsResult.data ?? []) as CardProgressRow[];
  const cardMaps = new Map<string, CardStatusMap>();
  cardRows.forEach((row) => {
    const current = cardMaps.get(row.chapter_id) ?? {};
    cardMaps.set(row.chapter_id, { ...current, [row.card_id]: row.status });
  });
  cardMaps.forEach((map, chapterId) => writeJson(`studyspace:cards:${chapterId}`, map));

  const questionRows = (questionsResult.data ?? []) as QuestionProgressRow[];
  const retentionMaps = new Map<string, RetentionMap>();
  questionRows.forEach((row) => {
    const current = retentionMaps.get(row.chapter_id) ?? {};
    retentionMaps.set(row.chapter_id, { ...current, [row.question_id]: row.retention });
  });
  retentionMaps.forEach((map, chapterId) => writeJson(`studyspace:retention:${chapterId}`, map));

  const remoteAttempts = (attemptsResult.data ?? []) as QuizAttemptRow[];
  const localAttempts = readJson<QuizAttempt[]>('studyspace:quiz-history', []);
  const mergedAttempts = [...localAttempts, ...remoteAttempts.map((row) => ({
    chapterId: row.chapter_id,
    subject: row.subject,
    score: row.score,
    total: row.total,
    takenAt: row.taken_at,
  }))].filter((attempt, index, all) => all.findIndex((item) => item.chapterId === attempt.chapterId && item.takenAt === attempt.takenAt && item.score === attempt.score) === index);
  writeJson('studyspace:quiz-history', mergedAttempts.slice(0, 50));

  const remoteStreak = streakResult.data as StreakRow | null;
  if (remoteStreak) {
    writeJson('studyspace:study-streak', {
      lastStudyDate: remoteStreak.last_study_date ?? '',
      currentStreak: remoteStreak.current_streak,
      longestStreak: remoteStreak.longest_streak,
    });
  }

  await Promise.all([
    syncProfile(),
    syncAchievements(),
    syncChallengeSubmissions(),
    syncLeaderboard(),
  ]);
}
