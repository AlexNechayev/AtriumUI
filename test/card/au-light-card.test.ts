import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuLightCard } from '../../src/card/light-card/au-light-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

async function renderLightCard(
  config: Parameters<AuLightCard['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>>,
): Promise<AuLightCard> {
  const el = document.createElement('au-light-card') as AuLightCard;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass(states);
  await el.updateComplete;
  return el;
}

describe('au-light-card', () => {
  it('validates light domain', () => {
    const el = document.createElement('au-light-card') as AuLightCard;
    expect(() =>
      el.setConfig({ type: 'custom:au-light-card', entity: 'switch.k' }),
    ).toThrow(/light entity/i);
  });

  it('renders no controls for on/off only lights', async () => {
    const el = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.plug' },
      {
        'light.plug': makeEntity('light.plug', 'on', {
          supported_color_modes: ['onoff'],
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('.controls')).toBeNull();
    expect(el.getCardSize()).toBe(1);
    el.remove();
  });

  it('renders brightness and color temp sliders for CCT lights', async () => {
    const el = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.cct' },
      {
        'light.cct': makeEntity('light.cct', 'on', {
          supported_color_modes: ['color_temp'],
          color_mode: 'color_temp',
          color_temp_kelvin: 4000,
          min_color_temp_kelvin: 2200,
          max_color_temp_kelvin: 6500,
          brightness: 200,
        }),
      },
    );
    const sliders = el.shadowRoot?.querySelectorAll('au-light-slider');
    expect(sliders?.length).toBe(2);
    expect(el.getCardSize()).toBe(2);
    el.remove();
  });

  it('shows brightness % as secondary when on and brightness slider is enabled', async () => {
    const el = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.cct' },
      {
        'light.cct': makeEntity('light.cct', 'on', {
          supported_color_modes: ['color_temp'],
          color_mode: 'color_temp',
          color_temp_kelvin: 4000,
          min_color_temp_kelvin: 2200,
          max_color_temp_kelvin: 6500,
          brightness: 128,
        }),
      },
    );
    const lines = [...(el.shadowRoot?.querySelectorAll('.secondary') ?? [])].map(
      (n) => n.textContent,
    );
    expect(lines[0]).toBe('50%');
    expect(lines[1]).toBe('4000K');
    el.remove();
  });

  it('shows plain off state when light is off', async () => {
    const el = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.cct' },
      {
        'light.cct': makeEntity('light.cct', 'off', {
          supported_color_modes: ['color_temp'],
          min_color_temp_kelvin: 2200,
          max_color_temp_kelvin: 6500,
        }),
      },
    );
    expect(el.shadowRoot?.querySelectorAll('.secondary')).toHaveLength(1);
    expect(el.shadowRoot?.querySelector('.secondary')?.textContent).toBe('off');
    const card = el.shadowRoot?.querySelector('.au-card') as HTMLElement;
    expect(card.classList.contains('active')).toBe(false);
    const slider = el.shadowRoot?.querySelector(
      'au-light-slider',
    ) as HTMLElement & { value: number; min: number };
    expect(slider.min).toBe(0);
    expect(slider.value).toBe(0);
    el.remove();
  });

  it('marks CCT active when brightness >= 1', async () => {
    const el = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.cct' },
      {
        'light.cct': makeEntity('light.cct', 'on', {
          supported_color_modes: ['color_temp'],
          color_mode: 'color_temp',
          color_temp_kelvin: 4000,
          min_color_temp_kelvin: 2200,
          max_color_temp_kelvin: 6500,
          brightness: 50,
        }),
      },
    );
    const card = el.shadowRoot?.querySelector('.au-card') as HTMLElement;
    expect(card.classList.contains('active')).toBe(true);
    el.remove();
  });

  it('treats unknown + brightness as on and keeps header tappable', async () => {
    const el = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.cct' },
      {
        'light.cct': makeEntity('light.cct', 'unknown', {
          supported_color_modes: ['color_temp'],
          color_mode: 'color_temp',
          color_temp_kelvin: 4000,
          min_color_temp_kelvin: 2200,
          max_color_temp_kelvin: 6500,
          brightness: 128,
        }),
      },
    );
    const card = el.shadowRoot?.querySelector('.au-card') as HTMLElement;
    expect(card.classList.contains('active')).toBe(true);
    expect(card.classList.contains('unavailable')).toBe(false);
    const header = el.shadowRoot?.querySelector(
      '.header-action',
    ) as HTMLButtonElement;
    expect(header.disabled).toBe(false);
    expect(el.shadowRoot?.querySelector('.secondary')?.textContent).toBe('50%');
    el.remove();
  });

  it('disables header only when truly unavailable', async () => {
    const el = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.plug' },
      {
        'light.plug': makeEntity('light.plug', 'unavailable', {
          supported_color_modes: ['onoff'],
        }),
      },
    );
    const header = el.shadowRoot?.querySelector(
      '.header-action',
    ) as HTMLButtonElement;
    expect(header.disabled).toBe(true);
    expect(
      el.shadowRoot?.querySelector('.au-card')?.classList.contains('unavailable'),
    ).toBe(true);
    el.remove();
  });

  it('calls light.turn_off when brightness slider goes to 0', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const entity = makeEntity('light.dim', 'on', {
      supported_color_modes: ['brightness'],
      brightness: 100,
    });
    const el = document.createElement('au-light-card') as AuLightCard;
    document.body.appendChild(el);
    el.setConfig({ type: 'custom:au-light-card', entity: 'light.dim' });
    el.hass = makeHass({ 'light.dim': entity }, callService);
    await el.updateComplete;

    const slider = el.shadowRoot?.querySelector('au-light-slider') as HTMLElement;
    slider.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: 0 },
        bubbles: true,
        composed: true,
      }),
    );
    await Promise.resolve();

    expect(callService).toHaveBeenCalledWith('light', 'turn_off', {
      entity_id: 'light.dim',
    });
    el.remove();
  });

  it('keeps plain state when brightness slider is disabled', async () => {
    const el = await renderLightCard(
      {
        type: 'custom:au-light-card',
        entity: 'light.cct',
        show_brightness: false,
      },
      {
        'light.cct': makeEntity('light.cct', 'on', {
          supported_color_modes: ['color_temp'],
          color_mode: 'color_temp',
          color_temp_kelvin: 4000,
          min_color_temp_kelvin: 2200,
          max_color_temp_kelvin: 6500,
          brightness: 200,
        }),
      },
    );
    const lines = [...(el.shadowRoot?.querySelectorAll('.secondary') ?? [])].map(
      (n) => n.textContent,
    );
    expect(lines[0]).toBe('on');
    expect(lines[1]).toBe('4000K');
    el.remove();
  });

  it('stacks controls under the header row in horizontal layout', async () => {
    const el = await renderLightCard(
      {
        type: 'custom:au-light-card',
        entity: 'light.cct',
        content_layout: 'horizontal',
      },
      {
        'light.cct': makeEntity('light.cct', 'on', {
          supported_color_modes: ['color_temp'],
          color_mode: 'color_temp',
          color_temp_kelvin: 4000,
          min_color_temp_kelvin: 2200,
          max_color_temp_kelvin: 6500,
          brightness: 200,
        }),
      },
    );
    const card = el.shadowRoot?.querySelector('.au-card') as HTMLElement;
    expect(card.classList.contains('horizontal')).toBe(true);
    expect(card.classList.contains('has-controls')).toBe(true);
    const tileChildren = [...(card?.children ?? [])].map((c) => c.className);
    expect(tileChildren[0]).toMatch(/header-action/);
    expect(tileChildren[1]).toMatch(/controls/);
    expect(card.querySelector('.header-action .icon')).not.toBeNull();
    expect(card.querySelector('.header-action .text .primary')).not.toBeNull();
    el.remove();
  });

  it('centers the header stack in vertical layout', async () => {
    const el = await renderLightCard(
      {
        type: 'custom:au-light-card',
        entity: 'light.cct',
        content_layout: 'vertical',
      },
      {
        'light.cct': makeEntity('light.cct', 'on', {
          supported_color_modes: ['color_temp'],
          color_mode: 'color_temp',
          color_temp_kelvin: 3500,
          min_color_temp_kelvin: 2200,
          max_color_temp_kelvin: 6500,
          brightness: 128,
        }),
      },
    );
    const card = el.shadowRoot?.querySelector('.au-card') as HTMLElement;
    expect(card.classList.contains('vertical')).toBe(true);
    expect(card.querySelector('.header-action .icon')).not.toBeNull();
    expect(card.querySelector('.header-action .text .primary')).not.toBeNull();
    expect(card.querySelectorAll('.secondary')).toHaveLength(2);
    el.remove();
  });

  it('renders brightness and hue sliders for RGB lights', async () => {
    const el = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.rgb' },
      {
        'light.rgb': makeEntity('light.rgb', 'on', {
          supported_color_modes: ['hs'],
          color_mode: 'hs',
          hs_color: [200, 100],
          brightness: 180,
        }),
      },
    );
    const sliders = el.shadowRoot?.querySelectorAll('au-light-slider');
    expect(sliders?.length).toBe(2);
    expect((sliders?.[1] as import('../../src/components/au-light-slider').AuLightSlider).variant).toBe('hue');
    el.remove();
  });

  it('shows only one color slider for dual-mode lights based on color_mode', async () => {
    const cct = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.dual' },
      {
        'light.dual': makeEntity('light.dual', 'on', {
          supported_color_modes: ['color_temp', 'hs'],
          color_mode: 'color_temp',
          color_temp_kelvin: 3500,
          min_color_temp_kelvin: 2200,
          max_color_temp_kelvin: 6500,
          brightness: 200,
        }),
      },
    );
    expect(cct.shadowRoot?.querySelectorAll('au-light-slider')?.length).toBe(2);
    const cctSliders = cct.shadowRoot?.querySelectorAll('au-light-slider');
    expect(
      (cctSliders?.[1] as import('../../src/components/au-light-slider').AuLightSlider).variant,
    ).toBe('color_temp');
    cct.remove();

    const rgb = await renderLightCard(
      { type: 'custom:au-light-card', entity: 'light.dual' },
      {
        'light.dual': makeEntity('light.dual', 'on', {
          supported_color_modes: ['color_temp', 'hs'],
          color_mode: 'hs',
          hs_color: [60, 100],
          brightness: 200,
        }),
      },
    );
    const rgbSliders = rgb.shadowRoot?.querySelectorAll('au-light-slider');
    expect(
      (rgbSliders?.[1] as import('../../src/components/au-light-slider').AuLightSlider).variant,
    ).toBe('hue');
    rgb.remove();
  });

  it('hides brightness slider when show_brightness is false', async () => {
    const el = await renderLightCard(
      {
        type: 'custom:au-light-card',
        entity: 'light.dim',
        show_brightness: false,
      },
      {
        'light.dim': makeEntity('light.dim', 'on', {
          supported_color_modes: ['brightness'],
          brightness: 128,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('.controls')).toBeNull();
    el.remove();
  });

  it('places controls beside the header when content_layout is horizontal', async () => {
    const el = await renderLightCard(
      {
        type: 'custom:au-light-card',
        entity: 'light.dim',
        content_layout: 'horizontal',
      },
      {
        'light.dim': makeEntity('light.dim', 'on', {
          supported_color_modes: ['brightness'],
          brightness: 128,
        }),
      },
    );
    const tile = el.shadowRoot?.querySelector('.tile.horizontal.has-controls');
    expect(tile).not.toBeNull();
    expect(tile?.querySelector('.header-action')).not.toBeNull();
    expect(tile?.querySelector('.controls')).not.toBeNull();
    el.remove();
  });

  it('stacks controls below a vertical header when content_layout is vertical', async () => {
    const el = await renderLightCard(
      {
        type: 'custom:au-light-card',
        entity: 'light.dim',
        content_layout: 'vertical',
      },
      {
        'light.dim': makeEntity('light.dim', 'on', {
          supported_color_modes: ['brightness'],
          brightness: 128,
        }),
      },
    );
    const tile = el.shadowRoot?.querySelector('.tile.vertical.has-controls');
    expect(tile).not.toBeNull();
    el.remove();
  });

  it('applies compact class when the card container is narrow', async () => {
    const el = await renderLightCard(
      {
        type: 'custom:au-light-card',
        entity: 'light.dim',
        content_layout: 'horizontal',
      },
      {
        'light.dim': makeEntity('light.dim', 'on', {
          supported_color_modes: ['brightness'],
          brightness: 128,
        }),
      },
    );
    const card = el.shadowRoot?.querySelector('.au-card') as HTMLElement | undefined;
    expect(card).not.toBeNull();
    vi.spyOn(card!, 'getBoundingClientRect').mockReturnValue({
      width: 240,
      height: 120,
      top: 0,
      left: 0,
      right: 240,
      bottom: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    (el as unknown as { _observeCardSize: () => void })._observeCardSize();
    await el.updateComplete;
    expect((el as unknown as { _compact: boolean })._compact).toBe(true);
    expect(card?.classList.contains('compact')).toBe(true);
    el.remove();
  });

  it('calls light.turn_on when brightness slider changes', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const entity = makeEntity('light.dim', 'on', {
      supported_color_modes: ['brightness'],
      brightness: 100,
    });
    const el = document.createElement('au-light-card') as AuLightCard;
    document.body.appendChild(el);
    el.setConfig({ type: 'custom:au-light-card', entity: 'light.dim' });
    el.hass = makeHass({ 'light.dim': entity }, callService);
    await el.updateComplete;

    const slider = el.shadowRoot?.querySelector('au-light-slider') as HTMLElement & {
      dispatchEvent: (ev: Event) => boolean;
    };
    slider.dispatchEvent(
      new CustomEvent('value-changed', { detail: { value: 200 }, bubbles: true, composed: true }),
    );
    await Promise.resolve();

    expect(callService).toHaveBeenCalledWith('light', 'turn_on', {
      entity_id: 'light.dim',
      brightness: 200,
    });
    el.remove();
  });
});
