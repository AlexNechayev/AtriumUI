# Session follow-ups

Living backlog of open questions and deferred investigations from any agent session. Agents append unresolved items here; answers and notes land on the same entries later.

Sources include Graphify Suggested Questions, architecture reviews, blocked decisions, and any “check later” item parked mid-session.

## Open

### Remaining Phase 3–4 product backlog

| Field | Value |
| --- | --- |
| Status | open |
| First seen | 2026-08-01 |
| Source | open-edges audit reconcile |

**Track:**

1. Shared gestures + pending-control consolidation (Phase 3)
2. Climate home/classic dual-wiring cleanup (Phase 3/4)
3. Edit draft/commit discipline — dual drafts / eager commit (Phase 4)
4. Carve `AuShellHomeView` into focused modules (Phase 4)
5. Config immutability in `setConfig` (Phase 4)
6. Layering: `controlIcon` → utils (Med)
7. Dead code / orphan cleanup (Low–Med)

See [`SCOPE_AND_FEATURES.md`](./SCOPE_AND_FEATURES.md) §4 and [`PRD.md`](./PRD.md) §6.

**Notes:** Phase 1–2 High items reconciled closed against `src/` on 2026-08-01.

---

## Answered

### Why does `AuShellHomeView` bridge so many Home communities?

| Field | Value |
| --- | --- |
| Status | answered |
| First seen | 2026-08-01 |
| Source | graphify Suggested Questions |

**Question:** Why does `AuShellHomeView` connect `Home View Idle Timer` to `Child Card Factory`, `Clock Greeting Format`, `Grid Item Interaction`, `Home Edit Room`, `Home Add Commit Flow`, `Shell Grid Editor`, `Home Layout Editing`, `Grid Engine Layout`, `Home Card Edit Apply`?

**Answer:** Expected god-object betweenness, not a missing doc edge. `AuShellHomeView` owns Home overview, room navigation, idle timeout, child-card creation, clock/greeting, and edit/add flows in one Lit element, so AST edges fan into many Home communities. **Action:** keep as Phase 4 carve-up debt (see Open backlog); no further graph investigation needed.

### Why does `lit` bridge so many card communities?

| Field | Value |
| --- | --- |
| Status | answered |
| First seen | 2026-08-01 |
| Source | graphify Suggested Questions |

**Question:** Why does `lit` connect so many card/editor communities?

**Answer:** Framework dependency artifact. Nearly every card/editor imports Lit decorators/helpers (`customElement`, `property`, `state`, `html`, `css`), so the `lit` package node has high betweenness. **Action:** dismiss as graph noise; do not split communities around `lit`.

### Why does `HomeAssistant` bridge Home edit and card utilities?

| Field | Value |
| --- | --- |
| Status | answered |
| First seen | 2026-08-01 |
| Source | graphify Suggested Questions |

**Question:** Why does `HomeAssistant` connect Home edit communities to card utilities?

**Answer:** Shared HA runtime type. Edit flows and card utils both take `hass: HomeAssistant` for `states` / `callService` / language, so the type node bridges those communities. **Action:** dismiss as expected typing hub; not a modularity bug by itself.

### What connects weakly-linked UI action / tag-map nodes?

| Field | Value |
| --- | --- |
| Status | answered |
| First seen | 2026-08-01 |
| Source | graphify Suggested Questions |

**Question:** What connects `ACTION_CARD_UI_ACTIONS`, `HTMLElementTagNameMap`, … to the rest of the system?

**Answer:** Mostly AST leaf noise. Repeated `HTMLElementTagNameMap` augmentations and thin const/schema nodes often have degree ≤1 after extraction. Real product gaps were PRD↔code missing `implements` edges (addressed 2026-08-01 via PRD §9 Implementation tables + graph re-ingest), not undocumented runtime modules. **Action:** ignore isolate count unless a named product symbol stays orphaned after re-ingest.

### Should `Home View Idle Timer` be split?

| Field | Value |
| --- | --- |
| Status | answered |
| First seen | 2026-08-01 |
| Source | graphify Suggested Questions |

**Question:** Should `Home View Idle Timer` be split into smaller, more focused modules?

**Answer:** Yes — as part of Phase 4 `AuShellHomeView` carve-up, not as a separate timer-only refactor. Low cohesion (≈0.05) reflects the god-object bundling idle timeout with Home/edit UI. **Action:** tracked under Open Phase 3–4 backlog item 4.

### Should `Light Card Controls` be split?

| Field | Value |
| --- | --- |
| Status | answered |
| First seen | 2026-08-01 |
| Source | graphify Suggested Questions |

**Question:** Should `Light Card Controls` be split into smaller, more focused modules?

**Answer:** Partially — share gestures/pending-control with other sliders (Phase 3), rather than splitting the light card community for its own sake. Cohesion ≈0.08 is a clustering smell tied to duplicated pointer/pending patterns. **Action:** tracked under Open backlog item 1 (shared gestures).

### Should `Sliders and Steppers` be split?

| Field | Value |
| --- | --- |
| Status | answered |
| First seen | 2026-08-01 |
| Source | graphify Suggested Questions |

**Question:** Should `Sliders and Steppers` be split into smaller, more focused modules?

**Answer:** Prefer consolidating shared gesture/pending-control into one util path (Phase 3) over splitting the community. Light slider + temp stepper already share a visual/control niche; the debt is duplicated interaction logic, not folder layout. **Action:** same as Light Card Controls — Phase 3 shared gestures.
