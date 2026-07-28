import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { fireEvent } from '../utils/fire-event';
import { clamp, snapToStep, valueFromClientX } from '../utils/pointer-value';
import {
  bindStopBubble,
  stopPropagation,
  unbindStopBubble,
} from '../utils/stop-bubble';
import { auTokens } from '../theme/tokens';

export type AuLightSliderVariant = 'plain' | 'color_temp' | 'hue';

/**
 * `au-light-slider` - pill-shaped horizontal slider for light card controls.
 *
 * Variants:
 * - `plain` — dark track with warm fill + white handle
 * - `color_temp` — warm-to-cool gradient + white handle
 * - `hue` — rainbow gradient + white handle
 */
@customElement('au-light-slider')
export class AuLightSlider extends LitElement {
  static override styles = [
    auTokens,
    css`
      :host {
        display: block;
        touch-action: none;
        --au-slider-track: color-mix(in srgb, var(--au-primary-text) 72%, black);
        --au-slider-fill: color-mix(in srgb, var(--au-warning, #ff9800) 78%, white);
      }
      .track {
        position: relative;
        height: var(--au-slider-height, 40px);
        border-radius: 999px;
        cursor: pointer;
        outline: none;
        overflow: hidden;
      }
      .track:focus-visible {
        box-shadow: 0 0 0 2px var(--au-accent);
      }
      .track.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }
      .track-base {
        position: absolute;
        inset: 0;
        border-radius: inherit;
      }
      .track.plain .track-base {
        background: var(--au-slider-track);
      }
      .track.color_temp .track-base {
        background: linear-gradient(90deg, #ff9a3c 0%, #fff7ee 50%, #a8c8ff 100%);
      }
      .track.hue .track-base {
        background: linear-gradient(
          90deg,
          hsl(0, 100%, 50%) 0%,
          hsl(60, 100%, 50%) 17%,
          hsl(120, 100%, 50%) 33%,
          hsl(180, 100%, 50%) 50%,
          hsl(240, 100%, 50%) 67%,
          hsl(300, 100%, 50%) 83%,
          hsl(360, 100%, 50%) 100%
        );
      }
      .track-fill {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        border-radius: 999px 0 0 999px;
        background: var(--au-slider-fill);
        pointer-events: none;
      }
      .marker {
        position: absolute;
        top: 0;
        bottom: 0;
        width: var(--au-slider-thumb-width, 6px);
        border-radius: calc(var(--au-slider-thumb-width, 6px) / 2);
        background: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.22);
        pointer-events: none;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .grip {
        width: 1px;
        height: var(--au-slider-grip-height, 14px);
        border-radius: 1px;
        background: color-mix(in srgb, var(--au-primary-text) 45%, transparent);
      }
    `,
  ];

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) value = 0;
  @property({ type: Boolean }) disabled = false;
  @property() label = '';
  /** Screen-reader value, e.g. "33%" or "4000K". */
  @property() ariaValueText = '';
  @property() variant: AuLightSliderVariant = 'plain';

  private _dragging = false;
  private _stopBubble = stopPropagation;

  public override connectedCallback(): void {
    super.connectedCallback();
    bindStopBubble(this, this._stopBubble);
  }

  public override disconnectedCallback(): void {
    unbindStopBubble(this, this._stopBubble);
    super.disconnectedCallback();
  }

  private get _ratio(): number {
    const span = this.max - this.min;
    if (span <= 0) return 0;
    return clamp((this.value - this.min) / span, 0, 1);
  }

  private get _isGradientVariant(): boolean {
    return this.variant === 'color_temp' || this.variant === 'hue';
  }

  private _valueFromClientX(clientX: number): number {
    const track = this.renderRoot.querySelector('.track') as HTMLElement | null;
    if (!track) return this.value;
    return valueFromClientX(clientX, track, this.min, this.max, this.step);
  }

  private _emit(type: 'value-changing' | 'value-changed', value: number): void {
    fireEvent(this, type, { value });
  }

  private _setValue(value: number, emit: 'value-changing' | 'value-changed'): void {
    const next = snapToStep(value, this.min, this.max, this.step);
    if (next === this.value && emit === 'value-changing') return;
    this.value = next;
    this._emit(emit, next);
  }

  private _onPointerDown = (ev: PointerEvent): void => {
    if (this.disabled || ev.button !== 0) return;
    ev.stopPropagation();
    ev.preventDefault();
    this._dragging = true;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    this._setValue(this._valueFromClientX(ev.clientX), 'value-changing');
  };

  private _onPointerMove = (ev: PointerEvent): void => {
    if (!this._dragging || this.disabled) return;
    ev.stopPropagation();
    this._setValue(this._valueFromClientX(ev.clientX), 'value-changing');
  };

  private _onPointerUp = (ev: PointerEvent): void => {
    ev.stopPropagation();
    if (!this._dragging) return;
    this._dragging = false;
    this._setValue(this._valueFromClientX(ev.clientX), 'value-changed');
  };

  private _onKeyDown = (ev: KeyboardEvent): void => {
    if (this.disabled) return;
    ev.stopPropagation();
    let delta = 0;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') delta = this.step;
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') delta = -this.step;
    if (delta === 0) return;
    ev.preventDefault();
    this._setValue(this.value + delta, 'value-changing');
    this._setValue(this.value, 'value-changed');
  };

  protected render() {
    const ratio = this._ratio;
    const markerLeft = `${ratio * 100}%`;
    const gradient = this._isGradientVariant;

    return html`
      <div
        class="track ${this.variant} ${this.disabled ? 'disabled' : ''}"
        tabindex=${this.disabled ? -1 : 0}
        role="slider"
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
        aria-valuetext=${this.ariaValueText || nothing}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label=${this.label || nothing}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @keydown=${this._onKeyDown}
      >
        <div class="track-base"></div>
        ${!gradient
          ? html`<div class="track-fill" style=${styleMap({ width: markerLeft })}></div>`
          : nothing}
        <div class="marker" style=${styleMap({ left: markerLeft })}>
          <span class="grip"></span>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-light-slider': AuLightSlider;
  }
}
