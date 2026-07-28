/**
 * Normalize free-form Home `cards:` configs onto the recommended Atrium card
 * for the bound entity. `entities:` already use {@link resolveCardTypeForEntity};
 * this closes the gap for manually picked Lovelace cards.
 */
import type { LovelaceCardConfig } from '../types/home-assistant';
import { resolveCardTypeForEntity } from './device';

/** Atrium entity tiles that may be remapped by domain. */
export const REMAPPABLE_AU_CARD_TYPES: ReadonlySet<string> = new Set([
  'au-action-card',
  'au-device-card',
  'au-light-card',
  'au-climate-card',
  'au-fan-card',
  'au-cover-card',
  'au-switch-card',
  'au-vacuum-card',
  'au-sensor-card',
]);

/** When true on a card config, skip automatic type remapping. */
export const CARD_TYPE_LOCKED_KEY = 'card_type_locked' as const;

export function cardTypeShort(type: string): string {
  return String(type ?? '').replace(/^custom:/, '');
}

export function withCustomCardPrefix(type: string): string {
  const raw = String(type ?? '').trim();
  if (!raw) return raw;
  if (raw.startsWith('custom:') || raw.includes(':')) return raw;
  return `custom:${raw}`;
}

export function isRemappableAuCardType(type: string): boolean {
  return REMAPPABLE_AU_CARD_TYPES.has(cardTypeShort(type));
}

/** Recommended short card id for an entity (same rules as home `entities:`). */
export function recommendedAuCardType(entityId: string): string {
  return resolveCardTypeForEntity(entityId);
}

export interface NormalizeAuHomeCardResult {
  card: LovelaceCardConfig;
  changed: boolean;
  from?: string;
  to?: string;
}

/**
 * If this is a remappable Atrium entity card with a single `entity`, rewrite
 * `type` to the domain-recommended card. Preserves all other keys.
 *
 * Skips: non-Atrium / calendar / room cards, locked configs, missing entity.
 */
export function normalizeAuHomeCardConfig(
  card: LovelaceCardConfig,
): NormalizeAuHomeCardResult {
  const type = String(card.type ?? '');
  if (!isRemappableAuCardType(type)) {
    return { card, changed: false };
  }
  if (card[CARD_TYPE_LOCKED_KEY] === true) {
    return { card, changed: false };
  }
  const entity =
    typeof card.entity === 'string' ? card.entity.trim().toLowerCase() : '';
  if (!entity.includes('.')) {
    return { card, changed: false };
  }

  const recommendedFull = withCustomCardPrefix(recommendedAuCardType(entity));
  const currentShort = cardTypeShort(type);
  const recommendedShort = cardTypeShort(recommendedFull);
  if (currentShort === recommendedShort) {
    return { card, changed: false };
  }

  return {
    card: { ...card, type: recommendedFull },
    changed: true,
    from: type,
    to: recommendedFull,
  };
}
