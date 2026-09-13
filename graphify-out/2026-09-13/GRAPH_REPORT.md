# Graph Report - feature-room-tile-temperature  (2026-09-13)

## Corpus Check
- 221 files · ~117,930 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1890 nodes · 5131 edges · 78 communities (75 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5b820865`
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
- au-action-card-editor.ts
- format-clock.ts
- au-fan-card-editor.ts
- au-fan-card-editor.ts
- Implementation: Room idle timeout
- keywords
- PHASE_0.md
- files
- Action Card
- light-card-layout.ts
- 5. UX flows
- debug.ts
- PULL_REQUEST_TEMPLATE.md
- CI Verify Job
- dependencies
- repository
- PULL_REQUEST_TEMPLATE.md
- repository

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

## Communities (78 total, 3 thin omitted)

### Community 0 - "AuShellHomeView"
Cohesion: 0.04
Nodes (16): Phase 3-4 Product Backlog, Session Follow-ups, AuShellHomeView, customElement, property, query, state, addEditRoomMember() (+8 more)

### Community 1 - "light.ts"
Cohesion: 0.08
Nodes (36): AuLightCard, HTMLElementTagNameMap, customElement, state, createDebounced(), isLightCardCompact(), clamp(), formatBrightnessLabel() (+28 more)

### Community 2 - "AuTempStepper"
Cohesion: 0.07
Nodes (15): AuActionCardEditor, customElement, AuCoverCardEditor, customElement, AuLightCardEditor, customElement, AuSensorCardEditor, customElement (+7 more)

### Community 3 - "au-fan-card.ts"
Cohesion: 0.13
Nodes (16): AuCoverCard, HTMLElementTagNameMap, customElement, state, closeCover(), COVER_SUPPORT, CoverCapabilities, formatCoverSecondary() (+8 more)

### Community 4 - "AuActionCardBase"
Cohesion: 0.05
Nodes (29): ActionSurfaceOptions, AuActionCardBase, humanize(), eventOptions, ActionConfig, actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS (+21 more)

### Community 5 - "AuRoomCard"
Cohesion: 0.06
Nodes (18): AuRoomCard, HTMLElementTagNameMap, customElement, eventOptions, AuBaseCard, hasEntityChanged(), property, state (+10 more)

### Community 6 - "home-edit-room-modal.ts"
Cohesion: 0.15
Nodes (13): Action Card, Calendar Card, Climate Card, Cover Card, Device Card, Fan Card, Light Card, Sensor Card (+5 more)

### Community 7 - "AuShellGrid"
Cohesion: 0.07
Nodes (7): AuShellGrid, customElement, property, query, state, walkAncestors(), Lovelace

### Community 8 - "compilerOptions"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, dist, node_modules, src, test, compilerOptions (+34 more)

### Community 10 - "index.ts"
Cohesion: 0.26
Nodes (3): AuLightSlider, customElement, property

### Community 12 - "AuHomeEntityConfig"
Cohesion: 0.42
Nodes (8): CARD_TYPE_LOCKED_KEY, cardTypeShort(), isRemappableAuCardType(), normalizeAuHomeCardConfig(), NormalizeAuHomeCardResult, recommendedAuCardType(), REMAPPABLE_AU_CARD_TYPES, withCustomCardPrefix()

### Community 13 - "AuCalendarCard"
Cohesion: 0.21
Nodes (24): HTMLElementTagNameMap, VIEW_KEYS, buildMonthGrid(), CallServiceWithResponse, compileFilter(), computeFetchWindow(), computeMonthGridWindow(), endOfLocalDay() (+16 more)

### Community 14 - "HassEntity"
Cohesion: 0.06
Nodes (39): AuClimateCard, HTMLElementTagNameMap, customElement, state, AuClimateSelectors, customElement, property, state (+31 more)

### Community 15 - "computeDomain"
Cohesion: 0.17
Nodes (12): AtriumUI, Components, Contributing, Design system, HACS (recommended), Installation, License, Manual (+4 more)

### Community 16 - "HomeAssistant"
Cohesion: 0.14
Nodes (12): applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag(), beginPointerResize(), computeGridMetrics(), GridMetrics (+4 more)

### Community 17 - "au-calendar-card-editor.ts"
Cohesion: 0.11
Nodes (20): AuCalendarCardEditor, customElement, AuCalendarFullscreenOpenOptions, AuCalendarFullscreenSync, ensureCalendarFullscreenOverlay(), HTMLElementTagNameMap, VIEW_KEYS, AuCalendarCardConfig (+12 more)

### Community 18 - "._renderHomeView"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/platform/distribution-hacs.md), Automated, Decisions, Files touched, Goal, Implementation: OSS first-release packaging, Leftover cleanup, Linked official docs (+3 more)

### Community 19 - "grid-engine.ts"
Cohesion: 0.14
Nodes (31): DragState, GridItem, HTMLElementTagNameMap, applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem, clampToColumns() (+23 more)

### Community 20 - "home-child-config.ts"
Cohesion: 0.12
Nodes (6): AuCalendarFullscreenOverlay, customElement, property, state, formatEventTimeRange(), isSameLocalDay()

### Community 21 - "Card Contract Feature"
Cohesion: 0.09
Nodes (26): Architecture Card Contract, Card Contract Feature, Calendar Card, Calendar Views (agenda/today/week/month), calendar.get_events API, Climate Card, HVAC Mode Selector, Climate Temperature Control (+18 more)

### Community 22 - "au-shell-home-view.ts"
Cohesion: 0.12
Nodes (23): commitHomeEditToFloors(), commitRoomEditToFloors(), beginHomeEditDraft(), beginRoomEditDraft(), emptyEditSessionDraft(), HomeEditSessionDraft, buildHomeEditItems(), buildHomeFloorGridItems() (+15 more)

### Community 23 - "home-drag-resize.ts"
Cohesion: 0.08
Nodes (22): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+14 more)

### Community 24 - "au-shell-grid.ts"
Cohesion: 0.18
Nodes (8): Decisions, Files touched, Goal, Implementation: Room tile temperature, Leftover cleanup, Linked official docs, TDD, Verification

### Community 25 - "Distribution and HACS Feature"
Cohesion: 0.07
Nodes (31): AuActionCard, HTMLElementTagNameMap, customElement, CARDS, ActionCardInternals, makeActionCard(), renderActionCard(), makeCalendarHass() (+23 more)

### Community 26 - "device.ts"
Cohesion: 0.19
Nodes (15): BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), BULK_OFF_DOMAINS, computeDomain(), computeEntityName(), defaultToggleService(), formatBrightnessPercent() (+7 more)

### Community 27 - "AuDeviceCard"
Cohesion: 0.05
Nodes (46): AuDeviceCard, HTMLElementTagNameMap, customElement, state, AuSwitchCard, HTMLElementTagNameMap, customElement, auActionTileLayout (+38 more)

### Community 28 - "au-vacuum-card.ts"
Cohesion: 0.13
Nodes (17): AuVacuumCard, HTMLElementTagNameMap, customElement, ensureVacuumSettingsOverlay(), ACTIVE_STATES, formatVacuumSecondary(), getVacuumCapabilities(), isVacuumActive() (+9 more)

### Community 29 - "au-vacuum-settings-overlay.ts"
Cohesion: 0.18
Nodes (11): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies, 9. Implementation (+3 more)

### Community 30 - "Distribution and HACS Feature"
Cohesion: 0.21
Nodes (14): Atrium Home Dashboard Demo, Architecture Domain Card Mapping, Install and Lovelace Resource Ops, npm run dev:ha, Local Dev Against Home Assistant, Distribution and HACS Feature, Home Rooms Mode, au-shell-grid (+6 more)

### Community 31 - "._placeFloorCard"
Cohesion: 0.11
Nodes (23): CardEditorMode, HTMLElementTagNameMap, NavView, cardTag(), cardTypeHasEditor(), createChildCard(), ensureCardPickerLoaded(), fallbackCustomCardEntries() (+15 more)

### Community 32 - "PRD Decision Log D1-D14"
Cohesion: 0.33
Nodes (7): D10 Action Safety, D2 One Shell Card, D7 Priority Order, PRD Decision Log D1-D14, executeAction Validation Requirement, Unvalidated executeAction Finding, Assessment Priority Order

### Community 33 - "create-child-card.ts"
Cohesion: 0.15
Nodes (4): AuCalendarCard, customElement, state, formatDayHeader()

### Community 34 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, @eslint/js, jsdom, prettier, @types/node, typescript, typescript-eslint, devDependencies (+11 more)

### Community 35 - "tokens.ts"
Cohesion: 0.13
Nodes (17): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, HTMLElementTagNameMap, coverCardEditorLabels, coverCardEditorSchema, HTMLElementTagNameMap (+9 more)

### Community 36 - "home-assistant.ts"
Cohesion: 0.08
Nodes (35): Action Card, custom:au-action-card, AuActionCardBase, Action Card Content Layout, Sensor Home Variant Path, Sensor Linear Gauge, Sensor Card, Sensor Severity Thresholds (+27 more)

### Community 37 - "Edit Mode"
Cohesion: 0.29
Nodes (7): Vacuum hide_sections, Vacuum Settings Overlay, Vacuum Card, config-persist, Edit Mode Draft/Commit Discipline, Edit Mode, home-edit-commit

### Community 38 - "._renderChildCard"
Cohesion: 0.17
Nodes (16): AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuActionCardConfig, AuGridItemLayout, AuSeverityThresholds, AuCoverCardConfig, AuDeviceCardConfig (+8 more)

### Community 39 - "._resolvedFloors"
Cohesion: 0.12
Nodes (3): AuTempStepper, customElement, property

### Community 40 - "au-shell-grid-home.test.ts"
Cohesion: 0.24
Nodes (5): AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels, roomCardEditorSchema

### Community 41 - "au-shell-grid"
Cohesion: 0.14
Nodes (21): AuVacuumSettingsOpenOptions, HTMLElementTagNameMap, SECTION_TABS, AuVacuumSettingsSection, buildVacuumDeviceCatalog(), classifyVacuumSection(), entityLabel(), entriesForSection() (+13 more)

### Community 42 - "Home Tiles"
Cohesion: 0.28
Nodes (5): AuClimateCardEditor, HTMLElementTagNameMap, customElement, climateCardEditorLabels, climateCardEditorSchema

### Community 43 - "compilerOptions"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, dist, node_modules, src, test, compilerOptions, declaration, declarationDir (+6 more)

### Community 44 - "action-tile-layout.ts"
Cohesion: 0.17
Nodes (16): hass.language Locale Source, Hebrew RTL Support, Localize Catalogs (en/ru/he), Localize, en, TranslationKey, he, isRtlLanguage() (+8 more)

### Community 45 - "._renderEntry"
Cohesion: 0.15
Nodes (5): AuVacuumSettingsOverlay, customElement, property, state, VacuumDeviceCatalog

### Community 46 - "Architecture Specification"
Cohesion: 0.30
Nodes (14): Architecture Specification, Locked Architecture Constraints C1-C12, Lovelace Design System Principle, Shell Modes Classic and Home, Room Idle Timeout, Phase 0 Shipped Spine, PRD Feature Spec Template, Classic Grid Mode (+6 more)

### Community 47 - "au-device-card-editor.ts"
Cohesion: 0.14
Nodes (12): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector, DEFAULT_HOME_FLOORS, HTMLElementTagNameMap (+4 more)

### Community 49 - "feature/calendar-time-improvements"
Cohesion: 0.18
Nodes (10): Acceptance, Automated, Decisions, feature/calendar-time-improvements, Files touched, Goal, Linked docs, Manual (+2 more)

### Community 50 - "VacuumSettingsDraft"
Cohesion: 0.15
Nodes (10): CustomCardEntry, HassArea, HassDevice, HassEntityAttributeBase, HassEntityRegistryEntry, HassFloor, HassThemes, HassUser (+2 more)

### Community 51 - ".render"
Cohesion: 0.06
Nodes (32): Acceptance (from docs/prd/platform/shell-grid.md §7), Automated, Decisions, Files touched, Goal, Implementation: Room idle timeout, Leftover cleanup, Linked official docs (+24 more)

### Community 52 - "Feature: Card contract"
Cohesion: 0.28
Nodes (5): AuFanCardEditor, HTMLElementTagNameMap, customElement, fanCardEditorLabels, fanCardEditorSchema

### Community 53 - "Feature: Shell grid"
Cohesion: 0.29
Nodes (6): [0.5.4] - 2026-08-25, Added, Added, Changed, Changelog, [Unreleased]

### Community 54 - "au-room-card-editor.ts"
Cohesion: 0.16
Nodes (15): HTMLElementTagNameMap, SelectorPanel, HTMLElementTagNameMap, AuLightSliderVariant, HTMLElementTagNameMap, AuTempControlMode, HTMLElementTagNameMap, fireEvent() (+7 more)

### Community 55 - "Feature: Card contract"
Cohesion: 0.50
Nodes (4): 5. UX flows, Empty / first-use, Primary flow (classic), Primary flow (Home)

### Community 56 - "AuSensorCard"
Cohesion: 0.11
Nodes (16): lit, HTMLElementTagNameMap, calendarCardEditorLabels, calendarCardEditorSchema, AuSensorCard, clamp(), HTMLElementTagNameMap, HTMLElementTagNameMap (+8 more)

### Community 57 - "water-heater-timer.ts"
Cohesion: 0.67
Nodes (3): Demo YAML, Development, Home Assistant watch build (`dev:ha`)

### Community 59 - "au-action-card-editor.ts"
Cohesion: 0.17
Nodes (11): Acceptance, Automated, Decisions, Files touched, Goal, Implementation: GitHub Pages landing site, Leftover cleanup, Linked official docs (+3 more)

### Community 60 - "format-clock.ts"
Cohesion: 0.27
Nodes (9): packMonthDayChips(), ClockDateFormat, ClockDayFormat, ClockFormat, formatClock(), formatClockDate(), formatClockWeekday(), formatToolbarClock() (+1 more)

### Community 61 - "au-fan-card-editor.ts"
Cohesion: 0.13
Nodes (20): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, homeAwareCardConfig(), RoomTileCardConfigInput, buildEditRoomDraft(), EditRoomAddCandidate, EditRoomModalHandlers (+12 more)

### Community 63 - "au-fan-card-editor.ts"
Cohesion: 0.15
Nodes (12): author, bugs, url, description, homepage, license, main, module (+4 more)

### Community 64 - "Implementation: Room idle timeout"
Cohesion: 0.15
Nodes (4): applyVacuumDraft(), pressVacuumButton(), VacuumDraftValue, VacuumSettingsDraft

### Community 70 - "keywords"
Cohesion: 0.33
Nodes (6): custom-card, design-system, hacs, home-assistant, lovelace, keywords

### Community 72 - "PHASE_0.md"
Cohesion: 0.08
Nodes (22): Acceptance, Automated, Decisions, Files touched, Goal, Implementation: Pages about copy, Leftover cleanup, Linked official docs (+14 more)

### Community 73 - "files"
Cohesion: 0.40
Nodes (5): dist, hacs.json, LICENSE, README.md, files

### Community 74 - "Action Card"
Cohesion: 0.20
Nodes (10): scripts, build, dev, dev:ha, format, lint, test, test:watch (+2 more)

### Community 75 - "light-card-layout.ts"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 76 - "5. UX flows"
Cohesion: 0.14
Nodes (13): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 5. UX flows, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies (+5 more)

### Community 78 - "debug.ts"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/product/calendar-card.md), Automated, Decisions, feature/calendar-fullscreen, Files touched, Goal, Leftover cleanup, Linked docs (+3 more)

### Community 81 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.22
Nodes (4): AuFanSpeedSelector, customElement, property, state

### Community 83 - "CI Verify Job"
Cohesion: 0.67
Nodes (3): CI Workflow, CI Verify Job, npm run verify

### Community 84 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

### Community 88 - "repository"
Cohesion: 0.29
Nodes (7): Phase 1 Home Visual Consistency, Phase 2 Security and Runtime, Phase 3 Bundle and Perf, Phase 4 Architecture and DX, Always-On Device Timer Finding, Home Visual Drift Finding, Home Design Tokens

### Community 91 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.50
Nodes (3): Manual (if UI / Lovelace), Summary, Test plan

### Community 94 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **379 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `name` (+374 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuShellHomeView` connect `AuShellHomeView` to `au-cover-card.ts`, `Architecture Specification`, `HomeAssistant`, `VacuumSettingsDraft`, `grid-engine.ts`, `au-shell-home-view.ts`, `au-fan-card-editor.ts`, `._placeFloorCard`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `lit` connect `AuSensorCard` to `light.ts`, `au-fan-card.ts`, `AuActionCardBase`, `AuRoomCard`, `AuCalendarCard`, `HassEntity`, `au-calendar-card-editor.ts`, `grid-engine.ts`, `Distribution and HACS Feature`, `AuDeviceCard`, `au-vacuum-card.ts`, `._placeFloorCard`, `tokens.ts`, `home-assistant.ts`, `au-shell-grid-home.test.ts`, `au-shell-grid`, `Home Tiles`, `au-device-card-editor.ts`, `Feature: Card contract`, `au-room-card-editor.ts`, `au-fan-card-editor.ts`, `keywords`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `AuSensorCard`, `au-fan-card-editor.ts`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _379 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuShellHomeView` be split into smaller, more focused modules?**
  _Cohesion score 0.04049416609471517 - nodes in this community are weakly interconnected._
- **Should `light.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08074534161490683 - nodes in this community are weakly interconnected._
- **Should `AuTempStepper` be split into smaller, more focused modules?**
  _Cohesion score 0.06881720430107527 - nodes in this community are weakly interconnected._