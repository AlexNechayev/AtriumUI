import { describe, it, expect } from 'vitest';
import {
  commitHomeEditToFloors,
  commitRoomEditToFloors,
} from '../../src/template/shell-grid/home-edit-commit';
import type {
  HomeGridItem,
  RoomEditItem,
} from '../../src/template/shell-grid/home-grid-types';
import type { AuHomeFloorConfig } from '../../src/types/home';

const floors: AuHomeFloorConfig[] = [
  {
    id: 'f1',
    name: 'Floor 1',
    rooms: [
      {
        id: 'living',
        name: 'Living',
        entities: [{ entity: 'light.a', layout: { x: 0, y: 0, w: 4, h: 2 } }],
        cards: [],
      },
    ],
    entities: [{ entity: 'sensor.temp', layout: { x: 0, y: 0, w: 3, h: 2 } }],
  },
];

describe('commitRoomEditToFloors', () => {
  it('writes entity and card layouts into the target room', () => {
    const editItems: RoomEditItem[] = [
      {
        id: 'light.a',
        x: 1,
        y: 2,
        w: 4,
        h: 2,
        kind: 'entity',
        entity: { entity: 'light.a' },
      },
      {
        id: 'card-1',
        x: 5,
        y: 0,
        w: 3,
        h: 2,
        kind: 'card',
        card: {
          id: 'card-1',
          card: { type: 'custom:au-sensor-card', entity: 'sensor.temp' },
        },
      },
    ];
    const next = commitRoomEditToFloors(floors, 'living', editItems);
    expect(next).not.toBeNull();
    const room = next?.find((f) => f.id === 'f1')?.rooms[0];
    expect(room?.entities?.[0]?.layout).toEqual({ x: 1, y: 2, w: 4, h: 2 });
    expect(room?.cards?.[0]).toMatchObject({
      id: 'card-1',
      layout: { x: 5, y: 0, w: 3, h: 2 },
    });
    // Original floors untouched.
    expect(floors[0]?.rooms[0]?.entities?.[0]?.layout).toEqual({
      x: 0,
      y: 0,
      w: 4,
      h: 2,
    });
  });

  it('returns null for unknown room', () => {
    expect(commitRoomEditToFloors(floors, 'missing', [])).toBeNull();
  });
});

describe('commitHomeEditToFloors', () => {
  it('persists room, floor entity, and floor card placements', () => {
    const living = floors[0]!.rooms[0]!;
    const homeItems: HomeGridItem[] = [
      {
        id: 'living',
        floorId: 'f1',
        x: 2,
        y: 1,
        w: 6,
        h: 3,
        kind: 'room',
        room: living,
      },
      {
        id: 'sensor.temp',
        floorId: 'f1',
        x: 0,
        y: 4,
        w: 3,
        h: 2,
        kind: 'entity',
        entity: { entity: 'sensor.temp' },
      },
      {
        id: 'quick',
        floorId: 'f1',
        x: 4,
        y: 4,
        w: 4,
        h: 2,
        kind: 'card',
        card: {
          id: 'quick',
          card: {
            type: 'custom:au-room-card',
            entities: ['light.hall'],
          },
        },
      },
    ];
    const next = commitHomeEditToFloors(floors, homeItems);
    expect(next[0]?.rooms[0]?.layout).toEqual({ x: 2, y: 1, w: 6, h: 3 });
    expect(next[0]?.entities?.[0]?.layout).toEqual({ x: 0, y: 4, w: 3, h: 2 });
    expect(next[0]?.cards?.[0]).toMatchObject({
      id: 'quick',
      layout: { x: 4, y: 4, w: 4, h: 2 },
      card: { type: 'custom:au-room-card' },
    });
  });
});
