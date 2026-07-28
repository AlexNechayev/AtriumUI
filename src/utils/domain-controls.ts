/**
 * Domain-control facade for adaptive device tiles.
 * Consolidates water_heater helpers so cards import one module.
 * Cover → `au-cover-card`, fan → `au-fan-card`, switch → `au-switch-card`,
 * vacuum → `au-vacuum-card`.
 */
import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { computeDomain } from './entity';
import {
  getWaterHeaterCapabilities,
  getWaterHeaterTemperature,
  setWaterHeaterTemperature,
  type WaterHeaterCapabilities,
} from './water-heater';

export type DomainControlKind = 'water_heater' | 'none';

export interface DomainControlVisibility {
  show_temperature?: boolean;
  show_timer?: boolean;
}

export type DomainControlModel =
  | {
      kind: 'water_heater';
      caps: WaterHeaterCapabilities;
      temperature?: number;
    }
  | { kind: 'none' };

/** Which interactive control surface a device entity should show. */
export function resolveDomainControl(
  entity: HassEntity,
  visibility: DomainControlVisibility = {},
): DomainControlModel {
  const domain = computeDomain(entity.entity_id);

  if (domain === 'water_heater') {
    const showTemp = visibility.show_temperature !== false;
    const showTimer = visibility.show_timer !== false;
    if (!showTemp && !showTimer) return { kind: 'none' };
    const caps = getWaterHeaterCapabilities(entity);
    return {
      kind: 'water_heater',
      caps,
      temperature: getWaterHeaterTemperature(entity),
    };
  }
  return { kind: 'none' };
}

export async function runWaterHeaterTemperature(
  hass: HomeAssistant,
  entityId: string,
  temperature: number,
): Promise<void> {
  await setWaterHeaterTemperature(hass, entityId, temperature);
}
