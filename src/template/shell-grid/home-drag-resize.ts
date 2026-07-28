import {
  computeRowTrackHeightPx,
  moveItem,
  resizeItem,
  resolveRowTrackCount,
  type GridItemLike,
} from './grid-engine';
import {
  DEFAULT_ROW_HEIGHT_PX,
  type HomeGridItem,
  type PointerDragState,
  type RoomEditItem,
} from './home-grid-types';

export interface GridMetrics {
  cellW: number;
  rowH: number;
  gap: number;
}

/** Compute cell width / row height / gap from measured grid geometry. */
export function computeGridMetrics(input: {
  columns: number;
  gridWidth: number;
  computed?: {
    rowGap?: string;
    gap?: string;
    rowHeightCssVar?: string;
    gridAutoRows?: string;
  } | null;
  gapFallback?: string | number;
  rowHeightFallback?: string | number;
}): GridMetrics {
  const { columns, gridWidth } = input;
  let gap = 12;
  let rowH = DEFAULT_ROW_HEIGHT_PX;
  if (input.computed) {
    const cs = input.computed;
    gap = parseFloat(cs.rowGap || cs.gap || '0') || gap;
    rowH =
      parseFloat(cs.rowHeightCssVar || '') ||
      parseFloat(cs.gridAutoRows || '0') ||
      parseFloat(String(input.rowHeightFallback ?? DEFAULT_ROW_HEIGHT_PX)) ||
      DEFAULT_ROW_HEIGHT_PX;
  } else {
    gap = parseFloat(String(input.gapFallback ?? '12')) || 12;
    rowH =
      parseFloat(String(input.rowHeightFallback ?? DEFAULT_ROW_HEIGHT_PX)) ||
      DEFAULT_ROW_HEIGHT_PX;
  }
  const cellW =
    columns > 0 ? (gridWidth - gap * (columns - 1)) / columns : gridWidth;
  return { cellW, rowH, gap };
}

export function pointerCellDelta(
  state: PointerDragState,
  clientX: number,
  clientY: number,
): { dCols: number; dRows: number } {
  return {
    dCols: Math.round((clientX - state.pointerX) / (state.cellW + state.gap)),
    dRows: Math.round((clientY - state.pointerY) / (state.rowH + state.gap)),
  };
}

export function beginPointerDrag(
  item: GridItemLike,
  clientX: number,
  clientY: number,
  metrics: GridMetrics,
): PointerDragState {
  return {
    id: item.id,
    startX: item.x,
    startY: item.y,
    pointerX: clientX,
    pointerY: clientY,
    cellW: metrics.cellW,
    rowH: metrics.rowH,
    gap: metrics.gap,
  };
}

export function beginPointerResize(
  item: GridItemLike,
  clientX: number,
  clientY: number,
  metrics: GridMetrics,
): PointerDragState {
  return {
    id: item.id,
    startX: item.w,
    startY: item.h,
    pointerX: clientX,
    pointerY: clientY,
    cellW: metrics.cellW,
    rowH: metrics.rowH,
    gap: metrics.gap,
  };
}

/** Floor-scoped move for Home overview edit items. */
export function applyHomeItemMove(
  items: HomeGridItem[],
  drag: PointerDragState,
  clientX: number,
  clientY: number,
  columns: number,
): HomeGridItem[] {
  const target = items.find((i) => i.id === drag.id);
  if (!target) return items;
  const { dCols, dRows } = pointerCellDelta(drag, clientX, clientY);
  const floorItems = items.filter((i) => i.floorId === target.floorId);
  const moved = moveItem(
    floorItems,
    drag.id,
    drag.startX + dCols,
    drag.startY + dRows,
    columns,
  );
  const byId = new Map(moved.map((i) => [i.id, i]));
  return items.map((i) => byId.get(i.id) ?? i);
}

export function applyRoomItemMove(
  items: RoomEditItem[],
  drag: PointerDragState,
  clientX: number,
  clientY: number,
  columns: number,
): RoomEditItem[] {
  const { dCols, dRows } = pointerCellDelta(drag, clientX, clientY);
  return moveItem(
    items,
    drag.id,
    drag.startX + dCols,
    drag.startY + dRows,
    columns,
  );
}

export function applyHomeItemResize(
  items: HomeGridItem[],
  resize: PointerDragState,
  clientX: number,
  clientY: number,
  columns: number,
): HomeGridItem[] {
  const target = items.find((i) => i.id === resize.id);
  if (!target) return items;
  const { dCols, dRows } = pointerCellDelta(resize, clientX, clientY);
  const floorItems = items.filter((i) => i.floorId === target.floorId);
  const resized = resizeItem(
    floorItems,
    resize.id,
    resize.startX + dCols,
    resize.startY + dRows,
    columns,
  );
  const byId = new Map(resized.map((i) => [i.id, i]));
  return items.map((i) => byId.get(i.id) ?? i);
}

export function applyRoomItemResize(
  items: RoomEditItem[],
  resize: PointerDragState,
  clientX: number,
  clientY: number,
  columns: number,
): RoomEditItem[] {
  const { dCols, dRows } = pointerCellDelta(resize, clientX, clientY);
  return resizeItem(
    items,
    resize.id,
    resize.startX + dCols,
    resize.startY + dRows,
    columns,
  );
}

/** CSS custom properties for the home/room edit grid. */
export function homeGridStyleVars(input: {
  gap: string;
  rowsConfig: { rows?: number } | undefined;
  items: GridItemLike[];
  displayColumns: number;
  distributeRows: boolean;
  gridAreaHeightPx: number;
  gapPx: number;
  rowHeightFallback: string;
}): Record<string, string> {
  const rowCount = resolveRowTrackCount(
    { rows: input.rowsConfig?.rows },
    input.items,
  );
  let rowHeight = input.rowHeightFallback;
  if (input.distributeRows) {
    const trackHeightPx = computeRowTrackHeightPx(
      input.gridAreaHeightPx,
      rowCount,
      input.gapPx,
    );
    if (trackHeightPx > 0) {
      rowHeight = `${trackHeightPx}px`;
    }
  }
  return {
    '--home-grid-columns': String(input.displayColumns),
    '--home-grid-rows': String(rowCount),
    '--home-grid-row-height': rowHeight,
    '--home-grid-gap': input.gap,
  };
}

export function placementStyle(
  placement?: GridItemLike,
): Record<string, string> {
  return placement
    ? {
        gridColumn: `${placement.x + 1} / span ${placement.w}`,
        gridRow: `${placement.y + 1} / span ${placement.h}`,
      }
    : {};
}
