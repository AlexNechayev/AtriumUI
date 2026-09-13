# Implementation: Shell settings drawer PRD

| Field | Value |
| --- | --- |
| Branch | `docs/shell-drawer-prd` |
| Worktree | `.worktrees/docs-shell-drawer-prd` |
| Status | In progress |

## Goal

Capture the brainstormed shell settings drawer as an official UX feature spec, index it from the PRD catalog, and patch companion docs (shell-grid, edit-mode, design-system, localize, scope) so YAML, edit chrome, tokens, and i18n stay consistent. No production code in this pass.

## Linked official docs

- [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md)
- [`docs/PRD.md`](../../PRD.md) D15
- [`docs/prd/platform/shell-grid.md`](../../prd/platform/shell-grid.md)
- [`docs/prd/ux/edit-mode.md`](../../prd/ux/edit-mode.md)
- [`docs/prd/ux/design-system.md`](../../prd/ux/design-system.md)
- [`docs/prd/ux/localize.md`](../../prd/ux/localize.md)
- [`docs/ARCHITECTURE.md`](../../ARCHITECTURE.md) D2 / C8 (one shell; one token system)

## Decisions

- Drawer lives on both Home and classic `au-shell-grid`; icon top-right; pencil stays.
- Persist `theme` and drawer-owned keys on this shell’s Lovelace YAML (storage-mode). No live HA-instance store.
- Item visibility is YAML-only (`drawer:`). Dashboard settings does not toggle drawer items.
- Atrium light/dark/system is shell color-scheme, not HA `set_theme`.

## Files touched

- `docs/prd/ux/shell-drawer.md` (new)
- `docs/PRD.md`
- `docs/prd/platform/shell-grid.md`
- `docs/prd/ux/edit-mode.md`
- `docs/prd/ux/design-system.md`
- `docs/prd/ux/localize.md`
- `docs/SCOPE_AND_FEATURES.md`
- `docs/imp/docs/shell-drawer-prd.md`

## Leftover cleanup

- [ ] Runtime implementation (TDD, chrome, overlays) is a later `feature/` session — not this branch

## TDD

Not applicable — markdown-only docs. No `src/` production behavior.

## Verification

### Automated

- Docs-only; no production suite required. Optional sanity: `npm run verify` from the worktree (must stay green; no `src/` change).

### Acceptance (from docs/prd/ux/shell-drawer.md)

- Spec exists, uses the PRD template, and lists ACs 1–10 from the locked brainstorm.
- PRD index catalogs the feature and records D15.
- Companion specs mention `theme` / `drawer`, second edit entry, Atrium color-scheme, and drawer i18n.

### Manual

1. Open [`docs/prd/ux/shell-drawer.md`](../../prd/ux/shell-drawer.md) and confirm in/out, YAML sketch, key ownership table, and §7 ACs.
2. From [`docs/PRD.md`](../../PRD.md) §7.3, follow the Shell drawer link.
3. Confirm shell-grid, edit-mode, design-system, localize, and SCOPE_AND_FEATURES cross-links match the spec.
