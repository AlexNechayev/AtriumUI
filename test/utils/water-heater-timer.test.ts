import { describe, it, expect, beforeEach } from 'vitest';
import {
  WH_TIMER_DEFAULT_MINUTES,
  WH_TIMER_DEFAULT_PRESETS,
  clampTimerMinutes,
  clearTimerEndsAt,
  formatTimerRemaining,
  normalizeTimerPresets,
  readTimerEndsAt,
  writeTimerEndsAt,
} from '../../src/utils/water-heater-timer';

describe('water-heater-timer utils', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('clamps minutes into 1–1440', () => {
    expect(clampTimerMinutes(undefined)).toBe(WH_TIMER_DEFAULT_MINUTES);
    expect(clampTimerMinutes(0)).toBe(1);
    expect(clampTimerMinutes(30.4)).toBe(30);
    expect(clampTimerMinutes(10_000)).toBe(1440);
  });

  it('normalizes timer presets from arrays and comma text', () => {
    expect(normalizeTimerPresets([15, 30, 15, 60])).toEqual([15, 30, 60]);
    expect(normalizeTimerPresets('10, 20, 45')).toEqual([10, 20, 45]);
    expect(normalizeTimerPresets(undefined, 25)).toEqual([25]);
    expect(normalizeTimerPresets(undefined)).toEqual([...WH_TIMER_DEFAULT_PRESETS]);
  });

  it('formats remaining time', () => {
    expect(formatTimerRemaining(5_000)).toBe('0:05');
    expect(formatTimerRemaining(65_000)).toBe('1:05');
    expect(formatTimerRemaining(3_661_000)).toBe('1:01:01');
  });

  it('persists and clears endsAt in sessionStorage', () => {
    const endsAt = Date.now() + 60_000;
    writeTimerEndsAt('water_heater.tank', endsAt);
    expect(readTimerEndsAt('water_heater.tank')).toBe(endsAt);
    clearTimerEndsAt('water_heater.tank');
    expect(readTimerEndsAt('water_heater.tank')).toBeUndefined();
  });

  it('drops expired stored timers', () => {
    writeTimerEndsAt('water_heater.tank', Date.now() - 1_000);
    expect(readTimerEndsAt('water_heater.tank')).toBeUndefined();
  });
});
