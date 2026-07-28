import { describe, it, expect, vi } from 'vitest';
import {
  buildVacuumDeviceCatalog,
  classifyVacuumSection,
  entriesForSection,
  filterCatalogSections,
} from '../../src/utils/vacuum-device-catalog';
import {
  applyVacuumDraft,
  VacuumSettingsDraft,
} from '../../src/utils/vacuum-settings-draft';
import { makeEntity, makeHass } from '../helpers';
import type { HassEntityRegistryEntry } from '../../src/types/home-assistant';

function withEntities(
  hass: ReturnType<typeof makeHass>,
  entities: Record<string, HassEntityRegistryEntry>,
) {
  hass.entities = entities;
  return hass;
}

describe('vacuum-device-catalog', () => {
  it('classifies sections by entity id patterns', () => {
    expect(classifyVacuumSection('select.x_suction_level')).toBe('clean');
    expect(classifyVacuumSection('sensor.x_battery_level')).toBe('status');
    expect(classifyVacuumSection('camera.x_map')).toBe('map');
    expect(classifyVacuumSection('button.x_reset_filter')).toBe('maintenance');
    expect(classifyVacuumSection('switch.x_ai_pet_detection')).toBe('ai');
    expect(classifyVacuumSection('switch.x_dnd')).toBe('dnd');
    expect(classifyVacuumSection('select.x_room_3_suction_level')).toBe('rooms');
  });

  it('builds catalog from device_id and skips disabled entities', () => {
    const states = {
      'vacuum.bot': makeEntity('vacuum.bot', 'docked'),
      'sensor.bot_battery_level': makeEntity('sensor.bot_battery_level', '80'),
      'select.bot_suction_level': makeEntity('select.bot_suction_level', 'max', {
        options: ['quiet', 'max'],
      }),
      'sensor.bot_hidden': makeEntity('sensor.bot_hidden', '1'),
      'select.bot_room_1_name': makeEntity('select.bot_room_1_name', 'Kitchen'),
      'select.bot_room_1_suction_level': makeEntity(
        'select.bot_room_1_suction_level',
        'quiet',
        { options: ['quiet', 'max'] },
      ),
      'camera.bot_map': makeEntity('camera.bot_map', 'idle'),
    };
    const hass = withEntities(makeHass(states), {
      'vacuum.bot': { entity_id: 'vacuum.bot', device_id: 'dev1' },
      'sensor.bot_battery_level': {
        entity_id: 'sensor.bot_battery_level',
        device_id: 'dev1',
      },
      'select.bot_suction_level': {
        entity_id: 'select.bot_suction_level',
        device_id: 'dev1',
      },
      'sensor.bot_hidden': {
        entity_id: 'sensor.bot_hidden',
        device_id: 'dev1',
        disabled_by: 'user',
      },
      'select.bot_room_1_name': {
        entity_id: 'select.bot_room_1_name',
        device_id: 'dev1',
      },
      'select.bot_room_1_suction_level': {
        entity_id: 'select.bot_room_1_suction_level',
        device_id: 'dev1',
      },
      'camera.bot_map': { entity_id: 'camera.bot_map', device_id: 'dev1' },
    });

    const catalog = buildVacuumDeviceCatalog(hass, 'vacuum.bot');
    expect(catalog.deviceId).toBe('dev1');
    expect(catalog.mapCameraId).toBe('camera.bot_map');
    expect(catalog.statusEntityIds.battery).toBe('sensor.bot_battery_level');
    expect(catalog.entries.some((e) => e.entityId === 'sensor.bot_hidden')).toBe(
      false,
    );
    expect(catalog.rooms).toHaveLength(1);
    expect(catalog.rooms[0]!.index).toBe(1);

    const essentials = entriesForSection(catalog, 'essentials');
    expect(
      essentials.map((e) => e.entityId).sort(),
    ).toEqual(
      expect.arrayContaining([
        'sensor.bot_battery_level',
        'select.bot_suction_level',
        'camera.bot_map',
      ]),
    );

    const hidden = filterCatalogSections(catalog, ['rooms', 'map']);
    expect(hidden.rooms).toHaveLength(0);
    expect(hidden.mapCameraId).toBeUndefined();
    expect(hidden.entries.every((e) => e.section !== 'rooms')).toBe(true);
  });
});

describe('vacuum-settings-draft', () => {
  it('applies pending switch/select/number/time services', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const draft = new VacuumSettingsDraft();
    draft.set('switch.a', true);
    draft.set('select.b', 'max');
    draft.set('number.c', 42);
    draft.set('time.d', '08:30:00');
    await applyVacuumDraft(hass, draft);
    expect(callService).toHaveBeenCalledWith('switch', 'turn_on', {
      entity_id: 'switch.a',
    });
    expect(callService).toHaveBeenCalledWith('select', 'select_option', {
      entity_id: 'select.b',
      option: 'max',
    });
    expect(callService).toHaveBeenCalledWith('number', 'set_value', {
      entity_id: 'number.c',
      value: 42,
    });
    expect(callService).toHaveBeenCalledWith('time', 'set_value', {
      entity_id: 'time.d',
      time: '08:30:00',
    });
    expect(draft.dirty).toBe(false);
  });
});
