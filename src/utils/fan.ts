import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { getFanModeIcon } from './climate';
import { computeDomain, isEntityActive } from './entity';

/** Fan supported_features bit flags (HA). */
export const FAN_SUPPORT = {
  SET_SPEED: 1,
  OSCILLATE: 2,
  DIRECTION: 4,
  PRESET_MODE: 8,
  TURN_OFF: 16,
  TURN_ON: 32,
} as const;

const DEFAULT_PERCENTAGE_STEP = 25;

export interface FanCapabilities {
  canToggle: boolean;
  canSetPercentage: boolean;
  canOscillate: boolean;
  canSetDirection: boolean;
  canSetPresetMode: boolean;
  /** Step used for speed chips / slider granularity. */
  percentageStep: number;
  presetModes: string[];
}

export function validateFanEntity(entityId: string): void {
  if (computeDomain(entityId) !== 'fan') {
    throw new Error('AtriumUI Fan Card: entity must be a fan.* entity');
  }
}

export function getFanCapabilities(entity: HassEntity): FanCapabilities {
  const features =
    typeof entity.attributes.supported_features === 'number'
      ? entity.attributes.supported_features
      : 0;
  const presets = entity.attributes.preset_modes;
  const presetModes = Array.isArray(presets)
    ? presets.filter((p): p is string => typeof p === 'string')
    : [];
  const rawStep = entity.attributes.percentage_step;
  const percentageStep =
    typeof rawStep === 'number' && rawStep > 0 && rawStep <= 100
      ? rawStep
      : DEFAULT_PERCENTAGE_STEP;
  return {
    canToggle: true,
    canSetPercentage:
      (features & FAN_SUPPORT.SET_SPEED) !== 0 ||
      typeof entity.attributes.percentage === 'number',
    canOscillate: (features & FAN_SUPPORT.OSCILLATE) !== 0,
    canSetDirection: (features & FAN_SUPPORT.DIRECTION) !== 0,
    canSetPresetMode:
      (features & FAN_SUPPORT.PRESET_MODE) !== 0 || presetModes.length > 0,
    percentageStep,
    presetModes,
  };
}

export function getFanPercentage(entity: HassEntity): number {
  if (entity.state === 'off') return 0;
  const pct = entity.attributes.percentage;
  return typeof pct === 'number' ? pct : 100;
}

/** Discrete percentage levels for speed chips (includes 0 / Off). */
export function getFanSpeedLevels(entity: HassEntity): number[] {
  const step = getFanCapabilities(entity).percentageStep;
  const levels: number[] = [0];
  for (let p = step; p < 100; p += step) {
    levels.push(Math.min(100, Math.round(p)));
  }
  if (levels[levels.length - 1] !== 100) levels.push(100);
  return [...new Set(levels)];
}

export function formatFanSpeedLabel(percentage: number): string {
  return percentage <= 0 ? 'Off' : `${Math.round(percentage)}%`;
}

/**
 * Icon for a speed chip — same MDI set as climate fan modes
 * (`mdi:fan-off` / `mdi:fan-speed-1|2|3`).
 */
export function getFanSpeedIcon(
  percentage: number,
  levels: readonly number[],
): string {
  if (percentage <= 0) return getFanModeIcon('off');
  const nonzero = levels.filter((l) => l > 0);
  if (nonzero.length === 0) return getFanModeIcon('low');
  let nearest = nonzero[0]!;
  let bestDist = Math.abs(percentage - nearest);
  for (const level of nonzero) {
    const dist = Math.abs(percentage - level);
    if (dist < bestDist) {
      nearest = level;
      bestDist = dist;
    }
  }
  const idx = nonzero.indexOf(nearest);
  if (nonzero.length === 1) return getFanModeIcon('low');
  const t = idx / (nonzero.length - 1);
  const band = Math.round(t * 2); // 0 | 1 | 2 → low | medium | high
  if (band <= 0) return getFanModeIcon('low');
  if (band === 1) return getFanModeIcon('medium');
  return getFanModeIcon('high');
}

export function getFanPresetMode(entity: HassEntity): string | undefined {
  const mode = entity.attributes.preset_mode;
  return typeof mode === 'string' && mode.trim() ? mode : undefined;
}

export function isFanOscillating(entity: HassEntity): boolean {
  return entity.attributes.oscillating === true;
}

export function getFanDirection(entity: HassEntity): string {
  const direction = entity.attributes.direction;
  return typeof direction === 'string' && direction.trim()
    ? direction
    : 'forward';
}

export function formatFanSecondary(entity: HassEntity): string {
  if (entity.state === 'off') return 'off';
  const preset = getFanPresetMode(entity);
  const pct = entity.attributes.percentage;
  if (typeof pct === 'number' && preset) return `${pct}% · ${preset}`;
  if (typeof pct === 'number') return `${pct}%`;
  if (preset) return preset;
  return entity.state;
}

export async function setFanPercentage(
  hass: HomeAssistant,
  entityId: string,
  percentage: number,
): Promise<void> {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  if (clamped === 0) {
    await hass.callService('fan', 'turn_off', { entity_id: entityId });
    return;
  }
  await hass.callService('fan', 'set_percentage', {
    entity_id: entityId,
    percentage: clamped,
  });
}

export async function setFanPresetMode(
  hass: HomeAssistant,
  entityId: string,
  presetMode: string,
): Promise<void> {
  await hass.callService('fan', 'set_preset_mode', {
    entity_id: entityId,
    preset_mode: presetMode,
  });
}

export async function setFanOscillate(
  hass: HomeAssistant,
  entityId: string,
  oscillating: boolean,
): Promise<void> {
  await hass.callService('fan', 'oscillate', {
    entity_id: entityId,
    oscillating,
  });
}

export async function setFanDirection(
  hass: HomeAssistant,
  entityId: string,
  direction: string,
): Promise<void> {
  await hass.callService('fan', 'set_direction', {
    entity_id: entityId,
    direction,
  });
}

/** Primary on/off for fan tiles. */
export async function toggleFan(
  hass: HomeAssistant,
  entity: HassEntity,
  opts?: { currentlyOn?: boolean },
): Promise<void> {
  const on = opts?.currentlyOn ?? isEntityActive(entity);
  await hass.callService('fan', on ? 'turn_off' : 'turn_on', {
    entity_id: entity.entity_id,
  });
}
