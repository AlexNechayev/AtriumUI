import type { AuActionCardBaseConfig } from './action';

/**
 * `au-cover-card` - dedicated cover tile with open/close/stop and position.
 */
export interface AuCoverCardConfig extends AuActionCardBaseConfig {
  type: string;
  /** Show open/close/stop controls. Default true. */
  show_controls?: boolean;
  /** Show position slider when supported. Default true. */
  show_position?: boolean;
  /** Log diagnostics. Default false. */
  debug?: boolean;
}
