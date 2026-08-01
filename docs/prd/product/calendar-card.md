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

**Problem:** Households want an Apple Calendar–inspired glance of HA calendar entities without leaving the dashboard.

**User story:** As a Home Assistant user, I want a view-only calendar preview of `calendar.*` entities, so upcoming events are visible on my Panel dashboard.

---

## 2. In / out of scope

### In scope
- Views: agenda (default), today, week, month
- Multi-calendar colors/labels
- Filters: allowlist/blocklist, hide all-day
- Expand-on-tap; optional view picker
- `calendar.get_events` (HA 2023.12+) with WebSocket fallback when available

### Out of scope (this feature)
- Direct Google/Apple APIs
- Creating/editing events in AtriumUI

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `title`, `view`, `entities[]` (`entity`, `color`, `label`), `days`, `max_events`, `refresh_minutes`, `timezone`, `expand_on_tap`, `show_*`, filters | View-only |

---

## 4. Behaviors & business rules

1. Read-only; no write services for event CRUD.
2. Refresh on interval; tear down on disconnect.
3. Timezone `local` vs `event`.

---

## 5. UX flows

### Primary flow
1. Configure calendars → browse agenda/week/month → expand event details.

### Empty / first-use
- No events in range → empty agenda message.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Integration missing events API | Fall back or show error per HA version |
| Private events | Still view-only; blocklist can hide |

---

## 7. Acceptance criteria

1. Agenda/today/week/month views render events from configured entities.
2. Color/label coding works for multi-calendar.
3. Allowlist/blocklist filters apply.
4. No create/edit event UI.
5. Card-contract teardown for refresh timers; editor available.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
| HA calendar integrations | Data source |
