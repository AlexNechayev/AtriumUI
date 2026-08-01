# Feature: Shell grid

| Field | Value |
| --- | --- |
| ID | `prd/platform/shell-grid` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Home shell / Classic grid |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`ARCHITECTURE.md`](../../ARCHITECTURE.md) §5, [`PRD.md`](../../PRD.md) D2 |

---

## 1. Problem & user story

**Problem:** Lovelace dashboards need a single layout host for both a classic card grid and an Apple Home–style Home → Rooms experience without a second top-level card type.

**User story:** As a Home Assistant user, I want one shell card that either lays out cards on a coordinate grid or presents floors/rooms, so my whole Panel view stays coherent.

---

## 2. In / out of scope

### In scope
- Classic `cards` + `layout: { x, y, w, h }` grid
- Home mode when `floors` is set (rooms, floor entities, presence, bulk actions, scenes/scripts, room controls, multi_entity)
- Edit mode drag/resize/add (desktop); persist on Done
- Domain → card remapping; `card_type_locked`
- `room_idle_timeout` return to Home after idle
- Responsive columns (12 / 6 / 1)

### Out of scope (this feature)
- Nested `au-home-dashboard` card (removed)
- Drag/resize on tablet/mobile breakpoints

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Shell | `columns`, `row_height`, `gap`, `width`, `height`, `rows`, `max_rows`, `editable` | Classic + Home shared |
| Classic children | `cards[]` with `id?`, `layout?` | Auto-flow if no layout |
| Home | `floors`, `presence`, `show_presence`, `show_bulk_actions`, `clock_format`, `room_controls`, `auto_areas`, `prefer_device_name`, `confirm_actions`, `scenes`, `scripts`, `multi_entity`, `debug`, `room_idle_timeout` | See README Home options |

---

## 4. Behaviors & business rules

1. Panel view: shell is the single top-level card spanning the view.
2. Overlapping items push down; empty rows above an item are preserved.
3. Persistence requires storage-mode dashboards; stable `id` ties layout to cards.
4. Home entity tiles receive `variant: home` automatically.
5. `room_idle_timeout` ≤ 0 or unset: stay in room; > 0: return to Home after that many seconds of inactivity.

---

## 5. UX flows

### Primary flow (classic)
1. Add `au-shell-grid` with child cards → edit layout → Done persists YAML.

### Primary flow (Home)
1. Configure floors/rooms (GUI or YAML) → tap room → control entities → optional idle return to Home.

### Empty / first-use
- Adding from “Add card” starts with a sample floor/room in Home editor.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Missing layout | Auto-flow into first free slot |
| Third-party child card | Allowed; never remapped |
| Idle timeout while interacting | Activity resets timer |

---

## 7. Acceptance criteria

1. Classic grid places, moves, and resizes cards at desktop width; persists on Done.
2. Home mode with `floors` shows room tiles and in-room grids with domain remapping.
3. Room control strip appears for eligible room tile sizes; respects include/exclude/icons.
4. `room_idle_timeout` returns to Home after configured idle seconds; 0/unset disables.
5. Responsive breakpoints match Architecture (12 / 6 / 1); no drag/resize off desktop base.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [card-contract.md](./card-contract.md) | Child cards |
| [../ux/edit-mode.md](../ux/edit-mode.md) | Edit chrome |
| [../ux/home-tiles.md](../ux/home-tiles.md) | Home visuals |
| [distribution-hacs.md](./distribution-hacs.md) | Load bundle |

---

## 9. Implementation

This feature **implements** via:

| Symbol | Path |
| --- | --- |
| `AuShellGrid` | `src/template/shell-grid/au-shell-grid.ts` |
| `AuShellHomeView` | `src/template/shell-grid/au-shell-home-view.ts` |
| `AuShellGridEditor` | `src/template/shell-grid/au-shell-grid-editor.ts` |

Home idle return timer lives on `AuShellHomeView` (`room_idle_timeout`). Broader Home-view carve-up remains Phase 4.
