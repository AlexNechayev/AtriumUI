# feature/calendar-fullscreen

## Goal

Replace calendar in-grid Expand with a vacuum-style fullscreen overlay: selected-day agenda (1/6) + Apple-like month (5/6), Sunday-start weeks, PRD-aligned.

## Linked docs

- `docs/prd/product/calendar-card.md`
- `README.md` (Calendar Card)

## Decisions

- Reuse `expand_on_tap` (default on) as Fullscreen enable flag; editor label “Fullscreen”.
- Body-portal overlay (`ensureCalendarFullscreenOverlay`), 12px scrim padding, scroll lock.
- Overlay session calendar filters (not persisted to YAML).
- Week start Sunday via `startOfLocalWeek`.
- Compact card always compact; fullscreen is the only expand path.
- Ended-event hiding applies only to compact **agenda** preview; fullscreen keeps past events for the day.

## Files touched

- `docs/prd/product/calendar-card.md`
- `docs/imp/feature/calendar-fullscreen.md`
- `README.md`
- `src/utils/calendar.ts`
- `src/card/calendar-card/au-calendar-card.ts`
- `src/card/calendar-card/au-calendar-fullscreen-overlay.ts`
- `src/card/calendar-card/calendar-card-editor-schema.ts`
- `src/types/calendar.ts`
- `src/localize/en.ts` / `ru.ts` / `he.ts`
- `src/utils/vacuum-device-catalog.ts` (lint prefer-const unblock verify)
- `test/utils/calendar.test.ts`
- `test/card/au-calendar-card.test.ts`
- `test/card/au-calendar-fullscreen-overlay.test.ts`

## TDD

- Red: added Sunday-week / month-pack / span-bar expectations in `test/utils/calendar.test.ts`, overlay singleton + open/close in `test/card/au-calendar-fullscreen-overlay.test.ts`, Fullscreen button + `expand_on_tap: false` in `test/card/au-calendar-card.test.ts`.
- Green: `npx vitest run test/utils/calendar.test.ts test/card/au-calendar-*.test.ts` — passed.
- Refactor: shared month helpers in `src/utils/calendar.ts`; overlay hosts rich month + chrome.

## Leftover cleanup

- Compact month still lacks prev/next month navigation (fullscreen has full nav); optional follow-up.

## Verification

### Automated

- `npm run verify`
- Or focused: `npx vitest run test/utils/calendar.test.ts test/card/au-calendar-card.test.ts test/card/au-calendar-fullscreen-overlay.test.ts`

### Acceptance (from docs/prd/product/calendar-card.md)

- AC6: Fullscreen covers viewport with small margin; X / backdrop close; body scroll lock.
- AC7: Desktop/tablet 1/6–5/6 agenda|month; narrow stacks.
- AC8: Apple-like chips + `+N`, multi-day spans, Sunday-start DOW.
- AC9: Unlimited scrollable day agenda; opens on today; arrow keys move selection.
- AC10: `expand_on_tap: false` hides Fullscreen.

### Manual

1. `HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha`
2. Reload Lovelace resources; open a dashboard with `custom:au-calendar-card`.
3. Tap **Fullscreen** — overlay opens on today with agenda left / month right.
4. Select another day — agenda updates; event detail only on event tap.
5. Prev/next month, Today, calendar filter chips, Refresh.
6. Close via X and via backdrop; confirm scroll restores.
7. Set `expand_on_tap: false` — Fullscreen button hidden.
