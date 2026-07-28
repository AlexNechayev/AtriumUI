import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuActionCardBase } from '../../core/action-card';
import { AuCardContent } from '../../core/card-content';
import { auActionTileLayout } from '../../theme/action-tile-layout';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import { isEntityOffline } from '../../utils/entity';
import { executeAction } from '../../utils/action';
import { auDebug } from '../../utils/debug';
import { localize } from '../../localize/localize';
import {
  formatVacuumSecondary,
  getVacuumCapabilities,
  isVacuumActive,
  pauseVacuum,
  returnVacuum,
  startVacuum,
  stopVacuum,
  toggleVacuum,
  validateVacuumEntity,
} from '../../utils/vacuum';
import type { GestureKind } from '../../utils/pointer-gestures';
import type { HassEntity } from '../../types/home-assistant';
import type { AuVacuumCardConfig } from '../../types/vacuum';
import {
  ensureVacuumSettingsOverlay,
} from './au-vacuum-settings-overlay';
import './au-vacuum-card-editor';

/**
 * `au-vacuum-card` - dedicated vacuum tile with start/pause/stop/return
 * and optional full-screen settings (gear + hold).
 */
@customElement('au-vacuum-card')
export class AuVacuumCard extends AuActionCardBase<AuVacuumCardConfig> {
  static override styles = [
    ...AuCardContent.contentStyles,
    auHomeTokens,
    auHomeTileStyles,
    auActionTileLayout,
    css`
      .controls {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        touch-action: manipulation;
        gap: var(--au-gap-sm);
      }
      .tile.vertical .controls {
        justify-content: center;
        width: 100%;
      }
      .tile.horizontal .controls {
        justify-content: flex-start;
      }
      .ctrl {
        border: none;
        border-radius: 999px;
        padding: 6px 10px;
        background: color-mix(in srgb, var(--au-accent) 14%, transparent);
        color: var(--au-primary-text);
        font: inherit;
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-medium);
        cursor: pointer;
        touch-action: manipulation;
      }
      .ctrl.icon {
        width: var(--au-control-size);
        height: var(--au-control-size);
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        --mdc-icon-size: var(--au-control-glyph);
      }
      .ctrl.settings {
        margin-inline-start: auto;
      }
      .ctrl ha-icon,
      .ctrl ha-icon * {
        pointer-events: none !important;
      }
      .ctrl:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .au-card.home-tile.active .ctrl {
        background: var(--au-home-control-fill-on);
        color: var(--au-home-on-ink);
      }
      .tile.unavailable .controls {
        pointer-events: none;
        opacity: 0.45;
      }
      .tile.unavailable .header-action {
        cursor: not-allowed;
      }
    `,
  ];

  public static getConfigElement(): HTMLElement {
    return document.createElement('au-vacuum-card-editor');
  }

  public static getStubConfig(): AuVacuumCardConfig {
    return { type: 'custom:au-vacuum-card', entity: '' };
  }

  protected override validateConfig(config: AuVacuumCardConfig): void {
    super.validateConfig(config);
    validateVacuumEntity(config.entity);
  }

  public override getCardSize(): number {
    if (!this._config || !this.entity) return 1;
    return this._showControls || this._showSettings ? 2 : 1;
  }

  protected override resolveSecondaryText(entity: HassEntity): string | undefined {
    if (this.secondaryAttribute) {
      return super.resolveSecondaryText(entity);
    }
    return formatVacuumSecondary(entity);
  }

  /**
   * Classic: on unless false. Home glance defaults to off unless opted in.
   * Legacy remapped YAML may still use `show_vacuum_controls`.
   */
  private get _showControls(): boolean {
    const cfg = this._config;
    if (!cfg) return false;
    if (cfg.show_controls !== undefined) return cfg.show_controls !== false;
    if (cfg.show_vacuum_controls === true) return true;
    if (cfg.show_vacuum_controls === false) return false;
    return !this.isHomeVariant;
  }

  /** Settings gear + hold override. Default on. */
  private get _showSettings(): boolean {
    return this._config?.show_settings !== false;
  }

  private _t(key: Parameters<typeof localize>[1]): string {
    return localize(this.hass?.language, key);
  }

  private _stop = (ev: Event): void => {
    this.stopPropagation(ev);
  };

  private _openSettings = (ev?: Event): void => {
    if (ev) this._stop(ev);
    if (!this.hass || !this._config?.entity) return;
    const overlay = ensureVacuumSettingsOverlay();
    overlay.hass = this.hass;
    overlay.vacuumEntityId = this._config.entity;
    overlay.title =
      this._config.name?.trim() ||
      this.entity?.attributes.friendly_name ||
      'Vacuum';
    overlay.hideSections = [...(this._config.hide_sections ?? [])].map(String);
    overlay.open({
      section: this._config.settings_section,
      hideSections: overlay.hideSections,
    });
  };

  protected override fireResolvedAction(kind: GestureKind): void {
    if (!this._config) return;

    if (kind === 'hold' && this._showSettings) {
      // Replace more-info / default hold with settings dashboard.
      const hold = this.holdAction;
      if (hold.action === 'more-info' || hold.action === 'none' || !this._config.hold_action) {
        this._openSettings();
        return;
      }
      // Explicit custom hold_action still wins.
    }

    if (!this.entity || isEntityOffline(this.entity)) {
      if (kind === 'hold' && this._showSettings) {
        this._openSettings();
        return;
      }
      void executeAction(
        this,
        this.hass,
        { action: 'more-info', entity: this._config.entity },
        this._config.entity,
      );
      return;
    }
    if (kind === 'tap' && this.tapAction.action === 'toggle') {
      const entity = this.entity;
      const currentlyOn = isVacuumActive(entity);
      auDebug(this._config.debug, 'vacuum-card', 'toggle', {
        entity: entity.entity_id,
        currentlyOn,
      });
      void toggleVacuum(this.hass!, entity, { currentlyOn });
      return;
    }
    super.fireResolvedAction(kind);
  }

  private _renderControls(entity: HassEntity): TemplateResult | typeof nothing {
    if (!this.hass || this.isChip) return nothing;
    const offline = isEntityOffline(entity);
    const caps = getVacuumCapabilities(entity);
    const showDomain =
      this._showControls &&
      !offline &&
      (caps.canStart || caps.canPause || caps.canStop || caps.canReturn);
    const showSettings = this._showSettings;

    if (!showDomain && !showSettings) return nothing;

    const startLabel = this._t('device.start');
    const pauseLabel = this._t('device.pause');
    const stopLabel = this._t('device.stop');
    const returnLabel = this._t('device.return');

    return html`
      <div class="controls" @pointerdown=${this._stop} @click=${this._stop}>
        ${showDomain && caps.canStart
          ? html`<button
              class="ctrl icon"
              type="button"
              title=${startLabel}
              aria-label=${startLabel}
              ?disabled=${offline}
              @click=${(ev: Event) => {
                this._stop(ev);
                void startVacuum(this.hass!, entity.entity_id);
              }}
            >
              <ha-icon .icon=${'mdi:play'}></ha-icon>
            </button>`
          : nothing}
        ${showDomain && caps.canPause
          ? html`<button
              class="ctrl icon"
              type="button"
              title=${pauseLabel}
              aria-label=${pauseLabel}
              ?disabled=${offline}
              @click=${(ev: Event) => {
                this._stop(ev);
                void pauseVacuum(this.hass!, entity.entity_id);
              }}
            >
              <ha-icon .icon=${'mdi:pause'}></ha-icon>
            </button>`
          : nothing}
        ${showDomain && caps.canStop
          ? html`<button
              class="ctrl icon"
              type="button"
              title=${stopLabel}
              aria-label=${stopLabel}
              ?disabled=${offline}
              @click=${(ev: Event) => {
                this._stop(ev);
                void stopVacuum(this.hass!, entity.entity_id);
              }}
            >
              <ha-icon .icon=${'mdi:stop'}></ha-icon>
            </button>`
          : nothing}
        ${showDomain && caps.canReturn
          ? html`<button
              class="ctrl icon"
              type="button"
              title=${returnLabel}
              aria-label=${returnLabel}
              ?disabled=${offline}
              @click=${(ev: Event) => {
                this._stop(ev);
                void returnVacuum(this.hass!, entity.entity_id);
              }}
            >
              <ha-icon .icon=${'mdi:home-map-marker'}></ha-icon>
            </button>`
          : nothing}
        ${showSettings
          ? html`<button
              class="ctrl icon settings"
              type="button"
              title="Settings"
              aria-label="Settings"
              @click=${(ev: Event) => this._openSettings(ev)}
            >
              <ha-icon .icon=${'mdi:cog'}></ha-icon>
            </button>`
          : nothing}
      </div>
    `;
  }

  protected override renderActionBody(entity: HassEntity): TemplateResult | typeof nothing {
    const offline = isEntityOffline(entity);
    return html`
      ${this.renderHeaderActionButton(this.renderHeaderStack(entity), {
        disabled: offline,
      })}
      ${this._renderControls(entity)}
    `;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const entity = this.entity;

    if (!entity) {
      return html`<div class="au-error">
        ${this._t('home.entity_missing')}: ${this._config.entity}
      </div>`;
    }

    const active = isVacuumActive(entity);
    const offline = isEntityOffline(entity);
    const caps = getVacuumCapabilities(entity);
    const showControls =
      !this.isChip &&
      ((this._showControls &&
        !offline &&
        (caps.canStart || caps.canPause || caps.canStop || caps.canReturn)) ||
        this._showSettings);

    return this.renderCardRoot(
      {
        tile: true,
        active,
        unavailable: offline,
        [this.contentLayout]: true,
        'has-controls': showControls,
        'home-tile': this.isHomeVariant,
        chip: this.isChip,
        [this.homeDomainClass(entity.entity_id)]: this.isHomeVariant,
      },
      this.renderActionBody(entity),
      {
        ariaLabel: this.showName ? this.resolveName(entity) : this._config.entity,
      },
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-vacuum-card': AuVacuumCard;
  }
}
