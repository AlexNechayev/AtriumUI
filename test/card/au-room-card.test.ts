import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuRoomCard } from '../../src/card/room-card/au-room-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function renderRoomCard(
  config: Parameters<AuRoomCard['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>> = {},
  callService = vi.fn().mockResolvedValue(undefined),
): Promise<{ el: AuRoomCard; callService: typeof callService }> {
  const el = document.createElement('au-room-card') as AuRoomCard;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass(states, callService);
  await el.updateComplete;
  return { el, callService };
}

describe('au-room-card', () => {
  it('stub config has no required entity', () => {
    const stub = AuRoomCard.getStubConfig();
    expect(stub.type).toBe('custom:au-room-card');
    expect(stub).not.toHaveProperty('entity');
    expect(Array.isArray(stub.entities)).toBe(true);

    const el = document.createElement('au-room-card') as AuRoomCard;
    expect(() => el.setConfig(stub)).not.toThrow();
    expect(() =>
      el.setConfig({ type: 'custom:au-room-card', name: 'Hall' }),
    ).not.toThrow();
  });

  it('chip click toggles via callService', async () => {
    const { el, callService } = await renderRoomCard(
      {
        type: 'custom:au-room-card',
        name: 'Living',
        entities: [{ entity: 'switch.lamp' }, { entity: 'light.ceiling' }],
      },
      {
        'switch.lamp': makeEntity('switch.lamp', 'on'),
        'light.ceiling': makeEntity('light.ceiling', 'off'),
      },
    );

    const chips = [
      ...(el.shadowRoot?.querySelectorAll('.chip') ?? []),
    ] as HTMLButtonElement[];
    expect(chips).toHaveLength(2);

    const switchChip = chips.find(
      (c) => c.dataset.entity === 'switch.lamp',
    )!;
    const lightChip = chips.find(
      (c) => c.dataset.entity === 'light.ceiling',
    )!;
    expect(switchChip).toBeDefined();
    expect(lightChip).toBeDefined();

    switchChip.click();
    expect(callService).toHaveBeenCalledWith('switch', 'turn_off', {
      entity_id: 'switch.lamp',
    });

    callService.mockClear();
    // Separate control — same-button click/touchend is intentionally debounced.
    lightChip.dispatchEvent(
      new TouchEvent('touchend', { bubbles: true, cancelable: true }),
    );
    expect(callService).toHaveBeenCalledWith('light', 'toggle', {
      entity_id: 'light.ceiling',
    });
    el.remove();
  });

  it('compact hides name', async () => {
    const { el } = await renderRoomCard(
      {
        type: 'custom:au-room-card',
        name: 'Living',
        compact: true,
        entities: [{ entity: 'switch.lamp' }],
      },
      { 'switch.lamp': makeEntity('switch.lamp', 'off') },
    );

    expect(el.shadowRoot?.querySelector('.room-card.compact')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.title')).toBeNull();
    expect(el.shadowRoot?.querySelector('.header')).toBeNull();
    expect(el.shadowRoot?.querySelectorAll('.chip')).toHaveLength(1);
    el.remove();
  });

  it('header_interactive fires au-room-header and subtitle renders', async () => {
    const { el } = await renderRoomCard(
      {
        type: 'custom:au-room-card',
        name: 'Living',
        subtitle: '2 on · 3',
        header_interactive: true,
        entities: [{ entity: 'switch.lamp' }],
      },
      { 'switch.lamp': makeEntity('switch.lamp', 'on') },
    );

    expect(el.shadowRoot?.querySelector('.subtitle')?.textContent?.trim()).toBe(
      '2 on · 3',
    );

    const header = el.shadowRoot?.querySelector(
      '.header-action.interactive',
    ) as HTMLButtonElement;
    expect(header).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.au-card.home-tile.room-card')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.icon ha-icon')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.primary')?.textContent?.trim()).toBe(
      'Living',
    );

    const headerPromise = new Promise<Event>((resolve) => {
      el.addEventListener('au-room-header', resolve, { once: true });
    });
    header.click();
    const ev = await headerPromise;
    expect(ev).toBeInstanceOf(CustomEvent);
    expect((ev as CustomEvent).bubbles).toBe(true);
    expect((ev as CustomEvent).composed).toBe(true);
    el.remove();
  });

  it('omits temperature preview when temperature_entity is unset', async () => {
    const { el } = await renderRoomCard(
      {
        type: 'custom:au-room-card',
        name: 'Master Bedroom',
        subtitle: '1 on · 2',
        entities: [{ entity: 'light.bed' }],
      },
      { 'light.bed': makeEntity('light.bed', 'on') },
    );

    expect(el.shadowRoot?.querySelector('.temperature-state')).toBeNull();
    expect(el.shadowRoot?.querySelector('.icon-row')).toBeNull();
    expect(
      el.shadowRoot?.querySelector('.header-action.has-temperature'),
    ).toBeNull();
    expect(el.shadowRoot?.querySelector('.primary')?.textContent?.trim()).toBe(
      'Master Bedroom',
    );
    el.remove();
  });

  it('shows formatted temperature beside the icon when configured', async () => {
    const { el } = await renderRoomCard(
      {
        type: 'custom:au-room-card',
        name: 'Master Bedroom',
        subtitle: '1 on · 2',
        temperature_entity: 'sensor.sonoff_temperature_sensor_temperature',
        entities: [{ entity: 'light.bed' }],
      },
      {
        'light.bed': makeEntity('light.bed', 'on'),
        'sensor.sonoff_temperature_sensor_temperature': makeEntity(
          'sensor.sonoff_temperature_sensor_temperature',
          '22.41',
          { unit_of_measurement: '°C' },
        ),
      },
    );

    const header = el.shadowRoot?.querySelector(
      '.header-action.has-temperature',
    );
    expect(header).not.toBeNull();
    const iconRow = header?.querySelector('.icon-row');
    expect(iconRow).not.toBeNull();
    expect(iconRow?.querySelector('.icon')).not.toBeNull();
    expect(
      iconRow?.querySelector('.temperature-state')?.textContent?.trim(),
    ).toBe('22.4°C');
    expect(header?.querySelector('.text .temperature-state')).toBeNull();
    expect(header?.querySelector('.primary')?.textContent?.trim()).toBe(
      'Master Bedroom',
    );
    expect(header?.querySelector('.subtitle')?.textContent?.trim()).toBe(
      '1 on · 2',
    );
    el.remove();
  });

  it('shows an em dash when the temperature sensor is missing or unavailable', async () => {
    const { el } = await renderRoomCard({
      type: 'custom:au-room-card',
      name: 'Master Bedroom',
      temperature_entity: 'sensor.missing_temp',
    });

    expect(
      el.shadowRoot?.querySelector('.header-action.has-temperature'),
    ).not.toBeNull();
    expect(
      el.shadowRoot?.querySelector('.temperature-state')?.textContent?.trim(),
    ).toBe('—');

    el.hass = makeHass({
      'sensor.missing_temp': makeEntity('sensor.missing_temp', 'unavailable'),
    });
    await el.updateComplete;
    expect(
      el.shadowRoot?.querySelector('.temperature-state')?.textContent?.trim(),
    ).toBe('—');
    el.remove();
  });

  it('updates the temperature when the watched sensor changes', async () => {
    const { el } = await renderRoomCard(
      {
        type: 'custom:au-room-card',
        name: 'Master Bedroom',
        temperature_entity: 'sensor.room_temp',
      },
      {
        'sensor.room_temp': makeEntity('sensor.room_temp', '18', {
          unit_of_measurement: '°C',
        }),
      },
    );

    expect(
      el.shadowRoot?.querySelector('.temperature-state')?.textContent?.trim(),
    ).toBe('18.0°C');

    el.hass = makeHass({
      'sensor.room_temp': makeEntity('sensor.room_temp', '19.2', {
        unit_of_measurement: '°C',
      }),
    });
    await el.updateComplete;
    expect(
      el.shadowRoot?.querySelector('.temperature-state')?.textContent?.trim(),
    ).toBe('19.2°C');
    el.remove();
  });

  it('styles temperature-state as secondary type aligned to the icon top', () => {
    const css = AuRoomCard.styles
      .map((sheet) => String(sheet))
      .join('\n');
    expect(css).toMatch(/\.icon-row\s*\{[^}]*align-items:\s*flex-start/);
    expect(css).toMatch(
      /\.temperature-state\s*\{[^}]*font-size:\s*var\(--au-font-secondary\)/,
    );
    expect(css).toMatch(/\.temperature-state\s*\{[^}]*font-weight:\s*500/);
    expect(css).not.toMatch(/\.temp\s*\{/);
  });

  it('rejects a temperature_entity without a domain', () => {
    const el = document.createElement('au-room-card') as AuRoomCard;
    expect(() =>
      el.setConfig({
        type: 'custom:au-room-card',
        temperature_entity: 'not-an-entity',
      }),
    ).toThrow(/temperature_entity/);
  });
});
