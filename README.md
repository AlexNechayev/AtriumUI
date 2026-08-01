# AtriumUI

A production-grade custom component library and structural design system for the
Home Assistant frontend (Lovelace). AtriumUI ships as a single, self-contained,
tree-shaken ES module so you can compose unified dashboards without pulling in
mixed dependencies from separate custom cards.

- **Framework:** [Lit](https://lit.dev) (LitElement, lit-html, reactive properties)
- **Language:** TypeScript (strict mode)
- **Bundler:** Vite (single optimized `atrium-ui.js` chunk, tree-shaking enabled)
- **Distribution:** HACS-compatible / manual Lovelace resource

## Repository layout

```text
src/
  template/          # layout components (dashboard shells)
    shell-grid/      # classic grid + Apple Home → Rooms (one card)
  card/              # Lovelace cards
    action-card/
    sensor-card/
    light-card/
    climate-card/
    device-card/     # adaptive multi-domain tile
  components/        # reusable UI primitives (au-light-slider, au-mode-chip-group, au-climate-selectors, au-temp-stepper)
  core/              # shared base classes (base-card, card-content, action-card, base-editor)
  localize/          # en / ru / he strings
  types/
  utils/
  theme/
demo/
  home-dashboard.yaml
```

## Components

| Component | Tag | Purpose |
| --- | --- | --- |
| Shell Grid (template) | `custom:au-shell-grid` | Dashboard shell: classic drag/resize card grid, or Apple Home → Rooms when `floors` is set. |
| Action Card | `custom:au-action-card` | Reactive tile that toggles an entity and reflects its on/off state. |
| Sensor Card | `custom:au-sensor-card` | Linear gauge for environmental readouts with severity alerts. |
| Light Card | `custom:au-light-card` | Capability-driven light controls with brightness, warmth, and color sliders. |
| Climate Card | `custom:au-climate-card` | Air conditioner controls with HVAC modes, target temperature, and fan modes. |
| Fan Card | `custom:au-fan-card` | Fan controls with speed slider or chips, presets, oscillate, and direction. |
| Cover Card | `custom:au-cover-card` | Cover controls with open/close/stop and an optional position slider. |
| Switch Card | `custom:au-switch-card` | Simple on/off switch tile. |
| Vacuum Card | `custom:au-vacuum-card` | Vacuum controls with start/pause/stop/return and a full-screen settings dashboard. |
| Device Card | `custom:au-device-card` | Adaptive tile for water heater and other toggleable domains without a dedicated card. |
| Room Card | `custom:au-room-card` | Row of icon buttons to toggle lights/switches. |
| Calendar Card | `custom:au-calendar-card` | Apple Calendar–inspired view-only preview of `calendar.*` entities. |

Every card behaves like a native HA card: it validates its YAML in `setConfig`,
reacts only when its tracked entities actually change, exposes a visual editor
via `getConfigElement()`, and tears down all references in `disconnectedCallback`.

Cards extend `AuCardContent`, which enforces a grid-fill contract: the card
host and its `.au-card` surface always occupy 100% of the space allocated by
`au-shell-grid` via `layout: { w, h }`, so cards resize when grid cells are
dragged or resized in edit mode.

Action cards (`au-action-card` and future variants) extend `AuActionCardBase`,
which provides entity binding, optional display fields (hidden when unset), and
HA-native `tap_action` / `hold_action` / `double_tap_action` handling.
Defaults: tap = toggle, hold = more-info, double-tap = more-info.

## Migration (breaking change)

Card tags were renamed in v0.1.0. Update your dashboard YAML:

| Before | After |
| --- | --- |
| `custom:au-action-tile` | `custom:au-action-card` |
| `custom:au-sensor-readout` | `custom:au-sensor-card` |

`custom:au-shell-grid` is unchanged.

**Action card config (v0.1.0+):** `tap_service` / `tap_service_data` were removed. Use `tap_action` instead. Icon, name, and secondary attribute no longer auto-fill from the entity — omit them to hide those UI parts.

**Action defaults (POC):** When omitted, `tap_action` defaults to `toggle` (falls back to more-info if the entity is unavailable or not toggleable). `hold_action` and `double_tap_action` default to `more-info`. Explicit YAML still overrides.

```yaml
# before
tap_service: light.toggle

# after
tap_action:
  action: call-service
  service: light.toggle
  service_data:
    entity_id: light.kitchen
```

## Installation

### HACS (recommended)

1. Add this repository as a custom repository of type **Dashboard** in HACS.
2. Install **AtriumUI**.
3. HACS registers the resource automatically. If you install manually, add the
   resource below.

### Manual

1. Build the bundle (`npm install && npm run build`).
2. Copy `dist/atrium-ui.js` to `<config>/www/atrium-ui/atrium-ui.js`.
3. Register the Lovelace resource (Settings -> Dashboards -> Resources):

```yaml
url: /local/atrium-ui/atrium-ui.js?v=0.0.1
type: module
```

## Usage

### Shell Grid

`au-shell-grid` is a full-dashboard layout container. It is designed to be the
single top-level card of a **Panel view** so it can span the whole screen. Child
cards are placed on a coordinate grid via a per-card `layout: { x, y, w, h }`
(authored against the desktop `columns` base). Cards without `layout` auto-flow
into the first free slot.

```yaml
# A Panel-mode view holding one full-width interactive grid
views:
  - title: Home
    type: panel
    cards:
      - type: custom:au-shell-grid
        columns: 12          # desktop base columns (default 12)
        row_height: 80px     # height of one row unit
        gap: 12px
        cards:
          - type: custom:au-action-card
            id: kitchen           # stable id (recommended)
            entity: light.kitchen
            layout: { x: 0, y: 0, w: 4, h: 2 }
          - type: custom:au-sensor-card
            id: temp
            entity: sensor.living_room_temperature
            min: 0
            max: 40
            unit: "°C"
            layout: { x: 4, y: 0, w: 4, h: 2 }
```

**Grid options**

| Option | Default | Purpose |
| --- | --- | --- |
| `columns` | `12` | Desktop base column count. |
| `row_height` | `80px` | Height of a single row unit (ignored when height is distributed). |
| `gap` | `var(--au-gap)` | Gap between tracks. |
| `width` | `100%` | Outer grid width. |
| `height` | `100vh` | Outer grid height. When set to a fixed size (e.g. `604px`), row tracks are sized evenly to fill the container. |
| `rows` | – | Optional row track count for even height distribution; defaults to the occupied content row count. |
| `max_rows` | – | Optional row cap. |
| `editable` | `true` | Allow layout editing while the dashboard is in edit mode. |

**Layout editing.** Click the dashboard **pencil** to enter edit mode — drag
handles, resize corners, and remove buttons appear on each cell (desktop width
only). Use the **+** button (bottom-right) to add a card from Home Assistant’s
card picker; the new card is placed in the next free grid slot. Click **Done**
to write the layout back to the dashboard YAML. Clicking a cell body opens that
card's own visual editor in a modal. Overlapping items are pushed down; empty
rows above an item are preserved. Set `editable: false` to disable layout
editing entirely.

**Persistence.** Layout coordinates and card content edits are saved to the
dashboard configuration file when you click **Done** (requires storage-mode
dashboards). Give each child card a stable `id:` so positions stay tied to the
right card across edits.

**Responsive breakpoints.** The column architecture follows the container width:
12 columns on desktop (> 1024px), 6 on tablet (600–1024px, oversized items snap
to full width), and a single-column stack on mobile (< 600px). Drag/resize is
only available at the desktop base width.

### Action Card

Only `entity` is required. Icon, name, and secondary line each use entity
defaults when their value is omitted. Each slot can be hidden with its
`show_*` flag (all default to `true`). Default actions: tap toggles the entity,
hold and double-tap open more-info.

`content_layout` controls icon/text arrangement inside the tile. It is separate
from shell-grid placement (`layout: { x, y, w, h }`).

```yaml
type: custom:au-action-card
entity: light.kitchen
name: Kitchen                           # optional override; entity name when omitted
show_name: true                         # optional; default true
icon: mdi:ceiling-light               # optional override; entity icon when omitted
show_icon: true                         # optional; default true
content_layout: horizontal             # optional; horizontal | vertical
secondary_attribute: brightness        # optional; entity state when omitted
show_secondary_attribute: true         # optional; default true
tap_action:                             # optional; default toggle
  action: toggle
hold_action:                            # optional; default more-info
  action: more-info
double_tap_action:                       # optional; default more-info
  action: more-info
```

### Sensor Card

```yaml
type: custom:au-sensor-card
entity: sensor.living_room_temperature
name: Living Room
min: 0
max: 40
unit: "°C"
precision: 1
severity:
  warn: 28
  critical: 32
  direction: above
```

### Light Card

Capability-driven controls for `light.*` entities. The card adapts to what the
light supports:

- **On/off only** — header with tap-to-toggle; no sliders
- **Dimmable** — brightness slider
- **CCT** — brightness + color-temperature slider (warm→cool palette)
- **RGB / HS** — brightness + hue slider (rainbow palette)
- **RGB + CCT** — follows the entity's live `color_mode` (shows one color slider)

Sliders use the reusable `au-light-slider` component (also exported from the
bundle for other cards).

```yaml
type: custom:au-light-card
entity: light.living_room
name: Living Room
show_brightness: true
show_color_temp: true
show_rgb: true
tap_action:
  action: toggle
```

**On/off only** (no sliders):

```yaml
type: custom:au-light-card
entity: light.plug
```

**CCT example:**

```yaml
type: custom:au-light-card
entity: light.cct_bulb
```

**RGB example:**

```yaml
type: custom:au-light-card
entity: light.rgb_strip
```

### Climate Card

Capability-driven controls for `climate.*` entities (air conditioners, mini-splits,
heat pumps). The card adapts to what the device supports:

| Capability | UI |
| --- | --- |
| `hvac_modes` | Expandable mode selector under the temp slider (current mode; tap to expand). `heat_cool` is labeled **Auto**. |
| Target temperature | Slider (default) or − / + buttons via `temperature_control` (`min_temp` / `max_temp` / `target_temp_step`) |
| `fan_modes` | Expandable fan selector beside Mode under the slider |

The secondary line defaults to `current_temperature` (with unit), then
`hvac_action`, then entity state. Override with `secondary_attribute` if needed.

v1 does **not** include humidity targeting, swing, presets, or dual
`heat_cool` setpoints.

```yaml
type: custom:au-climate-card
entity: climate.living_room_ac
name: Living Room AC
show_temperature: true
temperature_control: buttons
show_hvac_modes: true
show_fan_mode: true
content_layout: vertical
tap_action:
  action: more-info
```

**Cool-only example:**

```yaml
type: custom:au-climate-card
entity: climate.bedroom_ac
```

**With fan modes:**

```yaml
type: custom:au-climate-card
entity: climate.office_ac
show_fan_mode: true
```

Primitives `au-mode-chip-group`, `au-climate-selectors`, and `au-temp-stepper`
are exported from the bundle for reuse by other cards.

### Shell Grid — Home dashboard

`au-shell-grid` is a **single** Lovelace card: Home → Rooms, with one coordinate
grid (`columns`, `rows`, `gap`, `row_height`) for both the Home overview room
tiles and entity tiles inside each room.

Floors group rooms; tapping a room opens its entity grid. On the Home overview,
room tiles sized `w ≥ 4` and `h ≥ 2` show a strip of light/switch icons from that
room’s entities (config order, capped at 6). Tap an icon to toggle without opening
the room; tap the rest of the tile to enter. When there are no lights/switches
to show, the strip is hidden. The strip animates out when the tile shrinks
below the threshold.

Configure the strip with card-level `room_controls` and/or per-room `controls`
(`show`, `include` whitelist, `exclude` blacklist, `icons` map) — in the visual
card editor, or on the dashboard: Edit mode → pencil on a room tile → **Edit
room**. Entity `icon` also applies to the strip. In dashboard Edit mode
(desktop), drag/resize/add works on the Home room grid and inside rooms.
Presence, bulk “All off”, scenes/scripts shortcuts, and optional multi-entity
tiles are supported.

**Visual editor (GUI):** Edit the card in Lovelace (pencil → card → Edit). Add
floors and rooms and pick entities from HA’s entity selector — no YAML required.
Adding the card from “Add card” starts with a sample floor/room.

Entity domains map to the best Atrium card automatically:

| Domain | Card |
| --- | --- |
| `light` | `au-light-card` |
| `climate` | `au-climate-card` |
| `fan` | `au-fan-card` |
| `cover` | `au-cover-card` |
| `switch` | `au-switch-card` |
| `vacuum` | `au-vacuum-card` |
| `sensor` / `binary_sensor` | `au-sensor-card` |
| `water_heater`, … | `au-device-card` |
| other toggleable | `au-action-card` (or device card when supported) |

- **`entities:`** — resolved via this table when `card_type` is omitted.
- **`cards:`** — free-form Lovelace configs; remappable Atrium entity cards
  (`au-action-card`, `au-device-card`, `au-light-card`, `au-climate-card`,
  `au-fan-card`, `au-cover-card`, `au-switch-card`, `au-vacuum-card`,
  `au-sensor-card`) are aligned to the same table from their `entity` on mount
  and when saved from the Home editor. Set `card_type_locked: true` to keep an
  intentional mismatch. Calendar, room, shell-grid, and third-party cards are
  never remapped.

```yaml
type: custom:au-shell-grid
height: 100vh
presence:
  - person.alex
floors:
  - name: Main
    entities:
      - entity: light.hallway
        layout: { x: 4, y: 0, w: 2, h: 2 }
    rooms:
      - name: Living room
        layout: { x: 0, y: 0, w: 4, h: 3 }
        controls:
          show: true
          exclude:
            - switch.hidden_relay
          icons:
            light.living: mdi:floor-lamp
        entities:
          - entity: light.living
            icon: mdi:ceiling-light
          - entity: cover.living_blinds
          - entity: fan.living
```

Floor-level `entities` sit on the Home overview grid next to rooms. Room
`entities` are an Atrium shorthand; in dashboard Edit mode the room **Add card**
FAB uses Home Assistant’s card picker so any installed Lovelace card can be
placed on the room grid (`floors[].rooms[].cards`). When the selected card
exposes a visual editor, a **Configure card** step opens first (entity, name,
icon, and card options); Save places it on the next free slot. Cards without an
editor place immediately. In room Edit mode, the pencil on a tile reopens the
same editor.

**Migration:** `custom:au-home-dashboard` was removed. Move its keys onto
`custom:au-shell-grid` (no nested home card).

**Home options**

| Option | Default | Purpose |
| --- | --- | --- |
| `floors` | sample | Floors → rooms and optional floor-level entities. |
| `columns` / `gap` / `row_height` | `12` / `12px` / `80px` | Shared Home + room grid layout. |
| `rows` | – | Equal-height row tracks filling the dashboard height (Home rooms + in-room entities). |
| `presence` | `[]` | Person / device_tracker entities for the presence strip. |
| `show_presence` | `true` | Show the presence strip on Home. |
| `show_bulk_actions` | `true` | Show room “All off”. |
| `clock_format` | `24h` | Toolbar clock: `24h` or `12h` (centered on Home and Room). |
| `room_controls` | – | Default room-tile light/switch strip (`show`, `include`, `exclude`, `icons`). Per-room `controls` overrides. |
| `auto_areas` | `false` | Merge entities from each room’s `area_id` (HA area registry). |
| `prefer_device_name` | `true` | Prefer device registry names when available. |
| `confirm_actions` | `false` | Confirm before bulk / high-stakes device actions. |
| `scenes` / `scripts` | `[]` | Quick-action chips on the Home view. |
| `multi_entity` | `[]` | Optional grouped toggle tiles inside a room. |
| `debug` | `false` | Console diagnostics. |

Full demo: [`demo/home-dashboard.yaml`](demo/home-dashboard.yaml).

**Look.** Soft squircle room/device tiles, domain-colored “on” fills, large type,
and a presence strip with home/away motion. Entity tiles receive `variant: home`
automatically.

**Localization.** UI strings ship for English, Russian, and Hebrew (RTL). The
active language follows `hass.language`.

**Compatibility.** Targeted at Home Assistant **2024.1+** with storage or YAML
Lovelace Panel views and a HACS/manual dashboard resource.

### Fan Card

Dedicated fan tile. Primary tap toggles on/off. Optional speed control uses a
slider (default) or expandable icon selector (`speed_control: button`). Preset modes,
oscillate, and direction appear when the entity supports them and are not
disabled in config. When the tile is on, the speed slider fill follows the card
on-palette (home white-on-accent / classic `--au-state-active`).

```yaml
type: custom:au-fan-card
entity: fan.bedroom
name: Bedroom fan
show_speed: true
speed_control: button           # slider | button (expandable icon selector)
show_preset_modes: true
show_oscillate: true
show_direction: true
```

### Cover Card

Dedicated cover tile. Primary tap runs `cover.toggle`. Optional open/close/stop
buttons and a position slider appear when supported and not disabled in config.

```yaml
type: custom:au-cover-card
entity: cover.living_blinds
name: Blinds
show_controls: true
show_position: true
```

### Switch Card

Dedicated switch tile. Primary tap uses explicit `turn_on` / `turn_off` from
live entity state.

```yaml
type: custom:au-switch-card
entity: switch.office_lamp
name: Lamp
```

### Vacuum Card

Dedicated vacuum tile. Primary tap starts when idle/docked and returns home when
cleaning. Optional start / pause / stop / return controls appear when supported.
Home glance hides domain controls by default (`show_controls: true` to opt in).

**Settings dashboard.** A gear on the tile (and hold, replacing more-info) opens
a full-screen overlay that auto-discovers enabled entities on the same HA device.
Essentials (battery, suction, mop, map, …) appear first; Advanced holds the rest.
Edits are drafted until **Apply**. Sections: Status, Clean, Map, Rooms, Dock,
Maintenance, AI, DND, Voice, Advanced.

```yaml
type: custom:au-vacuum-card
entity: vacuum.x40_ultra
name: Vacuum
show_controls: true
show_settings: true
# hide_sections: [voice, ai]
```

### Device Card

Adaptive multi-domain tile for domains without a dedicated card. Primary tap
toggles / runs the domain default action; optional controls adapt to
capabilities (water heater temperature / off-timer). Unsupported domains
(including `fan` / `cover` / `switch` / `vacuum` — use their dedicated cards)
render an explicit error state.

```yaml
type: custom:au-device-card
entity: water_heater.tank
name: Boiler
show_controls: true
confirm_actions: false
tap_action:
  action: more-info
```

Supported domains include `water_heater`, `media_player`, `humidifier`,
`input_boolean`, `scene`, `script`, `remote`, and `automation`.

### Calendar Card

View-only agenda preview for Home Assistant `calendar.*` entities (Google Calendar,
CalDAV/iCloud, Local Calendar, etc.). Configure those integrations in HA first — the
card does not talk to Google/Apple APIs directly.

Default view is an agenda list; also supports today strip, week grid, and month
mini-calendar. Multi-calendar color coding, expand-on-tap, optional view picker,
allowlist/blocklist filters.

Requires Home Assistant **2023.12+** for `calendar.get_events` response data
(falls back to WebSocket when available).

```yaml
type: custom:au-calendar-card
title: Calendar
view: agenda                    # agenda | today | week | month
entities:
  - entity: calendar.personal
    color: "#FF3B30"
    label: Personal
  - entity: calendar.family
    color: "#34C759"
    label: Family
days: 31                         # agenda horizon (default 31)
max_events: 12
refresh_minutes: 60
timezone: local                 # local | event
time_format: 24h                # 24h | 12h (default 24h)
expand_on_tap: true
show_location: true
show_description: false
show_calendar_label: true
show_view_picker: false
# allowlist: "Standup|Demo"
# blocklist: "Private"
# hide_all_day: false
```

## Design system

AtriumUI’s visual language is defined in `src/theme/tokens.ts` (Home look).
Structural colors still bind to Home Assistant theme variables where possible;
fallbacks below match the Home tokens.

| Attribute | Token | Fallback |
| --- | --- | --- |
| Font | `--au-home-font` | SF Pro Rounded / system rounded sans |
| Card background | `--ha-card-background` | `var(--card-background-color, #ffffff)` |
| Primary text | `--primary-text-color` | `#1c1c1e` |
| Secondary text | `--secondary-text-color` | `#8e8e93` |
| Accent | `--accent-color` / `--au-accent` | `#0a84ff` |
| Corner radius | `--au-home-radius` | `22px` (`--au-home-radius-sm`: `16px`) |
| Gap | `--au-home-gap` / `--au-gap` | `12px` (`--au-gap-sm`: `8px`) |
| Pad | `--au-home-pad` | `16px` |
| Active / inactive | `--state-active-color` / `--state-inactive-color` | accent / secondary |
| Open / closed | `--au-state-open` / `--au-state-closed` | success / inactive |
| Home / away | `--au-state-home` / `--au-state-away` | success / inactive |
| Motion | `--au-motion-fast` / `medium` / `slow` | `160ms` / `280ms` / `420ms` |

## Development

```bash
npm install       # install dependencies
npm run dev       # Vite app server (not HA)
npm run typecheck # strict TypeScript check
npm run lint      # ESLint
npm run test      # Vitest unit tests
npm run build     # produce dist/atrium-ui.js
```

### Home Assistant watch build (`dev:ha`)

```bash
# Default writes to a Samba-mounted HA www folder:
npm run dev:ha

# Override the output directory:
HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha
```

`HA_BUILD=1` enables Vite’s HA-oriented build (see `vite.config.ts`). If the
SMB mount reports “Resource busy”, unmount/remount the share or point `HA_WWW`
at a local folder and copy into HA.

### Demo YAML

[`demo/home-dashboard.yaml`](demo/home-dashboard.yaml) uses placeholder entity
ids (e.g. `light.living_room`, `person.alex`). Replace them with entities from
your HA instance before loading the dashboard.

## License

MIT
