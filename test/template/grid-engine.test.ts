import { describe, it, expect } from 'vitest';
import {
  clampToColumns,
  collides,
  compact,
  computeRowTrackHeightPx,
  deriveResponsiveLayout,
  displayColumnsForWidth,
  findFreeSlot,
  getFirstCollision,
  gridRowCount,
  moveItem,
  normalizeLayout,
  resolveRowTrackCount,
  resizeItem,
  settleCollisions,
  shouldDistributeRowHeight,
  responsiveColumns,
  type GridItemLike,
} from '../../src/template/shell-grid/grid-engine';

const item = (
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
): GridItemLike => ({ id, x, y, w, h });

describe('responsiveColumns', () => {
  it('maps widths to the 12 / 6 / 1 architecture at the spec thresholds', () => {
    expect(responsiveColumns(599)).toBe(1);
    expect(responsiveColumns(600)).toBe(6);
    expect(responsiveColumns(1024)).toBe(6);
    expect(responsiveColumns(1025)).toBe(12);
    expect(responsiveColumns(1920)).toBe(12);
  });
});

describe('displayColumnsForWidth', () => {
  it('keeps classic 12-col tablet behavior at 6 columns', () => {
    expect(displayColumnsForWidth(1007, 12)).toBe(6);
  });

  it('keeps fine 24-col authored grids at full columns on tablet', () => {
    expect(displayColumnsForWidth(1007, 24)).toBe(24);
    expect(displayColumnsForWidth(800, 24)).toBe(24);
  });

  it('stacks to one column on mobile and uses full base on desktop', () => {
    expect(displayColumnsForWidth(500, 24)).toBe(1);
    expect(displayColumnsForWidth(1200, 24)).toBe(24);
  });
});

describe('collides', () => {
  it('detects overlap and ignores self / adjacency', () => {
    expect(collides(item('a', 0, 0, 2, 2), item('b', 1, 1, 2, 2))).toBe(true);
    expect(collides(item('a', 0, 0, 2, 2), item('b', 2, 0, 2, 2))).toBe(false);
    expect(collides(item('a', 0, 0, 2, 2), item('a', 0, 0, 2, 2))).toBe(false);
  });
});

describe('getFirstCollision', () => {
  it('returns the first colliding item or undefined', () => {
    const list = [item('a', 0, 0, 2, 2), item('b', 4, 0, 2, 2)];
    expect(getFirstCollision(list, item('c', 1, 1, 1, 1))?.id).toBe('a');
    expect(getFirstCollision(list, item('c', 8, 8, 1, 1))).toBeUndefined();
  });
});

describe('clampToColumns', () => {
  it('constrains width, x, and floors negatives', () => {
    expect(clampToColumns(item('a', 10, -3, 20, 0), 12)).toMatchObject({
      x: 0,
      y: 0,
      w: 12,
      h: 1,
    });
    expect(clampToColumns(item('a', 11, 2, 3, 2), 12)).toMatchObject({
      x: 9,
      w: 3,
    });
  });
});

describe('settleCollisions', () => {
  it('pushes overlapping items down without removing gaps above', () => {
    const out = settleCollisions(
      [item('a', 0, 0, 4, 2), item('b', 0, 8, 4, 2)],
      12,
    );
    expect(out.find((i) => i.id === 'b')?.y).toBe(8);
  });
});

describe('compact', () => {
  it('applies upward gravity, removing vertical gaps', () => {
    const out = compact([item('a', 0, 5, 2, 1), item('b', 0, 9, 2, 1)], 12);
    expect(out.find((i) => i.id === 'a')?.y).toBe(0);
    expect(out.find((i) => i.id === 'b')?.y).toBe(1);
  });

  it('resolves overlaps by stacking', () => {
    const out = compact([item('a', 0, 0, 4, 2), item('b', 0, 0, 4, 2)], 12);
    const ys = out.map((i) => i.y).sort();
    expect(ys).toEqual([0, 2]);
  });

  it('preserves original array order', () => {
    const out = compact([item('a', 0, 5, 2, 1), item('b', 0, 0, 2, 1)], 12);
    expect(out.map((i) => i.id)).toEqual(['a', 'b']);
  });
});

describe('moveItem', () => {
  it('moves an item and resolves overlap by pushing the moved item down', () => {
    const items = [item('a', 0, 0, 4, 2), item('b', 4, 0, 4, 2)];
    const out = moveItem(items, 'b', 0, 0, 12);
    const a = out.find((i) => i.id === 'a')!;
    const b = out.find((i) => i.id === 'b')!;
    expect(a.y).toBe(0);
    expect(b.y).toBe(2);
    expect(collides(a, b)).toBe(false);
  });

  it('preserves intentional empty rows above the item', () => {
    const out = moveItem([item('a', 0, 0, 4, 2)], 'a', 0, 8, 12);
    expect(out[0]!.y).toBe(8);
  });

  it('clamps a move past the right edge back into bounds', () => {
    const out = moveItem([item('a', 0, 0, 4, 2)], 'a', 20, 0, 12);
    expect(out[0]!.x).toBe(8);
  });
});

describe('resizeItem', () => {
  it('resizes and pushes colliding items down', () => {
    const items = [item('a', 0, 0, 2, 1), item('b', 0, 1, 2, 1)];
    const out = resizeItem(items, 'a', 2, 3, 12);
    const a = out.find((i) => i.id === 'a')!;
    const b = out.find((i) => i.id === 'b')!;
    expect(a.h).toBe(3);
    expect(collides(a, b)).toBe(false);
    expect(b.y).toBeGreaterThanOrEqual(3);
  });

  it('clamps width to the column count', () => {
    const out = resizeItem([item('a', 0, 0, 2, 1)], 'a', 99, 1, 6);
    expect(out[0]!.w).toBe(6);
  });
});

describe('findFreeSlot', () => {
  it('returns the first free coordinate scanning top-left first', () => {
    expect(findFreeSlot([], 3, 2, 12)).toEqual({ x: 0, y: 0 });
    const items = [item('a', 0, 0, 4, 2)];
    expect(findFreeSlot(items, 4, 2, 12)).toEqual({ x: 4, y: 0 });
  });
});

describe('normalizeLayout', () => {
  it('places explicit items and auto-flows the rest', () => {
    const out = normalizeLayout(
      [
        { id: 'a', layout: { x: 0, y: 0, w: 6, h: 2 } },
        { id: 'b' },
      ],
      12,
      3,
      2,
    );
    const a = out.find((i) => i.id === 'a')!;
    const b = out.find((i) => i.id === 'b')!;
    expect(a).toMatchObject({ x: 0, y: 0, w: 6, h: 2 });
    expect(collides(a, b)).toBe(false);
  });
});

describe('deriveResponsiveLayout', () => {
  const base = [item('a', 0, 0, 6, 2), item('b', 6, 0, 6, 2)];

  it('preserves the base layout when target columns match desktop', () => {
    const base = [item('a', 0, 5, 6, 2), item('b', 6, 0, 6, 2)];
    const out = deriveResponsiveLayout(base, 12, 12);
    expect(out.find((i) => i.id === 'a')?.y).toBe(5);
  });

  it('stacks all items full-width on a single-column (mobile) layout', () => {
    const out = deriveResponsiveLayout(base, 12, 1);
    for (const it of out) {
      expect(it.x).toBe(0);
      expect(it.w).toBe(1);
    }
    const ys = out.map((i) => i.y).sort((m, n) => m - n);
    expect(ys[0]).not.toBe(ys[1]);
  });

  it('scales spans down for the tablet (6-column) layout', () => {
    const out = deriveResponsiveLayout(base, 12, 6);
    for (const it of out) {
      expect(it.w).toBeLessThanOrEqual(6);
      expect(it.x + it.w).toBeLessThanOrEqual(6);
    }
  });

  it('keeps 24-col side-by-side rooms on one row at tablet half-columns', () => {
    const rooms = [
      item('living', 0, 0, 6, 12),
      item('kitchen', 6, 0, 6, 12),
    ];
    const tabletCols = displayColumnsForWidth(1007, 24);
    expect(tabletCols).toBe(24);
    const out = deriveResponsiveLayout(rooms, 24, tabletCols);
    const living = out.find((i) => i.id === 'living')!;
    const kitchen = out.find((i) => i.id === 'kitchen')!;
    expect(living.y).toBe(0);
    expect(kitchen.y).toBe(0);
    expect(living.x + living.w).toBeLessThanOrEqual(kitchen.x);
  });

  it('preserves odd room spans on a 24-col tablet (no scale+compact shift)', () => {
    const roomCards = [
      item('lamp', 0, 0, 5, 11),
      item('climate', 5, 0, 8, 16),
      item('cct', 0, 11, 5, 12),
    ];
    const cols = displayColumnsForWidth(1007, 24);
    const out = deriveResponsiveLayout(roomCards, 24, cols);
    expect(out.find((i) => i.id === 'lamp')).toMatchObject({
      x: 0,
      y: 0,
      w: 5,
      h: 11,
    });
    expect(out.find((i) => i.id === 'climate')).toMatchObject({
      x: 5,
      y: 0,
      w: 8,
      h: 16,
    });
    expect(out.find((i) => i.id === 'cct')).toMatchObject({
      x: 0,
      y: 11,
      w: 5,
      h: 12,
    });
  });
});

describe('gridRowCount', () => {
  it('returns the maximum occupied row', () => {
    expect(gridRowCount([item('a', 0, 0, 2, 2), item('b', 0, 3, 2, 4)])).toBe(7);
  });
});

describe('resolveRowTrackCount', () => {
  const items = [item('a', 0, 0, 2, 2), item('b', 0, 3, 2, 4)];

  it('uses explicit rows when set', () => {
    expect(resolveRowTrackCount({ rows: 6 }, items)).toBe(6);
  });

  it('falls back to content row count', () => {
    expect(resolveRowTrackCount({}, items)).toBe(7);
  });

  it('returns at least 1 for empty content', () => {
    expect(resolveRowTrackCount({}, [])).toBe(1);
  });
});

describe('shouldDistributeRowHeight', () => {
  it('is true when rows is set', () => {
    expect(shouldDistributeRowHeight(undefined, 6)).toBe(true);
  });

  it('is true for explicit px, vh, calc, and percent heights', () => {
    expect(shouldDistributeRowHeight('604px')).toBe(true);
    expect(shouldDistributeRowHeight('100vh')).toBe(true);
    expect(shouldDistributeRowHeight('calc(100% - 64px)')).toBe(true);
    expect(shouldDistributeRowHeight('50%')).toBe(true);
  });

  it('is false when height is omitted (default 100vh at render time)', () => {
    expect(shouldDistributeRowHeight(undefined)).toBe(false);
    expect(shouldDistributeRowHeight('')).toBe(false);
  });
});

describe('computeRowTrackHeightPx', () => {
  it('divides shell height evenly across rows accounting for gaps', () => {
    expect(computeRowTrackHeightPx(604, 7, 12)).toBe(76);
    expect(computeRowTrackHeightPx(604, 6, 12)).toBeCloseTo(90.667, 2);
    expect(computeRowTrackHeightPx(604, 1, 12)).toBe(604);
  });

  it('returns 0 for invalid inputs', () => {
    expect(computeRowTrackHeightPx(0, 7, 12)).toBe(0);
    expect(computeRowTrackHeightPx(604, 0, 12)).toBe(0);
  });
});
