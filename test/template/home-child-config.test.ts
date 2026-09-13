import { describe, it, expect } from 'vitest';
import {
  buildRoomTileCardConfig,
  homeAwareCardConfig,
} from '../../src/template/shell-grid/home-child-config';

describe('homeAwareCardConfig', () => {
  it('remaps switch action cards then injects home variant', () => {
    expect(
      homeAwareCardConfig({
        type: 'custom:au-action-card',
        entity: 'switch.office_lamp',
        content_layout: 'horizontal',
      }),
    ).toEqual({
      type: 'custom:au-switch-card',
      entity: 'switch.office_lamp',
      content_layout: 'horizontal',
      variant: 'home',
    });
  });

  it('remaps even when variant is already set', () => {
    expect(
      homeAwareCardConfig({
        type: 'custom:au-action-card',
        entity: 'switch.bathroom_lamp',
        variant: 'home',
        content_layout: 'vertical',
      }),
    ).toEqual({
      type: 'custom:au-switch-card',
      entity: 'switch.bathroom_lamp',
      variant: 'home',
      content_layout: 'vertical',
    });
  });

  it('remaps cover device cards to cover card', () => {
    expect(
      homeAwareCardConfig({
        type: 'custom:au-device-card',
        entity: 'cover.blinds',
      }),
    ).toEqual({
      type: 'custom:au-cover-card',
      entity: 'cover.blinds',
      variant: 'home',
      content_layout: 'vertical',
    });
  });

  it('leaves calendar cards untouched', () => {
    const card = {
      type: 'custom:au-calendar-card',
      view: 'agenda',
    };
    expect(homeAwareCardConfig(card)).toEqual({
      ...card,
      variant: 'home',
      content_layout: 'vertical',
    });
  });

  it('leaves third-party cards untouched', () => {
    const card = { type: 'tile', entity: 'switch.x' };
    expect(homeAwareCardConfig(card)).toBe(card);
  });

  it('honors card_type_locked', () => {
    expect(
      homeAwareCardConfig({
        type: 'custom:au-action-card',
        entity: 'switch.x',
        card_type_locked: true,
      }),
    ).toEqual({
      type: 'custom:au-action-card',
      entity: 'switch.x',
      card_type_locked: true,
      variant: 'home',
      content_layout: 'vertical',
    });
  });
});

const roomTileInput = {
  headerInteractive: true,
  toggles: [],
  activeCount: 0,
  chipEntities: [],
  chipIcon: () => 'mdi:lightbulb',
  chipLabel: (ent: { entity: string }) => ent.entity,
};

describe('buildRoomTileCardConfig', () => {
  it('forwards temperature_entity onto the room card', () => {
    const config = buildRoomTileCardConfig({
      ...roomTileInput,
      room: {
        name: 'Master Bedroom',
        temperature_entity: 'sensor.sonoff_temperature_sensor_temperature',
      },
    });
    expect(config.temperature_entity).toBe(
      'sensor.sonoff_temperature_sensor_temperature',
    );
  });

  it('omits temperature_entity when the room has none', () => {
    const config = buildRoomTileCardConfig({
      ...roomTileInput,
      room: { name: 'Living' },
    });
    expect(config.temperature_entity).toBeUndefined();
  });
});
