/**
 * Persist grid layout + card configs back into the Lovelace dashboard YAML.
 */
import type { AuGridCardConfig, AuShellGridConfig } from '../../types/config';
import type { AuHomeFloorConfig } from '../../types/home';
import type { LovelaceCardConfig } from '../../types/home-assistant';

export interface GridPersistItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config: LovelaceCardConfig;
}

/** Build the grid section of dashboard YAML from the current edit session. */
export function buildPersistedGridConfig(
  base: AuShellGridConfig,
  items: GridPersistItem[],
  contentOverrides: ReadonlyMap<string, LovelaceCardConfig>,
): AuShellGridConfig {
  const cards: AuGridCardConfig[] = items.map((item) => {
    const override = contentOverrides.get(item.id);
    const card = { ...(override ?? item.config) } as AuGridCardConfig;
    const cfgId = (item.config as AuGridCardConfig).id;
    if (cfgId) {
      card.id = cfgId;
    } else if (item.id && !item.id.startsWith('au-item-')) {
      card.id = item.id;
    }
    card.layout = { x: item.x, y: item.y, w: item.w, h: item.h };
    return card;
  });

  const { storage_key: _legacy, ...rest } = base as AuShellGridConfig & {
    storage_key?: string;
  };
  return { ...rest, cards };
}

/**
 * Persist Home floors (including per-entity room-grid layouts) without
 * rewriting legacy `cards` from an empty classic edit session.
 */
export function buildPersistedHomeConfig(
  base: AuShellGridConfig,
  floors: AuHomeFloorConfig[],
): AuShellGridConfig {
  const { storage_key: _legacy, ...rest } = base as AuShellGridConfig & {
    storage_key?: string;
  };
  return {
    ...rest,
    floors: structuredClone(floors),
    cards: Array.isArray(base.cards) ? base.cards : [],
  };
}

/** Merge an updated grid config into a cloned Lovelace dashboard config. */
export function applyGridToLovelaceConfig(
  config: Record<string, unknown>,
  path: number[],
  gridConfig: AuShellGridConfig,
): Record<string, unknown> {
  const next = structuredClone(config);
  const views = next.views as Record<string, unknown>[] | undefined;
  if (!Array.isArray(views) || path.length === 0) return next;

  if (path.length === 1) {
    views[path[0]!] = gridConfig;
    return next;
  }

  const view = views[path[0]!] as { cards?: AuShellGridConfig[] } | undefined;
  if (view?.cards && path[1] !== undefined) {
    view.cards[path[1]] = gridConfig;
  }
  return next;
}
