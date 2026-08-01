# Feature: Home tiles

| Field | Value |
| --- | --- |
| ID | `prd/ux/home-tiles` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Home shell |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`PRD.md`](../../PRD.md) D3, D9; MASTER_ASSESSMENT UI/UX |

---

## 1. Problem & user story

**Problem:** Home mode must read as one visual language (squircle tiles, domain-colored on fills, large type), not a mix of Material and Home.

**User story:** As a Home Assistant user, I want Home room and entity tiles to share one look, so the dashboard feels intentional.

---

## 2. In / out of scope

### In scope
- Soft squircle room/device tiles; domain-colored “on” fills
- Automatic `variant: home` on Home entity tiles
- Presence strip home/away motion
- Sensor and other cards honor Home variant (Phase 1 — **done** for sensor)

### Out of scope (this feature)
- Classic-grid-only Material chrome as a second design system

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Variant | `variant: home` | Injected by shell for Home entities |
| Styles | `auHomeTileStyles` / tokens | From theme |

---

## 4. Behaviors & business rules

1. Home overview + in-room tiles use Home look.
2. Tokens win over outdated README/Material hex values (Phase 1 alignment).
3. Do not introduce a parallel accent (no `#03a9f4` drift).

---

## 5. UX flows

### Primary flow
1. Open Home → rooms/entities show Home tiles → tap room → entity tiles stay Home-styled.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Card without Home path | Must not ship in Home shell without `variant: home` |

---

## 7. Acceptance criteria

1. Home entity tiles receive `variant: home` and Home styles.
2. Presence strip animates home/away.
3. Accent/gap/radius match [design-system](./design-system.md).
4. Sensor Home path exists (**done** — Phase 1).

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| [design-system.md](./design-system.md) | Source of truth |
| [../platform/shell-grid.md](../platform/shell-grid.md) | Home mode |

---

## 9. Implementation

This feature **implements** via:

| Symbol | Path |
| --- | --- |
| `auHomeTileStyles` | `src/theme/home-style.ts` |
| `auHomeTokens` | `src/theme/home-style.ts` |
| `auTokens` | `src/theme/tokens.ts` |
| Home `variant: home` injection | `AuShellHomeView` / child config helpers in `src/template/shell-grid/` |
