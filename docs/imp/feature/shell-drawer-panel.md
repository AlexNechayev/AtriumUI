# Implementation: Shell drawer overlay panel

| Field | Value |
| --- | --- |
| Branch | `feature/shell-drawer-panel` |
| Worktree | `.worktrees/feature-shell-drawer-panel` |
| Status | In progress |

## Goal

Open a right-side overlay panel (no dim) when the chevron is open; tap outside closes it. Width `min(360px, max(280px, 40vw))` ([`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md) AC3).

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)

## Decisions

- Invisible full-shell catcher (transparent background) + right `aside` panel.
- Menu body is empty until the theme/edit slice.

## Files touched

- `src/template/shell-grid/shell-drawer-trigger.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/template/shell-grid/au-shell-grid.ts`
- `src/template/shell-grid/home-view-styles.ts`
- `test/template/shell-drawer-panel.test.ts`
- `docs/imp/feature/shell-drawer-panel.md`

## Leftover cleanup

- [ ] Inline theme + Enter edit
- [ ] 90% cards, Dashboard/Global, Automations

## TDD

- Red: added `test/template/shell-drawer-panel.test.ts` — panel missing after open.
- Green: `renderDrawerOverlay` — `npx vitest run test/template/shell-drawer-panel.test.ts` passed; `npm run verify` passed (511 tests).
- Refactor: none.

## Verification

### Automated

- `npx vitest run test/template/shell-drawer-panel.test.ts`
- `npm run verify`

### Acceptance (from docs/prd/ux/shell-drawer.md)

- AC3: Panel from the right, width formula, no dim; outside tap closes when no 90% card.

### Manual

1. Open Home, tap chevron: panel from the right, dashboard not dimmed.
2. Tap outside the panel: it closes and the chevron rotates back.
