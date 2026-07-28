import { computeDomain } from '../../utils/entity';
import { ROOM_TOGGLE_DOMAINS } from '../../utils/domains';
import { controlIcon } from '../../utils/domain-icons';
import type {
  AuHomeCardConfig,
  AuHomeEntityConfig,
  AuHomeRoomControlsConfig,
} from '../../types/home';
import type { HassEntity } from '../../types/home-assistant';
import { entityDisplayOn } from '../../utils/sync-debug';

export { controlIcon };

export const ROOM_CONTROL_CAP = 6;

export function isToggleDomain(entityId: string): boolean {
  return (ROOM_TOGGLE_DOMAINS as readonly string[]).includes(
    computeDomain(entityId),
  );
}

/** Entity id from a room card config, when present. */
export function entityIdFromHomeCard(
  entry: AuHomeCardConfig | undefined,
): string | undefined {
  const entity = entry?.card?.entity;
  return typeof entity === 'string' && entity.trim() ? entity : undefined;
}

/**
 * Light/switch entities belonging to a room: `entities[]` plus any card that
 * targets a light/switch (deduped). Used for room tile counts and the strip.
 */
export function collectRoomToggleEntities(
  entities: AuHomeEntityConfig[],
  cards?: AuHomeCardConfig[],
): AuHomeEntityConfig[] {
  const out: AuHomeEntityConfig[] = [];
  const seen = new Set<string>();
  for (const ent of entities) {
    if (!ent.entity || !isToggleDomain(ent.entity) || seen.has(ent.entity)) {
      continue;
    }
    seen.add(ent.entity);
    out.push(ent);
  }
  for (const entry of cards ?? []) {
    const id = entityIdFromHomeCard(entry);
    if (!id || !isToggleDomain(id) || seen.has(id)) continue;
    seen.add(id);
    out.push({ entity: id });
  }
  return out;
}

/**
 * Domain-aware "on" check for room tiles and chip cards.
 * Lights use brightness-aware isLightOn so chips match au-light-card.
 */
export function entityIsOn(
  state:
    | (Pick<HassEntity, 'state'> &
        Partial<Pick<HassEntity, 'entity_id' | 'attributes'>>)
    | undefined,
): boolean {
  if (!state) return false;
  return entityDisplayOn({
    entity_id: state.entity_id ?? '',
    state: state.state,
    attributes: state.attributes ?? {},
    last_changed: '',
    last_updated: '',
  });
}

/** Merge card-level defaults with per-room `controls` (room wins per field). */
export function resolveRoomControls(
  global: AuHomeRoomControlsConfig | undefined,
  local: AuHomeRoomControlsConfig | undefined,
): AuHomeRoomControlsConfig {
  const g = global ?? {};
  const l = local ?? {};
  return {
    show: l.show ?? g.show ?? true,
    include: l.include ?? g.include,
    exclude: l.exclude ?? g.exclude,
    order: l.order ?? g.order,
    icons: { ...g.icons, ...l.icons },
  };
}

/**
 * Filter/sort/cap toggle entities for the room control strip.
 * When `controls.order` is set, that order wins; otherwise preserve config order
 * (stable — chips do not jump when toggled on/off).
 */
export function roomControlEntities(input: {
  entities: AuHomeEntityConfig[];
  controls: AuHomeRoomControlsConfig;
  cap?: number;
}): { visible: AuHomeEntityConfig[]; overflow: number } {
  const cap = input.cap ?? ROOM_CONTROL_CAP;
  let controls = input.entities.filter((e) => isToggleDomain(e.entity));
  if (Array.isArray(input.controls.include)) {
    const allow = new Set(input.controls.include);
    controls = controls.filter((e) => allow.has(e.entity));
  }
  if (input.controls.exclude?.length) {
    const deny = new Set(input.controls.exclude);
    controls = controls.filter((e) => !deny.has(e.entity));
  }
  const order = input.controls.order;
  let sorted: AuHomeEntityConfig[];
  if (order?.length) {
    const rank = new Map(order.map((id, i) => [id, i]));
    sorted = [...controls].sort((a, b) => {
      const ra = rank.get(a.entity) ?? Number.MAX_SAFE_INTEGER;
      const rb = rank.get(b.entity) ?? Number.MAX_SAFE_INTEGER;
      if (ra !== rb) return ra - rb;
      return a.entity.localeCompare(b.entity);
    });
  } else {
    sorted = controls;
  }
  const overflow = Math.max(0, sorted.length - cap);
  return {
    visible: sorted.slice(0, cap),
    overflow,
  };
}

