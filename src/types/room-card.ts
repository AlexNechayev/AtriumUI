import type { LovelaceCardConfig } from './home-assistant';
import type { AuCardVariant } from './action';

/** One toggle target in an `au-room-card` icon row. */
export interface AuRoomCardEntityConfig {
  entity: string;
  icon?: string;
  name?: string;
}

/**
 * `au-room-card` — no single required entity. Renders a row of icon buttons
 * that toggle lights/switches (and other toggleable domains).
 */
export interface AuRoomCardConfig extends LovelaceCardConfig {
  type: string;
  /** Optional title above the icon row. */
  name?: string;
  /** Optional header icon (shown when name is shown). */
  icon?: string;
  /** Optional meta line under the title (e.g. "3 on · 5"). */
  subtitle?: string;
  /** Show the name/header row. Default true when `name` is set; false in compact. */
  show_name?: boolean;
  /**
   * When true, the header is a button that fires bubbling `au-room-header`
   * (used by the Home floor room tile to open the room).
   */
  header_interactive?: boolean;
  /**
   * Entities to control. Accepts entity id strings or `{ entity, icon?, name? }`.
   */
  entities?: Array<string | AuRoomCardEntityConfig>;
  /** Visual variant. `home` uses home-tile styling. */
  variant?: AuCardVariant;
  /** Icon-row only (no outer card padding/chrome). */
  compact?: boolean;
  /** When true, emit `[AtriumUI:…]` sync/action logs to the browser console. */
  debug?: boolean;
}

/** Normalize YAML entity entries to a stable list. */
export function normalizeRoomCardEntities(
  entities: AuRoomCardConfig['entities'],
): AuRoomCardEntityConfig[] {
  if (!Array.isArray(entities)) return [];
  const out: AuRoomCardEntityConfig[] = [];
  const seen = new Set<string>();
  for (const entry of entities) {
    if (typeof entry === 'string') {
      const id = entry.trim().toLowerCase();
      if (!id || !id.includes('.') || seen.has(id)) continue;
      seen.add(id);
      out.push({ entity: id });
      continue;
    }
    if (!entry || typeof entry !== 'object') continue;
    const id =
      typeof entry.entity === 'string' ? entry.entity.trim().toLowerCase() : '';
    if (!id || !id.includes('.') || seen.has(id)) continue;
    seen.add(id);
    out.push({
      entity: id,
      ...(typeof entry.icon === 'string' && entry.icon.trim()
        ? { icon: entry.icon.trim() }
        : {}),
      ...(typeof entry.name === 'string' && entry.name.trim()
        ? { name: entry.name.trim() }
        : {}),
    });
  }
  return out;
}
