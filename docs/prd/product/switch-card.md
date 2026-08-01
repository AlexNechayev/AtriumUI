# Feature: Switch card

| Field | Value |
| --- | --- |
| ID | `prd/product/switch-card` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | README Switch Card |

---

## 1. Problem & user story

**Problem:** Switches should use explicit turn_on/turn_off from live state rather than a generic toggle ambiguity.

**User story:** As a Home Assistant user, I want a dedicated switch tile, so relays and plugs behave predictably.

---

## 2. In / out of scope

### In scope
- `custom:au-switch-card`
- Primary tap uses explicit `turn_on` / `turn_off` from state

### Out of scope (this feature)
- Routing switches through device-card

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entity` (`switch.*`), `name`, actions | Simple tile |

---

## 4. Behaviors & business rules

1. Derive next service from current on/off state.
2. Reflect active state with tokens.

---

## 5. UX flows

### Primary flow
1. Tap flips switch on/off.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Unavailable | Disable interaction; show unavailable |

---

## 7. Acceptance criteria

1. Tap calls the correct turn_on/turn_off service from live state.
2. Card-contract §7 + editor.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
