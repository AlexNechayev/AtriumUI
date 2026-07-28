import type {
  HassEntityRegistryEntry,
  HomeAssistant,
} from '../types/home-assistant';
import type { AuHomeEntityConfig, AuHomeFloorConfig, AuHomeRoomConfig } from '../types/home';
import { slugify } from './device';

/** Entity ids belonging to an area (via entity registry area_id). */
export function entitiesForArea(
  hass: HomeAssistant | undefined,
  areaId: string,
): string[] {
  if (!hass?.entities) return [];
  return Object.values(hass.entities)
    .filter((e): e is HassEntityRegistryEntry => e.area_id === areaId)
    .map((e) => e.entity_id)
    .filter((id) => Boolean(hass.states[id]));
}

/**
 * Merge auto-discovered area entities into a room's entity list.
 * Manual entries win (matched by entity id); discovered ones append.
 */
export function mergeAreaEntities(
  room: AuHomeRoomConfig,
  hass: HomeAssistant | undefined,
): AuHomeEntityConfig[] {
  const manual = room.entities ?? [];
  if (!room.area_id || !hass) return manual;

  const discovered = entitiesForArea(hass, room.area_id);
  const seen = new Set(manual.map((e) => e.entity));
  const merged = [...manual];
  for (const entityId of discovered) {
    if (seen.has(entityId)) continue;
    seen.add(entityId);
    merged.push({ entity: entityId });
  }
  return merged;
}

/**
 * When `auto_areas` is on and floors are empty, build a single floor from
 * all HA areas as rooms.
 */
export function discoverFloorsFromAreas(
  hass: HomeAssistant | undefined,
): AuHomeFloorConfig[] {
  if (!hass?.areas) return [];
  const rooms: AuHomeRoomConfig[] = Object.values(hass.areas).map((area) => ({
    id: area.area_id,
    name: area.name,
    area_id: area.area_id,
    icon: area.icon,
    entities: entitiesForArea(hass, area.area_id).map((entity) => ({ entity })),
  }));
  if (rooms.length === 0) return [];
  return [{ id: 'home', name: 'Home', rooms }];
}

/** Ensure every floor/room has a stable id. */
export function normalizeFloors(floors: AuHomeFloorConfig[]): AuHomeFloorConfig[] {
  return floors.map((floor, fi) => {
    const floorId = floor.id?.trim() || slugify(floor.name) || `floor_${fi}`;
    return {
      ...floor,
      id: floorId,
      rooms: (floor.rooms ?? []).map((room, ri) => ({
        ...room,
        id: room.id?.trim() || slugify(room.name) || `room_${ri}`,
      })),
    };
  });
}

/** Find a room by id across floors. */
export function findRoom(
  floors: AuHomeFloorConfig[],
  roomId: string,
): { floor: AuHomeFloorConfig; room: AuHomeRoomConfig } | undefined {
  for (const floor of floors) {
    for (const room of floor.rooms ?? []) {
      if (room.id === roomId) return { floor, room };
    }
  }
  return undefined;
}
