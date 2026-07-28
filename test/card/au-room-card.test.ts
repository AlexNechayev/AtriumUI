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
});
