# Feature: Sensor card

| Field | Value |
| --- | --- |
| ID | `prd/product/sensor-card` |
| Status | Active — Home variant shipped |
| Priority | Core polish |
| Primary job impact | Card control / Home shell |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`PRD.md`](../../PRD.md) D9 |

---

## 1. Problem & user story

**Problem:** Environmental sensors need a glanceable gauge with severity, including in Home mode tiles.

**User story:** As a Home Assistant user, I want a sensor readout with min/max and warn/critical thresholds that matches Home tiles when used in Home shell, so dashboards feel consistent.

---

## 2. In / out of scope

### In scope
- `custom:au-sensor-card` linear gauge
- `min` / `max` / `unit` / `precision`
- Severity `warn` / `critical` / `direction`
- **Home `variant` / tile path** (MUST — Phase 1 — **done**)

### Out of scope (this feature)
- Historical charts / statistics graphs

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Card | `entity`, `name`, `min`, `max`, `unit`, `precision`, `severity` | Home shell may pass `variant: home` |

---

## 4. Behaviors & business rules

1. Gauge maps entity numeric state into min–max.
2. Severity direction `above`/`below` drives warn/critical styling.
3. Home variant MUST use Home tile styles/tokens (not Material-only chrome).

---

## 5. UX flows

### Primary flow
1. Place sensor in shell → value and gauge update with entity.

### Empty / first-use
- Non-numeric / missing → explicit empty/unavailable.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Value outside min/max | Clamp visually; still show value |
| Home variant unset | Classic gauge chrome (not Home tile) |

---

## 7. Acceptance criteria

1. Gauge renders for numeric sensors with configured min/max/unit.
2. Severity thresholds change visual state correctly.
3. Home shell path uses Home `variant` / `auHomeTileStyles` (**done** — Phase 1).
4. Satisfies card-contract §7.
5. Visual editor available.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/card-contract.md](../platform/card-contract.md) | Contract |
| [../ux/home-tiles.md](../ux/home-tiles.md) | Home variant |
| [../ux/design-system.md](../ux/design-system.md) | Tokens |

---

## 9. Implementation

This feature **implements** via:

| Symbol | Path |
| --- | --- |
| `AuSensorCard` | `src/card/sensor-card/au-sensor-card.ts` |
| `isHomeVariant` | `src/card/sensor-card/au-sensor-card.ts` |
| `auHomeTileStyles` | `src/theme/home-style.ts` |
