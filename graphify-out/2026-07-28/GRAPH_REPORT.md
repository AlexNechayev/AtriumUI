# Graph Report - HAD  (2026-07-28)

## Corpus Check
- 180 files · ~93,808 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1557 nodes · 4551 edges · 78 communities (67 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

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
- Home Edit Commit
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
- .render
- home-assistant.ts
- format-clock.ts
- ._renderVacuumControls
- au-switch-card-editor.ts
- @eslint/js
- AuCoverCardEditor
- AuLightCardEditor
- AuSensorCardEditor
- fireEvent
- ._findClosestLovelace
- LovelaceCardEditor
- device.ts
- AuSwitchCard
- home-assistant.ts
- au-light-card-editor.ts
- ._renderSectionBody
- shell-grid-add-card.test.ts
- reactive-update.test.ts
- isLightCardCompact
- AuRoomCardEditor
- .render
- AuActionCardEditor
- displayColumnsForWidth

## God Nodes (most connected - your core abstractions)
1. `AuShellHomeView` - 139 edges
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
- `AtriumUI` --cites--> `Atrium Home demo dashboard`  [EXTRACTED]
  README.md → demo/home-dashboard.yaml
- `Demo au-shell-grid Home config` --shares_data_with--> `Home → Rooms floors pattern`  [INFERRED]
  demo/home-dashboard.yaml → README.md
- `shell-grid edit-mode fixture (hui-card)` --conceptually_related_to--> `Shell Grid layout editing`  [INFERRED]
  test/template/fixtures/shell-grid-edit-mode.html → README.md
- `shell-grid custom-view edit-mode fixture (lovelace)` --conceptually_related_to--> `Shell Grid layout editing`  [INFERRED]
  test/template/fixtures/shell-grid-view-edit-mode.html → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AtriumUI Lovelace card suite** — readme_au_action_card, readme_au_sensor_card, readme_au_light_card, readme_au_climate_card, readme_au_device_card [EXTRACTED 1.00]
- **Shell grid edit-mode test injection paths** — test_template_fixtures_shell_grid_edit_mode_hui_card_fixture, test_template_fixtures_shell_grid_view_edit_mode_lovelace_fixture, readme_layout_editing, readme_au_shell_grid [INFERRED 0.85]
- **Home dashboard floors/rooms demo flow** — readme_home_floors_rooms, demo_home_dashboard_shell_grid_home_config, demo_home_dashboard_main_floor, readme_domain_card_mapping [INFERRED 0.85]

## Communities (78 total, 11 thin omitted)

### Community 0 - "Home View Grid Layout"
Cohesion: 0.13
Nodes (10): AuClimateSelectors, HTMLElementTagNameMap, SelectorPanel, customElement, property, state, formatFanModeLabel(), getFanModeIcon() (+2 more)

### Community 1 - "Card Registry Types"
Cohesion: 0.06
Nodes (41): AuActionCard, customElement, CARDS, DomainControlKind, DomainControlVisibility, resolveDomainControl(), runWaterHeaterTemperature(), getWaterHeaterCapabilities() (+33 more)

### Community 2 - "Device Domain Controls"
Cohesion: 0.14
Nodes (11): AuCalendarCardEditor, HTMLElementTagNameMap, customElement, calendarCardEditorLabels, calendarCardEditorSchema, AuCalendarCardConfig, AuCalendarEntityConfig, AuCalendarTimezoneMode (+3 more)

### Community 3 - "Climate Card"
Cohesion: 0.08
Nodes (28): AuClimateCard, customElement, state, HvacAction, HvacMode, asNumber(), asStringList(), clamp() (+20 more)

### Community 4 - "Action Card Base"
Cohesion: 0.08
Nodes (3): AuActionCardBase, humanize(), eventOptions

### Community 5 - "Light Card"
Cohesion: 0.19
Nodes (27): HTMLElementTagNameMap, createDebounced(), getEntityBrightness(), clamp(), formatColorTempLabel(), getColorTempRange(), getLightBrightness(), getLightColorTemp() (+19 more)

### Community 6 - "home-drag-resize.ts"
Cohesion: 0.17
Nodes (17): commitHomeEditToFloors(), commitRoomEditToFloors(), beginHomeEditDraft(), beginRoomEditDraft(), HomeEditSessionDraft, buildHomeEditItems(), buildHomeFloorGridItems(), buildRoomGridItems() (+9 more)

### Community 7 - "Room Card"
Cohesion: 0.06
Nodes (21): AuRoomCard, HTMLElementTagNameMap, customElement, eventOptions, AuBaseCard, hasEntityChanged(), property, state (+13 more)

### Community 8 - "TypeScript Compiler Config"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, compilerOptions, alwaysStrict, declaration, declarationDir, emitDeclarationOnly (+34 more)

### Community 9 - "Package Dependencies"
Cohesion: 0.12
Nodes (17): eslint, jsdom, devDependencies, eslint, jsdom, prettier, @types/node, typescript (+9 more)

### Community 10 - "Home Edit Session"
Cohesion: 0.07
Nodes (8): AuShellHomeView, customElement, property, query, state, mountChildCard(), emptyEditSessionDraft(), LovelaceCardConfig

### Community 11 - "Device Card Timers"
Cohesion: 0.12
Nodes (7): AuDeviceCard, customElement, state, isDeviceActive(), runPrimaryDeviceAction(), DomainControlModel, isEntityOffline()

### Community 13 - "Card Custom Elements"
Cohesion: 0.16
Nodes (21): lit, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap (+13 more)

### Community 14 - "Action Utilities"
Cohesion: 0.29
Nodes (16): clampToColumns(), collides(), compact(), deriveResponsiveLayout(), findFreeSlot(), getFirstCollision(), GridPos, gridRowCount() (+8 more)

### Community 15 - "Card Editor Schemas"
Cohesion: 0.16
Nodes (11): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, AuClimateCardEditor, HTMLElementTagNameMap, customElement, climateCardEditorLabels (+3 more)

### Community 16 - "Temp Stepper Control"
Cohesion: 0.14
Nodes (3): AuTempStepper, customElement, property

### Community 17 - "Demo Dashboard Docs"
Cohesion: 0.05
Nodes (49): Atrium Home demo dashboard, Demo Main floor (Living/Kitchen/Utility), Demo multi_entity All living lights, Demo au-shell-grid Home config, Action Card, AtriumUI, Action Card (custom:au-action-card), AuActionCardBase (+41 more)

### Community 18 - "Room Card Editor"
Cohesion: 0.12
Nodes (16): AuCoverCard, customElement, state, closeCover(), COVER_SUPPORT, CoverCapabilities, formatCoverSecondary(), getCoverCapabilities() (+8 more)

### Community 19 - "Home Edit Commit"
Cohesion: 0.17
Nodes (9): AuLightCard, customElement, state, HassEntity, formatBrightnessLabel(), getActiveColorControl(), getLightCapabilities(), hasLightControls() (+1 more)

### Community 20 - "au-shell-grid.ts"
Cohesion: 0.16
Nodes (3): renderAddCardModal(), resolveDeviceDisplayName(), item()

### Community 21 - "Light Slider Control"
Cohesion: 0.24
Nodes (18): HTMLElementTagNameMap, VIEW_KEYS, buildMonthGrid(), CallServiceWithResponse, compileFilter(), computeFetchWindow(), endOfLocalDay(), fetchCalendarEvents() (+10 more)

### Community 22 - "Home View Rendering"
Cohesion: 0.20
Nodes (9): author, description, license, main, module, name, type, types (+1 more)

### Community 23 - "Mode Chip Group"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:ha, format, lint, test, test:watch (+1 more)

### Community 24 - "Build TSConfig"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, compilerOptions, declaration, declarationDir, emitDeclarationOnly, noEmit, sourceMap, exclude (+6 more)

### Community 25 - "Localization i18n"
Cohesion: 0.23
Nodes (13): computeRowTrackHeightPx(), moveItem(), applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag(), beginPointerResize() (+5 more)

### Community 26 - "Card Picker Helpers"
Cohesion: 0.33
Nodes (6): keywords, custom-card, design-system, hacs, home-assistant, lovelace

### Community 27 - "Sensor Card"
Cohesion: 0.18
Nodes (16): AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuClimateCardConfig, AuActionCardConfig, AuGridItemLayout, AuSeverityThresholds, AuCoverCardConfig (+8 more)

### Community 28 - "Grid Item Rendering"
Cohesion: 0.34
Nodes (9): ActionSurfaceOptions, clearHoldTimer(), clearTapTimer(), createPointerGestureState(), handleGesturePointerCancel(), handleGesturePointerDown(), handleGesturePointerUp(), PointerGestureCallbacks (+1 more)

### Community 29 - "Room Tile Controls"
Cohesion: 0.31
Nodes (8): en, TranslationKey, he, isRtlLanguage(), normalizeLanguage(), RTL_LANGUAGES, TABLES, ru

### Community 31 - "Base Card Lifecycle"
Cohesion: 0.29
Nodes (6): 1. Executive Summary & Project Health Dashboard, 2. Key Findings Matrix, 3. Step-by-Step Action Plan, HAD / AtriumUI — Master Assessment, Projected Impact (relative), The Bottom Line

### Community 32 - "Light Slider Tests"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 33 - "Sensor Card Editor"
Cohesion: 0.07
Nodes (8): AuShellGrid, customElement, property, query, state, walkAncestors(), ensureCardPickerLoaded(), Lovelace

### Community 35 - "device.ts"
Cohesion: 0.28
Nodes (6): buildRoomTileCardConfig(), ChildConfigOptions, homeAwareCardConfig(), RoomTileCardConfigInput, AuHomeEntityConfig, AuHomeRoomConfig

### Community 36 - "areas.ts"
Cohesion: 0.12
Nodes (16): buildEditRoomDraft(), EditRoomAddCandidate, EditRoomModalHandlers, EditRoomModalProps, moveEditRoomMember(), renderEditRoomModal(), roomEntitiesFromEditDraft(), collectRoomToggleEntities() (+8 more)

### Community 37 - "water-heater-timer.ts"
Cohesion: 0.10
Nodes (19): AuFanCard, customElement, state, FAN_SUPPORT, FanCapabilities, formatFanSecondary(), formatFanSpeedLabel(), getFanCapabilities() (+11 more)

### Community 39 - "HomeAssistant"
Cohesion: 0.19
Nodes (13): clamp(), computeEntityName(), defaultToggleService(), formatBrightnessPercent(), formatNumericState(), isEntityActive(), isToggleableDomain(), isToggleableEntity() (+5 more)

### Community 40 - "files"
Cohesion: 0.50
Nodes (4): files, dist, hacs.json, README.md

### Community 41 - "AuActionCardEditor"
Cohesion: 0.24
Nodes (9): DragState, HTMLElementTagNameMap, applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem, AuGridCardConfig, isShellHomeMode() (+1 more)

### Community 42 - "AuClimateCardEditor"
Cohesion: 0.17
Nodes (8): AuCalendarCard, customElement, state, AuCalendarEvent, AuCalendarView, isAuCalendarView(), formatDayHeader(), isSameLocalDay()

### Community 43 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

### Community 44 - "@eslint/js"
Cohesion: 0.42
Nodes (8): CARD_TYPE_LOCKED_KEY, cardTypeShort(), isRemappableAuCardType(), normalizeAuHomeCardConfig(), NormalizeAuHomeCardResult, recommendedAuCardType(), REMAPPABLE_AU_CARD_TYPES, withCustomCardPrefix()

### Community 46 - "au-light-slider.ts"
Cohesion: 0.11
Nodes (21): CardEditorMode, HTMLElementTagNameMap, NavView, cardTag(), cardTypeHasEditor(), createChildCard(), fallbackCustomCardEntries(), getCardEditorElement() (+13 more)

### Community 47 - "AuClimateSelectors"
Cohesion: 0.22
Nodes (3): EditRoomDraft, toggleEditRoomEntity(), findRoom()

### Community 48 - "ensureCardPickerLoaded"
Cohesion: 0.19
Nodes (16): ActionConfig, actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS, BLOCKED_HOMEASSISTANT_SERVICES, defaultDoubleTapAction(), defaultHoldAction(), defaultTapAction() (+8 more)

### Community 49 - "AuSensorCard"
Cohesion: 0.15
Nodes (12): deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector, HTMLElementTagNameMap, roomCardEditorLabels, roomCardEditorSchema, DEFAULT_HOME_FLOORS, HTMLElementTagNameMap (+4 more)

### Community 50 - "grid-engine.ts"
Cohesion: 0.21
Nodes (13): computeDomain(), buildVacuumDeviceCatalog(), classifyVacuumSection(), entriesForSection(), ESSENTIAL_SUFFIXES, filterCatalogSections(), isEnabledRegistryEntry(), isEssential() (+5 more)

### Community 51 - "activateOnce"
Cohesion: 0.11
Nodes (10): AuCoverCardEditor, customElement, AuDeviceCardEditor, customElement, AuSensorCardEditor, customElement, AuBaseEditor, property (+2 more)

### Community 52 - "._renderChildCard"
Cohesion: 0.12
Nodes (16): AuVacuumCard, customElement, ensureVacuumSettingsOverlay(), ACTIVE_STATES, formatVacuumSecondary(), getVacuumCapabilities(), isVacuumActive(), isVacuumDomain() (+8 more)

### Community 54 - ".render"
Cohesion: 0.13
Nodes (12): HTMLElementTagNameMap, AuLightSliderVariant, HTMLElementTagNameMap, AuTempControlMode, HTMLElementTagNameMap, clamp(), snapToStep(), valueFromClientX() (+4 more)

### Community 55 - "home-assistant.ts"
Cohesion: 0.29
Nodes (3): AuLightSlider, customElement, property

### Community 56 - "format-clock.ts"
Cohesion: 0.18
Nodes (13): formatEventTimeRange(), resolveClockFormat(), ClockDateFormat, ClockDayFormat, ClockFormat, formatClock(), formatClockDate(), formatClockWeekday() (+5 more)

### Community 58 - "au-switch-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuFanCardEditor, HTMLElementTagNameMap, customElement, fanCardEditorLabels, fanCardEditorSchema

### Community 59 - "@eslint/js"
Cohesion: 0.25
Nodes (4): AuFanSpeedSelector, customElement, property, state

### Community 60 - "AuCoverCardEditor"
Cohesion: 0.28
Nodes (5): AuSwitchCardEditor, HTMLElementTagNameMap, customElement, switchCardEditorLabels, switchCardEditorSchema

### Community 61 - "AuLightCardEditor"
Cohesion: 0.19
Nodes (7): AuVacuumSettingsOverlay, customElement, property, state, entityLabel(), roomDisplayName(), VacuumDeviceCatalog

### Community 63 - "fireEvent"
Cohesion: 0.28
Nodes (5): AuVacuumCardEditor, HTMLElementTagNameMap, customElement, vacuumCardEditorLabels, vacuumCardEditorSchema

### Community 64 - "._findClosestLovelace"
Cohesion: 0.22
Nodes (3): AuSensorCard, customElement, AuSensorCardConfig

### Community 65 - "LovelaceCardEditor"
Cohesion: 0.44
Nodes (8): clampTimerMinutes(), clearTimerEndsAt(), formatTimerRemaining(), normalizeTimerPresets(), readTimerEndsAt(), storageKey(), WH_TIMER_DEFAULT_PRESETS, writeTimerEndsAt()

### Community 66 - "device.ts"
Cohesion: 0.22
Nodes (13): childConfigForEntity(), HassEntityRegistryEntry, discoverFloorsFromAreas(), entitiesForArea(), mergeAreaEntities(), normalizeFloors(), DEDICATED_CARD_DOMAINS, DeviceCapabilities (+5 more)

### Community 67 - "AuSwitchCard"
Cohesion: 0.15
Nodes (9): AuSwitchCard, HTMLElementTagNameMap, customElement, auDebug(), toggleFan(), GestureKind, formatSwitchSecondary(), toggleSwitch() (+1 more)

### Community 68 - "home-assistant.ts"
Cohesion: 0.22
Nodes (8): CustomCardEntry, HassArea, HassDevice, HassEntityAttributeBase, HassFloor, HassThemes, HassUser, Window

### Community 69 - "au-light-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuLightCardEditor, HTMLElementTagNameMap, customElement, lightCardEditorLabels, lightCardEditorSchema

### Community 71 - "shell-grid-add-card.test.ts"
Cohesion: 0.38
Nodes (5): AuVacuumSettingsOpenOptions, HTMLElementTagNameMap, SECTION_TABS, AuVacuumSettingsSection, VacuumCatalogEntry

### Community 72 - "reactive-update.test.ts"
Cohesion: 0.60
Nodes (4): BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), BULK_OFF_DOMAINS

## Knowledge Gaps
- **219 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `name` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuShellHomeView` connect `Home Edit Session` to `device.ts`, `areas.ts`, `home-drag-resize.ts`, `Room Card`, `AuActionCardEditor`, `.render`, `displayColumnsForWidth`, `au-light-slider.ts`, `AuClimateSelectors`, `au-shell-grid.ts`, `AuActionCardEditor`, `._renderVacuumControls`, `Localization i18n`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `lit` connect `Card Custom Elements` to `Home View Grid Layout`, `Device Domain Controls`, `Light Card`, `Room Card`, `Card Editor Schemas`, `Light Slider Control`, `Card Picker Helpers`, `Grid Item Rendering`, `areas.ts`, `AuActionCardEditor`, `au-light-slider.ts`, `AuSensorCard`, `activateOnce`, `.render`, `au-switch-card-editor.ts`, `AuCoverCardEditor`, `fireEvent`, `AuSwitchCard`, `au-light-card-editor.ts`, `shell-grid-add-card.test.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `HomeAssistant` connect `Room Card` to `Card Registry Types`, `Climate Card`, `Light Card`, `Home Edit Session`, `Room Card Editor`, `Light Slider Control`, `areas.ts`, `water-heater-timer.ts`, `au-light-slider.ts`, `ensureCardPickerLoaded`, `grid-engine.ts`, `activateOnce`, `._renderChildCard`, `AuLightCardEditor`, `device.ts`, `AuSwitchCard`, `home-assistant.ts`, `shell-grid-add-card.test.ts`, `reactive-update.test.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home View Grid Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `Card Registry Types` be split into smaller, more focused modules?**
  _Cohesion score 0.060694579681921455 - nodes in this community are weakly interconnected._
- **Should `Device Domain Controls` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._