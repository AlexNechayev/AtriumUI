import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import type { AuHomeEntityConfig } from '../types/home';
import { SUPPORTED_DEVICE_DOMAINS } from './domains';
import { computeDomain, defaultToggleService, isEntityActive } from './entity';
import { getWaterHeaterCapabilities } from './water-heater';

export { SUPPORTED_DEVICE_DOMAINS } from './domains';

/** Domains that use dedicated AtriumUI cards inside the home template. */
export const DEDICATED_CARD_DOMAINS: Record<string, string> = {
  light: 'au-light-card',
  climate: 'au-climate-card',
  fan: 'au-fan-card',
  cover: 'au-cover-card',
  switch: 'au-switch-card',
  vacuum: 'au-vacuum-card',
  sensor: 'au-sensor-card',
  binary_sensor: 'au-sensor-card',
};

export function isSupportedDeviceDomain(domain: string): boolean {
  return SUPPORTED_DEVICE_DOMAINS.has(domain);
}

export function resolveCardTypeForEntity(
  entityId: string,
  override?: AuHomeEntityConfig['card_type'],
): string {
  if (override) return override;
  const domain = computeDomain(entityId);
  if (DEDICATED_CARD_DOMAINS[domain]) return DEDICATED_CARD_DOMAINS[domain];
  if (isSupportedDeviceDomain(domain)) return 'au-device-card';
  return 'au-action-card';
}

export interface DeviceCapabilities {
  domain: string;
  supported: boolean;
  canToggle: boolean;
  hasControls: boolean;
  secondaryHint?: string;
}

export function getDeviceCapabilities(entity: HassEntity): DeviceCapabilities {
  const domain = computeDomain(entity.entity_id);
  if (!isSupportedDeviceDomain(domain)) {
    return {
      domain,
      supported: false,
      canToggle: false,
      hasControls: false,
    };
  }

  switch (domain) {
    case 'water_heater': {
      const caps = getWaterHeaterCapabilities(entity);
      return {
        domain,
        supported: true,
        canToggle: caps.canToggle,
        // Temperature and/or off-timer count as controls.
        hasControls: caps.canSetTemperature || caps.canToggle,
        secondaryHint:
          typeof entity.attributes.temperature === 'number'
            ? `${entity.attributes.temperature}°`
            : entity.state === 'unknown' || entity.state === 'unavailable'
              ? undefined
              : entity.state,
      };
    }
    case 'scene':
    case 'script':
      return {
        domain,
        supported: true,
        canToggle: true,
        hasControls: false,
        secondaryHint: domain,
      };
    default:
      return {
        domain,
        supported: true,
        canToggle: true,
        hasControls: false,
        secondaryHint: entity.state,
      };
  }
}

/** Domain-aware “active” for device tiles. */
export function isDeviceActive(entity: HassEntity): boolean {
  const domain = computeDomain(entity.entity_id);
  if (domain === 'scene' || domain === 'script') return false;
  return isEntityActive(entity);
}

/**
 * Domains where primary tap uses explicit turn_on / turn_off (not domain.toggle).
 * Service-path helper for executeAction + device primary — display always comes
 * from hass.states. Includes `switch` even though switches use `au-switch-card`.
 */
const EXPLICIT_ON_OFF_DOMAINS = new Set([
  'switch',
  'input_boolean',
  'humidifier',
  'remote',
  'automation',
  'media_player',
]);

export function usesExplicitOnOff(entityId: string): boolean {
  return EXPLICIT_ON_OFF_DOMAINS.has(computeDomain(entityId));
}

/** Resolve a display name, optionally preferring a device registry name. */
export function resolveDeviceDisplayName(
  entity: HassEntity,
  override: string | undefined,
  hass: HomeAssistant | undefined,
  preferDeviceName: boolean,
): string {
  if (override?.trim()) return override.trim();
  if (preferDeviceName && hass?.devices && hass.entities) {
    const entry = hass.entities[entity.entity_id];
    const deviceId = entry?.device_id;
    if (deviceId && hass.devices[deviceId]?.name_by_user) {
      return hass.devices[deviceId]!.name_by_user!;
    }
    if (deviceId && hass.devices[deviceId]?.name) {
      return hass.devices[deviceId]!.name!;
    }
  }
  return entity.attributes.friendly_name ?? entity.entity_id;
}

/** Fire the default primary action for a supported device domain. */
export async function runPrimaryDeviceAction(
  hass: HomeAssistant,
  entity: HassEntity,
  opts?: { currentlyOn?: boolean },
): Promise<void> {
  const domain = computeDomain(entity.entity_id);
  const entityId = entity.entity_id;

  if (domain === 'scene') {
    await hass.callService('scene', 'turn_on', { entity_id: entityId });
    return;
  }
  if (domain === 'script') {
    await hass.callService('script', 'turn_on', { entity_id: entityId });
    return;
  }
  if (domain === 'water_heater') {
    const on = opts?.currentlyOn ?? isEntityActive(entity);
    if (on) {
      await hass.callService('water_heater', 'turn_off', { entity_id: entityId });
    } else {
      await hass.callService('water_heater', 'turn_on', { entity_id: entityId });
    }
    return;
  }

  // Explicit turn_on/off from live hass currentlyOn — avoids blind toggle.
  if (usesExplicitOnOff(entityId)) {
    const on = opts?.currentlyOn ?? isDeviceActive(entity);
    await hass.callService(domain, on ? 'turn_off' : 'turn_on', {
      entity_id: entityId,
    });
    return;
  }

  const { domain: svcDomain, service } = defaultToggleService(entityId);
  await hass.callService(svcDomain, service, { entity_id: entityId });
}

/** Stable slug for floor/room ids. */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || 'item';
}
