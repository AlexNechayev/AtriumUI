import { describe, it, expect } from 'vitest';
import {
  applyGridToLovelaceConfig,
  buildPersistedGridConfig,
  buildPersistedHomeConfig,
} from '../../src/template/shell-grid/config-persist';
import type { AuShellGridConfig } from '../../src/types/config';

const baseGrid: AuShellGridConfig = {
  type: 'custom:au-shell-grid',
  columns: 12,
  cards: [
    {
      type: 'custom:au-action-card',
      id: 'tile-1',
      entity: 'light.a',
      layout: { x: 0, y: 0, w: 4, h: 2 },
    },
  ],
};

describe('buildPersistedGridConfig', () => {
  it('writes layout coordinates and content overrides into cards', () => {
    const result = buildPersistedGridConfig(
      baseGrid,
      [
        {
          id: 'tile-1',
          x: 2,
          y: 1,
          w: 6,
          h: 3,
          config: baseGrid.cards![0]!,
        },
      ],
      new Map([
        [
          'tile-1',
          {
            type: 'custom:au-action-card',
            id: 'tile-1',
            entity: 'light.b',
          },
        ],
      ]),
    );

    expect(result.cards![0]).toMatchObject({
      id: 'tile-1',
      entity: 'light.b',
      layout: { x: 2, y: 1, w: 6, h: 3 },
    });
    expect(result).not.toHaveProperty('storage_key');
  });
});

describe('buildPersistedHomeConfig', () => {
  it('writes floors with entity layouts and preserves home options', () => {
    const floors = [
      {
        name: 'Main',
        rooms: [
          {
            id: 'living',
            name: 'Living',
            entities: [
              {
                entity: 'light.a',
                layout: { x: 0, y: 0, w: 4, h: 2 },
              },
            ],
          },
        ],
      },
    ];
    const result = buildPersistedHomeConfig(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        presence: ['person.alex'],
        floors: [],
        cards: [{ type: 'custom:au-action-card', entity: 'light.legacy' }],
      },
      floors,
    );
    expect(result.floors).toEqual(floors);
    expect(result.presence).toEqual(['person.alex']);
    expect(result.cards).toHaveLength(1);
    expect(result).not.toHaveProperty('storage_key');
  });
});

describe('applyGridToLovelaceConfig', () => {
  it('updates a custom view (grid is the whole view)', () => {
    const dashboard = {
      views: [{ type: 'custom:au-shell-grid', columns: 8, cards: [] }],
    };
    const updated = applyGridToLovelaceConfig(dashboard, [0], {
      ...baseGrid,
      columns: 10,
    });
    expect((updated.views as AuShellGridConfig[])[0]?.columns).toBe(10);
  });

  it('updates a grid nested inside a panel view card list', () => {
    const dashboard = {
      views: [
        {
          type: 'panel',
          cards: [{ type: 'custom:au-shell-grid', columns: 8, cards: [] }],
        },
      ],
    };
    const updated = applyGridToLovelaceConfig(dashboard, [0, 0], baseGrid);
    const view = (updated.views as { cards: AuShellGridConfig[] }[])[0]!;
    expect(view.cards[0]?.columns).toBe(12);
  });
});
