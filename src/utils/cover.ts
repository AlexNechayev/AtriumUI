import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { computeDomain } from './entity';

/** Cover supported_features bit flags (HA). */
export const COVER_SUPPORT = {
  OPEN: 1,
  CLOSE: 2,
  SET_POSITION: 4,
  STOP: 8,
  OPEN_TILT: 16,
  CLOSE_TILT: 32,
  STOP_TILT: 64,
  SET_TILT_POSITION: 128,
} as const;

export interface CoverCapabilities {
  canOpen: boolean;
  canClose: boolean;
  canStop: boolean;
  canSetPosition: boolean;
}

export function validateCoverEntity(entityId: string): void {
  if (computeDomain(entityId) !== 'cover') {
    throw new Error('AtriumUI Cover Card: entity must be a cover.* entity');
  }
}

export function getCoverCapabilities(entity: HassEntity): CoverCapabilities {
  const features =
    typeof entity.attributes.supported_features === 'number'
      ? entity.attributes.supported_features
      : 0;
  return {
    canOpen: (features & COVER_SUPPORT.OPEN) !== 0 || features === 0,
    canClose: (features & COVER_SUPPORT.CLOSE) !== 0 || features === 0,
    canStop: (features & COVER_SUPPORT.STOP) !== 0,
    canSetPosition: (features & COVER_SUPPORT.SET_POSITION) !== 0,
  };
}

export function getCoverPosition(entity: HassEntity): number | undefined {
  const pos = entity.attributes.current_position;
  return typeof pos === 'number' ? pos : undefined;
}

export function formatCoverSecondary(entity: HassEntity): string | undefined {
  const position = getCoverPosition(entity);
  if (typeof position === 'number') return `${position}%`;
  if (entity.state === 'unknown' || entity.state === 'unavailable') return undefined;
  return entity.state;
}

export function isCoverOpen(entity: HassEntity): boolean {
  return entity.state === 'open' || entity.state === 'opening';
}

export async function toggleCover(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('cover', 'toggle', { entity_id: entityId });
}

export async function openCover(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('cover', 'open_cover', { entity_id: entityId });
}

export async function closeCover(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('cover', 'close_cover', { entity_id: entityId });
}

export async function stopCover(
  hass: HomeAssistant,
  entityId: string,
): Promise<void> {
  await hass.callService('cover', 'stop_cover', { entity_id: entityId });
}

export async function setCoverPosition(
  hass: HomeAssistant,
  entityId: string,
  position: number,
): Promise<void> {
  await hass.callService('cover', 'set_cover_position', {
    entity_id: entityId,
    position: Math.max(0, Math.min(100, Math.round(position))),
  });
}
