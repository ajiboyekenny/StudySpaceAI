import { supabase } from '@/lib/supabaseClient';
import { readJson, writeJson, useStoredValue } from '@/lib/localStore';
import type { UserProfile, EducationLevel } from '@/types/gamify';

const PROFILE_KEY = 'studyspace:profile';

const DEFAULT_PROFILE: UserProfile = {
  display_name: '',
  education_level: 'secondary',
  selected_subjects: [],
  onboarded: false,
};

export function useProfile(): UserProfile {
  return useStoredValue<UserProfile>(PROFILE_KEY, DEFAULT_PROFILE);
}

export function getProfile(): UserProfile {
  return readJson<UserProfile>(PROFILE_KEY, DEFAULT_PROFILE);
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  writeJson(PROFILE_KEY, profile);
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;
  await supabase.from('studyspace_profiles').upsert({
    user_id: userData.user.id,
    display_name: profile.display_name,
    education_level: profile.education_level,
    selected_subjects: profile.selected_subjects,
    onboarded: profile.onboarded,
    updated_at: new Date().toISOString(),
  });
}

export async function syncProfile(): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;
  const { data } = await supabase
    .from('studyspace_profiles')
    .select('display_name, education_level, selected_subjects, onboarded')
    .maybeSingle();
  if (data) {
    const profile: UserProfile = {
      display_name: data.display_name ?? '',
      education_level: (data.education_level as EducationLevel) ?? 'secondary',
      selected_subjects: data.selected_subjects ?? [],
      onboarded: data.onboarded ?? false,
    };
    const local = readJson<UserProfile>(PROFILE_KEY, DEFAULT_PROFILE);
    if (!local.onboarded && profile.onboarded) {
      writeJson(PROFILE_KEY, profile);
    }
  }
}

export function setOnboardingComplete(displayName: string, level: EducationLevel, subjects: string[]) {
  const profile: UserProfile = {
    display_name: displayName,
    education_level: level,
    selected_subjects: subjects,
    onboarded: true,
  };
  void saveProfile(profile);
}
