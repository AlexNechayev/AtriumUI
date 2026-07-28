import { describe, it, expect, vi } from 'vitest';
import {
  createDebounced,
  formatBrightnessLabel,
  formatColorTempLabel,
  getActiveColorControl,
  getLightBrightness,
  getLightCapabilities,
  getLightColorTemp,
  getLightHue,
  getSupportedColorModes,
  isLightOn,
  miredsToKelvin,
  rgbToHue,
  setLightBrightness,
  setLightColorTemp,
  setLightHue,
  toggleLight,
  rememberLightBrightness,
  resolveLightBrightnessForTurnOn,
  validateLightEntity,
} from '../../src/utils/light';
import { makeEntity, makeHass } from '../helpers';

describe('isLightOn', () => {
  it('is false when off', () => {
    expect(isLightOn(makeEntity('light.k', 'off'))).toBe(false);
  });

  it('is false when unavailable', () => {
    expect(isLightOn(makeEntity('light.k', 'unavailable'))).toBe(false);
  });

  it('is false for brightness-capable lights at brightness 0', () => {
    const entity = makeEntity('light.cct', 'on', {
      supported_color_modes: ['color_temp'],
      brightness: 0,
    });
    expect(isLightOn(entity)).toBe(false);
  });

  it('is true for brightness-capable lights when brightness >= 1', () => {
    const entity = makeEntity('light.cct', 'on', {
      supported_color_modes: ['color_temp'],
      brightness: 1,
    });
    expect(isLightOn(entity)).toBe(true);
  });

  it('is true for unknown + brightness (still controllable)', () => {
    const entity = makeEntity('light.cct', 'unknown', {
      supported_color_modes: ['color_temp'],
      brightness: 128,
    });
    expect(isLightOn(entity)).toBe(true);
  });

  it('is true for on/off lights when on or unknown', () => {
    expect(
      isLightOn(
        makeEntity('light.plug', 'on', { supported_color_modes: ['onoff'] }),
      ),
    ).toBe(true);
    expect(
      isLightOn(
        makeEntity('light.plug', 'unknown', { supported_color_modes: ['onoff'] }),
      ),
    ).toBe(true);
  });
});

describe('getLightCapabilities', () => {
  it('detects on/off only lights', () => {
    const entity = makeEntity('light.plug', 'on', {
      supported_color_modes: ['onoff'],
    });
    expect(getLightCapabilities(entity)).toEqual({
      supportsOnOff: true,
      supportsBrightness: false,
      supportsColorTemp: false,
      supportsRgb: false,
    });
  });

  it('detects dimmable lights', () => {
    const entity = makeEntity('light.dimmer', 'on', {
      supported_color_modes: ['brightness'],
      brightness: 128,
    });
    expect(getLightCapabilities(entity)).toMatchObject({
      supportsBrightness: true,
      supportsColorTemp: false,
      supportsRgb: false,
    });
  });

  it('detects CCT lights', () => {
    const entity = makeEntity('light.cct', 'on', {
      supported_color_modes: ['color_temp'],
      color_temp: 300,
      min_mireds: 153,
      max_mireds: 500,
    });
    expect(getLightCapabilities(entity)).toMatchObject({
      supportsBrightness: true,
      supportsColorTemp: true,
      supportsRgb: false,
    });
  });

  it('detects RGB lights', () => {
    const entity = makeEntity('light.rgb', 'on', {
      supported_color_modes: ['hs'],
      hs_color: [120, 100],
    });
    expect(getLightCapabilities(entity)).toMatchObject({
      supportsRgb: true,
    });
  });
});

describe('getActiveColorControl', () => {
  it('returns color_temp when color_mode is color_temp', () => {
    const entity = makeEntity('light.dual', 'on', {
      supported_color_modes: ['color_temp', 'hs'],
      color_mode: 'color_temp',
    });
    expect(getActiveColorControl(entity)).toBe('color_temp');
  });

  it('returns rgb when color_mode is hs', () => {
    const entity = makeEntity('light.dual', 'on', {
      supported_color_modes: ['color_temp', 'hs'],
      color_mode: 'hs',
    });
    expect(getActiveColorControl(entity)).toBe('rgb');
  });

  it('returns null for brightness-only mode', () => {
    const entity = makeEntity('light.dim', 'on', {
      supported_color_modes: ['brightness'],
      color_mode: 'brightness',
    });
    expect(getActiveColorControl(entity)).toBeNull();
  });
});

describe('value helpers', () => {
  it('reads brightness from entity', () => {
    expect(getLightBrightness(makeEntity('light.k', 'on', { brightness: 200 }))).toBe(200);
    expect(getLightBrightness(makeEntity('light.k', 'off'))).toBe(0);
  });

  it('reads color temp in kelvin from color_temp_kelvin', () => {
    const entity = makeEntity('light.k', 'on', {
      color_temp_kelvin: 4000,
      min_color_temp_kelvin: 2200,
      max_color_temp_kelvin: 6500,
    });
    expect(getLightColorTemp(entity)).toBe(4000);
  });

  it('reads color temp in kelvin from legacy mireds', () => {
    const entity = makeEntity('light.k', 'on', {
      color_temp: 250,
      min_mireds: 153,
      max_mireds: 500,
    });
    expect(getLightColorTemp(entity)).toBe(miredsToKelvin(250));
  });

  it('reads hue from hs_color', () => {
    expect(getLightHue(makeEntity('light.k', 'on', { hs_color: [180, 50] }))).toBe(180);
  });

  it('derives hue from rgb_color', () => {
    expect(rgbToHue(255, 0, 0)).toBe(0);
    expect(getLightHue(makeEntity('light.k', 'on', { rgb_color: [0, 255, 0] }))).toBe(120);
  });

  it('formats labels', () => {
    expect(formatBrightnessLabel(128)).toBe('50%');
    expect(formatColorTempLabel(4000)).toBe('4000K');
  });
});

describe('light service calls', () => {
  it('calls light.turn_on with brightness', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const entity = makeEntity('light.k', 'on', { brightness: 100 });
    await setLightBrightness(hass, entity, 'light.k', 180);
    expect(callService).toHaveBeenCalledWith('light', 'turn_on', {
      entity_id: 'light.k',
      brightness: 180,
    });
  });

  it('calls light.turn_off when brightness is 0', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const entity = makeEntity('light.k', 'on', {
      supported_color_modes: ['brightness'],
      brightness: 100,
    });
    await setLightBrightness(hass, entity, 'light.k', 0);
    expect(callService).toHaveBeenCalledWith('light', 'turn_off', {
      entity_id: 'light.k',
    });
    expect(resolveLightBrightnessForTurnOn(entity)).toBe(100);
  });

  it('includes remembered brightness when turning on from off (kelvin API)', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    rememberLightBrightness('light.k', 128);
    const entity = makeEntity('light.k', 'off', {
      min_color_temp_kelvin: 2200,
      max_color_temp_kelvin: 6500,
    });
    await setLightColorTemp(hass, entity, 'light.k', 4000);
    expect(callService).toHaveBeenCalledWith('light', 'turn_on', {
      entity_id: 'light.k',
      color_temp_kelvin: 4000,
      brightness: 128,
    });
  });

  it('uses legacy color_temp mireds for older entities', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const entity = makeEntity('light.k', 'on', {
      color_temp: 300,
      min_mireds: 153,
      max_mireds: 500,
    });
    await setLightColorTemp(hass, entity, 'light.k', miredsToKelvin(300));
    expect(callService).toHaveBeenCalledWith('light', 'turn_on', {
      entity_id: 'light.k',
      color_temp: 300,
    });
  });

  it('calls light.turn_on with hs_color', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const entity = makeEntity('light.k', 'on', { hs_color: [90, 80] });
    await setLightHue(hass, entity, 'light.k', 120);
    expect(callService).toHaveBeenCalledWith('light', 'turn_on', {
      entity_id: 'light.k',
      hs_color: [120, 80],
    });
  });
});

describe('toggleLight brightness memory', () => {
  it('turns off and remembers brightness, then restores it on turn on', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const onEntity = makeEntity('light.cct', 'on', {
      supported_color_modes: ['color_temp'],
      brightness: 77,
    });
    await toggleLight(hass, onEntity);
    expect(callService).toHaveBeenCalledWith('light', 'turn_off', {
      entity_id: 'light.cct',
    });
    expect(resolveLightBrightnessForTurnOn(onEntity)).toBe(77);

    callService.mockClear();
    const offEntity = makeEntity('light.cct', 'off', {
      supported_color_modes: ['color_temp'],
    });
    await toggleLight(hass, offEntity);
    expect(callService).toHaveBeenCalledWith('light', 'turn_on', {
      entity_id: 'light.cct',
      brightness: 77,
    });
  });

  it('remembers brightness from setLightBrightness', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = makeHass({}, callService);
    const entity = makeEntity('light.rgb', 'on', {
      supported_color_modes: ['hs'],
      brightness: 50,
    });
    await setLightBrightness(hass, entity, 'light.rgb', 200);
    expect(resolveLightBrightnessForTurnOn(entity)).toBe(200);
  });
});

describe('validateLightEntity', () => {
  it('accepts light entities', () => {
    expect(() => validateLightEntity('light.kitchen')).not.toThrow();
  });

  it('rejects non-light entities', () => {
    expect(() => validateLightEntity('switch.kitchen')).toThrow(/light entity/i);
  });
});

describe('createDebounced', () => {
  it('debounces calls', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = createDebounced(fn, 300);
    debounced(1);
    debounced(2);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith(2);
    debounced.cancel();
    vi.useRealTimers();
  });
});

describe('getSupportedColorModes fallback', () => {
  it('infers modes from attributes when supported_color_modes missing', () => {
    const entity = makeEntity('light.k', 'on', {
      color_temp: 300,
      rgb_color: [255, 0, 0],
    });
    const modes = getSupportedColorModes(entity);
    expect(modes).toContain('color_temp');
    expect(modes).toContain('hs');
  });
});
