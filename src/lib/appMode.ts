import { useStoredValue, writeJson } from '@/lib/localStore';

const ZERO_BANDWIDTH_KEY = 'studyspace:zero-bandwidth';

export function useZeroBandwidthMode() {
  const enabled = useStoredValue<boolean>(ZERO_BANDWIDTH_KEY, false);
  const setEnabled = (value: boolean) => {
    writeJson(ZERO_BANDWIDTH_KEY, value);
  };
  return { enabled, setEnabled };
}
