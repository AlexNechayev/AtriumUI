import { describe, it, expect, vi } from 'vitest';
import {
  resolveDomainControl,
  runWaterHeaterTemperature,
} from '../../src/utils/domain-controls';
import { makeEntity, makeHass } from '../helpers';

describe('resolveDomainControl', () => {
  it('returns none for dedicated-card domains', () => {
    expect(resolveDomainControl(makeEntity('cover.g', 'open')).kind).toBe(
      'none',
    );
    expect(resolveDomainControl(makeEntity('switch.k', 'on')).kind).toBe(
      'none',
    );
    expect(resolveDomainControl(makeEntity('vacuum.r', 'docked')).kind).toBe(
      'none',
    );
    expect(
      resolveDomainControl(
        makeEntity('fan.l', 'on', { percentage: 40, supported_features: 1 }),
      ).kind,
    ).toBe('none');
  });

  it('returns water_heater model', () => {
    expect(
      resolveDomainControl(
        makeEntity('water_heater.t', 'on', { temperature: 45 }),
      ).kind,
    ).toBe('water_heater');
  });
});

describe('domain control actions', () => {
  it('delegates to water heater services', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    await runWaterHeaterTemperature(hass, 'water_heater.t', 50);
    expect(callService).toHaveBeenCalledWith('water_heater', 'set_temperature', {
      entity_id: 'water_heater.t',
      temperature: 50,
    });
  });
});
