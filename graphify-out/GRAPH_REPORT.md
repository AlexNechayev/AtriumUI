# Graph Report - docs-oss-first-release  (2026-08-25)

## Corpus Check
- 217 files · ~115,411 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1840 nodes · 5089 edges · 91 communities (83 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11d0c690`
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
- Distribution and HACS Feature
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
- feature/calendar-time-improvements
- VacuumSettingsDraft
- .render
- Feature: Card contract
- Feature: Shell grid
- au-room-card-editor.ts
- Feature: Card contract
- AuSensorCard
- water-heater-timer.ts
- scripts
- au-action-card-editor.ts
- format-clock.ts
- au-fan-card-editor.ts
- au-switch-card-editor.ts
- au-fan-card-editor.ts
- Implementation: Room idle timeout
- Feature: Shell grid
- AuFanSpeedSelector
- Phase 2 Security and Runtime
- package.json
- scripts
- keywords
- .prettierrc.json
- PHASE_0.md
- files
- Action Card
- light-card-layout.ts
- 5. UX flows
- @eslint/js
- debug.ts
- PULL_REQUEST_TEMPLATE.md
- shell-grid-add-card.test.ts
- CI Verify Job
- dependencies
- typescript-eslint
- 5. UX flows
- repository
- 2. In / out of scope
- AuVacuumSettingsSection

## God Nodes (most connected - your core abstractions)
1. `AuShellHomeView` - 145 edges
2. `HassEntity` - 89 edges
3. `AuShellGrid` - 62 edges
4. `AuActionCardBase` - 57 edges
5. `computeDomain()` - 57 edges
6. `AuCalendarFullscreenOverlay` - 47 edges
7. `makeHass()` - 47 edges
8. `AuVacuumSettingsOverlay` - 44 edges
9. `lit` - 43 edges
10. `LovelaceCardConfig` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Native Lovelace Card Lifecycle` --semantically_similar_to--> `Architecture Card Contract`  [INFERRED] [semantically similar]
  README.md → docs/ARCHITECTURE.md
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

## Communities (91 total, 8 thin omitted)

### Community 0 - "AuShellHomeView"
Cohesion: 0.06
Nodes (9): Phase 3-4 Product Backlog, Session Follow-ups, AuShellHomeView, customElement, property, query, state, ensureCardPickerLoaded() (+1 more)

### Community 1 - "light.ts"
Cohesion: 0.08
Nodes (38): AuLightCard, HTMLElementTagNameMap, customElement, state, AuLightCardConfig, LightColorMode, createDebounced(), isLightCardCompact() (+30 more)

### Community 2 - "AuTempStepper"
Cohesion: 0.16
Nodes (12): HTMLElementTagNameMap, calendarCardEditorLabels, calendarCardEditorSchema, HTMLElementTagNameMap, SelectorPanel, AuBaseEditor, property, state (+4 more)

### Community 3 - "au-fan-card.ts"
Cohesion: 0.08
Nodes (27): AuFanCard, HTMLElementTagNameMap, customElement, state, AuFanSpeedSelector, HTMLElementTagNameMap, customElement, property (+19 more)

### Community 4 - "AuActionCardBase"
Cohesion: 0.06
Nodes (20): ActionSurfaceOptions, AuActionCardBase, humanize(), eventOptions, ActionConfig, defaultDoubleTapAction(), defaultHoldAction(), defaultTapAction() (+12 more)

### Community 5 - "AuRoomCard"
Cohesion: 0.06
Nodes (21): AuRoomCard, AuRoomCardEditor, customElement, HTMLElementTagNameMap, customElement, eventOptions, AuBaseCard, hasEntityChanged() (+13 more)

### Community 6 - "home-edit-room-modal.ts"
Cohesion: 0.11
Nodes (20): RoomTileCardConfigInput, addEditRoomMember(), buildEditRoomDraft(), controlsFromEditDraft(), EditRoomAddCandidate, EditRoomDraft, EditRoomModalHandlers, EditRoomModalProps (+12 more)

### Community 7 - "AuShellGrid"
Cohesion: 0.05
Nodes (34): AuShellGrid, DragState, HTMLElementTagNameMap, customElement, property, query, state, walkAncestors() (+26 more)

### Community 8 - "compilerOptions"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, dist, node_modules, src, test, compilerOptions (+34 more)

### Community 10 - "index.ts"
Cohesion: 0.23
Nodes (13): actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS, BLOCKED_HOMEASSISTANT_SERVICES, executeAction(), fireMoreInfo(), isAllowedServiceCall(), isSafeActionUrl() (+5 more)

### Community 11 - "au-cover-card.ts"
Cohesion: 0.13
Nodes (17): AuCoverCard, HTMLElementTagNameMap, customElement, state, AuCoverCardConfig, closeCover(), COVER_SUPPORT, CoverCapabilities (+9 more)

### Community 12 - "AuHomeEntityConfig"
Cohesion: 0.17
Nodes (18): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, homeAwareCardConfig(), DEDICATED_CARD_DOMAINS, DeviceCapabilities, getDeviceCapabilities(), isSupportedDeviceDomain() (+10 more)

### Community 13 - "AuCalendarCard"
Cohesion: 0.21
Nodes (24): HTMLElementTagNameMap, VIEW_KEYS, buildMonthGrid(), CallServiceWithResponse, compileFilter(), computeFetchWindow(), computeMonthGridWindow(), endOfLocalDay() (+16 more)

### Community 14 - "HassEntity"
Cohesion: 0.06
Nodes (38): AuClimateCard, HTMLElementTagNameMap, customElement, state, AuClimateSelectors, customElement, property, state (+30 more)

### Community 15 - "computeDomain"
Cohesion: 0.18
Nodes (8): AuSwitchCard, HTMLElementTagNameMap, customElement, AuSwitchCardConfig, isEntityActive(), formatSwitchSecondary(), toggleSwitch(), validateSwitchEntity()

### Community 17 - "au-calendar-card-editor.ts"
Cohesion: 0.11
Nodes (20): AuCalendarCardEditor, customElement, AuCalendarFullscreenOpenOptions, AuCalendarFullscreenSync, ensureCalendarFullscreenOverlay(), HTMLElementTagNameMap, VIEW_KEYS, AuCalendarCardConfig (+12 more)

### Community 19 - "grid-engine.ts"
Cohesion: 0.13
Nodes (4): renderAddRoomModal(), renderHomeAddChooser(), resolveDeviceDisplayName(), item()

### Community 20 - "home-child-config.ts"
Cohesion: 0.12
Nodes (6): AuCalendarFullscreenOverlay, customElement, property, state, formatEventTimeRange(), isSameLocalDay()

### Community 21 - "Card Contract Feature"
Cohesion: 0.13
Nodes (15): Climate Card, HVAC Mode Selector, Climate Temperature Control, Cover Card, cover.toggle Primary Tap, Cover Position Slider, Device Card Confirm Actions, Device Card (+7 more)

### Community 22 - "au-shell-home-view.ts"
Cohesion: 0.11
Nodes (39): CardEditorMode, HTMLElementTagNameMap, NavView, applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag() (+31 more)

### Community 23 - "home-drag-resize.ts"
Cohesion: 0.19
Nodes (4): roomDisplayName(), VacuumCatalogEntry, VacuumDeviceCatalog, pressVacuumButton()

### Community 24 - "au-shell-grid.ts"
Cohesion: 0.28
Nodes (11): DomainControlKind, DomainControlVisibility, resolveDomainControl(), runWaterHeaterTemperature(), getWaterHeaterCapabilities(), getWaterHeaterTemperature(), setWaterHeaterTemperature(), turnOffWaterHeater() (+3 more)

### Community 25 - "Distribution and HACS Feature"
Cohesion: 0.06
Nodes (35): AuActionCard, customElement, AuSensorCard, customElement, CARDS, AuSensorCardConfig, CustomCardEntry, ActionCardInternals (+27 more)

### Community 26 - "device.ts"
Cohesion: 0.12
Nodes (24): clamp(), HTMLElementTagNameMap, SeverityLevel, BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), EXPLICIT_ON_OFF_DOMAINS, isDeviceActive() (+16 more)

### Community 27 - "AuDeviceCard"
Cohesion: 0.14
Nodes (4): AuDeviceCard, customElement, state, DomainControlModel

### Community 28 - "au-vacuum-card.ts"
Cohesion: 0.12
Nodes (20): AuVacuumCard, HTMLElementTagNameMap, customElement, ensureVacuumSettingsOverlay(), HTMLElementTagNameMap, SECTION_TABS, AuVacuumCardConfig, ACTIVE_STATES (+12 more)

### Community 29 - "au-vacuum-settings-overlay.ts"
Cohesion: 0.19
Nodes (15): buildVacuumDeviceCatalog(), classifyVacuumSection(), entityLabel(), entriesForSection(), ESSENTIAL_SUFFIXES, filterCatalogSections(), isEnabledRegistryEntry(), isEssential() (+7 more)

### Community 30 - "Distribution and HACS Feature"
Cohesion: 0.20
Nodes (14): Atrium Home Dashboard Demo, Architecture Domain Card Mapping, Shell Modes Classic and Home, Install and Lovelace Resource Ops, npm run dev:ha, Local Dev Against Home Assistant, Distribution and HACS Feature, au-shell-grid (+6 more)

### Community 31 - "._placeFloorCard"
Cohesion: 0.10
Nodes (22): cardTag(), cardTypeHasEditor(), createChildCard(), fallbackCustomCardEntries(), getCardEditorElement(), stubConfigForCardType(), attachChildToHost(), ChildCardMaps (+14 more)

### Community 32 - "PRD Decision Log D1-D14"
Cohesion: 0.22
Nodes (10): D10 Action Safety, Phase 1 Home Visual Consistency, Phase 2 Security and Runtime, Phase 3 Bundle and Perf, Phase 4 Architecture and DX, executeAction Validation Requirement, Always-On Device Timer Finding, Unvalidated executeAction Finding (+2 more)

### Community 33 - "create-child-card.ts"
Cohesion: 0.15
Nodes (4): AuCalendarCard, customElement, state, formatDayHeader()

### Community 34 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, @eslint/js, jsdom, devDependencies, eslint, @eslint/js, jsdom, prettier (+11 more)

### Community 35 - "tokens.ts"
Cohesion: 0.26
Nodes (8): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, HTMLElementTagNameMap, coverCardEditorLabels, coverCardEditorSchema, AuActionCardConfig

### Community 36 - "home-assistant.ts"
Cohesion: 0.15
Nodes (12): author, bugs, url, description, homepage, license, main, module (+4 more)

### Community 37 - "Edit Mode"
Cohesion: 0.29
Nodes (7): Vacuum hide_sections, Vacuum Settings Overlay, Vacuum Card, config-persist, Edit Mode Draft/Commit Discipline, Edit Mode, home-edit-commit

### Community 38 - "._renderChildCard"
Cohesion: 0.17
Nodes (14): GridItem, GridPersistItem, AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuGridCardConfig, AuGridItemLayout, AuSeverityThresholds (+6 more)

### Community 39 - "._resolvedFloors"
Cohesion: 0.06
Nodes (17): AuLightSlider, AuLightSliderVariant, HTMLElementTagNameMap, customElement, property, AuTempControlMode, AuTempStepper, HTMLElementTagNameMap (+9 more)

### Community 40 - "au-shell-grid-home.test.ts"
Cohesion: 0.36
Nodes (9): HTMLElementTagNameMap, clampTimerMinutes(), clearTimerEndsAt(), formatTimerRemaining(), normalizeTimerPresets(), readTimerEndsAt(), storageKey(), WH_TIMER_DEFAULT_PRESETS (+1 more)

### Community 41 - "au-shell-grid"
Cohesion: 0.12
Nodes (16): AtriumUI, Native Lovelace Card Lifecycle, Components, Contributing, Demo YAML, Design system, Development, HACS (recommended) (+8 more)

### Community 42 - "Home Tiles"
Cohesion: 0.22
Nodes (13): custom:au-room-card, Room Card, Shell Room Controls, Sensor Home Variant Path, Sensor Linear Gauge, Sensor Card, Sensor Severity Thresholds, Design Tokens (+5 more)

### Community 43 - "compilerOptions"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, dist, node_modules, src, test, compilerOptions, declaration, declarationDir (+6 more)

### Community 44 - "action-tile-layout.ts"
Cohesion: 0.17
Nodes (16): hass.language Locale Source, Hebrew RTL Support, Localize Catalogs (en/ru/he), Localize, en, TranslationKey, he, isRtlLanguage() (+8 more)

### Community 45 - "._renderEntry"
Cohesion: 0.21
Nodes (4): AuVacuumSettingsOverlay, customElement, property, state

### Community 46 - "Architecture Specification"
Cohesion: 0.22
Nodes (20): Architecture Specification, Architecture Card Contract, Locked Architecture Constraints C1-C12, Lovelace Design System Principle, Room Idle Timeout, Phase 0 Shipped Spine, PRD Feature Spec Template, D2 One Shell Card (+12 more)

### Community 47 - "au-device-card-editor.ts"
Cohesion: 0.24
Nodes (6): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector

### Community 49 - "feature/calendar-time-improvements"
Cohesion: 0.18
Nodes (10): Acceptance, Automated, Decisions, feature/calendar-time-improvements, Files touched, Goal, Linked docs, Manual (+2 more)

### Community 51 - ".render"
Cohesion: 0.18
Nodes (11): Acceptance (from docs/prd/platform/shell-grid.md §7), Automated, Decisions, Files touched, Goal, Implementation: Room idle timeout, Leftover cleanup, Linked official docs (+3 more)

### Community 52 - "Feature: Card contract"
Cohesion: 0.18
Nodes (11): 1. Problem & user story, 3. Config / data model, 4. Behaviors & business rules, 5. UX flows, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies, 9. Implementation (+3 more)

### Community 53 - "Feature: Shell grid"
Cohesion: 0.18
Nodes (11): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies, 9. Implementation (+3 more)

### Community 54 - "au-room-card-editor.ts"
Cohesion: 0.27
Nodes (7): HTMLElementTagNameMap, roomCardEditorLabels, roomCardEditorSchema, ROOM_CARD_ENTITY_DOMAINS, ROOM_TOGGLE_DOMAINS, SUPPORTED_DEVICE_DOMAIN_LIST, TOGGLEABLE_DOMAINS

### Community 55 - "Feature: Card contract"
Cohesion: 0.20
Nodes (10): scripts, build, dev, dev:ha, format, lint, test, test:watch (+2 more)

### Community 56 - "AuSensorCard"
Cohesion: 0.30
Nodes (8): lit, HTMLElementTagNameMap, HTMLElementTagNameMap, CardRootOptions, auActionTileLayout, auCardContentLayout, auCardSurface, auTokens

### Community 57 - "water-heater-timer.ts"
Cohesion: 0.22
Nodes (3): renderEditRoomModal(), toggleEditRoomEntity(), renderAddEntityModal()

### Community 58 - "scripts"
Cohesion: 0.15
Nodes (13): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 5. UX flows, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies (+5 more)

### Community 59 - "au-action-card-editor.ts"
Cohesion: 0.15
Nodes (13): Action Card, Calendar Card, Climate Card, Cover Card, Device Card, Fan Card, Light Card, Sensor Card (+5 more)

### Community 60 - "format-clock.ts"
Cohesion: 0.27
Nodes (9): packMonthDayChips(), ClockDateFormat, ClockDayFormat, ClockFormat, formatClock(), formatClockDate(), formatClockWeekday(), formatToolbarClock() (+1 more)

### Community 61 - "au-fan-card-editor.ts"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/product/calendar-card.md), Automated, Decisions, feature/calendar-fullscreen, Files touched, Goal, Leftover cleanup, Linked docs (+3 more)

### Community 62 - "au-switch-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuClimateCardEditor, HTMLElementTagNameMap, customElement, climateCardEditorLabels, climateCardEditorSchema

### Community 63 - "au-fan-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuFanCardEditor, HTMLElementTagNameMap, customElement, fanCardEditorLabels, fanCardEditorSchema

### Community 64 - "Implementation: Room idle timeout"
Cohesion: 0.28
Nodes (5): AuLightCardEditor, HTMLElementTagNameMap, customElement, lightCardEditorLabels, lightCardEditorSchema

### Community 65 - "Feature: Shell grid"
Cohesion: 0.28
Nodes (5): AuSwitchCardEditor, HTMLElementTagNameMap, customElement, switchCardEditorLabels, switchCardEditorSchema

### Community 66 - "AuFanSpeedSelector"
Cohesion: 0.28
Nodes (5): AuVacuumCardEditor, HTMLElementTagNameMap, customElement, vacuumCardEditorLabels, vacuumCardEditorSchema

### Community 67 - "Phase 2 Security and Runtime"
Cohesion: 0.38
Nodes (3): Reporting a vulnerability, Security Policy, Supported versions

### Community 68 - "package.json"
Cohesion: 0.29
Nodes (7): Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Responsibilities, Our Pledge, Our Standards, Scope

### Community 69 - "scripts"
Cohesion: 0.29
Nodes (7): Contributing to AtriumUI, Development setup, How to report issues, Making a change, Project constraints (do not break), Pull request checklist, Support the project

### Community 70 - "keywords"
Cohesion: 0.33
Nodes (6): keywords, custom-card, design-system, hacs, home-assistant, lovelace

### Community 71 - ".prettierrc.json"
Cohesion: 0.29
Nodes (7): 1. Goal, 2. Architecture anchors, 3. Feature map, 4. What shipped (high level), 5. Explicitly not Phase 0 exit blockers, 6. Document control, Phase 0 — Shipped spine (summary)

### Community 72 - "PHASE_0.md"
Cohesion: 0.22
Nodes (7): Decisions, Files touched, Goal, Implementation: OSS first-release packaging, Leftover cleanup, Linked official docs, TDD

### Community 73 - "files"
Cohesion: 0.40
Nodes (5): files, dist, hacs.json, LICENSE, README.md

### Community 74 - "Action Card"
Cohesion: 0.33
Nodes (6): Action Card, custom:au-action-card, AuActionCardBase, Action Card Content Layout, Switch Explicit turn_on/turn_off, Switch Card

### Community 75 - "light-card-layout.ts"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 76 - "5. UX flows"
Cohesion: 0.40
Nodes (4): [0.5.4] - 2026-08-25, Added, Changed, Changelog

### Community 77 - "@eslint/js"
Cohesion: 0.40
Nodes (5): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Enforcement Guidelines

### Community 78 - "debug.ts"
Cohesion: 0.50
Nodes (4): Acceptance (from docs/prd/platform/distribution-hacs.md), Automated, Manual, Verification

### Community 81 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.50
Nodes (3): Manual (if UI / Lovelace), Summary, Test plan

### Community 83 - "CI Verify Job"
Cohesion: 0.27
Nodes (6): CI Workflow, CI Verify Job, npm run verify, Calendar Card, Calendar Views (agenda/today/week/month), calendar.get_events API

### Community 84 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

### Community 87 - "5. UX flows"
Cohesion: 0.50
Nodes (4): 5. UX flows, Empty / first-use, Primary flow (classic), Primary flow (Home)

### Community 88 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 89 - "2. In / out of scope"
Cohesion: 0.67
Nodes (3): 2. In / out of scope, In scope, Out of scope (this feature)

## Knowledge Gaps
- **342 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `name` (+337 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Card Contract Feature` connect `Architecture Specification` to `PRD Decision Log D1-D14`, `AuTempStepper`, `AuActionCardBase`, `Edit Mode`, `AuRoomCard`, `Action Card`, `Home Tiles`, `index.ts`, `CI Verify Job`, `Card Contract Feature`, `Distribution and HACS Feature`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `AuShellHomeView` connect `AuShellHomeView` to `AuRoomCard`, `home-edit-room-modal.ts`, `AuShellGrid`, `._renderChildCard`, `Architecture Specification`, `HomeAssistant`, `grid-engine.ts`, `au-shell-home-view.ts`, `water-heater-timer.ts`, `._placeFloorCard`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `lit` connect `AuSensorCard` to `light.ts`, `AuTempStepper`, `au-fan-card.ts`, `AuActionCardBase`, `AuRoomCard`, `home-edit-room-modal.ts`, `AuShellGrid`, `au-cover-card.ts`, `AuCalendarCard`, `HassEntity`, `computeDomain`, `au-calendar-card-editor.ts`, `au-shell-home-view.ts`, `device.ts`, `au-vacuum-card.ts`, `._placeFloorCard`, `tokens.ts`, `._resolvedFloors`, `au-shell-grid-home.test.ts`, `au-device-card-editor.ts`, `au-room-card-editor.ts`, `au-switch-card-editor.ts`, `au-fan-card-editor.ts`, `Implementation: Room idle timeout`, `Feature: Shell grid`, `AuFanSpeedSelector`, `keywords`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _342 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuShellHomeView` be split into smaller, more focused modules?**
  _Cohesion score 0.056962025316455694 - nodes in this community are weakly interconnected._
- **Should `light.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07724505327245053 - nodes in this community are weakly interconnected._
- **Should `au-fan-card.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07987012987012987 - nodes in this community are weakly interconnected._