# Ops: Storybook catalog

| Field | Value |
| --- | --- |
| Audience | Sole developer |
| Companion | [prd/platform/storybook.md](../prd/platform/storybook.md), README Development |

Storybook is a **local** catalog of Atrium custom elements. It is not loaded by Home Assistant.

## Commands

```bash
npm run storybook         # http://localhost:6006
npm run build-storybook   # static build → storybook-static/
```

`npm run verify` does **not** build Storybook. Vitest still asserts every `@customElement` has a story. CI runs `build-storybook` as a parallel job.

## What you see

- **Foundations** — Home canvas tokens (light/dark)
- **Primitives** — sliders, steppers, selectors
- **Cards** — Home (vertical + horizontal `content_layout` for action tiles) + classic / unavailable variants. Climate includes slider and buttons temperature control. Fan Home is glance-sized; speed slider/buttons are separate stories.
- **Shell** — classic grid and Home → Rooms
- **Overlays** — calendar fullscreen, vacuum settings
- **Editors** — stub `ha-form` (not HA-native pickers)

Icons use Storybook-only `ha-icon` / `ha-state-icon` stubs that paint `@mdi/js` SVG paths (webfont CSS cannot pierce card shadow roots). `hass.callService` is a no-op logger.

## Isolation

Storybook uses its own Vite app. Do not point it at `vite.config.ts` lib mode (`build.lib` → `atrium-ui.js`).
