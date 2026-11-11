CREATE TABLE public.studyspace_profiles (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  education_level text NOT NULL DEFAULT 'secondary' CHECK (education_level IN ('secondary','utme','university')),
  selected_subjects jsonb NOT NULL DEFAULT '[]'::jsonb,
  onboarded boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.studyspace_saved_chapters (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  chapter_id text NOT NULL,
  chapter_snapshot jsonb NOT NULL,
  saved_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, chapter_id)
);
CREATE TABLE public.studyspace_card_progress (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  chapter_id text NOT NULL,
  card_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('mastered','review')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, chapter_id, card_id)
);
CREATE TABLE public.studyspace_question_progress (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  chapter_id text NOT NULL,
  question_id text NOT NULL,
  retention integer NOT NULL DEFAULT 0 CHECK (retention BETWEEN 0 AND 100),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, chapter_id, question_id)
);
CREATE TABLE public.studyspace_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  chapter_id text NOT NULL,
  subject text NOT NULL,
  score integer NOT NULL CHECK (score >= 0),
  total integer NOT NULL CHECK (total > 0),
  taken_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX studyspace_quiz_attempts_user_taken_idx ON public.studyspace_quiz_attempts (user_id, taken_at DESC);
CREATE TABLE public.studyspace_streaks (
  user_id uuid PRIMARY KEY DEFAULT auth.uid(),
  last_study_date date,
  current_streak integer NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak integer NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.studyspace_weekly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  subject text NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  time_limit_seconds integer NOT NULL DEFAULT 300,
  max_points integer NOT NULL DEFAULT 100,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.studyspace_challenge_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  challenge_id uuid NOT NULL REFERENCES public.studyspace_weekly_challenges(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0),
  total integer NOT NULL CHECK (total > 0),
  time_taken_seconds integer NOT NULL CHECK (time_taken_seconds >= 0),
  points_earned integer NOT NULL DEFAULT 0 CHECK (points_earned >= 0),
  taken_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, challenge_id)
);
CREATE TABLE public.studyspace_achievements (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  achievement_id text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);
CREATE TABLE public.studyspace_points (
  user_id uuid PRIMARY KEY DEFAULT auth.uid(),
  total_points integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.studyspace_profiles, public.studyspace_saved_chapters, public.studyspace_card_progress, public.studyspace_question_progress, public.studyspace_quiz_attempts, public.studyspace_streaks TO authenticated;
GRANT SELECT ON public.studyspace_weekly_challenges TO authenticated;
GRANT SELECT, INSERT ON public.studyspace_challenge_submissions, public.studyspace_achievements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.studyspace_points TO authenticated;
GRANT ALL ON public.studyspace_profiles, public.studyspace_saved_chapters, public.studyspace_card_progress, public.studyspace_question_progress, public.studyspace_quiz_attempts, public.studyspace_streaks, public.studyspace_weekly_challenges, public.studyspace_challenge_submissions, public.studyspace_achievements, public.studyspace_points TO service_role;

ALTER TABLE public.studyspace_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyspace_saved_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyspace_card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyspace_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyspace_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyspace_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyspace_weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyspace_challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyspace_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studyspace_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own all" ON public.studyspace_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own all" ON public.studyspace_saved_chapters FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own all" ON public.studyspace_card_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own all" ON public.studyspace_question_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own all" ON public.studyspace_quiz_attempts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own all" ON public.studyspace_streaks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "read challenges" ON public.studyspace_weekly_challenges FOR SELECT TO authenticated USING (true);
CREATE POLICY "own select" ON public.studyspace_challenge_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.studyspace_challenge_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own select" ON public.studyspace_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.studyspace_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own select" ON public.studyspace_points FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.studyspace_points FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON public.studyspace_points FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.get_studyspace_leaderboard()
RETURNS TABLE (display_name text, total_points integer, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT pr.display_name, p.total_points, p.updated_at
  FROM public.studyspace_points p
  LEFT JOIN public.studyspace_profiles pr ON pr.user_id = p.user_id
  WHERE p.total_points > 0
  ORDER BY p.total_points DESC, p.updated_at ASC
  LIMIT 50
$$;
REVOKE ALL ON FUNCTION public.get_studyspace_leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_studyspace_leaderboard() TO authenticated;