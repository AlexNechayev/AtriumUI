# Feature: Cover card

| Field | Value |
| --- | --- |
| ID | `prd/product/cover-card` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | README Cover Card |

---

## 1. Problem & user story

**Problem:** Covers need toggle plus optional open/close/stop and position.

**User story:** As a Home Assistant user, I want a cover tile with position when supported, so blinds and garage doors are controllable in-grid.

---

## 2. In / out of scope

### In scope
- Primary tap `cover.toggle`
- Optional open/close/stop (`show_controls`)
- Optional position slider (`show_position`)

### Out of scope (this feature)
- Tilt-only specialized UX beyond entity features already exposed

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entity` (`cover.*`), `name`, `show_controls`, `show_position` | Feature gated |

---

## 4. Behaviors & business rules

1. Controls/position hide when unsupported or disabled.
2. Open/closed state colors use tokens (`--au-state-open` / closed).

---

## 5. UX flows

### Primary flow
1. Tap toggles; use buttons/slider for precise control.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Moving / unknown state | Show transitional state without crashing |

---

## 7. Acceptance criteria

1. Primary tap runs cover toggle.
2. Controls and position respect show flags + features.
3. Card-contract §7 + editor.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
