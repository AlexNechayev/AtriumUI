import { describe, it, expect } from 'vitest';
import { isRtlLanguage, localize, normalizeLanguage } from '../../src/localize/localize';

describe('localize', () => {
  it('normalizes language codes', () => {
    expect(normalizeLanguage('en-US')).toBe('en');
    expect(normalizeLanguage('ru')).toBe('ru');
    expect(normalizeLanguage('he-IL')).toBe('he');
    expect(normalizeLanguage('zz')).toBe('en');
  });

  it('translates keys', () => {
    expect(localize('en', 'home.back')).toBe('Back');
    expect(localize('ru', 'home.back')).toBe('Назад');
    expect(localize('he', 'home.back')).toBe('חזרה');
  });

  it('detects RTL', () => {
    expect(isRtlLanguage('he')).toBe(true);
    expect(isRtlLanguage('en')).toBe(false);
  });
});
