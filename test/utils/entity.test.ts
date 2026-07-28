import { describe, it, expect } from 'vitest';
import {
  computeDomain,
  computeEntityName,
  defaultToggleService,
  formatBrightnessPercent,
  formatNumericState,
  getEntityBrightness,
  isEntityActive,
  isEntityOffline,
  isUnavailable,
} from '../../src/utils/entity';
import { makeEntity } from '../helpers';

describe('computeDomain', () => {
  it('extracts domain from entity id', () => {
    expect(computeDomain('light.kitchen')).toBe('light');
  });

  it('returns full string when no separator', () => {
    expect(computeDomain('orphan')).toBe('orphan');
  });
});

describe('computeEntityName', () => {
  it('prefers friendly_name', () => {
    expect(
      computeEntityName(
        makeEntity('light.k', 'on', { friendly_name: 'Kitchen' }),
      ),
    ).toBe('Kitchen');
  });

  it('falls back for missing entity', () => {
    expect(computeEntityName(undefined)).toBe('Unknown');
  });
});

describe('isUnavailable / isEntityOffline / isEntityActive', () => {
  it('treats unavailable and unknown as unavailable for state styling', () => {
    expect(isUnavailable(makeEntity('light.a', 'unavailable'))).toBe(true);
    expect(isUnavailable(makeEntity('light.a', 'unknown'))).toBe(true);
    expect(isUnavailable(makeEntity('light.a', 'on'))).toBe(false);
  });

  it('treats only unavailable as offline (unknown stays controllable)', () => {
    expect(isEntityOffline(makeEntity('cover.a', 'unavailable'))).toBe(true);
    expect(isEntityOffline(makeEntity('cover.a', 'unknown'))).toBe(false);
    expect(isEntityOffline(makeEntity('cover.a', 'open'))).toBe(false);
  });

  it('detects cover open as active', () => {
    expect(isEntityActive(makeEntity('cover.g', 'open'))).toBe(true);
    expect(isEntityActive(makeEntity('cover.g', 'closed'))).toBe(false);
  });

  it('detects vacuum cleaning as active', () => {
    expect(isEntityActive(makeEntity('vacuum.r', 'cleaning'))).toBe(true);
    expect(isEntityActive(makeEntity('vacuum.r', 'docked'))).toBe(false);
  });
});

describe('brightness helpers', () => {
  it('reads brightness and formats percent', () => {
    const entity = makeEntity('light.k', 'on', { brightness: 128 });
    expect(getEntityBrightness(entity)).toBe(128);
    expect(formatBrightnessPercent(128)).toBe('50%');
  });

  it('returns 0 brightness when off', () => {
    expect(getEntityBrightness(makeEntity('light.k', 'off'))).toBe(0);
  });
});

describe('defaultToggleService', () => {
  it('returns domain toggle for lights', () => {
    expect(defaultToggleService('light.k')).toEqual({
      domain: 'light',
      service: 'toggle',
    });
  });

  it('returns cover.toggle for covers', () => {
    expect(defaultToggleService('cover.g')).toEqual({
      domain: 'cover',
      service: 'toggle',
    });
  });

  it('falls back to homeassistant.toggle', () => {
    expect(defaultToggleService('sensor.t')).toEqual({
      domain: 'homeassistant',
      service: 'toggle',
    });
  });
});

describe('formatNumericState', () => {
  it('rounds by default and respects precision', () => {
    expect(formatNumericState(1.234)).toBe('1.23');
    expect(formatNumericState(1.234, 1)).toBe('1.2');
  });
});
