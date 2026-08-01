# Ops: Local development against Home Assistant

| Field | Value |
| --- | --- |
| Audience | Sole developer |
| Companion | README Development, [distribution-hacs](../prd/platform/distribution-hacs.md) |

---

## Commands

```bash
npm install
npm run dev          # Vite app server (not HA)
npm run typecheck
npm run lint
npm test
npm run build
npm run verify       # typecheck + lint + test + build
```

### Watch into HA `www`

```bash
# Default outDir (Samba mount example in package.json):
npm run dev:ha

# Override:
HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha
```

`HA_BUILD=1` enables the HA-oriented Vite build. If SMB reports “Resource busy”, unmount/remount or build to a local folder and copy.

## Demo YAML

[`demo/home-dashboard.yaml`](../../demo/home-dashboard.yaml) uses placeholder entity ids. Replace with entities from your HA instance before loading.

## Manual smoke (Home)

1. Start `dev:ha` pointed at your `www/atrium-ui`.
2. Reload Lovelace resources (or hard-refresh).
3. Open a Panel view with `au-shell-grid` + `floors`.
4. Enter a room; confirm idle timeout if `room_idle_timeout` > 0.
5. Toggle a light/switch; confirm Home tile styling.
