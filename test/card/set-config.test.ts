import { describe, it, expect } from 'vitest';
import '../../src/index';
import type { LovelaceCard } from '../../src/types/home-assistant';

/**
 * Spec 3.2: setConfig must enforce structural validation and throw an explicit
 * error string when required tokens are omitted, so the native red error card
 * halts rendering.
 */

function make(tag: string): LovelaceCard & { _config?: unknown } {
  return document.createElement(tag) as LovelaceCard & { _config?: unknown };
}

describe('au-action-card setConfig', () => {
  it('throws when entity is missing', () => {
    const el = make('au-action-card');
    expect(() => el.setConfig({ type: 'custom:au-action-card' })).toThrow(/entity/i);
  });

  it('throws when entity id is malformed', () => {
    const el = make('au-action-card');
    expect(() =>
      el.setConfig({ type: 'custom:au-action-card', entity: 'not-an-id' }),
    ).toThrow(/valid entity id/i);
  });

  it('accepts a valid config and stores it', () => {
    const el = make('au-action-card');
    expect(() =>
      el.setConfig({ type: 'custom:au-action-card', entity: 'light.kitchen' }),
    ).not.toThrow();
    expect((el._config as { entity: string }).entity).toBe('light.kitchen');
  });
});

describe('au-shell-grid setConfig', () => {
  it('allows omitted cards (defaults to classic empty grid)', () => {
    const el = make('au-shell-grid');
    expect(() => el.setConfig({ type: 'custom:au-shell-grid' })).not.toThrow();
  });

  it('throws when cards is not a list', () => {
    const el = make('au-shell-grid');
    expect(() =>
      el.setConfig({ type: 'custom:au-shell-grid', cards: 'x' } as never),
    ).toThrow(/cards/i);
  });

  it('throws when columns is less than 1', () => {
    const el = make('au-shell-grid');
    expect(() =>
      el.setConfig({ type: 'custom:au-shell-grid', cards: [], columns: 0 }),
    ).toThrow(/columns/i);
  });

  it('throws when rows is less than 1', () => {
    const el = make('au-shell-grid');
    expect(() =>
      el.setConfig({ type: 'custom:au-shell-grid', cards: [], rows: 0 }),
    ).toThrow(/rows/i);
  });

  it('throws when a card layout is not numeric', () => {
    const el = make('au-shell-grid');
    expect(() =>
      el.setConfig({
        type: 'custom:au-shell-grid',
        cards: [
          {
            type: 'custom:au-action-card',
            entity: 'light.kitchen',
            layout: { x: 0, y: 0, w: 'wide' as unknown as number, h: 1 },
          },
        ],
      }),
    ).toThrow(/layout/i);
  });

  it('accepts a valid coordinate-based config', () => {
    const el = make('au-shell-grid');
    expect(() =>
      el.setConfig({
        type: 'custom:au-shell-grid',
        columns: 12,
        row_height: '80px',
        cards: [
          {
            type: 'custom:au-action-card',
            entity: 'light.kitchen',
            id: 'tile-1',
            layout: { x: 0, y: 0, w: 4, h: 2 },
          },
        ],
      }),
    ).not.toThrow();
  });
});

describe('au-sensor-card setConfig', () => {
  it('throws when entity is missing', () => {
    const el = make('au-sensor-card');
    expect(() => el.setConfig({ type: 'custom:au-sensor-card' })).toThrow(/entity/i);
  });

  it('throws when min is not less than max', () => {
    const el = make('au-sensor-card');
    expect(() =>
      el.setConfig({
        type: 'custom:au-sensor-card',
        entity: 'sensor.temp',
        min: 10,
        max: 5,
      }),
    ).toThrow(/min/i);
  });

  it('accepts a valid config', () => {
    const el = make('au-sensor-card');
    expect(() =>
      el.setConfig({
        type: 'custom:au-sensor-card',
        entity: 'sensor.temp',
        min: 0,
        max: 40,
      }),
    ).not.toThrow();
  });
});
