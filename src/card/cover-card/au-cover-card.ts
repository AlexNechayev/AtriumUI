import { html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AuActionCardBase } from '../../core/action-card';
import { AuCardContent } from '../../core/card-content';
import { auActionTileLayout } from '../../theme/action-tile-layout';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import { isEntityOffline } from '../../utils/entity';
import { executeAction } from '../../utils/action';
import { auDebug } from '../../utils/debug';
import { localize } from '../../localize/localize';
import {
  closeCover,
  formatCoverSecondary,
  getCoverCapabilities,
  getCoverPosition,
  isCoverOpen,
  openCover,
  setCoverPosition,
  stopCover,
  toggleCover,
  validateCoverEntity,
} from '../../utils/cover';
import type { GestureKind } from '../../utils/pointer-gestures';
import type { HassEntity } from '../../types/home-assistant';
import type { AuCoverCardConfig } from '../../types/cover';
import '../../components/au-light-slider';
import './au-cover-card-editor';

/**
 * `au-cover-card` - dedicated cover tile with open/close/stop and position.
 */
@customElement('au-cover-card')
export class AuCoverCard extends AuActionCardBase<AuCoverCardConfig> {
  @state() private _pendingPosition?: number;

  static override styles = [
    ...AuCardContent.contentStyles,
    auHomeTokens,
    auHomeTileStyles,
    auActionTileLayout,
    css`
      .tile.cover-open .icon {
        color: var(--au-state-open);
        background: color-mix(in srgb, var(--au-state-open) 18%, transparent);
      }
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
      .ctrl ha-icon,
      .ctrl ha-icon * {
        pointer-events: none !important;
      }
      .ctrl:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .slider-wrap {
        flex: 1 1 100%;
        min-width: 0;
        --au-slider-height: 28px;
        --au-slider-fill: color-mix(
          in srgb,
          var(--au-state-active, var(--au-accent)) 78%,
          white
        );
      }
      .tile.active .slider-wrap,
      .tile.cover-open .slider-wrap {
        --au-slider-fill: color-mix(
          in srgb,
          var(--au-state-open, var(--au-state-active)) 88%,
          white
        );
      }
      .au-card.home-tile.active .ctrl,
      .au-card.home-tile.cover-open .ctrl {
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
    return document.createElement('au-cover-card-editor');
  }

  public static getStubConfig(): AuCoverCardConfig {
    return { type: 'custom:au-cover-card', entity: '' };
  }

  protected override validateConfig(config: AuCoverCardConfig): void {
    super.validateConfig(config);
    validateCoverEntity(config.entity);
  }

  public override getCardSize(): number {
    if (!this._config || !this.entity) return 1;
    const caps = getCoverCapabilities(this.entity);
    return caps.canSetPosition || caps.canOpen || caps.canClose ? 2 : 1;
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('hass')) {
      this._pendingPosition = undefined;
    }
  }

  protected override resolveSecondaryText(entity: HassEntity): string | undefined {
    if (this.secondaryAttribute) {
      return super.resolveSecondaryText(entity);
    }
    return formatCoverSecondary(entity);
  }

  private get _showControls(): boolean {
    return this._config?.show_controls !== false;
  }

  private get _showPosition(): boolean {
    return this._config?.show_position !== false;
  }

  private _t(key: Parameters<typeof localize>[1]): string {
    return localize(this.hass?.language, key);
  }

  private _stop = (ev: Event): void => {
    this.stopPropagation(ev);
  };

  protected override fireResolvedAction(kind: GestureKind): void {
    if (!this._config) return;
    if (!this.entity || isEntityOffline(this.entity)) {
      void executeAction(
        this,
        this.hass,
        { action: 'more-info', entity: this._config.entity },
        this._config.entity,
      );
      return;
    }
    if (kind === 'tap' && this.tapAction.action === 'toggle') {
      auDebug(this._config.debug, 'cover-card', 'toggle', {
        entity: this.entity.entity_id,
      });
      void toggleCover(this.hass!, this.entity.entity_id);
      return;
    }
    super.fireResolvedAction(kind);
  }

  private _renderControls(entity: HassEntity): TemplateResult | typeof nothing {
    if (!this.hass || isEntityOffline(entity) || this.isChip || !this._showControls) {
      return nothing;
    }
    const caps = getCoverCapabilities(entity);
    const position = this._showPosition
      ? (this._pendingPosition ?? getCoverPosition(entity))
      : undefined;
    const offline = isEntityOffline(entity);
    const openLabel = this._t('device.open');
    const closeLabel = this._t('device.close');
    const stopLabel = this._t('device.stop');
    if (
      !caps.canOpen &&
      !caps.canClose &&
      !caps.canStop &&
      position === undefined
    ) {
      return nothing;
    }

    return html`
      <div class="controls" @pointerdown=${this._stop} @click=${this._stop}>
        ${caps.canOpen
          ? html`<button
              class="ctrl icon"
              type="button"
              title=${openLabel}
              aria-label=${openLabel}
              ?disabled=${offline}
              @click=${(ev: Event) => {
                this._stop(ev);
                void openCover(this.hass!, entity.entity_id);
              }}
            >
              <ha-icon .icon=${'mdi:arrow-up'}></ha-icon>
            </button>`
          : nothing}
        ${caps.canClose
          ? html`<button
              class="ctrl icon"
              type="button"
              title=${closeLabel}
              aria-label=${closeLabel}
              ?disabled=${offline}
              @click=${(ev: Event) => {
                this._stop(ev);
                void closeCover(this.hass!, entity.entity_id);
              }}
            >
              <ha-icon .icon=${'mdi:arrow-down'}></ha-icon>
            </button>`
          : nothing}
        ${caps.canStop
          ? html`<button
              class="ctrl icon"
              type="button"
              title=${stopLabel}
              aria-label=${stopLabel}
              ?disabled=${offline}
              @click=${(ev: Event) => {
                this._stop(ev);
                void stopCover(this.hass!, entity.entity_id);
              }}
            >
              <ha-icon .icon=${'mdi:stop'}></ha-icon>
            </button>`
          : nothing}
        ${caps.canSetPosition && position !== undefined
          ? html`<div class="slider-wrap">
              <au-light-slider
                .value=${position}
                .min=${0}
                .max=${100}
                .disabled=${offline}
                label="Position"
                @value-changing=${(ev: CustomEvent<{ value: number }>) => {
                  this._pendingPosition = ev.detail.value;
                }}
                @value-changed=${(ev: CustomEvent<{ value: number }>) => {
                  this._pendingPosition = undefined;
                  void setCoverPosition(
                    this.hass!,
                    entity.entity_id,
                    ev.detail.value,
                  );
                }}
              ></au-light-slider>
            </div>`
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

    const coverOpen = isCoverOpen(entity);
    const offline = isEntityOffline(entity);
    const caps = getCoverCapabilities(entity);
    const showControls =
      !this.isChip &&
      !offline &&
      this._showControls &&
      (caps.canOpen ||
        caps.canClose ||
        caps.canStop ||
        (this._showPosition && caps.canSetPosition));

    return this.renderCardRoot(
      {
        tile: true,
        active: coverOpen,
        'cover-open': coverOpen,
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
    'au-cover-card': AuCoverCard;
  }
}
