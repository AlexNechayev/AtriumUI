# Feature: Action card

| Field | Value |
| --- | --- |
| ID | `prd/product/action-card` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`PRD.md`](../../PRD.md) D5, [card-contract](../platform/card-contract.md) |

---

## 1. Problem & user story

**Problem:** Dashboards need a generic reactive tile for toggleable entities without a dedicated domain card.

**User story:** As a Home Assistant user, I want a simple action tile bound to an entity with tap/hold/double-tap actions, so I can control devices consistently.

---

## 2. In / out of scope

### In scope
- `custom:au-action-card` via `AuActionCardBase`
- Optional name/icon/secondary slots with `show_*` flags
- `content_layout` horizontal/vertical
- Default and custom HA actions

### Out of scope (this feature)
- Domain-specific sliders (light/climate/etc.)
- Legacy `tap_service` / `tap_service_data` (removed)

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entity` (required), `name`, `show_name`, `icon`, `show_icon`, `secondary_attribute`, `show_secondary_attribute`, `content_layout`, actions | Slots hide when show flags false |

---

## 4. Behaviors & business rules

1. Only `entity` required.
2. Omitted display fields use entity defaults when shown.
3. Action defaults per card-contract.
4. Reflects on/off (active) state visually.

---

## 5. UX flows

### Primary flow
1. Tap toggles entity; hold/double-tap open more-info unless overridden.

### Empty / first-use
- Missing entity → unavailable state.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Not toggleable | Default tap falls back to more-info |
| Offline entity | Offline/unavailable styling |

---

## 7. Acceptance criteria

1. Renders with required `entity` and optional slots.
2. Default tap toggles when toggleable.
3. `show_*` flags hide corresponding UI.
4. Satisfies [card-contract](../platform/card-contract.md) §7.
5. Visual editor available via `getConfigElement()`.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Base contract |
| [../ux/design-system.md](../ux/design-system.md) | Look |
