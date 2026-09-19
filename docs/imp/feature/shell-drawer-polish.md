# Implementation: Shell drawer polish

| Field | Value |
| --- | --- |
| Branch | `feature/shell-drawer-polish` |
| Worktree | `.worktrees/feature-shell-drawer-polish` |
| Status | In progress |

## Goal

Bound the drawer to the shell host, add an in-panel close chevron and slide-open motion, make edit mode exit (native Done + drawer Exit), and list all HA automations from states + entity registry ([`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)).

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)
- [`docs/prd/ux/edit-mode.md`](../../prd/ux/edit-mode.md)
- [`docs/prd/platform/card-contract.md`](../../prd/platform/card-contract.md)

## Decisions

- Overlay `height`/`max-height` 100% of the shell host — never `100vh`.
- Panel close control is the same 36×36 chevron as the toolbar trigger.
- Open animation: `translateX(100%) → 0` with `--au-motion-medium` / `--au-motion-ease`.
- Enter/Exit edit does not latch `this.editMode` / `this.preview`; Exit calls `setEditMode(false)`.
- Automations: union `hass.states` + `hass.entities`; WS registry list if both empty.

## Files touched

- `src/template/shell-grid/shell-drawer-trigger.ts`
- `src/template/shell-grid/shell-drawer-automations.ts`
- `src/template/shell-grid/au-shell-grid.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/template/shell-grid/home-view-styles.ts`
- `src/localize/en.ts`, `ru.ts`, `he.ts`
- `docs/prd/ux/shell-drawer.md`, `docs/prd/ux/edit-mode.md`
- `test/template/shell-drawer-polish.test.ts`
- `test/template/shell-drawer-automations.test.ts`
- `docs/imp/feature/shell-drawer-polish.md`

## Leftover cleanup

- [ ] Storybook for the drawer primitive
- [ ] Reduced-motion YAML (specify key in PRD before adding)

## TDD

- Red: added `test/template/shell-drawer-polish.test.ts` and registry-only automations case — panel height/close/transition missing; edit stayed on after Done; registry automations absent.
- Green: overlay bound + in-panel chevron + slide + unlatched edit toggle + `listShellAutomations` states/entities — `npx vitest run test/template/shell-drawer-polish.test.ts test/template/shell-drawer-automations.test.ts` passed; `npm run verify` passed (526 tests).
- Refactor: none.

## Verification

### Automated

- `npx vitest run test/template/shell-drawer-polish.test.ts test/template/shell-drawer-automations.test.ts`
- `npm run verify`

### Acceptance (from docs/prd/ux/shell-drawer.md)

- AC3: panel height is the shell host (`height`/`max-height` 100%, no `100vh`).
- AC4: in-panel close chevron; slide-open motion.
- AC6: Enter/Exit edit; native Done leaves edit; pencil remains.
- AC8: automations from states + entity registry; no create/edit.

### Manual

1. `HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha`
2. Dashboard `height: 606px`: open drawer — panel must not extend below the shell.
3. Close from the in-panel chevron; confirm slide-in from the right.
4. Enter edit, then HA Done (or drawer Exit, including kiosk `hide_header`) — layout chrome turns off.
5. Automations lists every `automation.*`, including ones not placed as tiles.
