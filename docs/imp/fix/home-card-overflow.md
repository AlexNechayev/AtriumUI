# fix/home-card-overflow

## Goal

Newly added Home-floor cards (e.g. Entrance lamp) remain visible instead of clipping out of the Home grid container.

## Linked docs

- [`docs/prd/platform/shell-grid.md`](../../prd/platform/shell-grid.md) — Home edit add/persist
- [`docs/prd/ux/edit-mode.md`](../../prd/ux/edit-mode.md) — add card in edit mode
- [`docs/ARCHITECTURE.md`](../../ARCHITECTURE.md) — grid-fill / one shell

## Decisions

- Runtime logs showed the new light card placed at `{ x: 0, y: 41, w: 8, h: 2 }` and fully clipped (`top: 690` vs `room-body` bottom `688`) because:
  - default width 8 could not fit the 7-column hole beside Vacuum
  - `rows: 36` + `gap: 12px` collapsed row tracks to ~0px, so `h: 2` is only 12px tall
  - `.home.distribute-rows .room-body` used `overflow: hidden`
- Place new Home items with `findFreeSlotFitting` (shrink width to stay within occupied/configured rows) and a `rows/3` default height on fine grids.
- Allow `.room-body` to scroll when content still exceeds the shell.

## Files touched

- `src/template/shell-grid/grid-engine.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/template/shell-grid/home-view-styles.ts`
- `test/template/grid-engine.test.ts`

## TDD

- Red: added `defaultGridSpan` / `findFreeSlotFitting` tests in `test/template/grid-engine.test.ts` — `npx vitest run test/template/grid-engine.test.ts` failed (`defaultGridSpan is not a function`).
- Green: implemented those helpers and wired Home add/place — same file plus home/add-card tests passed (78).
- Refactor: none beyond wiring `_fittingSlot`.

## Verification

### Automated
- `npx vitest run test/template/grid-engine.test.ts test/template/au-shell-grid-home.test.ts test/template/shell-grid-add-card.test.ts`

### Acceptance (from docs/prd/platform/shell-grid.md, docs/prd/ux/edit-mode.md)
- AC: Home edit add places the new card on the floor grid where it is visible.
- AC: Desktop edit add still persists on Done.

### Manual
1. Hard-refresh the Panel view with `au-shell-grid` in edit mode.
2. Add to floor → add an entity or card.
3. Confirm the new tile appears in a visible hole (not below the calendar / off the bottom).
4. Done persists layout on a storage-mode dashboard.
