# Feature: Card contract

| Field | Value |
| --- | --- |
| ID | `prd/platform/card-contract` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Card control |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`ARCHITECTURE.md`](../../ARCHITECTURE.md) §4, [`PRD.md`](../../PRD.md) D5–D6, D10 |

---

## 1. Problem & user story

**Problem:** Custom cards must behave like native Lovelace cards or they break editors, performance, and shell layout.

**User story:** As a dashboard author, I want every Atrium card to validate config, react to the right entities, offer an editor when available, and fill its grid cell, so the shell stays reliable.

---

## 2. In / out of scope

### In scope
- `setConfig` validation
- Entity-scoped updates
- `getConfigElement()` editors via `AuBaseEditor` patterns
- `disconnectedCallback` teardown
- Grid-fill via `AuCardContent`
- `AuActionCardBase` action defaults and slots
- Validated `executeAction` for tap/hold/double-tap

### Out of scope (this feature)
- Per-domain control UX (product specs)
- Shell layout algorithms

---

## 3. Config / data model

| Key / record | Fields | Notes |
| --- | --- | --- |
| Lovelace card | `type`, card-specific keys, optional `layout` | Shell placement separate from content_layout |
| Actions | `tap_action`, `hold_action`, `double_tap_action` | HA action shapes |
| Bases | `AuBaseCard`, `AuCardContent`, `AuActionCardBase`, `AuBaseEditor` | Extension path |

---

## 4. Behaviors & business rules

1. Invalid config throws/rejects with a clear message in `setConfig`.
2. Prefer config immutability patterns when updating (assessment Phase 4).
3. Defaults: tap `toggle` (fallback more-info); hold/double-tap `more-info`.
4. `executeAction` MUST validate `call-service` / `url` / `navigate` before side effects (shipped: `ALLOWED_SERVICE_DOMAINS`, `isAllowedServiceCall`, `isSafeActionUrl`, `isSafeNavigatePath`).
5. No leaked listeners/timers after disconnect.

---

## 5. UX flows

### Primary flow
1. User configures card in YAML or visual editor → card renders in shell cell → interactions call HA services safely.

### Empty / first-use
- Unavailable/missing entity shows an explicit unavailable/error state (card-specific copy).

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Entity missing | Unavailable / error UI; no crash |
| Non-toggleable + default toggle | Fall back to more-info |
| Malicious/invalid action URL/service | Reject; do not execute |

---

## 7. Acceptance criteria

1. Every product card validates required config keys in `setConfig`.
2. Cards re-render on tracked entity changes only (no full-hass thrash by design).
3. Editors load via `getConfigElement()` where documented.
4. Disconnect tears down timers/overlays/listeners.
5. Host + `.au-card` fill 100% of allocated shell cell.
6. `executeAction` rejects unvalidated services/urls/navigate (**done** — Phase 2).

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [distribution-hacs.md](./distribution-hacs.md) | Elements registered from bundle |
| Architecture §4 | Contract source |

---

## 9. Implementation

This feature **implements** via:

| Symbol | Path |
| --- | --- |
| `AuBaseCard` | `src/core/base-card.ts` |
| `AuCardContent` | `src/core/card-content.ts` |
| `AuActionCardBase` | `src/core/action-card.ts` |
| `AuBaseEditor` | `src/core/base-editor.ts` |
| `executeAction()` | `src/utils/action.ts` |
| `ALLOWED_SERVICE_DOMAINS` | `src/utils/action.ts` |
| `isAllowedServiceCall()` | `src/utils/action.ts` |
| `isSafeActionUrl()` | `src/utils/action.ts` |
| `isSafeNavigatePath()` | `src/utils/action.ts` |
