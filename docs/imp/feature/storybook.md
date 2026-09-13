# feature/storybook

## Goal

Add Storybook 9 as isolated DX tooling and cover every existing `@customElement` with CSF stories, gated by Vitest.

## Linked docs

- `docs/prd/platform/storybook.md`
- `docs/ARCHITECTURE.md` §8
- `docs/ops/storybook.md`
- `README.md` (Development)

## Decisions

- Storybook is a separate Vite app; `viteFinal` strips lib-mode options from `vite.config.ts`.
- Stories live under `stories/`; production `src/` is unchanged.
- HA frontend tags (`ha-icon`, `ha-state-icon`, `ha-form`, pickers, `action-handler`) are stubbed in preview.
- `@mdi/js` is Storybook-only; stubs paint SVG paths inside their own shadow roots so glyphs show inside card trees. Not bundled into `dist/atrium-ui.js`.
- `build-storybook` is a parallel CI job, not part of `npm run verify`.
- Coverage: every `@customElement('tag')` must appear as `component: 'tag'` in a `*.stories.ts` file.
- Action-tile Home stories (`AuActionCardBase`) mount vertical and horizontal `content_layout` side by side via `mountCardLayouts`.
- Climate card stories include `temperature_control: 'buttons'` (Home + Classic) as well as the default slider.
- Fan Home glance matches the shell (`show_speed` / presets / oscillate / direction off). Speed slider and `speed_control: 'button'` are separate stories.

## Files touched

- `.storybook/main.ts`, `.storybook/preview.ts`
- `stories/**`
- `test/storybook/coverage.test.ts`, `test/storybook/ha-icon.test.ts`
- `package.json`, `tsconfig.json`, `eslint.config.js`, `.gitignore`, `.github/workflows/ci.yml`
- `docs/prd/platform/storybook.md`, `docs/ops/storybook.md`, `docs/ARCHITECTURE.md`, `docs/PRD.md`, `docs/SCOPE_AND_FEATURES.md`, `README.md`, `CONTRIBUTING.md`

## TDD

- Red: added `test/storybook/coverage.test.ts` — `npx vitest run test/storybook/coverage.test.ts` failed with 31 missing `@customElement` tags (no `stories/` yet).
- Green: Storybook 10 + CSF stories for all 31 custom elements — `npm test` 481 passed; `npm run verify` passed; `npm run build-storybook` succeeded.
- Refactor: shared fixtures under `stories/fixtures/`; isolated Vite app via `.storybook/vite.config.ts`.
- Red (icons): added `test/storybook/ha-icon.test.ts` — `ha-icon` had no SVG path; `ha-state-icon` was unregistered.
- Green (icons): `@mdi/js` SVG stubs for `ha-icon` / `ha-state-icon` — `npx vitest run test/storybook/ha-icon.test.ts` passed; `npm test` 483 passed.
- Red (layouts): coverage test required `mountCardLayouts` on all `AuActionCardBase` card stories — 8 tags missing.
- Green (layouts): Home stories mount vertical + horizontal tiles via `mountCardLayouts` — `npx vitest run test/storybook/coverage.test.ts test/storybook/layouts.test.ts` passed; `npm test` 485 passed.
- Red (climate buttons): coverage required `temperature_control: 'buttons'` in climate stories — failed.
- Green (climate buttons): added HomeButtons + ClassicButtons climate stories — `npx vitest run test/storybook/coverage.test.ts` passed; `npm test` 486 passed.
- Red (fan catalog): coverage required Home glance + `speed_control: 'button'` — failed (all controls crammed into one Home tile).
- Green (fan catalog): Home glance, HomeSpeed, HomeButtons, ClassicButtons — `npx vitest run test/storybook/coverage.test.ts` passed; `npm test` 487 passed.

## Leftover cleanup

- None. Chromatic / visual regression remains out of scope.

## Verification

### Automated

- `npm test` (includes `test/storybook/coverage.test.ts`, `test/storybook/ha-icon.test.ts`, `test/storybook/layouts.test.ts`)
- `npm run verify`
- `npm run build-storybook`

### Acceptance (from docs/prd/platform/storybook.md)

- AC1: Every `@customElement` has a CSF story
- AC2: `npm run storybook` serves; `build-storybook` succeeds
- AC3: HA bundle does not include Storybook / `@mdi/js`
- AC4: Canvas tokens match Home look fallbacks
- AC5: Action-tile Home stories show vertical and horizontal `content_layout`
- AC6: Climate card stories include slider and buttons temperature control
- AC7: Fan Home glance; slider and button speed stories

### Manual

1. `npm run storybook`
2. Open primitives, one Home tile (confirm vertical + horizontal), Climate Home Buttons, one classic card, shell Home, one overlay, one editor; toggle light/dark.
3. Confirm MDI icons render and controls do not throw.
