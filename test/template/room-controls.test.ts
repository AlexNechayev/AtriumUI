import { describe, it, expect } from 'vitest';
import {
  collectRoomToggleEntities,
  controlIcon,
  entityIsOn,
  isToggleDomain,
  resolveRoomControls,
  roomControlEntities,
  ROOM_CONTROL_CAP,
} from '../../src/template/shell-grid/room-controls';

describe('room-controls helpers', () => {
  it('detects toggle domains and on-state', () => {
    expect(isToggleDomain('light.a')).toBe(true);
    expect(isToggleDomain('switch.b')).toBe(true);
    expect(isToggleDomain('cover.c')).toBe(false);
    expect(entityIsOn({ state: 'on', entity_id: 'light.a' })).toBe(true);
    expect(entityIsOn({ state: 'off', entity_id: 'light.a' })).toBe(false);
    expect(entityIsOn({ state: 'unavailable', entity_id: 'light.a' })).toBe(
      false,
    );
    expect(entityIsOn({ state: 'open', entity_id: 'cover.garage' })).toBe(true);
    expect(entityIsOn({ state: 'closed', entity_id: 'cover.garage' })).toBe(
      false,
    );
    expect(
      entityIsOn({ state: 'cleaning', entity_id: 'vacuum.bot' }),
    ).toBe(true);
  });

  it('collects light/switch from entities and cards, deduped', () => {
    const collected = collectRoomToggleEntities(
      [
        { entity: 'light.a' },
        { entity: 'sensor.temp' },
        { entity: 'switch.b' },
      ],
      [
        { id: 'c1', card: { type: 'custom:au-light-card', entity: 'light.a' } },
        { id: 'c2', card: { type: 'tile', entity: 'light.c' } },
        { id: 'c3', card: { type: 'custom:au-climate-card', entity: 'climate.x' } },
      ],
    );
    expect(collected.map((e) => e.entity)).toEqual([
      'light.a',
      'switch.b',
      'light.c',
    ]);
  });

  it('merges global and local control config', () => {
    expect(
      resolveRoomControls(
        {
          show: true,
          include: ['light.a'],
          order: ['light.a'],
          icons: { 'light.a': 'mdi:a' },
        },
        { show: false, icons: { 'light.b': 'mdi:b' } },
      ),
    ).toEqual({
      show: false,
      include: ['light.a'],
      exclude: undefined,
      order: ['light.a'],
      icons: { 'light.a': 'mdi:a', 'light.b': 'mdi:b' },
    });
  });

  it('filters, preserves config order, and caps overflow', () => {
    const entities = Array.from({ length: ROOM_CONTROL_CAP + 2 }, (_, i) => ({
      entity: `light.${i}`,
    }));
    const result = roomControlEntities({
      entities: [
        ...entities,
        { entity: 'cover.x' },
        { entity: 'switch.s' },
      ],
      controls: {},
    });
    expect(result.visible[0]?.entity).toBe('light.0');
    expect(result.visible.map((e) => e.entity)).toEqual(
      entities.slice(0, ROOM_CONTROL_CAP).map((e) => e.entity),
    );
    expect(result.visible).toHaveLength(ROOM_CONTROL_CAP);
    // switch.s is past the cap; cover is filtered out as non-toggle.
    expect(result.overflow).toBe(3);
  });

  it('keeps config order stable (no on/off reordering)', () => {
    const entities = [
      { entity: 'light.off_first' },
      { entity: 'switch.on_second' },
    ];
    expect(
      roomControlEntities({ entities, controls: {} }).visible.map(
        (e) => e.entity,
      ),
    ).toEqual(['light.off_first', 'switch.on_second']);
  });

  it('respects explicit strip order over config order', () => {
    const result = roomControlEntities({
      entities: [
        { entity: 'light.a' },
        { entity: 'light.b' },
        { entity: 'switch.c' },
      ],
      controls: { order: ['switch.c', 'light.a', 'light.b'] },
    });
    expect(result.visible.map((e) => e.entity)).toEqual([
      'switch.c',
      'light.a',
      'light.b',
    ]);
  });

  it('respects include/exclude lists', () => {
    const result = roomControlEntities({
      entities: [
        { entity: 'light.a' },
        { entity: 'light.b' },
        { entity: 'switch.c' },
      ],
      controls: { include: ['light.a', 'switch.c'], exclude: ['switch.c'] },
    });
    expect(result.visible.map((e) => e.entity)).toEqual(['light.a']);
  });

  it('resolves strip icons', () => {
    expect(
      controlIcon({
        entity: { entity: 'switch.s' },
        stripIcons: { 'switch.s': 'mdi:custom' },
      }),
    ).toBe('mdi:custom');
    expect(controlIcon({ entity: { entity: 'switch.s' } })).toBe(
      'mdi:toggle-switch',
    );
  });
});
