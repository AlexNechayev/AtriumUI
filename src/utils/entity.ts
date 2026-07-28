import type { HassEntity } from '../types/home-assistant';
import { TOGGLEABLE_DOMAINS } from './domains';

export { TOGGLEABLE_DOMAINS } from './domains';

/**
 * States with no reliable reported value.
 * `unknown` ≠ offline — many covers/RF devices stay `unknown` but still accept
 * open/close (same as HA more-info).
 */
export const UNAVAILABLE_STATES = ['unavailable', 'unknown'] as const;

/** Extract the domain portion of an entity id, e.g. "light.kitchen" -> "light". */
export function computeDomain(entityId: string): string {
  const idx = entityId.indexOf('.');
  return idx === -1 ? entityId : entityId.slice(0, idx);
}

/** Best-effort display name for an entity. */
export function computeEntityName(entity: HassEntity | undefined): string {
  if (!entity) return 'Unknown';
  return entity.attributes.friendly_name ?? entity.entity_id;
}

/** Read entity brightness on the Home Assistant 0–255 scale. */
export function getEntityBrightness(entity: HassEntity): number {
  if (entity.state === 'off') return 0;
  const brightness = entity.attributes.brightness;
  if (typeof brightness === 'number') return brightness;
  return 255;
}

/** Format a 0–255 brightness value as a percentage string. */
export function formatBrightnessPercent(brightness: number): string {
  return `${Math.round((brightness / 255) * 100)}%`;
}

/**
 * True when state is `unavailable` or `unknown` (or entity missing).
 * Use for “no known on/off” styling — not for blocking service calls.
 */
export function isUnavailable(entity: HassEntity | undefined): boolean {
  return !entity || (UNAVAILABLE_STATES as readonly string[]).includes(entity.state);
}

/**
 * True when the entity is offline / missing. Service calls should be blocked.
 * Does **not** include `unknown` (assumed controllable, like HA more-info).
 */
export function isEntityOffline(entity: HassEntity | undefined): boolean {
  return !entity || entity.state === 'unavailable';
}

/**
 * Determine whether an entity is "active" (on) in a domain-aware way, mirroring
 * Home Assistant's own heuristics closely enough for tile styling.
 */
export function isEntityActive(entity: HassEntity | undefined): boolean {
  if (!entity || isUnavailable(entity)) return false;
  const domain = computeDomain(entity.entity_id);
  const state = entity.state;

  switch (domain) {
    case 'cover':
      return state === 'open' || state === 'opening';
    case 'lock':
      return state === 'unlocked';
    case 'device_tracker':
    case 'person':
      return state === 'home';
    case 'media_player':
      return state !== 'off' && state !== 'idle' && state !== 'standby';
    case 'binary_sensor':
    case 'light':
    case 'switch':
    case 'fan':
    case 'input_boolean':
    case 'automation':
    case 'remote':
    case 'humidifier':
    case 'climate':
    case 'water_heater':
      return state !== 'off';
    case 'vacuum':
      return state === 'cleaning' || state === 'on' || state === 'returning';
    default: {
      const num = Number(state);
      if (!Number.isNaN(num)) return num !== 0;
      return state !== 'off' && state !== 'closed' && state !== 'false';
    }
  }
}

/** True when the entity id's domain can be toggled by AtriumUI defaults. */
export function isToggleableDomain(entityId: string): boolean {
  return (TOGGLEABLE_DOMAINS as readonly string[]).includes(
    computeDomain(entityId),
  );
}

/**
 * True when hass has a live, toggleable entity for this id.
 * Missing / unavailable / non-toggleable → false (callers fall back to more-info).
 */
export function isToggleableEntity(
  hass: { states: Record<string, HassEntity> } | undefined,
  entityId: string,
): boolean {
  if (!hass || !entityId) return false;
  const entity = hass.states[entityId];
  // `unknown` stays toggleable — RF covers often never report open/closed.
  if (isEntityOffline(entity)) return false;
  return isToggleableDomain(entityId);
}

/**
 * The default toggle service for a domain. Falls back to the generic
 * `homeassistant.toggle` which works across most switchable domains.
 */
export function defaultToggleService(entityId: string): {
  domain: string;
  service: string;
} {
  const domain = computeDomain(entityId);
  if (isToggleableDomain(entityId)) {
    if (domain === 'cover') return { domain: 'cover', service: 'toggle' };
    if (domain === 'lock') return { domain: 'lock', service: 'unlock' };
    if (domain === 'climate' || domain === 'water_heater') {
      return { domain: 'homeassistant', service: 'toggle' };
    }
    return { domain, service: 'toggle' };
  }
  return { domain: 'homeassistant', service: 'toggle' };
}

/** Format a numeric-ish value with optional precision. */
export function formatNumericState(value: number, precision?: number): string {
  if (precision === undefined) {
    return `${Math.round(value * 100) / 100}`;
  }
  return value.toFixed(precision);
}
