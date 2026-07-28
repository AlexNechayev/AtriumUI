import { describe, it, expect, vi } from 'vitest';
import { bulkTurnOff, collectBulkOffTargets } from '../../src/utils/bulk-action';
import { makeEntity, makeHass } from '../helpers';

describe('bulk-action', () => {
  it('collects only active bulk-safe entities', () => {
    const states = {
      'light.a': makeEntity('light.a', 'on'),
      'switch.b': makeEntity('switch.b', 'off'),
      'cover.c': makeEntity('cover.c', 'open'),
      'fan.d': makeEntity('fan.d', 'on'),
    };
    const targets = collectBulkOffTargets(
      ['light.a', 'switch.b', 'cover.c', 'fan.d'],
      states,
    );
    expect(targets).toEqual(['light.a', 'fan.d']);
  });

  it('calls turn_off for targets', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass(
      {
        'light.a': makeEntity('light.a', 'on'),
        'switch.b': makeEntity('switch.b', 'on'),
      },
      callService,
    );
    const result = await bulkTurnOff(hass, ['light.a', 'switch.b']);
    expect(result.attempted).toEqual(['light.a', 'switch.b']);
    expect(callService).toHaveBeenCalledWith('light', 'turn_off', {
      entity_id: 'light.a',
    });
    expect(callService).toHaveBeenCalledWith('switch', 'turn_off', {
      entity_id: 'switch.b',
    });
  });
});
