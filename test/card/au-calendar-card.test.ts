import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../../src/index';
import { AuCalendarCard } from '../../src/card/calendar-card/au-calendar-card';
import { makeEntity, makeHass } from '../helpers';

function makeCalendarHass(
  callService = vi.fn().mockResolvedValue({
    response: {
      'calendar.personal': {
        events: [
          {
            summary: 'Team sync',
            start: '2026-07-18T10:00:00',
            end: '2026-07-18T11:00:00',
            location: 'Office',
          },
        ],
      },
    },
  }),
) {
  return makeHass(
    {
      'calendar.personal': makeEntity('calendar.personal', 'off', {
        friendly_name: 'Personal',
      }),
    },
    callService,
  );
}

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('au-calendar-card', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-18T09:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('requires calendar entities', () => {
    const el = document.createElement('au-calendar-card') as AuCalendarCard;
    expect(() =>
      el.setConfig({ type: 'custom:au-calendar-card', entities: [] }),
    ).toThrow(/calendar/i);
    expect(() =>
      el.setConfig({
        type: 'custom:au-calendar-card',
        entities: ['light.kitchen'],
      }),
    ).toThrow(/calendar\.\*/);
  });

  it('renders agenda events from get_events', async () => {
    const callService = vi.fn().mockResolvedValue({
      response: {
        'calendar.personal': {
          events: [
            {
              summary: 'Team sync',
              start: '2026-07-18T10:00:00',
              end: '2026-07-18T11:00:00',
            },
          ],
        },
      },
    });
    const el = document.createElement('au-calendar-card') as AuCalendarCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-calendar-card',
      entities: [{ entity: 'calendar.personal', label: 'Personal' }],
      view: 'agenda',
      expand_on_tap: true,
    });
    el.hass = makeCalendarHass(callService);
    await el.updateComplete;
    await flush();
    await el.updateComplete;

    expect(callService).toHaveBeenCalled();
    expect(el.shadowRoot?.textContent).toMatch(/Team sync/);
    expect(el.getCardSize()).toBeGreaterThanOrEqual(2);
  });

  it('shows No events when response is empty', async () => {
    const callService = vi.fn().mockResolvedValue({
      response: { 'calendar.personal': { events: [] } },
    });
    const el = document.createElement('au-calendar-card') as AuCalendarCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-calendar-card',
      entities: ['calendar.personal'],
    });
    el.hass = makeCalendarHass(callService);
    await el.updateComplete;
    await flush();
    await el.updateComplete;
    expect(el.shadowRoot?.textContent).toMatch(/No events/);
  });

  it('exposes stub config and editor element', () => {
    const stub = AuCalendarCard.getStubConfig();
    expect(stub.type).toBe('custom:au-calendar-card');
    const editor = AuCalendarCard.getConfigElement();
    expect(editor.localName).toBe('au-calendar-card-editor');
  });

  it('shows Fullscreen control and opens overlay on today', async () => {
    const el = document.createElement('au-calendar-card') as AuCalendarCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-calendar-card',
      entities: ['calendar.personal'],
      expand_on_tap: true,
    });
    el.hass = makeCalendarHass();
    await el.updateComplete;
    await flush();
    await el.updateComplete;

    const btn = [...(el.shadowRoot?.querySelectorAll('button') ?? [])].find(
      (b) => b.textContent?.includes('Fullscreen'),
    );
    expect(btn).toBeTruthy();
    btn!.click();
    await el.updateComplete;
    await flush();

    const overlay = document.querySelector('au-calendar-fullscreen-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.hasAttribute('open')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('hides Fullscreen when expand_on_tap is false', async () => {
    const el = document.createElement('au-calendar-card') as AuCalendarCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-calendar-card',
      entities: ['calendar.personal'],
      expand_on_tap: false,
    });
    el.hass = makeCalendarHass();
    await el.updateComplete;
    await flush();
    expect(el.shadowRoot?.textContent).not.toMatch(/Fullscreen/);
  });
});
