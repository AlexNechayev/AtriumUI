import { describe, it, expect } from 'vitest';
import {
  applyHomeItemMove,
  applyRoomItemMove,
  applyRoomItemResize,
  beginPointerDrag,
  beginPointerResize,
  computeGridMetrics,
  homeGridStyleVars,
  placementStyle,
  pointerCellDelta,
} from '../../src/template/shell-grid/home-drag-resize';
import type {
  HomeGridItem,
  RoomEditItem,
} from '../../src/template/shell-grid/home-grid-types';

describe('computeGridMetrics / pointer helpers', () => {
  it('computes cell width from columns and gap', () => {
    const m = computeGridMetrics({
      columns: 12,
      gridWidth: 1200,
      gapFallback: 12,
      rowHeightFallback: 80,
    });
    // (1200 - 12*11) / 12 = 89
    expect(m.cellW).toBeCloseTo(89);
    expect(m.gap).toBe(12);
    expect(m.rowH).toBe(80);
  });

  it('builds drag/resize state and cell deltas', () => {
    const item = { id: 'a', x: 2, y: 1, w: 4, h: 2 };
    const metrics = { cellW: 100, rowH: 80, gap: 0 };
    const drag = beginPointerDrag(item, 10, 20, metrics);
    expect(drag.startX).toBe(2);
    expect(drag.startY).toBe(1);
    const resize = beginPointerResize(item, 10, 20, metrics);
    expect(resize.startX).toBe(4);
    expect(resize.startY).toBe(2);
    expect(pointerCellDelta(drag, 210, 100)).toEqual({ dCols: 2, dRows: 1 });
  });
});

describe('apply move/resize', () => {
  const roomItems: RoomEditItem[] = [
    {
      id: 'a',
      x: 0,
      y: 0,
      w: 4,
      h: 2,
      kind: 'entity',
      entity: { entity: 'light.a' },
    },
    {
      id: 'b',
      x: 4,
      y: 0,
      w: 4,
      h: 2,
      kind: 'entity',
      entity: { entity: 'light.b' },
    },
  ];

  it('moves a room item by pointer delta', () => {
    const target = roomItems[0]!;
    const drag = beginPointerDrag(target, 0, 0, {
      cellW: 100,
      rowH: 80,
      gap: 0,
    });
    const next = applyRoomItemMove(roomItems, drag, 200, 0, 12);
    expect(next.find((i) => i.id === 'a')?.x).toBe(2);
  });

  it('resizes a room item by pointer delta', () => {
    const target = roomItems[0]!;
    const resize = beginPointerResize(target, 0, 0, {
      cellW: 100,
      rowH: 80,
      gap: 0,
    });
    const next = applyRoomItemResize(roomItems, resize, 100, 80, 12);
    expect(next.find((i) => i.id === 'a')).toMatchObject({ w: 5, h: 3 });
  });

  it('keeps home moves within the same floor', () => {
    const homeItems: HomeGridItem[] = [
      {
        id: 'r1',
        floorId: 'f1',
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        kind: 'room',
        room: { id: 'r1', name: 'R1', entities: [] },
      },
      {
        id: 'r2',
        floorId: 'f2',
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        kind: 'room',
        room: { id: 'r2', name: 'R2', entities: [] },
      },
    ];
    const target = homeItems[0]!;
    const drag = beginPointerDrag(target, 0, 0, {
      cellW: 100,
      rowH: 80,
      gap: 0,
    });
    const next = applyHomeItemMove(homeItems, drag, 100, 0, 12);
    expect(next.find((i) => i.id === 'r1')?.x).toBe(1);
    expect(next.find((i) => i.id === 'r2')?.x).toBe(0);
  });
});

describe('style helpers', () => {
  it('builds placement and grid style vars', () => {
    expect(placementStyle({ id: 'a', x: 1, y: 2, w: 3, h: 4 })).toEqual({
      gridColumn: '2 / span 3',
      gridRow: '3 / span 4',
    });
    const vars = homeGridStyleVars({
      gap: '12px',
      rowsConfig: { rows: 4 },
      items: [{ id: 'a', x: 0, y: 0, w: 2, h: 2 }],
      displayColumns: 12,
      distributeRows: false,
      gridAreaHeightPx: 400,
      gapPx: 12,
      rowHeightFallback: '80px',
    });
    expect(vars['--home-grid-columns']).toBe('12');
    expect(vars['--home-grid-rows']).toBe('4');
    expect(vars['--home-grid-row-height']).toBe('80px');
  });
});
