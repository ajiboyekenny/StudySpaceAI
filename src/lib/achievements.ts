import { supabase } from '@/integrations/supabase/client';
import { readJson, writeJson, useStoredValue } from '@/lib/localStore';
import { ACHIEVEMENTS, type Achievement } from '@/types/gamify';

const UNLOCKED_KEY = 'studyspace:unlocked-achievements';

const NO_ACHIEVEMENTS: string[] = [];

export function useUnlockedAchievements(): string[] {
  return useStoredValue<string[]>(UNLOCKED_KEY, NO_ACHIEVEMENTS);
}

export function getUnlockedAchievements(): string[] {
  return readJson<string[]>(UNLOCKED_KEY, []);
}

export interface AchievementStats {
  saved_chapters: number;
  quiz_count: number;
  best_score: number;
  streak: number;
  challenges_done: number;
  total_points: number;
  subjects_covered: number;
  mastered_cards: number;
}

export function evaluateAchievements(stats: AchievementStats): string[] {
  const unlocked = new Set(getUnlockedAchievements());
  const newlyUnlocked: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlocked.has(achievement.id)) continue;
    if (meetsCondition(achievement, stats)) {
      unlocked.add(achievement.id);
      newlyUnlocked.push(achievement.id);
    }
  }

  if (newlyUnlocked.length > 0) {
    const all = [...unlocked];
    writeJson(UNLOCKED_KEY, all);
    void persistAchievements(newlyUnlocked);
  }

  return newlyUnlocked;
}

function meetsCondition(achievement: Achievement, stats: AchievementStats): boolean {
  switch (achievement.id) {
    case 'first-chapter': return stats.saved_chapters >= 1;
    case 'five-chapters': return stats.saved_chapters >= 5;
    case 'ten-chapters': return stats.saved_chapters >= 10;
    case 'first-quiz': return stats.quiz_count >= 1;
    case 'five-quizzes': return stats.quiz_count >= 5;
    case 'high-scorer': return stats.best_score >= 80;
    case 'streak-3': return stats.streak >= 3;
    case 'streak-7': return stats.streak >= 7;
    case 'challenge-taker': return stats.challenges_done >= 1;
    case 'century-points': return stats.total_points >= 100;
    case 'all-subjects': return stats.subjects_covered >= 4;
    case 'flashcard-master': return stats.mastered_cards >= 20;
    default: return false;
  }
}

async function persistAchievements(ids: string[]): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;
  const userId = userData.user.id;
  const rows = ids.map((id) => ({
    user_id: userId,
    achievement_id: id,
    unlocked_at: new Date().toISOString(),
  }));
  await supabase.from('studyspace_achievements').upsert(rows);
}

export async function syncAchievements(): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;
  const { data } = await supabase
    .from('studyspace_achievements')
    .select('achievement_id, unlocked_at');
  if (data) {
    const local = new Set(readJson<string[]>(UNLOCKED_KEY, []));
    data.forEach((row) => local.add(row.achievement_id));
    writeJson(UNLOCKED_KEY, [...local]);
  }
}
