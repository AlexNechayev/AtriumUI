# AtriumUI — Product Scope & Features Specification

| Field | Value |
| --- | --- |
| Product name | **AtriumUI** (HAD) |
| Document type | Product scope & features specification (legacy / wishlist capture) |
| Status | Draft — superseded on conflicts by [`PRD.md`](./PRD.md) |
| Companion doc | [`ARCHITECTURE.md`](./ARCHITECTURE.md) (system must obey) |
| PRD | [`PRD.md`](./PRD.md) + [`prd/`](./prd/) per-feature specs |
| Platforms | Home Assistant Lovelace (Panel + HACS/manual resource) |
| Languages | English, Russian, Hebrew (RTL) |

> **Reconciliation (PRD precedence):** For implementation and acceptance, [`PRD.md`](./PRD.md) and [`prd/`](./prd/) win when they disagree with this file. Architecture constraints always apply. See PRD Decision Log (D1–D14) and MASTER_ASSESSMENT for the current priority order (UI/UX → security → bundle/perf → architecture/DX).

This document captures **what AtriumUI includes** as originally described in the README, plus assessment backlog items. Runtime contracts live in the architecture spec.

---

## 1. Vision & product identity

### Vision
A production-grade custom component library and structural design system for Home Assistant Lovelace — one tree-shaken module, unified Home look, classic grid and Home → Rooms shell.

### Who it is for
- Household dashboard authors
- Sole developer maintaining the design system

### Relationship to architecture (MUST obey)
AtriumUI **obeys** [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 2. Success criteria

1. Unified dashboards without mixed third-party card dependency stacks.
2. Cards feel native (config, editors, entity reactivity, teardown).
3. Home and classic modes remain first-class.
4. Assessment high-severity items closed (sensor Home variant, token/README accent, action validation, device timers — **closed in `src/`**; remaining work is Phase 3–4).

---

## 3. In scope (current product line)

### Platform
- `custom:au-shell-grid` classic drag/resize grid
- Home → Rooms when `floors` is set (presence, bulk actions, scenes/scripts, room controls, auto areas)
- HACS / manual resource distribution
- Shared card contract and editors

### Product cards
- Action, Sensor, Light, Climate, Fan, Cover, Switch, Vacuum, Device, Room, Calendar

### UX
- Home tiles / `variant: home`
- Edit mode (desktop drag/resize/add, modal editors)
- Localize en/ru/he
- Design tokens (Home look)

### Tooling
- Vite build, Vitest, typecheck, lint, format
- `dev:ha` watch into HA `www`
- Demo YAML

---

## 4. Assessment backlog (wishlist → schedule via PRD phases)

Acceptance is defined in PRD phases / feature files. **Closed in code** items stay listed for audit trail; open items are the remaining engineering queue.

| Item | Notes |
| --- | --- |
| Sensor Home variant | **Done** — `AuSensorCard.isHomeVariant` + home-tile path |
| Token / README / edit chrome alignment | **Done** — accent `#0a84ff` in tokens, README, edit chrome |
| Harden `executeAction` | **Done** — allowlist + URL/navigate guards in `src/utils/action.ts` |
| Device timer only when armed | **Done** — `_ensureTimerTicker` only while `_timerEndsAt` set |
| Shared gestures + pending-control | Med — Phase 3 (**open**) |
| Climate home/classic dual-wiring cleanup | Med — Phase 3/4 (**open**) |
| Edit draft discipline | Med — Phase 4 (**open**) |
| Carve `AuShellHomeView` | Med — Phase 4 (**open**) |
| Layering: `controlIcon` → utils | Med (**open**) |
| Dead code / orphan components | Low–Med (**open**) |
| Config immutability in `setConfig` | Phase 4 (**open**) |

---

## 5. Explicitly out / parked

See [`PRD.md`](./PRD.md) §5. Notable: no nested home dashboard card; no direct calendar cloud APIs; climate humidity/swing/dual setpoints deferred; fan/cover/switch/vacuum stay on dedicated cards.

---

## 6. Document control

| Version | Notes |
| --- | --- |
| 0.1 | Scope capture from README + MASTER_ASSESSMENT; PRD precedence |
| 0.2 | Phase 1–2 High items marked done vs `src/`; Phase 3–4 remain open |
