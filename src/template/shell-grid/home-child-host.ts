import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
} from '../../types/home-assistant';
import { createChildCard } from './create-child-card';

export interface ChildCardMaps {
  cards: Map<string, LovelaceCard>;
  configJson: Map<string, string>;
}

/** Eagerly create/replace a cached child card (place/apply edit paths). */
export async function mountChildCard(
  maps: ChildCardMaps,
  id: string,
  config: LovelaceCardConfig,
  hass: HomeAssistant | undefined,
  opts?: { dropIds?: string[] },
): Promise<void> {
  for (const drop of opts?.dropIds ?? [id]) {
    maps.cards.delete(drop);
    maps.configJson.delete(drop);
  }
  const el = await createChildCard(config);
  if (hass) el.hass = hass;
  maps.cards.set(id, el);
  maps.configJson.set(id, JSON.stringify(config));
}

/**
 * Attach or update a child card into a placeholder host (post-render sync).
 * Returns whether this host id was seen (for cache pruning).
 */
export function attachChildToHost(
  maps: ChildCardMaps,
  host: HTMLElement,
  id: string,
  config: LovelaceCardConfig,
  hass: HomeAssistant | undefined,
  isConnected: boolean,
): void {
  const configJson = JSON.stringify(config);
  const tag = config.type.replace(/^custom:/, '');
  const el = maps.cards.get(id);
  const prevJson = maps.configJson.get(id);
  let prevEntity = '';
  if (prevJson) {
    try {
      const prev = JSON.parse(prevJson) as { entity?: unknown };
      if (typeof prev.entity === 'string') prevEntity = prev.entity;
    } catch {
      /* ignore */
    }
  }
  const nextEntity = typeof config.entity === 'string' ? config.entity : '';
  const entityChanged = Boolean(prevJson) && prevEntity !== nextEntity;

  if (!el || el.tagName.toLowerCase() !== tag || entityChanged) {
    if (customElements.get(tag)) {
      const created = document.createElement(tag) as LovelaceCard;
      try {
        created.setConfig(config);
      } catch (err) {
         
        console.warn('AtriumUI: child card setConfig failed', err);
      }
      maps.cards.set(id, created);
      maps.configJson.set(id, configJson);
      if (hass) created.hass = hass;
      if (host.isConnected) host.replaceChildren(created);
      return;
    }
    void createChildCard(config).then((created) => {
      if (!isConnected) return;
      maps.cards.set(id, created);
      maps.configJson.set(id, configJson);
      if (hass) created.hass = hass;
      if (host.isConnected && host.firstChild !== created) {
        host.replaceChildren(created);
      }
    });
    return;
  }
  if (prevJson !== configJson) {
    try {
      el.setConfig(config);
      maps.configJson.set(id, configJson);
    } catch {
      /* keep prior */
    }
  }
  if (hass) el.hass = hass;
  if (host.firstChild !== el) {
    host.replaceChildren(el);
  }
}

/** Drop cached cards whose hosts are no longer present. */
export function pruneChildCards(maps: ChildCardMaps, seen: Set<string>): void {
  for (const key of maps.cards.keys()) {
    if (!seen.has(key)) {
      maps.cards.delete(key);
      maps.configJson.delete(key);
    }
  }
}
