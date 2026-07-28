/**
 * Home floor/room entity models for `au-shell-grid`.
 */

import type { LovelaceCardConfig } from './home-assistant';

/** Placement on a Home grid (room overview or in-room entities). */
export interface AuHomeEntityLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Alias for room-tile placement on the Home overview grid. */
export type AuHomeGridLayout = AuHomeEntityLayout;

/** Per-entity override inside a room (Atrium auto-card shorthand). */
export interface AuHomeEntityConfig {
  /** Required entity id. */
  entity: string;
  /** Display name override. */
  name?: string;
  /** Icon override (mdi:* or custom glyph id). */
  icon?: string;
  /**
   * Force a card type. When omitted, the template picks light/climate/sensor/
   * device/action based on domain. Any Lovelace / custom card type string is
   * allowed (e.g. `custom:mushroom-light-card`, `tile`).
   */
  card_type?: string;
  /** Hide this entity from the room grid. */
  hide?: boolean;
  /** Extra card config merged into the resolved child card. */
  card_config?: Record<string, unknown>;
  /** Placement on the room grid. */
  layout?: AuHomeEntityLayout;
}

/**
 * Arbitrary Lovelace card placed on a room grid (any installed HA card).
 * For remappable Atrium entity cards (`au-action-card`, `au-device-card`,
 * `au-light-card`, `au-climate-card`, `au-sensor-card`), `type` is aligned to
 * the bound `entity` domain on mount/save unless `card_type_locked: true`.
 */
export interface AuHomeCardConfig {
  /** Stable id for layout editing. Auto-generated when omitted. */
  id?: string;
  /** Full Lovelace card config. */
  card: LovelaceCardConfig;
  /** Placement on the room grid. */
  layout?: AuHomeGridLayout;
}

/**
 * Light/switch status strip on a Home overview room tile.
 * Global defaults live on `AuShellGridConfig.room_controls`; per-room
 * `controls` overrides those fields.
 */
export interface AuHomeRoomControlsConfig {
  /** Show the strip when the tile is large enough. Default true. */
  show?: boolean;
  /**
   * Whitelist: when non-empty, only these entity ids appear
   * (still must be `light.*` / `switch.*` in the room).
   */
  include?: string[];
  /** Blacklist: hide these entity ids from the strip. */
  exclude?: string[];
  /**
   * Display order for strip chips (entity ids). When omitted, room entity
   * config order is preserved.
   */
  order?: string[];
  /**
   * Strip-only icon overrides keyed by entity id.
   * Falls back to the entity’s `icon`, then HA state icon, then domain default.
   */
  icons?: Record<string, string>;
}

/** A room on a floor. */
export interface AuHomeRoomConfig {
  /** Stable id for navigation. Auto-generated from name when omitted. */
  id?: string;
  /** Room display name. */
  name: string;
  /** Optional HA area id for auto-discovery. */
  area_id?: string;
  /** Icon override for the room tile. */
  icon?: string;
  /** Entities shown in this room (Atrium shorthand). */
  entities?: AuHomeEntityConfig[];
  /** Arbitrary Lovelace cards on this room’s grid. */
  cards?: AuHomeCardConfig[];
  /** Placement on the Home overview room grid. */
  layout?: AuHomeGridLayout;
  /** Light/switch strip on the Home room tile (overrides card-level defaults). */
  controls?: AuHomeRoomControlsConfig;
  /** Collapse entity list by default when dense. Default false. */
  collapsed?: boolean;
  /** Max visible entities before collapse affordance. Default 8. */
  collapse_after?: number;
}

/** A floor grouping rooms. */
export interface AuHomeFloorConfig {
  /** Stable id. Auto-generated from name when omitted. */
  id?: string;
  /** Floor display name. */
  name: string;
  /** Optional HA floor id for auto-discovery. */
  floor_id?: string;
  /** Rooms on this floor. */
  rooms: AuHomeRoomConfig[];
  /** Standalone entities on this floor’s Home overview grid. */
  entities?: AuHomeEntityConfig[];
  /** Arbitrary Lovelace cards on this floor’s Home overview grid. */
  cards?: AuHomeCardConfig[];
}
