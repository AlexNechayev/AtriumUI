/**
 * AtriumUI - Explicitly typed configuration schemas for each card (spec 2, 3.2).
 * Every card validates its own config against these shapes inside `setConfig`.
 */
import type { AuCardVariant } from './action';
import type { LovelaceCardConfig } from './home-assistant';
import type { AuActionCardBaseConfig } from './action';
import type {
  AuHomeFloorConfig,
  AuHomeRoomControlsConfig,
} from './home';

export type {
  ActionConfig,
  AuActionCardBaseConfig,
  AuActionCardContentLayout,
} from './action';

/** Coordinate + size of a grid item, authored against the desktop column base. */
export interface AuGridItemLayout {
  /** Zero-based column start index. */
  x: number;
  /** Zero-based row start index. */
  y: number;
  /** Column span (>= 1). */
  w: number;
  /** Row span (>= 1). */
  h: number;
}

/** A child card of the grid, optionally carrying a stable id and layout. */
export interface AuGridCardConfig extends LovelaceCardConfig {
  /** Stable identity for layout/content persistence (recommended). */
  id?: string;
  /** Placement + size. When omitted, the item auto-flows into a free slot. */
  layout?: AuGridItemLayout;
}

/**
 * `au-shell-grid` - Home dashboard shell.
 * Floors → Rooms navigation with a coordinate grid for room entity tiles.
 * Grid options (`columns`, `gap`, `row_height`, …) apply inside rooms.
 */
export interface AuShellGridConfig extends LovelaceCardConfig {
  type: string;
  /** Desktop base column count for room entity grids. Default 12. */
  columns?: number;
  /** Gap between room-grid tracks (token-aware, e.g. "12px" or "var(--au-gap)"). */
  gap?: string;
  /** Height of a single room-grid row unit (e.g. "80px"). Default "80px". */
  row_height?: string;
  /** Outer width. Default `100%`. */
  width?: string;
  /** Outer height. Default `100vh`. Content scrolls when it overflows. */
  height?: string;
  /**
   * Number of equal-height row tracks when height is distributed.
   * Defaults to the occupied content row count when distribute mode is active.
   */
  rows?: number;
  /** Optional cap on the number of rows. */
  max_rows?: number;
  /** Allow layout editing while the HA dashboard is in edit mode. Default true. */
  editable?: boolean;
  /**
   * @deprecated Legacy free-form cards. Prefer floors/rooms entities.
   * Still rendered only if `floors` is empty (backward compatibility).
   */
  cards?: AuGridCardConfig[];

  /** Floors → rooms → entities hierarchy (primary configuration). */
  floors?: AuHomeFloorConfig[];
  /** Presence entities (`person.*` / `device_tracker.*`). */
  presence?: string[];
  /** Show presence strip on the Home view. Default true. */
  show_presence?: boolean;
  /** Show room bulk “All off”. Default true. */
  show_bulk_actions?: boolean;
  /** Home toolbar title when greeting is off. Default "Home" (via i18n). */
  header_title?: string;
  /** Replace Home toolbar title with time-of-day greeting. Default false. */
  header_greeting?: boolean;
  /** Toolbar clock format. Default `'24h'`. */
  clock_format?: '12h' | '24h';
  /** Show calendar date on the toolbar clock. Default true. */
  clock_show_date?: boolean;
  /** Date pattern for the toolbar clock. Default `'dd/mm'` (no year). */
  clock_date_format?: 'dd/mm' | 'mm/dd';
  /** Show weekday on the toolbar clock. Default true. */
  clock_show_day?: boolean;
  /** Weekday length on the toolbar clock. Default `'short'`. */
  clock_day_format?: 'short' | 'long';
  /**
   * Default light/switch strip settings for Home room tiles.
   * Per-room `floors[].rooms[].controls` overrides these fields.
   */
  room_controls?: AuHomeRoomControlsConfig;
  /** Log diagnostics. Default false. */
  debug?: boolean;
  /** Merge entities from each room’s `area_id`. Default false. */
  auto_areas?: boolean;
  /** Prefer device registry names when available. Default true. */
  prefer_device_name?: boolean;
  /** Optional multi-entity tiles inside rooms. */
  multi_entity?: Array<{
    id?: string;
    name: string;
    icon?: string;
    entities: string[];
    room_id?: string;
  }>;
  /** Scene entity ids as Home quick actions. */
  scenes?: string[];
  /** Script entity ids as Home quick actions. */
  scripts?: string[];
  /** Confirm before bulk / high-stakes device actions. */
  confirm_actions?: boolean;
  /**
   * Seconds of inactivity in a room before returning to Home.
   * `0` or unset = off.
   */
  room_idle_timeout?: number;

  /**
   * @deprecated Legacy auto-fit column width. Retained for backward
   * compatibility; ignored when items carry explicit `layout` coordinates.
   */
  min_column_width?: string;
  /** @deprecated Legacy item alignment; superseded by coordinate layout. */
  align_items?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * True when the Home UI should render.
 * Home is the default product path; legacy classic cards only when floors are empty.
 */
export function isShellHomeMode(config: AuShellGridConfig | undefined): boolean {
  if (!config) return true;
  if (Array.isArray(config.floors) && config.floors.length > 0) return true;
  const cards = config.cards ?? [];
  // No floors and no legacy cards → still Home (empty-state / editor-driven).
  return cards.length === 0;
}

/**
 * `au-action-card` - entity-backed tile with entity-default icon, optional label,
 * secondary attribute, and HA-native tap/hold actions (spec 5.2).
 */
export interface AuActionCardConfig extends AuActionCardBaseConfig {
  type: string;
}

export type { AuLightCardConfig } from './light';
export type { AuClimateCardConfig } from './climate';
export type { AuFanCardConfig } from './fan';
export type { AuCoverCardConfig } from './cover';
export type { AuSwitchCardConfig } from './switch';
export type { AuVacuumCardConfig } from './vacuum';
export type { AuDeviceCardConfig, AuDeviceDomain } from './device';
export type {
  AuRoomCardConfig,
  AuRoomCardEntityConfig,
} from './room-card';
export { normalizeRoomCardEntities } from './room-card';
export type {
  AuHomeEntityConfig,
  AuHomeFloorConfig,
  AuHomeRoomConfig,
  AuHomeRoomControlsConfig,
} from './home';

/** Threshold configuration driving contextual state alerts on a readout. */
export interface AuSeverityThresholds {
  /** Value at/beyond which the readout enters a warning state. */
  warn?: number;
  /** Value at/beyond which the readout enters a critical state. */
  critical?: number;
  /** Direction thresholds apply. Default "above". */
  direction?: 'above' | 'below';
}

/**
 * `au-sensor-card` - a linear gauge for environmental readouts with min/max
 * range, dynamic scaling, and contextual state alerts (spec 5.3).
 */
export interface AuSensorCardConfig extends LovelaceCardConfig {
  type: string;
  /** Required target entity. */
  entity: string;
  /** Label. Defaults to the entity's friendly name. */
  name?: string;
  /** Icon override (mdi:*). Defaults to the entity's icon. */
  icon?: string;
  /** Unit override. Defaults to the entity's unit_of_measurement. */
  unit?: string;
  /** Lower bound of the gauge. Default 0. */
  min?: number;
  /** Upper bound of the gauge. Default 100. */
  max?: number;
  /** Decimal precision for the displayed value. */
  precision?: number;
  /** Contextual alert thresholds. */
  severity?: AuSeverityThresholds;
  /** Visual variant. `home` uses Home squircle tile styling. */
  variant?: AuCardVariant;
}
