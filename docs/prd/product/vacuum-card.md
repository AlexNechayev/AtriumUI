# Feature: Vacuum card

| Field | Value |
| --- | --- |
| ID | `prd/product/vacuum-card` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | README Vacuum Card |

---

## 1. Problem & user story

**Problem:** Vacuums need start/pause/stop/return plus deep device settings across many related entities.

**User story:** As a Home Assistant user, I want a vacuum tile with optional controls and a settings dashboard that discovers related device entities, so I can run cleans and tune the robot without hunting entities.

---

## 2. In / out of scope

### In scope
- Primary tap: start when idle/docked; return home when cleaning
- Optional start/pause/stop/return (`show_controls`; Home glance defaults hide)
- Settings overlay (`show_settings`): auto-discover same-device entities; Essentials + Advanced; draft until Apply
- Sections: Status, Clean, Map, Rooms, Dock, Maintenance, AI, DND, Voice, Advanced
- `hide_sections`

### Out of scope (this feature)
- Vendor cloud APIs outside HA entities

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entity` (`vacuum.*`), `name`, `show_controls`, `show_settings`, `hide_sections` | Hold opens settings (replaces more-info) |

---

## 4. Behaviors & business rules

1. Gear + hold open full-screen settings overlay.
2. Edits draft until Apply.
3. Overlay tears down on disconnect.

---

## 5. UX flows

### Primary flow
1. Tap starts/returns; open settings → adjust → Apply.

### Empty / first-use
- No related entities: essentials/advanced empty states.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Device registry missing | Fall back to vacuum entity only |
| Apply partial failure | Keep draft; surface error |

---

## 7. Acceptance criteria

1. Primary tap start vs return based on state.
2. Controls respect show flag + features; Home default hides domain controls.
3. Settings overlay discovers enabled same-device entities and applies drafts on Apply.
4. Overlay removed on disconnect.
5. Card-contract §7 + editor.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
| Vacuum device catalog utils | Discovery |

---

## 9. Implementation

This feature **implements** via:

| Symbol | Path |
| --- | --- |
| `AuVacuumCard` | `src/card/vacuum-card/au-vacuum-card.ts` |
| `AuVacuumSettingsOverlay` | `src/card/vacuum-card/au-vacuum-settings-overlay.ts` |
| `buildVacuumDeviceCatalog()` | `src/utils/vacuum-device-catalog.ts` |
| `applyVacuumDraft()` | `src/utils/vacuum-settings-draft.ts` |
| `startVacuum()` / `pauseVacuum()` / `stopVacuum()` / `returnVacuum()` | `src/utils/vacuum.ts` |

Settings overlay concept **implements** `AuVacuumSettingsOverlay`.
