# Graph Report - HAD  (2026-07-18)

## Corpus Check
- 145 files · ~77,029 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1284 nodes · 3581 edges · 58 communities (51 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.83)
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
- Device Card Editor
- Base Card Lifecycle
- Light Slider Tests
- Sensor Card Editor
- device.ts
- .callService
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
- ._refreshLayoutEditingState
- AuSensorCard
- grid-engine.ts
- ._detectHaDashboardEditing
- au-climate-selectors.ts
- .render
- au-light-slider.ts
- AuLightSlider
- home-edit-room-modal.ts
- AuActionCardEditor

## God Nodes (most connected - your core abstractions)
1. `AuShellHomeView` - 138 edges
2. `AuShellGrid` - 61 edges
3. `HassEntity` - 53 edges
4. `AuActionCardBase` - 48 edges
5. `computeDomain()` - 44 edges
6. `AuDeviceCard` - 38 edges
7. `LovelaceCardConfig` - 38 edges
8. `makeHass()` - 36 edges
9. `AuCalendarCard` - 34 edges
10. `AuClimateCard` - 34 edges

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

## Communities (58 total, 7 thin omitted)

### Community 0 - "Home View Grid Layout"
Cohesion: 0.14
Nodes (25): closeCover(), COVER_SUPPORT, CoverCapabilities, getCoverCapabilities(), getCoverPosition(), openCover(), setCoverPosition(), stopCover() (+17 more)

### Community 1 - "Card Registry Types"
Cohesion: 0.08
Nodes (26): AuActionCard, customElement, CARDS, ActionCardInternals, makeActionCard(), renderActionCard(), makeCalendarHass(), renderClimateCard() (+18 more)

### Community 2 - "Device Domain Controls"
Cohesion: 0.42
Nodes (7): DEDICATED_CARD_DOMAINS, DeviceCapabilities, getDeviceCapabilities(), isSupportedDeviceDomain(), resolveCardTypeForEntity(), SUPPORTED_DEVICE_DOMAINS, getWaterHeaterCapabilities()

### Community 3 - "Climate Card"
Cohesion: 0.09
Nodes (31): AuClimateCard, HTMLElementTagNameMap, customElement, state, AuClimateCardConfig, HvacAction, HvacMode, HassEntity (+23 more)

### Community 4 - "Action Card Base"
Cohesion: 0.05
Nodes (31): ActionSurfaceOptions, AuActionCardBase, humanize(), eventOptions, ActionConfig, actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS (+23 more)

### Community 5 - "Light Card"
Cohesion: 0.08
Nodes (36): AuLightCard, HTMLElementTagNameMap, customElement, state, createDebounced(), isUnavailable(), isLightCardCompact(), clamp() (+28 more)

### Community 6 - "home-drag-resize.ts"
Cohesion: 0.17
Nodes (14): computeRowTrackHeightPx(), moveItem(), applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag(), beginPointerResize() (+6 more)

### Community 7 - "Room Card"
Cohesion: 0.11
Nodes (4): AuRoomCard, customElement, eventOptions, AuRoomCardEntityConfig

### Community 8 - "TypeScript Compiler Config"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, compilerOptions, alwaysStrict, declaration, declarationDir, emitDeclarationOnly (+34 more)

### Community 9 - "Package Dependencies"
Cohesion: 0.12
Nodes (17): eslint, jsdom, devDependencies, eslint, jsdom, prettier, @types/node, typescript (+9 more)

### Community 10 - "Home Edit Session"
Cohesion: 0.05
Nodes (9): AuShellHomeView, customElement, property, query, state, ensureCardPickerLoaded(), addEditRoomMember(), controlsFromEditDraft() (+1 more)

### Community 11 - "Device Card Timers"
Cohesion: 0.12
Nodes (6): AuDeviceCard, customElement, state, auDebug(), DomainControlModel, isEntityOffline()

### Community 13 - "Card Custom Elements"
Cohesion: 0.18
Nodes (16): lit, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, SeverityLevel, hasEntityChanged() (+8 more)

### Community 14 - "Action Utilities"
Cohesion: 0.12
Nodes (29): collectRoomToggleEntities(), entityIdFromHomeCard(), entityIsOn(), isToggleDomain(), resolveRoomControls(), roomControlEntities(), BulkOffResult, bulkTurnOff() (+21 more)

### Community 15 - "Card Editor Schemas"
Cohesion: 0.15
Nodes (12): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, HTMLElementTagNameMap, climateCardEditorLabels, climateCardEditorSchema, AuLightCardEditor (+4 more)

### Community 16 - "Temp Stepper Control"
Cohesion: 0.14
Nodes (3): AuTempStepper, customElement, property

### Community 17 - "Demo Dashboard Docs"
Cohesion: 0.06
Nodes (45): Atrium Home demo dashboard, Demo Main floor (Living/Kitchen/Utility), Demo multi_entity All living lights, Demo au-shell-grid Home config, Action Card, AtriumUI, Action Card (custom:au-action-card), AuActionCardBase (+37 more)

### Community 19 - "Home Edit Commit"
Cohesion: 0.24
Nodes (6): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector

### Community 20 - "au-shell-grid.ts"
Cohesion: 0.18
Nodes (13): DragState, GridItem, HTMLElementTagNameMap, walkAncestors(), applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem (+5 more)

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
Cohesion: 0.16
Nodes (23): CardEditorMode, HTMLElementTagNameMap, NavView, commitHomeEditToFloors(), commitRoomEditToFloors(), beginHomeEditDraft(), beginRoomEditDraft(), emptyEditSessionDraft() (+15 more)

### Community 26 - "Card Picker Helpers"
Cohesion: 0.33
Nodes (6): keywords, custom-card, design-system, hacs, home-assistant, lovelace

### Community 27 - "Sensor Card"
Cohesion: 0.22
Nodes (8): CustomCardEntry, HassArea, HassDevice, HassEntityAttributeBase, HassFloor, HassThemes, HassUser, Window

### Community 29 - "Room Tile Controls"
Cohesion: 0.24
Nodes (7): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, homeAwareCardConfig(), RoomTileCardConfigInput, AuHomeEntityConfig, AuHomeRoomConfig

### Community 30 - "Device Card Editor"
Cohesion: 0.23
Nodes (11): AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuActionCardConfig, AuGridItemLayout, AuSeverityThresholds, AuDeviceCardConfig, AuDeviceDomain (+3 more)

### Community 31 - "Base Card Lifecycle"
Cohesion: 0.29
Nodes (6): 1. Executive Summary & Project Health Dashboard, 2. Key Findings Matrix, 3. Step-by-Step Action Plan, HAD / AtriumUI — Master Assessment, Projected Impact (relative), The Bottom Line

### Community 32 - "Light Slider Tests"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 33 - "Sensor Card Editor"
Cohesion: 0.10
Nodes (6): AuShellGrid, customElement, property, query, state, Lovelace

### Community 35 - "device.ts"
Cohesion: 0.29
Nodes (7): HomeAssistant, getWaterHeaterTemperature(), setWaterHeaterTemperature(), turnOffWaterHeater(), turnOnWaterHeater(), validateWaterHeaterEntity(), WaterHeaterCapabilities

### Community 36 - ".callService"
Cohesion: 0.20
Nodes (14): runVacuumPause(), runVacuumReturn(), runVacuumStop(), ACTIVE_STATES, getVacuumCapabilities(), isVacuumActive(), isVacuumDomain(), pauseVacuum() (+6 more)

### Community 37 - "water-heater-timer.ts"
Cohesion: 0.33
Nodes (8): clampTimerMinutes(), clearTimerEndsAt(), formatTimerRemaining(), normalizeTimerPresets(), readTimerEndsAt(), storageKey(), WH_TIMER_DEFAULT_PRESETS, writeTimerEndsAt()

### Community 38 - "au-climate-card-editor.ts"
Cohesion: 0.12
Nodes (9): fallbackCustomCardEntries(), EntityOption, renderAddCardModal(), renderAddRoomModal(), renderCardEditorModal(), renderHomeAddChooser(), resolveDeviceDisplayName(), ClockFormat (+1 more)

### Community 39 - "HomeAssistant"
Cohesion: 0.25
Nodes (3): AuBaseCard, property, state

### Community 40 - "files"
Cohesion: 0.50
Nodes (4): files, dist, hacs.json, README.md

### Community 41 - "AuActionCardEditor"
Cohesion: 0.14
Nodes (13): AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels, roomCardEditorSchema, AuBaseEditor, property, state (+5 more)

### Community 42 - "AuClimateCardEditor"
Cohesion: 0.06
Nodes (49): AuCalendarCard, AuCalendarCardEditor, HTMLElementTagNameMap, customElement, HTMLElementTagNameMap, customElement, state, VIEW_KEYS (+41 more)

### Community 43 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

### Community 46 - "au-light-slider.ts"
Cohesion: 0.12
Nodes (12): cardTag(), cardTypeHasEditor(), createChildCard(), getCardEditorElement(), stubConfigForCardType(), attachChildToHost(), ChildCardMaps, mountChildCard() (+4 more)

### Community 47 - "AuClimateSelectors"
Cohesion: 0.17
Nodes (7): AuClimateSelectors, customElement, property, state, formatFanModeLabel(), getFanModeIcon(), getHvacModeIcon()

### Community 49 - "AuSensorCard"
Cohesion: 0.18
Nodes (4): AuSensorCard, clamp(), customElement, AuSensorCardConfig

### Community 50 - "grid-engine.ts"
Cohesion: 0.37
Nodes (14): clampToColumns(), collides(), compact(), deriveResponsiveLayout(), displayColumnsForWidth(), findFreeSlot(), getFirstCollision(), normalizeLayout() (+6 more)

### Community 51 - "._detectHaDashboardEditing"
Cohesion: 0.46
Nodes (6): HassEntityRegistryEntry, discoverFloorsFromAreas(), entitiesForArea(), mergeAreaEntities(), normalizeFloors(), slugify()

### Community 52 - "au-climate-selectors.ts"
Cohesion: 0.16
Nodes (5): HTMLElementTagNameMap, SelectorPanel, bindStopBubble(), stopPropagation(), unbindStopBubble()

### Community 53 - ".render"
Cohesion: 0.16
Nodes (3): gridRowCount(), resolveRowTrackCount(), shouldDistributeRowHeight()

### Community 54 - "au-light-slider.ts"
Cohesion: 0.28
Nodes (8): AuLightSliderVariant, HTMLElementTagNameMap, AuTempControlMode, HTMLElementTagNameMap, clamp(), snapToStep(), valueFromClientX(), mountSlider()

### Community 55 - "AuLightSlider"
Cohesion: 0.29
Nodes (3): AuLightSlider, customElement, property

### Community 56 - "home-edit-room-modal.ts"
Cohesion: 0.20
Nodes (7): EditRoomAddCandidate, EditRoomDraft, EditRoomModalHandlers, EditRoomModalProps, moveEditRoomMember(), renderEditRoomModal(), toggleEditRoomEntity()

## Knowledge Gaps
- **192 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `name` (+187 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuShellHomeView` connect `Home Edit Session` to `device.ts`, `home-drag-resize.ts`, `au-climate-card-editor.ts`, `Device Card Timers`, `au-light-slider.ts`, `Action Utilities`, `Room Card Editor`, `au-shell-grid.ts`, `home-edit-room-modal.ts`, `Localization i18n`, `Grid Item Rendering`, `Room Tile Controls`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `lit` connect `Card Custom Elements` to `Climate Card`, `Action Card Base`, `Light Card`, `au-climate-card-editor.ts`, `AuActionCardEditor`, `AuClimateCardEditor`, `Card Editor Schemas`, `Home Edit Commit`, `au-climate-selectors.ts`, `au-shell-grid.ts`, `au-light-slider.ts`, `home-edit-room-modal.ts`, `Localization i18n`, `Card Picker Helpers`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `HomeAssistant` connect `device.ts` to `Home View Grid Layout`, `Card Registry Types`, `Device Domain Controls`, `Climate Card`, `Action Card Base`, `Light Card`, `Home Edit Session`, `Card Custom Elements`, `Action Utilities`, `Localization i18n`, `Sensor Card`, `.callService`, `au-climate-card-editor.ts`, `HomeAssistant`, `AuActionCardEditor`, `AuClimateCardEditor`, `au-light-slider.ts`, `._detectHaDashboardEditing`, `home-edit-room-modal.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _192 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home View Grid Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.14193548387096774 - nodes in this community are weakly interconnected._
- **Should `Card Registry Types` be split into smaller, more focused modules?**
  _Cohesion score 0.07832080200501253 - nodes in this community are weakly interconnected._
- **Should `Climate Card` be split into smaller, more focused modules?**
  _Cohesion score 0.08907103825136611 - nodes in this community are weakly interconnected._