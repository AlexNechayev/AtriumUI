import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { computeDomain } from './entity';

/** Vacuum supported_features bit flags (HA). */
export const VACUUM_SUPPORT = {
  TURN_ON: 1,
  TURN_OFF: 2,
  PAUSE: 4,
  STOP: 8,
  RETURN_HOME: 16,
  FAN_SPEED: 32,
  BATTERY: 64,
  STATUS: 128,
  SEND_COMMAND: 256,
  LOCATE: 512,
  CLEAN_SPOT: 1024,
  MAP: 2048,
  STATE: 4096,
  START: 8192,
} as const;

export interface VacuumCapabilities {
  canStart: boolean;
  canPause: boolean;
  canStop: boolean;
  canReturn: boolean;
}

const ACTIVE_STATES = new Set([
  'cleaning',
  'on',
  'returning',
  'docked',
  'idle',
  'paused',
  'error',
]);

export function validateVacuumEntity(entityId: string): void {
  if (computeDomain(entityId) !== 'vacuum') {
    throw new Error('AtriumUI Vacuum Card: entity must be a vacuum.* entity');
  }
}

export function isVacuumDomain(entityId: string): boolean {
  return computeDomain(entityId) === 'vacuum';
}

export function isVacuumActive(entity: HassEntity): boolean {
  return entity.state === 'cleaning' || entity.state === 'on' || entity.state === 'returning';
}

export function formatVacuumSecondary(entity: HassEntity): string | undefined {
  if (entity.state === 'unknown' || entity.state === 'unavailable') return undefined;
  return entity.state;
}

export function getVacuumCapabilities(entity: HassEntity): VacuumCapabilities {
  const features =
    typeof entity.attributes.supported_features === 'number'
      ? entity.attributes.supported_features
      : 0;
  const hasState = ACTIVE_STATES.has(entity.state) || features !== 0;
  return {
    canStart:
      (features & VACUUM_SUPPORT.START) !== 0 ||
      (features & VACUUM_SUPPORT.TURN_ON) !== 0 ||
      hasState,
    canPause: (features & VACUUM_SUPPORT.PAUSE) !== 0,
    canStop:
      (features & VACUUM_SUPPORT.STOP) !== 0 ||
      (features & VACUUM_SUPPORT.TURN_OFF) !== 0,
    canReturn: (features & VACUUM_SUPPORT.RETURN_HOME) !== 0 || hasState,
  };
}

export async function startVacuum(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('vacuum', 'start', { entity_id: entityId });
}

export async function pauseVacuum(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('vacuum', 'pause', { entity_id: entityId });
}

export async function stopVacuum(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('vacuum', 'stop', { entity_id: entityId });
}

export async function returnVacuum(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('vacuum', 'return_to_base', { entity_id: entityId });
}

/** Primary tap: return when active, otherwise start. */
export async function toggleVacuum(
  hass: HomeAssistant,
  entity: HassEntity,
  opts?: { currentlyOn?: boolean },
): Promise<void> {
  const on = opts?.currentlyOn ?? isVacuumActive(entity);
  if (on) {
    await returnVacuum(hass, entity.entity_id);
  } else {
    await startVacuum(hass, entity.entity_id);
  }
}
