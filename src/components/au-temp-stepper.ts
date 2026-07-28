import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { fireEvent } from '../utils/fire-event';
import { clamp, snapToStep, valueFromClientX } from '../utils/pointer-value';
import {
  bindStopBubble,
  stopPropagation,
  unbindStopBubble,
} from '../utils/stop-bubble';
import { auTokens } from '../theme/tokens';

export type AuTempControlMode = 'slider' | 'buttons';

/**
 * `au-temp-stepper` - target temperature control for climate cards.
 * Default UI is a slider; set `control="buttons"` for − / + steppers.
 */
@customElement('au-temp-stepper')
export class AuTempStepper extends LitElement {
  static override styles = [
    auTokens,
    css`
      :host {
        display: block;
        touch-action: none;
      }
      .readout {
        text-align: center;
        font-size: 1.35rem;
        font-weight: var(--au-weight-medium);
        color: var(--au-primary-text);
        margin-bottom: var(--au-gap-sm);
        line-height: 1.1;
      }
      .unit {
        font-size: 0.875rem;
        color: var(--au-secondary-text);
        font-weight: var(--au-weight-normal);
        margin-left: 2px;
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
        background: color-mix(in srgb, var(--au-primary-text) 72%, black);
      }
      .track-fill {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        border-radius: 999px 0 0 999px;
        background: color-mix(in srgb, var(--au-accent) 72%, white);
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

      .buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--au-gap);
        width: 100%;
      }
      .btn {
        appearance: none;
        border: none;
        width: var(--au-control-size, 32px);
        height: var(--au-control-size, 32px);
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        cursor: pointer;
        font: inherit;
        font-size: 1.25rem;
        font-weight: 500;
        line-height: 1;
        color: var(--au-primary-text);
        background: color-mix(in srgb, var(--au-accent) 16%, transparent);
        outline: none;
        touch-action: manipulation;
      }
      .btn:hover:not(:disabled) {
        background: color-mix(in srgb, var(--au-accent) 26%, transparent);
      }
      .btn:focus-visible {
        box-shadow: 0 0 0 2px var(--au-accent);
      }
      .btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .buttons .readout {
        margin: 0;
        flex: 1;
        min-width: 0;
      }

      /* Apple Home–style compact slider */
      .home .readout {
        display: none;
      }
      .home .track {
        height: var(--au-slider-height, 28px);
        background: transparent;
      }
      .home .track-base {
        background: var(--au-slider-track, var(--au-home-control-fill-track));
      }
      .home .track-fill {
        background: var(
          --au-slider-fill,
          color-mix(in srgb, var(--au-home-accent-climate, #ff9f0a) 75%, white)
        );
      }
      .home .marker {
        width: 10px;
        border-radius: 999px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.18);
      }
      .home .grip {
        display: none;
      }
      .home .btn {
        width: var(--au-control-size, 32px);
        height: var(--au-control-size, 32px);
        background: var(--au-home-control-fill-strong);
        color: var(--au-home-label, var(--au-primary-text));
      }
      .home.on-active .btn {
        background: rgba(255, 255, 255, 0.22);
        color: #fff;
      }
      .home .buttons .readout {
        display: none;
      }
      .home .buttons {
        justify-content: center;
        gap: var(--au-gap, 12px);
      }
    `,
  ];

  @property({ type: Number }) min = 16;
  @property({ type: Number }) max = 30;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) value = 22;
  @property() unit = '°C';
  @property({ type: Boolean }) disabled = false;
  @property() label = 'Target temperature';
  /** Visual variant: `home` hides the readout (parent shows a hero temp). */
  @property() variant: 'default' | 'home' = 'default';
  /** `slider` (default) or `buttons` (− / +). */
  @property() control: AuTempControlMode = 'slider';
  /** When true with home variant, use light-on-fill button colors. */
  @property({ type: Boolean, attribute: 'on-active' }) onActive = false;

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

  private get _displayValue(): string {
    return Number.isInteger(this.value) ? String(this.value) : this.value.toFixed(1);
  }

  private get _ariaValueText(): string {
    return `${this._displayValue}${this.unit}`;
  }

  private get _canDecrease(): boolean {
    return !this.disabled && this.value > this.min;
  }

  private get _canIncrease(): boolean {
    return !this.disabled && this.value < this.max;
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
    const rounded = Number(next.toFixed(2));
    if (rounded === this.value && emit === 'value-changing') return;
    this.value = rounded;
    this._emit(emit, this.value);
  }

  private _nudge(delta: number): void {
    if (this.disabled) return;
    this._setValue(this.value + delta, 'value-changing');
    this._setValue(this.value, 'value-changed');
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
    this._nudge(delta);
  };

  private _onDecrease = (ev: Event): void => {
    ev.stopPropagation();
    this._nudge(-this.step);
  };

  private _onIncrease = (ev: Event): void => {
    ev.stopPropagation();
    this._nudge(this.step);
  };

  private _renderButtons() {
    return html`
      <div
        class="buttons"
        role="group"
        aria-label=${this.label}
      >
        <button
          type="button"
          class="btn"
          aria-label=${`Decrease ${this.label}`}
          ?disabled=${!this._canDecrease}
          @click=${this._onDecrease}
        >
          −
        </button>
        <div class="readout" aria-live="polite">
          ${this._displayValue}<span class="unit">${this.unit}</span>
        </div>
        <button
          type="button"
          class="btn"
          aria-label=${`Increase ${this.label}`}
          ?disabled=${!this._canIncrease}
          @click=${this._onIncrease}
        >
          +
        </button>
      </div>
    `;
  }

  private _renderSlider() {
    const markerLeft = `${this._ratio * 100}%`;

    return html`
      <div class="readout" aria-hidden="true">
        ${this._displayValue}<span class="unit">${this.unit}</span>
      </div>
      <div
        class=${classMap({
          track: true,
          disabled: this.disabled,
        })}
        tabindex=${this.disabled ? -1 : 0}
        role="slider"
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
        aria-valuetext=${this._ariaValueText}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label=${this.label}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @keydown=${this._onKeyDown}
      >
        <div class="track-base"></div>
        <div class="track-fill" style=${styleMap({ width: markerLeft })}></div>
        <div class="marker" style=${styleMap({ left: markerLeft })}>
          <span class="grip"></span>
        </div>
      </div>
    `;
  }

  protected render() {
    return html`
      <div
        class=${classMap({
          home: this.variant === 'home',
          'on-active': this.variant === 'home' && this.onActive,
        })}
      >
        ${this.control === 'buttons' ? this._renderButtons() : this._renderSlider()}
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'au-temp-stepper': AuTempStepper;
  }
}
