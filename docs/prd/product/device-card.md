# Feature: Device card

| Field | Value |
| --- | --- |
| ID | `prd/product/device-card` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | README Device Card, PRD D11 |

---

## 1. Problem & user story

**Problem:** Some domains lack a dedicated card but still need an adaptive tile (e.g. water heater).

**User story:** As a Home Assistant user, I want an adaptive device tile for supported domains, so boilers and similar devices fit the design system.

---

## 2. In / out of scope

### In scope
- Domains: `water_heater`, `media_player`, `humidifier`, `input_boolean`, `scene`, `script`, `remote`, `automation` (and other supported)
- Primary domain action; optional controls (temp / off-timer for water heater)
- `confirm_actions`
- Explicit error for unsupported domains (including fan/cover/switch/vacuum)

### Out of scope (this feature)
- Replacing dedicated fan/cover/switch/vacuum cards
- Always-on 1s `setInterval` when idle (MUST NOT — Phase 2 — **enforced**: ticker only when armed)

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entity`, `name`, `show_controls`, `confirm_actions`, actions | Capability gated |

---

## 4. Behaviors & business rules

1. Unsupported domain → explicit error state.
2. Timers/tickers arm only when needed (D11).
3. Confirm before high-stakes actions when enabled.

---

## 5. UX flows

### Primary flow
1. Tap runs domain default; optional controls adjust temp/timer.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Fan/cover/switch/vacuum entity | Error: use dedicated card |
| Timer idle | No interval running |

---

## 7. Acceptance criteria

1. Supported domains render adaptive controls.
2. Unsupported domains show explicit error (no silent noop).
3. Water-heater timer ticker runs only when armed (**done** — Phase 2).
4. Card-contract §7 + editor.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
| Domain helpers in `src/utils/device.ts` | Actions |

---

## 9. Implementation

This feature **implements** via:

| Symbol | Path |
| --- | --- |
| `AuDeviceCard` | `src/card/device-card/au-device-card.ts` |
| `runPrimaryDeviceAction()` | `src/utils/device.ts` |
| `getWaterHeaterCapabilities()` | `src/utils/water-heater.ts` |
| Water-heater timer helpers | `src/utils/water-heater-timer.ts` |
| `_ensureTimerTicker()` | Arms `setInterval` only while `_timerEndsAt` is set |
