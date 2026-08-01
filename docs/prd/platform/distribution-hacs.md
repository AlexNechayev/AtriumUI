# Feature: Distribution & HACS

| Field | Value |
| --- | --- |
| ID | `prd/platform/distribution-hacs` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Supporting |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`ARCHITECTURE.md`](../../ARCHITECTURE.md) C1, [`ops/install-and-resource.md`](../../ops/install-and-resource.md) |

---

## 1. Problem & user story

**Problem:** Users need a single reliable way to load all Atrium cards without stitching multiple custom-card URLs.

**User story:** As a Home Assistant user, I want to install one HACS Dashboard resource (or copy one module file), so every Atrium card is available in Lovelace.

---

## 2. In / out of scope

### In scope
- Vite build → `dist/atrium-ui.js`
- HACS Dashboard custom repository install
- Manual copy to `<config>/www/atrium-ui/` + resource registration
- `npm run dev:ha` watch build into `HA_WWW`

### Out of scope (this feature)
- Publishing to npm as the primary install path
- Multi-chunk code-splitting for HA (single chunk is intentional)

---

## 3. Config / data model

| Key / record | Fields | Notes |
| --- | --- | --- |
| Lovelace resource | `url`, `type: module` | e.g. `/local/atrium-ui/atrium-ui.js?v=…` |
| Env | `HA_WWW`, `HA_BUILD=1` | Watch out dir |

---

## 4. Behaviors & business rules

1. One module registers all documented custom elements.
2. Cache-bust via `?v=` query on manual installs when upgrading.
3. `dev:ha` writes a HA-oriented build (see `vite.config.ts`).

---

## 5. UX flows

### Primary flow
1. Install via HACS or manual copy → add resource → add `au-shell-grid` / cards in Lovelace.

### Empty / first-use
- Without resource, custom types fail to load; ops docs cover troubleshooting.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| SMB “Resource busy” on `dev:ha` | Remount share or build locally and copy (ops) |
| Stale browser cache | Bump `?v=` |

---

## 7. Acceptance criteria

1. `npm run build` produces `dist/atrium-ui.js`.
2. Manual resource path loads all documented cards in a Panel view.
3. HACS Dashboard install registers the resource (documented steps).
4. `HA_WWW=… npm run dev:ha` watch-updates the target folder.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| Architecture C1 | Single chunk |
| [../../ops/local-dev-ha.md](../../ops/local-dev-ha.md) | Dev loop |
