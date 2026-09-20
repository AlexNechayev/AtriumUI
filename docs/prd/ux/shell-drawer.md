# Feature: Shell settings drawer

| Field | Value |
| --- | --- |
| ID | `prd/ux/shell-drawer` |
| Status | Draft |
| Priority | Nice-to-have |
| Primary job impact | Home shell / Classic grid |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`PRD.md`](../../PRD.md) D15; [shell-grid](../platform/shell-grid.md); [edit-mode](./edit-mode.md); [design-system](./design-system.md); [localize](./localize.md); [card-contract](../platform/card-contract.md) |

Does **not** block Phases 3–4. Must not invent a second shell card or a parallel token system ([`ARCHITECTURE.md`](../../ARCHITECTURE.md) D2 / C8).

---

## 1. Problem & user story

**Problem:** Theme, this-view chrome, shared behavior, automations, and edit entry are scattered (pencil-only edit, YAML-only options, HA Automations elsewhere). Touch users need one small, icon-only control on the shell.

**User story:** As a Home Assistant user, I want a top-right chevron that opens a settings drawer on my Atrium shell, so I can enter edit mode and open this-view settings (including Atrium light/dark/system), shared behavior, and an automations list without replacing the pencil.

---

## 2. In / out of scope

### In scope
- Icon-only single chevron (36×36 CSS px hit target, no fill), 90° rotate, top-right of shell chrome, **both** Home and classic `au-shell-grid`
- Right overlay side panel (always from the right, including Hebrew RTL); no dim scrim; tap outside closes the panel when no 90% card is open; panel height is the shell host; one top-right chevron (open + close); slide-open animation
- Icon-only Enter / Exit edit on the open panel header, same row as the chevron, opposite (inner) edge
- 90% centered floating cards: Dashboard settings (owns Atrium theme under Appearance), Global configuration, Automations list (enable/disable/run; one row per item; no editor)
- 90% card close control shows **X**; `aria-label` stays the translated Close settings string
- YAML `theme` + `drawer` on `au-shell-grid`; item visibility YAML-only
- Persist via existing shell Lovelace config persist (storage-mode; same family as edit Done)
- en / ru / he strings; RTL **text** inside the panel; panel **edge** stays right
- Overlay teardown in `disconnectedCallback`

### Out of scope (this feature)
- Home Assistant frontend theme switching (`set_theme` / HA theme picker)
- Automation create/edit, blueprints, or navigating away as the primary automations UX
- Live multi-dashboard / HA-instance global store, `localStorage`, or a helper entity
- Replacing or removing pencil chrome
- Dim scrim; push-layout; bottom sheet; popover menu
- Per-user (non-YAML) item lists; Dashboard settings UI toggling which drawer items exist
- Drag/resize on tablet/mobile breakpoints (unchanged; see [edit-mode](./edit-mode.md))

---

## 3. Config / data model

All persistable keys live on **this** `au-shell-grid` YAML. There is no Atrium backend. “Global” means cross-cutting **behavior keys on this shell**, intended to be copied or `!include`d into other dashboards. The Global card edits the **current** shell config only.

| Key / record | Fields | Notes |
| --- | --- | --- |
| Shell | `theme` | `light` \| `dark` \| `system`. Default `system`. Atrium color-scheme only (see [design-system](./design-system.md)). |
| Shell | `drawer.enabled` | Default `true`. `false` hides the icon. |
| Shell | `drawer.items` | `edit`, `theme`, `dashboard_settings`, `global`, `automations`. Omitted keys default `true`. |
| Dashboard settings (this view) | Layout chrome + general this-shell keys **not** owned by Global | See ownership table below. Written to this shell YAML. |
| Global (this YAML) | `confirm_actions`, `prefer_device_name`, motion/reduce, default card behaviors | One owner per key — never duplicated on the Dashboard card. |
| Automations | `automation.*` from `hass.states` and `hass.entities` | No extra YAML. Actions via validated `executeAction` ([card-contract](../platform/card-contract.md)). |

```yaml
type: custom:au-shell-grid
theme: system   # light | dark | system; default system
drawer:
  enabled: true # default true; false hides icon
  items:        # omitted keys default true
    edit: true
    theme: true
    dashboard_settings: true
    global: true
    automations: true
```

Hide the icon when `drawer.enabled` is `false` **or** every item under `drawer.items` is `false`.

### Key ownership (no duplicate controls)

| Owner | Keys |
| --- | --- |
| Inline drawer | Enter / Exit edit as a 36×36 icon on the open header row, opposite the chevron (`drawer.items.edit` + existing `editable`). Theme is **not** inline. |
| YAML only (not in Dashboard card) | `drawer.enabled`, `drawer.items.*` |
| Dashboard settings 90% card | `theme` (Light / Dark / System) under **Appearance** when `drawer.items.theme` is not false; this-view layout chrome and remaining general shell keys grouped by domain: Appearance (`header_greeting`, `header_title`), Clock (`clock_show_date`, `clock_show_day`, `clock_format`, `clock_date_format`, `clock_day_format`), Home (`show_presence`, `show_bulk_actions`, `auto_areas`, `room_idle_timeout`), Layout (`columns`, `rows`, `max_rows`, `gap`, `row_height`, `width`, `height`). Setting items in each section use a **3-column** grid. Within a section, fields are ordered by control type so rows share similar heights: theme group (Appearance only), then toggles, then selects, then numbers, then text. |
| Global 90% card | `confirm_actions`, `prefer_device_name`, reduced-motion / motion preference, default card behaviors (cross-card defaults such as Home extra-controls conventions). New keys in this group MUST be specified here before implementation; do not also expose them on Dashboard settings. |

`editable` remains the edit-mode gate ([edit-mode](./edit-mode.md)). When `editable: false`, the drawer **edit** item is hidden or disabled.

---

## 4. Behaviors & business rules

1. Host is `au-shell-grid` only (Home when `floors` is set, classic otherwise). No second shell card.
2. Trigger is the rightmost top chrome control: icon-only single chevron, no background fill, **36×36 CSS px** hit target. The glyph rotates **90°** with open vs closed using the same `--au-motion-medium` / `--au-motion-ease` as the panel. The same control stays in one top-right slot while the panel slides in beneath it (z-index above catcher/panel). There is no second in-panel arrow. When the panel is open, Enter / Exit edit is a matching 36×36 icon on that same row at the panel’s **inner** (left) edge — opposite the chevron.
3. Panel slides from the **right** on every locale, including Hebrew. Labels and layout direction inside the panel follow [localize](./localize.md) (RTL for `he`).
4. Panel width: `min(220px, max(196px, 24vw))` (or equivalent). Compact nav; 90% settings cards stay 90% of the shell.
5. Overlay sits above the dashboard **without** a dimmed scrim. An invisible pointer catcher covers the **shell host** (not `100vh`) and receives outside taps. The panel height is `100%` / `max-height: 100%` of that host.
6. Z-order: catcher → side panel → 90% card → chevron. Tokens only ([design-system](./design-system.md)); no new Material accent.
7. Enter/Exit edit is the header icon opposite the chevron (not a labeled row in the nav). Theme lives in Dashboard settings → Appearance (hidden when `drawer.items.theme` is false). The top-right chevron is both open and close (no second in-panel arrow). Dashboard settings, Global configuration, and Automations each open a centered ~90% floating card (Home look; visible close control is **X**, `aria-label` remains Close settings). The panel slides in from the right using existing motion tokens.
8. Tap outside with **no** 90% card: close the panel. Tap outside with a 90% card open: close **only** the card; the panel stays open. The card’s close control also dismisses the card only.
9. Enter edit **closes the panel**, then follows the existing pencil → Done path ([edit-mode](./edit-mode.md)). The pencil remains. When already editing, the same item is **Exit edit mode** and calls `setEditMode(false)` (same persist path as HA Done). Do not latch local `editMode`/`preview` flags that would block native Done.
10. Theme applies to Atrium shell + cards (host `color-scheme` / `data-au-theme` plus Home surface tokens via `light-dark()` in `src/theme/tokens.ts`). It MUST NOT call HA `set_theme`. Persist `theme` on this shell YAML (storage-mode Lovelace). YAML-mode dashboards: persist may be limited — same caveat as edit Done.
11. Automations card lists all `automation.*` from `hass.states` **and** `hass.entities` (entity registry). If both are empty, it may fetch `config/entity_registry/list`. Each item is **one row**: name (and unavailable) plus Run / Enable-Disable. Enable/disable/run only. No create/edit. Empty and unavailable states must be explicit. Services go through `executeAction` allowlist.
12. React only when tracked entities / relevant hass slices change (automations list: `automation.*`). Tear down listeners, timers, and overlays in `disconnectedCallback` ([card-contract](../platform/card-contract.md)).
13. Chrome collision: the drawer icon is the **rightmost** top control. Existing clock / pencil / other chrome MUST NOT overlap it.

---

## 5. UX flows

- Follow Home look tokens ([design-system](./design-system.md)).
- Empty / unavailable entity states must be explicit (especially Automations).

### Primary flow
1. Tap the top-right chevron → panel slides in from the right; chevron rotates 90°.
2. Tap the header edit icon → panel closes → existing edit chrome (pencil/Done) takes over. Tap the same icon while already editing → panel closes → `setEditMode(false)` (same as Done).
3. Tap Dashboard settings → Appearance: Light / Dark / System → Atrium surfaces update; `theme` persists on storage-mode Lovelace. Dashboard fields are grouped under titled sections in a 3-column grid, with similar controls sharing a row.
4. Tap Global / Automations → centered 90% card opens over the panel. Automations rows keep name and action buttons on one line.
5. Close the card (**X** or tap outside the card) → return to the open panel.
6. Tap outside the panel (no card) or tap the same top-right chevron → panel closes; chevron rotates back.

### Empty / first-use
- Default: drawer enabled, all items on, `theme: system`.
- Automations with no `automation.*` entities: empty state in the 90% card, not a blank panel.
- `drawer.enabled: false` or all items false: no icon (first-use looks like today’s shell).

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| `drawer.enabled: false` or every `drawer.items` value `false` | Hide the icon entirely |
| `editable: false` | Hide or disable the edit item; pencil/layout editing remain off |
| YAML-mode dashboard | Theme / Dashboard / Global writes may not persist — document (same as edit Done) |
| Storage-mode persist failure | Keep UI draft; surface error; do not silently claim saved |
| Hebrew RTL | Panel still from the right; strings and in-panel layout RTL |
| Phone width | Honor min 196px so the compact nav stays tappable |
| Pencil / clock overlap | Drawer stays rightmost; other chrome shifts or yields |
| Overlay still open on disconnect | Remove catcher, panel, and 90% card in `disconnectedCallback` |
| Automation unavailable / missing | Row shows unavailable; run/toggle no-ops with explicit feedback |
| HA theme vs Atrium `theme` | HA frontend theme unchanged; Atrium color-scheme follows shell `theme` |

---

## 7. Acceptance criteria

1. Both Home and classic shells show the icon when the drawer is enabled and at least one item is on.
2. Chevron, no background, 36×36 hit target, 90° rotation tied to open state; the same control stays in the top-right slot above the sliding panel.
3. Panel from the right, width `min(220px, max(196px, 24vw))` (or equivalent), overlay without dim; outside tap closes the panel when no 90% card is open.
4. Edit is a 36×36 header icon opposite the chevron; theme is in Dashboard settings → Appearance; Dashboard settings, Global, and Automations open a centered ~90% Home-look card whose visible close control is **X**. Dashboard settings group same-domain keys under titled sections in a 3-column grid, with fields in each section ordered by control type (toggles, then selects, then numbers, then text). Each Dashboard section, the Global form, and each Automations row uses a Home control-fill background and outline so groups stay visually separate. Automations items are one row (text + buttons).
5. Outside tap with a card open closes only the card; the panel stays open.
6. Enter edit closes the panel and uses existing edit chrome; Exit edit and native Done both leave edit; the pencil remains.
7. `theme` and Dashboard/Global writes persist on storage-mode Lovelace; YAML-mode limits are documented.
8. Automations list shows all HA automations (states + entity registry) and can enable/disable/run; there is no create/edit path.
9. `drawer.enabled: false` or all items false hides the icon.
10. Strings follow `hass.language` (en/ru/he); panel edge stays right in RTL.
11. Drawer icon does not overlap clock, pencil, or other top chrome (rightmost control).
12. Overlays are torn down on disconnect; automation actions use validated `executeAction`.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [../platform/shell-grid.md](../platform/shell-grid.md) | Host chrome, YAML persist, Home vs classic |
| [edit-mode.md](./edit-mode.md) | Pencil stays; Enter edit reuses Done path |
| [design-system.md](./design-system.md) | Tokens; Atrium color-scheme (not a second system) |
| [localize.md](./localize.md) | en / ru / he drawer chrome |
| [../platform/card-contract.md](../platform/card-contract.md) | `executeAction` allowlist; teardown |
| Architecture D2 / C8 | One shell; one token source |

---

## 9. Implementation

Not yet implemented in `src/`. Planned host (do not add a second shell card):

| Symbol | Path |
| --- | --- |
| `AuShellGrid` | `src/template/shell-grid/au-shell-grid.ts` |
| `AuShellHomeView` | `src/template/shell-grid/au-shell-home-view.ts` |
| Persist helpers | `config-persist` / `home-edit-commit` (reuse) |
| `executeAction` | `src/utils/action.ts` |
| Overlay teardown pattern | Vacuum settings overlay (`AuVacuumSettingsOverlay`) as reference only |

Later `feature/` work MUST follow TDD (`test/**/*.test.ts` red → green), Storybook for the drawer primitive, and `graphify update .` after code changes.
