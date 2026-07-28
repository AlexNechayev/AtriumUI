import { describe, it, expect } from 'vitest';
import '../../src/index';
import { AuCalendarCardEditor } from '../../src/card/calendar-card/au-calendar-card-editor';
import { makeEntity, makeHass } from '../helpers';

describe('au-calendar-card-editor', () => {
  it('feeds ha-form entity ids as strings (not objects)', async () => {
    const el = document.createElement(
      'au-calendar-card-editor',
    ) as AuCalendarCardEditor;
    document.body.appendChild(el);
    el.hass = makeHass({
      'calendar.klly': makeEntity('calendar.klly', 'off', {
        friendly_name: 'Klly',
      }),
    });
    el.setConfig({
      type: 'custom:au-calendar-card',
      entities: [
        { entity: 'calendar.klly', color: '#FF3B30', label: 'Klly' },
      ],
    });
    await el.updateComplete;

    const form = el.shadowRoot?.querySelector('ha-form') as
      | (HTMLElement & { data?: { entities?: unknown } })
      | null;
    expect(form).not.toBeNull();
    expect(form?.data?.entities).toEqual(['calendar.klly']);
    el.remove();
  });

  it('persists object entities with preserved color on form change', async () => {
    const el = document.createElement(
      'au-calendar-card-editor',
    ) as AuCalendarCardEditor;
    document.body.appendChild(el);
    el.hass = makeHass({
      'calendar.klly': makeEntity('calendar.klly', 'off'),
      'calendar.family': makeEntity('calendar.family', 'off'),
    });
    el.setConfig({
      type: 'custom:au-calendar-card',
      entities: [{ entity: 'calendar.klly', color: '#FF3B30', label: 'Klly' }],
    });
    await el.updateComplete;

    let emitted: unknown;
    el.addEventListener('config-changed', ((ev: CustomEvent) => {
      emitted = ev.detail.config;
    }) as EventListener);

    el.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: {
          value: {
            type: 'custom:au-calendar-card',
            entities: ['calendar.klly', 'calendar.family'],
          },
        },
      }),
    );
    // Form change is bound on ha-form; call handler via the form element.
    const form = el.shadowRoot?.querySelector('ha-form');
    form?.dispatchEvent(
      new CustomEvent('value-changed', {
        bubbles: true,
        composed: true,
        detail: {
          value: {
            type: 'custom:au-calendar-card',
            entities: ['calendar.klly', 'calendar.family'],
          },
        },
      }),
    );
    await el.updateComplete;

    const config = emitted as {
      entities: Array<{ entity: string; color?: string; label?: string }>;
    };
    expect(config.entities).toEqual([
      { entity: 'calendar.klly', color: '#FF3B30', label: 'Klly' },
      expect.objectContaining({ entity: 'calendar.family' }),
    ]);
    el.remove();
  });
});
