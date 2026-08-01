import { describe, it, expect, vi } from 'vitest';
import {
  computeFetchWindow,
  formatEventTimeRange,
  formatHaDateTime,
  groupEventsByDay,
  normalizeCalendarEvents,
  parseGetEventsResponse,
  parseInstant,
  startOfLocalDay,
  fetchCalendarEvents,
} from '../../src/utils/calendar';
import type { AuCalendarEvent } from '../../src/types/calendar';
import { normalizeCalendarEntities } from '../../src/types/calendar';
import { makeHass } from '../helpers';

describe('calendar utils', () => {
  it('normalizeCalendarEntities assigns colors and dedupes', () => {
    const list = normalizeCalendarEntities([
      'calendar.personal',
      { entity: 'calendar.family', color: '#112233', label: 'Family' },
      'calendar.personal',
    ]);
    expect(list).toHaveLength(2);
    expect(list[0]?.entity).toBe('calendar.personal');
    expect(list[0]?.color).toBeTruthy();
    expect(list[1]?.color).toBe('#112233');
    expect(list[1]?.label).toBe('Family');
  });

  it('computeFetchWindow covers today / week / agenda', () => {
    const now = new Date('2026-07-15T12:00:00');
    const today = computeFetchWindow('today', 7, now);
    expect(today.start.getHours()).toBe(0);
    expect(today.end.getTime()).toBeGreaterThan(today.start.getTime());

    const week = computeFetchWindow('week', 7, now);
    expect(week.end.getTime() - week.start.getTime()).toBe(7 * 24 * 60 * 60 * 1000);

    const agenda = computeFetchWindow('agenda', 3, now);
    expect(agenda.end.getDate()).toBe(18);
  });

  it('parseGetEventsResponse maps entity events', () => {
    const parsed = parseGetEventsResponse({
      'calendar.a': {
        events: [{ summary: 'Meet', start: '2026-07-18T10:00:00', end: '2026-07-18T11:00:00' }],
      },
    });
    expect(parsed['calendar.a']).toHaveLength(1);
  });

  it('normalizeCalendarEvents filters, sorts, and caps', () => {
    const entities = normalizeCalendarEntities([
      { entity: 'calendar.a', color: '#f00' },
    ]);
    const events = normalizeCalendarEvents(
      {
        'calendar.a': [
          {
            summary: 'Later',
            start: '2026-07-19T15:00:00',
            end: '2026-07-19T16:00:00',
          },
          {
            summary: 'Private sync',
            start: '2026-07-18T09:00:00',
            end: '2026-07-18T09:30:00',
          },
          {
            summary: 'Standup',
            start: '2026-07-18T10:00:00',
            end: '2026-07-18T10:30:00',
          },
          {
            summary: 'All day',
            start: '2026-07-20',
            end: '2026-07-21',
          },
        ],
      },
      entities,
      { blocklist: 'private', hideAllDay: true, maxEvents: 2 },
    );
    expect(events).toHaveLength(2);
    expect(events[0]?.summary).toBe('Standup');
    expect(events[1]?.summary).toBe('Later');
    expect(events.every((e) => !e.allDay)).toBe(true);
  });

  it('groupEventsByDay buckets by local day', () => {
    const entities = normalizeCalendarEntities(['calendar.a']);
    const events = normalizeCalendarEvents(
      {
        'calendar.a': [
          {
            summary: 'A',
            start: '2026-07-18T10:00:00',
            end: '2026-07-18T11:00:00',
          },
          {
            summary: 'B',
            start: '2026-07-19T10:00:00',
            end: '2026-07-19T11:00:00',
          },
        ],
      },
      entities,
    );
    const groups = groupEventsByDay(events);
    expect(groups).toHaveLength(2);
    expect(groups[0]?.events[0]?.summary).toBe('A');
  });

  it('formatHaDateTime is HA-friendly', () => {
    const d = new Date(2026, 6, 18, 9, 5, 7);
    expect(formatHaDateTime(d)).toBe('2026-07-18 09:05:07');
  });

  it('parseInstant handles HA space-separated datetimes', () => {
    const timed = parseInstant('2026-07-20 14:30:00');
    expect(timed?.allDay).toBe(false);
    expect(timed?.date.getFullYear()).toBe(2026);
    expect(timed?.date.getMonth()).toBe(6);
    expect(timed?.date.getDate()).toBe(20);
    expect(timed?.date.getHours()).toBe(14);

    const allDay = parseInstant('2026-07-26');
    expect(allDay?.allDay).toBe(true);
    expect(allDay?.date.getDate()).toBe(26);
  });

  it('normalizeCalendarEvents drops ended events before maxEvents', () => {
    const entities = normalizeCalendarEntities([
      { entity: 'calendar.a', color: '#f00' },
    ]);
    const now = new Date('2026-07-18T15:30:00');
    const events = normalizeCalendarEvents(
      {
        'calendar.a': [
          {
            summary: 'Ended',
            start: '2026-07-18T14:00:00',
            end: '2026-07-18T15:00:00',
          },
          {
            summary: 'Ongoing',
            start: '2026-07-18T14:00:00',
            end: '2026-07-18T16:00:00',
          },
          {
            summary: 'Later',
            start: '2026-07-18T17:00:00',
            end: '2026-07-18T18:00:00',
          },
        ],
      },
      entities,
      { now, maxEvents: 1 },
    );
    expect(events).toHaveLength(1);
    expect(events[0]?.summary).toBe('Ongoing');
  });

  it('normalizeCalendarEvents keeps events still running at now', () => {
    const entities = normalizeCalendarEntities(['calendar.a']);
    const now = new Date('2026-07-18T14:30:00');
    const events = normalizeCalendarEvents(
      {
        'calendar.a': [
          {
            summary: 'Meet',
            start: '2026-07-18T14:00:00',
            end: '2026-07-18T15:00:00',
          },
        ],
      },
      entities,
      { now },
    );
    expect(events).toHaveLength(1);
    expect(events[0]?.summary).toBe('Meet');
  });

  it('formatEventTimeRange uses 24h by default and supports 12h', () => {
    const event: AuCalendarEvent = {
      uid: '1',
      summary: 'Meet',
      start: new Date(2026, 6, 18, 14, 0, 0),
      end: new Date(2026, 6, 18, 15, 30, 0),
      allDay: false,
      entityId: 'calendar.a',
      color: '#f00',
    };
    expect(formatEventTimeRange(event)).toBe('14:00 – 15:30');
    expect(formatEventTimeRange(event, '24h')).toBe('14:00 – 15:30');
    expect(formatEventTimeRange(event, '12h')).toBe('2:00 PM – 3:30 PM');
  });

  it('normalizeCalendarEvents accepts HA get_events date strings', () => {
    const entities = normalizeCalendarEntities(['calendar.klly']);
    const events = normalizeCalendarEvents(
      {
        'calendar.klly': [
          {
            summary: 'July 20',
            start: '2026-07-20 10:00:00',
            end: '2026-07-20 11:00:00',
          },
          {
            summary: 'July 26',
            start: '2026-07-26 09:00:00',
            end: '2026-07-26 10:00:00',
          },
        ],
      },
      entities,
    );
    expect(events).toHaveLength(2);
    expect(events.map((e) => e.summary)).toEqual(['July 20', 'July 26']);
  });

  it('fetchCalendarEvents puts entity_id in target', async () => {
    const callService = vi.fn().mockResolvedValue({
      response: {
        'calendar.a': {
          events: [
            {
              summary: 'Hi',
              start: '2026-07-18 10:00:00',
              end: '2026-07-18 11:00:00',
            },
          ],
        },
      },
    });
    const hass = makeHass({}, callService);
    const start = startOfLocalDay(new Date('2026-07-18T12:00:00'));
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const raw = await fetchCalendarEvents(hass, ['calendar.a'], start, end);
    expect(callService).toHaveBeenCalledWith(
      'calendar',
      'get_events',
      {
        start_date_time: expect.any(String),
        end_date_time: expect.any(String),
      },
      { entity_id: ['calendar.a'] },
      true,
      true,
    );
    expect(raw['calendar.a']?.[0]?.summary).toBe('Hi');
  });
});
