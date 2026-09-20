# Implementation: Shell drawer UX iteration 2

| Field | Value |
| --- | --- |
| Branch | `feature/shell-drawer-ux-2` |
| Worktree | `.worktrees/feature-shell-drawer-ux-2` |
| Status | In progress |

## Goal

Move Atrium theme into Dashboard settings → Appearance (and make Light/Dark actually restyle Home surfaces), group Dashboard fields into titled 3-column sections, put each automation on one row, and change 90% popup close from “Close settings” to **X**.

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)
- [`docs/prd/ux/design-system.md`](../../prd/ux/design-system.md)

## Decisions

- Theme is Dashboard-owned (`theme` in `DASHBOARD_KEYS`); panel keeps Enter/Exit edit only.
- `drawer.items.theme: false` hides the Appearance theme control only.
- Surfaces use `light-dark()` Home fallbacks in `src/theme/tokens.ts` (no second token file, no HA `set_theme`). Shell also writes those custom properties when theme is `light` or `dark` so the host updates even when computed `light-dark()` is unavailable.
- 90% close visible glyph is always `X`; `aria-label` stays `drawer.close`.
- Dashboard sections: Appearance, Clock, Home, Layout; item grid `repeat(3, minmax(0, 1fr))`.
- Within each section, fields are ordered by control type: theme group (Appearance), toggles, selects, numbers, then text.
- Dashboard sections, the Global form, and Automations rows use `--au-home-control-fill` plus a 1px outline so groups stay visually separate.
- The same 36×36 chevron is open and close: it stays in one top-right slot (z-index 23) while the panel slides beneath it; rotation uses `--au-motion-medium` / `--au-motion-ease`. No in-panel duplicate.
- Panel width `min(220px, max(196px, 24vw))`. Enter/Exit edit is a 36×36 pencil/check icon on the open header row, opposite the chevron (inner edge).

## Files touched

- `docs/prd/ux/shell-drawer.md`, `docs/prd/ux/design-system.md`
- `docs/imp/feature/shell-drawer-ux-2.md`
- `README.md`
- `src/theme/tokens.ts`
- `src/template/shell-grid/shell-drawer-settings.ts`
- `src/template/shell-grid/shell-drawer-trigger.ts`
- `src/template/shell-grid/shell-drawer-automations.ts`
- `src/template/shell-grid/au-shell-grid.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/localize/en.ts`, `ru.ts`, `he.ts`
- `test/template/shell-drawer-ux-2.test.ts`
- `test/template/shell-drawer-theme-edit.test.ts`

## Leftover cleanup

- [ ] Storybook for the drawer primitive
- [ ] Reduced-motion YAML (specify key in PRD before adding)

## TDD

- Red: added `test/template/shell-drawer-ux-2.test.ts` and moved theme-edit click into Dashboard Appearance — panel still had `.au-drawer-theme`; Dashboard lacked sections/`X`/theme patch; automations `li` had no row flex; `npx vitest run test/template/shell-drawer-ux-2.test.ts test/template/shell-drawer-theme-edit.test.ts` failed (8 tests).
- Green: theme in Dashboard Appearance + `light-dark()` tokens + `_applyAtriumTheme` surface vars; 3-column sections; close `X`; automation row — `npx vitest run test/template/shell-drawer-ux-2.test.ts test/template/shell-drawer-theme-edit.test.ts` passed; `npm run verify` passed (534 tests).
- Refactor: section wells (fill + outline) on Dashboard / Global / Automations after a follow-up request. Single chevron slot above the sliding panel (no in-panel duplicate). Dashboard fields within a section ordered by control type (toggles → selects → numbers → text); red `orders Dashboard fields by control type within each section`, then green. Narrower panel + Enter edit as a header icon opposite the chevron — red panel-width / icon-pin tests, then green.

## Verification

### Automated

- `npx vitest run test/template/shell-drawer-ux-2.test.ts test/template/shell-drawer-theme-edit.test.ts test/template/shell-drawer-polish.test.ts test/template/shell-drawer-chrome.test.ts`
- `npm run verify`

### Acceptance (from docs/prd/ux/shell-drawer.md)

- AC3: panel width `min(220px, max(196px, 24vw))`.
- AC4: edit is a header icon opposite the chevron; theme in Dashboard Appearance; 90% cards close with **X**; Dashboard sections in a 3-column grid with fill+outline wells; fields within a section ordered by control type; automations one row.
- AC7: `theme` persists via Dashboard settings patch (storage-mode Lovelace).
- Design-system AC5: Home surfaces follow `color-scheme` via `light-dark()` in `tokens.ts`.

### Manual

1. `HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha`
2. Open the drawer — compact panel; pencil icon on the inner header edge, chevron on the outer; no “Enter edit mode” label.
3. Dashboard settings → Appearance: tap Light / Dark / System and confirm shell + tiles restyle.
4. Confirm Appearance / Clock / Home / Layout headings and a 3-column field grid. Clock: date/day toggles then format selects. Layout: columns/rows/max_rows then gap/row height/width/height.
5. Automations: each item is one row (name + Run / Enable-Disable).
6. Close Dashboard, Global, and Automations with **X** (aria-label remains Close settings).
8. Closed: chevron is top-right of Home chrome. Open: same glyph stays in that slot; pencil/check sits on the inner header edge; panel slides under both.
9. Classic `au-shell-grid` (no floors): same header row at 8px.
