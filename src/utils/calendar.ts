import type { HomeAssistant } from '../types/home-assistant';
import type {
  AuCalendarEntityConfig,
  AuCalendarEvent,
  AuCalendarTimezoneMode,
  AuCalendarView,
  HaCalendarEventRaw,
} from '../types/calendar';
import { formatClock, type ClockFormat } from './format-clock';

/** HA service call result when `returnResponse` is true. */
export interface ServiceCallResponse {
  response?: unknown;
}

type CallServiceWithResponse = (
  domain: string,
  service: string,
  serviceData?: Record<string, unknown>,
  target?: Record<string, unknown>,
  notifyOnError?: boolean,
  returnResponse?: boolean,
) => Promise<void | ServiceCallResponse>;

/** Start of local calendar day for `d`. */
export function startOfLocalDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

/** Exclusive end of local calendar day for `d` (start of next day). */
export function endOfLocalDay(d: Date): Date {
  const out = startOfLocalDay(d);
  out.setDate(out.getDate() + 1);
  return out;
}

/** Sunday-start week containing `d` (local). */
export function startOfLocalWeek(d: Date): Date {
  const day = startOfLocalDay(d);
  const weekday = day.getDay(); // 0 Sun … 6 Sat
  day.setDate(day.getDate() - weekday);
  return day;
}

/** Compact DOW headers for Sunday-start grids. */
export const WEEKDAY_LABELS_SUN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

/** First day of the month containing `d` (local). */
export function startOfLocalMonth(d: Date): Date {
  const out = startOfLocalDay(d);
  out.setDate(1);
  return out;
}

/** Format for `calendar.get_events` date fields. */
export function formatHaDateTime(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}:${s}`;
}

/** Compute fetch window from view + horizon days. */
export function computeFetchWindow(
  view: AuCalendarView,
  days: number,
  now: Date = new Date(),
): { start: Date; end: Date } {
  const horizon = Math.max(1, Math.floor(days));
  if (view === 'today') {
    return { start: startOfLocalDay(now), end: endOfLocalDay(now) };
  }
  if (view === 'week') {
    const start = startOfLocalWeek(now);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }
  if (view === 'month') {
    const start = startOfLocalMonth(now);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    return { start, end };
  }
  // agenda — from local midnight so today's remaining events are included
  const start = startOfLocalDay(now);
  const end = new Date(start);
  end.setDate(end.getDate() + horizon);
  return { start, end };
}

/**
 * Parse HA calendar instants. Official responses use `"YYYY-MM-DD HH:MM:SS"`
 * (space, no timezone) which `new Date(...)` rejects in WebKit — parse manually.
 */
export function parseInstant(
  value: string | { date?: string; dateTime?: string } | undefined,
): { date: Date; allDay: boolean } | undefined {
  if (value == null) return undefined;
  if (typeof value === 'object') {
    if (typeof value.dateTime === 'string' && value.dateTime.trim()) {
      return parseInstant(value.dateTime.trim());
    }
    if (typeof value.date === 'string' && value.date.trim()) {
      return parseInstant(value.date.trim());
    }
    return undefined;
  }
  const raw = value.trim();
  if (!raw) return undefined;

  // All-day: YYYY-MM-DD
  const dayOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (dayOnly) {
    const date = new Date(
      Number(dayOnly[1]),
      Number(dayOnly[2]) - 1,
      Number(dayOnly[3]),
      0,
      0,
      0,
      0,
    );
    return { date, allDay: true };
  }

  // HA get_events timed: "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DDTHH:MM:SS"
  const local = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(
    raw,
  );
  if (local && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) {
    const date = new Date(
      Number(local[1]),
      Number(local[2]) - 1,
      Number(local[3]),
      Number(local[4]),
      Number(local[5]),
      Number(local[6] ?? 0),
      0,
    );
    return { date, allDay: false };
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return undefined;
  return { date, allDay: false };
}

/** Parse `calendar.get_events` response map into raw events per entity. */
export function parseGetEventsResponse(
  response: unknown,
): Record<string, HaCalendarEventRaw[]> {
  if (!response || typeof response !== 'object') return {};
  const out: Record<string, HaCalendarEventRaw[]> = {};
  for (const [entityId, payload] of Object.entries(
    response as Record<string, unknown>,
  )) {
    if (!payload || typeof payload !== 'object') {
      out[entityId] = [];
      continue;
    }
    const events = (payload as { events?: unknown }).events;
    out[entityId] = Array.isArray(events)
      ? (events as HaCalendarEventRaw[])
      : [];
  }
  return out;
}

/**
 * Fetch events for the given calendars.
 *
 * `calendar.get_events` requires entities in **target** (not service data).
 * Tries return-response `callService`, then `callWS`, then REST `callApi`.
 */
export async function fetchCalendarEvents(
  hass: HomeAssistant,
  entityIds: string[],
  start: Date,
  end: Date,
): Promise<Record<string, HaCalendarEventRaw[]>> {
  if (entityIds.length === 0) return {};

  const serviceData = {
    start_date_time: formatHaDateTime(start),
    end_date_time: formatHaDateTime(end),
  };
  const target = { entity_id: entityIds };

  const callService = hass.callService as CallServiceWithResponse;
  try {
    const result = await callService(
      'calendar',
      'get_events',
      serviceData,
      target,
      true,
      true,
    );
    if (result && typeof result === 'object' && 'response' in result) {
      return parseGetEventsResponse(result.response);
    }
  } catch {
    /* fall through */
  }

  if (hass.callWS) {
    try {
      const result = await hass.callWS<{ response?: unknown }>({
        type: 'call_service',
        domain: 'calendar',
        service: 'get_events',
        service_data: serviceData,
        target,
        return_response: true,
      });
      if (result?.response) {
        return parseGetEventsResponse(result.response);
      }
    } catch {
      /* fall through */
    }
  }

  // Official HA calendar panel uses GET /api/calendars/<entity>?start&end
  if (hass.callApi) {
    const out: Record<string, HaCalendarEventRaw[]> = {};
    let anyOk = false;
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    for (const id of entityIds) {
      try {
        const path = `calendars/${id}?start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`;
        const events = await hass.callApi<HaCalendarEventRaw[]>('GET', path);
        out[id] = Array.isArray(events) ? events : [];
        anyOk = true;
      } catch {
        out[id] = [];
      }
    }
    if (anyOk) return out;
  }

  throw new Error('Calendar fetch unavailable');
}

export interface NormalizeCalendarOptions {
  hideAllDay?: boolean;
  allowlist?: string;
  blocklist?: string;
  maxEvents?: number;
  /** Drop events whose end is at or before this instant (before maxEvents). */
  now?: Date;
}

function compileFilter(source: string | undefined): RegExp | undefined {
  if (!source || !source.trim()) return undefined;
  try {
    return new RegExp(source, 'i');
  } catch {
    return undefined;
  }
}

/** Flatten, filter, sort, and cap raw HA events. */
export function normalizeCalendarEvents(
  byEntity: Record<string, HaCalendarEventRaw[]>,
  entityConfigs: AuCalendarEntityConfig[],
  options: NormalizeCalendarOptions = {},
): AuCalendarEvent[] {
  const configById = new Map(
    entityConfigs.map((c) => [c.entity, c] as const),
  );
  const allow = compileFilter(options.allowlist);
  const block = compileFilter(options.blocklist);
  const out: AuCalendarEvent[] = [];

  for (const [entityId, rawEvents] of Object.entries(byEntity)) {
    const cfg = configById.get(entityId);
    const color = cfg?.color ?? '#007AFF';
    const label = cfg?.label;
    for (const raw of rawEvents) {
      const startParsed = parseInstant(raw.start);
      const endParsed = parseInstant(raw.end);
      if (!startParsed) continue;
      const allDay = startParsed.allDay || Boolean(endParsed?.allDay);
      if (options.hideAllDay && allDay) continue;
      const summary =
        typeof raw.summary === 'string' && raw.summary.trim()
          ? raw.summary.trim()
          : '(No title)';
      if (allow && !allow.test(summary)) continue;
      if (block && block.test(summary)) continue;
      const start = startParsed.date;
      const end = endParsed?.date ?? new Date(start.getTime() + 60 * 60 * 1000);
      if (options.now && end.getTime() <= options.now.getTime()) continue;
      const uid =
        typeof raw.uid === 'string' && raw.uid.trim()
          ? raw.uid.trim()
          : `${entityId}:${start.toISOString()}:${summary}`;
      out.push({
        uid,
        summary,
        start,
        end,
        allDay,
        entityId,
        color,
        ...(label ? { label } : {}),
        ...(typeof raw.location === 'string' && raw.location.trim()
          ? { location: raw.location.trim() }
          : {}),
        ...(typeof raw.description === 'string' && raw.description.trim()
          ? { description: raw.description.trim() }
          : {}),
        ...(typeof raw.recurrence_id === 'string' && raw.recurrence_id.trim()
          ? { recurrenceId: raw.recurrence_id.trim() }
          : {}),
      });
    }
  }

  out.sort((a, b) => a.start.getTime() - b.start.getTime());
  const max = options.maxEvents;
  if (max != null && max > 0 && out.length > max) {
    return out.slice(0, max);
  }
  return out;
}

/** Group events by local YYYY-MM-DD key. */
export function groupEventsByDay(
  events: AuCalendarEvent[],
): Array<{ key: string; date: Date; events: AuCalendarEvent[] }> {
  const map = new Map<string, { date: Date; events: AuCalendarEvent[] }>();
  for (const ev of events) {
    const day = startOfLocalDay(ev.start);
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    let bucket = map.get(key);
    if (!bucket) {
      bucket = { date: day, events: [] };
      map.set(key, bucket);
    }
    bucket.events.push(ev);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ key, date: value.date, events: value.events }));
}

/** Format an event's time range for display. Default `24h`. */
export function formatEventTimeRange(
  event: AuCalendarEvent,
  timeFormat: ClockFormat = '24h',
  _timezone: AuCalendarTimezoneMode = 'local',
  allDayLabel = 'All day',
): string {
  if (event.allDay) return allDayLabel;
  const fmt: ClockFormat = timeFormat === '12h' ? '12h' : '24h';
  // `timezone: event` still displays in the browser local clock for v1;
  // HA payloads are already converted when served as ISO strings.
  const start = formatClock(event.start.getTime(), fmt);
  const end = formatClock(event.end.getTime(), fmt);
  return `${start} – ${end}`;
}

/** Locale day header, e.g. "Sat, Jul 18". */
export function formatDayHeader(
  date: Date,
  language: string | undefined,
): string {
  try {
    return new Intl.DateTimeFormat(language || 'en', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

/** Days in the month grid (includes leading/trailing padding Sun–Sat). */
export function buildMonthGrid(monthStart: Date): Date[] {
  const start = startOfLocalMonth(monthStart);
  const gridStart = startOfLocalWeek(start);
  const days: Date[] = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
}

/** Inclusive local-day fetch window covering a month grid (42 days). */
export function computeMonthGridWindow(monthStart: Date): {
  start: Date;
  end: Date;
} {
  const grid = buildMonthGrid(monthStart);
  const start = startOfLocalDay(grid[0]!);
  const end = endOfLocalDay(grid[grid.length - 1]!);
  return { start, end };
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** True when `event` intersects the local calendar day `[day, nextDay)`. */
export function eventOverlapsLocalDay(
  event: AuCalendarEvent,
  day: Date,
): boolean {
  const dayStart = startOfLocalDay(day).getTime();
  const dayEnd = endOfLocalDay(day).getTime();
  return event.start.getTime() < dayEnd && event.end.getTime() > dayStart;
}

/** True when the event covers more than one local calendar day. */
export function isSpanningEvent(event: AuCalendarEvent): boolean {
  return event.end.getTime() > endOfLocalDay(event.start).getTime();
}

export interface MonthDayChip {
  event: AuCalendarEvent;
  text: string;
}

export interface MonthDayPack {
  chips: MonthDayChip[];
  overflow: number;
}

/**
 * Pack single-day (non-spanning) event chips into a month cell.
 * Shows a clock prefix when the cell is wide enough.
 */
export function packMonthDayChips(
  events: AuCalendarEvent[],
  maxLines: number,
  options: {
    cellWidthPx?: number;
    timeFormat?: ClockFormat;
    minWidthForTime?: number;
  } = {},
): MonthDayPack {
  const lines = Math.max(0, Math.floor(maxLines));
  if (lines === 0) {
    return { chips: [], overflow: events.length };
  }
  const minW = options.minWidthForTime ?? 88;
  const showTime = (options.cellWidthPx ?? 120) >= minW;
  const fmt: ClockFormat = options.timeFormat === '12h' ? '12h' : '24h';
  const visible = events.slice(0, lines);
  const chips = visible.map((event) => {
    if (showTime && !event.allDay) {
      return {
        event,
        text: `${formatClock(event.start.getTime(), fmt)} ${event.summary}`,
      };
    }
    return { event, text: event.summary };
  });
  return {
    chips,
    overflow: Math.max(0, events.length - chips.length),
  };
}

export interface MonthSpanBar {
  event: AuCalendarEvent;
  weekRow: number;
  startCol: number;
  /** Inclusive length in columns (1–7). */
  spanDays: number;
  lane: number;
}

/**
 * Layout multi-day events as Apple-like bars within each week row of a
 * 42-day Sunday-start month grid.
 */
export function layoutMonthSpanBars(
  events: AuCalendarEvent[],
  grid: Date[],
): MonthSpanBar[] {
  if (grid.length < 7) return [];
  type Seg = Omit<MonthSpanBar, 'lane'> & { lane?: number };
  const segs: Seg[] = [];

  for (const event of events) {
    if (!isSpanningEvent(event)) continue;
    for (let weekRow = 0; weekRow < 6; weekRow += 1) {
      let startCol = -1;
      let endCol = -1;
      for (let col = 0; col < 7; col += 1) {
        const day = grid[weekRow * 7 + col];
        if (!day) continue;
        if (eventOverlapsLocalDay(event, day)) {
          if (startCol < 0) startCol = col;
          endCol = col;
        }
      }
      if (startCol >= 0 && endCol >= startCol) {
        segs.push({
          event,
          weekRow,
          startCol,
          spanDays: endCol - startCol + 1,
        });
      }
    }
  }

  // Assign lanes per week row (greedy by startCol).
  const byRow = new Map<number, Seg[]>();
  for (const seg of segs) {
    const list = byRow.get(seg.weekRow) ?? [];
    list.push(seg);
    byRow.set(seg.weekRow, list);
  }

  const out: MonthSpanBar[] = [];
  for (const [, rowSegs] of byRow) {
    rowSegs.sort(
      (a, b) =>
        a.startCol - b.startCol ||
        b.spanDays - a.spanDays ||
        a.event.start.getTime() - b.event.start.getTime(),
    );
    const laneEnds: number[] = [];
    for (const seg of rowSegs) {
      let lane = 0;
      while (
        lane < laneEnds.length &&
        seg.startCol <= (laneEnds[lane] ?? -1)
      ) {
        lane += 1;
      }
      const endCol = seg.startCol + seg.spanDays - 1;
      laneEnds[lane] = endCol;
      out.push({ ...seg, lane });
    }
  }
  return out;
}
