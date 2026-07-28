import { describe, it, expect } from 'vitest';
import '../../src/index';
import { AuDeviceCard } from '../../src/card/device-card/au-device-card';
import { AuSwitchCard } from '../../src/card/switch-card/au-switch-card';
import { AuVacuumCard } from '../../src/card/vacuum-card/au-vacuum-card';
import { AuActionCard } from '../../src/card/action-card/au-action-card';
import { AuSensorCard } from '../../src/card/sensor-card/au-sensor-card';
import { makeEntity, makeHass, registerActionHandlerMock } from '../helpers';

registerActionHandlerMock();

describe('home variant tiles', () => {
  it('applies home-tile + domain classes when variant is home', async () => {
    const el = document.createElement('au-switch-card') as AuSwitchCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-switch-card',
      entity: 'switch.outlet',
      variant: 'home',
    });
    el.hass = makeHass({
      'switch.outlet': makeEntity('switch.outlet', 'on'),
    });
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector('.au-card');
    expect(card?.classList.contains('home-tile')).toBe(true);
    expect(card?.classList.contains('domain-switch')).toBe(true);
    expect(card?.classList.contains('active')).toBe(true);
    el.remove();
  });

  it('applies home-tile + domain-vacuum on vacuum card', async () => {
    const el = document.createElement('au-vacuum-card') as AuVacuumCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-vacuum-card',
      entity: 'vacuum.bot',
      variant: 'home',
      show_controls: true,
    });
    el.hass = makeHass({
      'vacuum.bot': makeEntity('vacuum.bot', 'cleaning', {
        supported_features: 8192,
      }),
    });
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector('.au-card');
    expect(card?.classList.contains('home-tile')).toBe(true);
    expect(card?.classList.contains('domain-vacuum')).toBe(true);
    el.remove();
  });

  it('applies home-tile + domain-input_boolean on device card', async () => {
    const el = document.createElement('au-device-card') as AuDeviceCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-device-card',
      entity: 'input_boolean.guest',
      variant: 'home',
    });
    el.hass = makeHass({
      'input_boolean.guest': makeEntity('input_boolean.guest', 'on'),
    });
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector('.au-card');
    expect(card?.classList.contains('home-tile')).toBe(true);
    expect(card?.classList.contains('domain-input_boolean')).toBe(true);
    el.remove();
  });

  it('keeps default chrome without home variant', async () => {
    const el = document.createElement('au-action-card') as AuActionCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'switch.outlet',
    });
    el.hass = makeHass({
      'switch.outlet': makeEntity('switch.outlet', 'off'),
    });
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector('.au-card');
    expect(card?.classList.contains('home-tile')).toBe(false);
    el.remove();
  });

  it('applies home-tile + domain-sensor when sensor variant is home', async () => {
    const el = document.createElement('au-sensor-card') as AuSensorCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-sensor-card',
      entity: 'sensor.temp',
      variant: 'home',
      min: 0,
      max: 40,
    });
    el.hass = makeHass({
      'sensor.temp': makeEntity('sensor.temp', '22.5', {
        unit_of_measurement: '°C',
        friendly_name: 'Temp',
      }),
    });
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector('.au-card');
    expect(card?.classList.contains('home-tile')).toBe(true);
    expect(card?.classList.contains('domain-sensor')).toBe(true);
    expect(card?.querySelector('.scale')).toBeNull();
    el.remove();
  });

  it('keeps classic sensor chrome without home variant', async () => {
    const el = document.createElement('au-sensor-card') as AuSensorCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-sensor-card',
      entity: 'sensor.temp',
      min: 0,
      max: 40,
    });
    el.hass = makeHass({
      'sensor.temp': makeEntity('sensor.temp', '22.5', {
        unit_of_measurement: '°C',
      }),
    });
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector('.au-card');
    expect(card?.classList.contains('home-tile')).toBe(false);
    expect(card?.querySelector('.scale')).not.toBeNull();
    el.remove();
  });

  it('applies horizontal class when home variant + content_layout horizontal', async () => {
    const el = document.createElement('au-action-card') as AuActionCard;
    document.body.appendChild(el);
    el.setConfig({
      type: 'custom:au-action-card',
      entity: 'switch.outlet',
      variant: 'home',
      content_layout: 'horizontal',
    });
    el.hass = makeHass({
      'switch.outlet': makeEntity('switch.outlet', 'off', {
        friendly_name: 'Living room lamp',
      }),
    });
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector('.au-card');
    expect(card?.classList.contains('home-tile')).toBe(true);
    expect(card?.classList.contains('horizontal')).toBe(true);
    expect(card?.classList.contains('vertical')).toBe(false);
    expect(card?.querySelector('.icon')).not.toBeNull();
    expect(card?.querySelector('.text .primary')?.textContent).toBe('Living room lamp');
    el.remove();
  });
});
