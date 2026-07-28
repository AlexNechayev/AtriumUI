import type { AuActionCardBaseConfig } from './action';

/** Home Assistant light color modes (supported_color_modes / color_mode). */
export type LightColorMode =
  | 'onoff'
  | 'brightness'
  | 'color_temp'
  | 'hs'
  | 'rgb'
  | 'rgbw'
  | 'rgbww'
  | 'xy'
  | 'white';

/**
 * `au-light-card` (spec 5.4) - capability-driven light controls with brightness,
 * color temperature, and hue sliders.
 */
export interface AuLightCardConfig extends AuActionCardBaseConfig {
  type: string;
  /** Show brightness slider when supported. Default true. */
  show_brightness?: boolean;
  /** Show color-temperature slider when active color_mode is color_temp. Default true. */
  show_color_temp?: boolean;
  /** Show hue slider when active color_mode is rgb/hs/xy. Default true. */
  show_rgb?: boolean;
}
