# Graph Report - feature-storybook  (2026-09-13)

## Corpus Check
- 266 files · ~125,418 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2127 nodes · 5564 edges · 104 communities (96 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6b405eab`
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
- PRD Decision Log D1-D14
- create-child-card.ts
- devDependencies
- tokens.ts
- Edit Mode
- ._renderChildCard
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
- .render
- Feature: Shell grid
- au-room-card-editor.ts
- Feature: Card contract
- AuSensorCard
- water-heater-timer.ts
- AuVacuumCard
- au-action-card-editor.ts
- format-clock.ts
- au-fan-card-editor.ts
- AuSwitchCard
- Implementation: Room idle timeout
- action-card.ts
- .render
- config-persist.ts
- Home Tiles
- au-cover-card-editor.ts
- keywords
- PHASE_0.md
- files
- Action Card
- light-card-layout.ts
- 5. UX flows
- debug.ts
- PULL_REQUEST_TEMPLATE.md
- resolveAction
- CI Verify Job
- dependencies
- activateOnce
- areas.ts
- repository
- ._findClosestLovelace
- Verification
- PULL_REQUEST_TEMPLATE.md
- Localize
- ._renderAddEntityModal
- Installation
- Contributing to AtriumUI
- Action Card
- AuActionCard
- coverage.test.ts
- au-sensor-card.stories.ts
- au-shell-grid.ts
- Security Policy
- repository
- home-assistant.ts
- main.ts
- action-card-base.test.ts
- au-vacuum-card-editor.ts
- AuCoverCardEditor
- shell-grid-add-card.test.ts
- au-climate-card-editor.stories.ts
- typescript

## God Nodes (most connected - your core abstractions)
1. `AuShellHomeView` - 146 edges
2. `HassEntity` - 90 edges
3. `AuShellGrid` - 62 edges
4. `AuActionCardBase` - 57 edges
5. `computeDomain()` - 57 edges
6. `AuCalendarFullscreenOverlay` - 48 edges
7. `makeHass()` - 47 edges
8. `lit` - 45 edges
9. `AuVacuumSettingsOverlay` - 45 edges
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

## Communities (104 total, 8 thin omitted)

### Community 0 - "AuShellHomeView"
Cohesion: 0.05
Nodes (7): Phase 3-4 Product Backlog, Session Follow-ups, AuShellHomeView, customElement, property, query, state

### Community 1 - "light.ts"
Cohesion: 0.08
Nodes (36): AuLightCard, HTMLElementTagNameMap, customElement, state, createDebounced(), isLightCardCompact(), clamp(), formatBrightnessLabel() (+28 more)

### Community 2 - "AuTempStepper"
Cohesion: 0.09
Nodes (12): AuActionCardEditor, customElement, AuFanCardEditor, customElement, AuSensorCardEditor, customElement, AuSwitchCardEditor, customElement (+4 more)

### Community 3 - "au-fan-card.ts"
Cohesion: 0.05
Nodes (44): AuCoverCard, HTMLElementTagNameMap, customElement, state, AuFanCard, HTMLElementTagNameMap, customElement, state (+36 more)

### Community 4 - "AuActionCardBase"
Cohesion: 0.05
Nodes (30): ActionSurfaceOptions, AuActionCardBase, humanize(), eventOptions, ActionConfig, actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS (+22 more)

### Community 5 - "AuRoomCard"
Cohesion: 0.06
Nodes (21): AuRoomCard, HTMLElementTagNameMap, customElement, eventOptions, AuBaseCard, hasEntityChanged(), property, state (+13 more)

### Community 6 - "home-edit-room-modal.ts"
Cohesion: 0.15
Nodes (13): Action Card, Calendar Card, Climate Card, Cover Card, Device Card, Fan Card, Light Card, Sensor Card (+5 more)

### Community 7 - "AuShellGrid"
Cohesion: 0.09
Nodes (5): AuShellGrid, customElement, property, query, state

### Community 8 - "compilerOptions"
Cohesion: 0.04
Nodes (45): DOM, DOM.Iterable, ES2021, stories, .storybook, storybook-static, compilerOptions, alwaysStrict (+37 more)

### Community 10 - "index.ts"
Cohesion: 0.08
Nodes (21): Default, Story, Default, Story, Default, Story, Default, Story (+13 more)

### Community 11 - "au-cover-card.ts"
Cohesion: 0.14
Nodes (12): cardTag(), cardTypeHasEditor(), createChildCard(), fallbackCustomCardEntries(), getCardEditorElement(), stubConfigForCardType(), attachChildToHost(), ChildCardMaps (+4 more)

### Community 12 - "AuHomeEntityConfig"
Cohesion: 0.28
Nodes (11): applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag(), beginPointerResize(), computeGridMetrics(), GridMetrics (+3 more)

### Community 13 - "AuCalendarCard"
Cohesion: 0.19
Nodes (25): HTMLElementTagNameMap, VIEW_KEYS, buildMonthGrid(), CallServiceWithResponse, compileFilter(), computeFetchWindow(), computeMonthGridWindow(), endOfLocalDay() (+17 more)

### Community 14 - "HassEntity"
Cohesion: 0.06
Nodes (39): AuClimateCard, HTMLElementTagNameMap, customElement, state, AuClimateSelectors, HTMLElementTagNameMap, SelectorPanel, customElement (+31 more)

### Community 15 - "computeDomain"
Cohesion: 0.17
Nodes (12): AtriumUI, Components, Contributing, Demo YAML, Design system, Development, Home Assistant watch build (`dev:ha`), License (+4 more)

### Community 16 - "HomeAssistant"
Cohesion: 0.28
Nodes (5): AuLightCardEditor, HTMLElementTagNameMap, customElement, lightCardEditorLabels, lightCardEditorSchema

### Community 17 - "au-calendar-card-editor.ts"
Cohesion: 0.11
Nodes (20): AuCalendarCardEditor, HTMLElementTagNameMap, customElement, AuCalendarFullscreenOpenOptions, AuCalendarFullscreenSync, ensureCalendarFullscreenOverlay(), HTMLElementTagNameMap, VIEW_KEYS (+12 more)

### Community 18 - "._renderHomeView"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/platform/distribution-hacs.md), Automated, Decisions, Files touched, Goal, Implementation: OSS first-release packaging, Leftover cleanup, Linked official docs (+3 more)

### Community 19 - "grid-engine.ts"
Cohesion: 0.30
Nodes (16): clampToColumns(), collides(), compact(), computeRowTrackHeightPx(), deriveResponsiveLayout(), displayColumnsForWidth(), findFreeSlot(), getFirstCollision() (+8 more)

### Community 20 - "home-child-config.ts"
Cohesion: 0.13
Nodes (4): AuCalendarFullscreenOverlay, customElement, property, state

### Community 21 - "Card Contract Feature"
Cohesion: 0.09
Nodes (26): Architecture Card Contract, Card Contract Feature, Calendar Card, Calendar Views (agenda/today/week/month), calendar.get_events API, Climate Card, HVAC Mode Selector, Climate Temperature Control (+18 more)

### Community 22 - "au-shell-home-view.ts"
Cohesion: 0.13
Nodes (30): CardEditorMode, HTMLElementTagNameMap, NavView, commitHomeEditToFloors(), commitRoomEditToFloors(), beginHomeEditDraft(), beginRoomEditDraft(), emptyEditSessionDraft() (+22 more)

### Community 23 - "home-drag-resize.ts"
Cohesion: 0.15
Nodes (12): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+4 more)

### Community 24 - "au-shell-grid.ts"
Cohesion: 0.29
Nodes (4): Commands, Isolation, Ops: Storybook catalog, What you see

### Community 25 - "Distribution and HACS Feature"
Cohesion: 0.16
Nodes (15): CARDS, makeCalendarHass(), renderClimateCard(), renderCoverCard(), renderDeviceCard(), renderFanCard(), renderLightCard(), renderRoomCard() (+7 more)

### Community 26 - "device.ts"
Cohesion: 0.23
Nodes (10): HTMLElementTagNameMap, BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), BULK_OFF_DOMAINS, isEntityActive(), isUnavailable(), buildPresenceItems() (+2 more)

### Community 27 - "AuDeviceCard"
Cohesion: 0.33
Nodes (6): Action Card, custom:au-action-card, AuActionCardBase, Action Card Content Layout, Switch Explicit turn_on/turn_off, Switch Card

### Community 28 - "au-vacuum-card.ts"
Cohesion: 0.23
Nodes (17): HTMLElementTagNameMap, ensureVacuumSettingsOverlay(), HTMLElementTagNameMap, SECTION_TABS, ACTIVE_STATES, formatVacuumSecondary(), getVacuumCapabilities(), isVacuumActive() (+9 more)

### Community 29 - "au-vacuum-settings-overlay.ts"
Cohesion: 0.09
Nodes (21): ActionHandlerStub, applyCanvasTheme(), DARK_VARS, defineOnce(), DOMAIN_ICONS, FormSchema, HaEntityPickerStub, HaFormStub (+13 more)

### Community 30 - "Distribution and HACS Feature"
Cohesion: 0.21
Nodes (14): Atrium Home Dashboard Demo, Architecture Domain Card Mapping, Install and Lovelace Resource Ops, npm run dev:ha, Local Dev Against Home Assistant, Distribution and HACS Feature, Home Rooms Mode, au-shell-grid (+6 more)

### Community 32 - "PRD Decision Log D1-D14"
Cohesion: 0.33
Nodes (7): D10 Action Safety, D2 One Shell Card, D7 Priority Order, PRD Decision Log D1-D14, executeAction Validation Requirement, Unvalidated executeAction Finding, Assessment Priority Order

### Community 33 - "create-child-card.ts"
Cohesion: 0.14
Nodes (7): AuCalendarCard, customElement, state, AuCalendarEvent, formatDayHeader(), MonthDayChip, MonthSpanBar

### Community 34 - "devDependencies"
Cohesion: 0.09
Nodes (23): eslint, @eslint/js, jsdom, @mdi/js, devDependencies, eslint, @eslint/js, jsdom (+15 more)

### Community 35 - "tokens.ts"
Cohesion: 0.24
Nodes (6): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector

### Community 37 - "Edit Mode"
Cohesion: 0.40
Nodes (5): Vacuum Settings Overlay, config-persist, Edit Mode Draft/Commit Discipline, Edit Mode, home-edit-commit

### Community 38 - "._renderChildCard"
Cohesion: 0.19
Nodes (15): AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuActionCardConfig, AuGridItemLayout, AuSeverityThresholds, AuCoverCardConfig, AuDeviceCardConfig (+7 more)

### Community 40 - "au-shell-grid-home.test.ts"
Cohesion: 0.14
Nodes (13): AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels, roomCardEditorSchema, DEFAULT_HOME_FLOORS, HTMLElementTagNameMap, ROOM_CARD_ENTITY_DOMAINS (+5 more)

### Community 41 - "au-shell-grid"
Cohesion: 0.20
Nodes (17): computeDomain(), buildVacuumDeviceCatalog(), classifyVacuumSection(), entityLabel(), entriesForSection(), ESSENTIAL_SUFFIXES, filterCatalogSections(), isEnabledRegistryEntry() (+9 more)

### Community 42 - "Home Tiles"
Cohesion: 0.07
Nodes (33): AuDeviceCard, HTMLElementTagNameMap, customElement, state, DEDICATED_CARD_DOMAINS, DeviceCapabilities, EXPLICIT_ON_OFF_DOMAINS, getDeviceCapabilities() (+25 more)

### Community 43 - "compilerOptions"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, dist, node_modules, src, test, compilerOptions, declaration, declarationDir (+6 more)

### Community 44 - "action-tile-layout.ts"
Cohesion: 0.17
Nodes (16): hass.language Locale Source, Hebrew RTL Support, Localize Catalogs (en/ru/he), Localize, en, TranslationKey, he, isRtlLanguage() (+8 more)

### Community 45 - "._renderEntry"
Cohesion: 0.11
Nodes (10): AuVacuumSettingsOpenOptions, AuVacuumSettingsOverlay, customElement, property, state, AuVacuumSettingsSection, roomDisplayName(), VacuumCatalogEntry (+2 more)

### Community 46 - "Architecture Specification"
Cohesion: 0.30
Nodes (14): Architecture Specification, Locked Architecture Constraints C1-C12, Lovelace Design System Principle, Shell Modes Classic and Home, Room Idle Timeout, Phase 0 Shipped Spine, PRD Feature Spec Template, Classic Grid Mode (+6 more)

### Community 47 - "au-device-card-editor.ts"
Cohesion: 0.07
Nodes (26): Acceptance (from docs/prd/product/room-card.md), Automated, Decisions, Files touched, Goal, Implementation: Room tile temperature, Leftover cleanup, Linked official docs (+18 more)

### Community 49 - "feature/calendar-time-improvements"
Cohesion: 0.18
Nodes (10): Acceptance, Automated, Decisions, feature/calendar-time-improvements, Files touched, Goal, Linked docs, Manual (+2 more)

### Community 51 - ".render"
Cohesion: 0.06
Nodes (32): Acceptance (from docs/prd/platform/shell-grid.md §7), Automated, Decisions, Files touched, Goal, Implementation: Room idle timeout, Leftover cleanup, Linked official docs (+24 more)

### Community 53 - "Feature: Shell grid"
Cohesion: 0.29
Nodes (6): [0.5.4] - 2026-08-25, Added, Added, Changed, Changelog, [Unreleased]

### Community 54 - "au-room-card-editor.ts"
Cohesion: 0.06
Nodes (17): AuLightSlider, AuLightSliderVariant, HTMLElementTagNameMap, customElement, property, AuTempControlMode, AuTempStepper, HTMLElementTagNameMap (+9 more)

### Community 55 - "Feature: Card contract"
Cohesion: 0.11
Nodes (20): Classic, Home, Story, Unavailable, BrightnessOnly, Classic, Home, Hue (+12 more)

### Community 56 - "AuSensorCard"
Cohesion: 0.13
Nodes (13): lit, AuSensorCard, HTMLElementTagNameMap, HTMLElementTagNameMap, SeverityLevel, customElement, CardRootOptions, auCardContentLayout (+5 more)

### Community 57 - "water-heater-timer.ts"
Cohesion: 0.08
Nodes (22): Acceptance, Automated, Decisions, Files touched, Goal, Implementation: Pages about copy, Leftover cleanup, Linked official docs (+14 more)

### Community 58 - "AuVacuumCard"
Cohesion: 0.20
Nodes (3): AuVacuumCard, customElement, isEntityOffline()

### Community 59 - "au-action-card-editor.ts"
Cohesion: 0.17
Nodes (11): Acceptance, Automated, Decisions, Files touched, Goal, Implementation: GitHub Pages landing site, Leftover cleanup, Linked official docs (+3 more)

### Community 60 - "format-clock.ts"
Cohesion: 0.21
Nodes (10): formatEventTimeRange(), packMonthDayChips(), ClockDateFormat, ClockDayFormat, ClockFormat, formatClock(), formatClockDate(), formatClockWeekday() (+2 more)

### Community 61 - "au-fan-card-editor.ts"
Cohesion: 0.10
Nodes (18): addEditRoomMember(), buildEditRoomDraft(), controlsFromEditDraft(), EditRoomAddCandidate, EditRoomDraft, EditRoomModalHandlers, moveEditRoomMember(), renderEditRoomModal() (+10 more)

### Community 62 - "AuSwitchCard"
Cohesion: 0.18
Nodes (6): AuSwitchCard, HTMLElementTagNameMap, customElement, formatSwitchSecondary(), toggleSwitch(), validateSwitchEntity()

### Community 65 - "action-card.ts"
Cohesion: 0.10
Nodes (8): EntityOption, renderAddCardModal(), renderAddEntityModal(), renderAddRoomModal(), renderCardEditorModal(), renderHomeAddChooser(), resolveDeviceDisplayName(), item()

### Community 67 - "config-persist.ts"
Cohesion: 0.19
Nodes (8): applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem, AuGridCardConfig, AuShellGridConfig, isShellHomeMode(), baseGrid

### Community 68 - "Home Tiles"
Cohesion: 0.31
Nodes (10): Sensor Home Variant Path, Sensor Linear Gauge, Sensor Card, Sensor Severity Thresholds, Design Tokens, auHomeTileStyles, Home Tiles, variant: home (+2 more)

### Community 69 - "au-cover-card-editor.ts"
Cohesion: 0.21
Nodes (10): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, HTMLElementTagNameMap, fanCardEditorLabels, fanCardEditorSchema, HTMLElementTagNameMap (+2 more)

### Community 70 - "keywords"
Cohesion: 0.33
Nodes (6): keywords, custom-card, design-system, hacs, home-assistant, lovelace

### Community 72 - "PHASE_0.md"
Cohesion: 0.10
Nodes (19): frame(), Default, Home, selectors(), Story, Horizontal, speed(), Story (+11 more)

### Community 73 - "files"
Cohesion: 0.40
Nodes (5): files, dist, hacs.json, LICENSE, README.md

### Community 74 - "Action Card"
Cohesion: 0.08
Nodes (21): Classic, ClassicButtons, Home, HomeButtons, Story, Classic, Home, Story (+13 more)

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
Cohesion: 0.36
Nodes (3): RoomTileCardConfigInput, AuHomeEntityConfig, AuHomeRoomConfig

### Community 82 - "resolveAction"
Cohesion: 0.22
Nodes (13): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, homeAwareCardConfig(), CARD_TYPE_LOCKED_KEY, cardTypeShort(), isRemappableAuCardType(), normalizeAuHomeCardConfig() (+5 more)

### Community 83 - "CI Verify Job"
Cohesion: 0.67
Nodes (3): CI Workflow, CI Verify Job, npm run verify

### Community 84 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

### Community 85 - "activateOnce"
Cohesion: 0.14
Nodes (14): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 5. UX flows, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies (+6 more)

### Community 86 - "areas.ts"
Cohesion: 0.28
Nodes (5): AuClimateCardEditor, HTMLElementTagNameMap, customElement, climateCardEditorLabels, climateCardEditorSchema

### Community 88 - "repository"
Cohesion: 0.29
Nodes (7): Phase 1 Home Visual Consistency, Phase 2 Security and Runtime, Phase 3 Bundle and Perf, Phase 4 Architecture and DX, Always-On Device Timer Finding, Home Visual Drift Finding, Home Design Tokens

### Community 89 - "._findClosestLovelace"
Cohesion: 0.15
Nodes (12): author, bugs, url, description, homepage, license, main, module (+4 more)

### Community 90 - "Verification"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/platform/storybook.md), Automated, Decisions, feature/storybook, Files touched, Goal, Leftover cleanup, Linked docs (+3 more)

### Community 91 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.50
Nodes (3): Manual (if UI / Lovelace), Summary, Test plan

### Community 92 - "Localize"
Cohesion: 0.17
Nodes (12): scripts, build, build-storybook, dev, dev:ha, format, lint, storybook (+4 more)

### Community 93 - "._renderAddEntityModal"
Cohesion: 0.17
Nodes (9): Default, Story, demoClassicConfig, demoHomeConfig, Classic, Home, Story, Overview (+1 more)

### Community 95 - "Installation"
Cohesion: 0.67
Nodes (3): HACS (recommended), Installation, Manual

### Community 98 - "Contributing to AtriumUI"
Cohesion: 0.29
Nodes (7): Contributing to AtriumUI, Development setup, How to report issues, Making a change, Project constraints (do not break), Pull request checklist, Support the project

### Community 100 - "AuActionCard"
Cohesion: 0.17
Nodes (9): FakeCard, FakeEditor, HomeViewTestApi, renderIdleHome(), renderShell(), roomTileCard(), roomTileChips(), roomTileHost() (+1 more)

### Community 101 - "coverage.test.ts"
Cohesion: 0.40
Nodes (5): collect(), ROOT, SRC, STORIES, walkTs()

### Community 102 - "au-sensor-card.stories.ts"
Cohesion: 0.40
Nodes (4): Classic, config, Home, Story

### Community 103 - "au-shell-grid.ts"
Cohesion: 0.18
Nodes (10): DragState, GridItem, HTMLElementTagNameMap, walkAncestors(), GridItemLike, GridPos, gridRowCount(), resolveRowTrackCount() (+2 more)

### Community 107 - "Security Policy"
Cohesion: 0.50
Nodes (3): Reporting a vulnerability, Security Policy, Supported versions

### Community 108 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 110 - "home-assistant.ts"
Cohesion: 0.13
Nodes (17): clamp(), CustomCardEntry, HassArea, HassDevice, HassEntityAttributeBase, HassFloor, HassThemes, HassUser (+9 more)

### Community 114 - "action-card-base.test.ts"
Cohesion: 0.33
Nodes (5): AuActionCard, customElement, ActionCardInternals, makeActionCard(), renderActionCard()

### Community 115 - "au-vacuum-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuVacuumCardEditor, HTMLElementTagNameMap, customElement, vacuumCardEditorLabels, vacuumCardEditorSchema

### Community 119 - "AuCoverCardEditor"
Cohesion: 0.28
Nodes (5): AuCoverCardEditor, HTMLElementTagNameMap, customElement, coverCardEditorLabels, coverCardEditorSchema

### Community 121 - "au-climate-card-editor.stories.ts"
Cohesion: 0.14
Nodes (10): Agenda, Month, Story, Default, Story, Default, Story, demoHass (+2 more)

## Knowledge Gaps
- **513 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `config` (+508 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuShellHomeView` connect `AuShellHomeView` to `action-card.ts`, `config-persist.ts`, `AuRoomCard`, `au-shell-grid.ts`, `au-cover-card.ts`, `AuHomeEntityConfig`, `Architecture Specification`, `PULL_REQUEST_TEMPLATE.md`, `._renderAddEntityModal`, `au-shell-home-view.ts`, `format-clock.ts`, `au-fan-card-editor.ts`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `lit` connect `AuSensorCard` to `light.ts`, `au-fan-card.ts`, `AuActionCardBase`, `AuRoomCard`, `AuCalendarCard`, `HassEntity`, `HomeAssistant`, `au-calendar-card-editor.ts`, `au-shell-home-view.ts`, `device.ts`, `au-vacuum-card.ts`, `au-vacuum-settings-overlay.ts`, `tokens.ts`, `au-shell-grid-home.test.ts`, `Home Tiles`, `au-room-card-editor.ts`, `au-fan-card-editor.ts`, `AuSwitchCard`, `action-card.ts`, `au-cover-card-editor.ts`, `keywords`, `areas.ts`, `au-shell-grid.ts`, `au-vacuum-card-editor.ts`, `AuCoverCardEditor`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `HomeAssistant` connect `AuRoomCard` to `AuShellHomeView`, `light.ts`, `AuTempStepper`, `au-fan-card.ts`, `AuActionCardBase`, `index.ts`, `au-cover-card.ts`, `AuCalendarCard`, `HassEntity`, `au-shell-home-view.ts`, `Distribution and HACS Feature`, `device.ts`, `au-vacuum-card.ts`, `au-shell-grid-home.test.ts`, `au-shell-grid`, `Home Tiles`, `._renderEntry`, `Feature: Card contract`, `au-fan-card-editor.ts`, `AuSwitchCard`, `action-card.ts`, `home-assistant.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _513 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuShellHomeView` be split into smaller, more focused modules?**
  _Cohesion score 0.05341614906832298 - nodes in this community are weakly interconnected._
- **Should `light.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08074534161490683 - nodes in this community are weakly interconnected._
- **Should `AuTempStepper` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._