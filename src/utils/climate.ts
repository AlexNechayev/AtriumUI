import { computeDomain } from './entity';
import { createDebounced } from './debounce';
import type { HvacAction, HvacMode } from '../types/climate';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';

/** HA ClimateEntityFeature bitflags (subset used by v1). */
export const CLIMATE_SUPPORT_TARGET_TEMPERATURE = 1;
export const CLIMATE_SUPPORT_FAN_MODE = 8;

const HVAC_MODES: readonly HvacMode[] = [
  'off',
  'heat',
  'cool',
  'heat_cool',
  'auto',
  'dry',
  'fan_only',
];

export interface ClimateCapabilities {
  supportsTargetTemp: boolean;
  supportsFanMode: boolean;
  hvacModes: HvacMode[];
  fanModes: string[];
  minTemp: number;
  maxTemp: number;
  step: number;
}

export { createDebounced };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hasFeature(entity: HassEntity, flag: number): boolean {
  const features = entity.attributes.supported_features;
  return typeof features === 'number' && (features & flag) === flag;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string');
}

export function getHvacModes(entity: HassEntity): HvacMode[] {
  const modes = asStringList(entity.attributes.hvac_modes).filter((m): m is HvacMode =>
    (HVAC_MODES as readonly string[]).includes(m),
  );
  if (modes.length > 0) return modes;
  if ((HVAC_MODES as readonly string[]).includes(entity.state)) {
    return [entity.state as HvacMode];
  }
  return ['off'];
}

export function getFanModes(entity: HassEntity): string[] {
  return asStringList(entity.attributes.fan_modes);
}

export function getClimateCapabilities(entity: HassEntity): ClimateCapabilities {
  const hvacModes = getHvacModes(entity);
  const fanModes = getFanModes(entity);
  const minTemp = asNumber(entity.attributes.min_temp) ?? 16;
  const maxTemp = asNumber(entity.attributes.max_temp) ?? 30;
  const step = asNumber(entity.attributes.target_temp_step) ?? 1;

  const supportsTargetTemp =
    hasFeature(entity, CLIMATE_SUPPORT_TARGET_TEMPERATURE) ||
    asNumber(entity.attributes.temperature) !== undefined ||
    asNumber(entity.attributes.min_temp) !== undefined;

  const supportsFanMode =
    hasFeature(entity, CLIMATE_SUPPORT_FAN_MODE) || fanModes.length > 0;

  return {
    supportsTargetTemp,
    supportsFanMode,
    hvacModes,
    fanModes,
    minTemp,
    maxTemp,
    step: step > 0 ? step : 1,
  };
}

export function hasClimateControls(entity: HassEntity): boolean {
  const caps = getClimateCapabilities(entity);
  return (
    caps.hvacModes.length > 1 ||
    caps.supportsTargetTemp ||
    (caps.supportsFanMode && caps.fanModes.length > 0)
  );
}

export function getHvacMode(entity: HassEntity): HvacMode {
  if ((HVAC_MODES as readonly string[]).includes(entity.state)) {
    return entity.state as HvacMode;
  }
  return 'off';
}

export function getHvacAction(entity: HassEntity): HvacAction | undefined {
  const action = entity.attributes.hvac_action;
  return typeof action === 'string' ? action : undefined;
}

export function getCurrentTemperature(entity: HassEntity): number | undefined {
  return asNumber(entity.attributes.current_temperature);
}

export function getTargetTemperature(entity: HassEntity): number | undefined {
  return asNumber(entity.attributes.temperature);
}

export function getFanMode(entity: HassEntity): string | undefined {
  const mode = entity.attributes.fan_mode;
  return typeof mode === 'string' ? mode : undefined;
}

export function getTemperatureUnit(hass?: HomeAssistant): string {
  const unit = (
    hass as HomeAssistant & {
      config?: { unit_system?: { temperature?: string } };
    }
  )?.config?.unit_system?.temperature;
  return unit === '°F' || unit === 'F' ? '°F' : '°C';
}

export function formatTemperature(value: number | undefined, unit: string): string | undefined {
  if (value === undefined) return undefined;
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${rounded}${unit}`;
}

export function formatHvacModeLabel(mode: string): string {
  if (mode === 'heat_cool') return 'Auto';
  return mode
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const HVAC_MODE_ICONS: Record<HvacMode, string> = {
  off: 'mdi:power',
  heat: 'mdi:fire',
  cool: 'mdi:snowflake',
  heat_cool: 'mdi:autorenew',
  auto: 'mdi:calendar-sync',
  dry: 'mdi:water-percent',
  fan_only: 'mdi:fan',
};

export function getHvacModeIcon(mode: string): string {
  if ((HVAC_MODES as readonly string[]).includes(mode)) {
    return HVAC_MODE_ICONS[mode as HvacMode];
  }
  return 'mdi:thermostat';
}

export function formatFanModeLabel(mode: string): string {
  return mode
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getFanModeIcon(mode: string): string {
  const key = mode.trim().toLowerCase();
  switch (key) {
    case 'auto':
      return 'mdi:fan-auto';
    case 'off':
      return 'mdi:fan-off';
    case 'low':
    case '1':
      return 'mdi:fan-speed-1';
    case 'medium':
    case 'med':
    case 'mid':
    case '2':
    case '3':
      return 'mdi:fan-speed-2';
    case 'high':
    case '4':
    case '5':
      return 'mdi:fan-speed-3';
    default:
      return 'mdi:fan';
  }
}

export async function setHvacMode(
  hass: HomeAssistant,
  entityId: string,
  hvacMode: HvacMode,
): Promise<void> {
  await hass.callService('climate', 'set_hvac_mode', {
    entity_id: entityId,
    hvac_mode: hvacMode,
  });
}

export async function setTargetTemperature(
  hass: HomeAssistant,
  entity: HassEntity,
  entityId: string,
  temperature: number,
): Promise<void> {
  const caps = getClimateCapabilities(entity);
  const next = clamp(temperature, caps.minTemp, caps.maxTemp);
  const stepped =
    caps.step > 0
      ? Math.round((next - caps.minTemp) / caps.step) * caps.step + caps.minTemp
      : next;
  await hass.callService('climate', 'set_temperature', {
    entity_id: entityId,
    temperature: Number(stepped.toFixed(2)),
  });
}

export async function setFanMode(
  hass: HomeAssistant,
  entityId: string,
  fanMode: string,
): Promise<void> {
  await hass.callService('climate', 'set_fan_mode', {
    entity_id: entityId,
    fan_mode: fanMode,
  });
}

export function validateClimateEntity(entityId: string): void {
  if (!entityId.includes('.')) {
    throw new Error('AtriumUI Climate Card: "entity" must be a valid entity id');
  }
  if (computeDomain(entityId) !== 'climate') {
    throw new Error('AtriumUI Climate Card: "entity" must be a climate entity');
  }
}
