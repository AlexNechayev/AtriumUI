import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuVacuumCard } from '../../src/card/vacuum-card/au-vacuum-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function renderVacuumCard(
  config: Parameters<AuVacuumCard['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>>,
  callService = vi.fn().mockResolvedValue(undefined),
): Promise<{ el: AuVacuumCard; callService: typeof callService }> {
  const el = document.createElement('au-vacuum-card') as AuVacuumCard;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass(states, callService);
  await el.updateComplete;
  return { el, callService };
}

describe('au-vacuum-card', () => {
  it('requires a vacuum entity', () => {
    const el = document.createElement('au-vacuum-card') as AuVacuumCard;
    expect(() =>
      el.setConfig({ type: 'custom:au-vacuum-card', entity: 'switch.x' }),
    ).toThrow(/vacuum/i);
  });

  it('registers stub and customCards entry', () => {
    expect(AuVacuumCard.getStubConfig()).toEqual({
      type: 'custom:au-vacuum-card',
      entity: '',
    });
    expect(window.customCards?.some((c) => c.type === 'au-vacuum-card')).toBe(
      true,
    );
  });

  it('renders controls as icons', async () => {
    const { el } = await renderVacuumCard(
      {
        type: 'custom:au-vacuum-card',
        entity: 'vacuum.bot',
        show_controls: true,
      },
      {
        'vacuum.bot': makeEntity('vacuum.bot', 'docked', {
          supported_features: 8192 + 16 + 4 + 8,
          friendly_name: 'Robot',
        }),
      },
    );
    expect(el.shadowRoot?.textContent).toContain('Robot');
    const buttons = [
      ...(el.shadowRoot?.querySelectorAll('.controls .ctrl.icon') ?? []),
    ] as HTMLButtonElement[];
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const icons = buttons.map((btn) => {
      const iconEl = btn.querySelector('ha-icon') as HTMLElement & {
        icon?: string;
      };
      return iconEl?.icon ?? iconEl?.getAttribute('icon') ?? '';
    });
    expect(icons).toEqual(
      expect.arrayContaining(['mdi:play', 'mdi:home-map-marker']),
    );
    el.remove();
  });

  it('hides domain controls on home variant unless opted in but keeps settings gear', async () => {
    const { el } = await renderVacuumCard(
      {
        type: 'custom:au-vacuum-card',
        entity: 'vacuum.bot',
        variant: 'home',
      },
      {
        'vacuum.bot': makeEntity('vacuum.bot', 'docked', {
          supported_features: 8192 + 16 + 4 + 8,
        }),
      },
    );
    const icons = [
      ...(el.shadowRoot?.querySelectorAll('.controls .ctrl.icon') ?? []),
    ] as HTMLButtonElement[];
    expect(icons.length).toBe(1);
    const iconEl = icons[0]!.querySelector('ha-icon') as HTMLElement & {
      icon?: string;
    };
    expect(iconEl?.icon ?? iconEl?.getAttribute('icon')).toBe('mdi:cog');
    el.remove();
  });

  it('honors legacy show_vacuum_controls on home', async () => {
    const { el } = await renderVacuumCard(
      {
        type: 'custom:au-vacuum-card',
        entity: 'vacuum.bot',
        variant: 'home',
        show_vacuum_controls: true,
      },
      {
        'vacuum.bot': makeEntity('vacuum.bot', 'docked', {
          supported_features: 8192 + 16 + 4 + 8,
        }),
      },
    );
    expect(
      el.shadowRoot?.querySelectorAll('.controls .ctrl.icon').length,
    ).toBeGreaterThan(1);
    el.remove();
  });

  it('opens settings overlay from gear and hold', async () => {
    const { el } = await renderVacuumCard(
      {
        type: 'custom:au-vacuum-card',
        entity: 'vacuum.bot',
        show_controls: false,
        show_settings: true,
      },
      {
        'vacuum.bot': makeEntity('vacuum.bot', 'docked', {
          supported_features: 8192,
          friendly_name: 'X40',
        }),
      },
    );
    const gear = el.shadowRoot?.querySelector(
      '.controls .ctrl.settings',
    ) as HTMLButtonElement;
    expect(gear).not.toBeNull();
    gear.click();
    await el.updateComplete;
    const overlay = document.querySelector('au-vacuum-settings-overlay') as
      | (HTMLElement & { isOpen: boolean; close: () => void })
      | null;
    expect(overlay).not.toBeNull();
    expect(overlay!.isOpen).toBe(true);

    overlay!.close();
    const card = el as AuVacuumCard & {
      _onAction: (ev: CustomEvent) => void;
    };
    card._onAction(new CustomEvent('action', { detail: { action: 'hold' } }));
    await el.updateComplete;
    expect(overlay!.isOpen).toBe(true);
    overlay!.close();
    el.remove();
  });

  it('hides settings when show_settings is false', async () => {
    const { el } = await renderVacuumCard(
      {
        type: 'custom:au-vacuum-card',
        entity: 'vacuum.bot',
        show_controls: false,
        show_settings: false,
      },
      {
        'vacuum.bot': makeEntity('vacuum.bot', 'docked', {
          supported_features: 8192,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('.ctrl.settings')).toBeNull();
    el.remove();
  });

  it('starts when docked on primary tap', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderVacuumCard(
      { type: 'custom:au-vacuum-card', entity: 'vacuum.bot' },
      {
        'vacuum.bot': makeEntity('vacuum.bot', 'docked', {
          supported_features: 8192,
        }),
      },
      callService,
    );
    const card = el as AuVacuumCard & {
      _onAction: (ev: CustomEvent) => void;
    };
    card._onAction(new CustomEvent('action', { detail: { action: 'tap' } }));
    await el.updateComplete;
    expect(callService).toHaveBeenCalledWith('vacuum', 'start', {
      entity_id: 'vacuum.bot',
    });
    el.remove();
  });
});
