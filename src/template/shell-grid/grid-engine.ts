/**
 * AtriumUI grid engine - pure, DOM-free layout math for `au-shell-grid`.
 *
 * All functions are side-effect free and operate on plain `{ id, x, y, w, h }`
 * objects (generic, so callers may carry extra fields like the card config).
 * This keeps the collision/compaction logic fully unit-testable.
 */

/** A rectangular placement on the grid (zero-based x/y, 1-based spans). */
export interface GridPos {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Minimal shape the engine needs; richer objects pass via structural typing. */
export interface GridItemLike extends GridPos {
  id: string;
}

/** Responsive breakpoints (spec 2 of the WebGrid spec). */
export const BREAKPOINT_TABLET_MAX = 1024;
export const BREAKPOINT_MOBILE_MAX = 599;

/** Map a container width to its column architecture: desktop 12 / tablet 6 / mobile 1. */
export function responsiveColumns(width: number): 12 | 6 | 1 {
  if (width <= BREAKPOINT_MOBILE_MAX) return 1;
  if (width <= BREAKPOINT_TABLET_MAX) return 6;
  return 12;
}

/**
 * View-mode column count for a host width, relative to the authored grid.
 * Classic ≤12-col grids still use half columns on tablet. Finer grids (e.g. 24)
 * keep the authored column count so odd spans (w:5 beside x:5) do not overlap
 * after scale + compact — edit mode, YAML, and preview stay aligned.
 */
export function displayColumnsForWidth(
  width: number,
  baseColumns: number,
): number {
  const base = Math.max(1, Math.floor(baseColumns));
  if (width <= BREAKPOINT_MOBILE_MAX) return 1;
  if (width <= BREAKPOINT_TABLET_MAX) {
    if (base > 12) return base;
    const half = Math.max(6, Math.floor(base / 2));
    return Math.min(half, base);
  }
  return base;
}

/** True when two placements overlap (an item never collides with itself). */
export function collides(a: GridItemLike, b: GridItemLike): boolean {
  if (a.id === b.id) return false;
  return !(
    a.x + a.w <= b.x ||
    a.x >= b.x + b.w ||
    a.y + a.h <= b.y ||
    a.y >= b.y + b.h
  );
}

/** First item in `list` that collides with `item`, if any. */
export function getFirstCollision<T extends GridItemLike>(
  list: T[],
  item: GridItemLike,
): T | undefined {
  return list.find((other) => collides(item, other));
}

/** Constrain a placement to the grid bounds for the given column count. */
export function clampToColumns<T extends GridItemLike>(
  item: T,
  columns: number,
): T {
  const w = Math.max(1, Math.min(Math.round(item.w), columns));
  const x = Math.max(0, Math.min(Math.round(item.x), columns - w));
  const y = Math.max(0, Math.round(item.y));
  const h = Math.max(1, Math.round(item.h));
  return { ...item, x, y, w, h };
}

function sortByRowCol<T extends GridItemLike>(items: T[]): T[] {
  return [...items].sort((a, b) => a.y - b.y || a.x - b.x);
}

function preserveOrder<T extends GridItemLike>(original: T[], placed: T[]): T[] {
  return original.map(
    (o) => placed.find((p) => p.id === o.id) ?? o,
  );
}

/**
 * Resolve overlaps by pushing items downward only — never pulls items up, so
 * intentional empty rows above an item are preserved.
 */
export function settleCollisions<T extends GridItemLike>(
  items: T[],
  columns: number,
): T[] {
  const sorted = sortByRowCol(items.map((i) => clampToColumns(i, columns)));
  const placed: T[] = [];
  for (const item of sorted) {
    const next = { ...item };
    while (getFirstCollision(placed, next)) {
      next.y += 1;
    }
    placed.push(next);
  }
  return preserveOrder(items, placed);
}

/**
 * Vertical "gravity" compaction: float every item up as far as it can go
 * without overlapping another, resolving any remaining collisions by pushing
 * down. Returns items in their original array order (stable keys for Lit).
 */
export function compact<T extends GridItemLike>(items: T[], columns: number): T[] {
  const sorted = sortByRowCol(items.map((i) => clampToColumns(i, columns)));
  const placed: T[] = [];
  for (const item of sorted) {
    const next = { ...item };
    while (next.y > 0 && !getFirstCollision(placed, { ...next, y: next.y - 1 })) {
      next.y -= 1;
    }
    while (getFirstCollision(placed, next)) {
      next.y += 1;
    }
    placed.push(next);
  }
  return preserveOrder(items, placed);
}

/** Move an item to a new (x, y); preserves vertical gaps, pushes down on overlap. */
export function moveItem<T extends GridItemLike>(
  items: T[],
  id: string,
  x: number,
  y: number,
  columns: number,
): T[] {
  const target = items.find((i) => i.id === id);
  if (!target) return items;
  const next = clampToColumns({ ...target, x, y }, columns);
  const others = items
    .filter((i) => i.id !== id)
    .map((i) => clampToColumns(i, columns));
  while (getFirstCollision(others, next)) {
    next.y += 1;
  }
  return items.map((i) =>
    i.id === id ? { ...i, x: next.x, y: next.y, w: next.w, h: next.h } : i,
  );
}

/** Resize an item; overlapping neighbours are pushed down, gaps above are kept. */
export function resizeItem<T extends GridItemLike>(
  items: T[],
  id: string,
  w: number,
  h: number,
  columns: number,
): T[] {
  const target = items.find((i) => i.id === id);
  if (!target) return items;
  const clamped = clampToColumns({ ...target, w, h }, columns);
  const working = items.map((i) =>
    i.id === id ? { ...i, x: clamped.x, w: clamped.w, h: clamped.h } : i,
  );
  return settleCollisions(working, columns);
}

/** First free slot (scanning top-to-bottom, left-to-right) fitting w x h. */
export function findFreeSlot(
  items: GridItemLike[],
  w: number,
  h: number,
  columns: number,
): { x: number; y: number } {
  const width = Math.max(1, Math.min(w, columns));
  const maxScan = 2000;
  for (let y = 0; y < maxScan; y += 1) {
    for (let x = 0; x <= columns - width; x += 1) {
      const probe: GridItemLike = { id: '__probe__', x, y, w: width, h };
      if (!getFirstCollision(items, probe)) return { x, y };
    }
  }
  const bottom = items.reduce((m, i) => Math.max(m, i.y + i.h), 0);
  return { x: 0, y: bottom };
}

/**
 * Resolve a set of config items (some with explicit layout, some without) into
 * a fully-placed engine layout. Explicit items are placed first; the rest
 * auto-flow into free slots.
 */
export function normalizeLayout<T extends { id: string; layout?: GridPos }>(
  configItems: T[],
  columns: number,
  defaultW: number,
  defaultH: number,
): GridItemLike[] {
  const placed: GridItemLike[] = [];
  for (const item of configItems) {
    if (item.layout) {
      placed.push(clampToColumns({ id: item.id, ...item.layout }, columns));
    }
  }
  for (const item of configItems) {
    if (!item.layout) {
      const slot = findFreeSlot(placed, defaultW, defaultH, columns);
      placed.push({ id: item.id, x: slot.x, y: slot.y, w: defaultW, h: defaultH });
    }
  }
  return configItems.map(
    (ci) => placed.find((p) => p.id === ci.id) ?? { id: ci.id, x: 0, y: 0, w: defaultW, h: defaultH },
  );
}

/**
 * Derive a responsive layout from a base (desktop) layout. Tablet (6 cols)
 * scales spans/positions and snaps oversized items to full width; mobile
 * (1 col) stacks every item full-width in reading order.
 */
export function deriveResponsiveLayout<T extends GridItemLike>(
  baseItems: T[],
  baseColumns: number,
  targetColumns: number,
): T[] {
  if (targetColumns >= baseColumns) {
    return baseItems.map((it) => clampToColumns(it, baseColumns));
  }

  if (targetColumns === 1) {
    const stacked = sortByRowCol(baseItems).map((it) => ({
      ...it,
      x: 0,
      w: 1,
    }));
    return preserveOrder(baseItems, compact(stacked, 1));
  }

  const scale = targetColumns / baseColumns;
  const mapped = baseItems.map((it) => {
    const w = Math.min(Math.max(1, Math.round(it.w * scale)), targetColumns);
    const x = Math.max(0, Math.min(Math.floor(it.x * scale), targetColumns - w));
    return { ...it, x, w };
  });
  return preserveOrder(baseItems, compact(mapped, targetColumns));
}

/** Total number of occupied rows (max y + h across items). */
export function gridRowCount(items: GridItemLike[]): number {
  return items.reduce((max, i) => Math.max(max, i.y + i.h), 0);
}

/** Minimal config shape for row-track resolution. */
export interface RowTrackCountInput {
  rows?: number;
}

/** Row track count: explicit `rows` config, else occupied content rows (min 1). */
export function resolveRowTrackCount(
  config: RowTrackCountInput,
  items: GridItemLike[],
): number {
  return Math.max(1, config.rows ?? gridRowCount(items));
}

/**
 * Whether the shell should divide its height into equal row tracks.
 * True when `rows` is set, or when `height` is an explicit fixed size (px, vh, %, calc).
 * Omitted height (defaults to 100vh at render time) keeps legacy fixed `row_height`.
 */
export function shouldDistributeRowHeight(
  height?: string,
  rows?: number,
): boolean {
  if (rows != null && rows >= 1) return true;
  const h = height?.trim();
  if (!h) return false;
  return /px/i.test(h) || /calc\s*\(/i.test(h) || /vh/i.test(h) || /%/.test(h);
}

/** Even row track height in px: (shellHeight - gaps) / rowCount. */
export function computeRowTrackHeightPx(
  shellHeightPx: number,
  rowCount: number,
  gapPx: number,
): number {
  if (shellHeightPx <= 0 || rowCount < 1) return 0;
  return (shellHeightPx - gapPx * (rowCount - 1)) / rowCount;
}
