# Implementation: Shell drawer Dashboard + Global settings

| Field | Value |
| --- | --- |
| Branch | `feature/shell-drawer-dash-global` |
| Worktree | `.worktrees/feature-shell-drawer-dash-global` |
| Status | In progress |

## Goal

Dashboard settings and Global configuration 90% cards edit this-shell YAML with one owner per key and persist on storage-mode Lovelace ([`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md) AC4, AC7).

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)
- [`docs/prd/platform/shell-grid.md`](../../prd/platform/shell-grid.md)
- [`docs/prd/ux/localize.md`](../../prd/ux/localize.md)

## Decisions

- Dashboard owns this-view chrome (`clock_*`, `show_presence`, `show_bulk_actions`, `room_idle_timeout`, layout keys, `header_*`, `auto_areas`).
- Global owns `confirm_actions` and `prefer_device_name` (and `room_controls.show` as the existing Home extra-controls default). No new reduced-motion YAML key (not named in the PRD).
- Writes merge into the current `au-shell-grid` config and reuse `_persistToDashboard`.
- Drawer item visibility (`drawer.*`) stays YAML-only.

## Files touched

- `src/template/shell-grid/shell-drawer-settings.ts` (planned)
- `src/template/shell-grid/shell-drawer-trigger.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/template/shell-grid/au-shell-grid.ts`
- `src/localize/en.ts`, `ru.ts`, `he.ts`
- `test/template/shell-drawer-dash-global.test.ts`
- `docs/imp/feature/shell-drawer-dash-global.md`

## Leftover cleanup

- [ ] Automations list enable/disable/run
- [ ] Reduced-motion YAML (specify key in PRD before adding)
- [ ] Entity pickers for scenes/scripts/presence in the 90% cards

## TDD

- Red: added `test/template/shell-drawer-dash-global.test.ts` — `npx vitest run test/template/shell-drawer-dash-global.test.ts` failed (`[data-setting="show_presence"]` / `confirm_actions` missing).
- Green: `shell-drawer-settings.ts` forms + persist via `_persistToDashboard` — same command passed; `npm run verify` passed (516 tests).
- Refactor: none.

## Verification

### Automated

- `npx vitest run test/template/shell-drawer-dash-global.test.ts`
- `npm run verify`

### Acceptance (from docs/prd/ux/shell-drawer.md)

- AC4: Dashboard settings and Global open the 90% card with field editors (Automations body still next slice).
- AC7: Dashboard/Global writes merge into this shell YAML and persist on storage-mode Lovelace (`saveConfig`).

### Manual

1. `HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha`
2. Open the drawer → Dashboard settings: toggle presence / clock / idle timeout; confirm the Home chrome updates.
3. Open Global: toggle confirm actions / prefer device name; reload a storage-mode dashboard and confirm YAML kept the values.
4. YAML-mode: expect the existing storage-mode toast / no silent save (same as edit Done).
