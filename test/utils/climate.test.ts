import { describe, it, expect, vi } from 'vitest';
import {
  CLIMATE_SUPPORT_FAN_MODE,
  CLIMATE_SUPPORT_TARGET_TEMPERATURE,
  formatFanModeLabel,
  formatHvacModeLabel,
  formatTemperature,
  getClimateCapabilities,
  getCurrentTemperature,
  getFanMode,
  getFanModeIcon,
  getHvacMode,
  getHvacModeIcon,
  getTargetTemperature,
  hasClimateControls,
  setFanMode,
  setHvacMode,
  setTargetTemperature,
  validateClimateEntity,
} from '../../src/utils/climate';
import { makeEntity, makeHass } from '../helpers';

describe('getClimateCapabilities', () => {
  it('detects AC basic with target temp from attributes', () => {
    const entity = makeEntity('climate.ac', 'cool', {
      hvac_modes: ['off', 'cool', 'heat', 'dry', 'fan_only'],
      temperature: 24,
      min_temp: 16,
      max_temp: 30,
      target_temp_step: 1,
    });
    expect(getClimateCapabilities(entity)).toMatchObject({
      supportsTargetTemp: true,
      supportsFanMode: false,
      hvacModes: ['off', 'cool', 'heat', 'dry', 'fan_only'],
      minTemp: 16,
      maxTemp: 30,
      step: 1,
    });
  });

  it('detects fan modes when listed', () => {
    const entity = makeEntity('climate.ac', 'cool', {
      hvac_modes: ['off', 'cool'],
      fan_modes: ['auto', 'low', 'high'],
      fan_mode: 'auto',
      supported_features: CLIMATE_SUPPORT_FAN_MODE | CLIMATE_SUPPORT_TARGET_TEMPERATURE,
      temperature: 22,
    });
    const caps = getClimateCapabilities(entity);
    expect(caps.supportsFanMode).toBe(true);
    expect(caps.fanModes).toEqual(['auto', 'low', 'high']);
    expect(caps.supportsTargetTemp).toBe(true);
  });

  it('handles cool-only without temperature', () => {
    const entity = makeEntity('climate.plug', 'off', {
      hvac_modes: ['off', 'cool'],
    });
    const caps = getClimateCapabilities(entity);
    expect(caps.supportsTargetTemp).toBe(false);
    expect(caps.hvacModes).toEqual(['off', 'cool']);
  });
});

describe('value helpers', () => {
  it('reads temperatures and modes', () => {
    const entity = makeEntity('climate.ac', 'cool', {
      current_temperature: 26.5,
      temperature: 24,
      fan_mode: 'low',
      hvac_action: 'cooling',
    });
    expect(getCurrentTemperature(entity)).toBe(26.5);
    expect(getTargetTemperature(entity)).toBe(24);
    expect(getHvacMode(entity)).toBe('cool');
    expect(getFanMode(entity)).toBe('low');
  });

  it('formats temperature and HVAC labels', () => {
    expect(formatTemperature(24, '°C')).toBe('24°C');
    expect(formatTemperature(72.5, '°F')).toBe('72.5°F');
    expect(formatHvacModeLabel('fan_only')).toBe('Fan Only');
    expect(formatHvacModeLabel('heat_cool')).toBe('Auto');
    expect(formatFanModeLabel('fan_only')).toBe('Fan Only');
  });

  it('maps HVAC and fan modes to MDI icons', () => {
    expect(getHvacModeIcon('cool')).toBe('mdi:snowflake');
    expect(getHvacModeIcon('heat')).toBe('mdi:fire');
    expect(getHvacModeIcon('heat_cool')).toBe('mdi:autorenew');
    expect(getHvacModeIcon('unknown')).toBe('mdi:thermostat');
    expect(getFanModeIcon('auto')).toBe('mdi:fan-auto');
    expect(getFanModeIcon('LOW')).toBe('mdi:fan-speed-1');
    expect(getFanModeIcon('high')).toBe('mdi:fan-speed-3');
    expect(getFanModeIcon('3')).toBe('mdi:fan-speed-2');
    expect(getFanModeIcon('boost')).toBe('mdi:fan');
  });

  it('reports controls when modes or temp exist', () => {
    expect(
      hasClimateControls(
        makeEntity('climate.ac', 'cool', { hvac_modes: ['off', 'cool'] }),
      ),
    ).toBe(true);
    expect(
      hasClimateControls(makeEntity('climate.ac', 'off', { hvac_modes: ['off'] })),
    ).toBe(false);
  });
});

describe('climate services', () => {
  it('calls set_hvac_mode', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    await setHvacMode(hass, 'climate.ac', 'cool');
    expect(callService).toHaveBeenCalledWith('climate', 'set_hvac_mode', {
      entity_id: 'climate.ac',
      hvac_mode: 'cool',
    });
  });

  it('calls set_temperature clamped to range', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const entity = makeEntity('climate.ac', 'cool', {
      min_temp: 16,
      max_temp: 30,
      target_temp_step: 1,
      temperature: 24,
      supported_features: CLIMATE_SUPPORT_TARGET_TEMPERATURE,
    });
    await setTargetTemperature(hass, entity, 'climate.ac', 40);
    expect(callService).toHaveBeenCalledWith('climate', 'set_temperature', {
      entity_id: 'climate.ac',
      temperature: 30,
    });
  });

  it('calls set_fan_mode', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    await setFanMode(hass, 'climate.ac', 'high');
    expect(callService).toHaveBeenCalledWith('climate', 'set_fan_mode', {
      entity_id: 'climate.ac',
      fan_mode: 'high',
    });
  });
});

describe('validateClimateEntity', () => {
  it('accepts climate entities', () => {
    expect(() => validateClimateEntity('climate.living_room')).not.toThrow();
  });

  it('rejects non-climate entities', () => {
    expect(() => validateClimateEntity('light.kitchen')).toThrow(/climate entity/i);
  });
});
