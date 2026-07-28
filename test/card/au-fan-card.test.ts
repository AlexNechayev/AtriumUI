import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuFanCard } from '../../src/card/fan-card/au-fan-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function renderFanCard(
  config: Parameters<AuFanCard['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>>,
  callService = vi.fn().mockResolvedValue(undefined),
): Promise<{ el: AuFanCard; callService: typeof callService }> {
  const el = document.createElement('au-fan-card') as AuFanCard;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass(states, callService);
  await el.updateComplete;
  return { el, callService };
}

describe('au-fan-card', () => {
  it('requires a fan entity', () => {
    const el = document.createElement('au-fan-card') as AuFanCard;
    expect(() =>
      el.setConfig({ type: 'custom:au-fan-card', entity: 'switch.x' }),
    ).toThrow(/fan/i);
  });

  it('registers stub and customCards entry', () => {
    expect(AuFanCard.getStubConfig()).toEqual({
      type: 'custom:au-fan-card',
      entity: '',
    });
    expect(window.customCards?.some((c) => c.type === 'au-fan-card')).toBe(
      true,
    );
  });

  it('renders active tile with slider by default', async () => {
    const { el } = await renderFanCard(
      { type: 'custom:au-fan-card', entity: 'fan.bedroom' },
      {
        'fan.bedroom': makeEntity('fan.bedroom', 'on', {
          friendly_name: 'Bedroom fan',
          supported_features: 1,
          percentage: 40,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('.tile.active')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('au-light-slider')).not.toBeNull();
    expect(el.shadowRoot?.textContent).toContain('Bedroom fan');
    el.remove();
  });

  it('renders expandable speed selector when speed_control is button', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderFanCard(
      {
        type: 'custom:au-fan-card',
        entity: 'fan.bedroom',
        speed_control: 'button',
      },
      {
        'fan.bedroom': makeEntity('fan.bedroom', 'on', {
          supported_features: 1,
          percentage: 50,
          percentage_step: 25,
        }),
      },
      callService,
    );
    expect(el.shadowRoot?.querySelector('au-light-slider')).toBeNull();
    const selector = el.shadowRoot?.querySelector('au-fan-speed-selector') as
      | (HTMLElement & {
          shadowRoot: ShadowRoot | null;
          updateComplete: Promise<unknown>;
        })
      | null;
    expect(selector).not.toBeNull();
    await el.updateComplete;

    const trigger = selector?.shadowRoot?.querySelector(
      'button.trigger',
    ) as HTMLButtonElement | null;
    expect(trigger).not.toBeNull();
    expect(selector?.shadowRoot?.querySelector('.option-grid')).toBeNull();

    trigger!.click();
    await selector!.updateComplete;
    const options = [
      ...(selector?.shadowRoot?.querySelectorAll('.option-grid .option') ?? []),
    ];
    expect(options.length).toBe(5);
    expect(selector?.getAttribute('layout')).toBe('horizontal');
    (options[1] as HTMLButtonElement).click();
    expect(callService).toHaveBeenCalledWith('fan', 'set_percentage', {
      entity_id: 'fan.bedroom',
      percentage: 25,
    });
    el.remove();
  });

  it('passes vertical layout to the speed selector for home tiles', async () => {
    const { el } = await renderFanCard(
      {
        type: 'custom:au-fan-card',
        entity: 'fan.bedroom',
        speed_control: 'button',
        variant: 'home',
      },
      {
        'fan.bedroom': makeEntity('fan.bedroom', 'on', {
          supported_features: 1,
          percentage: 50,
          percentage_step: 25,
        }),
      },
    );
    const selector = el.shadowRoot?.querySelector('au-fan-speed-selector');
    expect(selector?.getAttribute('layout')).toBe('vertical');
    el.remove();
  });

  it('passes horizontal layout to the speed selector', async () => {
    const { el } = await renderFanCard(
      {
        type: 'custom:au-fan-card',
        entity: 'fan.bedroom',
        speed_control: 'button',
        content_layout: 'horizontal',
      },
      {
        'fan.bedroom': makeEntity('fan.bedroom', 'on', {
          supported_features: 1,
          percentage: 50,
          percentage_step: 25,
        }),
      },
    );
    const selector = el.shadowRoot?.querySelector('au-fan-speed-selector');
    expect(selector?.getAttribute('layout')).toBe('horizontal');
    el.remove();
  });

  it('hides speed when show_speed is false', async () => {
    const { el } = await renderFanCard(
      {
        type: 'custom:au-fan-card',
        entity: 'fan.bedroom',
        show_speed: false,
      },
      {
        'fan.bedroom': makeEntity('fan.bedroom', 'on', {
          supported_features: 1,
          percentage: 40,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('au-light-slider')).toBeNull();
    expect(el.shadowRoot?.querySelector('.chip-row')).toBeNull();
    el.remove();
  });

  it('shows preset / oscillate / direction when supported', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderFanCard(
      {
        type: 'custom:au-fan-card',
        entity: 'fan.bedroom',
        show_speed: false,
      },
      {
        'fan.bedroom': makeEntity('fan.bedroom', 'on', {
          supported_features: 2 + 4 + 8,
          preset_modes: ['auto', 'sleep'],
          preset_mode: 'auto',
          oscillating: false,
          direction: 'forward',
        }),
      },
      callService,
    );
    const text = el.shadowRoot?.textContent ?? '';
    expect(text).toContain('auto');
    expect(text).toContain('sleep');
    const buttons = [
      ...(el.shadowRoot?.querySelectorAll('button.ctrl') ?? []),
    ] as HTMLButtonElement[];
    const sleep = buttons.find((b) => b.textContent?.trim() === 'sleep');
    sleep?.click();
    expect(callService).toHaveBeenCalledWith('fan', 'set_preset_mode', {
      entity_id: 'fan.bedroom',
      preset_mode: 'sleep',
    });
    el.remove();
  });

  it('toggles fan on tap', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderFanCard(
      { type: 'custom:au-fan-card', entity: 'fan.bedroom', show_speed: false },
      {
        'fan.bedroom': makeEntity('fan.bedroom', 'on', {
          friendly_name: 'Fan',
        }),
      },
      callService,
    );
    const card = el as AuFanCard & {
      _onAction: (ev: CustomEvent) => void;
    };
    card._onAction(new CustomEvent('action', { detail: { action: 'tap' } }));
    await el.updateComplete;
    expect(callService).toHaveBeenCalledWith('fan', 'turn_off', {
      entity_id: 'fan.bedroom',
    });
    el.remove();
  });
});
