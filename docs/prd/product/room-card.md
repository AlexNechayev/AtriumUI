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

### Out of scope (this feature)
- Replacing Home shell room-tile strip (related but shell-owned via `room_controls`)
- Layering cleanup moving `controlIcon` fully into utils (assessment — later phase)

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | entities / icons configuration per implementation | Align with README / editor schema |

---

## 4. Behaviors & business rules

1. Tap toggles target entity.
2. Prefer shared control icon helpers with shell room-controls over duplicated logic.

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

---

## 7. Acceptance criteria

1. Renders icon buttons for configured light/switch entities.
2. Tap toggles and updates visual state.
3. Card-contract §7 + editor when provided.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
| [../platform/shell-grid.md](../platform/shell-grid.md) | Related Home strip |
