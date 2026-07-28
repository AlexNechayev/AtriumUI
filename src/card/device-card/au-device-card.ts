import { html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AuActionCardBase } from '../../core/action-card';
import { AuCardContent } from '../../core/card-content';
import { auActionTileLayout } from '../../theme/action-tile-layout';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import { computeDomain, isEntityActive, isEntityOffline } from '../../utils/entity';
import { executeAction } from '../../utils/action';
import {
  getDeviceCapabilities,
  isDeviceActive,
  isSupportedDeviceDomain,
  runPrimaryDeviceAction,
  usesExplicitOnOff,
} from '../../utils/device';
import {
  resolveDomainControl,
  runWaterHeaterTemperature,
  type DomainControlModel,
} from '../../utils/domain-controls';
import {
  clearTimerEndsAt,
  formatTimerRemaining,
  normalizeTimerPresets,
  readTimerEndsAt,
  writeTimerEndsAt,
} from '../../utils/water-heater-timer';
import { turnOffWaterHeater, turnOnWaterHeater } from '../../utils/water-heater';
import { auDebug } from '../../utils/debug';
import { localize } from '../../localize/localize';
import type { GestureKind } from '../../utils/pointer-gestures';
import type { HassEntity } from '../../types/home-assistant';
import type { AuDeviceCardConfig } from '../../types/device';
import '../../components/au-light-slider';
import './au-device-card-editor';

/**
 * `au-device-card` - adaptive multi-domain tile for water_heater
 * and other toggleable domains without a dedicated card.
 *
 * Display follows hass.states (Mushroom-style). No sticky UI on/off memory.
 */
@customElement('au-device-card')
export class AuDeviceCard extends AuActionCardBase<AuDeviceCardConfig> {
  @state() private _pendingTemp?: number;
  @state() private _confirmOpen = false;
  /** Absolute timestamp (ms) when the water-heater off-timer should fire. */
  @state() private _timerEndsAt?: number;
  /** Wall clock for countdown re-renders while a timer is active. */
  @state() private _timerNow = Date.now();
  private _timerInterval?: ReturnType<typeof setInterval>;
  private _timerTeardownRegistered = false;

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
      .tile.unavailable .controls {
        pointer-events: none;
        opacity: 0.45;
      }
      .tile.unavailable .header-action {
        cursor: not-allowed;
      }
      .slider-wrap {
        flex: 1 1 100%;
        min-width: 0;
        --au-slider-height: 28px;
      }
      .confirm-bar {
        display: flex;
        gap: var(--au-gap-sm);
        width: 100%;
        margin-top: var(--au-gap-sm);
      }
      .confirm-bar .ctrl.danger {
        background: color-mix(in srgb, var(--au-error) 22%, transparent);
      }
      .timer-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--au-gap-sm);
        width: 100%;
      }
      .timer-remaining {
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-bold);
        font-variant-numeric: tabular-nums;
        color: var(--au-primary-text);
        min-width: 3.5em;
      }
      .au-card.home-tile.active .timer-remaining {
        color: var(--au-home-on-ink);
      }
      .timer-start {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
    `,
  ];

  public static getConfigElement(): HTMLElement {
    return document.createElement('au-device-card-editor');
  }

  public static getStubConfig(): AuDeviceCardConfig {
    return { type: 'custom:au-device-card', entity: '' };
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._restoreTimerFromStorage();
    if (this._timerEndsAt !== undefined) this._ensureTimerTicker();

    // Ask HA to refresh — non-reporting switches often leave hass.states frozen.
    const entityId = this._config?.entity;
    if (this.hass && entityId && usesExplicitOnOff(entityId)) {
      void this.hass.callService('homeassistant', 'update_entity', {
        entity_id: entityId,
      });
    }
  }

  protected override resolveSecondaryText(entity: HassEntity): string | undefined {
    if (this.secondaryAttribute) {
      return super.resolveSecondaryText(entity);
    }
    if (
      computeDomain(entity.entity_id) === 'water_heater' &&
      this._timerEndsAt !== undefined
    ) {
      return formatTimerRemaining(this._timerEndsAt - this._timerNow);
    }
    return getDeviceCapabilities(entity).secondaryHint ?? entity.state;
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('_config')) {
      this._restoreTimerFromStorage();
    }
    if (changed.has('hass')) {
      this._pendingTemp = undefined;
      // Heater turned off externally → drop the countdown.
      const entity = this.entity;
      if (
        this._timerEndsAt !== undefined &&
        entity &&
        computeDomain(entity.entity_id) === 'water_heater' &&
        !isEntityActive(entity) &&
        !isEntityOffline(entity)
      ) {
        this._clearWaterHeaterTimer();
      }
    }
  }

  private get _showControls(): boolean {
    return this._config?.show_controls !== false;
  }

  private get _showTimer(): boolean {
    return this._config?.show_timer !== false;
  }

  private get _timerPresets(): number[] {
    return normalizeTimerPresets(
      this._config?.timer_presets,
      this._config?.timer_minutes,
    );
  }

  private get _confirmActions(): boolean {
    return this._config?.confirm_actions === true;
  }

  private _ensureTimerTicker(): void {
    if (this._timerEndsAt === undefined) {
      this._stopTimerTicker();
      return;
    }
    if (this._timerInterval !== undefined) return;
    this._timerInterval = setInterval(() => {
      if (this._timerEndsAt === undefined) {
        this._stopTimerTicker();
        return;
      }
      this._timerNow = Date.now();
      if (this._timerNow >= this._timerEndsAt) {
        void this._onWaterHeaterTimerElapsed();
      }
    }, 1000);
    if (!this._timerTeardownRegistered) {
      this._timerTeardownRegistered = true;
      this.registerTeardown(() => {
        this._stopTimerTicker();
        this._timerTeardownRegistered = false;
      });
    }
  }

  private _stopTimerTicker(): void {
    if (this._timerInterval !== undefined) {
      clearInterval(this._timerInterval);
      this._timerInterval = undefined;
    }
  }

  private _restoreTimerFromStorage(): void {
    const entityId = this._config?.entity;
    if (!entityId) {
      this._timerEndsAt = undefined;
      return;
    }
    const endsAt = readTimerEndsAt(entityId);
    this._timerEndsAt = endsAt;
    if (endsAt !== undefined) this._timerNow = Date.now();
  }

  private _clearWaterHeaterTimer(): void {
    const entityId = this._config?.entity;
    if (entityId) clearTimerEndsAt(entityId);
    this._timerEndsAt = undefined;
    this._stopTimerTicker();
  }

  private async _onWaterHeaterTimerElapsed(): Promise<void> {
    const entityId = this._config?.entity;
    const endsAt = this._timerEndsAt;
    this._clearWaterHeaterTimer();
    if (!this.hass || !entityId || endsAt === undefined) return;
    auDebug(this._config?.debug, 'device-card', 'water heater timer elapsed', {
      entity: entityId,
    });
    try {
      await turnOffWaterHeater(this.hass, entityId);
    } catch (err) {
      auDebug(this._config?.debug, 'device-card', 'timer turn_off failed', err);
    }
  }

  private _startWaterHeaterTimer = (ev: Event, minutes: number): void => {
    this._stop(ev);
    void this._withConfirm(async () => {
      if (!this.hass || !this.entity || isEntityOffline(this.entity)) return;
      const entityId = this.entity.entity_id;
      if (!isEntityActive(this.entity)) {
        await turnOnWaterHeater(this.hass, entityId);
      }
      const endsAt = Date.now() + minutes * 60_000;
      writeTimerEndsAt(entityId, endsAt);
      this._timerEndsAt = endsAt;
      this._timerNow = Date.now();
      this._ensureTimerTicker();
      auDebug(this._config?.debug, 'device-card', 'water heater timer started', {
        entity: entityId,
        minutes,
      });
    });
  };

  private _cancelWaterHeaterTimer = (ev: Event): void => {
    this._stop(ev);
    this._clearWaterHeaterTimer();
  };

  private _t(key: Parameters<typeof localize>[1]): string {
    return localize(this.hass?.language, key);
  }

  private _stop = (ev: Event): void => {
    this.stopPropagation(ev);
  };

  private async _withConfirm(run: () => Promise<void>): Promise<void> {
    if (this._confirmActions && !this._confirmOpen) {
      this._confirmOpen = true;
      return;
    }
    this._confirmOpen = false;
    await run();
  }

  private _onConfirm = (ev: Event): void => {
    this._stop(ev);
    void this._withConfirm(async () => {
      if (!this.hass || !this.entity) return;
      const entity = this.entity;
      const currentlyOn = isDeviceActive(entity);
      await runPrimaryDeviceAction(this.hass, entity, { currentlyOn });
    });
  };

  private _onCancelConfirm = (ev: Event): void => {
    this._stop(ev);
    this._confirmOpen = false;
  };

  /**
   * Default/explicit toggle uses domain-aware primary action (scene/water heater/…).
   * Hold / double-tap / other YAML actions go through `executeAction`.
   * Only truly offline (`unavailable`) blocks controls — `unknown` stays usable
   * (many devices never report clean on/off; HA more-info still controls them).
   */
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
      const entity = this.entity!;
      void this._withConfirm(async () => {
        const currentlyOn = isDeviceActive(entity);
        auDebug(this._config?.debug, 'device-card', 'primary action', {
          entity: this._config?.entity,
          currentlyOn,
        });
        await runPrimaryDeviceAction(this.hass!, entity, { currentlyOn });
      });
      return;
    }
    super.fireResolvedAction(kind);
  }

  private _controlModel(entity: HassEntity): DomainControlModel {
    return resolveDomainControl(entity, {
      show_temperature: this._config?.show_temperature,
      show_timer: this._config?.show_timer,
    });
  }

  private _renderControls(entity: HassEntity): TemplateResult | typeof nothing {
    if (!this.hass || isEntityOffline(entity)) return nothing;
    const model = this._controlModel(entity);
    // Water-heater off-timer is independent of `show_controls`.
    if (
      !this._showControls &&
      !(model.kind === 'water_heater' && this._showTimer)
    ) {
      return nothing;
    }
    switch (model.kind) {
      case 'water_heater':
        return this._renderWaterHeaterControls(entity, model);
      default:
        return nothing;
    }
  }

  private _renderWaterHeaterControls(
    entity: HassEntity,
    model: Extract<DomainControlModel, { kind: 'water_heater' }>,
  ): TemplateResult {
    const { caps } = model;
    const showTemp =
      this._showControls &&
      caps.canSetTemperature &&
      this._config?.show_temperature !== false;
    const showTimer = this._showTimer;
    if (!showTemp && !showTimer) return html``;
    const offline = isEntityOffline(entity);
    const temp = this._pendingTemp ?? model.temperature ?? caps.minTemp;
    const running = this._timerEndsAt !== undefined;
    const startLabel = this._t('device.timer_start');
    const cancelLabel = this._t('device.timer_cancel');
    const minLabel = this._t('device.timer_min');
    const presets = this._timerPresets;
    return html`
      <div class="controls" @pointerdown=${this._stop} @click=${this._stop}>
        ${showTemp
          ? html`<div class="slider-wrap">
              <au-light-slider
                .value=${temp}
                .min=${caps.minTemp}
                .max=${caps.maxTemp}
                .step=${caps.step}
                .disabled=${offline}
                label="Temperature"
                @value-changing=${(ev: CustomEvent<{ value: number }>) => {
                  this._pendingTemp = ev.detail.value;
                }}
                @value-changed=${(ev: CustomEvent<{ value: number }>) => {
                  this._pendingTemp = undefined;
                  void runWaterHeaterTemperature(
                    this.hass!,
                    entity.entity_id,
                    ev.detail.value,
                  );
                }}
              ></au-light-slider>
            </div>`
          : nothing}
        ${showTimer
          ? html`<div class="timer-row">
              ${running
                ? html`
                    <span class="timer-remaining" aria-live="polite">
                      ${formatTimerRemaining(
                        (this._timerEndsAt ?? 0) - this._timerNow,
                      )}
                    </span>
                    <button
                      class="ctrl icon"
                      type="button"
                      title=${cancelLabel}
                      aria-label=${cancelLabel}
                      ?disabled=${offline}
                      @click=${this._cancelWaterHeaterTimer}
                    >
                      <ha-icon .icon=${'mdi:timer-off-outline'}></ha-icon>
                    </button>
                  `
                : presets.map(
                    (minutes) => html`
                      <button
                        class="ctrl timer-start"
                        type="button"
                        title=${startLabel}
                        aria-label=${`${startLabel}: ${minutes} ${minLabel}`}
                        ?disabled=${offline}
                        @click=${(ev: Event) =>
                          this._startWaterHeaterTimer(ev, minutes)}
                      >
                        ${minutes} ${minLabel}
                      </button>
                    `,
                  )}
            </div>`
          : nothing}
      </div>
    `;
  }

  protected override renderActionBody(entity: HassEntity): TemplateResult | typeof nothing {
    const controls = this.isChip ? nothing : this._renderControls(entity);
    const offline = isEntityOffline(entity);

    return html`
      ${this.renderHeaderActionButton(this.renderHeaderStack(entity), {
        disabled: offline,
      })}
      ${controls}
      ${!this.isChip && this._confirmOpen
        ? html`<div class="confirm-bar" @pointerdown=${this._stop} @click=${this._stop}>
            <button class="ctrl danger" type="button" @click=${this._onConfirm}>
              ${this._config?.confirm_message?.trim() || this._t('home.confirm')}
            </button>
            <button class="ctrl" type="button" @click=${this._onCancelConfirm}>
              ${this._t('home.cancel')}
            </button>
          </div>`
        : nothing}
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

    const domain = computeDomain(entity.entity_id);
    if (!isSupportedDeviceDomain(domain)) {
      return html`<div class="au-error">
        ${this._t('device.unsupported_domain')}: ${domain}
      </div>`;
    }

    const active = isDeviceActive(entity);
    const offline = isEntityOffline(entity);
    const caps = getDeviceCapabilities(entity);

    const showControls =
      !this.isChip &&
      !offline &&
      ((caps.hasControls && this._showControls) ||
        (domain === 'water_heater' && this._showTimer));

    // Disable base tap/hold on the outer surface; header handles primary action.
    return this.renderCardRoot(
      {
        tile: true,
        active,
        // Only dim when truly offline — `unknown` states stay fully usable.
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
    'au-device-card': AuDeviceCard;
  }
}
