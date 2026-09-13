# Graph Report - fix-home-card-overflow  (2026-09-13)

## Corpus Check
- 267 files · ~126,424 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2146 nodes · 5592 edges · 116 communities (107 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7f02b68c`
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
- au-device-card.ts
- Edit Mode
- ._renderChildCard
- ._renderEntry
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
- device.ts
- .render
- Device Card
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
- water-heater-timer.ts
- Implementation: Room idle timeout
- action-card.ts
- .render
- config-persist.ts
- Home Tiles
- au-cover-card-editor.ts
- keywords
- Distribution and HACS Feature
- PHASE_0.md
- files
- Action Card
- light-card-layout.ts
- 5. UX flows
- displayColumnsForWidth
- debug.ts
- PULL_REQUEST_TEMPLATE.md
- resolveAction
- CI Verify Job
- dependencies
- activateOnce
- areas.ts
- au-room-card-editor.stories.ts
- repository
- ._findClosestLovelace
- Verification
- PULL_REQUEST_TEMPLATE.md
- Localize
- ._renderAddEntityModal
- prettier
- Installation
- AuFanSpeedSelector
- AuShellGridConfig
- Contributing to AtriumUI
- coverage.test.ts
- au-sensor-card.stories.ts
- au-shell-grid.ts
- storybook.md
- Contributing to AtriumUI
- bindStopBubble
- Security Policy
- repository
- Localize
- main.ts
- tokens.stories.ts
- au-vacuum-card-editor.ts
- repository
- Development
- @mdi/js

## God Nodes (most connected - your core abstractions)
1. `AuShellHomeView` - 148 edges
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

## Communities (116 total, 9 thin omitted)

### Community 0 - "AuShellHomeView"
Cohesion: 0.04
Nodes (10): Phase 3-4 Product Backlog, Session Follow-ups, AuShellHomeView, customElement, property, query, state, childConfigForEntity() (+2 more)

### Community 1 - "light.ts"
Cohesion: 0.08
Nodes (36): AuLightCard, HTMLElementTagNameMap, customElement, state, createDebounced(), isLightCardCompact(), clamp(), formatBrightnessLabel() (+28 more)

### Community 2 - "AuTempStepper"
Cohesion: 0.08
Nodes (14): AuActionCardEditor, customElement, AuCoverCardEditor, customElement, AuFanCardEditor, customElement, AuSensorCardEditor, customElement (+6 more)

### Community 3 - "au-fan-card.ts"
Cohesion: 0.13
Nodes (14): AuCoverCard, customElement, state, closeCover(), COVER_SUPPORT, CoverCapabilities, formatCoverSecondary(), getCoverCapabilities() (+6 more)

### Community 4 - "AuActionCardBase"
Cohesion: 0.07
Nodes (15): ActionSurfaceOptions, AuActionCardBase, humanize(), eventOptions, clearHoldTimer(), clearTapTimer(), createPointerGestureState(), handleGesturePointerCancel() (+7 more)

### Community 5 - "AuRoomCard"
Cohesion: 0.12
Nodes (5): AuRoomCard, customElement, eventOptions, AuRoomCardEntityConfig, normalizeRoomCardEntities()

### Community 6 - "home-edit-room-modal.ts"
Cohesion: 0.15
Nodes (4): AuClimateCard, customElement, state, HassEntity

### Community 7 - "AuShellGrid"
Cohesion: 0.07
Nodes (8): AuShellGrid, customElement, property, query, state, walkAncestors(), ensureCardPickerLoaded(), Lovelace

### Community 8 - "compilerOptions"
Cohesion: 0.04
Nodes (45): DOM, DOM.Iterable, ES2021, stories, .storybook, storybook-static, dist, node_modules (+37 more)

### Community 10 - "index.ts"
Cohesion: 0.07
Nodes (24): Default, Story, Default, Story, Default, Story, Default, Story (+16 more)

### Community 11 - "au-cover-card.ts"
Cohesion: 0.16
Nodes (12): cardTag(), cardTypeHasEditor(), createChildCard(), fallbackCustomCardEntries(), getCardEditorElement(), stubConfigForCardType(), attachChildToHost(), ChildCardMaps (+4 more)

### Community 12 - "AuHomeEntityConfig"
Cohesion: 0.19
Nodes (12): applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag(), beginPointerResize(), computeGridMetrics(), GridMetrics (+4 more)

### Community 13 - "AuCalendarCard"
Cohesion: 0.12
Nodes (39): HTMLElementTagNameMap, VIEW_KEYS, ensureCalendarFullscreenOverlay(), HTMLElementTagNameMap, VIEW_KEYS, AuCalendarEvent, AuCalendarTimeFormat, AuCalendarTimezoneMode (+31 more)

### Community 14 - "HassEntity"
Cohesion: 0.14
Nodes (23): HvacAction, HvacMode, asNumber(), asStringList(), clamp(), ClimateCapabilities, formatFanModeLabel(), formatHvacModeLabel() (+15 more)

### Community 15 - "computeDomain"
Cohesion: 0.20
Nodes (19): HTMLElementTagNameMap, HTMLElementTagNameMap, FAN_SUPPORT, FanCapabilities, formatFanSecondary(), formatFanSpeedLabel(), getFanCapabilities(), getFanDirection() (+11 more)

### Community 16 - "HomeAssistant"
Cohesion: 0.19
Nodes (3): AuFanCard, customElement, state

### Community 17 - "au-calendar-card-editor.ts"
Cohesion: 0.16
Nodes (10): AuCalendarCardEditor, HTMLElementTagNameMap, customElement, AuCalendarFullscreenOpenOptions, AuCalendarFullscreenSync, calendarCardEditorLabels, calendarCardEditorSchema, AuCalendarCardConfig (+2 more)

### Community 18 - "._renderHomeView"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/platform/distribution-hacs.md), Automated, Decisions, Files touched, Goal, Implementation: OSS first-release packaging, Leftover cleanup, Linked official docs (+3 more)

### Community 19 - "grid-engine.ts"
Cohesion: 0.19
Nodes (27): DragState, GridItem, HTMLElementTagNameMap, clampToColumns(), collides(), compact(), computeRowTrackHeightPx(), defaultGridSpan() (+19 more)

### Community 20 - "home-child-config.ts"
Cohesion: 0.12
Nodes (5): AuCalendarFullscreenOverlay, customElement, property, state, isSameLocalDay()

### Community 21 - "Card Contract Feature"
Cohesion: 0.09
Nodes (27): Architecture Card Contract, Card Contract Feature, Action Card, custom:au-action-card, AuActionCardBase, Action Card Content Layout, Calendar Card, Calendar Views (agenda/today/week/month) (+19 more)

### Community 22 - "au-shell-home-view.ts"
Cohesion: 0.12
Nodes (25): DEFAULT_HOME_FLOORS, HTMLElementTagNameMap, commitHomeEditToFloors(), commitRoomEditToFloors(), beginHomeEditDraft(), beginRoomEditDraft(), HomeEditSessionDraft, buildHomeEditItems() (+17 more)

### Community 23 - "home-drag-resize.ts"
Cohesion: 0.15
Nodes (12): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+4 more)

### Community 24 - "au-shell-grid.ts"
Cohesion: 0.12
Nodes (7): AuClimateSelectors, HTMLElementTagNameMap, SelectorPanel, customElement, property, state, fireEvent()

### Community 25 - "Distribution and HACS Feature"
Cohesion: 0.06
Nodes (34): AuActionCard, customElement, AuSensorCard, clamp(), customElement, CARDS, ActionCardInternals, makeActionCard() (+26 more)

### Community 26 - "device.ts"
Cohesion: 0.19
Nodes (16): BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), BULK_OFF_DOMAINS, ROOM_CARD_ENTITY_DOMAINS, ROOM_TOGGLE_DOMAINS, SUPPORTED_DEVICE_DOMAIN_LIST, TOGGLEABLE_DOMAINS (+8 more)

### Community 27 - "AuDeviceCard"
Cohesion: 0.11
Nodes (7): EntityOption, renderAddCardModal(), renderAddEntityModal(), renderAddRoomModal(), renderHomeAddChooser(), resolveDeviceDisplayName(), item()

### Community 28 - "au-vacuum-card.ts"
Cohesion: 0.12
Nodes (18): AuVacuumCard, customElement, ensureVacuumSettingsOverlay(), HTMLElementTagNameMap, SECTION_TABS, ACTIVE_STATES, formatVacuumSecondary(), getVacuumCapabilities() (+10 more)

### Community 29 - "au-vacuum-settings-overlay.ts"
Cohesion: 0.09
Nodes (21): ActionHandlerStub, applyCanvasTheme(), DARK_VARS, defineOnce(), DOMAIN_ICONS, FormSchema, HaEntityPickerStub, HaFormStub (+13 more)

### Community 30 - "Distribution and HACS Feature"
Cohesion: 0.31
Nodes (9): Atrium Home Dashboard Demo, Architecture Domain Card Mapping, Home Rooms Mode, au-shell-grid, Domain to Card Mapping, shell-grid edit-mode fixture (hui-card), Fixture setConfig classic grid cards, shell-grid custom-view edit-mode fixture (lovelace) (+1 more)

### Community 31 - "._placeFloorCard"
Cohesion: 0.15
Nodes (14): AuBaseCard, hasEntityChanged(), property, state, EditRoomModalProps, HomeAssistant, isEntityActive(), entityFingerprint() (+6 more)

### Community 32 - "PRD Decision Log D1-D14"
Cohesion: 0.33
Nodes (7): D10 Action Safety, D2 One Shell Card, D7 Priority Order, PRD Decision Log D1-D14, executeAction Validation Requirement, Unvalidated executeAction Finding, Assessment Priority Order

### Community 33 - "create-child-card.ts"
Cohesion: 0.15
Nodes (4): AuCalendarCard, customElement, state, isAuCalendarView()

### Community 34 - "devDependencies"
Cohesion: 0.09
Nodes (23): eslint, @eslint/js, jsdom, prettier, storybook, @storybook/web-components-vite, @types/node, typescript (+15 more)

### Community 35 - "tokens.ts"
Cohesion: 0.24
Nodes (7): buildRoomTileCardConfig(), ChildConfigOptions, homeAwareCardConfig(), RoomTileCardConfigInput, AuHomeEntityConfig, AuHomeRoomConfig, roomTileInput

### Community 36 - "au-device-card.ts"
Cohesion: 0.28
Nodes (11): DomainControlKind, DomainControlVisibility, resolveDomainControl(), runWaterHeaterTemperature(), getWaterHeaterCapabilities(), getWaterHeaterTemperature(), setWaterHeaterTemperature(), turnOffWaterHeater() (+3 more)

### Community 37 - "Edit Mode"
Cohesion: 0.29
Nodes (7): Vacuum hide_sections, Vacuum Settings Overlay, Vacuum Card, config-persist, Edit Mode Draft/Commit Discipline, Edit Mode, home-edit-commit

### Community 38 - "._renderChildCard"
Cohesion: 0.15
Nodes (16): AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuClimateCardConfig, AuActionCardConfig, AuGridItemLayout, AuSensorCardConfig, AuSeverityThresholds (+8 more)

### Community 40 - "au-shell-grid-home.test.ts"
Cohesion: 0.24
Nodes (6): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector

### Community 41 - "au-shell-grid"
Cohesion: 0.20
Nodes (14): buildVacuumDeviceCatalog(), classifyVacuumSection(), entityLabel(), ESSENTIAL_SUFFIXES, filterCatalogSections(), isEnabledRegistryEntry(), isEssential(), pickMapCamera() (+6 more)

### Community 42 - "Home Tiles"
Cohesion: 0.15
Nodes (5): AuDeviceCard, customElement, state, DomainControlModel, isEntityOffline()

### Community 43 - "compilerOptions"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, dist, node_modules, src, test, compilerOptions, declaration, declarationDir (+6 more)

### Community 44 - "action-tile-layout.ts"
Cohesion: 0.14
Nodes (20): en, TranslationKey, he, isRtlLanguage(), localize(), normalizeLanguage(), RTL_LANGUAGES, TABLES (+12 more)

### Community 45 - "._renderEntry"
Cohesion: 0.22
Nodes (6): AuVacuumSettingsOpenOptions, AuVacuumSettingsOverlay, customElement, property, state, AuVacuumSettingsSection

### Community 46 - "Architecture Specification"
Cohesion: 0.36
Nodes (12): Architecture Specification, Lovelace Design System Principle, Shell Modes Classic and Home, Room Idle Timeout, Phase 0 Shipped Spine, PRD Feature Spec Template, Classic Grid Mode, Shell Grid Feature (+4 more)

### Community 47 - "au-device-card-editor.ts"
Cohesion: 0.07
Nodes (26): Acceptance (from docs/prd/product/room-card.md), Automated, Decisions, Files touched, Goal, Implementation: Room tile temperature, Leftover cleanup, Linked official docs (+18 more)

### Community 49 - "feature/calendar-time-improvements"
Cohesion: 0.18
Nodes (10): Acceptance, Automated, Decisions, feature/calendar-time-improvements, Files touched, Goal, Linked docs, Manual (+2 more)

### Community 50 - "device.ts"
Cohesion: 0.27
Nodes (10): DEDICATED_CARD_DOMAINS, DeviceCapabilities, EXPLICIT_ON_OFF_DOMAINS, getDeviceCapabilities(), isDeviceActive(), isSupportedDeviceDomain(), resolveCardTypeForEntity(), runPrimaryDeviceAction() (+2 more)

### Community 51 - ".render"
Cohesion: 0.06
Nodes (32): Acceptance (from docs/prd/platform/shell-grid.md §7), Automated, Decisions, Files touched, Goal, Implementation: Room idle timeout, Leftover cleanup, Linked official docs (+24 more)

### Community 52 - "Device Card"
Cohesion: 0.27
Nodes (9): AuLightSliderVariant, HTMLElementTagNameMap, AuTempControlMode, HTMLElementTagNameMap, clamp(), snapToStep(), valueFromClientX(), stopPropagation() (+1 more)

### Community 53 - "Feature: Shell grid"
Cohesion: 0.29
Nodes (6): [0.5.4] - 2026-08-25, Added, Added, Changed, Changelog, [Unreleased]

### Community 54 - "au-room-card-editor.ts"
Cohesion: 0.14
Nodes (3): AuTempStepper, customElement, property

### Community 55 - "Feature: Card contract"
Cohesion: 0.11
Nodes (20): Classic, Home, Story, Unavailable, BrightnessOnly, Classic, Home, Hue (+12 more)

### Community 56 - "AuSensorCard"
Cohesion: 0.13
Nodes (27): Design Tokens, lit, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap (+19 more)

### Community 57 - "water-heater-timer.ts"
Cohesion: 0.08
Nodes (22): Acceptance, Automated, Decisions, Files touched, Goal, Implementation: Pages about copy, Leftover cleanup, Linked official docs (+14 more)

### Community 58 - "AuVacuumCard"
Cohesion: 0.22
Nodes (14): ActionConfig, actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS, BLOCKED_HOMEASSISTANT_SERVICES, defaultDoubleTapAction(), defaultHoldAction(), defaultTapAction() (+6 more)

### Community 59 - "au-action-card-editor.ts"
Cohesion: 0.17
Nodes (11): Acceptance, Automated, Decisions, Files touched, Goal, Implementation: GitHub Pages landing site, Leftover cleanup, Linked official docs (+3 more)

### Community 60 - "format-clock.ts"
Cohesion: 0.14
Nodes (14): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 5. UX flows, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies (+6 more)

### Community 61 - "au-fan-card-editor.ts"
Cohesion: 0.15
Nodes (12): author, bugs, url, description, homepage, license, main, module (+4 more)

### Community 62 - "AuSwitchCard"
Cohesion: 0.18
Nodes (5): AuSwitchCard, customElement, formatSwitchSecondary(), toggleSwitch(), validateSwitchEntity()

### Community 63 - "water-heater-timer.ts"
Cohesion: 0.33
Nodes (8): clampTimerMinutes(), clearTimerEndsAt(), formatTimerRemaining(), normalizeTimerPresets(), readTimerEndsAt(), storageKey(), WH_TIMER_DEFAULT_PRESETS, writeTimerEndsAt()

### Community 64 - "Implementation: Room idle timeout"
Cohesion: 0.15
Nodes (4): applyVacuumDraft(), pressVacuumButton(), VacuumDraftValue, VacuumSettingsDraft

### Community 65 - "action-card.ts"
Cohesion: 0.28
Nodes (5): AuLightCardEditor, HTMLElementTagNameMap, customElement, lightCardEditorLabels, lightCardEditorSchema

### Community 66 - ".render"
Cohesion: 0.15
Nodes (13): Action Card, Calendar Card, Climate Card, Cover Card, Device Card, Fan Card, Light Card, Sensor Card (+5 more)

### Community 67 - "config-persist.ts"
Cohesion: 0.25
Nodes (7): Classic, ClassicButtons, Home, HomeButtons, homeGlance, homeSpeed, Story

### Community 68 - "Home Tiles"
Cohesion: 0.24
Nodes (10): custom:au-room-card, Room Card, Shell Room Controls, Sensor Home Variant Path, Sensor Linear Gauge, Sensor Card, Sensor Severity Thresholds, auHomeTileStyles (+2 more)

### Community 69 - "au-cover-card-editor.ts"
Cohesion: 0.19
Nodes (11): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, coverCardEditorLabels, coverCardEditorSchema, HTMLElementTagNameMap, fanCardEditorLabels, fanCardEditorSchema (+3 more)

### Community 70 - "keywords"
Cohesion: 0.33
Nodes (6): custom-card, design-system, hacs, home-assistant, lovelace, keywords

### Community 71 - "Distribution and HACS Feature"
Cohesion: 0.38
Nodes (7): Locked Architecture Constraints C1-C12, Install and Lovelace Resource Ops, npm run dev:ha, Local Dev Against Home Assistant, Distribution and HACS Feature, Healthy Reuse Guardrails, HACS Installation

### Community 72 - "PHASE_0.md"
Cohesion: 0.10
Nodes (19): frame(), Default, Home, selectors(), Story, Horizontal, speed(), Story (+11 more)

### Community 73 - "files"
Cohesion: 0.40
Nodes (5): dist, hacs.json, LICENSE, README.md, files

### Community 74 - "Action Card"
Cohesion: 0.11
Nodes (20): Classic, ClassicButtons, Home, HomeButtons, Story, Classic, Home, Story (+12 more)

### Community 75 - "light-card-layout.ts"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 76 - "5. UX flows"
Cohesion: 0.14
Nodes (13): 1. Problem & user story, 2. In / out of scope, 3. Config / data model, 4. Behaviors & business rules, 5. UX flows, 6. Edge cases & errors, 7. Acceptance criteria, 8. Dependencies (+5 more)

### Community 77 - "displayColumnsForWidth"
Cohesion: 0.28
Nodes (3): entriesForSection(), roomDisplayName(), VacuumDeviceCatalog

### Community 78 - "debug.ts"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/product/calendar-card.md), Automated, Decisions, feature/calendar-fullscreen, Files touched, Goal, Leftover cleanup, Linked docs (+3 more)

### Community 81 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.14
Nodes (23): CardEditorMode, HTMLElementTagNameMap, NavView, addEditRoomMember(), buildEditRoomDraft(), controlsFromEditDraft(), EditRoomAddCandidate, EditRoomDraft (+15 more)

### Community 82 - "resolveAction"
Cohesion: 0.42
Nodes (8): CARD_TYPE_LOCKED_KEY, cardTypeShort(), isRemappableAuCardType(), normalizeAuHomeCardConfig(), NormalizeAuHomeCardResult, recommendedAuCardType(), REMAPPABLE_AU_CARD_TYPES, withCustomCardPrefix()

### Community 83 - "CI Verify Job"
Cohesion: 0.67
Nodes (3): CI Workflow, CI Verify Job, npm run verify

### Community 84 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

### Community 85 - "activateOnce"
Cohesion: 0.27
Nodes (3): AuLightSlider, customElement, property

### Community 86 - "areas.ts"
Cohesion: 0.28
Nodes (5): AuClimateCardEditor, HTMLElementTagNameMap, customElement, climateCardEditorLabels, climateCardEditorSchema

### Community 88 - "repository"
Cohesion: 0.29
Nodes (7): Phase 1 Home Visual Consistency, Phase 2 Security and Runtime, Phase 3 Bundle and Perf, Phase 4 Architecture and DX, Always-On Device Timer Finding, Home Visual Drift Finding, Home Design Tokens

### Community 89 - "._findClosestLovelace"
Cohesion: 0.17
Nodes (12): scripts, build, build-storybook, dev, dev:ha, format, lint, storybook (+4 more)

### Community 90 - "Verification"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/platform/storybook.md), Automated, Decisions, feature/storybook, Files touched, Goal, Leftover cleanup, Linked docs (+3 more)

### Community 91 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.50
Nodes (3): Manual (if UI / Lovelace), Summary, Test plan

### Community 92 - "Localize"
Cohesion: 0.17
Nodes (12): AtriumUI, Components, Contributing, Design system, HACS (recommended), Installation, License, Manual (+4 more)

### Community 93 - "._renderAddEntityModal"
Cohesion: 0.17
Nodes (9): Default, Story, demoClassicConfig, demoHomeConfig, Classic, Home, Story, Overview (+1 more)

### Community 94 - "prettier"
Cohesion: 0.18
Nodes (10): Acceptance (from docs/prd/platform/shell-grid.md, docs/prd/ux/edit-mode.md), Automated, Decisions, Files touched, fix/home-card-overflow, Goal, Linked docs, Manual (+2 more)

### Community 95 - "Installation"
Cohesion: 0.18
Nodes (6): AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels, roomCardEditorSchema, AuRoomCardConfig

### Community 96 - "AuFanSpeedSelector"
Cohesion: 0.22
Nodes (4): AuFanSpeedSelector, customElement, property, state

### Community 97 - "AuShellGridConfig"
Cohesion: 0.22
Nodes (8): applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem, AuGridCardConfig, AuShellGridConfig, LovelaceCardConfig, baseGrid

### Community 98 - "Contributing to AtriumUI"
Cohesion: 0.16
Nodes (11): CustomCardEntry, HassArea, HassDevice, HassEntityAttributeBase, HassFloor, HassThemes, HassUser, Window (+3 more)

### Community 101 - "coverage.test.ts"
Cohesion: 0.40
Nodes (5): collect(), ROOT, SRC, STORIES, walkTs()

### Community 102 - "au-sensor-card.stories.ts"
Cohesion: 0.19
Nodes (7): Agenda, Month, Story, Classic, config, Home, Story

### Community 103 - "au-shell-grid.ts"
Cohesion: 0.50
Nodes (5): formatTemperature(), getCurrentTemperature(), getHvacAction(), getHvacMode(), getTemperatureUnit()

### Community 104 - "storybook.md"
Cohesion: 0.29
Nodes (4): Commands, Isolation, Ops: Storybook catalog, What you see

### Community 105 - "Contributing to AtriumUI"
Cohesion: 0.29
Nodes (7): Contributing to AtriumUI, Development setup, How to report issues, Making a change, Project constraints (do not break), Pull request checklist, Support the project

### Community 107 - "Security Policy"
Cohesion: 0.50
Nodes (3): Reporting a vulnerability, Security Policy, Supported versions

### Community 109 - "Localize"
Cohesion: 0.67
Nodes (4): hass.language Locale Source, Hebrew RTL Support, Localize Catalogs (en/ru/he), Localize

### Community 115 - "au-vacuum-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuVacuumCardEditor, HTMLElementTagNameMap, customElement, vacuumCardEditorLabels, vacuumCardEditorSchema

### Community 116 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 117 - "Development"
Cohesion: 0.67
Nodes (3): Demo YAML, Development, Home Assistant watch build (`dev:ha`)

## Knowledge Gaps
- **525 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `config` (+520 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuShellHomeView` connect `AuShellHomeView` to `AuShellGridConfig`, `tokens.ts`, `index.ts`, `au-cover-card.ts`, `AuHomeEntityConfig`, `Architecture Specification`, `PULL_REQUEST_TEMPLATE.md`, `grid-engine.ts`, `au-shell-home-view.ts`, `AuDeviceCard`, `._renderAddEntityModal`, `._placeFloorCard`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `lit` connect `AuSensorCard` to `light.ts`, `AuActionCardBase`, `AuCalendarCard`, `computeDomain`, `au-calendar-card-editor.ts`, `grid-engine.ts`, `au-shell-home-view.ts`, `au-shell-grid.ts`, `AuDeviceCard`, `au-vacuum-card.ts`, `au-vacuum-settings-overlay.ts`, `._placeFloorCard`, `au-shell-grid-home.test.ts`, `Device Card`, `action-card.ts`, `au-cover-card-editor.ts`, `keywords`, `PULL_REQUEST_TEMPLATE.md`, `areas.ts`, `Installation`, `tokens.stories.ts`, `au-vacuum-card-editor.ts`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `HomeAssistant` connect `._placeFloorCard` to `AuShellHomeView`, `light.ts`, `AuTempStepper`, `au-fan-card.ts`, `au-cover-card.ts`, `AuCalendarCard`, `HassEntity`, `computeDomain`, `au-shell-home-view.ts`, `Distribution and HACS Feature`, `device.ts`, `AuDeviceCard`, `au-vacuum-card.ts`, `au-device-card.ts`, `au-shell-grid`, `._renderEntry`, `device.ts`, `Feature: Card contract`, `AuSensorCard`, `AuVacuumCard`, `AuSwitchCard`, `Implementation: Room idle timeout`, `Action Card`, `PULL_REQUEST_TEMPLATE.md`, `Contributing to AtriumUI`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _525 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuShellHomeView` be split into smaller, more focused modules?**
  _Cohesion score 0.04417952314165498 - nodes in this community are weakly interconnected._
- **Should `light.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08472344161545214 - nodes in this community are weakly interconnected._
- **Should `AuTempStepper` be split into smaller, more focused modules?**
  _Cohesion score 0.07671957671957672 - nodes in this community are weakly interconnected._