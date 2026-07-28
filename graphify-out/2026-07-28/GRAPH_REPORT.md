# Graph Report - HAD  (2026-07-23)

## Corpus Check
- 179 files · ~93,205 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1554 nodes · 4531 edges · 73 communities (66 shown, 7 thin omitted)
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

## Communities (73 total, 7 thin omitted)

### Community 0 - "Home View Grid Layout"
Cohesion: 0.15
Nodes (4): AuClimateSelectors, customElement, property, state

### Community 1 - "Card Registry Types"
Cohesion: 0.19
Nodes (12): makeCalendarHass(), renderClimateCard(), renderCoverCard(), renderDeviceCard(), renderFanCard(), renderLightCard(), renderRoomCard(), renderSwitchCard() (+4 more)

### Community 2 - "Device Domain Controls"
Cohesion: 0.14
Nodes (11): AuCalendarCardEditor, HTMLElementTagNameMap, customElement, calendarCardEditorLabels, calendarCardEditorSchema, AuCalendarCardConfig, AuCalendarEntityConfig, AuCalendarTimezoneMode (+3 more)

### Community 3 - "Climate Card"
Cohesion: 0.13
Nodes (28): HTMLElementTagNameMap, HvacMode, asNumber(), asStringList(), clamp(), ClimateCapabilities, formatFanModeLabel(), formatHvacModeLabel() (+20 more)

### Community 4 - "Action Card Base"
Cohesion: 0.06
Nodes (16): AuActionCardBase, humanize(), eventOptions, ActionConfig, defaultDoubleTapAction(), defaultHoldAction(), defaultTapAction(), resolveAction() (+8 more)

### Community 5 - "Light Card"
Cohesion: 0.08
Nodes (36): AuLightCard, HTMLElementTagNameMap, customElement, state, createDebounced(), isLightCardCompact(), clamp(), formatBrightnessLabel() (+28 more)

### Community 6 - "home-drag-resize.ts"
Cohesion: 0.10
Nodes (34): CardEditorMode, HTMLElementTagNameMap, NavView, applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag() (+26 more)

### Community 7 - "Room Card"
Cohesion: 0.10
Nodes (7): AuRoomCard, customElement, eventOptions, AuRoomCardEntityConfig, activateOnce(), markActivated(), recentActivate

### Community 8 - "TypeScript Compiler Config"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, compilerOptions, alwaysStrict, declaration, declarationDir, emitDeclarationOnly (+34 more)

### Community 9 - "Package Dependencies"
Cohesion: 0.12
Nodes (17): eslint, jsdom, devDependencies, eslint, jsdom, prettier, @types/node, typescript (+9 more)

### Community 10 - "Home Edit Session"
Cohesion: 0.05
Nodes (17): AuShellHomeView, customElement, property, query, state, addEditRoomMember(), buildEditRoomDraft(), controlsFromEditDraft() (+9 more)

### Community 11 - "Device Card Timers"
Cohesion: 0.12
Nodes (7): AuDeviceCard, customElement, state, isDeviceActive(), runPrimaryDeviceAction(), DomainControlModel, isEntityOffline()

### Community 13 - "Card Custom Elements"
Cohesion: 0.22
Nodes (15): lit, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, ActionSurfaceOptions, AuCardContent (+7 more)

### Community 14 - "Action Utilities"
Cohesion: 0.15
Nodes (28): DragState, HTMLElementTagNameMap, applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem, clampToColumns(), collides() (+20 more)

### Community 15 - "Card Editor Schemas"
Cohesion: 0.13
Nodes (17): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, HTMLElementTagNameMap, climateCardEditorLabels, climateCardEditorSchema, HTMLElementTagNameMap (+9 more)

### Community 16 - "Temp Stepper Control"
Cohesion: 0.14
Nodes (3): AuTempStepper, customElement, property

### Community 17 - "Demo Dashboard Docs"
Cohesion: 0.05
Nodes (49): Atrium Home demo dashboard, Demo Main floor (Living/Kitchen/Utility), Demo multi_entity All living lights, Demo au-shell-grid Home config, Action Card, AtriumUI, Action Card (custom:au-action-card), AuActionCardBase (+41 more)

### Community 18 - "Room Card Editor"
Cohesion: 0.13
Nodes (14): AuCoverCard, customElement, state, closeCover(), COVER_SUPPORT, CoverCapabilities, formatCoverSecondary(), getCoverCapabilities() (+6 more)

### Community 19 - "Home Edit Commit"
Cohesion: 0.16
Nodes (4): AuClimateCard, customElement, state, HassEntity

### Community 20 - "au-shell-grid.ts"
Cohesion: 0.11
Nodes (8): EntityOption, renderAddCardModal(), renderAddEntityModal(), renderAddRoomModal(), renderCardEditorModal(), renderHomeAddChooser(), resolveDeviceDisplayName(), item()

### Community 21 - "Light Slider Control"
Cohesion: 0.20
Nodes (21): HTMLElementTagNameMap, VIEW_KEYS, buildMonthGrid(), CallServiceWithResponse, compileFilter(), computeFetchWindow(), endOfLocalDay(), fetchCalendarEvents() (+13 more)

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
Nodes (12): HTMLElementTagNameMap, AuBaseCard, hasEntityChanged(), property, state, HomeAssistant, entityFingerprint(), getRootHass() (+4 more)

### Community 26 - "Card Picker Helpers"
Cohesion: 0.33
Nodes (6): keywords, custom-card, design-system, hacs, home-assistant, lovelace

### Community 27 - "Sensor Card"
Cohesion: 0.17
Nodes (18): AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuClimateCardConfig, HvacAction, AuActionCardConfig, AuGridItemLayout, AuSeverityThresholds (+10 more)

### Community 28 - "Grid Item Rendering"
Cohesion: 0.20
Nodes (15): FAN_SUPPORT, FanCapabilities, formatFanSecondary(), formatFanSpeedLabel(), getFanCapabilities(), getFanPercentage(), getFanPresetMode(), getFanSpeedIcon() (+7 more)

### Community 29 - "Room Tile Controls"
Cohesion: 0.31
Nodes (8): en, TranslationKey, he, isRtlLanguage(), normalizeLanguage(), RTL_LANGUAGES, TABLES, ru

### Community 30 - "Device Card Editor"
Cohesion: 0.22
Nodes (4): AuVacuumSettingsOverlay, customElement, property, state

### Community 31 - "Base Card Lifecycle"
Cohesion: 0.29
Nodes (6): 1. Executive Summary & Project Health Dashboard, 2. Key Findings Matrix, 3. Step-by-Step Action Plan, HAD / AtriumUI — Master Assessment, Projected Impact (relative), The Bottom Line

### Community 32 - "Light Slider Tests"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 33 - "Sensor Card Editor"
Cohesion: 0.06
Nodes (9): AuShellGrid, customElement, property, query, state, walkAncestors(), ensureCardPickerLoaded(), shouldDistributeRowHeight() (+1 more)

### Community 35 - "device.ts"
Cohesion: 0.18
Nodes (11): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, homeAwareCardConfig(), RoomTileCardConfigInput, AuHomeEntityConfig, AuHomeRoomConfig, discoverFloorsFromAreas() (+3 more)

### Community 36 - "areas.ts"
Cohesion: 0.30
Nodes (8): collectRoomToggleEntities(), entityIdFromHomeCard(), entityIsOn(), isToggleDomain(), resolveRoomControls(), roomControlEntities(), controlIcon(), entityDisplayOn()

### Community 37 - "water-heater-timer.ts"
Cohesion: 0.18
Nodes (5): AuFanCard, customElement, state, getFanDirection(), isFanOscillating()

### Community 39 - "HomeAssistant"
Cohesion: 0.12
Nodes (24): clamp(), HTMLElementTagNameMap, SeverityLevel, BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), BULK_OFF_DOMAINS, computeDomain() (+16 more)

### Community 40 - "files"
Cohesion: 0.50
Nodes (4): files, dist, hacs.json, README.md

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
Cohesion: 0.19
Nodes (11): cardTag(), cardTypeHasEditor(), createChildCard(), fallbackCustomCardEntries(), getCardEditorElement(), stubConfigForCardType(), attachChildToHost(), ChildCardMaps (+3 more)

### Community 47 - "AuClimateSelectors"
Cohesion: 0.22
Nodes (7): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector, SUPPORTED_DEVICE_DOMAIN_LIST

### Community 48 - "ensureCardPickerLoaded"
Cohesion: 0.21
Nodes (13): actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS, BLOCKED_HOMEASSISTANT_SERVICES, executeAction(), fireMoreInfo(), isAllowedServiceCall(), isSafeActionUrl() (+5 more)

### Community 49 - "AuSensorCard"
Cohesion: 0.14
Nodes (12): AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels, roomCardEditorSchema, HTMLElementTagNameMap, DEFAULT_HOME_FLOORS, HTMLElementTagNameMap (+4 more)

### Community 50 - "grid-engine.ts"
Cohesion: 0.27
Nodes (10): buildVacuumDeviceCatalog(), classifyVacuumSection(), ESSENTIAL_SUFFIXES, filterCatalogSections(), isEnabledRegistryEntry(), isEssential(), pickMapCamera(), suffixOf() (+2 more)

### Community 51 - "activateOnce"
Cohesion: 0.06
Nodes (17): AuActionCardEditor, customElement, AuClimateCardEditor, customElement, AuFanCardEditor, customElement, AuSensorCardEditor, HTMLElementTagNameMap (+9 more)

### Community 52 - "._renderChildCard"
Cohesion: 0.11
Nodes (20): AuVacuumCard, customElement, AuVacuumSettingsOpenOptions, ensureVacuumSettingsOverlay(), HTMLElementTagNameMap, SECTION_TABS, AuVacuumSettingsSection, ACTIVE_STATES (+12 more)

### Community 53 - "AuActionCardEditor"
Cohesion: 0.25
Nodes (3): GridItem, GridItemLike, GridPos

### Community 54 - ".render"
Cohesion: 0.13
Nodes (13): HTMLElementTagNameMap, SelectorPanel, AuLightSliderVariant, HTMLElementTagNameMap, AuTempControlMode, HTMLElementTagNameMap, clamp(), snapToStep() (+5 more)

### Community 55 - "home-assistant.ts"
Cohesion: 0.26
Nodes (3): AuLightSlider, customElement, property

### Community 56 - "format-clock.ts"
Cohesion: 0.20
Nodes (10): ClockDateFormat, ClockDayFormat, ClockFormat, formatClockDate(), formatClockWeekday(), formatToolbarClock(), ToolbarClockOptions, formatGreeting() (+2 more)

### Community 57 - "._renderVacuumControls"
Cohesion: 0.17
Nodes (6): AuActionCard, customElement, CARDS, ActionCardInternals, makeActionCard(), renderActionCard()

### Community 58 - "au-switch-card-editor.ts"
Cohesion: 0.28
Nodes (11): DomainControlKind, DomainControlVisibility, resolveDomainControl(), runWaterHeaterTemperature(), getWaterHeaterCapabilities(), getWaterHeaterTemperature(), setWaterHeaterTemperature(), turnOffWaterHeater() (+3 more)

### Community 59 - "@eslint/js"
Cohesion: 0.22
Nodes (4): AuFanSpeedSelector, customElement, property, state

### Community 60 - "AuCoverCardEditor"
Cohesion: 0.28
Nodes (5): AuCoverCardEditor, HTMLElementTagNameMap, customElement, coverCardEditorLabels, coverCardEditorSchema

### Community 61 - "AuLightCardEditor"
Cohesion: 0.29
Nodes (3): entityLabel(), VacuumCatalogEntry, pressVacuumButton()

### Community 63 - "fireEvent"
Cohesion: 0.19
Nodes (8): FakeCard, FakeEditor, HomeViewTestApi, renderShell(), roomTileCard(), roomTileChips(), roomTileHost(), waitForRoomTileCard()

### Community 64 - "._findClosestLovelace"
Cohesion: 0.17
Nodes (4): AuSensorCard, customElement, AuSensorCardConfig, renderSensorCard()

### Community 65 - "LovelaceCardEditor"
Cohesion: 0.41
Nodes (9): HTMLElementTagNameMap, clampTimerMinutes(), clearTimerEndsAt(), formatTimerRemaining(), normalizeTimerPresets(), readTimerEndsAt(), storageKey(), WH_TIMER_DEFAULT_PRESETS (+1 more)

### Community 66 - "device.ts"
Cohesion: 0.35
Nodes (9): DEDICATED_CARD_DOMAINS, DeviceCapabilities, EXPLICIT_ON_OFF_DOMAINS, getDeviceCapabilities(), isSupportedDeviceDomain(), resolveCardTypeForEntity(), slugify(), usesExplicitOnOff() (+1 more)

### Community 68 - "home-assistant.ts"
Cohesion: 0.20
Nodes (9): CustomCardEntry, HassArea, HassDevice, HassEntityAttributeBase, HassEntityRegistryEntry, HassFloor, HassThemes, HassUser (+1 more)

### Community 69 - "au-light-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuLightCardEditor, HTMLElementTagNameMap, customElement, lightCardEditorLabels, lightCardEditorSchema

### Community 70 - "._renderSectionBody"
Cohesion: 0.33
Nodes (3): entriesForSection(), roomDisplayName(), VacuumDeviceCatalog

## Knowledge Gaps
- **219 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `name` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuShellHomeView` connect `Home Edit Session` to `Sensor Card Editor`, `device.ts`, `areas.ts`, `home-drag-resize.ts`, `HomeAssistant`, `AuActionCardEditor`, `Action Utilities`, `au-light-slider.ts`, `au-shell-grid.ts`, `AuActionCardEditor`, `format-clock.ts`, `Localization i18n`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `lit` connect `Card Custom Elements` to `Device Domain Controls`, `Climate Card`, `Light Card`, `home-drag-resize.ts`, `Home Edit Session`, `Action Utilities`, `Card Editor Schemas`, `au-shell-grid.ts`, `Light Slider Control`, `Localization i18n`, `Card Picker Helpers`, `HomeAssistant`, `AuClimateSelectors`, `AuSensorCard`, `activateOnce`, `._renderChildCard`, `.render`, `AuCoverCardEditor`, `LovelaceCardEditor`, `au-light-card-editor.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `HomeAssistant` connect `Localization i18n` to `Card Registry Types`, `Climate Card`, `Light Card`, `home-drag-resize.ts`, `Home Edit Session`, `Room Card Editor`, `au-shell-grid.ts`, `Light Slider Control`, `Grid Item Rendering`, `Device Card Editor`, `device.ts`, `HomeAssistant`, `au-light-slider.ts`, `ensureCardPickerLoaded`, `AuSensorCard`, `grid-engine.ts`, `activateOnce`, `._renderChildCard`, `au-switch-card-editor.ts`, `device.ts`, `home-assistant.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Device Domain Controls` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
- **Should `Climate Card` be split into smaller, more focused modules?**
  _Cohesion score 0.13076923076923078 - nodes in this community are weakly interconnected._
- **Should `Action Card Base` be split into smaller, more focused modules?**
  _Cohesion score 0.06127946127946128 - nodes in this community are weakly interconnected._