# Feature: Fan card

| Field | Value |
| --- | --- |
| ID | `prd/product/fan-card` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | README Fan Card |

---

## 1. Problem & user story

**Problem:** Fans need on/off plus optional speed, presets, oscillate, and direction.

**User story:** As a Home Assistant user, I want a dedicated fan tile with speed as slider or buttons, so fan controls match other Atrium cards.

---

## 2. In / out of scope

### In scope
- Primary tap toggle
- Speed slider or `speed_control: button`
- Preset modes, oscillate, direction when supported
- On-palette speed fill (home/classic)

### Out of scope (this feature)
- Using `au-device-card` for fans (dedicated card required)

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entity` (`fan.*`), `name`, `show_speed`, `speed_control`, `show_preset_modes`, `show_oscillate`, `show_direction` | Capability gated |

---

## 4. Behaviors & business rules

1. Hide unsupported controls.
2. Speed fill follows on-palette when fan is on.

---

## 5. UX flows

### Primary flow
1. Tap toggles; adjust speed/presets/oscillate/direction as shown.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| No percentage speed | Hide speed or degrade gracefully per entity features |

---

## 7. Acceptance criteria

1. Toggle works via primary tap.
2. Speed control respects `slider` vs `button`.
3. Optional controls appear only when supported and enabled.
4. Card-contract §7 + editor.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
