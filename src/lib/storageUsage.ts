import { useSyncExternalStore } from 'react';
import { subscribeToChanges } from '@/lib/localStore';

export const STUDY_STORAGE_ALLOWANCE_BYTES = 50 * 1024 * 1024;

export function measureBytes(keyPrefix: string): number {
  let total = 0;
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !key.startsWith(keyPrefix)) continue;
    total += new TextEncoder().encode(key + (localStorage.getItem(key) ?? '')).length;
  }
  return total;
}

export function useStorageBytes(keyPrefix: string): number {
  return useSyncExternalStore(
    subscribeToChanges,
    () => measureBytes(keyPrefix),
    () => 0
  );
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
