import { describe, it, expect } from 'vitest';
import {
  isRemappableAuCardType,
  normalizeAuHomeCardConfig,
  recommendedAuCardType,
  withCustomCardPrefix,
} from '../../src/utils/home-card-type';

describe('home-card-type', () => {
  it('classifies remappable atrium entity cards', () => {
    expect(isRemappableAuCardType('custom:au-action-card')).toBe(true);
    expect(isRemappableAuCardType('au-device-card')).toBe(true);
    expect(isRemappableAuCardType('au-cover-card')).toBe(true);
    expect(isRemappableAuCardType('au-switch-card')).toBe(true);
    expect(isRemappableAuCardType('au-vacuum-card')).toBe(true);
    expect(isRemappableAuCardType('custom:au-calendar-card')).toBe(false);
    expect(isRemappableAuCardType('tile')).toBe(false);
    expect(isRemappableAuCardType('custom:mushroom-light-card')).toBe(false);
  });

  it('recommends the same types as home entities', () => {
    expect(recommendedAuCardType('light.a')).toBe('au-light-card');
    expect(recommendedAuCardType('switch.a')).toBe('au-switch-card');
    expect(recommendedAuCardType('cover.a')).toBe('au-cover-card');
    expect(recommendedAuCardType('vacuum.a')).toBe('au-vacuum-card');
    expect(recommendedAuCardType('button.a')).toBe('au-action-card');
    expect(recommendedAuCardType('climate.a')).toBe('au-climate-card');
  });

  it('remaps switch on action card to switch card', () => {
    const result = normalizeAuHomeCardConfig({
      type: 'custom:au-action-card',
      entity: 'switch.office_lamp',
      name: 'Lamp',
      content_layout: 'horizontal',
    });
    expect(result.changed).toBe(true);
    expect(result.to).toBe('custom:au-switch-card');
    expect(result.card).toEqual({
      type: 'custom:au-switch-card',
      entity: 'switch.office_lamp',
      name: 'Lamp',
      content_layout: 'horizontal',
    });
  });

  it('remaps cover on device card to cover card', () => {
    const result = normalizeAuHomeCardConfig({
      type: 'custom:au-device-card',
      entity: 'cover.blinds',
      show_position: true,
    });
    expect(result.changed).toBe(true);
    expect(result.card.type).toBe('custom:au-cover-card');
    expect(result.card.show_position).toBe(true);
  });

  it('remaps vacuum on device card to vacuum card', () => {
    const result = normalizeAuHomeCardConfig({
      type: 'custom:au-device-card',
      entity: 'vacuum.bot',
      show_vacuum_controls: true,
    });
    expect(result.changed).toBe(true);
    expect(result.card.type).toBe('custom:au-vacuum-card');
    expect(result.card.show_vacuum_controls).toBe(true);
  });

  it('remaps fan on device card to fan card', () => {
    const result = normalizeAuHomeCardConfig({
      type: 'custom:au-device-card',
      entity: 'fan.bedroom',
      show_percentage: true,
    });
    expect(result.changed).toBe(true);
    expect(result.card.type).toBe('custom:au-fan-card');
    expect(result.card.show_percentage).toBe(true);
  });

  it('leaves matching switch card unchanged', () => {
    const card = {
      type: 'custom:au-switch-card',
      entity: 'switch.office_lamp',
    };
    const result = normalizeAuHomeCardConfig(card);
    expect(result.changed).toBe(false);
    expect(result.card).toBe(card);
  });

  it('leaves button on action card unchanged', () => {
    const card = {
      type: 'custom:au-action-card',
      entity: 'button.boil_water',
    };
    expect(normalizeAuHomeCardConfig(card).changed).toBe(false);
  });

  it('remaps light-shaped mismatch onto light card', () => {
    const result = normalizeAuHomeCardConfig({
      type: 'custom:au-action-card',
      entity: 'light.bedroom',
    });
    expect(result.changed).toBe(true);
    expect(result.card.type).toBe('custom:au-light-card');
  });

  it('remaps switch on light card to switch card', () => {
    const result = normalizeAuHomeCardConfig({
      type: 'custom:au-light-card',
      entity: 'switch.spots',
      show_brightness: true,
    });
    expect(result.changed).toBe(true);
    expect(result.card.type).toBe('custom:au-switch-card');
    expect(result.card.show_brightness).toBe(true);
  });

  it('skips calendar and third-party cards', () => {
    expect(
      normalizeAuHomeCardConfig({
        type: 'custom:au-calendar-card',
        entity: 'switch.x',
      }).changed,
    ).toBe(false);
    expect(
      normalizeAuHomeCardConfig({
        type: 'tile',
        entity: 'switch.x',
      }).changed,
    ).toBe(false);
  });

  it('honors card_type_locked', () => {
    const result = normalizeAuHomeCardConfig({
      type: 'custom:au-action-card',
      entity: 'switch.office_lamp',
      card_type_locked: true,
    });
    expect(result.changed).toBe(false);
    expect(result.card.type).toBe('custom:au-action-card');
  });

  it('skips missing or invalid entity', () => {
    expect(
      normalizeAuHomeCardConfig({ type: 'custom:au-action-card' }).changed,
    ).toBe(false);
    expect(
      normalizeAuHomeCardConfig({
        type: 'custom:au-action-card',
        entity: '',
      }).changed,
    ).toBe(false);
  });

  it('prefixes short recommended types', () => {
    expect(withCustomCardPrefix('au-device-card')).toBe(
      'custom:au-device-card',
    );
    expect(withCustomCardPrefix('custom:au-device-card')).toBe(
      'custom:au-device-card',
    );
  });
});
