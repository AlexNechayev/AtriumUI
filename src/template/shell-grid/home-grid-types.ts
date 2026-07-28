import type {
  AuHomeCardConfig,
  AuHomeEntityConfig,
  AuHomeRoomConfig,
} from '../../types/home';
import type { GridItemLike } from './grid-engine';

/** Entity or arbitrary card placement inside a room edit session. */
export type RoomEditItem = GridItemLike &
  (
    | { kind: 'entity'; entity: AuHomeEntityConfig }
    | { kind: 'card'; card: AuHomeCardConfig }
  );

/** Room, standalone entity, or arbitrary card on a floor’s Home grid. */
export type HomeGridItem = GridItemLike & {
  floorId: string;
} & (
  | { kind: 'room'; room: AuHomeRoomConfig }
  | { kind: 'entity'; entity: AuHomeEntityConfig }
  | { kind: 'card'; card: AuHomeCardConfig }
);

/** Pointer drag/resize session metrics and origin. */
export interface PointerDragState {
  id: string;
  startX: number;
  startY: number;
  pointerX: number;
  pointerY: number;
  cellW: number;
  rowH: number;
  gap: number;
}

export type EditScope = 'none' | 'home' | 'room';

export const DEFAULT_ROW_HEIGHT_PX = 80;
export const DEFAULT_HEIGHT_UNITS = 2;
