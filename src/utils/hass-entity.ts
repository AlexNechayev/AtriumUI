import type { HassEntity, HomeAssistant } from '../types/home-assistant';

/** Live HA app hass when running inside the Home Assistant frontend. */
export function getRootHass(): HomeAssistant | undefined {
  const el = document.querySelector('home-assistant') as
    | { hass?: HomeAssistant }
    | null;
  return el?.hass;
}

/** Compact fingerprint for change detection (incl. in-place mutation). */
export function entityFingerprint(entity: HassEntity | undefined): string {
  if (!entity) return '';
  return `${entity.state}|${entity.last_updated}|${String(entity.attributes.brightness ?? '')}`;
}

/**
 * Prefer the entity snapshot with the newer `last_updated`.
 * Used when imperatively-forwarded `hass` lags behind the root HA object.
 */
export function pickFreshestEntity(
  local: HassEntity | undefined,
  root: HassEntity | undefined,
): HassEntity | undefined {
  if (!local) return root;
  if (!root) return local;
  if (local === root) return local;
  if (root.last_updated > local.last_updated) return root;
  return local;
}
