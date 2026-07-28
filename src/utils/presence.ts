import type { HassEntity } from '../types/home-assistant';
import { computeDomain, isEntityActive, isUnavailable } from './entity';

export interface PresenceItem {
  entityId: string;
  name: string;
  home: boolean;
  unavailable: boolean;
  picture?: string;
}

/** True when the entity id is a presence-capable domain. */
export function isPresenceEntity(entityId: string): boolean {
  const domain = computeDomain(entityId);
  return domain === 'person' || domain === 'device_tracker';
}

/** Build presence strip items from entity ids + hass states. */
export function buildPresenceItems(
  entityIds: string[],
  states: Record<string, HassEntity>,
): PresenceItem[] {
  return entityIds.map((entityId) => {
    const entity = states[entityId];
    const unavailable = !entity || isUnavailable(entity);
    return {
      entityId,
      name: entity?.attributes.friendly_name ?? entityId,
      home: !unavailable && isEntityActive(entity),
      unavailable,
      picture:
        typeof entity?.attributes.entity_picture === 'string'
          ? entity.attributes.entity_picture
          : undefined,
    };
  });
}
