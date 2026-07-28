# HAD / AtriumUI — Master Assessment

Synthesized from 5 domain agents + Judge. Confirmed against `src/` and `graphify-out/`. Audience: sole developer. Breaking changes allowed. Priority: **UI/UX consistency → security → bundle/perf → architecture/DX**.

Do **not** destroy healthy reuse: `AuActionCardBase`, `AuBaseEditor`, `CARDS` registry, `resolveDomainControl`, `home-edit-commit`, classic grid compat.

---

## 1. Executive Summary & Project Health Dashboard

### The Bottom Line

The card stack is sound. Product health is held back by **Home visual drift** (sensors ignore Home variant; README/edit chrome still speak Material `#03a9f4` while `src/theme/tokens.ts` is Home `#0a84ff`), and by **production trust gaps** in `src/utils/action.ts` (unvalidated `call-service` / `url` / `navigate`). Bundle is already one ~336–344KB ES chunk; wins are dead-code deletion and consolidating duplicated gestures/pending-control — not rewriting the registry.

### Projected Impact (relative)

- **Performance & Bundle:** Leaner sole-dev surface (orphaned `AuModeChipGroup`, unused i18n/tokens); stop always-on device-card `setInterval` and wasteful edit-mode rAF — modest payload shrink, clearer idle cost.
- **UI/UX consistency:** Sensors + edit chrome + gap/frost/motion align with Home tokens/`auHomeTileStyles` — Home reads as one language instead of mixed Material + Home.
- **DX velocity:** Fewer dual-wiring traps (climate, domain lists, edit drafts); README matches tokens; lint baseline; thinner `AuShellHomeView`.

---

## 2. Key Findings Matrix

| Sev  | Finding                                                                                               | Agents     |
| ---- | ----------------------------------------------------------------------------------------------------- | ---------- |
| High | `AuSensorCard` has no Home `variant` / tile path                                                      | A5         |
| High | README + edit chrome `#03a9f4` vs tokens `#0a84ff`; gap 8 vs 12 ambiguity; frost/motion not tokenized | A5         |
| High | `executeAction` unvalidated services/urls/navigate                                                    | A4         |
| High | Device card `setInterval(1000)` always on                                                             | A4         |
| Med  | Slider gestures + pending-control triplicated; climate home/classic dual wiring                       | A1         |
| Med  | Dual edit drafts / eager commit; classic vs Home persist                                              | A1, A3     |
| Med  | `room-card` → `template/shell-grid/room-controls` layering break                                      | A3         |
| Med  | `AuShellHomeView` god object; static editor imports; picker helpers duplicated                        | A2, A3, A1 |
| Low  | Orphan `AuModeChipGroup`; unused i18n/keys/types; no ESLint/Prettier; DX HA_WWW/demo friction         | A2, A4, A5 |

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
