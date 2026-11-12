import { supabase } from '@/integrations/supabase/client';
import { readJson, writeJson, useStoredValue } from '@/lib/localStore';
import type { WeeklyChallenge, ChallengeQuestion, ChallengeSubmission, LeaderboardEntry } from '@/types/gamify';

const SUBMISSIONS_KEY = 'studyspace:challenge-submissions';
const LEADERBOARD_KEY = 'studyspace:leaderboard';

const NO_SUBMISSIONS: ChallengeSubmission[] = [];
const NO_LEADERBOARD: LeaderboardEntry[] = [];

function parseChallengeQuestion(value: unknown): ChallengeQuestion | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const question = value as Record<string, unknown>;
  if (
    typeof question['id'] !== 'string' ||
    typeof question['question'] !== 'string' ||
    !Array.isArray(question['options']) ||
    !question['options'].every((option) => typeof option === 'string') ||
    typeof question['answerIndex'] !== 'number' ||
    typeof question['explanation'] !== 'string'
  ) return null;
  return {
    id: question['id'],
    question: question['question'],
    options: question['options'],
    answerIndex: question['answerIndex'],
    explanation: question['explanation'],
  };
}

export function useChallengeSubmissions(): ChallengeSubmission[] {
  return useStoredValue<ChallengeSubmission[]>(SUBMISSIONS_KEY, NO_SUBMISSIONS);
}

export function useLeaderboard(): LeaderboardEntry[] {
  return useStoredValue<LeaderboardEntry[]>(LEADERBOARD_KEY, NO_LEADERBOARD);
}

export async function fetchActiveChallenge(): Promise<WeeklyChallenge | null> {
  const { data, error } = await supabase
    .from('studyspace_weekly_challenges')
    .select('id, week_key, title, description, subject, questions, time_limit_seconds, max_points, active')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return {
    id: data.id,
    week_key: data.week_key,
    title: data.title,
    description: data.description ?? '',
    subject: data.subject,
    questions: Array.isArray(data.questions)
      ? data.questions.flatMap((question) => {
          const parsed = parseChallengeQuestion(question);
          return parsed ? [parsed] : [];
        })
      : [],
    time_limit_seconds: data.time_limit_seconds,
    max_points: data.max_points,
    active: data.active,
  };
}

export async function submitChallenge(
  challenge: WeeklyChallenge,
  score: number,
  total: number,
  timeTakenSeconds: number
): Promise<{ pointsEarned: number; error: string | null }> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { pointsEarned: 0, error: 'Not signed in.' };

  const accuracy = total > 0 ? score / total : 0;
  const timeBonus = Math.max(0, 1 - timeTakenSeconds / (challenge.time_limit_seconds * 2));
  const pointsEarned = Math.round(accuracy * challenge.max_points * (0.7 + 0.3 * timeBonus));

  const { error } = await supabase.from('studyspace_challenge_submissions').insert({
    user_id: userData.user.id,
    challenge_id: challenge.id,
    score,
    total,
    time_taken_seconds: timeTakenSeconds,
    points_earned: pointsEarned,
  });

  if (error) {
    if (error.code === '23505') {
      return { pointsEarned: 0, error: 'You have already completed this challenge.' };
    }
    return { pointsEarned: 0, error: error.message };
  }

  await addToPoints(pointsEarned);

  const local = readJson<ChallengeSubmission[]>(SUBMISSIONS_KEY, []);
  const submission: ChallengeSubmission = {
    challenge_id: challenge.id,
    score,
    total,
    time_taken_seconds: timeTakenSeconds,
    points_earned: pointsEarned,
    taken_at: new Date().toISOString(),
  };
  writeJson(SUBMISSIONS_KEY, [submission, ...local].slice(0, 20));

  return { pointsEarned, error: null };
}

export async function addToPoints(points: number): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const { data: existing } = await supabase
    .from('studyspace_points')
    .select('total_points')
    .maybeSingle();

  const newTotal = (existing?.total_points ?? 0) + points;
  await supabase.from('studyspace_points').upsert({
    user_id: userData.user.id,
    total_points: newTotal,
    updated_at: new Date().toISOString(),
  });
}

export async function syncChallengeSubmissions(): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const { data } = await supabase
    .from('studyspace_challenge_submissions')
    .select('challenge_id, score, total, time_taken_seconds, points_earned, taken_at')
    .order('taken_at', { ascending: false });

  if (data) {
    const subs = data.map((row) => ({
      challenge_id: row.challenge_id,
      score: row.score,
      total: row.total,
      time_taken_seconds: row.time_taken_seconds,
      points_earned: row.points_earned,
      taken_at: row.taken_at,
    })) as ChallengeSubmission[];
    writeJson(SUBMISSIONS_KEY, subs.slice(0, 20));
  }
}

export async function syncLeaderboard(): Promise<void> {
  const { data } = await supabase
    .rpc('get_studyspace_leaderboard')
    .limit(50);

  if (data) {
    const entries = data.map((row) => ({
      display_name: row.display_name || 'Anonymous Student',
      total_points: row.total_points,
      updated_at: row.updated_at,
    })) as LeaderboardEntry[];
    writeJson(LEADERBOARD_KEY, entries);
  }
}
