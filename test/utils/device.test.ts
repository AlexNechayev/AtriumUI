import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getDeviceCapabilities,
  isSupportedDeviceDomain,
  resolveCardTypeForEntity,
  runPrimaryDeviceAction,
  slugify,
  usesExplicitOnOff,
} from '../../src/utils/device';
import { makeEntity, makeHass } from '../helpers';

describe('device utils', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('supports remaining device domains', () => {
    for (const domain of ['water_heater', 'input_boolean']) {
      expect(isSupportedDeviceDomain(domain)).toBe(true);
    }
    expect(isSupportedDeviceDomain('vacuum')).toBe(false);
    expect(isSupportedDeviceDomain('cover')).toBe(false);
    expect(isSupportedDeviceDomain('switch')).toBe(false);
    expect(isSupportedDeviceDomain('fan')).toBe(false);
    expect(isSupportedDeviceDomain('camera')).toBe(false);
  });

  it('resolves dedicated card types', () => {
    expect(resolveCardTypeForEntity('light.a')).toBe('au-light-card');
    expect(resolveCardTypeForEntity('climate.a')).toBe('au-climate-card');
    expect(resolveCardTypeForEntity('fan.a')).toBe('au-fan-card');
    expect(resolveCardTypeForEntity('cover.a')).toBe('au-cover-card');
    expect(resolveCardTypeForEntity('switch.a')).toBe('au-switch-card');
    expect(resolveCardTypeForEntity('vacuum.a')).toBe('au-vacuum-card');
    expect(resolveCardTypeForEntity('water_heater.a')).toBe('au-device-card');
    expect(resolveCardTypeForEntity('lock.a')).toBe('au-action-card');
  });

  it('reads water heater capabilities', () => {
    const caps = getDeviceCapabilities(
      makeEntity('water_heater.tank', 'on', {
        temperature: 50,
        min_temp: 30,
        max_temp: 70,
      }),
    );
    expect(caps.supported).toBe(true);
    expect(caps.hasControls).toBe(true);
    expect(caps.secondaryHint).toBe('50°');
  });

  it('slugifies ids', () => {
    expect(slugify('Living Room')).toBe('living_room');
  });

  it('marks switch-like domains for explicit turn_on/off', () => {
    expect(usesExplicitOnOff('switch.outlet')).toBe(true);
    expect(usesExplicitOnOff('input_boolean.guest')).toBe(true);
    expect(usesExplicitOnOff('humidifier.room')).toBe(true);
    expect(usesExplicitOnOff('cover.window')).toBe(false);
    expect(usesExplicitOnOff('vacuum.bot')).toBe(false);
  });

  it('turns input_boolean off/on explicitly from currentlyOn', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const entity = makeEntity('input_boolean.guest', 'on');

    await runPrimaryDeviceAction(hass, entity, { currentlyOn: true });
    expect(callService).toHaveBeenCalledWith('input_boolean', 'turn_off', {
      entity_id: 'input_boolean.guest',
    });

    callService.mockClear();
    await runPrimaryDeviceAction(hass, entity, { currentlyOn: false });
    expect(callService).toHaveBeenCalledWith('input_boolean', 'turn_on', {
      entity_id: 'input_boolean.guest',
    });
  });
});
