# Implementation: Room tile temperature

| Field | Value |
| --- | --- |
| Branch | `feature/room-tile-temperature` |
| Worktree | `.worktrees/feature-room-tile-temperature` |
| Status | Implemented (unmerged) |

## Goal

Optional `temperature_entity` on `au-room-card` and Home rooms. When set, the header first row is icon | temperature; name and subtitle stay under the icon, start-aligned. When omitted, today’s stacked header is unchanged.

## Linked official docs

- [docs/prd/product/room-card.md](../../prd/product/room-card.md)
- [docs/prd/platform/shell-grid.md](../../prd/platform/shell-grid.md)
- [docs/prd/platform/card-contract.md](../../prd/platform/card-contract.md)
- [README.md](../../../README.md)

## Decisions

- Config key: `temperature_entity` (optional entity id) on the card and on `AuHomeRoomConfig`.
- Layout B only when the key is set; missing/unavailable sensor stays in B and shows `—`.
- Name/subtitle are not indented under the temperature — they start under the icon.
- Editors filter `sensor` + `device_class: temperature`; `setConfig` only requires a dotted entity id.
- Display: `formatNumericState(value, 1)` + `unit_of_measurement`.

## Files touched

- `src/types/room-card.ts`
- `src/types/home.ts`
- `src/card/room-card/au-room-card.ts`
- `src/card/room-card/room-card-editor-schema.ts`
- `src/template/shell-grid/home-child-config.ts`
- `src/template/shell-grid/home-edit-room-modal.ts`
- `src/template/shell-grid/au-shell-home-view.ts`
- `src/template/shell-grid/au-shell-grid-editor.ts`
- `test/card/au-room-card.test.ts`
- `test/template/home-child-config.test.ts`
- `test/template/home-edit-room-modal.test.ts`
- `docs/prd/product/room-card.md`
- `docs/prd/platform/shell-grid.md`
- `README.md`
- `docs/imp/feature/room-tile-temperature.md`
- `docs/session-followups.md`

## Leftover cleanup

- [ ] None for this feature

## TDD

- Red: added temperature tests in `test/card/au-room-card.test.ts`, `test/template/home-child-config.test.ts`, `test/template/home-edit-room-modal.test.ts`. `npm test --` those files failed (7 tests): no `.has-temp` / `.temp`, `temperature_entity` not forwarded, draft field undefined, invalid id did not throw.
- Green: implemented optional header preview + Home plumbing. Same suite 24 passed; `npm run verify` 479 passed.
- Refactor: renamed `.temp` → `.temperature-state` (and `.has-temp` → `.has-temperature`); icon-row `align-items: flex-start`; temperature uses `--au-font-secondary` / weight 500.

## Verification

### Automated

From `.worktrees/feature-room-tile-temperature`:

```bash
npm test -- test/card/au-room-card.test.ts test/template/home-child-config.test.ts test/template/home-edit-room-modal.test.ts
npm run verify
```

### Acceptance (from docs/prd/product/room-card.md)

- AC4: Without `temperature_entity`, stacked header; no temperature preview.
- AC5: With `temperature_entity`, first row is icon | temperature; name and subtitle under the icon, start-aligned.
- AC6: Missing or unavailable sensor shows `—` and stays in that layout.

### Manual

1. `HA_WWW=/path/to/config/www/atrium-ui npm run dev:ha`
2. Reload Lovelace resources; open the Home panel.
3. Rooms without `temperature_entity` still show icon above the name.
4. Set `temperature_entity: sensor.sonoff_temperature_sensor_temperature` on Master Bedroom (YAML or Edit room picker) → first row is icon | value (e.g. `22.4°C`); name and subtitle start under the icon.
5. Disable or remove the sensor → the slot shows `—`; layout does not snap back to stacked.
6. Compact / no-header cards still hide the temperature.
