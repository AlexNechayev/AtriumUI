# Graph Report - HAD-room-idle-timeout  (2026-07-28)

## Corpus Check
- 180 files · ~94,293 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1563 nodes · 4558 edges · 64 communities (57 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4c7eacbc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Home View Grid Layout
- Card Registry Types
- Device Domain Controls
- Climate Card
- Action Card Base
- Light Card
- home-drag-resize.ts
- Room Card
- TypeScript Compiler Config
- Package Dependencies
- Home Edit Session
- Device Card Timers
- Shell Grid Editor
- Card Custom Elements
- Action Utilities
- Card Editor Schemas
- Temp Stepper Control
- Demo Dashboard Docs
- Room Card Editor
- au-shell-grid.ts
- Light Slider Control
- Home View Rendering
- Mode Chip Group
- Build TSConfig
- Localization i18n
- Card Picker Helpers
- Sensor Card
- Grid Item Rendering
- Room Tile Controls
- Device Card Editor
- Base Card Lifecycle
- Light Slider Tests
- Sensor Card Editor
- device.ts
- areas.ts
- water-heater-timer.ts
- au-climate-card-editor.ts
- HomeAssistant
- files
- AuActionCardEditor
- AuClimateCardEditor
- dependencies
- @eslint/js
- au-light-slider.ts
- AuClimateSelectors
- ensureCardPickerLoaded
- AuSensorCard
- grid-engine.ts
- activateOnce
- ._renderChildCard
- AuActionCardEditor
- format-clock.ts
- au-switch-card-editor.ts
- AuCoverCardEditor
- AuLightCardEditor
- AuSwitchCard
- home-assistant.ts
- au-light-card-editor.ts
- AuRoomCardEditor
- displayColumnsForWidth

## God Nodes (most connected - your core abstractions)
1. `AuShellHomeView` - 143 edges
2. `HassEntity` - 88 edges
3. `AuShellGrid` - 61 edges
4. `computeDomain()` - 57 edges
5. `AuActionCardBase` - 56 edges
6. `makeHass()` - 47 edges
7. `lit` - 42 edges
8. `AuVacuumSettingsOverlay` - 42 edges
9. `LovelaceCardConfig` - 41 edges
10. `isEntityOffline()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `normalizeTimerPresets()` --indirect_call--> `item()`  [INFERRED]
  src/utils/water-heater-timer.ts → test/template/grid-engine.test.ts
- `Demo au-shell-grid Home config` --shares_data_with--> `Home → Rooms floors pattern`  [INFERRED]
  demo/home-dashboard.yaml → README.md
- `shell-grid edit-mode fixture (hui-card)` --conceptually_related_to--> `Shell Grid layout editing`  [INFERRED]
  test/template/fixtures/shell-grid-edit-mode.html → README.md
- `shell-grid custom-view edit-mode fixture (lovelace)` --conceptually_related_to--> `Shell Grid layout editing`  [INFERRED]
  test/template/fixtures/shell-grid-view-edit-mode.html → README.md
- `GridPersistItem` --references--> `LovelaceCardConfig`  [EXTRACTED]
  src/template/shell-grid/config-persist.ts → src/types/home-assistant.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AtriumUI Lovelace card suite** — readme_au_action_card, readme_au_sensor_card, readme_au_light_card, readme_au_climate_card, readme_au_device_card [EXTRACTED 1.00]
- **Shell grid edit-mode test injection paths** — test_template_fixtures_shell_grid_edit_mode_hui_card_fixture, test_template_fixtures_shell_grid_view_edit_mode_lovelace_fixture, readme_layout_editing, readme_au_shell_grid [INFERRED 0.85]
- **Home dashboard floors/rooms demo flow** — readme_home_floors_rooms, demo_home_dashboard_shell_grid_home_config, demo_home_dashboard_main_floor, readme_domain_card_mapping [INFERRED 0.85]

## Communities (64 total, 7 thin omitted)

### Community 0 - "Home View Grid Layout"
Cohesion: 0.08
Nodes (25): Action Card, AtriumUI, Calendar Card, Climate Card, Components, Cover Card, Demo YAML, Design system (+17 more)

### Community 1 - "Card Registry Types"
Cohesion: 0.06
Nodes (33): AuSensorCard, customElement, CARDS, AuSensorCardConfig, CustomCardEntry, ActionCardInternals, makeActionCard(), renderActionCard() (+25 more)

### Community 2 - "Device Domain Controls"
Cohesion: 0.14
Nodes (11): AuCalendarCardEditor, HTMLElementTagNameMap, customElement, calendarCardEditorLabels, calendarCardEditorSchema, AuCalendarCardConfig, AuCalendarEntityConfig, AuCalendarTimezoneMode (+3 more)

### Community 3 - "Climate Card"
Cohesion: 0.06
Nodes (37): AuClimateCard, HTMLElementTagNameMap, customElement, state, AuClimateSelectors, customElement, property, state (+29 more)

### Community 4 - "Action Card Base"
Cohesion: 0.06
Nodes (16): AuActionCardBase, humanize(), eventOptions, ActionConfig, actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS, BLOCKED_HOMEASSISTANT_SERVICES (+8 more)

### Community 5 - "Light Card"
Cohesion: 0.08
Nodes (37): AuLightCard, HTMLElementTagNameMap, customElement, state, createDebounced(), getEntityBrightness(), isLightCardCompact(), clamp() (+29 more)

### Community 6 - "home-drag-resize.ts"
Cohesion: 0.11
Nodes (31): DEFAULT_HOME_FLOORS, HTMLElementTagNameMap, CardEditorMode, HTMLElementTagNameMap, NavView, commitHomeEditToFloors(), commitRoomEditToFloors(), beginHomeEditDraft() (+23 more)

### Community 7 - "Room Card"
Cohesion: 0.06
Nodes (24): AuRoomCard, HTMLElementTagNameMap, customElement, eventOptions, AuBaseCard, hasEntityChanged(), property, state (+16 more)

### Community 8 - "TypeScript Compiler Config"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, dist, node_modules, src, test, compilerOptions (+34 more)

### Community 9 - "Package Dependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, jsdom, prettier, @types/node, typescript, typescript-eslint, devDependencies (+9 more)

### Community 10 - "Home Edit Session"
Cohesion: 0.06
Nodes (8): AuShellHomeView, customElement, property, query, state, ensureCardPickerLoaded(), buildEditRoomDraft(), emptyEditSessionDraft()

### Community 11 - "Device Card Timers"
Cohesion: 0.13
Nodes (10): AuDeviceCard, customElement, state, clampTimerMinutes(), clearTimerEndsAt(), normalizeTimerPresets(), readTimerEndsAt(), storageKey() (+2 more)

### Community 13 - "Card Custom Elements"
Cohesion: 0.13
Nodes (21): lit, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, SeverityLevel, HTMLElementTagNameMap, HTMLElementTagNameMap (+13 more)

### Community 14 - "Action Utilities"
Cohesion: 0.29
Nodes (16): clampToColumns(), collides(), compact(), deriveResponsiveLayout(), findFreeSlot(), getFirstCollision(), gridRowCount(), moveItem() (+8 more)

### Community 15 - "Card Editor Schemas"
Cohesion: 0.21
Nodes (10): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, HTMLElementTagNameMap, climateCardEditorLabels, climateCardEditorSchema, HTMLElementTagNameMap (+2 more)

### Community 16 - "Temp Stepper Control"
Cohesion: 0.05
Nodes (17): AuFanSpeedSelector, customElement, property, state, AuLightSlider, customElement, property, AuTempControlMode (+9 more)

### Community 17 - "Demo Dashboard Docs"
Cohesion: 0.14
Nodes (22): Atrium Home demo dashboard, Demo Main floor (Living/Kitchen/Utility), Demo multi_entity All living lights, Demo au-shell-grid Home config, Action Card (custom:au-action-card), AuActionCardBase, AuCardContent, Climate Card (custom:au-climate-card) (+14 more)

### Community 18 - "Room Card Editor"
Cohesion: 0.12
Nodes (18): AuCoverCard, HTMLElementTagNameMap, customElement, state, localize(), closeCover(), COVER_SUPPORT, CoverCapabilities (+10 more)

### Community 20 - "au-shell-grid.ts"
Cohesion: 0.11
Nodes (9): fallbackCustomCardEntries(), EntityOption, renderAddCardModal(), renderAddEntityModal(), renderAddRoomModal(), renderCardEditorModal(), renderHomeAddChooser(), resolveDeviceDisplayName() (+1 more)

### Community 21 - "Light Slider Control"
Cohesion: 0.24
Nodes (18): HTMLElementTagNameMap, VIEW_KEYS, buildMonthGrid(), CallServiceWithResponse, compileFilter(), computeFetchWindow(), endOfLocalDay(), fetchCalendarEvents() (+10 more)

### Community 22 - "Home View Rendering"
Cohesion: 0.20
Nodes (9): author, description, license, main, module, name, type, types (+1 more)

### Community 23 - "Mode Chip Group"
Cohesion: 0.28
Nodes (5): AuCoverCardEditor, HTMLElementTagNameMap, customElement, coverCardEditorLabels, coverCardEditorSchema

### Community 24 - "Build TSConfig"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, dist, node_modules, src, test, compilerOptions, declaration, declarationDir (+6 more)

### Community 25 - "Localization i18n"
Cohesion: 0.23
Nodes (13): computeRowTrackHeightPx(), resizeItem(), applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag(), beginPointerResize() (+5 more)

### Community 26 - "Card Picker Helpers"
Cohesion: 0.33
Nodes (6): custom-card, design-system, hacs, home-assistant, lovelace, keywords

### Community 27 - "Sensor Card"
Cohesion: 0.20
Nodes (13): AuActionCardBaseConfig, AuActionCardContentLayout, AuActionCardConfig, AuGridItemLayout, AuSeverityThresholds, AuCoverCardConfig, AuDeviceCardConfig, AuDeviceDomain (+5 more)

### Community 28 - "Grid Item Rendering"
Cohesion: 0.34
Nodes (9): ActionSurfaceOptions, clearHoldTimer(), clearTapTimer(), createPointerGestureState(), handleGesturePointerCancel(), handleGesturePointerDown(), handleGesturePointerUp(), PointerGestureCallbacks (+1 more)

### Community 29 - "Room Tile Controls"
Cohesion: 0.31
Nodes (8): en, TranslationKey, he, isRtlLanguage(), normalizeLanguage(), RTL_LANGUAGES, TABLES, ru

### Community 30 - "Device Card Editor"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:ha, format, lint, test, test:watch (+1 more)

### Community 31 - "Base Card Lifecycle"
Cohesion: 0.29
Nodes (6): 1. Executive Summary & Project Health Dashboard, 2. Key Findings Matrix, 3. Step-by-Step Action Plan, HAD / AtriumUI — Master Assessment, Projected Impact (relative), The Bottom Line

### Community 32 - "Light Slider Tests"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 33 - "Sensor Card Editor"
Cohesion: 0.09
Nodes (7): AuShellGrid, customElement, property, query, state, walkAncestors(), Lovelace

### Community 35 - "device.ts"
Cohesion: 0.24
Nodes (7): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, homeAwareCardConfig(), RoomTileCardConfigInput, AuHomeEntityConfig, AuHomeRoomConfig

### Community 36 - "areas.ts"
Cohesion: 0.12
Nodes (13): addEditRoomMember(), controlsFromEditDraft(), EditRoomAddCandidate, EditRoomDraft, EditRoomModalHandlers, EditRoomModalProps, moveEditRoomMember(), renderEditRoomModal() (+5 more)

### Community 37 - "water-heater-timer.ts"
Cohesion: 0.12
Nodes (23): AuFanCard, HTMLElementTagNameMap, customElement, state, HTMLElementTagNameMap, HassEntity, FAN_SUPPORT, FanCapabilities (+15 more)

### Community 39 - "HomeAssistant"
Cohesion: 0.09
Nodes (30): AuActionCard, customElement, clamp(), executeAction(), BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), auDebug() (+22 more)

### Community 40 - "files"
Cohesion: 0.50
Nodes (4): dist, hacs.json, README.md, files

### Community 41 - "AuActionCardEditor"
Cohesion: 0.19
Nodes (12): DragState, GridItem, HTMLElementTagNameMap, applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem, GridItemLike (+4 more)

### Community 42 - "AuClimateCardEditor"
Cohesion: 0.17
Nodes (8): AuCalendarCard, customElement, state, AuCalendarEvent, AuCalendarView, isAuCalendarView(), formatDayHeader(), isSameLocalDay()

### Community 43 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

### Community 44 - "@eslint/js"
Cohesion: 0.12
Nodes (27): DEDICATED_CARD_DOMAINS, DeviceCapabilities, EXPLICIT_ON_OFF_DOMAINS, getDeviceCapabilities(), isSupportedDeviceDomain(), resolveCardTypeForEntity(), slugify(), usesExplicitOnOff() (+19 more)

### Community 46 - "au-light-slider.ts"
Cohesion: 0.20
Nodes (10): cardTag(), cardTypeHasEditor(), createChildCard(), getCardEditorElement(), stubConfigForCardType(), attachChildToHost(), ChildCardMaps, pruneChildCards() (+2 more)

### Community 49 - "AuSensorCard"
Cohesion: 0.16
Nodes (10): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector, ROOM_CARD_ENTITY_DOMAINS, ROOM_TOGGLE_DOMAINS (+2 more)

### Community 51 - "activateOnce"
Cohesion: 0.11
Nodes (11): AuActionCardEditor, customElement, AuClimateCardEditor, customElement, AuVacuumCardEditor, customElement, AuBaseEditor, property (+3 more)

### Community 52 - "._renderChildCard"
Cohesion: 0.13
Nodes (19): AuVacuumCard, HTMLElementTagNameMap, customElement, ensureVacuumSettingsOverlay(), HTMLElementTagNameMap, SECTION_TABS, ACTIVE_STATES, formatVacuumSecondary() (+11 more)

### Community 56 - "format-clock.ts"
Cohesion: 0.18
Nodes (13): formatEventTimeRange(), resolveClockFormat(), ClockDateFormat, ClockDayFormat, ClockFormat, formatClock(), formatClockDate(), formatClockWeekday() (+5 more)

### Community 58 - "au-switch-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuFanCardEditor, HTMLElementTagNameMap, customElement, fanCardEditorLabels, fanCardEditorSchema

### Community 60 - "AuCoverCardEditor"
Cohesion: 0.28
Nodes (5): AuSwitchCardEditor, HTMLElementTagNameMap, customElement, switchCardEditorLabels, switchCardEditorSchema

### Community 61 - "AuLightCardEditor"
Cohesion: 0.06
Nodes (24): AuVacuumSettingsOpenOptions, AuVacuumSettingsOverlay, customElement, property, state, HassEntityRegistryEntry, AuVacuumSettingsSection, buildVacuumDeviceCatalog() (+16 more)

### Community 67 - "AuSwitchCard"
Cohesion: 0.22
Nodes (3): AuSwitchCard, customElement, formatSwitchSecondary()

### Community 68 - "home-assistant.ts"
Cohesion: 0.15
Nodes (9): HassArea, HassDevice, HassEntityAttributeBase, HassFloor, HassThemes, HassUser, Window, pressVacuumButton() (+1 more)

### Community 69 - "au-light-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuLightCardEditor, HTMLElementTagNameMap, customElement, lightCardEditorLabels, lightCardEditorSchema

### Community 74 - "AuRoomCardEditor"
Cohesion: 0.21
Nodes (8): AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels, roomCardEditorSchema, AuCardVariant, AuRoomCardConfig, normalizeRoomCardEntities()

## Knowledge Gaps
- **223 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `name` (+218 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuShellHomeView` connect `Home Edit Session` to `device.ts`, `areas.ts`, `home-drag-resize.ts`, `Room Card`, `AuActionCardEditor`, `displayColumnsForWidth`, `Action Utilities`, `AuClimateSelectors`, `au-light-slider.ts`, `Home Edit Commit`, `au-shell-grid.ts`, `Localization i18n`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `lit` connect `Card Custom Elements` to `Device Domain Controls`, `Climate Card`, `Light Card`, `home-drag-resize.ts`, `Room Card`, `Card Editor Schemas`, `Temp Stepper Control`, `Room Card Editor`, `au-shell-grid.ts`, `Light Slider Control`, `Mode Chip Group`, `Card Picker Helpers`, `Grid Item Rendering`, `areas.ts`, `water-heater-timer.ts`, `AuActionCardEditor`, `AuSensorCard`, `activateOnce`, `._renderChildCard`, `au-switch-card-editor.ts`, `AuCoverCardEditor`, `au-light-card-editor.ts`, `AuRoomCardEditor`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `HomeAssistant` connect `Room Card` to `Card Registry Types`, `Climate Card`, `areas.ts`, `home-assistant.ts`, `home-drag-resize.ts`, `Action Card Base`, `HomeAssistant`, `water-heater-timer.ts`, `Home Edit Session`, `Light Card`, `@eslint/js`, `au-light-slider.ts`, `Room Card Editor`, `activateOnce`, `._renderChildCard`, `au-shell-grid.ts`, `Light Slider Control`, `AuLightCardEditor`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _223 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home View Grid Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Card Registry Types` be split into smaller, more focused modules?**
  _Cohesion score 0.06416275430359937 - nodes in this community are weakly interconnected._
- **Should `Device Domain Controls` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._