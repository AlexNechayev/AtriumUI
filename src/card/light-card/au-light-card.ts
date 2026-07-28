import { html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AuActionCardBase } from '../../core/action-card';
import { AuCardContent } from '../../core/card-content';
import { auActionTileLayout } from '../../theme/action-tile-layout';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import { isEntityOffline } from '../../utils/entity';
import { createDebounced } from '../../utils/debounce';
import { PendingControl } from '../../utils/pending-control';
import {
  formatBrightnessLabel,
  formatColorTempLabel,
  getActiveColorControl,
  getColorTempRange,
  getLightBrightness,
  getLightCapabilities,
  getLightColorTemp,
  getLightHue,
  hasLightControls,
  isLightOn,
  rememberLightBrightness,
  setLightBrightness,
  setLightColorTemp,
  setLightHue,
  toggleLight,
  validateLightEntity,
} from '../../utils/light';
import { isLightCardCompact, LIGHT_CARD_LAYOUT_MIN_PX } from '../../utils/light-card-layout';
import type { GestureKind } from '../../utils/pointer-gestures';
import type { HassEntity } from '../../types/home-assistant';
import type { AuLightCardConfig } from '../../types/light';
import '../../components/au-light-slider';
import './au-light-card-editor';

/**
 * `au-light-card` (spec 5.4) - capability-driven light controls with brightness,
 * color temperature, and hue sliders.
 *
 * Display follows hass.states (Mushroom-style). Local PendingControl values
 * apply only while dragging a slider.
 */
@customElement('au-light-card')
export class AuLightCard extends AuActionCardBase<AuLightCardConfig> {
  /** Bumps when PendingControl values change so Lit re-renders. */
  @state() private _pendingRevision = 0;
  @state() private _compact = false;

  private readonly _brightnessPending = new PendingControl<number>();
  private readonly _colorTempPending = new PendingControl<number>();
  private readonly _huePending = new PendingControl<number>();

  private _debouncedBrightness?: ReturnType<typeof createDebounced<[number]>>;
  private _debouncedColorTemp?: ReturnType<typeof createDebounced<[number]>>;
  private _debouncedHue?: ReturnType<typeof createDebounced<[number]>>;
  private _cardObserver?: ResizeObserver;
  private _observedCard?: HTMLElement;

  static override styles = [
    ...AuCardContent.contentStyles,
    auHomeTokens,
    auHomeTileStyles,
    auActionTileLayout,
    css`
      .controls {
        --au-slider-height: 40px;
        --au-slider-thumb-width: 6px;
        --au-slider-grip-height: 14px;
      }
      .au-card.compact .tile {
        gap: calc(var(--au-gap-sm) * 0.75);
      }
      .au-card.compact .icon {
        width: var(--au-control-size);
        height: var(--au-control-size);
        --mdc-icon-size: var(--au-control-glyph);
      }
      .au-card.compact .primary {
        font-size: var(--au-font-primary);
      }
      .au-card.compact .secondary {
        font-size: var(--au-font-secondary);
      }
      .au-card.compact .controls {
        --au-slider-height: 28px;
        --au-slider-thumb-width: 4px;
        --au-slider-grip-height: 10px;
      }
    `,
  ];

  public static getConfigElement(): HTMLElement {
    return document.createElement('au-light-card-editor');
  }

  public static getStubConfig(): AuLightCardConfig {
    return { type: 'custom:au-light-card', entity: '' };
  }

  public override getCardSize(): number {
    if (!this._config || !this.entity) return 1;
    return hasLightControls(this.entity) ? 2 : 1;
  }

  protected override validateConfig(config: AuLightCardConfig): void {
    super.validateConfig(config);
    validateLightEntity(config.entity);
  }

  private _touchPending(): void {
    this._pendingRevision++;
  }

  /** hass.states, or PendingControl brightness until hass clears it. */
  private _resolveOn(entity: HassEntity): boolean {
    if (
      this._brightnessPending.value !== undefined &&
      getLightCapabilities(entity).supportsBrightness &&
      this._config?.show_brightness !== false
    ) {
      return this._brightnessPending.value > 0;
    }
    return isLightOn(entity);
  }

  private _displayBrightness(entity: HassEntity): number {
    const pending = this._brightnessPending.value;
    if (pending !== undefined) return Math.max(0, pending);
    if (!isLightOn(entity)) return 0;
    return getLightBrightness(entity);
  }

  /**
   * When the brightness slider is enabled, show brightness % while the light
   * is on instead of the plain state string (`on` / `off`).
   */
  protected override resolveSecondaryText(entity: HassEntity): string | undefined {
    if (this.secondaryAttribute) {
      return super.resolveSecondaryText(entity);
    }
    const showBrightness =
      getLightCapabilities(entity).supportsBrightness &&
      this._config?.show_brightness !== false;
    const on = this._resolveOn(entity);
    if (showBrightness && on) {
      const brightness = this._displayBrightness(entity);
      return formatBrightnessLabel(Math.max(brightness, 0));
    }
    return on ? entity.state : entity.state === 'unavailable' ? entity.state : 'off';
  }

  protected override resolveAttributeLines(entity: HassEntity): string[] {
    if (!this.showSecondaryAttribute) return [];
    if (this.secondaryAttribute) {
      const line = super.resolveSecondaryText(entity);
      return line !== undefined ? [line] : [];
    }

    const caps = getLightCapabilities(entity);
    const colorControl = getActiveColorControl(entity);
    const showBrightness =
      caps.supportsBrightness && this._config?.show_brightness !== false;
    const showColorTemp =
      colorControl === 'color_temp' && this._config?.show_color_temp !== false;
    const showRgb = colorControl === 'rgb' && this._config?.show_rgb !== false;
    const on = this._resolveOn(entity);

    const lines: string[] = [];
    if (showBrightness && on) {
      lines.push(formatBrightnessLabel(Math.max(this._displayBrightness(entity), 0)));
    } else {
      lines.push(on ? entity.state : entity.state === 'unavailable' ? entity.state : 'off');
    }

    if (on) {
      if (showColorTemp) {
        const colorTemp =
          this._colorTempPending.value ?? getLightColorTemp(entity);
        lines.push(formatColorTempLabel(colorTemp));
      } else if (showRgb) {
        const hue = this._huePending.value ?? getLightHue(entity);
        lines.push(`${Math.round(hue)}°`);
      }
    }

    return lines.slice(0, 2);
  }

  /** Toggle from live hass on/off (Mushroom-style durable truth). */
  protected override fireResolvedAction(kind: GestureKind): void {
    const entity = this.entity;

    if (
      kind === 'tap' &&
      entity &&
      this.hass &&
      !isEntityOffline(entity) &&
      this.tapAction.action === 'toggle'
    ) {
      const currentlyOn = isLightOn(entity);
      let rememberBrightness: number | undefined;
      if (currentlyOn && getLightCapabilities(entity).supportsBrightness) {
        const level =
          this._brightnessPending.value && this._brightnessPending.value > 0
            ? this._brightnessPending.value
            : getLightBrightness(entity);
        if (level > 0) {
          rememberBrightness = level;
          rememberLightBrightness(entity.entity_id, level);
        }
      }

      if (getLightCapabilities(entity).supportsBrightness) {
        void toggleLight(this.hass, entity, {
          currentlyOn,
          rememberBrightness,
        });
      } else {
        void this.hass.callService(
          'light',
          currentlyOn ? 'turn_off' : 'turn_on',
          { entity_id: entity.entity_id },
        );
      }
      return;
    }

    super.fireResolvedAction(kind);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._debouncedBrightness = createDebounced((value: number) => {
      void this._applyBrightness(value);
    }, 300);
    this._debouncedColorTemp = createDebounced((value: number) => {
      void this._applyColorTemp(value);
    }, 300);
    this._debouncedHue = createDebounced((value: number) => {
      void this._applyHue(value);
    }, 300);
    this.registerTeardown(() => this._debouncedBrightness?.cancel());
    this.registerTeardown(() => this._debouncedColorTemp?.cancel());
    this.registerTeardown(() => this._debouncedHue?.cancel());

    // Ask HA to refresh — non-reporting devices may leave hass.states frozen.
    const entityId = this._config?.entity;
    if (this.hass && entityId) {
      void this.hass.callService('homeassistant', 'update_entity', {
        entity_id: entityId,
      });
    }
  }

  public override disconnectedCallback(): void {
    this._debouncedBrightness?.cancel();
    this._debouncedColorTemp?.cancel();
    this._debouncedHue?.cancel();
    this._brightnessPending.clear();
    this._colorTempPending.clear();
    this._huePending.clear();
    this._cardObserver?.disconnect();
    this._observedCard = undefined;
    super.disconnectedCallback();
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('hass')) {
      // Mushroom-style: drop local slider pending when hass updates (unless dragging).
      this._brightnessPending.clearUnlessDragging();
      this._colorTempPending.clearUnlessDragging();
      this._huePending.clearUnlessDragging();
      this._touchPending();
    }
    this._observeCardSize();
  }

  /** Shrink icon and sliders when the grid cell is too small. */
  private _observeCardSize(): void {
    const card = this.renderRoot.querySelector('.au-card') as HTMLElement | null;
    if (!card) return;

    this._syncCompactFromCard(card);

    if (typeof ResizeObserver === 'undefined') return;

    if (!this._cardObserver) {
      this._cardObserver = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (!rect || rect.width < LIGHT_CARD_LAYOUT_MIN_PX) return;
        const compact = isLightCardCompact(rect.width, rect.height);
        if (compact !== this._compact) {
          this._compact = compact;
        }
      });
      this.registerTeardown(() => {
        this._cardObserver?.disconnect();
        this._cardObserver = undefined;
        this._observedCard = undefined;
      });
    }

    if (this._observedCard !== card) {
      this._cardObserver.disconnect();
      this._cardObserver.observe(card);
      this._observedCard = card;
    }
  }

  private _syncCompactFromCard(card: HTMLElement): void {
    const { width, height } = card.getBoundingClientRect();
    if (width < LIGHT_CARD_LAYOUT_MIN_PX) return;
    const compact = isLightCardCompact(width, height);
    if (compact !== this._compact) {
      this._compact = compact;
    }
  }

  private async _applyBrightness(value: number): Promise<void> {
    const entity = this.entity;
    if (!this.hass || !this._config || !entity) return;
    await setLightBrightness(this.hass, entity, this._config.entity, value);
  }

  private async _applyColorTemp(value: number): Promise<void> {
    const entity = this.entity;
    if (!this.hass || !this._config || !entity) return;
    await setLightColorTemp(this.hass, entity, this._config.entity, value);
  }

  private async _applyHue(value: number): Promise<void> {
    const entity = this.entity;
    if (!this.hass || !this._config || !entity) return;
    await setLightHue(this.hass, entity, this._config.entity, value);
  }

  private _renderControls(entity: HassEntity): TemplateResult | typeof nothing {
    // Ensure Lit tracks pending revision when reading PendingControl values.
    void this._pendingRevision;

    const caps = getLightCapabilities(entity);
    const colorControl = getActiveColorControl(entity);
    const offline = isEntityOffline(entity);
    const showBrightness = caps.supportsBrightness && this._config?.show_brightness !== false;
    const showColorTemp =
      colorControl === 'color_temp' && this._config?.show_color_temp !== false;
    const showRgb = colorControl === 'rgb' && this._config?.show_rgb !== false;

    if (!showBrightness && !showColorTemp && !showRgb) return nothing;

    const brightness = this._displayBrightness(entity);
    const colorTemp = this._colorTempPending.value ?? getLightColorTemp(entity);
    const hue = this._huePending.value ?? getLightHue(entity);
    const { min: minKelvin, max: maxKelvin } = getColorTempRange(entity);

    return html`
      <div
        class="controls"
        @pointerdown=${this.stopPropagation}
        @pointerup=${this.stopPropagation}
        @click=${this.stopPropagation}
      >
        ${showBrightness
          ? html`<au-light-slider
              variant="plain"
              label="Brightness"
              .min=${0}
              .max=${255}
              .step=${1}
              .value=${brightness}
              .ariaValueText=${formatBrightnessLabel(Math.max(brightness, 0))}
              .disabled=${offline}
              @value-changing=${(ev: CustomEvent<{ value: number }>) => {
                this._brightnessPending.beginDrag();
                this._brightnessPending.set(ev.detail.value);
                this._touchPending();
                this._debouncedBrightness?.(ev.detail.value);
              }}
              @value-changed=${(ev: CustomEvent<{ value: number }>) => {
                this._brightnessPending.endDrag();
                this._brightnessPending.set(ev.detail.value);
                this._touchPending();
                void this._applyBrightness(ev.detail.value);
              }}
            ></au-light-slider>`
          : nothing}
        ${showColorTemp
          ? html`<au-light-slider
              variant="color_temp"
              label="Warmth"
              .min=${minKelvin}
              .max=${maxKelvin}
              .step=${1}
              .value=${colorTemp}
              .ariaValueText=${formatColorTempLabel(colorTemp)}
              .disabled=${offline}
              @value-changing=${(ev: CustomEvent<{ value: number }>) => {
                this._colorTempPending.beginDrag();
                this._colorTempPending.set(ev.detail.value);
                this._touchPending();
                this._debouncedColorTemp?.(ev.detail.value);
              }}
              @value-changed=${(ev: CustomEvent<{ value: number }>) => {
                this._colorTempPending.endDrag();
                this._colorTempPending.set(ev.detail.value);
                this._touchPending();
                void this._applyColorTemp(ev.detail.value);
              }}
            ></au-light-slider>`
          : nothing}
        ${showRgb
          ? html`<au-light-slider
              variant="hue"
              label="Color"
              .min=${0}
              .max=${360}
              .step=${1}
              .value=${hue}
              .disabled=${offline}
              @value-changing=${(ev: CustomEvent<{ value: number }>) => {
                this._huePending.beginDrag();
                this._huePending.set(ev.detail.value);
                this._touchPending();
                this._debouncedHue?.(ev.detail.value);
              }}
              @value-changed=${(ev: CustomEvent<{ value: number }>) => {
                this._huePending.endDrag();
                this._huePending.set(ev.detail.value);
                this._touchPending();
                void this._applyHue(ev.detail.value);
              }}
            ></au-light-slider>`
          : nothing}
      </div>
    `;
  }

  protected override renderActionBody(_entity: HassEntity): TemplateResult | typeof nothing {
    return nothing;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const entity = this.entity;

    if (!entity) {
      return html`<div class="au-error">
        Entity not found: ${this._config.entity}
      </div>`;
    }

    void this._pendingRevision;
    const active = this._resolveOn(entity);
    const offline = isEntityOffline(entity);
    const ariaLabel = this.showName ? this.resolveName(entity) : this._config.entity;
    const hasControls = !this.isChip && hasLightControls(entity);

    return this.renderCardRoot(
      {
        tile: true,
        active,
        unavailable: offline,
        'has-controls': hasControls,
        compact: this._compact,
        [this.contentLayout]: true,
        'home-tile': this.isHomeVariant,
        chip: this.isChip,
        [this.homeDomainClass(entity.entity_id)]: this.isHomeVariant,
      },
      html`
        ${this.renderHeaderActionButton(this.renderHeaderStack(entity), {
          disabled: offline,
          active,
          ariaLabel,
        })}
        ${hasControls ? this._renderControls(entity) : nothing}
      `,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-light-card': AuLightCard;
  }
}
