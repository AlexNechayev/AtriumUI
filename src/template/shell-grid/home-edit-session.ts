import type {
  AuHomeEntityConfig,
  AuHomeFloorConfig,
  AuHomeRoomConfig,
} from '../../types/home';
import { findRoom } from '../../utils/areas';
import type { EditScope, HomeGridItem, RoomEditItem } from './home-grid-types';
import {
  buildHomeEditItems,
  buildRoomGridItems,
  type HomeGridLayoutOptions,
} from './home-grid-items';

/** Core draft fields for a Home / room layout edit session. */
export interface HomeEditSessionDraft {
  editScope: EditScope;
  editItems: RoomEditItem[];
  homeEditItems: HomeGridItem[];
  editRoomId?: string;
}

/** Cleared session — no pending draft (cancel / exit edit). */
export function emptyEditSessionDraft(): HomeEditSessionDraft {
  return {
    editScope: 'none',
    editItems: [],
    homeEditItems: [],
    editRoomId: undefined,
  };
}

/**
 * Enter Home overview edit: clone normalized draft only.
 * Does not persist / commit floors.
 */
export function beginHomeEditDraft(
  floors: AuHomeFloorConfig[],
  layout: HomeGridLayoutOptions,
): HomeEditSessionDraft {
  return {
    editScope: 'home',
    editRoomId: undefined,
    editItems: [],
    homeEditItems: buildHomeEditItems(floors, { ...layout, useBaseColumns: true }),
  };
}

/**
 * Enter in-room edit: clone normalized draft only.
 * Does not persist / commit floors.
 */
export function beginRoomEditDraft(
  floors: AuHomeFloorConfig[],
  roomId: string,
  roomEntities: (room: AuHomeRoomConfig) => AuHomeEntityConfig[],
  layout: HomeGridLayoutOptions,
): HomeEditSessionDraft {
  const found = findRoom(floors, roomId);
  if (!found) {
    return {
      editScope: 'room',
      editRoomId: roomId,
      homeEditItems: [],
      editItems: [],
    };
  }
  return {
    editScope: 'room',
    editRoomId: roomId,
    homeEditItems: [],
    editItems: buildRoomGridItems(found.room, roomEntities(found.room), {
      ...layout,
      useBaseColumns: true,
    }),
  };
}
