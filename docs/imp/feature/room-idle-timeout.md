# Implementation: Room idle timeout

| Field | Value |
| --- | --- |
| Branch | `feature/room-idle-timeout` |
| Worktree | `.worktrees/feature-room-idle-timeout` |
| Status | Done (merged tip matches `main`) |

## Goal

Ship configurable `room_idle_timeout` on `au-shell-grid` Home mode that returns to the Home overview after N seconds of inactivity in a room (0/unset = off).

## Linked official docs

- [docs/prd/platform/shell-grid.md](../../prd/platform/shell-grid.md) §4 / §7 AC4
- [docs/PRD.md](../../PRD.md) §7.1 Shell grid
- [docs/ARCHITECTURE.md](../../ARCHITECTURE.md) §5 Shell modes
- [docs/ops/local-dev-ha.md](../../ops/local-dev-ha.md)

## Decisions

- Feature work historically on `feature/room-idle-timeout`; worktree normalized to `.worktrees/feature-room-idle-timeout`.
- Config key: `room_idle_timeout` (number seconds); editor label “Return to Home after idle (0 = off)”.
- Timer lives in `AuShellHomeView`; activity resets the countdown.
- Covered by Vitest in `test/template/au-shell-grid-home.test.ts` (room idle timeout suite).

## Files touched

- `src/types/config.ts` (`room_idle_timeout?`)
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/template/shell-grid/au-shell-grid-editor.ts`
- `test/template/au-shell-grid-home.test.ts`
- `docs/imp/feature/room-idle-timeout.md`

## Leftover cleanup

- [ ] None required for idle timeout itself
- [ ] Broader Home view carve-up remains Phase 4 (unrelated)

## TDD

- Red/Green: idle timeout behavior encoded in `test/template/au-shell-grid-home.test.ts` (`stays in room when unset/0`, `returns to Home after room_idle_timeout seconds`)
- Suite: `npm test -- test/template/au-shell-grid-home.test.ts`

## Verification

### Automated

- `npm test -- test/template/au-shell-grid-home.test.ts`
- `npm run verify`

### Acceptance (from docs/prd/platform/shell-grid.md §7)

- AC4: `room_idle_timeout` returns to Home after configured idle seconds; 0/unset disables

### Manual

1. `HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha`
2. Set `room_idle_timeout: 10` on a Home `au-shell-grid`
3. Open a room; wait 10s without interaction → returns to Home
4. Set `0` or remove key → stays in room
