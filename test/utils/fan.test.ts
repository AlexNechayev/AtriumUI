import { describe, it, expect, vi } from 'vitest';
import {
  formatFanSpeedLabel,
  getFanCapabilities,
  getFanPercentage,
  getFanSpeedIcon,
  getFanSpeedLevels,
  setFanDirection,
  setFanOscillate,
  setFanPercentage,
  setFanPresetMode,
  toggleFan,
  validateFanEntity,
} from '../../src/utils/fan';
import { makeEntity, makeHass } from '../helpers';

describe('fan utils', () => {
  it('validates fan domain', () => {
    expect(() => validateFanEntity('switch.x')).toThrow(/Fan Card/);
  });

  it('reads percentage and capabilities', () => {
    const entity = makeEntity('fan.l', 'on', {
      supported_features: 1,
      percentage: 55,
    });
    expect(getFanCapabilities(entity).canSetPercentage).toBe(true);
    expect(getFanPercentage(entity)).toBe(55);
    expect(getFanPercentage(makeEntity('fan.l', 'off'))).toBe(0);
  });

  it('builds speed levels from percentage_step', () => {
    const entity = makeEntity('fan.l', 'on', {
      supported_features: 1,
      percentage_step: 25,
    });
    expect(getFanSpeedLevels(entity)).toEqual([0, 25, 50, 75, 100]);
    expect(formatFanSpeedLabel(0)).toBe('Off');
    expect(formatFanSpeedLabel(50)).toBe('50%');
  });

  it('maps speed levels to climate fan icons', () => {
    const levels = [0, 25, 50, 75, 100];
    expect(getFanSpeedIcon(0, levels)).toBe('mdi:fan-off');
    expect(getFanSpeedIcon(25, levels)).toBe('mdi:fan-speed-1');
    expect(getFanSpeedIcon(50, levels)).toBe('mdi:fan-speed-2');
    expect(getFanSpeedIcon(100, levels)).toBe('mdi:fan-speed-3');
  });

  it('defaults speed levels to 25% steps', () => {
    expect(
      getFanSpeedLevels(
        makeEntity('fan.l', 'on', { supported_features: 1 }),
      ),
    ).toEqual([0, 25, 50, 75, 100]);
  });

  it('turns off at 0% and sets percentage otherwise', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    await setFanPercentage(hass, 'fan.l', 0);
    await setFanPercentage(hass, 'fan.l', 40);
    expect(callService).toHaveBeenCalledWith('fan', 'turn_off', {
      entity_id: 'fan.l',
    });
    expect(callService).toHaveBeenCalledWith('fan', 'set_percentage', {
      entity_id: 'fan.l',
      percentage: 40,
    });
  });

  it('calls preset / oscillate / direction services', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    await setFanPresetMode(hass, 'fan.l', 'breeze');
    await setFanOscillate(hass, 'fan.l', true);
    await setFanDirection(hass, 'fan.l', 'reverse');
    expect(callService).toHaveBeenCalledWith('fan', 'set_preset_mode', {
      entity_id: 'fan.l',
      preset_mode: 'breeze',
    });
    expect(callService).toHaveBeenCalledWith('fan', 'oscillate', {
      entity_id: 'fan.l',
      oscillating: true,
    });
    expect(callService).toHaveBeenCalledWith('fan', 'set_direction', {
      entity_id: 'fan.l',
      direction: 'reverse',
    });
  });

  it('toggles on/off from currentlyOn', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const entity = makeEntity('fan.l', 'on');
    await toggleFan(hass, entity, { currentlyOn: true });
    expect(callService).toHaveBeenCalledWith('fan', 'turn_off', {
      entity_id: 'fan.l',
    });
  });

  it('detects oscillate and direction features', () => {
    const caps = getFanCapabilities(
      makeEntity('fan.l', 'on', {
        supported_features: 2 + 4 + 8,
        preset_modes: ['auto', 'sleep'],
      }),
    );
    expect(caps.canOscillate).toBe(true);
    expect(caps.canSetDirection).toBe(true);
    expect(caps.canSetPresetMode).toBe(true);
    expect(caps.presetModes).toEqual(['auto', 'sleep']);
  });
});
