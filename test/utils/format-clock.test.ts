import { describe, it, expect } from 'vitest';
import {
  formatClock,
  formatToolbarClock,
} from '../../src/utils/format-clock';
import {
  formatGreeting,
  greetingPeriod,
} from '../../src/utils/format-greeting';

describe('formatClock', () => {
  // Local timezone: construct via Date so assertions match wall clock fields.
  const at = (hours: number, minutes: number): number => {
    const d = new Date(2026, 0, 15, hours, minutes, 30);
    return d.getTime();
  };

  it('formats 24h with zero-padded hours and minutes', () => {
    expect(formatClock(at(9, 5), '24h')).toBe('09:05');
    expect(formatClock(at(0, 0), '24h')).toBe('00:00');
    expect(formatClock(at(23, 59), '24h')).toBe('23:59');
  });

  it('defaults to 24h when format is omitted', () => {
    expect(formatClock(at(14, 7))).toBe('14:07');
  });

  it('formats 12h with AM/PM', () => {
    expect(formatClock(at(0, 5), '12h')).toBe('12:05 AM');
    expect(formatClock(at(9, 5), '12h')).toBe('9:05 AM');
    expect(formatClock(at(12, 0), '12h')).toBe('12:00 PM');
    expect(formatClock(at(13, 30), '12h')).toBe('1:30 PM');
    expect(formatClock(at(23, 59), '12h')).toBe('11:59 PM');
  });
});

describe('formatToolbarClock', () => {
  // Thursday 2026-07-23
  const ms = new Date(2026, 6, 23, 14, 5, 0).getTime();

  it('composes date, short weekday, and 24h time by default', () => {
    expect(
      formatToolbarClock(ms, { language: 'en' }),
    ).toBe('23/07 Thu · 14:05');
  });

  it('supports mm/dd date order and 12h time', () => {
    expect(
      formatToolbarClock(ms, {
        language: 'en',
        clock_date_format: 'mm/dd',
        clock_format: '12h',
      }),
    ).toBe('07/23 Thu · 2:05 PM');
  });

  it('supports long weekday', () => {
    expect(
      formatToolbarClock(ms, {
        language: 'en',
        clock_day_format: 'long',
      }),
    ).toBe('23/07 Thursday · 14:05');
  });

  it('omits date when clock_show_date is false', () => {
    expect(
      formatToolbarClock(ms, {
        language: 'en',
        clock_show_date: false,
      }),
    ).toBe('Thu · 14:05');
  });

  it('omits weekday when clock_show_day is false', () => {
    expect(
      formatToolbarClock(ms, {
        language: 'en',
        clock_show_day: false,
      }),
    ).toBe('23/07 · 14:05');
  });

  it('returns time only when date and day are both off', () => {
    expect(
      formatToolbarClock(ms, {
        clock_show_date: false,
        clock_show_day: false,
      }),
    ).toBe('14:05');
  });
});

describe('greetingPeriod / formatGreeting', () => {
  const atHour = (hour: number): number =>
    new Date(2026, 6, 23, hour, 0, 0).getTime();

  it('maps local hours to greeting periods', () => {
    expect(greetingPeriod(atHour(5))).toBe('morning');
    expect(greetingPeriod(atHour(11))).toBe('morning');
    expect(greetingPeriod(atHour(12))).toBe('noon');
    expect(greetingPeriod(atHour(16))).toBe('noon');
    expect(greetingPeriod(atHour(17))).toBe('evening');
    expect(greetingPeriod(atHour(20))).toBe('evening');
    expect(greetingPeriod(atHour(21))).toBe('night');
    expect(greetingPeriod(atHour(4))).toBe('night');
    expect(greetingPeriod(atHour(0))).toBe('night');
  });

  it('localizes greeting text without a name', () => {
    expect(formatGreeting(atHour(8), 'en')).toBe('Good morning');
    expect(formatGreeting(atHour(14), 'en')).toBe('Good afternoon');
    expect(formatGreeting(atHour(18), 'en')).toBe('Good evening');
    expect(formatGreeting(atHour(22), 'en')).toBe('Good night');
    expect(formatGreeting(atHour(8), 'he')).toBe('בוקר טוב');
    expect(formatGreeting(atHour(8), 'ru')).toBe('Доброе утро');
  });
});
