# Feature: Calendar card

| Field | Value |
| --- | --- |
| ID | `prd/product/calendar-card` |
| Status | Draft |
| Priority | Full v1 depth |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | README Calendar Card |

---

## 1. Problem & user story

**Problem:** Households want an Apple Calendar–inspired glance of HA calendar entities without leaving the dashboard, and a tablet-friendly fullscreen browse mode for denser planning.

**User story:** As a Home Assistant user, I want a view-only calendar preview of `calendar.*` entities, and a fullscreen agenda+month layout, so upcoming events are visible on my Panel dashboard and browsable on a wall tablet.

---

## 2. In / out of scope

### In scope
- Views: agenda (default), today, week, month
- Multi-calendar colors/labels
- Filters: allowlist/blocklist, hide all-day
- Fullscreen overlay (replaces in-grid expand); optional view picker
- Sunday-start weeks everywhere (week view, month grids, DOW headers)
- Rich Apple-like month in fullscreen (event chips, `+N`, multi-day spans)
- Fullscreen: refresh, session per-calendar filters, legend, Today + month nav, keyboard day selection
- `calendar.get_events` (HA 2023.12+) with WebSocket fallback when available

### Out of scope (this feature)
- Direct Google/Apple APIs
- Creating/editing events in AtriumUI
- Resizable splitter

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `title`, `view`, `entities[]` (`entity`, `color`, `label`), `days`, `max_events`, `refresh_minutes`, `timezone`, `expand_on_tap`, `show_*`, filters | `expand_on_tap` (default on) enables the Fullscreen control; view-only |

---

## 4. Behaviors & business rules

1. Read-only; no write services for event CRUD.
2. Refresh on interval; tear down on disconnect.
3. Timezone `local` vs `event`.
4. Weeks start on Sunday.
5. Fullscreen opens on today (selected day + current month); close via X or scrim tap; body scroll locked; body-portal overlay with ~12px margin (vacuum chrome pattern).
6. Fullscreen default body is agenda (1/6) + month (5/6); narrow/portrait stacks agenda on top; view picker can switch to agenda/today/week as a single pane.
7. Day select updates agenda only; event detail opens only when an event is tapped.
8. Fullscreen day agenda is unlimited and scrollable; calendar filters in overlay are session-only.

---

## 5. UX flows

### Primary flow
1. Configure calendars → browse compact agenda/week/month → open Fullscreen → select day → agenda updates → tap event → detail sheet.

### Empty / first-use
- No events in range → empty agenda message.
- Selected day with no events → empty-state copy only.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Integration missing events API | Fall back or show error per HA version |
| Private events | Still view-only; blocklist can hide |
| Outside-month days in grid | Faded, still show events |

---

## 7. Acceptance criteria

1. Agenda/today/week/month views render events from configured entities.
2. Color/label coding works for multi-calendar.
3. Allowlist/blocklist filters apply.
4. No create/edit event UI.
5. Card-contract teardown for refresh timers; editor available.
6. Fullscreen overlay covers the viewport with small margin; closes via X or backdrop; locks body scroll.
7. Desktop/tablet: selected-day agenda left ~16.7%, rich month right ~83.3%; narrow stacks agenda above month.
8. Month cells pack as many event chips as fit (time when space allows) then `+N`; multi-day events span; Sunday-start DOW.
9. Fullscreen day agenda is unlimited + scrollable; opens on today; keyboard arrows move selected day.
10. `expand_on_tap: false` hides the Fullscreen control.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
| HA calendar integrations | Data source |
