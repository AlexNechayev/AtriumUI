import { fireEvent } from './fire-event';
import {
  computeDomain,
  defaultToggleService,
  isEntityActive,
  isToggleableEntity,
} from './entity';
import { getLightCapabilities, isLightOn, toggleLight } from './light';
import { usesExplicitOnOff } from './device';
import type { ActionConfig } from '../types/action';
import type { HomeAssistant } from '../types/home-assistant';

export type ActionKind = 'tap' | 'hold' | 'double_tap';

/** Domains AtriumUI may invoke via call-service / toggle. */
export const ALLOWED_SERVICE_DOMAINS = new Set([
  'homeassistant',
  'light',
  'switch',
  'climate',
  'cover',
  'fan',
  'vacuum',
  'media_player',
  'water_heater',
  'input_boolean',
  'input_number',
  'input_select',
  'scene',
  'script',
  'button',
  'lock',
  'humidifier',
  'remote',
  'automation',
  'number',
  'select',
]);

/** Explicitly blocked homeassistant.* services (never allow from YAML actions). */
const BLOCKED_HOMEASSISTANT_SERVICES = new Set([
  'restart',
  'stop',
  'check_config',
  'reload_all',
  'reload_core_config',
  'reload_config_entry',
  'reload_custom_themes',
  'set_location',
]);

/** Default tap action when `tap_action` is omitted. */
export function defaultTapAction(entityId: string): ActionConfig {
  return { action: 'toggle', entity: entityId };
}

/** Default hold action when `hold_action` is omitted. */
export function defaultHoldAction(entityId: string): ActionConfig {
  return { action: 'more-info', entity: entityId };
}

/** Default double-tap action when `double_tap_action` is omitted (HA default). */
export function defaultDoubleTapAction(entityId: string): ActionConfig {
  return { action: 'more-info', entity: entityId };
}

/** Resolve an action config, falling back to AtriumUI / HA defaults for the card entity. */
export function resolveAction(
  config: ActionConfig | undefined,
  entityId: string,
  kind: ActionKind,
): ActionConfig {
  if (config) return config;
  if (kind === 'tap') return defaultTapAction(entityId);
  if (kind === 'double_tap') return defaultDoubleTapAction(entityId);
  return defaultHoldAction(entityId);
}

function actionEntity(action: ActionConfig, fallbackEntityId: string): string {
  return action.entity ?? fallbackEntityId;
}

function fireMoreInfo(
  host: HTMLElement,
  action: ActionConfig,
  fallbackEntityId: string,
): void {
  fireEvent(host, 'hass-more-info', {
    entityId: actionEntity(action, fallbackEntityId),
  });
}

/** True when domain.service is allowed for production HA-card defense-in-depth. */
export function isAllowedServiceCall(service: string): boolean {
  const [domain, svc] = service.split('.', 2);
  if (!domain || !svc) return false;
  if (!/^[a-z0-9_]+$/i.test(domain) || !/^[a-z0-9_]+$/i.test(svc)) return false;
  if (!ALLOWED_SERVICE_DOMAINS.has(domain)) return false;
  if (domain === 'homeassistant' && BLOCKED_HOMEASSISTANT_SERVICES.has(svc)) {
    return false;
  }
  // Only allow a narrow homeassistant surface (toggle / turn_on / turn_off / update_entity).
  if (domain === 'homeassistant') {
    return (
      svc === 'toggle' ||
      svc === 'turn_on' ||
      svc === 'turn_off' ||
      svc === 'update_entity'
    );
  }
  return true;
}

/** Allow only http(s) URLs for `url` actions. */
export function isSafeActionUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Allow only in-app HA paths (leading `/`, not protocol-relative). */
export function isSafeNavigatePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}

/**
 * Execute a Home Assistant Lovelace action from a custom card.
 * Supports the subset of actions AtriumUI cards rely on.
 * Toggle falls back to more-info when the entity is missing, unavailable, or not toggleable.
 */
export async function executeAction(
  host: HTMLElement,
  hass: HomeAssistant | undefined,
  action: ActionConfig,
  fallbackEntityId: string,
): Promise<void> {
  if (!hass) return;

  switch (action.action) {
    case 'none':
      return;

    case 'more-info':
      fireMoreInfo(host, action, fallbackEntityId);
      return;

    case 'toggle': {
      const entityId = actionEntity(action, fallbackEntityId);
      if (!isToggleableEntity(hass, entityId)) {
        fireMoreInfo(host, { action: 'more-info', entity: entityId }, entityId);
        return;
      }
      const entity = hass.states[entityId];
      // Dimmable / CCT / RGB: restore last brightness % instead of generic toggle.
      if (
        entity &&
        computeDomain(entityId) === 'light' &&
        getLightCapabilities(entity).supportsBrightness
      ) {
        const currentlyOn = isLightOn(entity);
        await toggleLight(hass, entity, { currentlyOn });
        return;
      }
      // Explicit turn_on/off — switch.toggle follows stale hass and can no-op
      // on non-reporting devices that never leave the last state.
      if (entity && usesExplicitOnOff(entityId)) {
        const domain = computeDomain(entityId);
        const currentlyOn = isEntityActive(entity);
        const service = currentlyOn ? 'turn_off' : 'turn_on';
        if (!isAllowedServiceCall(`${domain}.${service}`)) return;
        await hass.callService(domain, service, {
          entity_id: entityId,
          ...(action.service_data ?? {}),
        });
        void hass.callService('homeassistant', 'update_entity', {
          entity_id: entityId,
        });
        return;
      }
      const { domain, service } = defaultToggleService(entityId);
      if (!isAllowedServiceCall(`${domain}.${service}`)) return;
      await hass.callService(domain, service, {
        entity_id: entityId,
        ...(action.service_data ?? {}),
      });
      return;
    }

    case 'call-service': {
      const service = action.service;
      if (!service || !isAllowedServiceCall(service)) return;
      const [domain, svc] = service.split('.', 2);
      if (!domain || !svc) return;
      await hass.callService(domain, svc, action.service_data ?? {});
      return;
    }

    case 'perform-action': {
      // perform_action is HA frontend plumbing — not allowlisted for custom cards.
      return;
    }

    case 'navigate': {
      const path = action.navigation_path;
      if (!path || !isSafeNavigatePath(path)) return;
      fireEvent(window, 'location-changed', { replace: false, path });
      return;
    }

    case 'url': {
      const url = action.url_path;
      if (!url || !isSafeActionUrl(url)) return;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    case 'assist':
      // Assist requires HA frontend integration; no-op in standalone context.
      return;
  }
}
