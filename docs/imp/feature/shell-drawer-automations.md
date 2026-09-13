# Implementation: Shell drawer Automations list

| Field | Value |
| --- | --- |
| Branch | `feature/shell-drawer-automations` |
| Worktree | `.worktrees/feature-shell-drawer-automations` |
| Status | In progress |

## Goal

Automations 90% card lists `automation.*` from `hass.states` with enable/disable/run only; empty and unavailable states are explicit; actions go through `executeAction`; overlays tear down on disconnect ([`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md) AC8, AC12).

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)
- [`docs/prd/platform/card-contract.md`](../../prd/platform/card-contract.md)

## Decisions

- No create/edit UI.
- Enable/disable/run use `call-service` via `executeAction` (`automation.turn_on` / `turn_off` / `trigger`).
- Unavailable/missing: row shows unavailable copy; services are not called.
- Overlay nodes are removed in `disconnectedCallback`.

## Files touched

- `src/template/shell-grid/shell-drawer-automations.ts`
- `src/template/shell-grid/shell-drawer-trigger.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/template/shell-grid/au-shell-grid.ts`
- `src/localize/en.ts`, `ru.ts`, `he.ts`
- `test/template/shell-drawer-automations.test.ts`
- `docs/imp/feature/shell-drawer-automations.md`

## Leftover cleanup

- [ ] Reduced-motion YAML (specify key in PRD before adding)
- [ ] Entity pickers for scenes/scripts/presence in Dashboard settings
- [ ] Storybook for the drawer primitive
- [ ] AC11 chrome collision (clock/pencil vs drawer icon) if still overlapping

## TDD

- Red: added `test/template/shell-drawer-automations.test.ts` — empty/list/unavailable/teardown assertions failed (no list body; float card remained after disconnect).
- Green: `shell-drawer-automations.ts` + overlay teardown — `npx vitest run test/template/shell-drawer-automations.test.ts` passed; `npm run verify` passed (520 tests).
- Refactor: none.

## Verification

### Automated

- `npx vitest run test/template/shell-drawer-automations.test.ts`
- `npm run verify`

### Acceptance (from docs/prd/ux/shell-drawer.md)

- AC8: list can enable/disable/run; no create/edit path; empty and unavailable are explicit.
- AC12: overlays are removed on disconnect; automation actions use validated `executeAction`.

### Manual

1. `HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha`
2. Open drawer → Automations: list `automation.*`; Run / Enable / Disable.
3. Confirm there is no create or edit control.
4. With no automations: empty copy, not a blank card.
5. Unavailable automation: row shows Unavailable; Run/Enable do not call HA.
6. Leave the view while the card is open: catcher/panel/card are gone (no leftover overlay).
