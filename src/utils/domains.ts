import type { AuDeviceDomain } from '../types/device';

/**
 * Single source for domain taxonomies used by device cards, toggles,
 * bulk-off, room strips, and editor entity selectors.
 */

/** Domains with first-class adaptive support in `au-device-card`. */
export const SUPPORTED_DEVICE_DOMAINS: ReadonlySet<string> = new Set<AuDeviceDomain>([
  'water_heater',
  'media_player',
  'humidifier',
  'input_boolean',
  'scene',
  'script',
  'remote',
  'automation',
]);

/** Ordered list form for HA entity selectors (device card editor). */
export const SUPPORTED_DEVICE_DOMAIN_LIST: readonly AuDeviceDomain[] = [
  'water_heater',
  'media_player',
  'humidifier',
  'input_boolean',
  'scene',
  'script',
  'remote',
  'automation',
];

/** Domains that support a meaningful toggle / on-off primary action. */
export const TOGGLEABLE_DOMAINS = [
  'light',
  'switch',
  'fan',
  'input_boolean',
  'automation',
  'remote',
  'humidifier',
  'media_player',
  'cover',
  'lock',
  'climate',
  'water_heater',
] as const;

/** Domains safe to include in room “all off” bulk actions. */
export const BULK_OFF_DOMAINS = new Set([
  'light',
  'switch',
  'fan',
  'input_boolean',
  'media_player',
  'humidifier',
  'remote',
]);

/**
 * Domains used for room-tile light/switch strips (narrower than
 * {@link TOGGLEABLE_DOMAINS}).
 */
export const ROOM_TOGGLE_DOMAINS = ['light', 'switch'] as const;

/** Entity picker domains for the standalone room card editor. */
export const ROOM_CARD_ENTITY_DOMAINS = [
  'light',
  'switch',
  'input_boolean',
  'fan',
] as const;
