/**
 * Switch helpers for `au-switch-card`.
 */
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { computeDomain, isEntityActive } from './entity';

export function validateSwitchEntity(entityId: string): void {
  if (computeDomain(entityId) !== 'switch') {
    throw new Error('AtriumUI Switch Card: entity must be a switch.* entity');
  }
}

export function formatSwitchSecondary(entity: HassEntity): string {
  return entity.state;
}

export async function toggleSwitch(
  hass: HomeAssistant,
  entity: HassEntity,
  opts?: { currentlyOn?: boolean },
): Promise<void> {
  const on = opts?.currentlyOn ?? isEntityActive(entity);
  await hass.callService('switch', on ? 'turn_off' : 'turn_on', {
    entity_id: entity.entity_id,
  });
}
