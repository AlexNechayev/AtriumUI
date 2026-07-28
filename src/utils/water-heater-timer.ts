/** Client-side water-heater off-timer helpers (minutes → turn_off). */

export const WH_TIMER_MIN_MINUTES = 1;
export const WH_TIMER_MAX_MINUTES = 24 * 60;
export const WH_TIMER_DEFAULT_MINUTES = 30;
/** Default quick-select durations when `timer_presets` is unset. */
export const WH_TIMER_DEFAULT_PRESETS = [15, 30, 60] as const;

const storageKey = (entityId: string): string => `au-wh-timer:${entityId}`;

/** Clamp a YAML/GUI minutes value into a safe range. */
export function clampTimerMinutes(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return WH_TIMER_DEFAULT_MINUTES;
  }
  return Math.min(
    WH_TIMER_MAX_MINUTES,
    Math.max(WH_TIMER_MIN_MINUTES, Math.round(value)),
  );
}

/**
 * Normalize preset minutes from YAML (`number[]`) or GUI text (`"15, 30, 60"`).
 * Falls back to `timer_minutes` alone, then the default preset list.
 */
export function normalizeTimerPresets(
  presets: unknown,
  fallbackMinutes?: unknown,
): number[] {
  const parsed: number[] = [];

  const push = (raw: unknown): void => {
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      parsed.push(clampTimerMinutes(raw));
      return;
    }
    if (typeof raw === 'string' && raw.trim()) {
      const n = Number(raw.trim());
      if (Number.isFinite(n)) parsed.push(clampTimerMinutes(n));
    }
  };

  if (Array.isArray(presets)) {
    for (const item of presets) push(item);
  } else if (typeof presets === 'string' && presets.trim()) {
    for (const part of presets.split(/[,;\s]+/)) push(part);
  }

  const unique = [...new Set(parsed)].sort((a, b) => a - b);
  if (unique.length > 0) return unique;

  if (fallbackMinutes !== undefined && fallbackMinutes !== null && fallbackMinutes !== '') {
    return [clampTimerMinutes(fallbackMinutes)];
  }

  return [...WH_TIMER_DEFAULT_PRESETS];
}

/** Format remaining ms as `M:SS` or `H:MM:SS`. */
export function formatTimerRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const mm = String(minutes).padStart(hours > 0 ? 2 : 1, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}

export function readTimerEndsAt(entityId: string): number | undefined {
  if (typeof sessionStorage === 'undefined' || !entityId) return undefined;
  try {
    const raw = sessionStorage.getItem(storageKey(entityId));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { endsAt?: unknown };
    if (typeof parsed.endsAt !== 'number' || !Number.isFinite(parsed.endsAt)) {
      return undefined;
    }
    if (parsed.endsAt <= Date.now()) {
      sessionStorage.removeItem(storageKey(entityId));
      return undefined;
    }
    return parsed.endsAt;
  } catch {
    return undefined;
  }
}

export function writeTimerEndsAt(entityId: string, endsAt: number): void {
  if (typeof sessionStorage === 'undefined' || !entityId) return;
  try {
    sessionStorage.setItem(storageKey(entityId), JSON.stringify({ endsAt }));
  } catch {
    /* quota / private mode */
  }
}

export function clearTimerEndsAt(entityId: string): void {
  if (typeof sessionStorage === 'undefined' || !entityId) return;
  try {
    sessionStorage.removeItem(storageKey(entityId));
  } catch {
    /* ignore */
  }
}
