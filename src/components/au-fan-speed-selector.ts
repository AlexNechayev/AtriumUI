import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { fireEvent } from '../utils/fire-event';
import {
  formatFanSpeedLabel,
  getFanSpeedIcon,
} from '../utils/fan';
import {
  bindStopBubble,
  stopPropagation,
  unbindStopBubble,
} from '../utils/stop-bubble';
import { auTokens } from '../theme/tokens';

/**
 * `au-fan-speed-selector` — climate-style speed control: one trigger shows the
 * current speed icon; click expands all percentage options.
 *
 * - `vertical`: trigger + options centered; options wrap to new rows if needed
 * - `horizontal`: trigger at inline-start; options open start → end (RTL/LTR)
 */
@customElement('au-fan-speed-selector')
export class AuFanSpeedSelector extends LitElement {
  static override styles = [
    auTokens,
    css`
      :host {
        display: block;
        max-width: 100%;
        min-width: 0;
        touch-action: manipulation;
        position: relative;
        z-index: 1;
        overflow: visible;
      }
      :host([layout='vertical']) {
        width: 100%;
      }
      :host([layout='horizontal']) {
        width: max-content;
      }

      .selectors {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--au-gap-sm);
        min-width: 0;
        position: relative;
        overflow: visible;
      }

      /* Vertical: center trigger and wrapped option rows */
      .layout-vertical .selectors {
        justify-content: center;
        width: 100%;
      }
      .layout-vertical .option-grid {
        position: absolute;
        inset-inline: 0;
        top: 0;
        justify-content: center;
        width: 100%;
        max-width: 100%;
        flex-wrap: wrap;
      }

      /* Horizontal: start-aligned; options flow start → end (logical) */
      .layout-horizontal .selectors {
        justify-content: flex-start;
        width: max-content;
        max-width: 100%;
      }
      .layout-horizontal .option-grid {
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: auto;
        top: 0;
        justify-content: flex-start;
        width: max-content;
        max-width: min(100vw, 100%);
        flex-wrap: wrap;
      }

      .trigger,
      .option {
        appearance: none;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        background: color-mix(in srgb, var(--au-primary-text) 6%, transparent);
        color: var(--au-primary-text);
        border-radius: 50%;
        width: var(--au-control-size, 32px);
        height: var(--au-control-size, 32px);
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        outline: none;
        flex: 0 0 auto;
        --mdc-icon-size: var(--au-control-glyph, 18px);
      }
      .trigger {
        background: color-mix(in srgb, var(--au-accent) 22%, transparent);
        border-color: color-mix(in srgb, var(--au-accent) 55%, transparent);
        color: var(--au-accent);
      }
      .trigger[aria-expanded='true'],
      .option.selected {
        background: color-mix(in srgb, var(--au-accent) 22%, transparent);
        border-color: color-mix(in srgb, var(--au-accent) 55%, transparent);
        color: var(--au-accent);
      }
      .trigger:focus-visible,
      .option:focus-visible {
        box-shadow: 0 0 0 2px var(--au-accent);
      }
      .trigger:disabled,
      .option:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .selectors.expanded .trigger {
        visibility: hidden;
        pointer-events: none;
      }
      .option-grid {
        --au-mode-chip-size: var(--au-control-size, 32px);
        --au-mode-gap: var(--au-gap-sm, 8px);
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--au-mode-gap);
        min-width: 0;
        z-index: 8;
        pointer-events: auto;
        box-sizing: border-box;
      }
      .option-grid .option {
        flex: 0 0 auto;
      }

      .home .trigger,
      .home .option {
        width: var(--au-control-size, 32px);
        height: var(--au-control-size, 32px);
        border: none;
        background: var(--au-home-control-fill-strong);
        color: var(--au-home-label, var(--au-primary-text));
        --mdc-icon-size: var(--au-control-glyph, 18px);
        transition:
          background-color 180ms ease,
          color 180ms ease,
          transform 160ms ease;
      }
      .home .trigger:hover,
      .home .option:hover {
        transform: scale(1.05);
      }
      .home .trigger,
      .home .trigger[aria-expanded='true'],
      .home .option.selected {
        background: color-mix(
          in srgb,
          var(--au-home-tile-accent, var(--au-home-accent-default, #0a84ff)) 28%,
          transparent
        );
        color: var(--au-home-tile-accent, var(--au-home-accent-default, #0a84ff));
      }
      .home.on-active .trigger,
      .home.on-active .option {
        background: rgba(255, 255, 255, 0.22);
        color: #fff;
      }
      .home.on-active .trigger,
      .home.on-active .trigger[aria-expanded='true'],
      .home.on-active .option.selected {
        background: rgba(255, 255, 255, 0.34);
        color: #fff;
      }
    `,
  ];

  /** Discrete percentage levels (includes 0). */
  @property({ attribute: false }) levels: number[] = [];
  /** Current percentage. */
  @property({ type: Number }) value = 0;
  @property({ type: Boolean }) disabled = false;
  @property() variant: 'default' | 'home' = 'default';
  @property({ type: Boolean, attribute: 'on-active' }) onActive = false;
  /**
   * Card content layout:
   * - `vertical` — center trigger/options; wrap rows when too wide
   * - `horizontal` — align start; open options start → end (RTL/LTR)
   */
  @property({ reflect: true }) layout: 'vertical' | 'horizontal' = 'vertical';
  /** Accessible group label. */
  @property() label = 'Speed';

  @state() private _expanded = false;

  private _stopBubble = stopPropagation;

  private _onDocPointerDown = (ev: Event): void => {
    if (!this._expanded) return;
    const path = ev.composedPath();
    if (!path.includes(this)) {
      this._expanded = false;
    }
  };

  public override connectedCallback(): void {
    super.connectedCallback();
    bindStopBubble(this, this._stopBubble);
    document.addEventListener('pointerdown', this._onDocPointerDown, true);
  }

  public override disconnectedCallback(): void {
    unbindStopBubble(this, this._stopBubble);
    document.removeEventListener('pointerdown', this._onDocPointerDown, true);
    super.disconnectedCallback();
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('disabled') && this.disabled) {
      this._expanded = false;
    }
  }

  private _nearestLevel(percentage: number): number {
    const levels = this.levels;
    if (levels.length === 0) return 0;
    let best = levels[0]!;
    let bestDist = Math.abs(percentage - best);
    for (const level of levels) {
      const dist = Math.abs(percentage - level);
      if (dist < bestDist) {
        best = level;
        bestDist = dist;
      }
    }
    return best;
  }

  private get _selected(): number {
    return this._nearestLevel(this.value);
  }

  private _toggle = (): void => {
    if (this.disabled) return;
    this._expanded = !this._expanded;
  };

  private _onSelect = (level: number): void => {
    if (this.disabled) return;
    if (level !== this.value) {
      this.value = level;
      fireEvent(this, 'speed-changed', { value: level });
    }
    this._expanded = false;
  };

  protected render() {
    if (this.levels.length === 0) return nothing;
    const selected = this._selected;
    const selectedLabel = formatFanSpeedLabel(selected);
    const isVertical = this.layout !== 'horizontal';

    return html`
      <div
        class=${classMap({
          home: this.variant === 'home',
          'on-active': this.variant === 'home' && this.onActive,
          'layout-vertical': isVertical,
          'layout-horizontal': !isVertical,
        })}
      >
        <div
          class=${classMap({
            selectors: true,
            expanded: this._expanded,
          })}
        >
          <button
            type="button"
            class="trigger"
            aria-expanded=${this._expanded ? 'true' : 'false'}
            aria-haspopup="listbox"
            aria-label=${`${this.label}: ${selectedLabel}`}
            .disabled=${this.disabled}
            @click=${this._toggle}
          >
            <ha-icon .icon=${getFanSpeedIcon(selected, this.levels)}></ha-icon>
          </button>
          ${this._expanded
            ? html`
                <div
                  class="option-grid"
                  role="radiogroup"
                  aria-label=${this.label}
                >
                  ${this.levels.map((level) => {
                    const label = formatFanSpeedLabel(level);
                    const isSelected = level === selected;
                    return html`
                      <button
                        type="button"
                        class="option ${classMap({ selected: isSelected })}"
                        role="radio"
                        aria-checked=${isSelected ? 'true' : 'false'}
                        aria-label=${label}
                        title=${label}
                        .disabled=${this.disabled}
                        @click=${() => this._onSelect(level)}
                      >
                        <ha-icon
                          .icon=${getFanSpeedIcon(level, this.levels)}
                        ></ha-icon>
                      </button>
                    `;
                  })}
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-fan-speed-selector': AuFanSpeedSelector;
  }
}
