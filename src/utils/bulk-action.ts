import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { BULK_OFF_DOMAINS } from './domains';
import { computeDomain, isEntityActive, isUnavailable } from './entity';

export { BULK_OFF_DOMAINS } from './domains';

export interface BulkOffResult {
  attempted: string[];
  skipped: string[];
}

/** Collect entity ids that are currently active and safe to turn off. */
export function collectBulkOffTargets(
  entityIds: string[],
  states: Record<string, HassEntity>,
): string[] {
  return entityIds.filter((id) => {
    const entity = states[id];
    if (!entity || isUnavailable(entity)) return false;
    if (!BULK_OFF_DOMAINS.has(computeDomain(id))) return false;
    return isEntityActive(entity);
  });
}

/**
 * Turn off every active bulk-safe entity in the list.
 * Uses domain-specific turn_off where available.
 */
export async function bulkTurnOff(
  hass: HomeAssistant,
  entityIds: string[],
): Promise<BulkOffResult> {
  const targets = collectBulkOffTargets(entityIds, hass.states);
  const skipped = entityIds.filter((id) => !targets.includes(id));

  await Promise.all(
    targets.map(async (entityId) => {
      const domain = computeDomain(entityId);
      if (domain === 'media_player') {
        await hass.callService('media_player', 'turn_off', {
          entity_id: entityId,
        });
        return;
      }
      if (domain === 'cover') {
        await hass.callService('cover', 'close_cover', { entity_id: entityId });
        return;
      }
      await hass.callService(domain, 'turn_off', { entity_id: entityId });
    }),
  );

  return { attempted: targets, skipped };
}
