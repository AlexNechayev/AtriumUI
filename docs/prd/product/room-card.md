# Feature: Room card

| Field | Value |
| --- | --- |
| ID | `prd/product/room-card` |
| Status | Draft |
| Priority | Full v1 depth |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | README Room Card; shell room-controls for Home strip |

---

## 1. Problem & user story

**Problem:** Users want a compact row of icon buttons to toggle lights/switches for a room without opening each entity card.

**User story:** As a Home Assistant user, I want a room icon strip card, so I can toggle several entities at a glance.

---

## 2. In / out of scope

### In scope
- `custom:au-room-card` icon button row for lights/switches
- Toggle on tap
- Optional `temperature_entity` header preview (icon | temperature on the first row; name and subtitle under the icon, start-aligned)

### Out of scope (this feature)
- Replacing Home shell room-tile strip (related but shell-owned via `room_controls`)
- Layering cleanup moving `controlIcon` fully into utils (assessment — later phase)

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entities`, `name`, `icon`, `subtitle`, `show_name`, `compact`, `header_interactive` | Align with README / editor schema |
| Optional preview | `temperature_entity` | Sensor id; omitted = stacked header (icon above name). Home rooms use the same key. |

---

## 4. Behaviors & business rules

1. Tap toggles target entity.
2. Prefer shared control icon helpers with shell room-controls over duplicated logic.
3. `temperature_entity` is optional. When unset, keep the stacked header. When set, first row is icon | formatted temperature (1 decimal + unit); name and subtitle stay under the icon, start-aligned.
4. Missing / `unavailable` / `unknown` sensor: stay in the beside-icon first row and show `—`. Compact still hides the whole header.

---

## 5. UX flows

### Primary flow
1. Tap icon → entity toggles; icon reflects state.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Empty entity list | Empty state |
| Mixed domains | Only supported toggle domains |
| No `temperature_entity` | Stacked header; no temperature node |
| Sensor missing or unavailable | `—` in the temperature slot; do not revert to stacked |

---

## 7. Acceptance criteria

1. Renders icon buttons for configured light/switch entities.
2. Tap toggles and updates visual state.
3. Card-contract §7 + editor when provided.
4. Without `temperature_entity`, the header stays stacked (icon above name); no temperature preview.
5. With `temperature_entity`, the first header row is icon | temperature; name and subtitle are under the icon, start-aligned.
6. Unavailable or missing temperature sensor shows `—` without leaving that layout.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
| [../platform/shell-grid.md](../platform/shell-grid.md) | Related Home strip |
