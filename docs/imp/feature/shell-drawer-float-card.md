# Implementation: Shell drawer 90% floating card

| Field | Value |
| --- | --- |
| Branch | `feature/shell-drawer-float-card` |
| Worktree | `.worktrees/feature-shell-drawer-float-card` |
| Status | In progress |

## Goal

Dashboard settings, Global, and Automations open a centered 90% Home-look card; tap outside closes only the card ([`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md) AC4, AC5).

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)

## Decisions

- Catcher closes the float card first, then the panel.
- Card bodies are titles only until Dashboard/Global/Automations slices.

## Files touched

- `src/template/shell-grid/shell-drawer-trigger.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/template/shell-grid/au-shell-grid.ts`
- `src/localize/en.ts`, `ru.ts`, `he.ts`
- `test/template/shell-drawer-float-card.test.ts`
- `docs/imp/feature/shell-drawer-float-card.md`

## Leftover cleanup

- [ ] Dashboard/Global field editors
- [ ] Automations list enable/disable/run

## TDD

- Red: added `test/template/shell-drawer-float-card.test.ts` — nav button missing.
- Green: nav items + `.au-drawer-float` — `npx vitest run test/template/shell-drawer-float-card.test.ts` passed; `npm run verify` passed (514 tests).

## Verification

### Automated

- `npx vitest run test/template/shell-drawer-float-card.test.ts`
- `npm run verify`

### Acceptance

- AC4: settings/global/automations open a 90% card.
- AC5: outside tap closes only the card.

### Manual

1. Open drawer, tap Dashboard settings: 90% card; tap outside: card gone, panel remains.
2. Repeat for Global and Automations.
