import {
  computeDomain,
  formatBrightnessPercent,
  getEntityBrightness,
  isEntityOffline,
} from './entity';
import type { LightColorMode } from '../types/light';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';

const RGB_MODES: readonly LightColorMode[] = ['rgb', 'rgbw', 'rgbww', 'hs', 'xy'];
const DEFAULT_MIN_MIREDS = 153;
const DEFAULT_MAX_MIREDS = 500;

export interface LightCapabilities {
  supportsOnOff: boolean;
  supportsBrightness: boolean;
  supportsColorTemp: boolean;
  supportsRgb: boolean;
}

export function getSupportedColorModes(entity: HassEntity): LightColorMode[] {
  const raw = entity.attributes.supported_color_modes;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.filter((m): m is LightColorMode => typeof m === 'string');
  }
  return inferColorModes(entity);
}

function inferColorModes(entity: HassEntity): LightColorMode[] {
  const modes: LightColorMode[] = [];
  if (
    entity.attributes.color_temp !== undefined ||
    entity.attributes.color_temp_kelvin !== undefined ||
    entity.attributes.min_mireds !== undefined ||
    entity.attributes.min_color_temp_kelvin !== undefined
  ) {
    modes.push('color_temp');
  }
  if (
    entity.attributes.rgb_color !== undefined ||
    entity.attributes.hs_color !== undefined ||
    entity.attributes.xy_color !== undefined
  ) {
    modes.push('hs');
  }
  if (entity.attributes.brightness !== undefined || entity.state !== 'off') {
    modes.push('brightness');
  }
  if (modes.length === 0) {
    modes.push('onoff');
  }
  return modes;
}

export function getLightCapabilities(entity: HassEntity): LightCapabilities {
  const modes = getSupportedColorModes(entity);
  const onoffOnly = modes.length === 1 && modes[0] === 'onoff';
  return {
    supportsOnOff: true,
    supportsBrightness: !onoffOnly && modes.some((m) => m !== 'onoff'),
    supportsColorTemp: modes.includes('color_temp'),
    supportsRgb: modes.some((m) => RGB_MODES.includes(m)),
  };
}

export function getActiveColorControl(entity: HassEntity): 'color_temp' | 'rgb' | null {
  const caps = getLightCapabilities(entity);
  const mode = entity.attributes.color_mode as LightColorMode | undefined;
  if (mode === 'color_temp' && caps.supportsColorTemp) return 'color_temp';
  if (mode && RGB_MODES.includes(mode) && caps.supportsRgb) return 'rgb';
  return null;
}

export function usesKelvinColorTemp(entity: HassEntity): boolean {
  return (
    typeof entity.attributes.min_color_temp_kelvin === 'number' ||
    typeof entity.attributes.color_temp_kelvin === 'number' ||
    entity.attributes.min_mireds === undefined
  );
}

/** Color temperature range in Kelvin (warm = min, cool = max). */
export function getColorTempRange(entity: HassEntity): { min: number; max: number } {
  const minK = entity.attributes.min_color_temp_kelvin;
  const maxK = entity.attributes.max_color_temp_kelvin;
  if (typeof minK === 'number' && typeof maxK === 'number') {
    return { min: minK, max: Math.max(minK + 1, maxK) };
  }

  const minMireds =
    typeof entity.attributes.min_mireds === 'number'
      ? entity.attributes.min_mireds
      : DEFAULT_MIN_MIREDS;
  const maxMireds =
    typeof entity.attributes.max_mireds === 'number'
      ? entity.attributes.max_mireds
      : DEFAULT_MAX_MIREDS;
  return {
    min: miredsToKelvin(maxMireds),
    max: miredsToKelvin(minMireds),
  };
}

export function getLightBrightness(entity: HassEntity): number {
  return getEntityBrightness(entity);
}

/**
 * Whether a light should render as on.
 * - Offline (`unavailable`) → off
 * - `state === 'off'` → off
 * - Brightness-capable: on iff reported brightness > 0 (0% = off).
 *   If state is on/unknown but brightness is missing, treat as on.
 * - On/off-only: on when not `off` (including `unknown`, which stays tappable)
 */
export function isLightOn(entity: HassEntity | undefined): boolean {
  if (!entity || entity.state === 'unavailable') return false;
  if (entity.state === 'off') return false;

  if (getLightCapabilities(entity).supportsBrightness) {
    const bri = entity.attributes.brightness;
    if (typeof bri === 'number') return bri > 0;
    return true;
  }
  return true;
}

export function kelvinToMireds(kelvin: number): number {
  return Math.round(1_000_000 / kelvin);
}

export function miredsToKelvin(mireds: number): number {
  return Math.round(1_000_000 / mireds);
}

export function getLightColorTemp(entity: HassEntity): number {
  const { min, max } = getColorTempRange(entity);
  const kelvin = entity.attributes.color_temp_kelvin;
  if (typeof kelvin === 'number') {
    return clamp(kelvin, min, max);
  }
  const mireds = entity.attributes.color_temp;
  if (typeof mireds === 'number') {
    return clamp(miredsToKelvin(mireds), min, max);
  }
  return Math.round((min + max) / 2);
}

export function rgbToHue(r: number, g: number, b: number): number {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue = 0;
  if (max === rn) {
    hue = ((gn - bn) / delta) % 6;
  } else if (max === gn) {
    hue = (bn - rn) / delta + 2;
  } else {
    hue = (rn - gn) / delta + 4;
  }
  hue *= 60;
  if (hue < 0) hue += 360;
  return Math.round(hue);
}

export function getLightHue(entity: HassEntity): number {
  const hs = entity.attributes.hs_color;
  if (Array.isArray(hs) && typeof hs[0] === 'number') {
    return clamp(Math.round(hs[0]), 0, 360);
  }
  const rgb = entity.attributes.rgb_color;
  if (Array.isArray(rgb) && rgb.length >= 3) {
    return rgbToHue(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]));
  }
  return 0;
}

export function getLightSaturation(entity: HassEntity): number {
  const hs = entity.attributes.hs_color;
  if (Array.isArray(hs) && typeof hs[1] === 'number') {
    return clamp(hs[1], 0, 100);
  }
  return 100;
}

export function formatBrightnessLabel(value: number): string {
  return formatBrightnessPercent(value);
}

export function formatColorTempLabel(kelvin: number): string {
  return `${Math.round(kelvin)}K`;
}

export function hasLightControls(entity: HassEntity): boolean {
  const caps = getLightCapabilities(entity);
  return caps.supportsBrightness;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** In-memory last non-zero brightness (0–255) for restore-on-turn-on (local UX). */
const lastBrightnessByEntity = new Map<string, number>();

/** Remember the last set brightness for a light (used when toggling back on). */
export function rememberLightBrightness(
  entityId: string,
  brightness: number,
): void {
  if (brightness > 0) {
    lastBrightnessByEntity.set(entityId, clamp(Math.round(brightness), 1, 255));
  }
}

/**
 * Brightness to restore when turning a dimmable light on.
 * Prefers in-memory last level, then HA attribute if still present while off.
 * Returns undefined so callers can omit brightness and let HA restore.
 */
export function resolveLightBrightnessForTurnOn(
  entity: HassEntity,
): number | undefined {
  const remembered = lastBrightnessByEntity.get(entity.entity_id);
  if (remembered && remembered > 0) return remembered;
  const attr = entity.attributes.brightness;
  if (typeof attr === 'number' && attr > 0) return clamp(attr, 1, 255);
  return undefined;
}

function turnOnPayload(
  entity: HassEntity,
  entityId: string,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = { entity_id: entityId, ...extra };
  if (
    entity.state === 'off' &&
    !('brightness' in extra) &&
    !('brightness_pct' in extra)
  ) {
    const brightness = resolveLightBrightnessForTurnOn(entity);
    if (brightness !== undefined) payload.brightness = brightness;
  }
  return payload;
}

/**
 * Toggle a dimmable light between off and its last brightness.
 * On → remember current level, turn_off. Off → turn_on at remembered %.
 * Pass `currentlyOn` when the UI knows better than a possibly-stale entity snapshot.
 */
export async function toggleLight(
  hass: HomeAssistant,
  entity: HassEntity,
  opts?: { currentlyOn?: boolean; rememberBrightness?: number },
): Promise<void> {
  if (isEntityOffline(entity)) return;
  const entityId = entity.entity_id;
  const on = opts?.currentlyOn ?? isLightOn(entity);

  if (on) {
    // Prefer UI-reported level — entity brightness is often stale on these devices.
    const current =
      typeof opts?.rememberBrightness === 'number' && opts.rememberBrightness > 0
        ? opts.rememberBrightness
        : typeof entity.attributes.brightness === 'number' &&
            entity.attributes.brightness > 0
          ? entity.attributes.brightness
          : getLightBrightness(entity);
    if (current > 0) rememberLightBrightness(entityId, current);
    await hass.callService('light', 'turn_off', { entity_id: entityId });
    return;
  }

  const brightness = resolveLightBrightnessForTurnOn(entity);
  await hass.callService('light', 'turn_on', {
    entity_id: entityId,
    ...(brightness !== undefined ? { brightness } : {}),
  });
}

export async function setLightBrightness(
  hass: HomeAssistant,
  entity: HassEntity,
  entityId: string,
  brightness: number,
): Promise<void> {
  const rounded = Math.round(brightness);
  if (rounded <= 0) {
    const current =
      typeof entity.attributes.brightness === 'number' &&
      entity.attributes.brightness > 0
        ? entity.attributes.brightness
        : getLightBrightness(entity);
    if (current > 0) rememberLightBrightness(entityId, current);
    await hass.callService('light', 'turn_off', { entity_id: entityId });
    return;
  }

  const next = clamp(rounded, 1, 255);
  rememberLightBrightness(entityId, next);
  await hass.callService(
    'light',
    'turn_on',
    turnOnPayload(entity, entityId, { brightness: next }),
  );
}

export async function setLightColorTemp(
  hass: HomeAssistant,
  entity: HassEntity,
  entityId: string,
  kelvin: number,
): Promise<void> {
  const { min, max } = getColorTempRange(entity);
  const clampedKelvin = clamp(Math.round(kelvin), min, max);
  const colorParam = usesKelvinColorTemp(entity)
    ? { color_temp_kelvin: clampedKelvin }
    : { color_temp: kelvinToMireds(clampedKelvin) };

  await hass.callService('light', 'turn_on', turnOnPayload(entity, entityId, colorParam));
}

export async function setLightHue(
  hass: HomeAssistant,
  entity: HassEntity,
  entityId: string,
  hue: number,
): Promise<void> {
  const saturation = getLightSaturation(entity);
  await hass.callService(
    'light',
    'turn_on',
    turnOnPayload(entity, entityId, {
      hs_color: [clamp(Math.round(hue), 0, 360), saturation],
    }),
  );
}

export { createDebounced } from './debounce';

export function validateLightEntity(entityId: string): void {
  if (!entityId.includes('.')) {
    throw new Error('AtriumUI Light Card: "entity" must be a valid entity id');
  }
  if (computeDomain(entityId) !== 'light') {
    throw new Error('AtriumUI Light Card: "entity" must be a light entity');
  }
}

