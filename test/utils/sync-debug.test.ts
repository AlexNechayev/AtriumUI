import { describe, it, expect } from 'vitest';
import { entityDisplayOn } from '../../src/utils/sync-debug';
import { entityIsOn } from '../../src/template/shell-grid/room-controls';
import { makeEntity } from '../helpers';

describe('entityDisplayOn / room entityIsOn', () => {
  it('treats dimmable light with brightness 0 as off even when state is on', () => {
    const entity = makeEntity('light.cct', 'on', {
      supported_color_modes: ['color_temp'],
      brightness: 0,
    });
    expect(entityDisplayOn(entity)).toBe(false);
    expect(entityIsOn(entity)).toBe(false);
  });

  it('treats dimmable light with brightness > 0 as on', () => {
    const entity = makeEntity('light.cct', 'on', {
      supported_color_modes: ['color_temp'],
      brightness: 128,
    });
    expect(entityDisplayOn(entity)).toBe(true);
    expect(entityIsOn(entity)).toBe(true);
  });

  it('uses state for switches', () => {
    expect(entityDisplayOn(makeEntity('switch.outlet', 'on'))).toBe(true);
    expect(entityDisplayOn(makeEntity('switch.outlet', 'off'))).toBe(false);
  });
});
