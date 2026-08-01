# Feature: \<Name\>

| Field | Value |
| --- | --- |
| ID | `prd/<area>/<slug>` |
| Status | Draft |
| Priority | Core polish \| Full v1 depth \| Nice-to-have |
| Primary job impact | Home shell \| Classic grid \| Card control \| Supporting |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`ARCHITECTURE.md`](../../ARCHITECTURE.md), [`PRD.md`](../../PRD.md) |

---

## 1. Problem & user story

**Problem:** …

**User story:** As a Home Assistant user, I want … so that …

---

## 2. In / out of scope

### In scope
- …

### Out of scope (this feature)
- …

---

## 3. Config / data model

YAML / Lovelace config keys and entity domains for this feature.

| Key / record | Fields | Notes |
| --- | --- | --- |
| … | … | … |

---

## 4. Behaviors & business rules

1. …
2. React only when tracked entities change (see [card-contract](../platform/card-contract.md)).
3. Tear down listeners/timers in `disconnectedCallback`.

---

## 5. UX flows

- Follow Home look tokens ([design-system](../ux/design-system.md)) unless classic-only.
- Empty / unavailable entity states must be explicit.

### Primary flow
1. …

### Empty / first-use
- …

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| … | … |

---

## 7. Acceptance criteria

1. …
2. …

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [`../platform/card-contract.md`](../platform/card-contract.md) | Native Lovelace card contract |
| Architecture §… | … |

---

## 9. Implementation

List the primary runtime symbols this feature **implements**, using exact class/function names so graphify can edge PRD concepts to code:

| Symbol | Path |
| --- | --- |
| `…` | `src/…` |
