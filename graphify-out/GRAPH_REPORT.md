# Graph Report - docs-pages-hero-theme  (2026-08-25)

## Corpus Check
- 219 files · ~116,577 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1866 nodes · 5104 edges · 95 communities (90 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `289ab582`
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
- 5. UX flows
- repository
- 2. In / out of scope
- AuVacuumSettingsSection
- PULL_REQUEST_TEMPLATE.md
- Calendar Card
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

## Communities (95 total, 5 thin omitted)

### Community 0 - "AuShellHomeView"
Cohesion: 0.05
Nodes (11): Phase 3-4 Product Backlog, Session Follow-ups, AuShellHomeView, customElement, property, query, state, renderAddEntityModal() (+3 more)

### Community 1 - "light.ts"
Cohesion: 0.09
Nodes (32): AuLightCard, customElement, state, LightColorMode, createDebounced(), isLightCardCompact(), clamp(), formatBrightnessLabel() (+24 more)

### Community 2 - "AuTempStepper"
Cohesion: 0.09
Nodes (12): AuActionCardEditor, customElement, AuFanCardEditor, customElement, AuLightCardEditor, customElement, AuSensorCardEditor, customElement (+4 more)

### Community 3 - "au-fan-card.ts"
Cohesion: 0.12
Nodes (15): AuCoverCard, customElement, state, closeCover(), COVER_SUPPORT, CoverCapabilities, formatCoverSecondary(), getCoverCapabilities() (+7 more)

### Community 4 - "AuActionCardBase"
Cohesion: 0.08
Nodes (3): AuActionCardBase, humanize(), eventOptions

### Community 5 - "AuRoomCard"
Cohesion: 0.11
Nodes (7): AuRoomCard, customElement, eventOptions, AuRoomCardEntityConfig, activateOnce(), markActivated(), recentActivate

### Community 6 - "home-edit-room-modal.ts"
Cohesion: 0.15
Nodes (12): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, RoomTileCardConfigInput, collectRoomToggleEntities(), entityIsOn(), isToggleDomain(), resolveRoomControls() (+4 more)

### Community 7 - "AuShellGrid"
Cohesion: 0.10
Nodes (7): AuShellGrid, customElement, property, query, state, walkAncestors(), Lovelace

### Community 8 - "compilerOptions"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, dist, node_modules, src, test, compilerOptions (+34 more)

### Community 10 - "index.ts"
Cohesion: 0.15
Nodes (20): ActionConfig, actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS, BLOCKED_HOMEASSISTANT_SERVICES, defaultDoubleTapAction(), defaultHoldAction(), defaultTapAction() (+12 more)

### Community 11 - "au-cover-card.ts"
Cohesion: 0.13
Nodes (8): applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem, homeAwareCardConfig(), AuGridCardConfig, LovelaceCardConfig, baseGrid

### Community 12 - "AuHomeEntityConfig"
Cohesion: 0.42
Nodes (8): CARD_TYPE_LOCKED_KEY, cardTypeShort(), isRemappableAuCardType(), normalizeAuHomeCardConfig(), NormalizeAuHomeCardResult, recommendedAuCardType(), REMAPPABLE_AU_CARD_TYPES, withCustomCardPrefix()

### Community 13 - "AuCalendarCard"
Cohesion: 0.18
Nodes (30): HTMLElementTagNameMap, VIEW_KEYS, HTMLElementTagNameMap, VIEW_KEYS, AuCalendarView, buildMonthGrid(), CallServiceWithResponse, compileFilter() (+22 more)

### Community 14 - "HassEntity"
Cohesion: 0.05
Nodes (38): AuClimateCard, HTMLElementTagNameMap, customElement, state, AuClimateSelectors, HTMLElementTagNameMap, SelectorPanel, customElement (+30 more)

### Community 15 - "computeDomain"
Cohesion: 0.19
Nodes (5): AuSwitchCard, customElement, formatSwitchSecondary(), toggleSwitch(), validateSwitchEntity()

### Community 16 - "HomeAssistant"
Cohesion: 0.21
Nodes (4): GridItem, GridItemLike, GridPos, buildEditRoomDraft()

### Community 17 - "au-calendar-card-editor.ts"
Cohesion: 0.10
Nodes (18): AuCalendarCardEditor, HTMLElementTagNameMap, customElement, AuCalendarFullscreenOpenOptions, AuCalendarFullscreenSync, ensureCalendarFullscreenOverlay(), calendarCardEditorLabels, calendarCardEditorSchema (+10 more)

### Community 18 - "._renderHomeView"
Cohesion: 0.04
Nodes (45): [0.5.4] - 2026-08-25, Added, Added, Changed, Changelog, [Unreleased], Acceptance (from docs/prd/platform/distribution-hacs.md), Automated (+37 more)

### Community 19 - "grid-engine.ts"
Cohesion: 0.23
Nodes (22): DragState, HTMLElementTagNameMap, clampToColumns(), collides(), compact(), computeRowTrackHeightPx(), deriveResponsiveLayout(), displayColumnsForWidth() (+14 more)

### Community 20 - "home-child-config.ts"
Cohesion: 0.13
Nodes (4): AuCalendarFullscreenOverlay, customElement, property, state

### Community 21 - "Card Contract Feature"
Cohesion: 0.09
Nodes (29): Architecture Card Contract, Card Contract Feature, Action Card, custom:au-action-card, AuActionCardBase, Action Card Content Layout, Calendar Card, Calendar Views (agenda/today/week/month) (+21 more)

### Community 22 - "au-shell-home-view.ts"
Cohesion: 0.09
Nodes (42): CardEditorMode, HTMLElementTagNameMap, NavView, applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag() (+34 more)

### Community 23 - "home-drag-resize.ts"
Cohesion: 0.08
Nodes (22): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+14 more)

### Community 24 - "au-shell-grid.ts"
Cohesion: 0.16
Nodes (24): HTMLElementTagNameMap, DEDICATED_CARD_DOMAINS, DeviceCapabilities, EXPLICIT_ON_OFF_DOMAINS, getDeviceCapabilities(), isDeviceActive(), isSupportedDeviceDomain(), resolveCardTypeForEntity() (+16 more)

### Community 25 - "Distribution and HACS Feature"
Cohesion: 0.06
Nodes (35): AuActionCard, customElement, AuSensorCard, customElement, CARDS, AuSensorCardConfig, CustomCardEntry, ActionCardInternals (+27 more)

### Community 26 - "device.ts"
Cohesion: 0.15
Nodes (19): clamp(), BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), BULK_OFF_DOMAINS, computeEntityName(), defaultToggleService(), formatBrightnessPercent() (+11 more)

### Community 27 - "AuDeviceCard"
Cohesion: 0.13
Nodes (5): AuDeviceCard, customElement, state, HassEntity, DomainControlModel

### Community 28 - "au-vacuum-card.ts"
Cohesion: 0.26
Nodes (14): HTMLElementTagNameMap, SECTION_TABS, ACTIVE_STATES, getVacuumCapabilities(), isVacuumActive(), isVacuumDomain(), pauseVacuum(), returnVacuum() (+6 more)

### Community 29 - "au-vacuum-settings-overlay.ts"
Cohesion: 0.14
Nodes (17): HTMLElementTagNameMap, hasEntityChanged(), HassArea, HassDevice, HassEntityAttributeBase, HassFloor, HassThemes, HassUser (+9 more)

### Community 30 - "Distribution and HACS Feature"
Cohesion: 0.31
Nodes (9): Atrium Home Dashboard Demo, Architecture Domain Card Mapping, Home Rooms Mode, au-shell-grid, Domain to Card Mapping, shell-grid edit-mode fixture (hui-card), Fixture setConfig classic grid cards, shell-grid custom-view edit-mode fixture (lovelace) (+1 more)

### Community 31 - "._placeFloorCard"
Cohesion: 0.12
Nodes (17): cardTag(), cardTypeHasEditor(), createChildCard(), ensureCardPickerLoaded(), fallbackCustomCardEntries(), getCardEditorElement(), stubConfigForCardType(), attachChildToHost() (+9 more)

### Community 32 - "PRD Decision Log D1-D14"
Cohesion: 0.33
Nodes (7): D10 Action Safety, D2 One Shell Card, D7 Priority Order, PRD Decision Log D1-D14, executeAction Validation Requirement, Unvalidated executeAction Finding, Assessment Priority Order

### Community 33 - "create-child-card.ts"
Cohesion: 0.14
Nodes (7): AuCalendarCard, customElement, state, isAuCalendarView(), normalizeCalendarEntities(), formatDayHeader(), isSameLocalDay()

### Community 34 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, @eslint/js, jsdom, prettier, @types/node, typescript, typescript-eslint, devDependencies (+11 more)

### Community 35 - "tokens.ts"
Cohesion: 0.21
Nodes (10): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, HTMLElementTagNameMap, fanCardEditorLabels, fanCardEditorSchema, HTMLElementTagNameMap (+2 more)

### Community 36 - "home-assistant.ts"
Cohesion: 0.19
Nodes (4): AuFanCard, customElement, state, isFanOscillating()

### Community 37 - "Edit Mode"
Cohesion: 0.40
Nodes (5): Vacuum Settings Overlay, config-persist, Edit Mode Draft/Commit Discipline, Edit Mode, home-edit-commit

### Community 38 - "._renderChildCard"
Cohesion: 0.16
Nodes (16): AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuClimateCardConfig, HvacAction, AuActionCardConfig, AuGridItemLayout, AuSeverityThresholds (+8 more)

### Community 39 - "._resolvedFloors"
Cohesion: 0.16
Nodes (3): AuTempStepper, customElement, property

### Community 40 - "au-shell-grid-home.test.ts"
Cohesion: 0.38
Nodes (8): clampTimerMinutes(), clearTimerEndsAt(), formatTimerRemaining(), normalizeTimerPresets(), readTimerEndsAt(), storageKey(), WH_TIMER_DEFAULT_PRESETS, writeTimerEndsAt()

### Community 41 - "au-shell-grid"
Cohesion: 0.18
Nodes (16): buildVacuumDeviceCatalog(), classifyVacuumSection(), entityLabel(), entriesForSection(), ESSENTIAL_SUFFIXES, isEnabledRegistryEntry(), isEssential(), pickMapCamera() (+8 more)

### Community 42 - "Home Tiles"
Cohesion: 0.24
Nodes (10): custom:au-room-card, Room Card, Shell Room Controls, Sensor Home Variant Path, Sensor Linear Gauge, Sensor Card, Sensor Severity Thresholds, auHomeTileStyles (+2 more)

### Community 43 - "compilerOptions"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, dist, node_modules, src, test, compilerOptions, declaration, declarationDir (+6 more)

### Community 44 - "action-tile-layout.ts"
Cohesion: 0.22
Nodes (11): en, TranslationKey, he, isRtlLanguage(), normalizeLanguage(), RTL_LANGUAGES, TABLES, ru (+3 more)

### Community 45 - "._renderEntry"
Cohesion: 0.18
Nodes (7): AuVacuumSettingsOpenOptions, AuVacuumSettingsOverlay, customElement, property, state, AuVacuumSettingsSection, filterCatalogSections()

### Community 46 - "Architecture Specification"
Cohesion: 0.23
Nodes (19): Architecture Specification, Locked Architecture Constraints C1-C12, Lovelace Design System Principle, Shell Modes Classic and Home, Room Idle Timeout, Install and Lovelace Resource Ops, npm run dev:ha, Local Dev Against Home Assistant (+11 more)

### Community 47 - "au-device-card-editor.ts"
Cohesion: 0.24
Nodes (6): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector

### Community 49 - "feature/calendar-time-improvements"
Cohesion: 0.18
Nodes (10): Acceptance, Automated, Decisions, feature/calendar-time-improvements, Files touched, Goal, Linked docs, Manual (+2 more)

### Community 50 - "VacuumSettingsDraft"
Cohesion: 0.20
Nodes (14): FAN_SUPPORT, FanCapabilities, formatFanSecondary(), formatFanSpeedLabel(), getFanCapabilities(), getFanDirection(), getFanPercentage(), getFanPresetMode() (+6 more)

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
Cohesion: 0.13
Nodes (13): AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels, roomCardEditorSchema, DEFAULT_HOME_FLOORS, HTMLElementTagNameMap, normalizeRoomCardEntities() (+5 more)

### Community 55 - "Feature: Card contract"
Cohesion: 0.15
Nodes (4): AuVacuumCard, customElement, ensureVacuumSettingsOverlay(), formatVacuumSecondary()

### Community 56 - "AuSensorCard"
Cohesion: 0.15
Nodes (23): Design Tokens, lit, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap (+15 more)

### Community 59 - "au-action-card-editor.ts"
Cohesion: 0.34
Nodes (9): ActionSurfaceOptions, clearHoldTimer(), clearTapTimer(), createPointerGestureState(), handleGesturePointerCancel(), handleGesturePointerDown(), handleGesturePointerUp(), PointerGestureCallbacks (+1 more)

### Community 60 - "format-clock.ts"
Cohesion: 0.28
Nodes (7): ClockDateFormat, ClockDayFormat, ClockFormat, formatClockDate(), formatClockWeekday(), formatToolbarClock(), ToolbarClockOptions

### Community 61 - "au-fan-card-editor.ts"
Cohesion: 0.11
Nodes (11): addEditRoomMember(), controlsFromEditDraft(), EditRoomAddCandidate, EditRoomDraft, EditRoomModalHandlers, EditRoomModalProps, moveEditRoomMember(), renderEditRoomModal() (+3 more)

### Community 62 - "au-switch-card-editor.ts"
Cohesion: 0.28
Nodes (5): AuClimateCardEditor, HTMLElementTagNameMap, customElement, climateCardEditorLabels, climateCardEditorSchema

### Community 63 - "au-fan-card-editor.ts"
Cohesion: 0.15
Nodes (12): author, bugs, url, description, homepage, license, main, module (+4 more)

### Community 65 - "Feature: Shell grid"
Cohesion: 0.28
Nodes (5): AuSwitchCardEditor, HTMLElementTagNameMap, customElement, switchCardEditorLabels, switchCardEditorSchema

### Community 66 - "AuFanSpeedSelector"
Cohesion: 0.28
Nodes (5): AuVacuumCardEditor, HTMLElementTagNameMap, customElement, vacuumCardEditorLabels, vacuumCardEditorSchema

### Community 68 - "package.json"
Cohesion: 0.18
Nodes (4): HTMLElementTagNameMap, bindStopBubble(), stopPropagation(), unbindStopBubble()

### Community 69 - "scripts"
Cohesion: 0.33
Nodes (5): AuTempControlMode, HTMLElementTagNameMap, clamp(), snapToStep(), valueFromClientX()

### Community 70 - "keywords"
Cohesion: 0.33
Nodes (6): custom-card, design-system, hacs, home-assistant, lovelace, keywords

### Community 71 - ".prettierrc.json"
Cohesion: 0.29
Nodes (7): 1. Goal, 2. Architecture anchors, 3. Feature map, 4. What shipped (high level), 5. Explicitly not Phase 0 exit blockers, 6. Document control, Phase 0 — Shipped spine (summary)

### Community 72 - "PHASE_0.md"
Cohesion: 0.08
Nodes (22): Acceptance, Automated, Decisions, Files touched, Goal, Implementation: GitHub Pages landing site, Leftover cleanup, Linked official docs (+14 more)

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

### Community 77 - "@eslint/js"
Cohesion: 0.29
Nodes (3): AuLightSlider, customElement, property

### Community 78 - "debug.ts"
Cohesion: 0.17
Nodes (11): Acceptance (from docs/prd/product/calendar-card.md), Automated, Decisions, feature/calendar-fullscreen, Files touched, Goal, Leftover cleanup, Linked docs (+3 more)

### Community 81 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.22
Nodes (4): AuFanSpeedSelector, customElement, property, state

### Community 82 - "shell-grid-add-card.test.ts"
Cohesion: 0.28
Nodes (5): AuCoverCardEditor, HTMLElementTagNameMap, customElement, coverCardEditorLabels, coverCardEditorSchema

### Community 83 - "CI Verify Job"
Cohesion: 0.67
Nodes (3): CI Workflow, CI Verify Job, npm run verify

### Community 84 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

### Community 87 - "5. UX flows"
Cohesion: 0.50
Nodes (4): 5. UX flows, Empty / first-use, Primary flow (classic), Primary flow (Home)

### Community 88 - "repository"
Cohesion: 0.29
Nodes (7): Phase 1 Home Visual Consistency, Phase 2 Security and Runtime, Phase 3 Bundle and Perf, Phase 4 Architecture and DX, Always-On Device Timer Finding, Home Visual Drift Finding, Home Design Tokens

### Community 89 - "2. In / out of scope"
Cohesion: 0.67
Nodes (3): 2. In / out of scope, In scope, Out of scope (this feature)

### Community 90 - "AuVacuumSettingsSection"
Cohesion: 0.25
Nodes (3): AuBaseCard, property, state

### Community 91 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.50
Nodes (3): Manual (if UI / Lovelace), Summary, Test plan

### Community 92 - "Calendar Card"
Cohesion: 0.67
Nodes (4): hass.language Locale Source, Hebrew RTL Support, Localize Catalogs (en/ru/he), Localize

### Community 94 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **362 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `name` (+357 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lit` connect `AuSensorCard` to `AuCalendarCard`, `HassEntity`, `au-calendar-card-editor.ts`, `grid-engine.ts`, `au-shell-home-view.ts`, `au-shell-grid.ts`, `au-vacuum-card.ts`, `au-vacuum-settings-overlay.ts`, `._placeFloorCard`, `tokens.ts`, `au-device-card-editor.ts`, `au-room-card-editor.ts`, `au-action-card-editor.ts`, `au-fan-card-editor.ts`, `au-switch-card-editor.ts`, `Feature: Shell grid`, `AuFanSpeedSelector`, `package.json`, `scripts`, `keywords`, `shell-grid-add-card.test.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `AuShellHomeView` connect `AuShellHomeView` to `home-edit-room-modal.ts`, `au-cover-card.ts`, `Architecture Specification`, `HomeAssistant`, `grid-engine.ts`, `au-shell-home-view.ts`, `water-heater-timer.ts`, `format-clock.ts`, `au-fan-card-editor.ts`, `._placeFloorCard`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `AuSensorCard`, `au-fan-card-editor.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _362 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuShellHomeView` be split into smaller, more focused modules?**
  _Cohesion score 0.04642313546423135 - nodes in this community are weakly interconnected._
- **Should `light.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08959899749373433 - nodes in this community are weakly interconnected._
- **Should `AuTempStepper` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._