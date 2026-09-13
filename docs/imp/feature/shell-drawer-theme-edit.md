# Implementation: Shell drawer theme + enter edit

| Field | Value |
| --- | --- |
| Branch | `feature/shell-drawer-theme-edit` |
| Worktree | `.worktrees/feature-shell-drawer-theme-edit` |
| Status | In progress |

## Goal

Inline Dark/Light/System in the drawer (Atrium color-scheme only) and Enter edit that closes the panel then uses existing HA edit chrome ([`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md) AC4, AC6, AC7).

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)
- [`docs/prd/ux/edit-mode.md`](../../prd/ux/edit-mode.md)
- [`docs/prd/ux/design-system.md`](../../prd/ux/design-system.md)

## Decisions

- Theme writes `theme` on this shell YAML via existing `saveConfig` persist.
- Enter edit calls `lovelace.setEditMode(true)` when present; also sets `editMode`/`preview` so desktop layout chrome can appear in tests.

## Files touched

- `src/template/shell-grid/shell-drawer-trigger.ts`
- `src/template/shell-grid/au-shell-grid.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/types/home-assistant.ts`
- `src/localize/en.ts`, `ru.ts`, `he.ts`
- `test/template/shell-drawer-theme-edit.test.ts`
- `docs/imp/feature/shell-drawer-theme-edit.md`

## Leftover cleanup

- [ ] 90% floating cards, Dashboard/Global, Automations

## TDD

- Red: added `test/template/shell-drawer-theme-edit.test.ts` — theme/edit controls missing.
- Green: `renderDrawerMenu` + host color-scheme + `setEditMode` — `npx vitest run test/template/shell-drawer-theme-edit.test.ts` passed; `npm run verify` passed (513 tests).

## Verification

### Automated

- `npx vitest run test/template/shell-drawer-theme-edit.test.ts`
- `npm run verify`

### Acceptance

- AC4: Theme + edit stay in the panel.
- AC6: Enter edit closes the drawer; pencil path via `setEditMode`.
- AC7: Theme writes this shell config (storage persist when lovelace.saveConfig exists).

### Manual

1. Open drawer, switch Dark/Light/System; confirm Atrium surfaces change, HA theme picker unchanged.
2. Reload storage dashboard; theme still applied.
3. Enter edit: drawer closes; existing Done chrome works.
