import type { AuActionCardBaseConfig } from './action';

/** Section ids for the vacuum settings overlay. */
export type AuVacuumSettingsSection =
  | 'essentials'
  | 'status'
  | 'clean'
  | 'map'
  | 'rooms'
  | 'dock'
  | 'maintenance'
  | 'ai'
  | 'dnd'
  | 'voice'
  | 'advanced';

/**
 * `au-vacuum-card` - dedicated vacuum tile with start/pause/stop/return
 * and an optional full-screen settings dashboard.
 */
export interface AuVacuumCardConfig extends AuActionCardBaseConfig {
  type: string;
  /**
   * Show start / pause / stop / return controls when supported.
   * Default true (classic). Home glance defaults to off unless opted in.
   * Legacy `show_vacuum_controls` is still honored when `show_controls` is unset.
   */
  show_controls?: boolean;
  /** @deprecated Prefer `show_controls`. Kept for remapped device-card YAML. */
  show_vacuum_controls?: boolean;
  /**
   * Show settings gear and open settings on hold (replaces more-info).
   * Default true.
   */
  show_settings?: boolean;
  /**
   * Hide entire settings sections by id
   * (e.g. `ai`, `voice`, `maintenance`, `dnd`, `rooms`).
   */
  hide_sections?: AuVacuumSettingsSection[] | string[];
  /** Initial settings tab when overlay opens. */
  settings_section?: AuVacuumSettingsSection | string;
  /** Log diagnostics. Default false. */
  debug?: boolean;
}
