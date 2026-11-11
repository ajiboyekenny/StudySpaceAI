import { readJson, useStoredValue, writeJson } from '@/lib/localStore';
import { persistCardProgress, persistQuestionProgress, persistQuizAttempt, persistStudyStreak } from '@/lib/cloudStudySync';
import { evaluateAchievements, type AchievementStats } from '@/lib/achievements';
import { SUBJECTS, getChaptersForSubject } from '@/data/catalog';
import type { ChallengeSubmission, LeaderboardEntry } from '@/types/gamify';
import type { UserProfile } from '@/types/gamify';

export type CardStatus = 'mastered' | 'review';
export type CardStatusMap = Record<string, CardStatus>;
export type RetentionMap = Record<string, number>;

export interface QuizAttempt {
  chapterId: string;
  subject: string;
  score: number;
  total: number;
  takenAt: string;
}

const QUIZ_HISTORY_KEY = 'studyspace:quiz-history';
const STUDY_STREAK_KEY = 'studyspace:study-streak';
const MAX_QUIZ_HISTORY = 50;
const NO_CARD_STATUSES: CardStatusMap = {};
const NO_RETENTION: RetentionMap = {};
const NO_ATTEMPTS: QuizAttempt[] = [];

const cardStatusKey = (chapterId: string) => `studyspace:cards:${chapterId}`;
const retentionKey = (chapterId: string) => `studyspace:retention:${chapterId}`;

export function useCardStatuses(chapterId: string): CardStatusMap {
  return useStoredValue<CardStatusMap>(cardStatusKey(chapterId), NO_CARD_STATUSES);
}

export function setCardStatus(chapterId: string, cardId: string, status: CardStatus) {
  const current = readJson<CardStatusMap>(cardStatusKey(chapterId), {});
  writeJson(cardStatusKey(chapterId), { ...current, [cardId]: status });
  void persistCardProgress(chapterId, cardId, status);
}

export function useRetention(chapterId: string): RetentionMap {
  return useStoredValue<RetentionMap>(retentionKey(chapterId), NO_RETENTION);
}

export function recordQuestionResult(chapterId: string, questionId: string, correct: boolean) {
  const current = readJson<RetentionMap>(retentionKey(chapterId), {});
  const previous = current[questionId] ?? 0;
  const next = Math.min(100, Math.max(0, previous + (correct ? 25 : -25)));
  writeJson(retentionKey(chapterId), { ...current, [questionId]: next });
  void persistQuestionProgress(chapterId, questionId, next);
}

export function useQuizHistory(): QuizAttempt[] {
  return useStoredValue<QuizAttempt[]>(QUIZ_HISTORY_KEY, NO_ATTEMPTS);
}

export function recordQuizAttempt(attempt: QuizAttempt) {
  const history = readJson<QuizAttempt[]>(QUIZ_HISTORY_KEY, []);
  writeJson(QUIZ_HISTORY_KEY, [attempt, ...history].slice(0, MAX_QUIZ_HISTORY));
  void persistQuizAttempt(attempt);
  touchStudyStreak();
  void checkAndUnlockAchievements();
}

function computeAchievementStats(): AchievementStats {
  const savedIds = readJson<string[]>('studyspace:saved-chapters', []);
  const quizHistory = readJson<QuizAttempt[]>(QUIZ_HISTORY_KEY, []);
  const streak = readJson<StudyStreak>(STUDY_STREAK_KEY, { lastStudyDate: '', currentStreak: 0, longestStreak: 0 });
  const challengeSubs = readJson<ChallengeSubmission[]>('studyspace:challenge-submissions', []);
  const leaderboard = readJson<LeaderboardEntry[]>('studyspace:leaderboard', []);

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

  const profile = readJson<UserProfile>('studyspace:profile', { display_name: '', education_level: 'secondary', selected_subjects: [], onboarded: false });
  const myEntry = leaderboard.find((e) => e.display_name === profile.display_name && profile.display_name !== '');
  const totalPoints = challengeSubs.reduce((sum, s) => sum + s.points_earned, 0)
    + (myEntry?.total_points ?? 0);

  return {
    saved_chapters: savedIds.length,
    quiz_count: quizHistory.length,
    best_score: bestScore,
    streak: streak.currentStreak,
    challenges_done: challengeSubs.length,
    total_points: totalPoints,
    subjects_covered: subjectsCovered,
    mastered_cards: masteredCards,
  };
}

async function checkAndUnlockAchievements() {
  const stats = computeAchievementStats();
  evaluateAchievements(stats);
}

export interface StudyStreak {
  lastStudyDate: string;
  currentStreak: number;
  longestStreak: number;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string): number {
  const ms = new Date(a).getTime() - new Date(b).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function touchStudyStreak() {
  const streak = readJson<StudyStreak>(STUDY_STREAK_KEY, {
    lastStudyDate: '',
    currentStreak: 0,
    longestStreak: 0,
  });
  const today = todayString();
  if (streak.lastStudyDate === today) return;
  const newStreak = streak.lastStudyDate && dayDiff(today, streak.lastStudyDate) === 1 ? streak.currentStreak + 1 : 1;
  const next: StudyStreak = {
    lastStudyDate: today,
    currentStreak: newStreak,
    longestStreak: Math.max(streak.longestStreak, newStreak),
  };
  writeJson(STUDY_STREAK_KEY, next);
  void persistStudyStreak(next);
}

export function useStudyStreak(): StudyStreak {
  return useStoredValue<StudyStreak>(STUDY_STREAK_KEY, {
    lastStudyDate: '',
    currentStreak: 0,
    longestStreak: 0,
  });
}
