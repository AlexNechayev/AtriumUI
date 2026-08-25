# Graph Report - docs-pages-dark-fix  (2026-08-25)

## Corpus Check
- 219 files · ~116,657 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1866 nodes · 5103 edges · 97 communities (90 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ffc80d3`
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
- typescript-eslint
- 5. UX flows
- repository
- 2. In / out of scope
- AuVacuumSettingsSection
- PULL_REQUEST_TEMPLATE.md
- Calendar Card
- ._state
- repository
- bindStopBubble
- ._detectHaDashboardEditing

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

## Communities (97 total, 7 thin omitted)

### Community 0 - "AuShellHomeView"
Cohesion: 0.04
Nodes (14): Phase 3-4 Product Backlog, Session Follow-ups, AuShellHomeView, customElement, property, query, state, emptyEditSessionDraft() (+6 more)

### Community 1 - "light.ts"
Cohesion: 0.08
Nodes (36): AuLightCard, HTMLElementTagNameMap, customElement, state, createDebounced(), isLightCardCompact(), clamp(), formatBrightnessLabel() (+28 more)

### Community 2 - "AuTempStepper"
Cohesion: 0.08
Nodes (14): AuActionCardEditor, customElement, AuClimateCardEditor, customElement, AuCoverCardEditor, customElement, AuLightCardEditor, customElement (+6 more)

### Community 3 - "au-fan-card.ts"
Cohesion: 0.06
Nodes (39): AuCoverCard, HTMLElementTagNameMap, customElement, state, AuFanCard, HTMLElementTagNameMap, customElement, state (+31 more)

### Community 4 - "AuActionCardBase"
Cohesion: 0.06
Nodes (16): ActionSurfaceOptions, AuActionCardBase, humanize(), eventOptions, ActionConfig, clearHoldTimer(), clearTapTimer(), createPointerGestureState() (+8 more)

### Community 5 - "AuRoomCard"
Cohesion: 0.11
Nodes (4): AuRoomCard, customElement, eventOptions, AuRoomCardEntityConfig

### Community 6 - "home-edit-room-modal.ts"
Cohesion: 0.24
Nodes (7): buildRoomTileCardConfig(), childConfigForEntity(), ChildConfigOptions, homeAwareCardConfig(), RoomTileCardConfigInput, AuHomeEntityConfig, AuHomeRoomConfig

### Community 7 - "AuShellGrid"
Cohesion: 0.12
Nodes (5): AuShellGrid, customElement, property, query, state

### Community 8 - "compilerOptions"
Cohesion: 0.05
Nodes (42): DOM, DOM.Iterable, ES2021, dist, node_modules, src, test, compilerOptions (+34 more)

### Community 10 - "index.ts"
Cohesion: 0.27
Nodes (14): actionEntity(), ActionKind, ALLOWED_SERVICE_DOMAINS, BLOCKED_HOMEASSISTANT_SERVICES, defaultDoubleTapAction(), defaultHoldAction(), defaultTapAction(), executeAction() (+6 more)

### Community 12 - "AuHomeEntityConfig"
Cohesion: 0.42
Nodes (8): CARD_TYPE_LOCKED_KEY, cardTypeShort(), isRemappableAuCardType(), normalizeAuHomeCardConfig(), NormalizeAuHomeCardResult, recommendedAuCardType(), REMAPPABLE_AU_CARD_TYPES, withCustomCardPrefix()

### Community 13 - "AuCalendarCard"
Cohesion: 0.17
Nodes (26): HTMLElementTagNameMap, VIEW_KEYS, buildMonthGrid(), CallServiceWithResponse, compileFilter(), computeFetchWindow(), computeMonthGridWindow(), endOfLocalDay() (+18 more)

### Community 14 - "HassEntity"
Cohesion: 0.06
Nodes (37): AuClimateCard, HTMLElementTagNameMap, customElement, state, AuClimateSelectors, customElement, property, state (+29 more)

### Community 15 - "computeDomain"
Cohesion: 0.19
Nodes (5): AuSwitchCard, customElement, formatSwitchSecondary(), toggleSwitch(), validateSwitchEntity()

### Community 16 - "HomeAssistant"
Cohesion: 0.23
Nodes (3): GridItem, GridItemLike, GridPos

### Community 17 - "au-calendar-card-editor.ts"
Cohesion: 0.11
Nodes (20): AuCalendarCardEditor, customElement, AuCalendarFullscreenOpenOptions, AuCalendarFullscreenSync, ensureCalendarFullscreenOverlay(), HTMLElementTagNameMap, VIEW_KEYS, AuCalendarCardConfig (+12 more)

### Community 18 - "._renderHomeView"
Cohesion: 0.04
Nodes (45): [0.5.4] - 2026-08-25, Added, Added, Changed, Changelog, [Unreleased], Acceptance (from docs/prd/platform/distribution-hacs.md), Automated (+37 more)

### Community 19 - "grid-engine.ts"
Cohesion: 0.22
Nodes (23): DragState, HTMLElementTagNameMap, clampToColumns(), collides(), compact(), computeRowTrackHeightPx(), deriveResponsiveLayout(), displayColumnsForWidth() (+15 more)

### Community 20 - "home-child-config.ts"
Cohesion: 0.13
Nodes (6): AuCalendarFullscreenOverlay, customElement, property, state, formatDayHeader(), formatEventTimeRange()

### Community 21 - "Card Contract Feature"
Cohesion: 0.09
Nodes (27): Architecture Card Contract, Card Contract Feature, Action Card, custom:au-action-card, AuActionCardBase, Action Card Content Layout, Calendar Card, Calendar Views (agenda/today/week/month) (+19 more)

### Community 22 - "au-shell-home-view.ts"
Cohesion: 0.13
Nodes (25): applyHomeItemMove(), applyHomeItemResize(), applyRoomItemMove(), applyRoomItemResize(), beginPointerDrag(), beginPointerResize(), computeGridMetrics(), GridMetrics (+17 more)

### Community 23 - "home-drag-resize.ts"
Cohesion: 0.08
Nodes (22): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+14 more)

### Community 24 - "au-shell-grid.ts"
Cohesion: 0.20
Nodes (13): EditRoomModalProps, HomeAssistant, DomainControlKind, DomainControlVisibility, resolveDomainControl(), runWaterHeaterTemperature(), getWaterHeaterCapabilities(), getWaterHeaterTemperature() (+5 more)

### Community 25 - "Distribution and HACS Feature"
Cohesion: 0.06
Nodes (33): AuActionCard, customElement, AuSensorCard, customElement, CARDS, ActionCardInternals, makeActionCard(), renderActionCard() (+25 more)

### Community 26 - "device.ts"
Cohesion: 0.15
Nodes (23): clamp(), BulkOffResult, bulkTurnOff(), collectBulkOffTargets(), isDeviceActive(), BULK_OFF_DOMAINS, computeDomain(), computeEntityName() (+15 more)

### Community 27 - "AuDeviceCard"
Cohesion: 0.13
Nodes (4): AuDeviceCard, customElement, state, DomainControlModel

### Community 28 - "au-vacuum-card.ts"
Cohesion: 0.23
Nodes (17): HTMLElementTagNameMap, ensureVacuumSettingsOverlay(), HTMLElementTagNameMap, SECTION_TABS, ACTIVE_STATES, formatVacuumSecondary(), getVacuumCapabilities(), isVacuumActive() (+9 more)

### Community 29 - "au-vacuum-settings-overlay.ts"
Cohesion: 0.19
Nodes (8): HTMLElementTagNameMap, AuBaseCard, hasEntityChanged(), property, state, entityFingerprint(), getRootHass(), pickFreshestEntity()

### Community 30 - "Distribution and HACS Feature"
Cohesion: 0.31
Nodes (9): Atrium Home Dashboard Demo, Architecture Domain Card Mapping, Home Rooms Mode, au-shell-grid, Domain to Card Mapping, shell-grid edit-mode fixture (hui-card), Fixture setConfig classic grid cards, shell-grid custom-view edit-mode fixture (lovelace) (+1 more)

### Community 31 - "._placeFloorCard"
Cohesion: 0.27
Nodes (7): cardTag(), cardTypeHasEditor(), fallbackCustomCardEntries(), getCardEditorElement(), stubConfigForCardType(), EntityOption, renderAddCardModal()

### Community 32 - "PRD Decision Log D1-D14"
Cohesion: 0.33
Nodes (7): D10 Action Safety, D2 One Shell Card, D7 Priority Order, PRD Decision Log D1-D14, executeAction Validation Requirement, Unvalidated executeAction Finding, Assessment Priority Order

### Community 33 - "create-child-card.ts"
Cohesion: 0.16
Nodes (3): AuCalendarCard, customElement, state

### Community 34 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, @eslint/js, jsdom, prettier, @types/node, typescript, typescript-eslint, devDependencies (+11 more)

### Community 35 - "tokens.ts"
Cohesion: 0.16
Nodes (13): ACTION_CARD_UI_ACTIONS, actionCardEditorLabels, actionCardEditorSchema, HTMLElementTagNameMap, HTMLElementTagNameMap, climateCardEditorLabels, climateCardEditorSchema, HTMLElementTagNameMap (+5 more)

### Community 36 - "home-assistant.ts"
Cohesion: 0.19
Nodes (5): createChildCard(), attachChildToHost(), ChildCardMaps, pruneChildCards(), LovelaceCard

### Community 37 - "Edit Mode"
Cohesion: 0.29
Nodes (7): Vacuum hide_sections, Vacuum Settings Overlay, Vacuum Card, config-persist, Edit Mode Draft/Commit Discipline, Edit Mode, home-edit-commit

### Community 38 - "._renderChildCard"
Cohesion: 0.16
Nodes (18): AuActionCardBaseConfig, AuActionCardContentLayout, AuCardVariant, AuActionCardConfig, AuGridCardConfig, AuGridItemLayout, AuSensorCardConfig, AuSeverityThresholds (+10 more)

### Community 39 - "._resolvedFloors"
Cohesion: 0.16
Nodes (3): AuTempStepper, customElement, property

### Community 40 - "au-shell-grid-home.test.ts"
Cohesion: 0.41
Nodes (9): HTMLElementTagNameMap, clampTimerMinutes(), clearTimerEndsAt(), formatTimerRemaining(), normalizeTimerPresets(), readTimerEndsAt(), storageKey(), WH_TIMER_DEFAULT_PRESETS (+1 more)

### Community 41 - "au-shell-grid"
Cohesion: 0.18
Nodes (16): HassEntityRegistryEntry, buildVacuumDeviceCatalog(), classifyVacuumSection(), entityLabel(), entriesForSection(), ESSENTIAL_SUFFIXES, filterCatalogSections(), isEnabledRegistryEntry() (+8 more)

### Community 42 - "Home Tiles"
Cohesion: 0.24
Nodes (10): custom:au-room-card, Room Card, Shell Room Controls, Sensor Home Variant Path, Sensor Linear Gauge, Sensor Card, Sensor Severity Thresholds, auHomeTileStyles (+2 more)

### Community 43 - "compilerOptions"
Cohesion: 0.13
Nodes (14): ./tsconfig.json, dist, node_modules, src, test, compilerOptions, declaration, declarationDir (+6 more)

### Community 44 - "action-tile-layout.ts"
Cohesion: 0.17
Nodes (16): hass.language Locale Source, Hebrew RTL Support, Localize Catalogs (en/ru/he), Localize, en, TranslationKey, he, isRtlLanguage() (+8 more)

### Community 45 - "._renderEntry"
Cohesion: 0.19
Nodes (6): AuVacuumSettingsOpenOptions, AuVacuumSettingsOverlay, customElement, property, state, AuVacuumSettingsSection

### Community 46 - "Architecture Specification"
Cohesion: 0.36
Nodes (12): Architecture Specification, Lovelace Design System Principle, Shell Modes Classic and Home, Room Idle Timeout, Phase 0 Shipped Spine, PRD Feature Spec Template, Classic Grid Mode, Shell Grid Feature (+4 more)

### Community 47 - "au-device-card-editor.ts"
Cohesion: 0.24
Nodes (6): AuDeviceCardEditor, HTMLElementTagNameMap, customElement, deviceCardEditorLabels, deviceCardEditorSchema, deviceEntitySelector

### Community 49 - "feature/calendar-time-improvements"
Cohesion: 0.18
Nodes (10): Acceptance, Automated, Decisions, feature/calendar-time-improvements, Files touched, Goal, Linked docs, Manual (+2 more)

### Community 50 - "VacuumSettingsDraft"
Cohesion: 0.15
Nodes (9): CustomCardEntry, HassArea, HassDevice, HassEntityAttributeBase, HassFloor, HassThemes, HassUser, LovelaceCardEditor (+1 more)

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
Cohesion: 0.11
Nodes (19): lit, HTMLElementTagNameMap, calendarCardEditorLabels, calendarCardEditorSchema, AuRoomCardEditor, HTMLElementTagNameMap, customElement, roomCardEditorLabels (+11 more)

### Community 56 - "AuSensorCard"
Cohesion: 0.18
Nodes (14): Design Tokens, HTMLElementTagNameMap, HTMLElementTagNameMap, HTMLElementTagNameMap, SeverityLevel, HTMLElementTagNameMap, AuCardContent, CardRootOptions (+6 more)

### Community 57 - "water-heater-timer.ts"
Cohesion: 0.17
Nodes (6): applyGridToLovelaceConfig(), buildPersistedGridConfig(), buildPersistedHomeConfig(), GridPersistItem, AuShellGridConfig, baseGrid

### Community 58 - "scripts"
Cohesion: 0.21
Nodes (3): roomDisplayName(), VacuumCatalogEntry, VacuumDeviceCatalog

### Community 59 - "au-action-card-editor.ts"
Cohesion: 0.17
Nodes (11): Acceptance, Automated, Decisions, Files touched, Goal, Implementation: GitHub Pages landing site, Leftover cleanup, Linked official docs (+3 more)

### Community 60 - "format-clock.ts"
Cohesion: 0.27
Nodes (8): ClockDateFormat, ClockDayFormat, ClockFormat, formatClock(), formatClockDate(), formatClockWeekday(), formatToolbarClock(), ToolbarClockOptions

### Community 61 - "au-fan-card-editor.ts"
Cohesion: 0.12
Nodes (25): CardEditorMode, HTMLElementTagNameMap, NavView, addEditRoomMember(), buildEditRoomDraft(), controlsFromEditDraft(), EditRoomAddCandidate, EditRoomDraft (+17 more)

### Community 62 - "au-switch-card-editor.ts"
Cohesion: 0.36
Nodes (3): auDebug(), isEntityOffline(), GestureKind

### Community 63 - "au-fan-card-editor.ts"
Cohesion: 0.15
Nodes (12): author, bugs, url, description, homepage, license, main, module (+4 more)

### Community 64 - "Implementation: Room idle timeout"
Cohesion: 0.15
Nodes (4): applyVacuumDraft(), pressVacuumButton(), VacuumDraftValue, VacuumSettingsDraft

### Community 65 - "Feature: Shell grid"
Cohesion: 0.28
Nodes (5): AuSwitchCardEditor, HTMLElementTagNameMap, customElement, switchCardEditorLabels, switchCardEditorSchema

### Community 66 - "AuFanSpeedSelector"
Cohesion: 0.28
Nodes (5): AuVacuumCardEditor, HTMLElementTagNameMap, customElement, vacuumCardEditorLabels, vacuumCardEditorSchema

### Community 68 - "package.json"
Cohesion: 0.21
Nodes (5): AuLightSliderVariant, HTMLElementTagNameMap, stopPropagation(), unbindStopBubble(), mountSlider()

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
Cohesion: 0.17
Nodes (11): Acceptance, Automated, Decisions, Files touched, Goal, Implementation: Pages hero layout and theme, Leftover cleanup, Linked official docs (+3 more)

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
Cohesion: 0.36
Nodes (9): DEDICATED_CARD_DOMAINS, DeviceCapabilities, EXPLICIT_ON_OFF_DOMAINS, getDeviceCapabilities(), isSupportedDeviceDomain(), resolveCardTypeForEntity(), runPrimaryDeviceAction(), usesExplicitOnOff() (+1 more)

### Community 83 - "CI Verify Job"
Cohesion: 0.67
Nodes (3): CI Workflow, CI Verify Job, npm run verify

### Community 84 - "dependencies"
Cohesion: 0.67
Nodes (3): lit, dependencies, lit

### Community 85 - "typescript-eslint"
Cohesion: 0.28
Nodes (5): AuFanCardEditor, HTMLElementTagNameMap, customElement, fanCardEditorLabels, fanCardEditorSchema

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
Cohesion: 0.38
Nodes (7): Locked Architecture Constraints C1-C12, Install and Lovelace Resource Ops, npm run dev:ha, Local Dev Against Home Assistant, Distribution and HACS Feature, Healthy Reuse Guardrails, HACS Installation

### Community 91 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.50
Nodes (3): Manual (if UI / Lovelace), Summary, Test plan

### Community 93 - "._state"
Cohesion: 0.57
Nodes (5): discoverFloorsFromAreas(), entitiesForArea(), mergeAreaEntities(), normalizeFloors(), slugify()

### Community 94 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **362 isolated node(s):** `singleQuote`, `trailingComma`, `printWidth`, `semi`, `name` (+357 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lit` connect `au-room-card-editor.ts` to `light.ts`, `au-fan-card.ts`, `AuActionCardBase`, `AuCalendarCard`, `HassEntity`, `au-calendar-card-editor.ts`, `grid-engine.ts`, `au-vacuum-card.ts`, `au-vacuum-settings-overlay.ts`, `._placeFloorCard`, `tokens.ts`, `au-shell-grid-home.test.ts`, `au-device-card-editor.ts`, `AuSensorCard`, `au-fan-card-editor.ts`, `Feature: Shell grid`, `AuFanSpeedSelector`, `package.json`, `scripts`, `keywords`, `typescript-eslint`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `AuShellHomeView` connect `AuShellHomeView` to `home-edit-room-modal.ts`, `._renderChildCard`, `au-cover-card.ts`, `Architecture Specification`, `HomeAssistant`, `VacuumSettingsDraft`, `grid-engine.ts`, `au-shell-home-view.ts`, `au-shell-grid.ts`, `water-heater-timer.ts`, `format-clock.ts`, `au-fan-card-editor.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `au-room-card-editor.ts`, `au-fan-card-editor.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `singleQuote`, `trailingComma`, `printWidth` to the rest of the system?**
  _362 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuShellHomeView` be split into smaller, more focused modules?**
  _Cohesion score 0.03929430633520449 - nodes in this community are weakly interconnected._
- **Should `light.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08472344161545214 - nodes in this community are weakly interconnected._
- **Should `AuTempStepper` be split into smaller, more focused modules?**
  _Cohesion score 0.07671957671957672 - nodes in this community are weakly interconnected._