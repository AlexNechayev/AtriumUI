/**
 * Adaptive multi-domain device card configuration (`au-device-card`).
 */
import type { AuActionCardBaseConfig } from './action';

/** Domains with first-class adapters in the device card. */
export type AuDeviceDomain =
  | 'water_heater'
  | 'media_player'
  | 'humidifier'
  | 'input_boolean'
  | 'scene'
  | 'script'
  | 'remote'
  | 'automation';

export interface AuDeviceCardConfig extends AuActionCardBaseConfig {
  type: string;
  /** Log diagnostics to the console. Default false. */
  debug?: boolean;
  /** Show domain-specific primary controls when supported. Default true. */
  show_controls?: boolean;
  /** Require confirmation before high-stakes actions (P2). Default false. */
  confirm_actions?: boolean;
  /** Confirmation message override when `confirm_actions` is true. */
  confirm_message?: string;
  /** Hide water heater temperature controls. */
  show_temperature?: boolean;
  /**
   * Show the water-heater off-timer control. Default true.
   * Timer runs in the browser and calls `water_heater.turn_off` when it ends.
   */
  show_timer?: boolean;
  /**
   * Quick-select off-timer durations in minutes (e.g. `[15, 30, 60]`).
   * GUI editor accepts a comma-separated string. Default `15, 30, 60`.
   */
  timer_presets?: number[] | string;
  /**
   * Fallback single duration (minutes) when `timer_presets` is empty.
   * Prefer `timer_presets` for multiple options.
   */
  timer_minutes?: number;
}
