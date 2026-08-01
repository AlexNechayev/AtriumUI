# Feature: Localize

| Field | Value |
| --- | --- |
| ID | `prd/ux/localize` |
| Status | Draft |
| Priority | Core polish |
| Primary job impact | Supporting |
| Platforms | Home Assistant Lovelace (Panel view + HACS/manual resource) |
| Companion | [`PRD.md`](../../PRD.md) D12; `src/localize/` |

---

## 1. Problem & user story

**Problem:** UI chrome must follow the user’s HA language, including Hebrew RTL.

**User story:** As a Home Assistant user, I want AtriumUI strings in English, Russian, or Hebrew matching `hass.language`, so the shell matches the rest of HA.

---

## 2. In / out of scope

### In scope
- Catalogs: `en`, `ru`, `he`
- Language from `hass.language`
- RTL for Hebrew

### Out of scope (this feature)
- Additional locales
- User-entered entity names translation

---

## 3. Config / data model

| Key | Fields | Notes |
| --- | --- | --- |
| Catalogs | `src/localize/{en,ru,he}.ts` | Keyed strings |
| API | `localize.ts` helpers | Used by cards/shell |

---

## 4. Behaviors & business rules

1. Missing key falls back sensibly (typically English).
2. Unused keys should be cleaned opportunistically (assessment low).

---

## 5. UX flows

### Primary flow
1. Change HA language → reload/view update → Atrium strings follow.

---

## 6. Edge cases & errors

| Case | Behavior |
| --- | --- |
| Unknown language code | Fall back to English |
| Mixed LTR entity IDs in RTL | Keep IDs LTR-safe |

---

## 7. Acceptance criteria

1. en/ru/he catalogs cover shell and card chrome strings in use.
2. Hebrew UI sets RTL where shell/card chrome requires it.
3. Language tracks `hass.language`.

---

## 8. Dependencies

| Depends on | Why |
| --- | --- |
| HA `hass.language` | Locale source |

---

## 9. Implementation

This feature **implements** via:

| Symbol | Path |
| --- | --- |
| `localize()` | `src/localize/localize.ts` |
| `isRtlLanguage()` | `src/localize/localize.ts` |
| Catalogs `en` / `ru` / `he` | `src/localize/en.ts`, `src/localize/ru.ts`, `src/localize/he.ts` |
