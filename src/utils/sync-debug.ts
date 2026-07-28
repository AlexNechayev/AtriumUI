import { computeDomain, isEntityActive } from './entity';
import {
  entityFingerprint,
  getRootHass,
  pickFreshestEntity,
} from './hass-entity';
import { getLightBrightness, isLightOn } from './light';
import { isDeviceActive } from './device';
import { auDebug } from './debug';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';

/** Snapshot used when card `debug` logging is enabled. */
export interface EntitySyncSnapshot {
  entity_id: string;
  domain: string;
  state?: string;
  brightness?: number | null;
  last_updated?: string;
  entityActive: boolean;
  displayOn: boolean;
  deviceActive: boolean;
  localFp: string;
  rootFp: string;
  freshestFp: string;
  sameLocalRoot: boolean;
  assumed_state: boolean;
}

/**
 * Domain-aware “is on” for room chips / home counts — must match card display.
 * Lights use brightness-aware {@link isLightOn}; others use {@link isEntityActive}.
 */
export function entityDisplayOn(
  entity: HassEntity | undefined,
): boolean {
  if (!entity) return false;
  if (computeDomain(entity.entity_id) === 'light') return isLightOn(entity);
  return isEntityActive(entity);
}

export function captureEntitySync(
  hass: HomeAssistant | undefined,
  entityId: string,
): EntitySyncSnapshot {
  const id = entityId.trim().toLowerCase();
  const local = hass?.states[id];
  const root = getRootHass()?.states[id];
  const freshest = pickFreshestEntity(local, root);
  const domain = computeDomain(id);
  const bri =
    freshest && typeof freshest.attributes.brightness === 'number'
      ? freshest.attributes.brightness
      : freshest
        ? getLightBrightness(freshest)
        : null;

  return {
    entity_id: id,
    domain,
    state: freshest?.state,
    brightness: domain === 'light' ? bri : null,
    last_updated: freshest?.last_updated,
    entityActive: isEntityActive(freshest),
    displayOn: entityDisplayOn(freshest),
    deviceActive: freshest ? isDeviceActive(freshest) : false,
    localFp: entityFingerprint(local),
    rootFp: entityFingerprint(root),
    freshestFp: entityFingerprint(freshest),
    sameLocalRoot: local === root || (!local && !root),
    assumed_state: freshest?.attributes?.assumed_state === true,
  };
}

/** Log a sync snapshot when card `debug` is enabled. */
export function logEntitySync(
  enabled: boolean | undefined,
  scope: string,
  message: string,
  hass: HomeAssistant | undefined,
  entityId: string,
  extra?: Record<string, unknown>,
): void {
  if (!enabled) return;
  const snap = captureEntitySync(hass, entityId);
  auDebug(true, scope, message, extra ? { ...snap, ...extra } : snap);
}
