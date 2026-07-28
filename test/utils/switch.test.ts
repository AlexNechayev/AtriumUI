import { describe, it, expect, vi } from 'vitest';
import {
  formatSwitchSecondary,
  toggleSwitch,
  validateSwitchEntity,
} from '../../src/utils/switch';
import { makeEntity, makeHass } from '../helpers';

describe('switch utils', () => {
  it('validates switch domain', () => {
    expect(() => validateSwitchEntity('cover.x')).toThrow(/Switch Card/);
    expect(() => validateSwitchEntity('switch.outlet')).not.toThrow();
  });

  it('formats secondary from state', () => {
    expect(formatSwitchSecondary(makeEntity('switch.outlet', 'on'))).toBe('on');
  });

  it('toggles with explicit turn_on/off', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const entity = makeEntity('switch.outlet', 'on');
    await toggleSwitch(hass, entity, { currentlyOn: true });
    expect(callService).toHaveBeenCalledWith('switch', 'turn_off', {
      entity_id: 'switch.outlet',
    });
    callService.mockClear();
    await toggleSwitch(hass, entity, { currentlyOn: false });
    expect(callService).toHaveBeenCalledWith('switch', 'turn_on', {
      entity_id: 'switch.outlet',
    });
  });
});
