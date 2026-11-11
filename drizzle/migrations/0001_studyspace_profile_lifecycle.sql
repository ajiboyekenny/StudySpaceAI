ALTER TABLE public.studyspace_profiles DROP CONSTRAINT studyspace_profiles_user_id_fkey;
CREATE OR REPLACE FUNCTION public.create_studyspace_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.studyspace_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.create_studyspace_profile() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS on_auth_user_created_studyspace_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_studyspace_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_studyspace_profile();