# Implementation: Shell drawer YAML config

| Field | Value |
| --- | --- |
| Branch | `feature/shell-drawer-config` |
| Worktree | `.worktrees/feature-shell-drawer-config` |
| Status | In progress |

## Goal

Parse and validate `theme` + `drawer` on `au-shell-grid` so later chrome can hide the trigger when the drawer is off or every item is false ([`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md) §3, AC9).

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)
- [`docs/prd/platform/shell-grid.md`](../../prd/platform/shell-grid.md)
- [`docs/PRD.md`](../../PRD.md) D15

## Decisions

- Pure helpers in `shell-drawer-config.ts`; `AuShellGrid.validateConfig` calls them.
- Omitted `theme` → `system`. Omitted `drawer` / items → enabled with all items on.
- Unknown `drawer.items` keys are ignored (forward compatible).

## Files touched

- `src/template/shell-grid/shell-drawer-config.ts`
- `src/types/config.ts`
- `src/template/shell-grid/au-shell-grid.ts`
- `test/template/shell-drawer-config.test.ts`
- `docs/imp/feature/shell-drawer-config.md`

## Leftover cleanup

- [ ] Chrome (chevron), panel, theme apply, 90% cards — later slices

## TDD

- Red: added `test/template/shell-drawer-config.test.ts` — `npx vitest run test/template/shell-drawer-config.test.ts` failed (`Failed to resolve import ".../shell-drawer-config"`).
- Green: implemented `src/template/shell-grid/shell-drawer-config.ts` + `validateConfig` hook — same file 13 passed; `npm run verify` passed (505 tests).
- Refactor: none.

## Verification

### Automated

- `npx vitest run test/template/shell-drawer-config.test.ts`
- `npm test`

### Acceptance (from docs/prd/ux/shell-drawer.md)

- AC9 (data): `drawer.enabled: false` or all items false → `shouldShowDrawerTrigger` is false; defaults show the trigger.
- Invalid `theme` / `drawer` shapes are rejected in `setConfig`.

### Manual

1. Not UI yet. Confirm YAML with `theme: dark` and `drawer.enabled: false` does not throw in a Panel view when chrome lands in the next slice.
