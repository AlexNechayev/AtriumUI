# Feature: Storybook catalog

| Field | Value |
| --- | --- |
| ID | `prd/platform/storybook` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Supporting |
| Platforms | Local DX (Storybook). Not a Lovelace resource. |
| Companion | [`ARCHITECTURE.md`](../../ARCHITECTURE.md) §8, [`ops/storybook.md`](../../ops/storybook.md) |

---

## 1. Problem & user story

**Problem:** Domain cards, primitives, editors, and overlays only render inside Home Assistant, so visual review requires a live HA install.

**User story:** As the sole developer, I want a local Storybook catalog of every Atrium custom element so I can review Home look, classic variants, and empty/unavailable states without loading Lovelace.

---

## 2. In / out of scope

### In scope
- Storybook 10 + `@storybook/web-components-vite` as an isolated Vite app
- CSF stories for every `@customElement` registered in `src/`
- Mock `hass` + stub HA elements (`ha-icon`, `ha-state-icon`, `ha-form`, `action-handler`, pickers)
- Home stories for `AuActionCardBase` cards show vertical and horizontal `content_layout` side by side
- Climate stories include slider and buttons temperature control
- Fan Home is glance (extra controls off); speed slider and `speed_control: 'button'` are separate stories
- Vitest coverage gate: each custom-element tag appears in `stories/**/*.stories.ts`
- `npm run storybook` and `npm run build-storybook` (CI parallel job; **not** part of `npm run verify`)

### Out of scope (this feature)
- Chromatic or visual-regression snapshots
- Embedding a real Home Assistant frontend / iframe
- Pixel-identical `ha-form` / entity pickers (stubs only)
- Shipping Storybook or `@mdi/js` inside `dist/atrium-ui.js`

---

## 3. Config / data model

No Lovelace YAML. Stories mount elements with `setConfig` / properties plus a fixture `HomeAssistant` object.

---

## 4. Behaviors & business rules

1. Storybook MUST NOT inherit Vite lib mode from `vite.config.ts` (single `atrium-ui.js` chunk).
2. Stories MUST import specific modules, not `src/index.ts` (avoid `customCards` / version `console.info` side effects).
3. Production bundle MUST remain free of Storybook dependencies.
4. Every `@customElement('…')` in `src/` MUST have at least one CSF story whose `component` field is that tag.
5. Home stories for cards that extend `AuActionCardBase` MUST show both `content_layout` values (vertical and horizontal).
6. Climate card stories MUST include `temperature_control: 'buttons'` as well as the default slider.
7. Fan card Home stories MUST match Home glance (extra controls off) and include `speed_control: 'button'`.

---

## 5. UX flows

- Canvas uses Home look CSS variables ([design-system](../ux/design-system.md)).
- Toolbar offers light / dark backgrounds.

### Primary flow
1. Run `npm run storybook`.
2. Open a card, primitive, shell, overlay, or editor story.
3. Toggle light/dark; confirm icons and controls render.

### Empty / first-use
- Unavailable / missing-entity stories MUST be explicit for entity-backed cards.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| New `@customElement` without a story | `npm test` coverage test fails |
| Editor stories | Stub `ha-form` renders schema fields as native inputs |
| Overlay stories | Call `open()` so the overlay is visible in the canvas |

---

## 7. Acceptance criteria

1. Every `@customElement` in `src/` has at least one CSF story (`component: '<tag>'`).
2. `npm run storybook` serves the catalog; `npm run build-storybook` succeeds in CI.
3. `dist/atrium-ui.js` does not include Storybook or `@mdi/js`.
4. Home canvas tokens match `src/theme/tokens.ts` fallbacks (accent `#0a84ff`).
5. Action-tile Home stories show vertical and horizontal `content_layout` side by side.
6. Climate card stories include slider and buttons temperature control.
7. Fan card Home glance hides extra controls; stories include slider and button speed control.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [`../ux/design-system.md`](../ux/design-system.md) | Token source of truth on the canvas |
| [`../platform/card-contract.md`](../platform/card-contract.md) | Cards still use `setConfig` + `hass` |
| Architecture §8 | Isolated DX commands, not the HA chunk |

---

## 9. Implementation

| Symbol | Path |
| --- | --- |
| Storybook main | `.storybook/main.ts` |
| Storybook preview | `.storybook/preview.ts` |
| Coverage test | `test/storybook/coverage.test.ts` |
| Layout helper | `stories/fixtures/mount.ts` (`mountCardLayouts`) |
| Stories | `stories/**/*.stories.ts` |
