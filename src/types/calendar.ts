import type { LovelaceCardConfig } from './home-assistant';

/** Configurable preview layout for `au-calendar-card`. */
export type AuCalendarView = 'agenda' | 'today' | 'week' | 'month';

/** How event times are displayed. */
export type AuCalendarTimezoneMode = 'local' | 'event';

/** Wall-clock format for event time ranges. Default `24h`. */
export type AuCalendarTimeFormat = '12h' | '24h';

/** One calendar entity shown in the preview. */
export interface AuCalendarEntityConfig {
  entity: string;
  /** Accent color for this calendar (CSS color). */
  color?: string;
  /** Short label shown next to events. */
  label?: string;
  /**
   * Reserved for a future CRUD phase. Ignored in view-only v1.
   */
  writable?: boolean;
}

/**
 * `au-calendar-card` — view-only agenda / strip / week / month preview over
 * Home Assistant `calendar.*` entities (Google, CalDAV/iCloud, Local, etc.).
 */
export interface AuCalendarCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  /** Default `agenda`. */
  view?: AuCalendarView;
  entities?: Array<string | AuCalendarEntityConfig>;
  /** Fetch / agenda horizon in days. Default 31. */
  days?: number;
  /** Cap on rendered events (agenda). Default 12. */
  max_events?: number;
  /** Poll interval in minutes. Default 60. */
  refresh_minutes?: number;
  /** Default `local`. */
  timezone?: AuCalendarTimezoneMode;
  /** Event time display. Default `24h`. */
  time_format?: AuCalendarTimeFormat;
  /** Show Fullscreen control (default true). Kept key for YAML compat. */
  expand_on_tap?: boolean;
  show_location?: boolean;
  show_description?: boolean;
  show_calendar_label?: boolean;
  show_view_picker?: boolean;
  /** RegExp source matched against event summary (include). */
  allowlist?: string;
  /** RegExp source matched against event summary (exclude). */
  blocklist?: string;
  hide_all_day?: boolean;
}

/** Normalized event used by the card UI. */
export interface AuCalendarEvent {
  uid: string;
  summary: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  description?: string;
  entityId: string;
  color: string;
  label?: string;
  recurrenceId?: string;
}

/** Raw event shape from `calendar.get_events` / WS. */
export interface HaCalendarEventRaw {
  uid?: string;
  summary?: string;
  start?: string | { date?: string; dateTime?: string };
  end?: string | { date?: string; dateTime?: string };
  location?: string;
  description?: string;
  recurrence_id?: string;
}

const DEFAULT_COLORS = [
  '#FF3B30',
  '#FF9500',
  '#FFCC00',
  '#34C759',
  '#007AFF',
  '#5856D6',
  '#AF52DE',
  '#FF2D55',
] as const;

/** Normalize YAML entity entries; assign default Apple-like colors. */
export function normalizeCalendarEntities(
  entities: AuCalendarCardConfig['entities'],
): AuCalendarEntityConfig[] {
  if (!Array.isArray(entities)) return [];
  const out: AuCalendarEntityConfig[] = [];
  const seen = new Set<string>();
  let colorIndex = 0;
  for (const entry of entities) {
    if (typeof entry === 'string') {
      const id = entry.trim().toLowerCase();
      if (!id || !id.includes('.') || seen.has(id)) continue;
      seen.add(id);
      out.push({
        entity: id,
        color: DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length],
      });
      colorIndex += 1;
      continue;
    }
    if (!entry || typeof entry !== 'object') continue;
    const id =
      typeof entry.entity === 'string' ? entry.entity.trim().toLowerCase() : '';
    if (!id || !id.includes('.') || seen.has(id)) continue;
    seen.add(id);
    const color =
      typeof entry.color === 'string' && entry.color.trim()
        ? entry.color.trim()
        : DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length];
    colorIndex += 1;
    out.push({
      entity: id,
      color,
      ...(typeof entry.label === 'string' && entry.label.trim()
        ? { label: entry.label.trim() }
        : {}),
      ...(typeof entry.writable === 'boolean'
        ? { writable: entry.writable }
        : {}),
    });
  }
  return out;
}

export function isAuCalendarView(value: unknown): value is AuCalendarView {
  return (
    value === 'agenda' ||
    value === 'today' ||
    value === 'week' ||
    value === 'month'
  );
}
