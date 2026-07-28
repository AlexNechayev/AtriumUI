import { describe, it, expect } from 'vitest';
import {
  controlsFromEditDraft,
  roomEntitiesFromEditDraft,
  type EditRoomDraft,
} from '../../src/template/shell-grid/home-edit-room-modal';
import { buildRoomGridItems } from '../../src/template/shell-grid/home-grid-items';

const baseDraft = (over: Partial<EditRoomDraft> = {}): EditRoomDraft => ({
  roomId: 'kitchen',
  name: 'Kitchen',
  icon: '',
  showStrip: true,
  members: [
    'light.kitchen_led',
    'switch.service_room_lamp',
    'switch.service_room_fan',
  ],
  selected: ['light.kitchen_led'],
  icons: {},
  ...over,
});

describe('roomEntitiesFromEditDraft', () => {
  it('does not copy card-only toggle members into entities', () => {
    const entities = roomEntitiesFromEditDraft({
      members: [
        'light.kitchen_led',
        'switch.service_room_lamp',
        'switch.service_room_fan',
      ],
      existing: [{ entity: 'light.kitchen_led', layout: { x: 0, y: 0, w: 8, h: 10 } }],
      cards: [
        {
          id: 'au-card-1',
          card: {
            type: 'custom:au-switch-card',
            entity: 'switch.service_room_lamp',
          },
        },
        {
          id: 'au-card-2',
          card: {
            type: 'custom:au-switch-card',
            entity: 'switch.service_room_fan',
          },
        },
      ],
    });
    expect(entities.map((e) => e.entity)).toEqual(['light.kitchen_led']);
    expect(entities[0]?.layout).toEqual({ x: 0, y: 0, w: 8, h: 10 });
  });

  it('preserves entity-only toggles and non-toggle entities', () => {
    const entities = roomEntitiesFromEditDraft({
      members: ['light.a', 'switch.b'],
      existing: [
        {
          entity: 'light.a',
          name: 'Lamp',
          card_config: { variant: 'home' },
          layout: { x: 1, y: 2, w: 3, h: 4 },
        },
        { entity: 'climate.room' },
      ],
      cards: [],
    });
    expect(entities).toEqual([
      { entity: 'climate.room' },
      {
        entity: 'light.a',
        name: 'Lamp',
        card_config: { variant: 'home' },
        layout: { x: 1, y: 2, w: 3, h: 4 },
        hide: false,
      },
      { entity: 'switch.b' },
    ]);
  });

  it('heals duplicate entity rows that already match a room card', () => {
    const entities = roomEntitiesFromEditDraft({
      members: ['switch.service_room_lamp', 'light.kitchen_led'],
      existing: [
        { entity: 'light.kitchen_led' },
        { entity: 'switch.service_room_lamp' },
      ],
      cards: [
        {
          id: 'c1',
          card: {
            type: 'custom:au-switch-card',
            entity: 'switch.service_room_lamp',
          },
        },
      ],
    });
    expect(entities.map((e) => e.entity)).toEqual(['light.kitchen_led']);
  });
});

describe('controlsFromEditDraft with card-only members', () => {
  it('still excludes unchecked strip members', () => {
    const controls = controlsFromEditDraft(
      baseDraft(),
      baseDraft().members,
    );
    expect(controls?.exclude).toEqual([
      'switch.service_room_lamp',
      'switch.service_room_fan',
    ]);
    expect(controls?.order).toEqual(baseDraft().members);
  });
});

describe('buildRoomGridItems entity/card dedupe', () => {
  it('skips entity tiles when a room card targets the same entity', () => {
    const items = buildRoomGridItems(
      {
        name: 'Kitchen',
        entities: [
          { entity: 'light.kitchen_led', layout: { x: 0, y: 0, w: 4, h: 4 } },
          {
            entity: 'switch.service_room_lamp',
            layout: { x: 4, y: 0, w: 2, h: 2 },
          },
        ],
        cards: [
          {
            id: 'au-card-1',
            card: {
              type: 'custom:au-switch-card',
              entity: 'switch.service_room_lamp',
            },
            layout: { x: 6, y: 0, w: 3, h: 3 },
          },
        ],
      },
      [
        { entity: 'light.kitchen_led', layout: { x: 0, y: 0, w: 4, h: 4 } },
        {
          entity: 'switch.service_room_lamp',
          layout: { x: 4, y: 0, w: 2, h: 2 },
        },
      ],
      {
        baseColumns: 24,
        defaultWidth: 3,
        displayColumns: 24,
        useBaseColumns: true,
      },
    );
    const entityIds = items
      .filter((i) => i.kind === 'entity')
      .map((i) => (i.kind === 'entity' ? i.entity.entity : ''));
    const cardEntities = items
      .filter((i) => i.kind === 'card')
      .map((i) =>
        i.kind === 'card' ? String(i.card.card.entity ?? '') : '',
      );
    expect(entityIds).toEqual(['light.kitchen_led']);
    expect(cardEntities).toEqual(['switch.service_room_lamp']);
  });
});
