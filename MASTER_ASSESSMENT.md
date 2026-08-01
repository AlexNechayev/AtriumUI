# HAD / AtriumUI — Master Assessment

Synthesized from 5 domain agents + Judge. Confirmed against `src/` and `graphify-out/`. Audience: sole developer. Breaking changes allowed. Priority: **UI/UX consistency → security → bundle/perf → architecture/DX**.

Do **not** destroy healthy reuse: `AuActionCardBase`, `AuBaseEditor`, `CARDS` registry, `resolveDomainControl`, `home-edit-commit`, classic grid compat.

---

## 1. Executive Summary & Project Health Dashboard

### The Bottom Line

The card stack is sound. **Phase 1–2 High items are closed in `src/`** (sensor Home variant; README/edit chrome accent `#0a84ff` aligned with `auTokens`; `executeAction` allowlist + URL/navigate guards; device timer ticker only when armed). Remaining product drag is **Phase 3–4**: shared gestures/pending-control, climate dual-wiring, edit draft discipline, and carving `AuShellHomeView`. Bundle is already one ~336–344KB ES chunk; wins are dead-code deletion and consolidating duplicated gestures/pending-control — not rewriting the registry.

### Projected Impact (relative)

- **Performance & Bundle:** Leaner sole-dev surface (orphaned `AuModeChipGroup`, unused i18n/tokens); stop always-on device-card `setInterval` and wasteful edit-mode rAF — modest payload shrink, clearer idle cost.
- **UI/UX consistency:** Sensors + edit chrome + gap/frost/motion align with Home tokens/`auHomeTileStyles` — Home reads as one language instead of mixed Material + Home.
- **DX velocity:** Fewer dual-wiring traps (climate, domain lists, edit drafts); README matches tokens; lint baseline; thinner `AuShellHomeView`.

---

## 2. Key Findings Matrix

| Sev  | Finding                                                                                               | Status (2026-08-01) | Agents     |
| ---- | ----------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| High | `AuSensorCard` has no Home `variant` / tile path                                                      | **Closed** — `isHomeVariant` + home-tile | A5         |
| High | README + edit chrome `#03a9f4` vs tokens `#0a84ff`; gap 8 vs 12 ambiguity; frost/motion not tokenized | **Closed** for accent/README/edit chrome (`#0a84ff`); motion tokens exist; frost polish optional | A5         |
| High | `executeAction` unvalidated services/urls/navigate                                                    | **Closed** — allowlist + `isSafeActionUrl` / `isSafeNavigatePath` | A4         |
| High | Device card `setInterval(1000)` always on                                                             | **Closed** — `_ensureTimerTicker` only when armed | A4         |
| Med  | Slider gestures + pending-control triplicated; climate home/classic dual wiring                       | **Open** — Phase 3/4 | A1         |
| Med  | Dual edit drafts / eager commit; classic vs Home persist                                              | **Open** — Phase 4 | A1, A3     |
| Med  | `room-card` → `template/shell-grid/room-controls` layering break                                      | **Open** | A3         |
| Med  | `AuShellHomeView` god object; static editor imports; picker helpers duplicated                        | **Open** — Phase 4 | A2, A3, A1 |
| Low  | Orphan `AuModeChipGroup`; unused i18n/keys/types; no ESLint/Prettier; DX HA_WWW/demo friction         | Partially stale (`AuModeChipGroup` absent from `src/`); ESLint/Prettier may already exist — re-check opportunistically | A2, A4, A5 |

---

## 3. Step-by-Step Action Plan

See implementation todos t0–t14. Order: UI/UX → security → bundle/perf → architecture/DX.

| Step | Objective |
| ---- | --------- |
| 0 | `graphify update .` + this document |
| 1 | Tokens + README as single source of truth |
| 2 | Sensor Home variant |
| 3 | Harden `executeAction` |
| 4 | Device timer ticker only when armed |
| 5 | Shared gestures + pending-control |
| 6 | Dead code removal |
| 7 | Layering: `controlIcon` → utils |
| 8 | Unify climate dual wiring |
| 9 | Single domain taxonomy |
| 10 | Edit draft discipline |
| 11 | Carve `AuShellHomeView` |
| 12 | DX: ESLint/Prettier + docs |
| 13 | Config immutability in `setConfig` |
