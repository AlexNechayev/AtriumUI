import { html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { AuActionCardBase } from '../../core/action-card';
import { AuCardContent } from '../../core/card-content';
import { auActionTileLayout } from '../../theme/action-tile-layout';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import { isEntityActive, isEntityOffline } from '../../utils/entity';
import { executeAction } from '../../utils/action';
import { auDebug } from '../../utils/debug';
import { localize } from '../../localize/localize';
import {
  formatFanSecondary,
  getFanCapabilities,
  getFanDirection,
  getFanPercentage,
  getFanPresetMode,
  getFanSpeedLevels,
  isFanOscillating,
  setFanDirection,
  setFanOscillate,
  setFanPercentage,
  setFanPresetMode,
  toggleFan,
  validateFanEntity,
} from '../../utils/fan';
import type { GestureKind } from '../../utils/pointer-gestures';
import type { HassEntity } from '../../types/home-assistant';
import type { AuFanCardConfig } from '../../types/fan';
import '../../components/au-light-slider';
import '../../components/au-fan-speed-selector';
import './au-fan-card-editor';

/**
 * `au-fan-card` - dedicated fan tile with speed slider/chips, presets,
 * oscillate, and direction.
 */
@customElement('au-fan-card')
export class AuFanCard extends AuActionCardBase<AuFanCardConfig> {
  @state() private _pendingPercentage?: number;

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
      .ctrl.selected {
        background: color-mix(in srgb, var(--au-state-active) 28%, transparent);
        color: var(--au-state-active);
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
      .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--au-gap-sm);
        width: 100%;
      }
      .slider-wrap {
        flex: 1 1 100%;
        min-width: 0;
        --au-slider-height: 28px;
        /* Classic: fill tracks the card on-palette instead of warning orange. */
        --au-slider-fill: color-mix(
          in srgb,
          var(--au-state-active, var(--au-accent)) 78%,
          white
        );
      }
      .tile.active .slider-wrap {
        --au-slider-fill: color-mix(
          in srgb,
          var(--au-state-active, var(--au-accent)) 88%,
          white
        );
      }
      .au-card.home-tile.active .ctrl {
        background: var(--au-home-control-fill-on);
        color: var(--au-home-on-ink);
      }
      .au-card.home-tile.active .ctrl.selected {
        background: rgba(255, 255, 255, 0.92);
        color: var(--au-home-tile-accent, var(--au-home-accent-default));
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
    return document.createElement('au-fan-card-editor');
  }

  public static getStubConfig(): AuFanCardConfig {
    return { type: 'custom:au-fan-card', entity: '' };
  }

  protected override validateConfig(config: AuFanCardConfig): void {
    super.validateConfig(config);
    validateFanEntity(config.entity);
  }

  public override getCardSize(): number {
    if (!this._config || !this.entity) return 1;
    const caps = getFanCapabilities(this.entity);
    return caps.canSetPercentage ||
      caps.canSetPresetMode ||
      caps.canOscillate ||
      caps.canSetDirection
      ? 2
      : 1;
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    const entityId = this._config?.entity;
    if (this.hass && entityId) {
      void this.hass.callService('homeassistant', 'update_entity', {
        entity_id: entityId,
      });
    }
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('hass')) {
      this._pendingPercentage = undefined;
    }
  }

  protected override resolveSecondaryText(entity: HassEntity): string | undefined {
    if (this.secondaryAttribute) {
      return super.resolveSecondaryText(entity);
    }
    return formatFanSecondary(entity);
  }

  private get _speedControl(): 'slider' | 'button' {
    const mode = this._config?.speed_control;
    // Accept legacy `buttons` as an alias for `button`.
    return mode === 'button' || mode === 'buttons' ? 'button' : 'slider';
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
      const entity = this.entity;
      const currentlyOn = isEntityActive(entity);
      auDebug(this._config.debug, 'fan-card', 'toggle', {
        entity: entity.entity_id,
        currentlyOn,
      });
      void toggleFan(this.hass!, entity, { currentlyOn });
      return;
    }
    super.fireResolvedAction(kind);
  }

  private _controlFlags(entity: HassEntity) {
    const caps = getFanCapabilities(entity);
    const showSpeed =
      this._config?.show_speed !== false && caps.canSetPercentage;
    const showPresets =
      this._config?.show_preset_modes !== false &&
      caps.canSetPresetMode &&
      caps.presetModes.length > 0;
    const showOscillate =
      this._config?.show_oscillate !== false && caps.canOscillate;
    const showDirection =
      this._config?.show_direction !== false && caps.canSetDirection;
    return { caps, showSpeed, showPresets, showOscillate, showDirection };
  }

  private _renderSpeed(
    entity: HassEntity,
    offline: boolean,
  ): TemplateResult | typeof nothing {
    const { showSpeed } = this._controlFlags(entity);
    if (!showSpeed) return nothing;
    const percentage = this._pendingPercentage ?? getFanPercentage(entity);
    const speedLabel = this._t('fan.speed');

    if (this._speedControl === 'button') {
      const levels = getFanSpeedLevels(entity);
      const variant = this.isHomeVariant ? 'home' : 'default';
      const active = isEntityActive(entity);
      return html`
        <au-fan-speed-selector
          .levels=${levels}
          .value=${percentage}
          .disabled=${offline}
          .label=${speedLabel}
          layout=${this.contentLayout}
          variant=${variant}
          .onActive=${active}
          @speed-changed=${(ev: CustomEvent<{ value: number }>) => {
            this._pendingPercentage = undefined;
            void setFanPercentage(
              this.hass!,
              entity.entity_id,
              ev.detail.value,
            );
          }}
        ></au-fan-speed-selector>
      `;
    }

    return html`
      <div class="slider-wrap">
        <au-light-slider
          .value=${percentage}
          .min=${0}
          .max=${100}
          label=${speedLabel}
          .disabled=${offline}
          @value-changing=${(ev: CustomEvent<{ value: number }>) => {
            this._pendingPercentage = ev.detail.value;
          }}
          @value-changed=${(ev: CustomEvent<{ value: number }>) => {
            this._pendingPercentage = undefined;
            void setFanPercentage(
              this.hass!,
              entity.entity_id,
              ev.detail.value,
            );
          }}
        ></au-light-slider>
      </div>
    `;
  }

  private _renderPresets(
    entity: HassEntity,
    offline: boolean,
  ): TemplateResult | typeof nothing {
    const { showPresets, caps } = this._controlFlags(entity);
    if (!showPresets) return nothing;
    const current = getFanPresetMode(entity);
    const presetLabel = this._t('fan.preset');
    return html`
      <div class="chip-row" role="group" aria-label=${presetLabel}>
        ${caps.presetModes.map((mode) => {
          const selected = mode === current;
          return html`
            <button
              class=${classMap({ ctrl: true, selected })}
              type="button"
              title=${mode}
              aria-label=${mode}
              aria-pressed=${selected ? 'true' : 'false'}
              ?disabled=${offline}
              @click=${(ev: Event) => {
                this._stop(ev);
                void setFanPresetMode(this.hass!, entity.entity_id, mode);
              }}
            >
              ${mode}
            </button>
          `;
        })}
      </div>
    `;
  }

  private _renderOscillate(
    entity: HassEntity,
    offline: boolean,
  ): TemplateResult | typeof nothing {
    const { showOscillate } = this._controlFlags(entity);
    if (!showOscillate) return nothing;
    const on = isFanOscillating(entity);
    const label = this._t('fan.oscillate');
    return html`
      <button
        class=${classMap({ ctrl: true, icon: true, selected: on })}
        type="button"
        title=${label}
        aria-label=${label}
        aria-pressed=${on ? 'true' : 'false'}
        ?disabled=${offline}
        @click=${(ev: Event) => {
          this._stop(ev);
          void setFanOscillate(this.hass!, entity.entity_id, !on);
        }}
      >
        <ha-icon .icon=${'mdi:arrow-left-right'}></ha-icon>
      </button>
    `;
  }

  private _renderDirection(
    entity: HassEntity,
    offline: boolean,
  ): TemplateResult | typeof nothing {
    const { showDirection } = this._controlFlags(entity);
    if (!showDirection) return nothing;
    const direction = getFanDirection(entity);
    const isReverse = direction === 'reverse';
    const label = isReverse
      ? this._t('fan.direction.reverse')
      : this._t('fan.direction.forward');
    return html`
      <button
        class=${classMap({ ctrl: true, icon: true, selected: isReverse })}
        type="button"
        title=${label}
        aria-label=${label}
        ?disabled=${offline}
        @click=${(ev: Event) => {
          this._stop(ev);
          void setFanDirection(
            this.hass!,
            entity.entity_id,
            isReverse ? 'forward' : 'reverse',
          );
        }}
      >
        <ha-icon
          .icon=${isReverse ? 'mdi:rotate-left' : 'mdi:rotate-right'}
        ></ha-icon>
      </button>
    `;
  }

  private _renderControls(entity: HassEntity): TemplateResult | typeof nothing {
    if (!this.hass || isEntityOffline(entity) || this.isChip) return nothing;
    const { showSpeed, showPresets, showOscillate, showDirection } =
      this._controlFlags(entity);
    if (!showSpeed && !showPresets && !showOscillate && !showDirection) {
      return nothing;
    }
    const offline = isEntityOffline(entity);
    return html`
      <div class="controls" @pointerdown=${this._stop} @click=${this._stop}>
        ${this._renderSpeed(entity, offline)}
        ${this._renderPresets(entity, offline)}
        ${this._renderOscillate(entity, offline)}
        ${this._renderDirection(entity, offline)}
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

    const active = isEntityActive(entity);
    const offline = isEntityOffline(entity);
    const flags = this._controlFlags(entity);
    const showControls =
      !this.isChip &&
      !offline &&
      (flags.showSpeed ||
        flags.showPresets ||
        flags.showOscillate ||
        flags.showDirection);

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
    'au-fan-card': AuFanCard;
  }
}
