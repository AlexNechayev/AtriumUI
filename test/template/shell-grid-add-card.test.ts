import { describe, it, expect, vi, afterEach } from 'vitest';
import '../../src/index';
import { makeHass } from '../helpers';

interface ShellGridTestApi extends HTMLElement {
  hass?: unknown;
  editMode: boolean;
  preview: boolean;
  setConfig: (config: Record<string, unknown>) => void;
  updateComplete: Promise<boolean>;
  _addCardOpen: boolean;
  _items: Array<{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    config: { type: string; id?: string; entity?: string };
  }>;
  _elements: Map<string, HTMLElement>;
  _onCardPicked: (config: {
    type: string;
    id?: string;
    entity?: string;
  }) => Promise<void>;
  _openAddCard: () => void;
  _closeAddCard: () => void;
}

async function mountGrid(
  cards: Array<Record<string, unknown>> = [],
): Promise<ShellGridTestApi> {
  const el = document.createElement('au-shell-grid') as unknown as ShellGridTestApi;
  // Desktop layout gate requires width > 1024.
  Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => 1200 });
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    width: 1200,
    height: 600,
    top: 0,
    left: 0,
    right: 1200,
    bottom: 600,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  document.body.appendChild(el);
  // Legacy free-form cards UI (no floors). Empty cards alone now render Home,
  // so seed one card when the test does not supply any.
  const legacyCards =
    cards.length > 0
      ? cards
      : [
          {
            type: 'custom:au-action-card',
            entity: 'light.seed',
            id: 'seed',
            layout: { x: 0, y: 0, w: 4, h: 2 },
          },
        ];
  el.setConfig({
    type: 'custom:au-shell-grid',
    columns: 12,
    cards: legacyCards,
  });
  el.hass = makeHass({});
  await el.updateComplete;
  await Promise.resolve();
  await el.updateComplete;
  return el;
}

async function enterLayoutEdit(el: ShellGridTestApi): Promise<void> {
  el.editMode = true;
  await el.updateComplete;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('au-shell-grid in-grid add card', () => {
  it('hides the add FAB when not layout-editing', async () => {
    const el = await mountGrid();
    expect(el.shadowRoot?.querySelector('.add-fab')).toBeNull();
    el.remove();
  });

  it('shows the add FAB when layout-editing', async () => {
    const el = await mountGrid();
    await enterLayoutEdit(el);
    expect(el.shadowRoot?.querySelector('.add-fab')).not.toBeNull();
    el.remove();
  });

  it('opens the add modal from the FAB', async () => {
    const el = await mountGrid();
    await enterLayoutEdit(el);
    el._openAddCard();
    await el.updateComplete;
    // Allow async picker prepare to settle (falls back without HA picker).
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el._addCardOpen).toBe(true);
    expect(el.shadowRoot?.querySelector('[aria-label="Add card"]')).not.toBeNull();
    el.remove();
  });

  it('shows a fallback card list when hui-card-picker is not registered', async () => {
    const el = await mountGrid();
    await enterLayoutEdit(el);
    el._openAddCard();
    await el.updateComplete;
    await (el as unknown as { _prepareCardPicker: () => Promise<void> })._prepareCardPicker();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.fallback-list')).not.toBeNull();
    expect(el.shadowRoot?.textContent).toMatch(/Action Card|Light Card|Climate Card/i);
    el.remove();
  });

  it('places a card from the fallback list stub', async () => {
    const el = await mountGrid();
    await enterLayoutEdit(el);
    const before = el._items.length;
    const api = el as unknown as {
      _pickFallbackCard: (type: string) => void;
    };
    api._pickFallbackCard('au-action-card');
    await Promise.resolve();
    await el.updateComplete;
    expect(el._items.length).toBe(before + 1);
    expect(el._items.some((i) => i.config.type.includes('au-action-card'))).toBe(
      true,
    );
    el.remove();
  });

  it('places a picked card into a free slot with auto id', async () => {
    const el = await mountGrid([
      {
        type: 'custom:au-action-card',
        entity: 'light.kitchen',
        id: 'existing',
        layout: { x: 0, y: 0, w: 4, h: 2 },
      },
    ]);
    await Promise.resolve();
    await el.updateComplete;

    await el._onCardPicked({
      type: 'custom:au-action-card',
      entity: 'light.living',
    });
    await el.updateComplete;

    expect(el._items.length).toBe(2);
    const added = el._items.find((i) => i.id !== 'existing');
    expect(added).toBeDefined();
    expect(added?.config.entity).toBe('light.living');
    expect(added?.config.id).toBe(added?.id);
    expect(added?.w).toBeGreaterThan(0);
    expect(added?.h).toBe(2);
    expect(el._elements.has(added!.id)).toBe(true);
    expect(el._addCardOpen).toBe(false);
    el.remove();
  });

  it('preserves an explicit id from the picked config', async () => {
    const el = await mountGrid();
    await el._onCardPicked({
      type: 'custom:au-sensor-card',
      entity: 'sensor.temp',
      id: 'temp-tile',
    });
    await el.updateComplete;

    const added = el._items.find((i) => i.id === 'temp-tile');
    expect(added).toBeDefined();
    expect(added?.config.id).toBe('temp-tile');
    el.remove();
  });

  it('closes the add modal via _closeAddCard', async () => {
    const el = await mountGrid();
    await enterLayoutEdit(el);
    el._openAddCard();
    await el.updateComplete;
    el._closeAddCard();
    await el.updateComplete;
    expect(el._addCardOpen).toBe(false);
    el.remove();
  });
});
