import type { AuActionCardBaseConfig } from './action';

/**
 * `au-switch-card` - dedicated switch toggle tile.
 */
export interface AuSwitchCardConfig extends AuActionCardBaseConfig {
  type: string;
  /** Log diagnostics. Default false. */
  debug?: boolean;
}
