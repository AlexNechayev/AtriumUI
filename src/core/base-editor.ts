import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceConfig,
} from '../types/home-assistant';
import { fireEvent } from '../utils/fire-event';
import { normalizeAuHomeCardConfig } from '../utils/home-card-type';

/**
 * `AuBaseEditor` - shared foundation for the visual Lovelace editors (spec 6).
 *
 * Editors are lightweight form hosts: they receive the current config via
 * `setConfig`, render HA-native input controls (`ha-form`, `ha-entity-picker`,
 * `ha-icon-picker`), and emit `config-changed` so the dashboard stays in sync.
 */
export abstract class AuBaseEditor<
  TConfig extends LovelaceCardConfig = LovelaceCardConfig,
> extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  /** Injected by HA when present; forwarded to nested card editors/pickers. */
  @property({ attribute: false }) public lovelace?: LovelaceConfig;
  @state() protected _config?: TConfig;

  public setConfig(config: TConfig): void {
    this._config = { ...config } as TConfig;
  }

  /** Align remappable Atrium card `type` with the bound entity domain. */
  protected _normalizeConfig(config: TConfig): TConfig {
    return normalizeAuHomeCardConfig(config).card as TConfig;
  }

  /** Handle the aggregate `value-changed` event emitted by `<ha-form>`. */
  protected _formChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = this._normalizeConfig(
      (ev.detail as { value: TConfig }).value,
    );
    // Keep editor state in sync — otherwise `.data=${this._config}` stays stale
    // and Save can persist an empty/old entity while the form looks updated.
    this._config = value;
    fireEvent(this, 'config-changed', { config: value });
  };

  /** Emit a patched config from an individual field change. */
  protected _emitConfig(patch: Partial<TConfig>): void {
    if (!this._config) return;
    const merged = { ...this._config, ...patch } as TConfig;
    // Drop keys explicitly set to undefined/empty so YAML stays clean.
    for (const key of Object.keys(patch) as Array<keyof TConfig>) {
      const val = merged[key];
      if (val === undefined || val === '') {
        delete merged[key];
      }
    }
    const config = this._normalizeConfig(merged);
    this._config = config;
    fireEvent(this, 'config-changed', { config });
  }
}
