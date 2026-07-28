import type { AuActionCardBaseConfig } from './action';

/** Home Assistant HVAC modes (`climate` entity state / `hvac_modes`). */
export type HvacMode =
  | 'off'
  | 'heat'
  | 'cool'
  | 'heat_cool'
  | 'auto'
  | 'dry'
  | 'fan_only';

/** Current HVAC action (`attributes.hvac_action`) — what the unit is doing now. */
export type HvacAction =
  | 'off'
  | 'idle'
  | 'heating'
  | 'cooling'
  | 'drying'
  | 'fan'
  | string;

/**
 * `au-climate-card` (spec 5.5) - capability-driven air conditioner / climate
 * controls with HVAC modes, target temperature, and fan modes.
 */
export interface AuClimateCardConfig extends AuActionCardBaseConfig {
  type: string;
  /** Show target temperature control when supported. Default true. */
  show_temperature?: boolean;
  /**
   * Temperature UI: `slider` (default) or `buttons` (− / +).
   * Only used when `show_temperature` is enabled.
   */
  temperature_control?: 'slider' | 'buttons';
  /** Show HVAC mode chips when modes are available. Default true. */
  show_hvac_modes?: boolean;
  /** Show fan mode chips when fan modes are available. Default true. */
  show_fan_mode?: boolean;
}
