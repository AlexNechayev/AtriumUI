# Ops: Install & Lovelace resource

| Field | Value |
| --- | --- |
| Audience | Dashboard authors / sole developer |
| Companion | [prd/platform/distribution-hacs.md](../prd/platform/distribution-hacs.md), README Installation, [GitHub Pages](https://alexnechayev.github.io/AtriumUI/) |

---

## HACS (recommended)

1. In HACS, add a custom repository:
   - URL: `https://github.com/AlexNechayev/AtriumUI`
   - Type: **Dashboard**
2. Install **AtriumUI**.
3. Confirm the Lovelace resource is registered (Settings → Dashboards → Resources). HACS loads `atrium-ui.js` from the latest GitHub Release.

## Manual

1. `npm install && npm run build`
2. Copy `dist/atrium-ui.js` to `<config>/www/atrium-ui/atrium-ui.js`
3. Register the resource:

```yaml
url: /local/atrium-ui/atrium-ui.js?v=0.5.4
type: module
```

4. Bump `?v=` after upgrades to bust cache.

## Verify

1. Create a **Panel** view.
2. Add `custom:au-shell-grid` (classic or with `floors`).
3. Confirm cards render without custom-element console errors.
