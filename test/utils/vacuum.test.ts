import { describe, it, expect, vi } from 'vitest';
import {
  getVacuumCapabilities,
  isVacuumActive,
  isVacuumDomain,
  pauseVacuum,
  returnVacuum,
  startVacuum,
  stopVacuum,
  validateVacuumEntity,
} from '../../src/utils/vacuum';
import { makeEntity, makeHass } from '../helpers';

describe('vacuum utils', () => {
  it('validates vacuum domain helpers', () => {
    expect(isVacuumDomain('vacuum.r')).toBe(true);
    expect(() => validateVacuumEntity('fan.x')).toThrow(/Vacuum Card/);
  });

  it('detects active states and capabilities', () => {
    expect(isVacuumActive(makeEntity('vacuum.r', 'cleaning'))).toBe(true);
    const caps = getVacuumCapabilities(
      makeEntity('vacuum.r', 'docked', { supported_features: 8192 | 4 | 8 | 16 }),
    );
    expect(caps).toMatchObject({
      canStart: true,
      canPause: true,
      canStop: true,
      canReturn: true,
    });
  });

  it('calls vacuum services', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    await startVacuum(hass, 'vacuum.r');
    await pauseVacuum(hass, 'vacuum.r');
    await stopVacuum(hass, 'vacuum.r');
    await returnVacuum(hass, 'vacuum.r');
    expect(callService).toHaveBeenCalledWith('vacuum', 'start', {
      entity_id: 'vacuum.r',
    });
    expect(callService).toHaveBeenCalledWith('vacuum', 'return_to_base', {
      entity_id: 'vacuum.r',
    });
  });
});
