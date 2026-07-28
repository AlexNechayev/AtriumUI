import { describe, it, expect } from 'vitest';
import '../../src/index';
import { AuSensorCard } from '../../src/card/sensor-card/au-sensor-card';
import { makeEntity, makeHass } from '../helpers';

async function renderSensorCard(
  config: Parameters<AuSensorCard['setConfig']>[0],
  states: Record<string, ReturnType<typeof makeEntity>>,
): Promise<AuSensorCard> {
  const el = document.createElement('au-sensor-card') as AuSensorCard;
  document.body.appendChild(el);
  el.setConfig(config);
  el.hass = makeHass(states);
  await el.updateComplete;
  return el;
}

describe('au-sensor-card', () => {
  it('requires entity and valid min/max', () => {
    const el = document.createElement('au-sensor-card') as AuSensorCard;
    expect(() =>
      el.setConfig({ type: 'custom:au-sensor-card', entity: '' }),
    ).toThrow(/entity/i);
    expect(() =>
      el.setConfig({
        type: 'custom:au-sensor-card',
        entity: 'sensor.t',
        min: 10,
        max: 5,
      }),
    ).toThrow(/min/);
  });

  it('renders numeric gauge and warning badge', async () => {
    const el = await renderSensorCard(
      {
        type: 'custom:au-sensor-card',
        entity: 'sensor.temp',
        min: 0,
        max: 40,
        severity: { warn: 28, critical: 35, direction: 'above' },
      },
      {
        'sensor.temp': makeEntity('sensor.temp', '30', {
          unit_of_measurement: '°C',
          friendly_name: 'Temp',
        }),
      },
    );
    expect(el.shadowRoot?.querySelector('.track')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.badge.warn')?.textContent).toContain(
      'Warning',
    );
    expect(el.getCardSize()).toBe(2);
    el.remove();
  });

  it('shows critical badge above critical threshold', async () => {
    const el = await renderSensorCard(
      {
        type: 'custom:au-sensor-card',
        entity: 'sensor.temp',
        severity: { warn: 28, critical: 35 },
      },
      { 'sensor.temp': makeEntity('sensor.temp', '36') },
    );
    expect(
      el.shadowRoot?.querySelector('.badge.critical')?.textContent,
    ).toContain('Critical');
    el.remove();
  });

  it('shows missing-entity error', async () => {
    const el = await renderSensorCard(
      { type: 'custom:au-sensor-card', entity: 'sensor.missing' },
      {},
    );
    expect(el.shadowRoot?.textContent).toMatch(/Entity not found/);
    el.remove();
  });
});
