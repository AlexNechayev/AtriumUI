import { describe, it, expect } from 'vitest';
import {
  discoverFloorsFromAreas,
  findRoom,
  mergeAreaEntities,
  normalizeFloors,
} from '../../src/utils/areas';
import { makeEntity, makeHass } from '../helpers';

describe('areas utils', () => {
  it('normalizes floor/room ids', () => {
    const floors = normalizeFloors([
      { name: 'Main', rooms: [{ name: 'Kitchen', entities: [] }] },
    ]);
    expect(floors[0]?.id).toBe('main');
    expect(floors[0]?.rooms[0]?.id).toBe('kitchen');
  });

  it('finds rooms by id', () => {
    const floors = normalizeFloors([
      {
        name: 'Main',
        rooms: [{ id: 'lr', name: 'Living', entities: [] }],
      },
    ]);
    expect(findRoom(floors, 'lr')?.room.name).toBe('Living');
  });

  it('merges area entities with manual overrides winning', () => {
    const hass = makeHass({
      'light.a': makeEntity('light.a', 'on'),
      'light.b': makeEntity('light.b', 'off'),
    });
    hass.entities = {
      'light.a': { entity_id: 'light.a', area_id: 'kitchen' },
      'light.b': { entity_id: 'light.b', area_id: 'kitchen' },
    };
    const merged = mergeAreaEntities(
      {
        name: 'Kitchen',
        area_id: 'kitchen',
        entities: [{ entity: 'light.a', name: 'Override' }],
      },
      hass,
    );
    expect(merged).toEqual([
      { entity: 'light.a', name: 'Override' },
      { entity: 'light.b' },
    ]);
  });

  it('discovers floors from areas', () => {
    const hass = makeHass({
      'light.a': makeEntity('light.a', 'on'),
    });
    hass.areas = { kitchen: { area_id: 'kitchen', name: 'Kitchen' } };
    hass.entities = {
      'light.a': { entity_id: 'light.a', area_id: 'kitchen' },
    };
    const floors = discoverFloorsFromAreas(hass);
    expect(floors[0]?.rooms[0]?.name).toBe('Kitchen');
    expect(floors[0]?.rooms[0]?.entities?.[0]?.entity).toBe('light.a');
  });
});
