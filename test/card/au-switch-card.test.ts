import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuSwitchCard } from '../../src/card/switch-card/au-switch-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function renderSwitchCard(
  config: Parameters<AuSwitchCard['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>>,
  callService = vi.fn().mockResolvedValue(undefined),
): Promise<{ el: AuSwitchCard; callService: typeof callService }> {
  const el = document.createElement('au-switch-card') as AuSwitchCard;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass(states, callService);
  await el.updateComplete;
  return { el, callService };
}

describe('au-switch-card', () => {
  it('requires a switch entity', () => {
    const el = document.createElement('au-switch-card') as AuSwitchCard;
    expect(() =>
      el.setConfig({ type: 'custom:au-switch-card', entity: 'cover.x' }),
    ).toThrow(/switch/i);
  });

  it('registers stub and customCards entry', () => {
    expect(AuSwitchCard.getStubConfig()).toEqual({
      type: 'custom:au-switch-card',
      entity: '',
    });
    expect(window.customCards?.some((c) => c.type === 'au-switch-card')).toBe(
      true,
    );
  });

  it('renders switch tile as active', async () => {
    const { el } = await renderSwitchCard(
      { type: 'custom:au-switch-card', entity: 'switch.outlet' },
      {
        'switch.outlet': makeEntity('switch.outlet', 'on', {
          friendly_name: 'Outlet',
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('.tile.active')).not.toBeNull();
    expect(el.shadowRoot?.textContent).toContain('Outlet');
    el.remove();
  });

  it('toggles with turn_off from live hass state', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderSwitchCard(
      { type: 'custom:au-switch-card', entity: 'switch.outlet' },
      {
        'switch.outlet': makeEntity('switch.outlet', 'on', {
          friendly_name: 'Outlet',
        }),
      },
      callService,
    );

    const card = el as AuSwitchCard & {
      _onAction: (ev: CustomEvent) => void;
    };
    card._onAction(new CustomEvent('action', { detail: { action: 'tap' } }));
    await el.updateComplete;

    expect(callService).toHaveBeenCalledWith('switch', 'turn_off', {
      entity_id: 'switch.outlet',
    });
    expect(el.shadowRoot?.querySelector('.tile.active')).not.toBeNull();

    el.hass = makeHass(
      {
        'switch.outlet': makeEntity('switch.outlet', 'off', {
          friendly_name: 'Outlet',
        }),
      },
      callService,
    );
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.tile.active')).toBeNull();
    el.remove();
  });

  it('applies home-tile + domain-switch when variant is home', async () => {
    const { el } = await renderSwitchCard(
      {
        type: 'custom:au-switch-card',
        entity: 'switch.outlet',
        variant: 'home',
      },
      { 'switch.outlet': makeEntity('switch.outlet', 'on') },
    );
    const card = el.shadowRoot?.querySelector('.au-card');
    expect(card?.classList.contains('home-tile')).toBe(true);
    expect(card?.classList.contains('domain-switch')).toBe(true);
    el.remove();
  });
});
