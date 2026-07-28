/** Toolbar clock display format for `au-shell-grid`. */
export type ClockFormat = '12h' | '24h';

/** Date order for the toolbar clock (no year). */
export type ClockDateFormat = 'dd/mm' | 'mm/dd';

/** Weekday length for the toolbar clock. */
export type ClockDayFormat = 'short' | 'long';

/** Options for composing date + weekday + time on the toolbar clock. */
export interface ToolbarClockOptions {
  clock_format?: ClockFormat;
  /** Show calendar date. Default true. */
  clock_show_date?: boolean;
  /** Date pattern. Default `'dd/mm'`. */
  clock_date_format?: ClockDateFormat;
  /** Show weekday. Default true. */
  clock_show_day?: boolean;
  /** Weekday length. Default `'short'`. */
  clock_day_format?: ClockDayFormat;
  /** HA/UI language for weekday labels (e.g. `en`, `he-IL`). */
  language?: string;
}

/**
 * Format a wall-clock time for the Home/Room toolbar.
 * Hours and minutes only (no seconds).
 */
export function formatClock(
  ms: number,
  format: ClockFormat = '24h',
): string {
  const d = new Date(ms);
  const minutes = String(d.getMinutes()).padStart(2, '0');
  if (format === '12h') {
    const hour24 = d.getHours();
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  }
  const hours = String(d.getHours()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatClockDate(d: Date, format: ClockDateFormat): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return format === 'mm/dd' ? `${month}/${day}` : `${day}/${month}`;
}

function formatClockWeekday(
  d: Date,
  format: ClockDayFormat,
  language: string | undefined,
): string {
  return new Intl.DateTimeFormat(language || 'en', {
    weekday: format === 'long' ? 'long' : 'short',
  }).format(d);
}

/**
 * Compose toolbar clock: `23/07 Mon · 14:05` (date · weekday · time).
 * Omits disabled segments; keeps `clock_format` for the time part.
 */
export function formatToolbarClock(
  ms: number,
  options: ToolbarClockOptions = {},
): string {
  const d = new Date(ms);
  const left: string[] = [];

  if (options.clock_show_date !== false) {
    const dateFmt =
      options.clock_date_format === 'mm/dd' ? 'mm/dd' : 'dd/mm';
    left.push(formatClockDate(d, dateFmt));
  }

  if (options.clock_show_day !== false) {
    const dayFmt = options.clock_day_format === 'long' ? 'long' : 'short';
    left.push(formatClockWeekday(d, dayFmt, options.language));
  }

  const time = formatClock(
    ms,
    options.clock_format === '12h' ? '12h' : '24h',
  );

  if (left.length === 0) return time;
  return `${left.join(' ')} · ${time}`;
}
