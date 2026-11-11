import { useMemo, useSyncExternalStore } from 'react';

const CHANGE_EVENT = 'studyspace:change';

export function subscribeToChanges(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readJson<T>(key: string, fallback: T): T {
  return parseJson(localStorage.getItem(key), fallback);
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return true;
}

export function removeKey(key: string) {
  localStorage.removeItem(key);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function removeAccountStudyCache() {
  const accountKeys = [
    'studyspace:profile',
    'studyspace:saved-chapters',
    'studyspace:quiz-history',
    'studyspace:study-streak',
    'studyspace:challenge-submissions',
    'studyspace:leaderboard',
    'studyspace:unlocked-achievements',
  ];
  accountKeys.forEach((key) => localStorage.removeItem(key));
  Object.keys(localStorage)
    .filter((key) => key.startsWith('studyspace:chapter:') || key.startsWith('studyspace:cards:') || key.startsWith('studyspace:retention:'))
    .forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useStoredValue<T>(key: string, fallback: T): T {
  const raw = useSyncExternalStore(
    subscribeToChanges,
    () => localStorage.getItem(key),
    () => null
  );
  return useMemo(() => parseJson(raw, fallback), [raw, fallback]);
}
