# Graph Report - feature-calendar-fullscreen  (2026-08-01)

## Corpus Check
- 211 files · ~112,749 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1783 nodes · 5033 edges · 78 communities (72 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0bfd2ddc`
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
- ._placeFloorCard
- PRD Decision Log D1-D14
- create-child-card.ts
- devDependencies
- tokens.ts
- home-assistant.ts
- Edit Mode
- ._renderChildCard
- ._resolvedFloors
- au-shell-grid-home.test.ts
- au-shell-grid
- Home Tiles
- compilerOptions
- action-tile-layout.ts
- ._renderEntry
- Architecture Specification
- au-device-card-editor.ts
- Design System Feature Feature
- VacuumSettingsDraft
- .render
- au-room-card-editor.ts
- Feature: Card contract
- AuSensorCard
- water-heater-timer.ts
- scripts
- au-action-card-editor.ts
- au-fan-card-editor.ts
- au-switch-card-editor.ts
- Implementation: Room idle timeout
- Feature: Shell grid
- AuFanSpeedSelector
- package.json
- scripts
- keywords
- .prettierrc.json
- files
- light-card-layout.ts
- 5. UX flows
- @eslint/js
- debug.ts
- shell-grid-add-card.test.ts
- CI Verify Job
- dependencies
- typescript-eslint

## God Nodes (most connected - your core abstractions)
1. `AuShellHomeView` - 145 edges
2. `HassEntity` - 89 edges
3. `AuShellGrid` - 62 edges
4. `AuActionCardBase` - 57 edges
5. `computeDomain()` - 57 edges
6. `makeHass()` - 47 edges
7. `AuCalendarFullscreenOverlay` - 46 edges
8. `AuVacuumSettingsOverlay` - 44 edges
9. `lit` - 43 edges
10. `LovelaceCardConfig` - 41 edges

## Surprising Connections (you probably didn't know these)
- `HACS Installation` --semantically_similar_to--> `Distribution and HACS Feature`  [INFERRED] [semantically similar]
  README.md → docs/prd/platform/distribution-hacs.md
- `AuDeviceCard` --implements--> `Device Card`  [EXTRACTED]
  src/card/device-card/au-device-card.ts → docs/prd/product/device-card.md
- `AuSensorCard` --implements--> `Sensor Card`  [EXTRACTED]
  src/card/sensor-card/au-sensor-card.ts → docs/prd/product/sensor-card.md
- `AuVacuumCard` --implements--> `Vacuum Card`  [EXTRACTED]
  src/card/vacuum-card/au-vacuum-card.ts → docs/prd/product/vacuum-card.md
- `AuVacuumSettingsOverlay` --implements--> `Vacuum Settings Overlay`  [EXTRACTED]
  src/card/vacuum-card/au-vacuum-settings-overlay.ts → docs/prd/product/vacuum-card.md

## Import Cycles
- None detected.

## Communities (78 total, 6 thin omitted)

### Community 0 - "AuShellHomeView"
Cohesion: 0.05
Nodes (12): Phase 3-4 Product Backlog, Session Follow-ups, AuShellHomeView, customElement, property, query, state, emptyEditSessionDraft() (+4 more)

### Community 1 - "light.ts"
Cohesion: 0.08
Nodes (37): AuLightCard, HTMLElementTagNameMap, customElement, state, createDebounced(), getEntityBrightness(), isLightCardCompact(), clamp() (+29 more)

### Community 2 - "AuTempStepper"
Cohesion: 0.11
Nodes (12): HTMLElementTagNameMap, SelectorPanel, HTMLElementTagNameMap, AuLightSliderVariant, HTMLElementTagNameMap, AuTempControlMode, HTMLElementTagNameMap, fireEvent() (+4 more)

### Community 3 - "au-fan-card.ts"
Cohesion: 0.12
Nodes (17): AuFanCard, customElement, state, FAN_SUPPORT, FanCapabilities, formatFanSecondary(), getFanCapabilities(), getFanDirection() (+9 more)

### Community 4 - "AuActionCardBase"
Cohesion: 0.06
Nodes (16): AuActionCardBase, humanize(), eventOptions, ActionConfig, defaultDoubleTapAction(), defaultHoldAction(), defaultTapAction(), resolveAction() (+8 more)

### Community 5 - "AuRoomCard"
Cohesion: 0.06
Nodes (20): AuRoomCard, customElement, eventOptions, AuBaseCard, hasEntityChanged(), property, state, EditRoomModalProps (+12 more)

### Community 6 - "home-edit-room-modal.ts"
Cohesion: 0.09
Nodes (19): addEditRoomMember(), controlsFromEditDraft(), EditRoomAddCandidate, EditRoomDraft, EditRoomModalHandlers, moveEditRoomMember(), renderEditRoomModal(), roomEntitiesFromEditDraft() (+11 more)

### Community 7 - "AuShellGrid"
Cohesion: 0.10
Nodes (6): AuShellGrid, customElement, property, query, state, LovelaceCardEditor

### Community 8 - "compilerOptions"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, dist, node_modules, src, test, compilerOptions (+34 more)

### Community 10 - "index.ts"
Cohesion: 0.15
Nodes (28): Design Tokens, lit, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap (+20 more)

### Community 11 - "au-cover-card.ts"
Cohesion: 0.12
Nodes (15): AuCoverCard, customElement, state, closeCover(), COVER_SUPPORT, CoverCapabilities, formatCoverSecondary(), getCoverCapabilities() (+7 more)

### Community 12 - "AuHomeEntityConfig"
Cohesion: 0.22
Nodes (7): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, homeAwareCardConfig(), RoomTileCardConfigInput, AuHomeEntityConfig, AuHomeRoomConfig

### Community 13 - "AuCalendarCard"
Cohesion: 0.17
Nodes (26): HTMLElementTagNameMap, VIEW_KEYS, ensureCalendarFullscreenOverlay(), buildMonthGrid(), CallServiceWithResponse, compileFilter(), computeFetchWindow(), computeMonthGridWindow() (+18 more)

### Community 14 - "HassEntity"
Cohesion: 0.06
Nodes (35): AuClimateCard, customElement, state, AuClimateSelectors, customElement, property, state, HvacAction (+27 more)

### Community 15 - "computeDomain"
Cohesion: 0.19
Nodes (5): AuSwitchCard, customElement, formatSwitchSecondary(), toggleSwitch(), validateSwitchEntity()

### Community 16 - "HomeAssistant"
Cohesion: 0.21
Nodes (4): GridItem, GridItemLike, GridPos, buildEditRoomDraft()

### Community 17 - "au-calendar-card-editor.ts"
Cohesion: 0.11
Nodes (18): AuCalendarCardEditor, HTMLElementTagNameMap, customElement, AuCalendarFullscreenOpenOptions, AuCalendarFullscreenSync, HTMLElementTagNameMap, VIEW_KEYS, calendarCardEditorLabels (+10 more)

### Community 19 - "grid-engine.ts"
Cohesion: 0.25
Nodes (21): DragState, HTMLElementTagNameMap, clampToColumns(), collides(), compact(), computeRowTrackHeightPx(), deriveResponsiveLayout(), displayColumnsForWidth() (+13 more)

### Community 20 - "home-child-config.ts"
Cohesion: 0.13
Nodes (5): AuCalendarFullscreenOverlay, customElement, property, state, isSameLocalDay()

### Community 21 - "Card Contract Feature"
Cohesion: 0.09
Nodes (29): Architecture Card Contract, Card Contract Feature, Action Card, custom:au-action-card, AuActionCardBase, Action Card Content Layout, Calendar Card, Calendar Views (agenda/today/week/month) (+21 more)

### Community 22 - "au-shell-home-view.ts"
Cohesion: 0.15
Nodes (24): commitHomeEditToFloors(), commitRoomEditToFloors(), beginHomeEditDraft(), beginRoomEditDraft(), HomeEditSessionDraft, buildHomeEditItems(), buildHomeFloorGridItems(), buildRoomGridItems() (+16 more)

### Community 23 - "home-drag-resize.ts"
Cohesion: 0.20
Nodes (16): CardEditorMode, HTMLElementTagNameMap, NavView, applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag() (+8 more)

### Community 24 - "au-shell-grid.ts"
Cohesion: 0.17
Nodes (3): walkAncestors(), ensureCardPickerLoaded(), Lovelace

### Community 25 - "Distribution and HACS Feature"
Cohesion: 0.14
Nodes (17): ActionCardInternals, makeActionCard(), renderActionCard(), makeCalendarHass(), renderClimateCard(), renderCoverCard(), renderDeviceCard(), renderFanCard() (+9 more)

### Community 26 - "device.ts"
Cohesion: 0.14
Nodes (19): DEFAULT_HOME_FLOORS, HTMLElementTagNameMap, BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), BULK_OFF_DOMAINS, ROOM_TOGGLE_DOMAINS, TOGGLEABLE_DOMAINS (+11 more)

### Community 27 - "AuDeviceCard"
Cohesion: 0.06
Nodes (40): AuDeviceCard, customElement, state, DEDICATED_CARD_DOMAINS, DeviceCapabilities, EXPLICIT_ON_OFF_DOMAINS, getDeviceCapabilities(), isSupportedDeviceDomain() (+32 more)

### Community 28 - "au-vacuum-card.ts"
Cohesion: 0.12
Nodes (18): AuVacuumCard, customElement, ensureVacuumSettingsOverlay(), HTMLElementTagNameMap, SECTION_TABS, ACTIVE_STATES, formatVacuumSecondary(), getVacuumCapabilities() (+10 more)

### Community 29 - "au-vacuum-settings-overlay.ts"
Cohesion: 0.18
Nodes (19): AuVacuumSettingsOpenOptions, AuVacuumSettingsSection, computeDomain(), buildVacuumDeviceCatalog(), classifyVacuumSection(), entityLabel(), entriesForSection(), ESSENTIAL_SUFFIXES (+11 more)

### Community 31 - "._placeFloorCard"
Cohesion: 0.12
Nodes (15): cardTag(), cardTypeHasEditor(), createChildCard(), fallbackCustomCardEntries(), getCardEditorElement(), stubConfigForCardType(), attachChildToHost(), ChildCardMaps (+7 more)

### Community 32 - "PRD Decision Log D1-D14"
Cohesion: 0.15
Nodes (14): D10 Action Safety, D2 One Shell Card, D7 Priority Order, PRD Decision Log D1-D14, Phase 1 Home Visual Consistency, Phase 2 Security and Runtime, Phase 3 Bundle and Perf, Phase 4 Architecture and DX (+6 more)

### Community 33 - "create-child-card.ts"
Cohesion: 0.15
Nodes (7): AuCalendarCard, customElement, state, AuCalendarEvent, AuCalendarView, isAuCalendarView(), formatDayHeader()

### Community 34 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, @eslint/js, jsdom, prettier, @types/node, typescript, devDependencies, eslint (+9 more)

### Community 35 - "tokens.ts"
Cohesion: 0.05
Nodes (38): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, AuClimateCardEditor, HTMLElementTagNameMap, customElement, climateCardEditorLabels (+30 more)

### Community 36 - "home-assistant.ts"
Cohesion: 0.18
Nodes (8): CustomCardEntry, HassArea, HassDevice, HassEntityAttributeBase, HassFloor, HassThemes, HassUser, Window

### Community 37 - "Edit Mode"
Cohesion: 0.40
Nodes (5): Vacuum Settings Overlay, config-persist, Edit Mode Draft/Commit Discipline, Edit Mode, home-edit-commit

### Community 38 - "._renderChildCard"
Cohesion: 0.19
Nodes (16): AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuClimateCardConfig, AuActionCardConfig, AuGridItemLayout, AuSeverityThresholds, AuCoverCardConfig (+8 more)

### Community 39 - "._resolvedFloors"
Cohesion: 0.09
Nodes (9): AuLightSlider, customElement, property, AuTempStepper, customElement, property, clamp(), snapToStep() (+1 more)

### Community 40 - "au-shell-grid-home.test.ts"
Cohesion: 0.17
Nodes (9): FakeCard, FakeEditor, HomeViewTestApi, renderIdleHome(), renderShell(), roomTileCard(), roomTileChips(), roomTileHost() (+1 more)

### Community 41 - "au-shell-grid"
Cohesion: 0.10
Nodes (23): Atrium Home Dashboard Demo, Architecture Domain Card Mapping, Install and Lovelace Resource Ops, Home Rooms Mode, AtriumUI, au-shell-grid, Components, Demo YAML (+15 more)

### Community 42 - "Home Tiles"
Cohesion: 0.24
Nodes (10): custom:au-room-card, Room Card, Shell Room Controls, Sensor Home Variant Path, Sensor Linear Gauge, Sensor Card, Sensor Severity Thresholds, auHomeTileStyles (+2 more)

### Community 43 - "compilerOptions"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, dist, node_modules, src, test, compilerOptions, declaration, declarationDir (+6 more)

### Community 44 - "action-tile-layout.ts"
Cohesion: 0.12
Nodes (17): en, TranslationKey, he, ru, formatEventTimeRange(), packMonthDayChips(), ClockDateFormat, ClockDayFormat (+9 more)

### Community 45 - "._renderEntry"
Cohesion: 0.13
Nodes (6): AuVacuumSettingsOverlay, customElement, property, state, roomDisplayName(), VacuumDeviceCatalog

### Community 46 - "Architecture Specification"
Cohesion: 0.26
Nodes (17): Architecture Specification, Locked Architecture Constraints C1-C12, Lovelace Design System Principle, Shell Modes Classic and Home, Room Idle Timeout, npm run dev:ha, Local Dev Against Home Assistant, Phase 0 Shipped Spine (+9 more)

### Community 47 - "au-device-card-editor.ts"
Cohesion: 0.22
Nodes (7): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector, SUPPORTED_DEVICE_DOMAIN_LIST

### Community 50 - "VacuumSettingsDraft"
Cohesion: 0.15
Nodes (5): HassEntity, applyVacuumDraft(), pressVacuumButton(), VacuumDraftValue, VacuumSettingsDraft

### Community 54 - "au-room-card-editor.ts"
Cohesion: 0.21
Nodes (7): AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels, roomCardEditorSchema, normalizeRoomCardEntities(), ROOM_CARD_ENTITY_DOMAINS

### Community 55 - "Feature: Card contract"
Cohesion: 0.14
Nodes (14): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 5. UX flows, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies (+6 more)

### Community 56 - "AuSensorCard"
Cohesion: 0.08
Nodes (14): AuActionCard, customElement, AuSensorCard, clamp(), AuSensorCardEditor, HTMLElementTagNameMap, customElement, HTMLElementTagNameMap (+6 more)

### Community 57 - "water-heater-timer.ts"
Cohesion: 0.21
Nodes (7): applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem, AuGridCardConfig, AuShellGridConfig, baseGrid

### Community 58 - "scripts"
Cohesion: 0.15
Nodes (13): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 5. UX flows, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies (+5 more)

### Community 59 - "au-action-card-editor.ts"
Cohesion: 0.15
Nodes (13): Action Card, Calendar Card, Climate Card, Cover Card, Device Card, Fan Card, Light Card, Sensor Card (+5 more)

### Community 61 - "au-fan-card-editor.ts"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/product/calendar-card.md), Automated, Decisions, feature/calendar-fullscreen, Files touched, Goal, Leftover cleanup, Linked docs (+3 more)

### Community 62 - "au-switch-card-editor.ts"
Cohesion: 0.18
Nodes (10): Acceptance, Automated, Decisions, feature/calendar-time-improvements, Files touched, Goal, Linked docs, Manual (+2 more)

### Community 64 - "Implementation: Room idle timeout"
Cohesion: 0.18
Nodes (11): Acceptance (from docs/prd/platform/shell-grid.md §7), Automated, Decisions, Files touched, Goal, Implementation: Room idle timeout, Leftover cleanup, Linked official docs (+3 more)

### Community 65 - "Feature: Shell grid"
Cohesion: 0.18
Nodes (11): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies, 9. Implementation (+3 more)

### Community 66 - "AuFanSpeedSelector"
Cohesion: 0.18
Nodes (6): AuFanSpeedSelector, customElement, property, state, formatFanSpeedLabel(), getFanSpeedIcon()

### Community 68 - "package.json"
Cohesion: 0.20
Nodes (9): author, description, license, main, module, name, type, types (+1 more)

### Community 69 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, dev:ha, format, lint, test, test:watch (+2 more)

### Community 70 - "keywords"
Cohesion: 0.33
Nodes (6): custom-card, design-system, hacs, home-assistant, lovelace, keywords

### Community 71 - ".prettierrc.json"
Cohesion: 0.29
Nodes (7): 1. Goal, 2. Architecture anchors, 3. Feature map, 4. What shipped (high level), 5. Explicitly not Phase 0 exit blockers, 6. Document control, Phase 0 — Shipped spine (summary)

### Community 73 - "files"
Cohesion: 0.50
Nodes (4): dist, hacs.json, README.md, files

### Community 75 - "light-card-layout.ts"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 76 - "5. UX flows"
Cohesion: 0.50
Nodes (4): 5. UX flows, Empty / first-use, Primary flow (classic), Primary flow (Home)

### Community 77 - "@eslint/js"
Cohesion: 0.67
Nodes (4): hass.language Locale Source, Hebrew RTL Support, Localize Catalogs (en/ru/he), Localize

### Community 78 - "debug.ts"
Cohesion: 0.31
Nodes (8): actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS, BLOCKED_HOMEASSISTANT_SERVICES, fireMoreInfo(), isAllowedServiceCall(), isSafeActionUrl(), isSafeNavigatePath()

### Community 83 - "CI Verify Job"
Cohesion: 0.67
Nodes (3): CI Workflow, CI Verify Job, npm run verify

### Community 84 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

## Knowledge Gaps
- **302 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `name` (+297 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuShellHomeView` connect `AuShellHomeView` to `AuRoomCard`, `home-edit-room-modal.ts`, `AuShellGrid`, `AuHomeEntityConfig`, `action-tile-layout.ts`, `Architecture Specification`, `HomeAssistant`, `grid-engine.ts`, `au-shell-home-view.ts`, `home-drag-resize.ts`, `water-heater-timer.ts`, `._placeFloorCard`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `lit` connect `index.ts` to `light.ts`, `AuTempStepper`, `tokens.ts`, `AuRoomCard`, `home-edit-room-modal.ts`, `keywords`, `AuCalendarCard`, `au-device-card-editor.ts`, `au-calendar-card-editor.ts`, `grid-engine.ts`, `au-room-card-editor.ts`, `home-drag-resize.ts`, `AuSensorCard`, `device.ts`, `au-vacuum-card.ts`, `._placeFloorCard`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `AuShellGrid` connect `AuShellGrid` to `Phase 2 Security and Runtime`, `AuRoomCard`, `au-shell-grid-home.test.ts`, `index.ts`, `Architecture Specification`, `grid-engine.ts`, `.render`, `au-shell-grid.ts`, `water-heater-timer.ts`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _302 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuShellHomeView` be split into smaller, more focused modules?**
  _Cohesion score 0.04506172839506173 - nodes in this community are weakly interconnected._
- **Should `light.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07648401826484018 - nodes in this community are weakly interconnected._
- **Should `AuTempStepper` be split into smaller, more focused modules?**
  _Cohesion score 0.11494252873563218 - nodes in this community are weakly interconnected._