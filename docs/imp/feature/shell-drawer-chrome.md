# Implementation: Shell drawer trigger chrome

| Field | Value |
| --- | --- |
| Branch | `feature/shell-drawer-chrome` |
| Worktree | `.worktrees/feature-shell-drawer-chrome` |
| Status | In progress |

## Goal

Render the top-right icon-only chevron (36×36, no fill, 90° when open) on Home and classic `au-shell-grid`, hidden when YAML turns the drawer off ([`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md) AC1–2, AC9, AC11).

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)
- [`docs/prd/ux/localize.md`](../../prd/ux/localize.md)

## Decisions

- Shared `renderDrawerTrigger` for Home toolbar-end (rightmost) and classic absolute top-right.
- Hit target and rotation are inline so the contract is independent of test-DOM computed styles.
- Panel overlay is the next slice; this only toggles open state on the icon.

## Files touched

- `src/template/shell-grid/shell-drawer-trigger.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/template/shell-grid/au-shell-grid.ts`
- `src/localize/en.ts`, `ru.ts`, `he.ts`
- `test/template/shell-drawer-chrome.test.ts`
- `docs/imp/feature/shell-drawer-chrome.md`

## Leftover cleanup

- [ ] Right overlay panel, tap-outside, 40% width — next slice

## TDD

- Red: added `test/template/shell-drawer-chrome.test.ts` — Home/classic trigger missing (`expected null not to be null`).
- Green: `renderDrawerTrigger` on Home toolbar-end + classic shell — `npx vitest run test/template/shell-drawer-chrome.test.ts` passed (5).
- Refactor: inline 36×36 / rotate styles so assertions do not depend on happy-dom layout.

## Verification

### Automated

- `npx vitest run test/template/shell-drawer-chrome.test.ts`
- `npm run verify`

### Acceptance (from docs/prd/ux/shell-drawer.md)

- AC1: Home and classic show the icon when enabled with at least one item.
- AC2: Chevron, no background, 36×36, 90° when open.
- AC9: Disabled / all items false hides the icon.
- AC11: Trigger is last in Home `toolbar-end` (rightmost).

### Manual

1. `HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha`
2. Open a Home Panel view: confirm top-right chevron; tap to rotate 90°.
3. Open a classic `cards[]` shell: same icon top-right.
4. Set `drawer.enabled: false` and reload: icon gone.
