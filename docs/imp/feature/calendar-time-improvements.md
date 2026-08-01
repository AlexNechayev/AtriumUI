# feature/calendar-time-improvements

## Goal

Calendar card: configurable 12h/24h event time format (default 24h), and hide events once their end time has passed (including between refresh polls).

## Linked docs

- `docs/prd/product/calendar-card.md`
- `README.md` (Calendar Card)

## Decisions

- Card-level `time_format` overrides HA locale so default stays 24h.
- Ended filter: keep while `end > now`; applied in normalize before `max_events`, and again at render via a 1-minute `_now` tick.
- Applies to all views (agenda / today / week / month).

## Files touched

- `src/types/calendar.ts`
- `src/utils/calendar.ts`
- `src/card/calendar-card/au-calendar-card.ts`
- `src/card/calendar-card/au-calendar-card-editor.ts`
- `src/card/calendar-card/calendar-card-editor-schema.ts`
- `test/utils/calendar.test.ts`
- `README.md`

## TDD

- Red/green: extended `test/utils/calendar.test.ts` for ended-event filter, `maxEvents` interaction, and `formatEventTimeRange` 12h/24h.
- Green: `npx vitest run test/utils/calendar.test.ts` — 12 passed.

## Verification

### Automated

- `npx vitest run test/utils/calendar.test.ts`
- Prefer: `npm run verify`

### Acceptance

- Event times respect `time_format` (`24h` default, `12h` optional).
- Timed events remain while ongoing; disappear after end.
- Ended events do not consume `max_events`.

### Manual

1. Add `custom:au-calendar-card` with a timed event; confirm 24h times by default.
2. Set `time_format: 12h` and confirm AM/PM display.
3. Wait until an event’s end time (or adjust system clock); confirm it drops without waiting for `refresh_minutes`.
