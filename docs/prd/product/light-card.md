# Feature: Light card

| Field | Value |
| --- | --- |
| ID | `prd/product/light-card` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | README Light Card, [card-contract](../platform/card-contract.md) |

---

## 1. Problem & user story

**Problem:** Lights vary in capability (on/off, brightness, CCT, RGB); UI should adapt.

**User story:** As a Home Assistant user, I want a light tile that shows only supported controls, so I can dim and color lights without clutter.

---

## 2. In / out of scope

### In scope
- Capability-driven UI (on/off, brightness, CCT, RGB/HS, color_mode)
- `au-light-slider` reuse
- Show flags for brightness/color_temp/rgb
- Tap actions

### Out of scope (this feature)
- Effects / advanced light scenes UI

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entity` (`light.*`), `name`, `show_brightness`, `show_color_temp`, `show_rgb`, actions | Adapts to supported features |

---

## 4. Behaviors & business rules

1. Hide unsupported sliders.
2. RGB+CCT follows live `color_mode`.
3. Slider gestures should share pending-control patterns (Phase 3 consolidation).

---

## 5. UX flows

### Primary flow
1. Tap header toggles; drag sliders set brightness/temp/color.

### Empty / first-use
- On/off-only lights: header only, no sliders.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Light turns unavailable mid-drag | Stop pending updates cleanly |
| Feature flags false | Hide even if supported |

---

## 7. Acceptance criteria

1. On/off-only lights render without sliders.
2. Dimmable / CCT / RGB show appropriate sliders.
3. RGB+CCT respects `color_mode`.
4. Satisfies card-contract §7; editor available.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
| Components `au-light-slider` | Shared slider |
