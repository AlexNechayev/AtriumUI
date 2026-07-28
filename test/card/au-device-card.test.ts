import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuDeviceCard } from '../../src/card/device-card/au-device-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function renderDeviceCard(
  config: Parameters<AuDeviceCard['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>>,
  callService = vi.fn().mockResolvedValue(undefined),
): Promise<{ el: AuDeviceCard; callService: typeof callService }> {
  const el = document.createElement('au-device-card') as AuDeviceCard;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass(states, callService);
  await el.updateComplete;
  return { el, callService };
}

describe('au-device-card', () => {
  it('requires entity', () => {
    const el = document.createElement('au-device-card') as AuDeviceCard;
    expect(() =>
      el.setConfig({ type: 'custom:au-device-card' } as never),
    ).toThrow(/entity/i);
  });

  it('shows error for unsupported domain', async () => {
    const { el } = await renderDeviceCard(
      { type: 'custom:au-device-card', entity: 'camera.front' },
      { 'camera.front': makeEntity('camera.front', 'idle') },
    );
    expect(el.shadowRoot?.textContent).toMatch(/unsupported/i);
    el.remove();
  });

  it('shows error for fan/cover/switch/vacuum (use dedicated cards)', async () => {
    for (const entity of [
      'fan.bedroom',
      'cover.blinds',
      'switch.outlet',
      'vacuum.bot',
    ] as const) {
      const { el } = await renderDeviceCard(
        { type: 'custom:au-device-card', entity },
        { [entity]: makeEntity(entity, 'on') },
      );
      expect(el.shadowRoot?.textContent).toMatch(/unsupported/i);
      el.remove();
    }
  });

  it('renders input_boolean tile as active', async () => {
    const { el } = await renderDeviceCard(
      { type: 'custom:au-device-card', entity: 'input_boolean.guest' },
      {
        'input_boolean.guest': makeEntity('input_boolean.guest', 'on', {
          friendly_name: 'Guest mode',
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('.tile.active')).not.toBeNull();
    expect(el.shadowRoot?.textContent).toContain('Guest mode');
    el.remove();
  });

  it('toggles input_boolean with turn_off from live hass state', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderDeviceCard(
      { type: 'custom:au-device-card', entity: 'input_boolean.guest' },
      {
        'input_boolean.guest': makeEntity('input_boolean.guest', 'on', {
          friendly_name: 'Guest mode',
        }),
      },
      callService,
    );

    const card = el as AuDeviceCard & {
      _onAction: (ev: CustomEvent) => void;
    };
    card._onAction(new CustomEvent('action', { detail: { action: 'tap' } }));
    await el.updateComplete;

    expect(callService).toHaveBeenCalledWith('input_boolean', 'turn_off', {
      entity_id: 'input_boolean.guest',
    });
    expect(el.shadowRoot?.querySelector('.tile.active')).not.toBeNull();

    el.hass = makeHass(
      {
        'input_boolean.guest': makeEntity('input_boolean.guest', 'off', {
          friendly_name: 'Guest mode',
        }),
      },
      callService,
    );
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.tile.active')).toBeNull();
    el.remove();
  });

  it('shows water heater timer even when show_controls is false', async () => {
    const { el } = await renderDeviceCard(
      {
        type: 'custom:au-device-card',
        entity: 'water_heater.tank',
        show_controls: false,
        show_timer: true,
        timer_presets: [15, 30],
      },
      {
        'water_heater.tank': makeEntity('water_heater.tank', 'on', {
          temperature: 50,
        }),
      },
    );
    expect(el.shadowRoot?.querySelectorAll('.timer-start').length).toBe(2);
    expect(el.shadowRoot?.querySelector('.slider-wrap')).toBeNull();
    el.remove();
  });

  it('offers multiple water heater timer presets and turns off when elapsed', async () => {
    vi.useFakeTimers();
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderDeviceCard(
      {
        type: 'custom:au-device-card',
        entity: 'water_heater.tank',
        show_controls: true,
        show_timer: true,
        timer_presets: [1, 15, 30],
      },
      {
        'water_heater.tank': makeEntity('water_heater.tank', 'on', {
          temperature: 50,
          min_temp: 30,
          max_temp: 70,
        }),
      },
      callService,
    );
    const starts = [
      ...(el.shadowRoot?.querySelectorAll('.timer-start') ?? []),
    ] as HTMLButtonElement[];
    expect(starts.length).toBe(3);
    expect(starts.map((b) => b.textContent?.replace(/\s+/g, ' ').trim())).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/1/),
        expect.stringMatching(/15/),
        expect.stringMatching(/30/),
      ]),
    );
    starts[0]!.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.timer-remaining')).not.toBeNull();

    await vi.advanceTimersByTimeAsync(60_000);
    await el.updateComplete;
    expect(callService).toHaveBeenCalledWith('water_heater', 'turn_off', {
      entity_id: 'water_heater.tank',
    });
    el.remove();
    vi.useRealTimers();
  });

  it('requires confirmation when enabled', async () => {
    vi.useFakeTimers();
    const callService = vi.fn().mockResolvedValue(undefined);
    const { el } = await renderDeviceCard(
      {
        type: 'custom:au-device-card',
        entity: 'input_boolean.guest',
        confirm_actions: true,
      },
      { 'input_boolean.guest': makeEntity('input_boolean.guest', 'off') },
      callService,
    );
    const card = el as AuDeviceCard & {
      _onClick: (ev: Event) => void;
    };
    card._onClick(new Event('click'));
    await vi.advanceTimersByTimeAsync(300);
    await el.updateComplete;
    expect(callService).not.toHaveBeenCalled();
    expect(el.shadowRoot?.querySelector('.confirm-bar')).not.toBeNull();
    el.remove();
    vi.useRealTimers();
  });

  it('exposes editor and stub config', () => {
    expect(AuDeviceCard.getStubConfig().type).toBe('custom:au-device-card');
    expect(AuDeviceCard.getConfigElement().tagName.toLowerCase()).toBe(
      'au-device-card-editor',
    );
  });
});
