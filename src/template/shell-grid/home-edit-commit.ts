import { findRoom } from '../../utils/areas';
import type { AuHomeFloorConfig } from '../../types/home';
import type { HomeGridItem, RoomEditItem } from './home-grid-types';

/**
 * Apply in-room entity + card placements to a cloned floors tree.
 * Returns null when the room id is not found.
 */
export function commitRoomEditToFloors(
  floors: AuHomeFloorConfig[],
  roomId: string,
  editItems: RoomEditItem[],
): AuHomeFloorConfig[] | null {
  const next = structuredClone(floors);
  const found = findRoom(next, roomId);
  if (!found) return null;

  found.room.entities = editItems
    .filter((i): i is RoomEditItem & { kind: 'entity' } => i.kind === 'entity')
    .map((item) => ({
      ...item.entity,
      entity: item.entity.entity || item.id,
      layout: { x: item.x, y: item.y, w: item.w, h: item.h },
      hide: false,
    }));
  found.room.cards = editItems
    .filter((i): i is RoomEditItem & { kind: 'card' } => i.kind === 'card')
    .map((item) => ({
      ...item.card,
      id: item.id,
      layout: { x: item.x, y: item.y, w: item.w, h: item.h },
      card: { ...item.card.card },
    }));
  return next;
}

/** Apply Home overview room + entity + card placements to cloned floors. */
export function commitHomeEditToFloors(
  floors: AuHomeFloorConfig[],
  homeEditItems: HomeGridItem[],
): AuHomeFloorConfig[] {
  const next = structuredClone(floors);
  for (const floor of next) {
    const floorId = floor.id || 'floor';
    const items = homeEditItems.filter((i) => i.floorId === floorId);
    floor.rooms = items
      .filter((i): i is HomeGridItem & { kind: 'room' } => i.kind === 'room')
      .map((item) => ({
        ...item.room,
        id: item.id,
        layout: { x: item.x, y: item.y, w: item.w, h: item.h },
      }));
    floor.entities = items
      .filter(
        (i): i is HomeGridItem & { kind: 'entity' } => i.kind === 'entity',
      )
      .map((item) => ({
        ...item.entity,
        entity: item.entity.entity || item.id,
        layout: { x: item.x, y: item.y, w: item.w, h: item.h },
        hide: false,
      }));
    floor.cards = items
      .filter((i): i is HomeGridItem & { kind: 'card' } => i.kind === 'card')
      .map((item) => ({
        ...item.card,
        id: item.id,
        layout: { x: item.x, y: item.y, w: item.w, h: item.h },
        card: { ...item.card.card },
      }));
  }
  return next;
}
