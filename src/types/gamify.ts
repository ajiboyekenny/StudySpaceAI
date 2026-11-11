export type EducationLevel = 'secondary' | 'utme' | 'university';

export interface UserProfile {
  display_name: string;
  education_level: EducationLevel;
  selected_subjects: string[];
  onboarded: boolean;
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface WeeklyChallenge {
  id: string;
  week_key: string;
  title: string;
  description: string;
  subject: string;
  questions: ChallengeQuestion[];
  time_limit_seconds: number;
  max_points: number;
  active: boolean;
}

export interface ChallengeSubmission {
  challenge_id: string;
  score: number;
  total: number;
  time_taken_seconds: number;
  points_earned: number;
  taken_at: string;
}

export interface LeaderboardEntry {
  display_name: string;
  total_points: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-chapter',
    title: 'First Steps',
    description: 'Save your first chapter for offline study',
    icon: 'BookMarked',
    condition: 'saved_chapters >= 1',
  },
  {
    id: 'five-chapters',
    title: 'Collector',
    description: 'Save 5 chapters to your offline vault',
    icon: 'Library',
    condition: 'saved_chapters >= 5',
  },
  {
    id: 'ten-chapters',
    title: 'Library Builder',
    description: 'Save 10 chapters to your offline vault',
    icon: 'BookOpenCheck',
    condition: 'saved_chapters >= 10',
  },
  {
    id: 'first-quiz',
    title: 'Quiz Rookie',
    description: 'Complete your first quiz',
    icon: 'Pencil',
    condition: 'quiz_count >= 1',
  },
  {
    id: 'five-quizzes',
    title: 'Quiz Enthusiast',
    description: 'Complete 5 quizzes',
    icon: 'Brain',
    condition: 'quiz_count >= 5',
  },
  {
    id: 'high-scorer',
    title: 'High Scorer',
    description: 'Score 80% or higher on any quiz',
    icon: 'Star',
    condition: 'best_score >= 80',
  },
  {
    id: 'streak-3',
    title: 'On Fire',
    description: 'Maintain a 3-day study streak',
    icon: 'Flame',
    condition: 'streak >= 3',
  },
  {
    id: 'streak-7',
    title: 'Unstoppable',
    description: 'Maintain a 7-day study streak',
    icon: 'Zap',
    condition: 'streak >= 7',
  },
  {
    id: 'challenge-taker',
    title: 'Challenger',
    description: 'Complete a weekly challenge',
    icon: 'Sword',
    condition: 'challenges_done >= 1',
  },
  {
    id: 'century-points',
    title: 'Century Club',
    description: 'Earn 100 total points',
    icon: 'Award',
    condition: 'total_points >= 100',
  },
  {
    id: 'all-subjects',
    title: 'All-Rounder',
    description: 'Save at least one chapter in all 4 subjects',
    icon: 'GraduationCap',
    condition: 'subjects_covered >= 4',
  },
  {
    id: 'flashcard-master',
    title: 'Flashcard Master',
    description: 'Master 20 flashcards',
    icon: 'Layers',
    condition: 'mastered_cards >= 20',
  },
];
