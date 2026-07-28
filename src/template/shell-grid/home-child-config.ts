import { resolveCardTypeForEntity } from '../../utils/device';
import { normalizeAuHomeCardConfig } from '../../utils/home-card-type';
import type { AuHomeEntityConfig, AuHomeRoomConfig } from '../../types/home';
import type { LovelaceCardConfig } from '../../types/home-assistant';
import type { AuRoomCardConfig } from '../../types/room-card';

/**
 * Normalize remappable Atrium `type` for the bound entity, then inject Apple
 * Home look unless `variant` is already set.
 */
export function homeAwareCardConfig(
  card: LovelaceCardConfig,
): LovelaceCardConfig {
  const { card: normalized } = normalizeAuHomeCardConfig(card);
  const type = String(normalized.type ?? '');
  const short = type.replace(/^custom:/, '');
  if (!short.startsWith('au-')) return normalized;
  if (normalized.variant !== undefined) return normalized;
  return {
    ...normalized,
    variant: 'home',
    content_layout: normalized.content_layout ?? 'vertical',
  };
}

export interface ChildConfigOptions {
  confirmActions?: boolean;
  debug?: boolean;
}

/** Build runtime Lovelace config for a home/room entity tile. */
export function childConfigForEntity(
  ent: AuHomeEntityConfig,
  opts: ChildConfigOptions = {},
): LovelaceCardConfig {
  const resolved = resolveCardTypeForEntity(ent.entity, ent.card_type);
  const type = resolved.startsWith('custom:')
    ? resolved
    : resolved.includes(':')
      ? resolved
      : `custom:${resolved}`;
  const short = type.replace(/^custom:/, '');
  // Vacuum: dedicated card; Home glance hides controls until opted in.
  // Cover: dedicated card; Home glance keeps open/close/stop visible.
  const domain = ent.entity.includes('.')
    ? ent.entity.slice(0, ent.entity.indexOf('.'))
    : '';
  const glanceDefaults: Record<string, unknown> =
    short === 'au-device-card'
      ? domain === 'water_heater'
        ? { show_controls: true, show_timer: true }
        : {
            show_controls: false,
          }
      : short === 'au-light-card'
        ? { show_brightness: false, show_color_temp: false, show_rgb: false }
        : short === 'au-fan-card'
          ? {
              show_speed: false,
              show_preset_modes: false,
              show_oscillate: false,
              show_direction: false,
            }
          : short === 'au-cover-card'
            ? { show_controls: true }
            : short === 'au-vacuum-card'
              ? { show_controls: false }
              : {};
  const atriumHome = short.startsWith('au-')
    ? {
        variant: 'home',
        content_layout: 'vertical',
        ...glanceDefaults,
      }
    : {};
  const base: LovelaceCardConfig = {
    type,
    entity: ent.entity,
    ...atriumHome,
    ...(ent.name ? { name: ent.name } : {}),
    ...(ent.icon ? { icon: ent.icon } : {}),
    ...(opts.confirmActions && short === 'au-device-card'
      ? { confirm_actions: true }
      : {}),
    ...(opts.debug ? { debug: true } : {}),
    ...(ent.card_config ?? {}),
  };
  // Home vacuum: never show domain buttons unless explicitly opted in.
  if (short === 'au-vacuum-card') {
    const optedIn =
      base.show_controls === true || base.show_vacuum_controls === true;
    if (!optedIn) {
      base.show_controls = false;
    } else {
      base.show_controls = true;
    }
  }
  if (short === 'au-device-card' && domain === 'water_heater') {
    if (base.show_timer !== false) base.show_timer = true;
  }
  return base;
}

export interface RoomTileCardConfigInput {
  room: AuHomeRoomConfig;
  headerInteractive: boolean;
  toggles: AuHomeEntityConfig[];
  activeCount: number;
  chipEntities: AuHomeEntityConfig[];
  chipIcon: (ent: AuHomeEntityConfig) => string;
  chipLabel: (ent: AuHomeEntityConfig) => string;
}

/** Config for the room-tile host mounted as `au-room-card`. */
export function buildRoomTileCardConfig(
  input: RoomTileCardConfigInput & { debug?: boolean },
): AuRoomCardConfig {
  const { room } = input;
  return {
    type: 'custom:au-room-card',
    variant: 'home',
    header_interactive: input.headerInteractive,
    name: room.name,
    icon: room.icon ?? 'mdi:sofa-outline',
    subtitle: `${input.activeCount} on · ${input.toggles.length}`,
    entities: input.chipEntities.map((ent) => ({
      entity: ent.entity,
      icon: input.chipIcon(ent),
      name: input.chipLabel(ent),
    })),
    ...(input.debug ? { debug: true } : {}),
  };
}
