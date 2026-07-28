import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuShellGrid } from '../../src/template/shell-grid/au-shell-grid';
import { isShellHomeMode } from '../../src/types/config';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

type HomeViewTestApi = HTMLElement & {
  updateComplete: Promise<unknown>;
  _openRoom: (id: string) => void;
};

async function openHomeRoom(
  home: unknown,
  roomId: string,
): Promise<void> {
  const view = home as HomeViewTestApi;
  view._openRoom(roomId);
  await view.updateComplete;
  await view.updateComplete;
}

function roomTileHost(
  home: Element | null | undefined,
  roomId: string,
): HTMLElement | null {
  return (
    home?.shadowRoot?.querySelector(
      `[data-room-tile="${roomId}"]`,
    ) as HTMLElement | null
  );
}

function roomTileCard(host: HTMLElement | null | undefined): HTMLElement | null {
  return (host?.firstElementChild as HTMLElement | null) ?? null;
}

function roomTileChips(host: HTMLElement | null | undefined): HTMLElement[] {
  const card = roomTileCard(host);
  return [...(card?.shadowRoot?.querySelectorAll('.chip') ?? [])] as HTMLElement[];
}

async function waitForRoomTileCard(
  home: Element | null | undefined,
  roomId: string,
): Promise<HTMLElement> {
  const host = roomTileHost(home, roomId);
  expect(host).not.toBeNull();
  for (let i = 0; i < 30; i++) {
    const card = roomTileCard(host);
    if (card) {
      await (card as HTMLElement & { updateComplete?: Promise<unknown> })
        .updateComplete;
      return card;
    }
    await new Promise((r) => setTimeout(r, 0));
  }
  throw new Error(`au-room-card not mounted for room ${roomId}`);
}

async function renderShell(
  config: Parameters<AuShellGrid['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>> = {},
  callService = vi.fn().mockResolvedValue(undefined),
): Promise<{
  el: AuShellGrid;
  callService: typeof callService;
  hass: ReturnType<typeof makeHass>;
}> {
  const el = document.createElement('au-shell-grid') as AuShellGrid;
  document.body.appendChild(el);
  el.setConfig(config);
  const hass = makeHass(states, callService);
  el.hass = hass;
  await el.updateComplete;
  return { el, callService, hass };
}

describe('au-shell-grid home', () => {
  it('uses Home by default; legacy cards only without floors', () => {
    expect(isShellHomeMode({ type: 'custom:au-shell-grid', cards: [] })).toBe(true);
    expect(
      isShellHomeMode({
        type: 'custom:au-shell-grid',
        floors: [{ name: 'Main', rooms: [] }],
      }),
    ).toBe(true);
    expect(
      isShellHomeMode({
        type: 'custom:au-shell-grid',
        cards: [{ type: 'custom:au-action-card', entity: 'light.a' }],
      }),
    ).toBe(false);
  });

  it('validates floors shape', () => {
    const el = document.createElement('au-shell-grid') as AuShellGrid;
    expect(() =>
      el.setConfig({ type: 'custom:au-shell-grid', floors: 'x' } as never),
    ).toThrow(/floors/i);
  });

  it('allows missing cards when floors are set', () => {
    const el = document.createElement('au-shell-grid') as AuShellGrid;
    expect(() =>
      el.setConfig({
        type: 'custom:au-shell-grid',
        floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
      }),
    ).not.toThrow();
  });

  it('renders a centered toolbar clock on Home and Room', async () => {
    const { el } = await renderShell({
      type: 'custom:au-shell-grid',
      clock_format: '24h',
      floors: [
        {
          name: 'Main',
          rooms: [
            {
              id: 'hall',
              name: 'Hall',
              entities: [{ entity: 'switch.lamp' }],
            },
          ],
        },
      ],
    }, { 'switch.lamp': makeEntity('switch.lamp', 'on') });

    const home = el.shadowRoot?.querySelector('au-shell-home-view');
    expect(home).not.toBeNull();
    await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

    const homeClock = home?.shadowRoot?.querySelector('time.clock');
    expect(homeClock).not.toBeNull();
    expect(homeClock?.textContent?.trim()).toMatch(
      /^(\d{2}:\d{2}|\d{2}\/\d{2}\s+\w+\s+·\s+\d{2}:\d{2})$/,
    );
    expect(home?.shadowRoot?.querySelector('.toolbar-start .title')).not.toBeNull();
    expect(home?.shadowRoot?.querySelector('.toolbar-end')).not.toBeNull();

    await openHomeRoom(home, 'hall');
    const roomClock = home?.shadowRoot?.querySelector('time.clock');
    expect(roomClock).not.toBeNull();
    expect(roomClock?.textContent?.trim()).toMatch(
      /^(\d{2}:\d{2}|\d{2}\/\d{2}\s+\w+\s+·\s+\d{2}:\d{2})$/,
    );
    expect(home?.shadowRoot?.querySelector('.toolbar-start .back')).not.toBeNull();
    expect(home?.shadowRoot?.querySelector('.toolbar-start .title')?.textContent?.trim()).toBe(
      'Hall',
    );

    el.remove();
  });

  it(
    'renders home rooms and navigates into a room',
    async () => {
      const { el } = await renderShell(
        {
          type: 'custom:au-shell-grid',
          floors: [
            {
              name: 'Main',
              rooms: [
                {
                  id: 'living',
                  name: 'Living room',
                  entities: [{ entity: 'switch.lamp' }],
                },
              ],
            },
          ],
        },
        { 'switch.lamp': makeEntity('switch.lamp', 'on') },
      );

      const home = el.shadowRoot?.querySelector('au-shell-home-view');
      expect(home).not.toBeNull();
      await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

      const host = roomTileHost(home, 'living');
      const card = await waitForRoomTileCard(home, 'living');
      expect(card.localName).toBe('au-room-card');
      expect(card.shadowRoot?.querySelector('.title')?.textContent?.trim()).toBe(
        'Living room',
      );

      const header = card.shadowRoot?.querySelector(
        '.header-action.interactive',
      ) as HTMLButtonElement;
      expect(header).not.toBeNull();
      header.click();
      await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
      await (home as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

      expect(home?.shadowRoot?.textContent).toMatch(/all off|back/i);
      expect(home?.shadowRoot?.querySelector('au-switch-card')).not.toBeNull();
      expect(host).not.toBeNull();
      el.remove();
    },
    15_000,
  );

  it('renders presence strip on Home', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        presence: ['person.alex'],
        floors: [{ name: 'Main', rooms: [{ name: 'Hall', entities: [] }] }],
      },
      { 'person.alex': makeEntity('person.alex', 'home', { friendly_name: 'Alex' }) },
    );
    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await home.updateComplete;
    expect(home.shadowRoot?.querySelector('.person.home')).not.toBeNull();
    expect(home.shadowRoot?.textContent).toContain('Alex');
    el.remove();
  });

  it('exposes Home stub and async GUI editor', async () => {
    const stub = AuShellGrid.getStubConfig();
    expect(stub.type).toBe('custom:au-shell-grid');
    expect(stub.cards).toEqual([]);
    expect(stub.floors?.length).toBeGreaterThan(0);
    expect(isShellHomeMode(stub)).toBe(true);
    const editor = await AuShellGrid.getConfigElement();
    expect(editor.tagName.toLowerCase()).toBe('au-shell-grid-editor');
  });

  it('places room entities on the shared grid', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                entities: [
                  { entity: 'switch.a', layout: { x: 0, y: 0, w: 4, h: 2 } },
                  { entity: 'switch.b', layout: { x: 4, y: 0, w: 4, h: 2 } },
                ],
              },
            ],
          },
        ],
      },
      {
        'switch.a': makeEntity('switch.a', 'on'),
        'switch.b': makeEntity('switch.b', 'off'),
      },
    );
    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await home.updateComplete;
    await openHomeRoom(home, 'living');
    await home.updateComplete;

    const hosts = [
      ...(home.shadowRoot?.querySelectorAll('.entity-host') ?? []),
    ] as HTMLElement[];
    expect(hosts.length).toBe(2);
    expect(hosts[0]?.style.gridColumn).toMatch(/1\s*\/\s*span\s*4/);
    expect(hosts[1]?.style.gridColumn).toMatch(/5\s*\/\s*span\s*4/);
    const grid = home.shadowRoot?.querySelector('.entities') as HTMLElement;
    expect(grid?.style.getPropertyValue('--home-grid-columns')).toBeTruthy();
    el.remove();
  });

  it('shows room grid edit chrome without committing on enter', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                entities: [
                  { entity: 'switch.a', layout: { x: 0, y: 0, w: 4, h: 2 } },
                  { entity: 'switch.b', layout: { x: 4, y: 0, w: 4, h: 2 } },
                ],
              },
            ],
          },
        ],
      },
      {
        'switch.a': makeEntity('switch.a', 'on'),
        'switch.b': makeEntity('switch.b', 'off'),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;
    await openHomeRoom(home, 'living');

    let committedOnEnter = false;
    home.addEventListener('home-config-changed', () => {
      committedOnEnter = true;
    });

    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    expect(home.shadowRoot?.querySelector('.entities.editing')).not.toBeNull();
    expect(home.shadowRoot?.querySelector('.drag-handle')).not.toBeNull();
    expect(home.shadowRoot?.querySelector('.resize-handle')).not.toBeNull();
    expect(home.shadowRoot?.querySelector('.add-fab')).not.toBeNull();
    expect(committedOnEnter).toBe(false);

    (home.shadowRoot?.querySelector('.add-fab') as HTMLButtonElement).click();
    await home.updateComplete;
    expect(home.shadowRoot?.querySelector('[aria-label="Add card"]')).not.toBeNull();

    el.remove();
  });

  it('distributes row height from rows on Home overview and room grids', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        rows: 4,
        height: '800px',
        gap: '12px',
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [
                  { entity: 'switch.a', layout: { x: 0, y: 0, w: 4, h: 2 } },
                ],
              },
            ],
          },
        ],
      },
      { 'switch.a': makeEntity('switch.a', 'on') },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as unknown as {
      updateComplete: Promise<unknown>;
      _shellHeightPx: number;
      _openRoom: (id: string) => void;
      shadowRoot: ShadowRoot | null;
    };
    home._shellHeightPx = 800;
    await home.updateComplete;

    const roomsGrid = home.shadowRoot?.querySelector('.rooms') as HTMLElement;
    expect(roomsGrid?.classList.contains('distribute-rows')).toBe(true);
    expect(roomsGrid?.style.getPropertyValue('--home-grid-rows')).toBe('4');
    const homeRowH = parseFloat(
      roomsGrid?.style.getPropertyValue('--home-grid-row-height') || '0',
    );
    expect(homeRowH).toBeGreaterThan(50);

    await openHomeRoom(home, 'living');
    await home.updateComplete;

    const entitiesGrid = home.shadowRoot?.querySelector('.entities') as HTMLElement;
    expect(entitiesGrid?.classList.contains('distribute-rows')).toBe(true);
    expect(entitiesGrid?.style.getPropertyValue('--home-grid-rows')).toBe('4');
    el.remove();
  });

  it('places and edits Home overview room tiles on the shared grid', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [],
              },
              {
                id: 'kitchen',
                name: 'Kitchen',
                layout: { x: 4, y: 0, w: 4, h: 2 },
                entities: [],
              },
            ],
          },
        ],
      },
      {},
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;

    const hosts = [
      ...(home.shadowRoot?.querySelectorAll('.room-host') ?? []),
    ] as HTMLElement[];
    expect(hosts.length).toBe(2);
    expect(hosts[0]?.style.gridColumn).toMatch(/1\s*\/\s*span\s*4/);
    expect(hosts[1]?.style.gridColumn).toMatch(/5\s*\/\s*span\s*4/);

    let committedOnEnter = false;
    home.addEventListener('home-config-changed', () => {
      committedOnEnter = true;
    });
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    expect(home.shadowRoot?.querySelector('.rooms.editing')).not.toBeNull();
    expect(home.shadowRoot?.querySelector('.add-fab')).not.toBeNull();
    expect(committedOnEnter).toBe(false);
    // Draft uses configured layouts without rewriting floors on enter.
    const hostsAfterEdit = [
      ...(home.shadowRoot?.querySelectorAll('.room-host') ?? []),
    ] as HTMLElement[];
    expect(hostsAfterEdit[0]?.style.gridColumn).toMatch(/1\s*\/\s*span\s*4/);
    expect(hostsAfterEdit[1]?.style.gridColumn).toMatch(/5\s*\/\s*span\s*4/);

    (home.shadowRoot?.querySelector('.add-fab') as HTMLButtonElement).click();
    await home.updateComplete;
    expect(home.shadowRoot?.querySelector('[aria-label="Add to floor"]')).not.toBeNull();
    el.remove();
  });

  it('removes a room entity from the edit session', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                entities: [{ entity: 'switch.a', layout: { x: 0, y: 0, w: 4, h: 2 } }],
              },
            ],
          },
        ],
      },
      { 'switch.a': makeEntity('switch.a', 'on') },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;
    await openHomeRoom(home, 'living');
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    const removeBtn = home.shadowRoot?.querySelector(
      '.remove-btn',
    ) as HTMLButtonElement;
    removeBtn.click();
    await home.updateComplete;
    const floorsPromise = new Promise<unknown>((resolve) => {
      home.addEventListener(
        'home-config-changed',
        (ev) => resolve((ev as CustomEvent).detail.floors),
        { once: true },
      );
    });
    removeBtn.click();
    const floors = (await floorsPromise) as Array<{
      rooms: Array<{ entities: unknown[] }>;
    }>;
    expect(floors[0]?.rooms[0]?.entities).toHaveLength(0);
    el.remove();
  });

  it('renders standalone floor entities on the Home overview grid', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            entities: [
              { entity: 'light.hallway', layout: { x: 4, y: 0, w: 2, h: 2 } },
            ],
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [],
              },
            ],
          },
        ],
      },
      { 'light.hallway': makeEntity('light.hallway', 'on') },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await home.updateComplete;
    await home.updateComplete;

    expect(home.shadowRoot?.querySelector('.room-host')).not.toBeNull();
    expect(
      home.shadowRoot?.querySelector('[data-entity-host="light.hallway"]'),
    ).not.toBeNull();
    expect(
      home.shadowRoot?.querySelector(
        'au-light-card, au-switch-card, au-cover-card, au-device-card, au-action-card',
      ),
    ).not.toBeNull();
    el.remove();
  });

  it('lists existing entities in a select when adding on the Home floor', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [{ id: 'living', name: 'Living room', entities: [] }],
          },
        ],
      },
      {
        'light.hallway': makeEntity('light.hallway', 'on', {
          friendly_name: 'Hallway',
        }),
        'switch.gate': makeEntity('switch.gate', 'off', {
          friendly_name: 'Gate',
        }),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    (home.shadowRoot?.querySelector('.add-fab') as HTMLButtonElement).click();
    await home.updateComplete;
    const addEntityBtn = [
      ...(home.shadowRoot?.querySelectorAll('button') ?? []),
    ].find((b) => b.textContent?.trim() === 'Add entity') as HTMLButtonElement;
    addEntityBtn.click();
    await home.updateComplete;

    const search = home.shadowRoot?.querySelector(
      '#au-floor-entity-search',
    ) as HTMLInputElement;
    expect(search).not.toBeNull();
    expect(home.shadowRoot?.textContent).toContain('Hallway');
    expect(home.shadowRoot?.textContent).toContain('light.hallway');

    search.value = 'gate';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    await home.updateComplete;
    expect(home.shadowRoot?.textContent).toContain('Gate');
    expect(home.shadowRoot?.textContent).not.toContain('Hallway');

    const gateBtn = [
      ...(home.shadowRoot?.querySelectorAll('.entity-search-item') ?? []),
    ].find((b) => b.textContent?.includes('Gate')) as HTMLButtonElement;
    gateBtn.click();
    await home.updateComplete;
    expect(gateBtn.classList.contains('selected')).toBe(true);
    el.remove();
  });

  it('opens Configure card before placing when the type has an editor', async () => {
    class FakeEditor extends HTMLElement {
      hass?: unknown;
      config?: Record<string, unknown>;
      setConfig(config: Record<string, unknown>): void {
        this.config = config;
      }
    }
    class FakeCard extends HTMLElement {
      static getConfigElement(): HTMLElement {
        return document.createElement('fake-atrium-editor');
      }
      static getStubConfig(): Record<string, unknown> {
        return { type: 'custom:fake-atrium-card', entity: 'light.test' };
      }
      setConfig(): void {}
    }
    if (!customElements.get('fake-atrium-editor')) {
      customElements.define('fake-atrium-editor', FakeEditor);
    }
    if (!customElements.get('fake-atrium-card')) {
      customElements.define('fake-atrium-card', FakeCard);
    }
    const prev = window.customCards;
    window.customCards = [
      ...(prev ?? []),
      {
        type: 'fake-atrium-card',
        name: 'Fake Atrium',
        description: 'Has visual editor',
      },
    ];

    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                entities: [],
              },
            ],
          },
        ],
      },
      { 'light.test': makeEntity('light.test', 'on') },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;
    await openHomeRoom(home, 'living');
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    (home.shadowRoot?.querySelector('.add-fab') as HTMLButtonElement).click();
    await home.updateComplete;
    (
      home as unknown as {
        _cardPickerReady: boolean;
        _cardPickerLoading: boolean;
      }
    )._cardPickerReady = false;
    (
      home as unknown as {
        _cardPickerReady: boolean;
        _cardPickerLoading: boolean;
      }
    )._cardPickerLoading = false;
    await home.updateComplete;

    const fakeBtn = [
      ...(home.shadowRoot?.querySelectorAll('.fallback-item') ?? []),
    ].find((b) => b.textContent?.includes('Fake Atrium')) as HTMLButtonElement;
    fakeBtn.click();
    await Promise.resolve();
    await home.updateComplete;
    await Promise.resolve();
    await home.updateComplete;

    expect(home.shadowRoot?.querySelector('[aria-label="Configure card"]')).not.toBeNull();
    expect(home.shadowRoot?.querySelector('[data-card-host]')).toBeNull();

    const floorsPromise = new Promise<unknown>((resolve) => {
      home.addEventListener(
        'home-config-changed',
        (ev) => resolve((ev as CustomEvent).detail.floors),
        { once: true },
      );
    });
    const saveBtn = [
      ...(home.shadowRoot?.querySelectorAll('.modal.card-editor .modal-actions button') ??
        []),
    ].find((b) => b.textContent?.trim() === 'Save') as HTMLButtonElement;
    saveBtn.click();
    const floors = (await floorsPromise) as Array<{
      rooms: Array<{ cards?: Array<{ card: { type: string } }> }>;
    }>;
    expect(floors[0]?.rooms[0]?.cards?.[0]?.card.type).toMatch(/fake-atrium-card/);
    await home.updateComplete;
    expect(home.shadowRoot?.querySelector('.modal.card-editor')).toBeNull();

    window.customCards = prev;
    el.remove();
  });

  it('opens Edit card from pencil and saves config changes', async () => {
    class FakeEditor extends HTMLElement {
      hass?: unknown;
      setConfig(): void {}
    }
    class FakeCard extends HTMLElement {
      static getConfigElement(): HTMLElement {
        return document.createElement('fake-atrium-editor-2');
      }
      static getStubConfig(): Record<string, unknown> {
        return { type: 'custom:fake-atrium-card-2', entity: 'light.a' };
      }
      setConfig(): void {}
    }
    if (!customElements.get('fake-atrium-editor-2')) {
      customElements.define('fake-atrium-editor-2', FakeEditor);
    }
    if (!customElements.get('fake-atrium-card-2')) {
      customElements.define('fake-atrium-card-2', FakeCard);
    }

    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                cards: [
                  {
                    id: 'au-card-0',
                    card: {
                      type: 'custom:fake-atrium-card-2',
                      entity: 'light.a',
                      name: 'Lamp',
                    },
                    layout: { x: 0, y: 0, w: 4, h: 2 },
                  },
                ],
              },
            ],
          },
        ],
      },
      { 'light.a': makeEntity('light.a', 'on') },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;
    await openHomeRoom(home, 'living');
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    const pencil = home.shadowRoot?.querySelector(
      '.edit-card-btn',
    ) as HTMLButtonElement;
    expect(pencil).not.toBeNull();
    pencil.click();
    await Promise.resolve();
    await home.updateComplete;

    expect(home.shadowRoot?.querySelector('[aria-label="Edit card"]')).not.toBeNull();

    (
      home as unknown as { _cardEditorDraft: Record<string, unknown> }
    )._cardEditorDraft = {
      type: 'custom:fake-atrium-card-2',
      entity: 'light.a',
      name: 'Renamed',
    };
    await home.updateComplete;

    const floorsPromise = new Promise<unknown>((resolve) => {
      home.addEventListener(
        'home-config-changed',
        (ev) => resolve((ev as CustomEvent).detail.floors),
        { once: true },
      );
    });
    const saveBtn = [
      ...(home.shadowRoot?.querySelectorAll('.modal.card-editor .modal-actions button') ??
        []),
    ].find((b) => b.textContent?.trim() === 'Save') as HTMLButtonElement;
    saveBtn.click();
    const floors = (await floorsPromise) as Array<{
      rooms: Array<{ cards?: Array<{ card: { name?: string } }> }>;
    }>;
    expect(floors[0]?.rooms[0]?.cards?.[0]?.card.name).toBe('Renamed');
    el.remove();
  });

  it('opens Edit card for au-climate-card in a room and on the floor grid', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            id: 'main',
            name: 'Main',
            entities: [
              {
                entity: 'climate.hall',
                layout: { x: 0, y: 0, w: 4, h: 4 },
              },
            ],
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                cards: [
                  {
                    id: 'au-card-0',
                    card: {
                      type: 'custom:au-climate-card',
                      entity: 'climate.living',
                      show_temperature: true,
                    },
                    layout: { x: 0, y: 0, w: 4, h: 4 },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        'climate.living': makeEntity('climate.living', 'heat', {
          temperature: 22,
          hvac_modes: ['off', 'heat'],
        }),
        'climate.hall': makeEntity('climate.hall', 'cool', {
          temperature: 24,
          hvac_modes: ['off', 'cool'],
        }),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;

    // Floor / Home overview entity
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;
    const floorPencil = home.shadowRoot?.querySelector(
      '.edit-card-btn',
    ) as HTMLButtonElement;
    expect(floorPencil).not.toBeNull();
    floorPencil.click();
    await Promise.resolve();
    await Promise.resolve();
    await home.updateComplete;
    await home.updateComplete;
    expect(home.shadowRoot?.querySelector('[aria-label="Edit card"]')).not.toBeNull();
    expect(
      (home as unknown as { _cardEditorEl?: HTMLElement })._cardEditorEl
        ?.localName,
    ).toBe('au-climate-card-editor');
    expect(
      home.shadowRoot?.querySelector('.card-editor-host')?.firstElementChild
        ?.localName,
    ).toBe('au-climate-card-editor');
    (
      home as unknown as { _closeCardEditor: () => void }
    )._closeCardEditor();
    await home.updateComplete;

    // Room card
    home.layoutEditing = false;
    await home.updateComplete;
    await openHomeRoom(home, 'living');
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;
    const roomPencil = home.shadowRoot?.querySelector(
      '.edit-card-btn',
    ) as HTMLButtonElement;
    expect(roomPencil).not.toBeNull();
    roomPencil.click();
    await Promise.resolve();
    await Promise.resolve();
    await home.updateComplete;
    await home.updateComplete;
    expect(home.shadowRoot?.querySelector('[aria-label="Edit card"]')).not.toBeNull();
    expect(
      home.shadowRoot?.querySelector('.card-editor-host')?.firstElementChild
        ?.localName,
    ).toBe('au-climate-card-editor');
    el.remove();
  });

  it('opens the HA card picker fallback when adding in a room', async () => {
    const prev = window.customCards;
    window.customCards = [
      ...(prev ?? []),
      {
        type: 'mushroom-light-card',
        name: 'Mushroom Light',
        description: 'Test non-atrium card',
      },
    ];

    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                entities: [{ entity: 'switch.a', layout: { x: 0, y: 0, w: 4, h: 2 } }],
              },
            ],
          },
        ],
      },
      { 'switch.a': makeEntity('switch.a', 'on') },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;
    await openHomeRoom(home, 'living');
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    (home.shadowRoot?.querySelector('.add-fab') as HTMLButtonElement).click();
    await home.updateComplete;
    await (
      home as unknown as { _prepareCardPicker: () => Promise<void> }
    )._prepareCardPicker();
    await home.updateComplete;

    expect(home.shadowRoot?.querySelector('[aria-label="Add card"]')).not.toBeNull();
    // Force fallback list path (no native hui-card-picker in jsdom).
    (
      home as unknown as {
        _cardPickerReady: boolean;
        _cardPickerLoading: boolean;
      }
    )._cardPickerReady = false;
    (
      home as unknown as {
        _cardPickerReady: boolean;
        _cardPickerLoading: boolean;
      }
    )._cardPickerLoading = false;
    await home.updateComplete;

    expect(home.shadowRoot?.textContent).toMatch(/Mushroom Light|registered card/i);

    const floorsPromise = new Promise<unknown>((resolve) => {
      home.addEventListener(
        'home-config-changed',
        (ev) => resolve((ev as CustomEvent).detail.floors),
        { once: true },
      );
    });
    const mushroomBtn = [
      ...(home.shadowRoot?.querySelectorAll('.fallback-item') ?? []),
    ].find((b) => b.textContent?.includes('Mushroom Light')) as
      | HTMLButtonElement
      | undefined;
    expect(mushroomBtn).toBeDefined();
    mushroomBtn!.click();
    await Promise.resolve();
    await home.updateComplete;

    const floors = (await floorsPromise) as Array<{
      rooms: Array<{ cards?: Array<{ card: { type: string }; layout?: object }> }>;
    }>;
    expect(floors[0]?.rooms[0]?.cards?.length).toBeGreaterThan(0);
    expect(floors[0]?.rooms[0]?.cards?.[0]?.card.type).toMatch(/mushroom-light-card/);
    expect(floors[0]?.rooms[0]?.cards?.[0]?.layout).toBeDefined();

    window.customCards = prev;
    el.remove();
  });

  it('shows light/switch counts on room tiles (not sensors or climate cards)', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [
                  { entity: 'switch.lamp' },
                  { entity: 'sensor.temp' },
                ],
                cards: [
                  {
                    id: 'au-card-0',
                    card: {
                      type: 'custom:au-light-card',
                      entity: 'light.console',
                    },
                    layout: { x: 0, y: 0, w: 4, h: 2 },
                  },
                  {
                    id: 'au-card-1',
                    card: {
                      type: 'custom:au-climate-card',
                      entity: 'climate.ac',
                    },
                    layout: { x: 4, y: 0, w: 4, h: 2 },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        'switch.lamp': makeEntity('switch.lamp', 'on'),
        'sensor.temp': makeEntity('sensor.temp', '21'),
        'light.console': makeEntity('light.console', 'off'),
        'climate.ac': makeEntity('climate.ac', 'heat'),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await home.updateComplete;

    const card = await waitForRoomTileCard(home, 'living');
    // 1 on (switch) · 2 toggles (switch + light from card); sensor/climate ignored
    expect(card.shadowRoot?.querySelector('.subtitle')?.textContent?.trim()).toBe(
      '1 on · 2',
    );
    el.remove();
  });

  it('adds a light/switch to the room from Edit room modal', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [],
              },
            ],
          },
        ],
      },
      {
        'light.ceiling': makeEntity('light.ceiling', 'on', {
          friendly_name: 'Ceiling',
        }),
        'switch.plug': makeEntity('switch.plug', 'off', {
          friendly_name: 'Plug',
        }),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    (
      home as unknown as { _openEditRoom: (id: string) => void }
    )._openEditRoom('living');
    await home.updateComplete;

    const search = home.shadowRoot?.querySelector(
      '#edit-room-add-entity',
    ) as HTMLInputElement;
    expect(search).not.toBeNull();
    search.value = 'ceiling';
    search.dispatchEvent(new Event('input'));
    await home.updateComplete;

    const addBtn = [
      ...(home.shadowRoot?.querySelectorAll('.entity-search-item') ?? []),
    ].find((btn) => btn.textContent?.includes('Ceiling')) as HTMLButtonElement;
    expect(addBtn).toBeDefined();
    addBtn.click();
    await home.updateComplete;

    const floorsPromise = new Promise<unknown>((resolve) => {
      home.addEventListener(
        'home-config-changed',
        (ev) => resolve((ev as CustomEvent).detail.floors),
        { once: true },
      );
    });
    (
      home.shadowRoot?.querySelector(
        '.modal.edit-room .modal-actions button:not(.plain)',
      ) as HTMLButtonElement
    ).click();
    const floors = (await floorsPromise) as Array<{
      rooms: Array<{ entities?: Array<{ entity: string }> }>;
    }>;
    expect(floors[0]?.rooms[0]?.entities?.map((e) => e.entity)).toContain(
      'light.ceiling',
    );
    el.remove();
  });

  it('mounts au-room-card on floor tiles and toggles via chip click', async () => {
    const { el, callService } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'large',
                name: 'Large room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [
                  { entity: 'light.off_a' },
                  { entity: 'switch.on_a' },
                  { entity: 'sensor.temp' },
                ],
              },
              {
                id: 'small',
                name: 'Small room',
                layout: { x: 4, y: 0, w: 2, h: 2 },
                entities: [{ entity: 'light.small' }],
              },
            ],
          },
        ],
      },
      {
        'light.off_a': makeEntity('light.off_a', 'off'),
        'switch.on_a': makeEntity('switch.on_a', 'on'),
        'sensor.temp': makeEntity('sensor.temp', '21'),
        'light.small': makeEntity('light.small', 'on'),
      },
    );

    const home = el.shadowRoot?.querySelector(
      'au-shell-home-view',
    ) as unknown as HomeViewTestApi;
    await home.updateComplete;

    const largeHost = roomTileHost(home, 'large');
    const smallHost = roomTileHost(home, 'small');
    const largeCard = await waitForRoomTileCard(home, 'large');
    const smallCard = await waitForRoomTileCard(home, 'small');
    expect(largeHost).not.toBeNull();
    expect(smallHost).not.toBeNull();
    expect(largeCard.localName).toBe('au-room-card');
    expect(smallCard.localName).toBe('au-room-card');

    expect(largeCard.shadowRoot?.querySelector('.title')?.textContent?.trim()).toBe(
      'Large room',
    );
    expect(
      largeCard.shadowRoot?.querySelector('.subtitle')?.textContent?.trim(),
    ).toMatch(/1 on · 2/);

    const chips = roomTileChips(largeHost);
    expect(chips).toHaveLength(2);
    // Config order (stable): light.off_a then switch.on_a — not on-first.
    expect(chips[0]?.getAttribute('data-entity')).toBe('light.off_a');
    expect(chips[1]?.getAttribute('data-entity')).toBe('switch.on_a');
    expect(chips[0]?.classList.contains('is-off')).toBe(true);
    expect(chips[1]?.classList.contains('is-on')).toBe(true);

    const onBtn = chips.find(
      (c) => c.getAttribute('data-entity') === 'switch.on_a',
    ) as HTMLButtonElement;
    const offBtn = chips.find(
      (c) => c.getAttribute('data-entity') === 'light.off_a',
    ) as HTMLButtonElement;
    expect(onBtn).toBeDefined();
    expect(offBtn).toBeDefined();
    onBtn.click();
    expect(callService).toHaveBeenCalledWith('switch', 'turn_off', {
      entity_id: 'switch.on_a',
    });
    callService.mockClear();
    // Separate control — same-button click/touchend is intentionally debounced.
    offBtn.dispatchEvent(
      new TouchEvent('touchend', { bubbles: true, cancelable: true }),
    );
    expect(callService).toHaveBeenCalledWith('light', 'toggle', {
      entity_id: 'light.off_a',
    });

    const header = largeCard.shadowRoot?.querySelector(
      '.header-action.interactive',
    ) as HTMLButtonElement;
    header.click();
    await home.updateComplete;
    await home.updateComplete;
    expect(home.shadowRoot?.textContent).toMatch(/all off|back/i);
    el.remove();
  });

  it('opens Edit room modal in Home edit mode and saves strip settings', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [
                  { entity: 'light.keep' },
                  { entity: 'light.hide' },
                ],
              },
            ],
          },
        ],
      },
      {
        'light.keep': makeEntity('light.keep', 'on', { friendly_name: 'Keep' }),
        'light.hide': makeEntity('light.hide', 'off', { friendly_name: 'Hide' }),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    const editBtn = home.shadowRoot?.querySelector(
      '.edit-room-btn',
    ) as HTMLButtonElement;
    expect(editBtn).not.toBeNull();
    editBtn.click();
    await home.updateComplete;

    expect(home.shadowRoot?.querySelector('.modal.edit-room')).not.toBeNull();
    const nameInput = home.shadowRoot?.querySelector(
      '#edit-room-name',
    ) as HTMLInputElement;
    nameInput.value = 'Lounge';
    nameInput.dispatchEvent(new Event('input'));
    await home.updateComplete;

    const checkboxes = [
      ...(home.shadowRoot?.querySelectorAll('.edit-room-entity input[type="checkbox"]') ??
        []),
    ] as HTMLInputElement[];
    expect(checkboxes.length).toBe(2);
    // Uncheck the second light → whitelist the first only.
    checkboxes[1]!.checked = false;
    checkboxes[1]!.dispatchEvent(new Event('change'));
    await home.updateComplete;

    const floorsPromise = new Promise<unknown>((resolve) => {
      home.addEventListener(
        'home-config-changed',
        (ev) => resolve((ev as CustomEvent).detail.floors),
        { once: true },
      );
    });
    const saveBtn = [
      ...(home.shadowRoot?.querySelectorAll('.modal.edit-room .modal-actions button') ??
        []),
    ].find((b) => b.textContent?.trim() === 'Save') as HTMLButtonElement;
    saveBtn.click();
    const floors = (await floorsPromise) as Array<{
      rooms: Array<{
        name: string;
        controls?: { exclude?: string[]; show?: boolean; order?: string[] };
      }>;
    }>;
    expect(floors[0]?.rooms[0]?.name).toBe('Lounge');
    expect(floors[0]?.rooms[0]?.controls?.exclude).toEqual(['light.hide']);
    expect(floors[0]?.rooms[0]?.controls?.order).toEqual([
      'light.keep',
      'light.hide',
    ]);
    expect(home.shadowRoot?.querySelector('.modal.edit-room')).toBeNull();
    await home.updateComplete;
    await home.updateComplete;
    const host = roomTileHost(home, 'living');
    await waitForRoomTileCard(home, 'living');
    const chips = roomTileChips(host);
    expect(chips.some((c) => c.dataset.entity === 'light.keep')).toBe(true);
    expect(chips.some((c) => c.dataset.entity === 'light.hide')).toBe(false);
    const card = roomTileCard(host);
    expect(card?.shadowRoot?.querySelector('.title')?.textContent?.trim()).toBe(
      'Lounge',
    );
    el.remove();
  });

  it('reorders room strip entities from Edit room modal', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [
                  { entity: 'light.first' },
                  { entity: 'light.second' },
                ],
              },
            ],
          },
        ],
      },
      {
        'light.first': makeEntity('light.first', 'off', { friendly_name: 'First' }),
        'light.second': makeEntity('light.second', 'off', {
          friendly_name: 'Second',
        }),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
    };
    await home.updateComplete;
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    (
      home as unknown as { _openEditRoom: (id: string) => void }
    )._openEditRoom('living');
    await home.updateComplete;

    const downBtn = home.shadowRoot?.querySelector(
      '.edit-room-entity [aria-label="Move down"]',
    ) as HTMLButtonElement;
    expect(downBtn).not.toBeNull();
    downBtn.click();
    await home.updateComplete;

    const floorsPromise = new Promise<unknown>((resolve) => {
      home.addEventListener(
        'home-config-changed',
        (ev) => resolve((ev as CustomEvent).detail.floors),
        { once: true },
      );
    });
    (
      [...(home.shadowRoot?.querySelectorAll('.modal.edit-room .modal-actions button') ?? [])].find(
        (b) => b.textContent?.trim() === 'Save',
      ) as HTMLButtonElement
    ).click();
    const floors = (await floorsPromise) as Array<{
      rooms: Array<{ controls?: { order?: string[] } }>;
    }>;
    expect(floors[0]?.rooms[0]?.controls?.order).toEqual([
      'light.second',
      'light.first',
    ]);
    el.remove();
  });

  it('honors room controls show/include/exclude/icons', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        room_controls: { show: true },
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'hidden',
                name: 'Hidden strip',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                controls: { show: false },
                entities: [{ entity: 'light.a' }],
              },
              {
                id: 'filtered',
                name: 'Filtered',
                layout: { x: 4, y: 0, w: 4, h: 2 },
                controls: {
                  include: ['light.keep', 'switch.drop'],
                  exclude: ['switch.drop'],
                  icons: { 'light.keep': 'mdi:lamp' },
                },
                entities: [
                  { entity: 'light.keep' },
                  { entity: 'light.other' },
                  { entity: 'switch.drop' },
                ],
              },
            ],
          },
        ],
      },
      {
        'light.a': makeEntity('light.a', 'on'),
        'light.keep': makeEntity('light.keep', 'on'),
        'light.other': makeEntity('light.other', 'on'),
        'switch.drop': makeEntity('switch.drop', 'on'),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await home.updateComplete;

    const hiddenHost = roomTileHost(home, 'hidden');
    await waitForRoomTileCard(home, 'hidden');
    expect(roomTileCard(hiddenHost)?.localName).toBe('au-room-card');
    expect(roomTileChips(hiddenHost)).toHaveLength(0);

    const filteredHost = roomTileHost(home, 'filtered');
    await waitForRoomTileCard(home, 'filtered');
    const chips = roomTileChips(filteredHost);
    expect(chips).toHaveLength(1);
    expect(chips[0]?.getAttribute('aria-label')).toMatch(/light\.keep|keep/i);
    expect(
      (chips[0]?.querySelector('ha-icon') as HTMLElement & { icon?: string })?.icon,
    ).toBe('mdi:lamp');
    el.remove();
  });

  it('keeps room-tile chips after responsive tablet scaling', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [{ entity: 'light.living' }],
              },
            ],
          },
        ],
      },
      { 'light.living': makeEntity('light.living', 'on') },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as unknown as HTMLElement & {
      updateComplete: Promise<unknown>;
      _hostWidth: number;
    };
    await home.updateComplete;

    // Tablet width → 6 display columns; configured w=4 scales to w=2.
    home._hostWidth = 900;
    await home.updateComplete;
    await home.updateComplete;

    const host = roomTileHost(home, 'living');
    await waitForRoomTileCard(home, 'living');
    expect(roomTileCard(host)?.localName).toBe('au-room-card');
    expect(roomTileChips(host)).toHaveLength(1);
    el.remove();
  });

  it('shows room tiles without chips when empty/excluded and caps chip count', async () => {
    const lights = Array.from({ length: 7 }, (_, i) => `light.l${i}`);
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'empty',
                name: 'Empty room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [{ entity: 'sensor.only' }],
              },
              {
                id: 'excluded',
                name: 'All excluded',
                layout: { x: 0, y: 2, w: 4, h: 2 },
                controls: { exclude: ['switch.gone'] },
                entities: [{ entity: 'switch.gone' }],
              },
              {
                id: 'many',
                name: 'Many lights',
                layout: { x: 4, y: 0, w: 4, h: 2 },
                entities: lights.map((entity) => ({ entity })),
              },
            ],
          },
        ],
      },
      {
        'sensor.only': makeEntity('sensor.only', '1'),
        'switch.gone': makeEntity('switch.gone', 'on'),
        ...Object.fromEntries(
          lights.map((id, i) => [id, makeEntity(id, i === 0 ? 'on' : 'off')]),
        ),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await home.updateComplete;

    const emptyHost = roomTileHost(home, 'empty');
    const excludedHost = roomTileHost(home, 'excluded');
    const manyHost = roomTileHost(home, 'many');
    await waitForRoomTileCard(home, 'empty');
    await waitForRoomTileCard(home, 'excluded');
    await waitForRoomTileCard(home, 'many');

    expect(roomTileCard(emptyHost)?.localName).toBe('au-room-card');
    expect(roomTileChips(emptyHost)).toHaveLength(0);
    expect(roomTileChips(excludedHost)).toHaveLength(0);
    expect(roomTileChips(manyHost)).toHaveLength(6);
    el.remove();
  });

  it('keeps floor entities alongside rooms in the Home edit draft', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            entities: [
              { entity: 'switch.gate', layout: { x: 4, y: 0, w: 2, h: 2 } },
            ],
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [],
              },
            ],
          },
        ],
      },
      { 'switch.gate': makeEntity('switch.gate', 'off') },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as unknown as {
      updateComplete: Promise<unknown>;
      layoutEditing: boolean;
      shadowRoot: ShadowRoot | null;
    };
    await home.updateComplete;

    let committedOnEnter = false;
    (home as unknown as HTMLElement).addEventListener('home-config-changed', () => {
      committedOnEnter = true;
    });
    home.layoutEditing = true;
    await home.updateComplete;
    await home.updateComplete;

    expect(home.shadowRoot?.querySelector('[aria-label="Add to floor"]')).not.toBeNull();
    expect(committedOnEnter).toBe(false);
    // Draft hosts include the room tile and floor entity without a floors rewrite.
    expect(home.shadowRoot?.querySelector('.room-host')).not.toBeNull();
    expect(home.shadowRoot?.querySelector('.entity-host')).not.toBeNull();
    el.remove();
  });

  it('updates room cards and chips when entities change outside the UI', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living room',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [{ entity: 'switch.lamp' }],
                cards: [
                  {
                    id: 'au-card-0',
                    card: {
                      type: 'custom:au-light-card',
                      entity: 'light.ceiling',
                    },
                    layout: { x: 0, y: 0, w: 4, h: 2 },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        'switch.lamp': makeEntity('switch.lamp', 'on', { friendly_name: 'Lamp' }),
        'light.ceiling': makeEntity('light.ceiling', 'on', {
          friendly_name: 'Ceiling',
          brightness: 200,
          supported_color_modes: ['brightness'],
        }),
      },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await home.updateComplete;

    const livingHost = roomTileHost(home, 'living');
    await waitForRoomTileCard(home, 'living');
    const chipOn = roomTileChips(livingHost).find(
      (c) => c.dataset.entity === 'switch.lamp',
    );
    expect(chipOn).toBeDefined();
    expect(chipOn?.classList.contains('is-on')).toBe(true);

    await openHomeRoom(home, 'living');

    const cardHost = home.shadowRoot?.querySelector(
      '[data-card-host="au-card-0"]',
    ) as HTMLElement;
    expect(cardHost).not.toBeNull();

    let lightCard = cardHost.firstElementChild as HTMLElement & {
      hass?: { states: Record<string, { state: string }> };
      updateComplete?: Promise<unknown>;
    } | null;
    for (let i = 0; i < 30 && !lightCard; i++) {
      await new Promise((r) => setTimeout(r, 0));
      lightCard = cardHost.firstElementChild as typeof lightCard;
    }
    expect(lightCard?.localName).toBe('au-light-card');
    expect(lightCard?.hass?.states['light.ceiling']?.state).toBe('on');

    el.hass = makeHass({
      'switch.lamp': makeEntity('switch.lamp', 'off', { friendly_name: 'Lamp' }),
      'light.ceiling': makeEntity('light.ceiling', 'off', {
        friendly_name: 'Ceiling',
        supported_color_modes: ['brightness'],
      }),
    });
    await el.updateComplete;
    await home.updateComplete;
    if (lightCard?.updateComplete) await lightCard.updateComplete;

    expect(lightCard?.hass?.states['light.ceiling']?.state).toBe('off');

    (
      home as unknown as { _goHome: () => void }
    )._goHome();
    await home.updateComplete;
    await home.updateComplete;

    const hostAgain = roomTileHost(home, 'living');
    await waitForRoomTileCard(home, 'living');
    const chipOff = roomTileChips(hostAgain).find(
      (c) => c.dataset.entity === 'switch.lamp',
    );
    expect(chipOff).toBeDefined();
    expect(chipOff?.classList.contains('is-on')).toBe(false);
    expect(chipOff?.classList.contains('is-off')).toBe(true);
    el.remove();
  });

  it('places floor cards from floors[].cards on the Home grid', async () => {
    const { el } = await renderShell(
      {
        type: 'custom:au-shell-grid',
        columns: 12,
        floors: [
          {
            name: 'Main',
            rooms: [
              {
                id: 'living',
                name: 'Living',
                layout: { x: 0, y: 0, w: 4, h: 2 },
                entities: [],
              },
            ],
            cards: [
              {
                id: 'quick',
                layout: { x: 4, y: 0, w: 4, h: 2 },
                card: {
                  type: 'custom:au-room-card',
                  name: 'Quick lights',
                  entities: ['light.hall'],
                },
              },
            ],
          },
        ],
      },
      { 'light.hall': makeEntity('light.hall', 'on') },
    );

    const home = el.shadowRoot?.querySelector('au-shell-home-view') as HTMLElement & {
      updateComplete: Promise<unknown>;
    };
    await home.updateComplete;

    const host = home.shadowRoot?.querySelector(
      '[data-card-host="quick"]',
    ) as HTMLElement;
    expect(host).not.toBeNull();
    let card = host.firstElementChild as HTMLElement | null;
    for (let i = 0; i < 30 && !card; i++) {
      await new Promise((r) => setTimeout(r, 0));
      card = host.firstElementChild as HTMLElement | null;
    }
    expect(card?.localName).toBe('au-room-card');
    const chips = [
      ...(card?.shadowRoot?.querySelectorAll('.chip') ?? []),
    ] as HTMLElement[];
    expect(chips).toHaveLength(1);
    expect(chips[0]?.dataset.entity).toBe('light.hall');
    el.remove();
  });
});
