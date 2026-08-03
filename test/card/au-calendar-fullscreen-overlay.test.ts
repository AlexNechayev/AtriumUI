import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  AuCalendarFullscreenOverlay,
  ensureCalendarFullscreenOverlay,
} from '../../src/card/calendar-card/au-calendar-fullscreen-overlay';
import type { AuCalendarEvent } from '../../src/types/calendar';

const sampleEvent: AuCalendarEvent = {
  uid: '1',
  summary: 'Team sync',
  start: new Date(2026, 6, 18, 10, 0, 0),
  end: new Date(2026, 6, 18, 11, 0, 0),
  allDay: false,
  entityId: 'calendar.personal',
  color: '#FF3B30',
  label: 'Personal',
};

describe('au-calendar-fullscreen-overlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-18T09:00:00'));
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('ensureCalendarFullscreenOverlay mounts a singleton on body', () => {
    const a = ensureCalendarFullscreenOverlay();
    const b = ensureCalendarFullscreenOverlay();
    expect(a).toBe(b);
    expect(document.body.contains(a)).toBe(true);
    expect(a).toBeInstanceOf(AuCalendarFullscreenOverlay);
  });

  it('open selects today and close unlocks scroll', async () => {
    const el = ensureCalendarFullscreenOverlay();
    el.open({
      title: 'Calendar',
      events: [sampleEvent],
      entities: [{ entity: 'calendar.personal', color: '#FF3B30', label: 'Personal' }],
      config: {
        type: 'custom:au-calendar-card',
        entities: ['calendar.personal'],
      },
      language: 'en',
      now: Date.now(),
    });
    await el.updateComplete;
    expect(el.isOpen).toBe(true);
    expect(el.hasAttribute('open')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    expect(el.shadowRoot?.textContent).toMatch(/Team sync|July|2026|Today|Fullscreen|Calendar/i);

    el.close();
    await el.updateComplete;
    expect(el.isOpen).toBe(false);
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('keeps ended events visible in fullscreen (unlike compact agenda)', async () => {
    vi.setSystemTime(new Date('2026-07-18T15:00:00'));
    const ended: AuCalendarEvent = {
      ...sampleEvent,
      uid: 'ended',
      summary: 'Morning standup',
      start: new Date(2026, 6, 18, 9, 0, 0),
      end: new Date(2026, 6, 18, 10, 0, 0),
    };
    const el = ensureCalendarFullscreenOverlay();
    el.open({
      title: 'Calendar',
      events: [ended],
      entities: [{ entity: 'calendar.personal', color: '#FF3B30' }],
      config: { type: 'custom:au-calendar-card', entities: ['calendar.personal'] },
      language: 'en',
      now: Date.now(),
    });
    await el.updateComplete;
    expect(el.shadowRoot?.textContent).toMatch(/Morning standup/);
  });
});
