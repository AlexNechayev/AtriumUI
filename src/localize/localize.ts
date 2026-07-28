import { en, type TranslationKey } from './en';
import { ru } from './ru';
import { he } from './he';

const TABLES: Record<string, Record<TranslationKey, string>> = {
  en,
  ru,
  he,
};

/** Languages with right-to-left UI. */
export const RTL_LANGUAGES = new Set(['he', 'ar', 'fa']);

/** Normalize HA language codes (`en-US` → `en`). */
export function normalizeLanguage(language: string | undefined): string {
  if (!language) return 'en';
  const base = language.toLowerCase().split(/[-_]/)[0] ?? 'en';
  return base in TABLES ? base : 'en';
}

/** Translate a key using HA language with English fallback. */
export function localize(
  language: string | undefined,
  key: TranslationKey,
): string {
  const lang = normalizeLanguage(language);
  return TABLES[lang]?.[key] ?? en[key] ?? key;
}

/** True when the UI should flip for the given language. */
export function isRtlLanguage(language: string | undefined): boolean {
  return RTL_LANGUAGES.has(normalizeLanguage(language));
}
