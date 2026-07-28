import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { fireEvent } from '../utils/fire-event';
import {
  formatFanModeLabel,
  formatHvacModeLabel,
  getFanModeIcon,
  getHvacModeIcon,
} from '../utils/climate';
import {
  bindStopBubble,
  stopPropagation,
  unbindStopBubble,
} from '../utils/stop-bubble';
import { auTokens } from '../theme/tokens';

type SelectorPanel = 'hvac' | 'fan' | null;

/**
 * `au-climate-selectors` - Mode/Fan icon selectors with mutual hide and
 * in-container option grid.
 */
@customElement('au-climate-selectors')
export class AuClimateSelectors extends LitElement {
  static override styles = [
    auTokens,
    css`
      :host {
        display: block;
        width: max-content;
        max-width: 100%;
        min-width: 0;
        touch-action: manipulation;
        position: relative;
        z-index: 1;
        overflow: visible;
      }
      .selectors {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: var(--au-gap-sm);
        min-width: 0;
        width: auto;
        position: relative;
        overflow: visible;
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
      /* Invisible placeholders keep the exact trigger footprint while open */
      .selectors.expanded .trigger {
        visibility: hidden;
        pointer-events: none;
      }
      .option-grid {
        --au-mode-chip-size: var(--au-control-size, 32px);
        --au-mode-gap: var(--au-gap-sm, 8px);
        gap: var(--au-mode-gap);
        width: max-content;
        max-width: none;
        min-width: 0;
        position: absolute;
        /* Physical end edge — grow into the card, not past it */
        right: 0;
        left: auto;
        z-index: 8;
        pointer-events: auto;
        box-sizing: border-box;
      }
      /* Slider mode: 2 rows × N columns; stretch to trigger column, grow left */
      .option-grid.rows-2 {
        display: grid;
        grid-template-rows: repeat(2, var(--au-mode-chip-size, 32px));
        grid-auto-flow: column;
        grid-auto-columns: var(--au-mode-chip-size, 32px);
        justify-items: center;
        align-items: center;
        top: 0;
        bottom: 0;
        height: auto;
        direction: ltr;
      }
      /* Buttons mode: 2 columns × N rows, fill bottom → top.
         Never clamp with max-width:% — host is often only 1 trigger wide. */
      .option-grid.cols-2 {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap-reverse;
        align-content: flex-end;
        justify-content: flex-end;
        top: auto;
        bottom: 0;
        width: calc(
          var(--au-mode-chip-size, 32px) * 2 + var(--au-mode-gap, 8px)
        );
        max-width: none;
      }
      .option-grid.cols-2 .option {
        flex: 0 0 auto;
      }

      /* Apple Home–style frosted chips */
      .home .selectors {
        gap: var(--au-gap-sm, 8px);
      }
      .home.column .selectors {
        flex-direction: column;
        align-items: flex-end;
        width: auto;
      }
      .home.row .selectors {
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        width: auto;
      }
      .home .option-grid {
        --au-mode-chip-size: var(--au-control-size, 32px);
        --au-mode-gap: var(--au-gap-sm, 8px);
        gap: var(--au-mode-gap);
      }
      .home .option-grid.rows-2 {
        grid-template-rows: repeat(2, var(--au-mode-chip-size, 32px));
        grid-auto-columns: var(--au-mode-chip-size, 32px);
      }
      .home .option-grid.cols-2 {
        width: calc(
          var(--au-mode-chip-size, 32px) * 2 + var(--au-mode-gap, 8px)
        );
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
          var(--au-home-accent-climate, #ff9f0a) 28%,
          transparent
        );
        color: var(--au-home-accent-climate, #ff9f0a);
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

  @property({ type: Boolean }) showHvac = true;
  @property({ type: Boolean }) showFan = true;
  @property({ attribute: false }) hvacModes: string[] = [];
  @property() hvacValue = '';
  @property({ attribute: false }) fanModes: string[] = [];
  @property() fanValue = '';
  @property({ type: Boolean }) disabled = false;
  /** Disable only the fan trigger (e.g. climate HVAC is off). */
  @property({ type: Boolean, attribute: 'fan-disabled' }) fanDisabled = false;
  /** Visual variant for Home tiles. */
  @property() variant: 'default' | 'home' = 'default';
  /** When true (home + active parent tile), use light-on-fill chip colors. */
  @property({ type: Boolean, attribute: 'on-active' }) onActive = false;
  /** Stack HVAC/fan triggers vertically (horizontal home climate beside hero). */
  @property({ type: Boolean, attribute: 'stack-vertical' }) stackVertical = false;
  /**
   * Open option panel layout:
   * - `rows` (default): 2 rows × N columns
   * - `cols`: 2 columns × N rows, filled bottom → top
   */
  @property() optionLayout: 'rows' | 'cols' = 'rows';

  @state() private _panel: SelectorPanel = null;

  private _stopBubble = stopPropagation;

  private _onDocPointerDown = (ev: Event): void => {
    if (!this._panel) return;
    const path = ev.composedPath();
    if (!path.includes(this)) {
      this._panel = null;
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
      this._panel = null;
    }
    if (
      changed.has('fanDisabled') &&
      this.fanDisabled &&
      this._panel === 'fan'
    ) {
      this._panel = null;
    }
    if (changed.has('showHvac') && !this.showHvac && this._panel === 'hvac') {
      this._panel = null;
    }
    if (changed.has('showFan') && !this.showFan && this._panel === 'fan') {
      this._panel = null;
    }
  }

  private get _fanLocked(): boolean {
    return this.disabled || this.fanDisabled;
  }

  private get _effectiveHvac(): string {
    if (this.hvacValue && this.hvacModes.includes(this.hvacValue)) {
      return this.hvacValue;
    }
    return this.hvacModes[0] ?? '';
  }

  private get _effectiveFan(): string {
    if (this.fanValue && this.fanModes.includes(this.fanValue)) {
      return this.fanValue;
    }
    return this.fanModes[0] ?? '';
  }

  private _togglePanel(panel: 'hvac' | 'fan'): void {
    if (this.disabled) return;
    if (panel === 'fan' && this._fanLocked) return;
    this._panel = this._panel === panel ? null : panel;
  }

  private _onSelectHvac = (mode: string): void => {
    if (this.disabled) return;
    if (mode !== this.hvacValue) {
      this.hvacValue = mode;
      fireEvent(this, 'hvac-changed', { value: mode });
    }
    this._panel = null;
  };

  private _onSelectFan = (mode: string): void => {
    if (this._fanLocked) return;
    if (mode !== this.fanValue) {
      this.fanValue = mode;
      fireEvent(this, 'fan-changed', { value: mode });
    }
    this._panel = null;
  };

  private _renderOptionGrid() {
    const cols2 = this.optionLayout === 'cols';
    const gridClass = classMap({
      'option-grid': true,
      'rows-2': !cols2,
      'cols-2': cols2,
    });

    if (this._panel === 'hvac') {
      const selected = this._effectiveHvac;
      return html`
        <div class=${gridClass} role="radiogroup" aria-label="Mode">
          ${this.hvacModes.map(
            (mode) => html`
              <button
                type="button"
                class="option ${classMap({ selected: mode === selected })}"
                role="radio"
                aria-checked=${mode === selected ? 'true' : 'false'}
                aria-label=${formatHvacModeLabel(mode)}
                .disabled=${this.disabled}
                @click=${() => this._onSelectHvac(mode)}
              >
                <ha-icon .icon=${getHvacModeIcon(mode)}></ha-icon>
              </button>
            `,
          )}
        </div>
      `;
    }

    if (this._panel === 'fan') {
      const selected = this._effectiveFan;
      return html`
        <div class=${gridClass} role="radiogroup" aria-label="Fan">
          ${this.fanModes.map(
            (mode) => html`
              <button
                type="button"
                class="option ${classMap({ selected: mode === selected })}"
                role="radio"
                aria-checked=${mode === selected ? 'true' : 'false'}
                aria-label=${formatFanModeLabel(mode)}
                .disabled=${this._fanLocked}
                @click=${() => this._onSelectFan(mode)}
              >
                <ha-icon .icon=${getFanModeIcon(mode)}></ha-icon>
              </button>
            `,
          )}
        </div>
      `;
    }

    return nothing;
  }

  protected render() {
    const showHvac = this.showHvac && this.hvacModes.length > 0;
    const showFan = this.showFan && this.fanModes.length > 0;
    if (!showHvac && !showFan) return nothing;

    const hvacSelected = this._effectiveHvac;
    const fanSelected = this._effectiveFan;
    const expanded = this._panel !== null;

    return html`
      <div
        class=${classMap({
          home: this.variant === 'home',
          'on-active': this.variant === 'home' && this.onActive,
          column: this.stackVertical,
          row: !this.stackVertical,
        })}
      >
        <div
          class=${classMap({
            selectors: true,
            expanded,
          })}
        >
          ${showHvac
            ? html`
                <button
                  type="button"
                  class="trigger"
                  aria-expanded=${this._panel === 'hvac' ? 'true' : 'false'}
                  aria-haspopup="listbox"
                  aria-label=${`Mode: ${formatHvacModeLabel(hvacSelected)}`}
                  .disabled=${this.disabled}
                  @click=${() => this._togglePanel('hvac')}
                >
                  <ha-icon .icon=${getHvacModeIcon(hvacSelected)}></ha-icon>
                </button>
              `
            : nothing}
          ${showFan
            ? html`
                <button
                  type="button"
                  class="trigger"
                  aria-expanded=${this._panel === 'fan' ? 'true' : 'false'}
                  aria-haspopup="listbox"
                  aria-label=${`Fan: ${formatFanModeLabel(fanSelected)}`}
                  .disabled=${this._fanLocked}
                  @click=${() => this._togglePanel('fan')}
                >
                  <ha-icon .icon=${getFanModeIcon(fanSelected)}></ha-icon>
                </button>
              `
            : nothing}
          ${this._renderOptionGrid()}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-climate-selectors': AuClimateSelectors;
  }
}
