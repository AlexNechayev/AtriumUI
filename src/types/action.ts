/**
 * Home Assistant Lovelace action configuration (tap / hold / double-tap).
 */
import type { LovelaceCardConfig } from './home-assistant';

export interface ActionConfig {
  action:
    | 'more-info'
    | 'toggle'
    | 'call-service'
    | 'perform-action'
    | 'navigate'
    | 'url'
    | 'assist'
    | 'none';
  entity?: string;
  service?: string;
  service_data?: Record<string, unknown>;
  perform_action?: string;
  navigation_path?: string;
  url_path?: string;
}

/** Icon/text arrangement inside an action card tile. */
export type AuActionCardContentLayout = 'horizontal' | 'vertical';

/** Visual treatment for entity tiles. `home` = Apple Home–style squircle. */
export type AuCardVariant = 'default' | 'home';

/** Shared config for cards backed by a single entity with optional tap/hold actions. */
export interface AuActionCardBaseConfig extends LovelaceCardConfig {
  /** Required target entity. */
  entity: string;
  /** Name override. When omitted, the entity friendly name is shown. */
  name?: string;
  /** Show the name line. Default true. */
  show_name?: boolean;
  /** Icon override (mdi:*). When omitted, the entity's default icon is shown. */
  icon?: string;
  /** Show the icon slot. Default true. */
  show_icon?: boolean;
  /** Icon/text arrangement inside the tile. Default horizontal. */
  content_layout?: AuActionCardContentLayout;
  /** Attribute for secondary status line. When omitted, the entity state is shown. */
  secondary_attribute?: string;
  /** Show the secondary status line. Default true. */
  show_secondary_attribute?: boolean;
  /** Visual variant. `home` enables Apple Home–style tiles. Default `default`. */
  variant?: AuCardVariant;
  /**
   * Icon-only circular chip (room-tile light/switch strip). Same tap handlers as
   * a full home tile; layout is compact.
   */
  chip?: boolean;
  /** Tap action. Defaults to `{ action: 'toggle', entity }`. */
  tap_action?: ActionConfig;
  /** Hold action. Defaults to `{ action: 'more-info', entity }`. */
  hold_action?: ActionConfig;
  /** Double-tap action. Defaults to `{ action: 'more-info', entity }` (HA default). */
  double_tap_action?: ActionConfig;
  /** When true, emit `[AtriumUI:…]` sync/action logs to the browser console. */
  debug?: boolean;
}
