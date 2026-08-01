# Graph Report - .  (2026-08-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1608 nodes · 4349 edges · 72 communities (64 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `36ab8738`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AuShellHomeView
- light.ts
- AuTempStepper
- au-fan-card.ts
- AuActionCardBase
- AuRoomCard
- home-edit-room-modal.ts
- AuShellGrid
- compilerOptions
- config.ts
- index.ts
- au-cover-card.ts
- AuHomeEntityConfig
- AuCalendarCard
- HassEntity
- computeDomain
- HomeAssistant
- au-calendar-card-editor.ts
- ._renderHomeView
- grid-engine.ts
- home-child-config.ts
- Card Contract Feature
- au-shell-home-view.ts
- home-drag-resize.ts
- au-shell-grid.ts
- Distribution and HACS Feature
- device.ts
- AuDeviceCard
- au-vacuum-card.ts
- au-vacuum-settings-overlay.ts
- AuVacuumSettingsOverlay
- ._placeFloorCard
- PRD Decision Log D1-D14
- create-child-card.ts
- devDependencies
- tokens.ts
- home-assistant.ts
- Edit Mode
- ._resolvedFloors
- au-shell-grid-home.test.ts
- au-shell-grid
- Home Tiles
- compilerOptions
- action-tile-layout.ts
- Architecture Specification
- au-device-card-editor.ts
- Design System Feature Feature
- au-climate-card-editor.ts
- VacuumSettingsDraft
- .render
- package.json
- AuBaseEditor
- au-room-card-editor.ts
- AuSensorCard
- water-heater-timer.ts
- scripts
- au-action-card-editor.ts
- au-cover-card-editor.ts
- au-fan-card-editor.ts
- au-switch-card-editor.ts
- au-vacuum-card-editor.ts
- Phase 2 Security and Runtime
- keywords
- .prettierrc.json
- files
- light-card-layout.ts
- @eslint/js

## God Nodes (most connected - your core abstractions)
1. `AuShellHomeView` - 141 edges
2. `HassEntity` - 89 edges
3. `AuShellGrid` - 62 edges
4. `AuActionCardBase` - 57 edges
5. `computeDomain()` - 57 edges
6. `AuVacuumSettingsOverlay` - 44 edges
7. `lit` - 43 edges
8. `LovelaceCardConfig` - 41 edges
9. `isEntityOffline()` - 38 edges
10. `AuDeviceCard` - 35 edges

## Surprising Connections (you probably didn't know these)
- `AuDeviceCard` --implements--> `Device Card`  [EXTRACTED]
  src/card/device-card/au-device-card.ts → docs/prd/product/device-card.md
- `AuSensorCard` --implements--> `Sensor Card`  [EXTRACTED]
  src/card/sensor-card/au-sensor-card.ts → docs/prd/product/sensor-card.md
- `AuVacuumCard` --implements--> `Vacuum Card`  [EXTRACTED]
  src/card/vacuum-card/au-vacuum-card.ts → docs/prd/product/vacuum-card.md
- `AuVacuumSettingsOverlay` --implements--> `Vacuum Settings Overlay`  [EXTRACTED]
  src/card/vacuum-card/au-vacuum-settings-overlay.ts → docs/prd/product/vacuum-card.md
- `AuActionCardBase` --implements--> `Card Contract Feature`  [EXTRACTED]
  src/core/action-card.ts → docs/prd/platform/card-contract.md

## Import Cycles
- None detected.

## Communities (72 total, 8 thin omitted)

### Community 0 - "AuShellHomeView"
Cohesion: 0.06
Nodes (7): Phase 3-4 Product Backlog, Session Follow-ups, AuShellHomeView, customElement, property, query, state

### Community 1 - "light.ts"
Cohesion: 0.06
Nodes (39): AuLightCard, HTMLElementTagNameMap, customElement, state, AuSwitchCard, customElement, createDebounced(), isEntityOffline() (+31 more)

### Community 2 - "AuTempStepper"
Cohesion: 0.06
Nodes (17): AuLightSlider, AuLightSliderVariant, HTMLElementTagNameMap, customElement, property, AuTempControlMode, AuTempStepper, HTMLElementTagNameMap (+9 more)

### Community 3 - "au-fan-card.ts"
Cohesion: 0.08
Nodes (26): AuFanCard, HTMLElementTagNameMap, customElement, state, AuFanSpeedSelector, HTMLElementTagNameMap, customElement, property (+18 more)

### Community 4 - "AuActionCardBase"
Cohesion: 0.05
Nodes (33): ActionSurfaceOptions, AuActionCardBase, humanize(), eventOptions, ActionConfig, actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS (+25 more)

### Community 5 - "AuRoomCard"
Cohesion: 0.11
Nodes (4): AuRoomCard, customElement, eventOptions, AuRoomCardEntityConfig

### Community 6 - "home-edit-room-modal.ts"
Cohesion: 0.12
Nodes (11): addEditRoomMember(), buildEditRoomDraft(), controlsFromEditDraft(), EditRoomAddCandidate, EditRoomDraft, EditRoomModalHandlers, moveEditRoomMember(), renderEditRoomModal() (+3 more)

### Community 7 - "AuShellGrid"
Cohesion: 0.09
Nodes (5): AuShellGrid, customElement, property, query, state

### Community 8 - "compilerOptions"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, compilerOptions, alwaysStrict, declaration, declarationDir, emitDeclarationOnly (+34 more)

### Community 9 - "config.ts"
Cohesion: 0.06
Nodes (37): AuShellGridEditor, DEFAULT_HOME_FLOORS, HTMLElementTagNameMap, customElement, applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem (+29 more)

### Community 10 - "index.ts"
Cohesion: 0.14
Nodes (17): Design Tokens, lit, AuActionCard, HTMLElementTagNameMap, customElement, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap (+9 more)

### Community 11 - "au-cover-card.ts"
Cohesion: 0.10
Nodes (23): AuCoverCard, HTMLElementTagNameMap, customElement, state, closeCover(), COVER_SUPPORT, CoverCapabilities, formatCoverSecondary() (+15 more)

### Community 12 - "AuHomeEntityConfig"
Cohesion: 0.16
Nodes (11): RoomTileCardConfigInput, beginHomeEditDraft(), beginRoomEditDraft(), emptyEditSessionDraft(), HomeEditSessionDraft, buildHomeEditItems(), buildHomeFloorGridItems(), buildRoomGridItems() (+3 more)

### Community 13 - "AuCalendarCard"
Cohesion: 0.05
Nodes (56): hass.language Locale Source, Hebrew RTL Support, Localize Catalogs (en/ru/he), Localize, AuCalendarCard, HTMLElementTagNameMap, customElement, state (+48 more)

### Community 14 - "HassEntity"
Cohesion: 0.05
Nodes (44): AuClimateCard, HTMLElementTagNameMap, customElement, state, AuClimateSelectors, HTMLElementTagNameMap, SelectorPanel, customElement (+36 more)

### Community 15 - "computeDomain"
Cohesion: 0.15
Nodes (21): clamp(), BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), BULK_OFF_DOMAINS, computeDomain(), computeEntityName(), defaultToggleService() (+13 more)

### Community 16 - "HomeAssistant"
Cohesion: 0.13
Nodes (13): AuBaseCard, hasEntityChanged(), property, state, EditRoomModalProps, HomeAssistant, entityFingerprint(), getRootHass() (+5 more)

### Community 17 - "au-calendar-card-editor.ts"
Cohesion: 0.19
Nodes (7): AuCalendarCardEditor, HTMLElementTagNameMap, customElement, calendarCardEditorLabels, calendarCardEditorSchema, AuCalendarCardConfig, AuCalendarEntityConfig

### Community 18 - "._renderHomeView"
Cohesion: 0.14
Nodes (7): fallbackCustomCardEntries(), EntityOption, renderAddCardModal(), renderAddEntityModal(), renderAddRoomModal(), renderCardEditorModal(), renderHomeAddChooser()

### Community 19 - "grid-engine.ts"
Cohesion: 0.29
Nodes (15): clampToColumns(), collides(), compact(), deriveResponsiveLayout(), findFreeSlot(), getFirstCollision(), gridRowCount(), normalizeLayout() (+7 more)

### Community 20 - "home-child-config.ts"
Cohesion: 0.24
Nodes (13): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, homeAwareCardConfig(), resolveCardTypeForEntity(), CARD_TYPE_LOCKED_KEY, cardTypeShort(), isRemappableAuCardType() (+5 more)

### Community 21 - "Card Contract Feature"
Cohesion: 0.09
Nodes (27): Card Contract Feature, Action Card, custom:au-action-card, AuActionCardBase, Action Card Content Layout, Calendar Card, Calendar Views (agenda/today/week/month), calendar.get_events API (+19 more)

### Community 22 - "au-shell-home-view.ts"
Cohesion: 0.26
Nodes (11): CardEditorMode, HTMLElementTagNameMap, NavView, homeViewStyles, collectRoomToggleEntities(), entityIsOn(), isToggleDomain(), resolveRoomControls() (+3 more)

### Community 23 - "home-drag-resize.ts"
Cohesion: 0.17
Nodes (20): computeRowTrackHeightPx(), moveItem(), applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag(), beginPointerResize() (+12 more)

### Community 24 - "au-shell-grid.ts"
Cohesion: 0.15
Nodes (10): DragState, GridItem, HTMLElementTagNameMap, walkAncestors(), ensureCardPickerLoaded(), displayColumnsForWidth(), GridItemLike, GridPos (+2 more)

### Community 25 - "Distribution and HACS Feature"
Cohesion: 0.38
Nodes (7): Locked Architecture Constraints C1-C12, Install and Lovelace Resource Ops, npm run dev:ha, Local Dev Against Home Assistant, Distribution and HACS Feature, Healthy Reuse Guardrails, HACS Installation

### Community 26 - "device.ts"
Cohesion: 0.20
Nodes (12): DEDICATED_CARD_DOMAINS, DeviceCapabilities, EXPLICIT_ON_OFF_DOMAINS, getDeviceCapabilities(), isDeviceActive(), isSupportedDeviceDomain(), resolveDeviceDisplayName(), runPrimaryDeviceAction() (+4 more)

### Community 27 - "AuDeviceCard"
Cohesion: 0.11
Nodes (8): AuDeviceCard, customElement, state, DomainControlKind, DomainControlModel, DomainControlVisibility, resolveDomainControl(), runWaterHeaterTemperature()

### Community 28 - "au-vacuum-card.ts"
Cohesion: 0.13
Nodes (16): AuVacuumCard, HTMLElementTagNameMap, customElement, ACTIVE_STATES, formatVacuumSecondary(), getVacuumCapabilities(), isVacuumActive(), isVacuumDomain() (+8 more)

### Community 29 - "au-vacuum-settings-overlay.ts"
Cohesion: 0.15
Nodes (21): AuVacuumSettingsOpenOptions, ensureVacuumSettingsOverlay(), HTMLElementTagNameMap, SECTION_TABS, AuVacuumSettingsSection, buildVacuumDeviceCatalog(), classifyVacuumSection(), entityLabel() (+13 more)

### Community 30 - "AuVacuumSettingsOverlay"
Cohesion: 0.17
Nodes (6): AuVacuumSettingsOverlay, customElement, property, state, roomDisplayName(), VacuumDeviceCatalog

### Community 32 - "PRD Decision Log D1-D14"
Cohesion: 0.33
Nodes (7): D10 Action Safety, D2 One Shell Card, D7 Priority Order, PRD Decision Log D1-D14, executeAction Validation Requirement, Unvalidated executeAction Finding, Assessment Priority Order

### Community 33 - "create-child-card.ts"
Cohesion: 0.19
Nodes (9): cardTag(), cardTypeHasEditor(), createChildCard(), getCardEditorElement(), stubConfigForCardType(), attachChildToHost(), ChildCardMaps, pruneChildCards() (+1 more)

### Community 34 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, jsdom, devDependencies, eslint, jsdom, prettier, @types/node, typescript (+9 more)

### Community 35 - "tokens.ts"
Cohesion: 0.25
Nodes (4): AuSensorCardEditor, HTMLElementTagNameMap, customElement, auCardSurface

### Community 36 - "home-assistant.ts"
Cohesion: 0.17
Nodes (14): CustomCardEntry, HassArea, HassDevice, HassEntityAttributeBase, HassEntityRegistryEntry, HassFloor, HassThemes, HassUser (+6 more)

### Community 37 - "Edit Mode"
Cohesion: 0.40
Nodes (5): Vacuum Settings Overlay, config-persist, Edit Mode Draft/Commit Discipline, Edit Mode, home-edit-commit

### Community 40 - "au-shell-grid-home.test.ts"
Cohesion: 0.17
Nodes (9): FakeCard, FakeEditor, HomeViewTestApi, renderIdleHome(), renderShell(), roomTileCard(), roomTileChips(), roomTileHost() (+1 more)

### Community 41 - "au-shell-grid"
Cohesion: 0.23
Nodes (12): Atrium Home Dashboard Demo, Architecture Card Contract, Architecture Domain Card Mapping, Home Rooms Mode, AtriumUI, au-shell-grid, Native Lovelace Card Lifecycle, Domain to Card Mapping (+4 more)

### Community 42 - "Home Tiles"
Cohesion: 0.24
Nodes (10): custom:au-room-card, Room Card, Shell Room Controls, Sensor Home Variant Path, Sensor Linear Gauge, Sensor Card, Sensor Severity Thresholds, auHomeTileStyles (+2 more)

### Community 43 - "compilerOptions"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, compilerOptions, declaration, declarationDir, emitDeclarationOnly, noEmit, sourceMap, exclude (+6 more)

### Community 46 - "Architecture Specification"
Cohesion: 0.26
Nodes (15): CI Workflow, CI Verify Job, Architecture Specification, Lovelace Design System Principle, npm run verify, Shell Modes Classic and Home, Room Idle Timeout, Phase 0 Shipped Spine (+7 more)

### Community 47 - "au-device-card-editor.ts"
Cohesion: 0.22
Nodes (7): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector, SUPPORTED_DEVICE_DOMAIN_LIST

### Community 49 - "au-climate-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuClimateCardEditor, HTMLElementTagNameMap, customElement, climateCardEditorLabels, climateCardEditorSchema

### Community 50 - "VacuumSettingsDraft"
Cohesion: 0.15
Nodes (4): applyVacuumDraft(), pressVacuumButton(), VacuumDraftValue, VacuumSettingsDraft

### Community 52 - "package.json"
Cohesion: 0.17
Nodes (11): author, dependencies, lit, description, license, main, module, name (+3 more)

### Community 53 - "AuBaseEditor"
Cohesion: 0.16
Nodes (9): AuLightCardEditor, HTMLElementTagNameMap, customElement, lightCardEditorLabels, lightCardEditorSchema, AuBaseEditor, property, state (+1 more)

### Community 54 - "au-room-card-editor.ts"
Cohesion: 0.21
Nodes (7): AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels, roomCardEditorSchema, ROOM_CARD_ENTITY_DOMAINS, fireEvent()

### Community 57 - "water-heater-timer.ts"
Cohesion: 0.38
Nodes (9): clampTimerMinutes(), clearTimerEndsAt(), formatTimerRemaining(), normalizeTimerPresets(), readTimerEndsAt(), storageKey(), WH_TIMER_DEFAULT_PRESETS, writeTimerEndsAt() (+1 more)

### Community 58 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, dev:ha, format, lint, test, test:watch (+2 more)

### Community 59 - "au-action-card-editor.ts"
Cohesion: 0.24
Nodes (6): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, AuActionCardEditor, HTMLElementTagNameMap, customElement

### Community 60 - "au-cover-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuCoverCardEditor, HTMLElementTagNameMap, customElement, coverCardEditorLabels, coverCardEditorSchema

### Community 61 - "au-fan-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuFanCardEditor, HTMLElementTagNameMap, customElement, fanCardEditorLabels, fanCardEditorSchema

### Community 62 - "au-switch-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuSwitchCardEditor, HTMLElementTagNameMap, customElement, switchCardEditorLabels, switchCardEditorSchema

### Community 63 - "au-vacuum-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuVacuumCardEditor, HTMLElementTagNameMap, customElement, vacuumCardEditorLabels, vacuumCardEditorSchema

### Community 67 - "Phase 2 Security and Runtime"
Cohesion: 0.29
Nodes (7): Phase 1 Home Visual Consistency, Phase 2 Security and Runtime, Phase 3 Bundle and Perf, Phase 4 Architecture and DX, Always-On Device Timer Finding, Home Visual Drift Finding, Home Design Tokens

### Community 70 - "keywords"
Cohesion: 0.33
Nodes (6): keywords, custom-card, design-system, hacs, home-assistant, lovelace

### Community 71 - ".prettierrc.json"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 73 - "files"
Cohesion: 0.50
Nodes (4): files, dist, hacs.json, README.md

## Knowledge Gaps
- **218 isolated node(s):** `ACTION_CARD_UI_ACTIONS`, `HTMLElementTagNameMap`, `HTMLElementTagNameMap`, `HTMLElementTagNameMap`, `HTMLElementTagNameMap` (+213 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuShellHomeView` connect `AuShellHomeView` to `create-child-card.ts`, `home-edit-room-modal.ts`, `._renderChildCard`, `._resolvedFloors`, `config.ts`, `AuHomeEntityConfig`, `AuCalendarCard`, `Architecture Specification`, `HomeAssistant`, `._renderHomeView`, `au-shell-home-view.ts`, `au-shell-grid.ts`, `._placeFloorCard`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `lit` connect `index.ts` to `light.ts`, `AuTempStepper`, `au-fan-card.ts`, `AuActionCardBase`, `home-edit-room-modal.ts`, `config.ts`, `au-cover-card.ts`, `AuCalendarCard`, `HassEntity`, `HomeAssistant`, `au-calendar-card-editor.ts`, `._renderHomeView`, `au-shell-home-view.ts`, `au-shell-grid.ts`, `au-vacuum-card.ts`, `au-vacuum-settings-overlay.ts`, `tokens.ts`, `action-tile-layout.ts`, `au-device-card-editor.ts`, `au-climate-card-editor.ts`, `package.json`, `AuBaseEditor`, `au-room-card-editor.ts`, `au-action-card-editor.ts`, `au-cover-card-editor.ts`, `au-fan-card-editor.ts`, `au-switch-card-editor.ts`, `au-vacuum-card-editor.ts`, `keywords`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `HomeAssistant` connect `HomeAssistant` to `AuShellHomeView`, `light.ts`, `au-fan-card.ts`, `AuActionCardBase`, `home-edit-room-modal.ts`, `au-cover-card.ts`, `AuCalendarCard`, `HassEntity`, `computeDomain`, `._renderHomeView`, `au-shell-home-view.ts`, `device.ts`, `AuDeviceCard`, `au-vacuum-card.ts`, `au-vacuum-settings-overlay.ts`, `AuVacuumSettingsOverlay`, `create-child-card.ts`, `home-assistant.ts`, `VacuumSettingsDraft`, `AuBaseEditor`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `ACTION_CARD_UI_ACTIONS`, `HTMLElementTagNameMap`, `HTMLElementTagNameMap` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuShellHomeView` be split into smaller, more focused modules?**
  _Cohesion score 0.05505279034690799 - nodes in this community are weakly interconnected._
- **Should `light.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06406112253893623 - nodes in this community are weakly interconnected._
- **Should `AuTempStepper` be split into smaller, more focused modules?**
  _Cohesion score 0.061016949152542375 - nodes in this community are weakly interconnected._