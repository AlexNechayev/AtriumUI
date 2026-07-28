import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { computeDomain } from './entity';

export interface WaterHeaterCapabilities {
  canToggle: boolean;
  canSetTemperature: boolean;
  minTemp: number;
  maxTemp: number;
  step: number;
  operationModes: string[];
}

export function validateWaterHeaterEntity(entityId: string): void {
  if (computeDomain(entityId) !== 'water_heater') {
    throw new Error(
      'AtriumUI Device Card: water heater controls require a water_heater.* entity',
    );
  }
}

export function getWaterHeaterCapabilities(
  entity: HassEntity,
): WaterHeaterCapabilities {
  const modes = entity.attributes.operation_list;
  const min =
    typeof entity.attributes.min_temp === 'number'
      ? entity.attributes.min_temp
      : 30;
  const max =
    typeof entity.attributes.max_temp === 'number'
      ? entity.attributes.max_temp
      : 70;
  const step =
    typeof entity.attributes.target_temp_step === 'number'
      ? entity.attributes.target_temp_step
      : 1;
  return {
    canToggle: true,
    canSetTemperature:
      typeof entity.attributes.temperature === 'number' ||
      typeof entity.attributes.target_temp_high === 'number',
    minTemp: min,
    maxTemp: max,
    step,
    operationModes: Array.isArray(modes)
      ? modes.filter((m): m is string => typeof m === 'string')
      : [],
  };
}

export function getWaterHeaterTemperature(entity: HassEntity): number | undefined {
  const temp = entity.attributes.temperature;
  return typeof temp === 'number' ? temp : undefined;
}

export async function setWaterHeaterTemperature(
  hass: HomeAssistant,
  entityId: string,
  temperature: number,
): Promise<void> {
  await hass.callService('water_heater', 'set_temperature', {
    entity_id: entityId,
    temperature,
  });
}

export async function turnOnWaterHeater(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('water_heater', 'turn_on', { entity_id: entityId });
}

export async function turnOffWaterHeater(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('water_heater', 'turn_off', { entity_id: entityId });
}
