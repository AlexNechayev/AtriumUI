import type {
  AuHomeCardConfig,
  AuHomeEntityConfig,
  AuHomeFloorConfig,
  AuHomeRoomConfig,
} from '../../types/home';
import {
  deriveResponsiveLayout,
  normalizeLayout,
} from './grid-engine';
import {
  DEFAULT_HEIGHT_UNITS,
  type HomeGridItem,
  type RoomEditItem,
} from './home-grid-types';
import { entityIdFromHomeCard } from './room-controls';

export interface HomeGridLayoutOptions {
  baseColumns: number;
  defaultWidth: number;
  displayColumns: number;
  /** Prefer base columns (edit session / editing layout). */
  useBaseColumns: boolean;
}

/** Resolve entity + arbitrary card placements inside a room. */
export function buildRoomGridItems(
  room: AuHomeRoomConfig,
  entities: AuHomeEntityConfig[],
  opts: HomeGridLayoutOptions,
): RoomEditItem[] {
  const { baseColumns: base, defaultWidth: defaultW } = opts;
  type Source = {
    id: string;
    layout?: AuHomeEntityConfig['layout'];
    kind: 'entity' | 'card';
    entity?: AuHomeEntityConfig;
    card?: AuHomeCardConfig;
  };
  // Prefer room cards when the same entity appears in both lists.
  const cardEntityIds = new Set(
    (room.cards ?? [])
      .map((entry) => entityIdFromHomeCard(entry))
      .filter((id): id is string => Boolean(id)),
  );
  const sources: Source[] = [
    ...entities
      .filter((ent) => !ent.entity || !cardEntityIds.has(ent.entity))
      .map((ent, index) => ({
        id: ent.entity || `ent-${index}`,
        layout: ent.layout,
        kind: 'entity' as const,
        entity: ent,
      })),
    ...(room.cards ?? []).map((card, index) => ({
      id: card.id || `au-card-${index}`,
      layout: card.layout,
      kind: 'card' as const,
      card: { ...card, id: card.id || `au-card-${index}` },
    })),
  ];
  const normalized = normalizeLayout(
    sources,
    base,
    defaultW,
    DEFAULT_HEIGHT_UNITS,
  );
  const displayCols = opts.useBaseColumns ? base : opts.displayColumns;
  const laidOut =
    displayCols === base
      ? normalized
      : deriveResponsiveLayout(normalized, base, displayCols);
  return laidOut.map((item) => {
    const src = sources.find((s) => s.id === item.id)!;
    if (src.kind === 'card') {
      return {
        ...item,
        kind: 'card' as const,
        card: src.card!,
      };
    }
    return {
      ...item,
      kind: 'entity' as const,
      entity: src.entity!,
    };
  });
}

/** Resolve room + entity + card placements on a floor’s Home grid. */
export function buildHomeFloorGridItems(
  floor: AuHomeFloorConfig,
  opts: HomeGridLayoutOptions,
): HomeGridItem[] {
  const floorId = floor.id || 'floor';
  const { baseColumns: base, defaultWidth: defaultW } = opts;
  type Source = {
    id: string;
    layout?: AuHomeEntityConfig['layout'];
    kind: 'room' | 'entity' | 'card';
    room?: AuHomeRoomConfig;
    entity?: AuHomeEntityConfig;
    card?: AuHomeCardConfig;
  };
  const sources: Source[] = [
    ...(floor.rooms ?? []).map((room, index) => ({
      id: room.id || `room_${index}`,
      layout: room.layout,
      kind: 'room' as const,
      room,
    })),
    ...(floor.entities ?? [])
      .filter((e) => !e.hide && e.entity)
      .map((ent) => ({
        id: ent.entity,
        layout: ent.layout,
        kind: 'entity' as const,
        entity: ent,
      })),
    ...(floor.cards ?? []).map((card, index) => ({
      id: card.id || `au-floor-card-${index}`,
      layout: card.layout,
      kind: 'card' as const,
      card: { ...card, id: card.id || `au-floor-card-${index}` },
    })),
  ];
  const normalized = normalizeLayout(
    sources,
    base,
    defaultW,
    DEFAULT_HEIGHT_UNITS,
  );
  const displayCols = opts.useBaseColumns ? base : opts.displayColumns;
  const laidOut =
    displayCols === base
      ? normalized
      : deriveResponsiveLayout(normalized, base, displayCols);
  return laidOut.map((item) => {
    const src = sources.find((s) => s.id === item.id)!;
    if (src.kind === 'room') {
      return {
        ...item,
        floorId,
        kind: 'room' as const,
        room: src.room!,
      };
    }
    if (src.kind === 'card') {
      return {
        ...item,
        floorId,
        kind: 'card' as const,
        card: src.card!,
      };
    }
    return {
      ...item,
      floorId,
      kind: 'entity' as const,
      entity: src.entity!,
    };
  });
}

/** Flatten floor grids into a single Home edit draft. */
export function buildHomeEditItems(
  floors: AuHomeFloorConfig[],
  opts: HomeGridLayoutOptions,
): HomeGridItem[] {
  const items: HomeGridItem[] = [];
  for (const floor of floors) {
    items.push(...buildHomeFloorGridItems(floor, opts));
  }
  return items;
}
