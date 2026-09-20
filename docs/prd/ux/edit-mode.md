# Feature: Edit mode

| Field | Value |
| --- | --- |
| ID | `prd/ux/edit-mode` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Home shell / Classic grid |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`PRD.md`](../../PRD.md) Phase 4; shell-grid; [shell drawer](./shell-drawer.md) |

---

## 1. Problem & user story

**Problem:** Users need to rearrange shell layouts and configure cards without hand-editing YAML for every change.

**User story:** As a Home Assistant user, I want dashboard edit mode with drag/resize/add and card editors, so layout changes persist cleanly.

---

## 2. In / out of scope

### In scope
- Desktop drag handles, resize corners, remove, + card picker
- Modal card editors; Home room editor; Configure card step for picker
- Persist on Done via storage-mode Lovelace
- `editable: false` disables layout editing
- Draft/commit discipline for Home vs classic (Phase 4 improvement)
- Second entry: shell drawer **Enter / Exit edit** header icon (pencil stays; see [shell drawer](./shell-drawer.md))

### Out of scope (this feature)
- Drag/resize on tablet/mobile breakpoints

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Shell | `editable` | Default true |
| Persist helpers | `config-persist`, `home-edit-commit` | Healthy reuse — keep |

---

## 4. Behaviors & business rules

1. Edit chrome only at desktop base width.
2. Prefer single draft → commit path (assessment: dual drafts / eager commit is a bug to fix).
3. Edit accent/chrome uses Home tokens (not Material `#03a9f4`).
4. Pencil remains the primary desktop chrome control. The shell drawer may also enter **or exit** edit: that item **closes the drawer**, then uses this same pencil → Done path (`setEditMode(true|false)`). Do not latch local `editMode`/`preview` on the shell. `editable: false` hides or disables the drawer edit item.

---

## 5. UX flows

### Primary flow
1. Pencil → rearrange/add → Done writes YAML.
2. Click cell body → card editor modal.
3. Optional: drawer **edit icon** (header, opposite the chevron) → drawer closes → same as step 1. Drawer **Exit edit** (or HA Done) leaves edit and persists.

### Empty / first-use
- + opens HA card picker; free slot placement.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| YAML mode dashboard | Persist may be limited — document |
| Cancel edit | Discard drafts; no partial write |

---

## 7. Acceptance criteria

1. Classic and Home grids support drag/resize/add on desktop when `editable`.
2. Done persists layout and content edits on storage dashboards.
3. Card picker add + optional Configure step works in rooms.
4. Edit chrome color matches design tokens (Phase 1).
5. Single draft/commit path (Phase 4).
6. Drawer Enter/Exit edit does not replace the pencil; it closes the drawer and uses this feature’s chrome, including native Done ([shell drawer](./shell-drawer.md) AC6).

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/shell-grid.md](../platform/shell-grid.md) | Host |
| [design-system.md](./design-system.md) | Chrome color |
| [shell-drawer.md](./shell-drawer.md) | Second edit entry; chrome collision (drawer rightmost) |
