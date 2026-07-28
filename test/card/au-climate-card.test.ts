import { describe, it, expect, vi } from 'vitest';
import '../../src/index';
import { AuClimateCard } from '../../src/card/climate-card/au-climate-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';
import {
  CLIMATE_SUPPORT_FAN_MODE,
  CLIMATE_SUPPORT_TARGET_TEMPERATURE,
} from '../../src/utils/climate';

registerActionHandlerMock();

async function renderClimateCard(
  config: Parameters<AuClimateCard['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>>,
): Promise<AuClimateCard> {
  const el = document.createElement('au-climate-card') as AuClimateCard;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass(states);
  await el.updateComplete;
  return el;
}

describe('au-climate-card', () => {
  it('validates climate domain', () => {
    const el = document.createElement('au-climate-card') as AuClimateCard;
    expect(() =>
      el.setConfig({ type: 'custom:au-climate-card', entity: 'light.k' }),
    ).toThrow(/climate entity/i);
  });

  it('renders HVAC chips and temp stepper for AC with target temp', async () => {
    const el = await renderClimateCard(
      { type: 'custom:au-climate-card', entity: 'climate.ac' },
      {
        'climate.ac': makeEntity('climate.ac', 'cool', {
          hvac_modes: ['off', 'cool', 'heat', 'dry', 'fan_only'],
          temperature: 24,
          current_temperature: 26,
          min_temp: 16,
          max_temp: 30,
          target_temp_step: 1,
          supported_features: CLIMATE_SUPPORT_TARGET_TEMPERATURE,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('au-climate-selectors')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('au-temp-stepper')).not.toBeNull();
    expect(el.getCardSize()).toBe(2);
    expect(el.shadowRoot?.textContent).toContain('26');
    el.remove();
  });

  it('hides temp stepper when show_temperature is false', async () => {
    const el = await renderClimateCard(
      {
        type: 'custom:au-climate-card',
        entity: 'climate.ac',
        show_temperature: false,
      },
      {
        'climate.ac': makeEntity('climate.ac', 'cool', {
          hvac_modes: ['off', 'cool'],
          temperature: 24,
          min_temp: 16,
          max_temp: 30,
          supported_features: CLIMATE_SUPPORT_TARGET_TEMPERATURE,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('au-temp-stepper')).toBeNull();
    el.remove();
  });

  it('renders fan chips when fan modes exist', async () => {
    const el = await renderClimateCard(
      { type: 'custom:au-climate-card', entity: 'climate.ac' },
      {
        'climate.ac': makeEntity('climate.ac', 'cool', {
          hvac_modes: ['off', 'cool'],
          fan_modes: ['auto', 'low', 'high'],
          fan_mode: 'auto',
          supported_features:
            CLIMATE_SUPPORT_FAN_MODE | CLIMATE_SUPPORT_TARGET_TEMPERATURE,
          temperature: 22,
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('au-climate-selectors')).not.toBeNull();
    const controls = el.shadowRoot?.querySelector('.controls');
    const children = [...(controls?.children ?? [])].map(
      (n) => n.tagName.toLowerCase() || n.className,
    );
    expect(children[0]).toBe('au-climate-selectors');
    expect(children[1]).toBe('au-temp-stepper');
    el.remove();
  });

  it('calls set_hvac_mode when a mode chip changes', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const entity = makeEntity('climate.ac', 'off', {
      hvac_modes: ['off', 'cool'],
    });
    const el = document.createElement('au-climate-card') as AuClimateCard;
    document.body.appendChild(el);
    el.setConfig({ type: 'custom:au-climate-card', entity: 'climate.ac' });
    el.hass = makeHass({ 'climate.ac': entity }, callService);
    await el.updateComplete;

    const selectors = el.shadowRoot?.querySelector('au-climate-selectors') as HTMLElement;
    selectors.dispatchEvent(
      new CustomEvent('hvac-changed', {
        detail: { value: 'cool' },
        bubbles: true,
        composed: true,
      }),
    );
    await Promise.resolve();

    expect(callService).toHaveBeenCalledWith('climate', 'set_hvac_mode', {
      entity_id: 'climate.ac',
      hvac_mode: 'cool',
    });
    el.remove();
  });

  it('calls set_temperature when stepper changes', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const entity = makeEntity('climate.ac', 'cool', {
      hvac_modes: ['off', 'cool'],
      temperature: 22,
      min_temp: 16,
      max_temp: 30,
      target_temp_step: 1,
      supported_features: CLIMATE_SUPPORT_TARGET_TEMPERATURE,
    });
    const el = document.createElement('au-climate-card') as AuClimateCard;
    document.body.appendChild(el);
    el.setConfig({ type: 'custom:au-climate-card', entity: 'climate.ac' });
    el.hass = makeHass({ 'climate.ac': entity }, callService);
    await el.updateComplete;

    const stepper = el.shadowRoot?.querySelector('au-temp-stepper') as HTMLElement;
    stepper.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: 24 },
        bubbles: true,
        composed: true,
      }),
    );
    await Promise.resolve();

    expect(callService).toHaveBeenCalledWith('climate', 'set_temperature', {
      entity_id: 'climate.ac',
      temperature: 24,
    });
    el.remove();
  });
});
