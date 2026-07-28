import type { AuActionCardBaseConfig } from './action';

/**
 * `au-fan-card` - dedicated fan tile with speed slider/chips, presets,
 * oscillate, and direction controls.
 */
export interface AuFanCardConfig extends AuActionCardBaseConfig {
  type: string;
  /** Show speed control when the entity supports percentage. Default true. */
  show_speed?: boolean;
  /**
   * Speed UI: `slider` (default) or `button` (climate-style expandable
   * icon selector). Only used when `show_speed` is enabled.
   * Legacy alias: `buttons` is accepted and treated as `button`.
   */
  speed_control?: 'slider' | 'button' | 'buttons';
  /** Show preset mode chips when available. Default true. */
  show_preset_modes?: boolean;
  /** Show oscillate toggle when supported. Default true. */
  show_oscillate?: boolean;
  /** Show direction toggle when supported. Default true. */
  show_direction?: boolean;
  /** Log diagnostics to the console. Default false. */
  debug?: boolean;
}
