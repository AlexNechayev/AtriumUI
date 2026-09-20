# Feature: Design tokens

| Field | Value |
| --- | --- |
| ID | `prd/ux/design-system` |
| Status | Active — accent/README/edit chrome aligned; frost polish optional |
| Priority | Core polish |
| Primary job impact | Home shell |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`PRD.md`](../../PRD.md) D3; `src/theme/tokens.ts`; README Design system; [shell drawer](./shell-drawer.md) |

> **Filename note:** This file is `design-system.md` (not `design-tokens.md`) so graphify’s secrets filename filter does not skip it. The product concept remains “Design tokens” (`auTokens`).

---

## 1. Problem & user story

**Problem:** Visual drift appears when docs/edit chrome disagree with the token file.

**User story:** As a developer, I want one token source of truth, so Home look stays consistent across cards, shell, and docs.

---

## 2. In / out of scope

### In scope
- `src/theme/tokens.ts` as source of truth
- Home font, radius, pad, gap, accent `#0a84ff`, motion, state colors
- Binding to HA theme variables with Home fallbacks
- README and edit chrome match tokens (Phase 1 — **done**: accent `#0a84ff`)
- Atrium light/dark/system **color-scheme** on the shell (`theme:` YAML; [shell drawer](./shell-drawer.md)) using this token system — not HA `set_theme`

### Out of scope (this feature)
- A second parallel Material design system
- Switching Home Assistant frontend themes from Atrium

---

## 3. Config / data model

| Token area | Examples | Notes |
| --- | --- | --- |
| Accent | `--au-accent` → `#0a84ff` | Not `#03a9f4` |
| Gap | `--au-home-gap` / `--au-gap` | Token file wins over conflicting docs |
| Radius | `--au-home-radius` 22px / sm 16px | |
| Motion | `--au-motion-fast/medium/slow` | Present in `auTokens`; frost fill polish optional |

---

## 4. Behaviors & business rules

1. New UI MUST use tokens, not hard-coded hex, unless mapping into a token.
2. On conflict between README and `tokens.ts`, **code tokens win**; update README.
3. Prefer HA CSS variables when present; fallbacks match Home look.
4. Shell `theme: light | dark | system` (default `system`) sets Atrium `color-scheme` / host data attribute for shell + cards. Home surface tokens use `light-dark()` with Home fallbacks so the scheme is visible (independent of HA `--card-background-color`). It MUST NOT call HA `set_theme` and MUST NOT introduce a second token file ([shell drawer](./shell-drawer.md)).

---

## 5. UX flows

N/A (system concern). Consumers: all cards/shell.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| HA theme overrides accent | Honor HA var; fallback remains Home blue |
| Doc drift | Fix docs to match `tokens.ts` (code wins) |
| Atrium `theme` vs HA frontend theme | Independent: Atrium color-scheme follows shell YAML; HA theme picker unchanged |

---

## 7. Acceptance criteria

1. `tokens.ts` documents and exports the Home look variables used in UI. (**done**)
2. README Design system table matches token fallbacks. (**done** — `#0a84ff`)
3. Edit chrome uses Home accent from tokens. (**done**)
4. No new `#03a9f4` Material accent introduced. (**done**)
5. Shell drawer theme uses this token system’s color-scheme path, not a parallel palette ([shell drawer](./shell-drawer.md)). Home surfaces in `tokens.ts` use `light-dark()` with the Home light/dark fallbacks so `theme: light|dark|system` actually changes Atrium chrome independently of HA CSS variables.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [home-tiles.md](./home-tiles.md) | Primary consumer |
| [shell-drawer.md](./shell-drawer.md) | Atrium light/dark/system on the shell |
| Architecture C8 | Token authority |

---

## 9. Implementation

This feature **implements** via:

| Symbol | Path |
| --- | --- |
| `auTokens` | `src/theme/tokens.ts` |
| `auHomeTokens` | `src/theme/home-style.ts` |
| `auHomeTileStyles` | `src/theme/home-style.ts` |
