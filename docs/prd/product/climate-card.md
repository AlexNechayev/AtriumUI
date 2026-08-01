# Feature: Climate card

| Field | Value |
| --- | --- |
| ID | `prd/product/climate-card` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | README Climate Card |

---

## 1. Problem & user story

**Problem:** Climate entities expose HVAC modes, target temperature, and fan modes with varying capabilities.

**User story:** As a Home Assistant user, I want an AC tile with temperature control and mode/fan selectors, so I can run climate without the more-info dialog.

---

## 2. In / out of scope

### In scope
- HVAC mode selector (`heat_cool` labeled Auto)
- Target temperature slider or buttons (`temperature_control`)
- Fan mode selector when supported
- Secondary line defaults (current temp → hvac_action → state)
- Shared primitives: mode chips, climate selectors, temp stepper

### Out of scope (this feature)
- Humidity targeting, swing, presets, dual heat_cool setpoints (v1)

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entity` (`climate.*`), `name`, `show_temperature`, `temperature_control`, `show_hvac_modes`, `show_fan_mode`, `content_layout`, `secondary_attribute`, actions | Uses entity min/max/step |

---

## 4. Behaviors & business rules

1. UI adapts to `hvac_modes` / `fan_modes` / temp attributes.
2. Home vs classic wiring should converge (assessment med — Phase 3/4).
3. Respect card-contract teardown and actions.

---

## 5. UX flows

### Primary flow
1. Adjust temp → expand mode/fan selectors as needed.

### Empty / first-use
- Cool-only entities hide unused mode chrome.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Missing target temp support | Hide temperature controls |
| Service call failure | Surface HA error; keep last good UI |

---

## 7. Acceptance criteria

1. Temperature control works via slider or buttons per config.
2. HVAC modes list matches entity; Auto label for `heat_cool`.
3. Fan modes appear only when supported and enabled.
4. Humidity/swing/dual setpoints absent (documented non-goal).
5. Card-contract §7 + editor.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
| [../ux/home-tiles.md](../ux/home-tiles.md) | Home variant |
