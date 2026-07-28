import { html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { AuActionCardBase } from '../../core/action-card';
import { AuCardContent } from '../../core/card-content';
import { auActionTileLayout } from '../../theme/action-tile-layout';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import { isEntityActive, isUnavailable } from '../../utils/entity';
import { createDebounced } from '../../utils/debounce';
import {
  formatHvacModeLabel,
  formatTemperature,
  getClimateCapabilities,
  getCurrentTemperature,
  getFanMode,
  getHvacAction,
  getHvacMode,
  getTargetTemperature,
  getTemperatureUnit,
  hasClimateControls,
  setFanMode,
  setHvacMode,
  setTargetTemperature,
  validateClimateEntity,
} from '../../utils/climate';
import type { HvacMode } from '../../types/climate';
import type { HassEntity } from '../../types/home-assistant';
import type { AuClimateCardConfig } from '../../types/climate';
import '../../components/au-climate-selectors';
import '../../components/au-temp-stepper';
import './au-climate-card-editor';

/**
 * `au-climate-card` (spec 5.5) - capability-driven air conditioner controls with
 * HVAC modes, target temperature stepper, and fan modes.
 * Home variant uses an Apple Home–style temperature hero tile.
 */
@customElement('au-climate-card')
export class AuClimateCard extends AuActionCardBase<AuClimateCardConfig> {
  @state() private _pendingTemperature?: number;

  private _debouncedTemperature?: ReturnType<typeof createDebounced<[number]>>;

  static override styles = [
    ...AuCardContent.contentStyles,
    auHomeTokens,
    auHomeTileStyles,
    auActionTileLayout,
    css`
      .controls {
        gap: var(--au-gap);
        min-width: 0;
        overflow: visible;
      }
      .controls.temp-buttons-row {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .controls.temp-buttons-row au-climate-selectors,
      .controls.temp-buttons-row au-temp-stepper {
        flex: 0 0 auto;
      }

      /* —— Apple Home climate tile —— */
      /* Allow mode overlays to paint over hero/temp inside the tile */
      .au-card.home-tile {
        overflow: visible;
      }
      .home-climate {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: var(--au-gap);
        width: 100%;
        height: 100%;
        min-height: 0;
        font-family: var(--au-home-font);
        overflow: visible;
      }
      .home-top {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--au-gap-sm);
        width: 100%;
      }
      /* Horizontal home layout:
         row1: icon | name
         row2: hero | modes (modes column)
         row3: footer */
      .home-climate.horizontal .home-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--au-gap);
        width: 100%;
        min-width: 0;
      }
      .home-climate.horizontal .home-header .home-name {
        flex: 1;
        min-width: 0;
      }
      .home-climate.horizontal .home-main {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--au-gap);
        width: 100%;
        min-width: 0;
        flex: 1;
      }
      .home-climate.horizontal .home-main .home-hero {
        flex: 1;
        min-width: 0;
      }
      .home-climate.horizontal .home-modes {
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-start;
        min-width: 0;
        max-width: none;
        width: auto;
      }
      /* Buttons temp control: modes sit beside −/+ on one horizontal bar */
      .home-climate.temp-buttons .home-main .home-modes {
        display: none;
      }
      .home-footer.with-modes {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        gap: var(--au-gap);
      }
      .home-footer.with-modes .home-modes {
        flex: 0 0 auto;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: flex-start;
        width: auto;
        max-width: none;
      }
      .home-footer.with-modes .home-controls {
        flex: 0 0 auto;
        width: auto;
      }
      .home-icon {
        width: var(--au-display-size);
        height: var(--au-display-size);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        background: color-mix(
          in srgb,
          var(--au-home-accent-climate) 18%,
          transparent
        );
        color: var(--au-home-accent-climate);
        --mdc-icon-size: var(--au-display-glyph);
      }
      .home-climate.active .home-icon {
        background: rgba(255, 255, 255, 0.28);
        color: var(--au-home-on-ink);
      }
      .home-modes {
        flex: 1 1 auto;
        display: flex;
        justify-content: flex-end;
        min-width: 0;
        max-width: 100%;
        position: relative;
        z-index: 3;
        overflow: visible;
      }
      .home-hero {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        margin: 0;
        padding: 0;
        border: none;
        background: transparent;
        font: inherit;
        color: inherit;
        text-align: inherit;
        appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        outline: none;
        border-radius: 12px;
        min-width: 0;
        position: relative;
        z-index: 1;
        touch-action: manipulation;
      }
      .home-hero:focus-visible {
        box-shadow: 0 0 0 3px
          color-mix(in srgb, var(--au-home-accent-climate) 45%, transparent);
      }
      .home-temp {
        font-size: clamp(2.4rem, 8vw, 3.1rem);
        font-weight: 680;
        letter-spacing: -0.04em;
        line-height: 0.95;
        color: var(--au-home-label);
        font-variant-numeric: tabular-nums;
      }
      .home-temp .unit {
        font-size: 0.42em;
        font-weight: 600;
        margin-inline-start: 2px;
        vertical-align: super;
        opacity: 0.85;
      }
      .home-meta {
        font-size: var(--au-font-meta);
        font-weight: 550;
        color: var(--au-home-muted);
        text-transform: capitalize;
        letter-spacing: -0.01em;
      }
      .home-climate.active .home-temp,
      .home-climate.active .home-meta {
        color: var(--au-home-on-ink);
      }
      .home-climate.active .home-meta {
        opacity: 0.9;
      }
      .home-footer {
        display: flex;
        flex-direction: column;
        gap: var(--au-gap);
        width: 100%;
        margin-top: auto;
        position: relative;
        z-index: 3;
        overflow: visible;
      }
      .home-name {
        font-size: var(--au-font-primary);
        font-weight: var(--au-weight-bold);
        letter-spacing: -0.01em;
        color: var(--au-home-label);
        line-height: 1.2;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .home-climate.active .home-name {
        color: var(--au-home-on-ink);
      }
      .home-controls {
        display: flex;
        flex-direction: column;
        gap: var(--au-gap);
        width: 100%;
        cursor: default;
      }
    `,
  ];

  public static getConfigElement(): HTMLElement {
    return document.createElement('au-climate-card-editor');
  }

  public static getStubConfig(): AuClimateCardConfig {
    return { type: 'custom:au-climate-card', entity: '' };
  }

  public override getCardSize(): number {
    if (!this._config || !this.entity) return 1;
    return hasClimateControls(this.entity) ? 2 : 1;
  }

  protected override validateConfig(config: AuClimateCardConfig): void {
    super.validateConfig(config);
    validateClimateEntity(config.entity);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._debouncedTemperature = createDebounced((value: number) => {
      void this._applyTemperature(value);
    }, 300);
    this.registerTeardown(() => this._debouncedTemperature?.cancel());
  }

  public override disconnectedCallback(): void {
    this._debouncedTemperature?.cancel();
    super.disconnectedCallback();
  }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('hass')) {
      this._pendingTemperature = undefined;
    }
  }

  protected override resolveSecondaryText(entity: HassEntity): string | undefined {
    if (this.secondaryAttribute) {
      return super.resolveSecondaryText(entity);
    }
    const unit = getTemperatureUnit(this.hass);
    const current = formatTemperature(getCurrentTemperature(entity), unit);
    if (current) return current;
    const action = getHvacAction(entity);
    if (action) return formatHvacModeLabel(action);
    return entity.state;
  }

  protected override resolveAttributeLines(entity: HassEntity): string[] {
    if (!this.showSecondaryAttribute) return [];
    if (this.secondaryAttribute) {
      const line = super.resolveSecondaryText(entity);
      return line !== undefined ? [line] : [];
    }
    const unit = getTemperatureUnit(this.hass);
    const current = formatTemperature(getCurrentTemperature(entity), unit);
    const action = getHvacAction(entity);
    const actionLabel = action ? formatHvacModeLabel(action) : undefined;
    if (current && actionLabel) return [current, actionLabel];
    if (current) return [current];
    if (actionLabel) return [actionLabel];
    return [entity.state];
  }

  private async _applyTemperature(value: number): Promise<void> {
    const entity = this.entity;
    if (!this.hass || !this._config || !entity) return;
    await setTargetTemperature(this.hass, entity, this._config.entity, value);
  }

  private get _temperatureControl(): 'slider' | 'buttons' {
    return this._config?.temperature_control === 'buttons' ? 'buttons' : 'slider';
  }

  /** Shared control flags — home vs classic differ only in templates/CSS. */
  private _climateControlState(entity: HassEntity) {
    const caps = getClimateCapabilities(entity);
    const unavailable = isUnavailable(entity);
    const active = isEntityActive(entity);
    const controlsLocked = unavailable || !active;
    const showHvac =
      this._config?.show_hvac_modes !== false && caps.hvacModes.length > 0;
    const showTemp =
      this._config?.show_temperature !== false && caps.supportsTargetTemp;
    const showFan =
      this._config?.show_fan_mode !== false &&
      caps.supportsFanMode &&
      caps.fanModes.length > 0;
    const target =
      this._pendingTemperature ?? getTargetTemperature(entity) ?? caps.minTemp;
    const unit = getTemperatureUnit(this.hass);
    const tempButtons = this._temperatureControl === 'buttons';
    return {
      caps,
      unavailable,
      active,
      controlsLocked,
      showHvac,
      showTemp,
      showFan,
      target,
      unit,
      tempButtons,
    };
  }

  private _onHvacChanged = (ev: CustomEvent<{ value: string }>): void => {
    if (!this.hass || !this._config) return;
    void setHvacMode(
      this.hass,
      this._config.entity,
      ev.detail.value as HvacMode,
    );
  };

  private _onFanChanged = (ev: CustomEvent<{ value: string }>): void => {
    if (!this.hass || !this._config) return;
    void setFanMode(this.hass, this._config.entity, ev.detail.value);
  };

  private _onTempChanging = (ev: CustomEvent<{ value: number }>): void => {
    this._pendingTemperature = ev.detail.value;
    this._debouncedTemperature?.(ev.detail.value);
  };

  private _onTempChanged = (ev: CustomEvent<{ value: number }>): void => {
    this._pendingTemperature = ev.detail.value;
    void this._applyTemperature(ev.detail.value);
  };

  private _renderClimateSelectors(
    entity: HassEntity,
    opts: {
      stackVertical?: boolean;
      optionLayout?: 'rows' | 'cols';
    } = {},
  ): TemplateResult | typeof nothing {
    const state = this._climateControlState(entity);
    if (!state.showHvac && !state.showFan) return nothing;

    const stackVertical = opts.stackVertical ?? false;
    const optionLayout =
      opts.optionLayout ?? (stackVertical ? 'rows' : 'cols');
    const variant = this.isHomeVariant ? 'home' : 'default';

    return html`
      <au-climate-selectors
        variant=${variant}
        .onActive=${state.active}
        .stackVertical=${stackVertical}
        .optionLayout=${optionLayout}
        .showHvac=${state.showHvac}
        .showFan=${state.showFan}
        .hvacModes=${state.caps.hvacModes}
        .hvacValue=${getHvacMode(entity)}
        .fanModes=${state.caps.fanModes}
        .fanValue=${getFanMode(entity) ?? state.caps.fanModes[0] ?? ''}
        .disabled=${state.unavailable}
        .fanDisabled=${state.controlsLocked}
        @hvac-changed=${this._onHvacChanged}
        @fan-changed=${this._onFanChanged}
      ></au-climate-selectors>
    `;
  }

  private _renderTempStepper(entity: HassEntity): TemplateResult | typeof nothing {
    const state = this._climateControlState(entity);
    if (!state.showTemp) return nothing;
    const variant = this.isHomeVariant ? 'home' : 'default';

    return html`
      <au-temp-stepper
        variant=${variant}
        .onActive=${state.active}
        .control=${this._temperatureControl}
        .min=${state.caps.minTemp}
        .max=${state.caps.maxTemp}
        .step=${state.caps.step}
        .value=${state.target}
        .unit=${state.unit}
        .disabled=${state.controlsLocked}
        @value-changing=${this._onTempChanging}
        @value-changed=${this._onTempChanged}
      ></au-temp-stepper>
    `;
  }

  private _renderControls(entity: HassEntity): TemplateResult | typeof nothing {
    const state = this._climateControlState(entity);
    if (!state.showHvac && !state.showTemp && !state.showFan) return nothing;

    return html`
      <div
        class=${classMap({
          controls: true,
          'temp-buttons-row': state.tempButtons,
        })}
        @pointerdown=${this.stopPropagation}
        @pointerup=${this.stopPropagation}
        @click=${this.stopPropagation}
      >
        ${state.showHvac || state.showFan
          ? this._renderClimateSelectors(entity, {
              stackVertical: false,
              optionLayout: state.tempButtons ? 'cols' : 'rows',
            })
          : nothing}
        ${this._renderTempStepper(entity)}
      </div>
    `;
  }

  private _homeMetaLine(entity: HassEntity): string {
    const unit = getTemperatureUnit(this.hass);
    const current = formatTemperature(getCurrentTemperature(entity), unit);
    const mode = formatHvacModeLabel(getHvacMode(entity) || entity.state);
    const action = getHvacAction(entity);
    const actionLabel = action ? formatHvacModeLabel(action) : '';
    const parts: string[] = [];
    if (current) parts.push(`Now ${current}`);
    if (actionLabel && actionLabel.toLowerCase() !== mode.toLowerCase()) {
      parts.push(actionLabel);
    } else if (mode) {
      parts.push(mode);
    }
    return parts.join(' · ') || entity.state;
  }

  private _renderHomeModes(
    entity: HassEntity,
    _active: boolean,
    opts: { stackVertical?: boolean; optionLayout?: 'rows' | 'cols' } = {},
  ): TemplateResult | typeof nothing {
    const selectors = this._renderClimateSelectors(entity, opts);
    if (selectors === nothing) return nothing;

    return html`
      <div
        class="home-modes"
        @pointerdown=${this.stopPropagation}
        @pointerup=${this.stopPropagation}
        @click=${this.stopPropagation}
      >
        ${selectors}
      </div>
    `;
  }

  private _renderHomeHero(
    entity: HassEntity,
    active: boolean,
    ariaLabel: string,
  ): TemplateResult {
    const state = this._climateControlState(entity);
    const targetLabel =
      formatTemperature(state.target, '') || String(state.target ?? '—');

    return this.renderHeaderActionButton(
      html`
        <div class="home-temp">
          ${targetLabel}<span class="unit">${state.unit}</span>
        </div>
        <div class="home-meta">${this._homeMetaLine(entity)}</div>
      `,
      {
        className: 'home-hero',
        disabled: state.unavailable,
        active,
        ariaLabel,
      },
    );
  }

  private _renderHomeFooter(
    entity: HassEntity,
    includeName: boolean,
    active = false,
    includeModes = false,
  ): TemplateResult {
    const name = this.showName ? this.resolveName(entity) : undefined;
    const modes =
      includeModes
        ? this._renderHomeModes(entity, active, {
            stackVertical: false,
            optionLayout: 'cols',
          })
        : nothing;
    const stepper = this._renderTempStepper(entity);

    return html`
      <div
        class=${classMap({
          'home-footer': true,
          'with-modes': includeModes && modes !== nothing,
        })}
      >
        ${stepper !== nothing
          ? html`
              <div
                class="home-controls"
                @pointerdown=${this.stopPropagation}
                @pointerup=${this.stopPropagation}
                @click=${this.stopPropagation}
              >
                ${stepper}
              </div>
            `
          : nothing}
        ${modes}
        ${includeName && name !== undefined
          ? html`<div class="home-name">${name}</div>`
          : nothing}
      </div>
    `;
  }

  private _renderHomeBody(entity: HassEntity, active: boolean): TemplateResult {
    const name = this.showName ? this.resolveName(entity) : undefined;
    const ariaLabel = name ?? this._config!.entity;
    const horizontal = this.contentLayout === 'horizontal';
    const tempButtons = this._temperatureControl === 'buttons';

    if (horizontal) {
      return html`
        <div
          class=${classMap({
            'home-climate': true,
            horizontal: true,
            'temp-buttons': tempButtons,
            active,
          })}
        >
          <div class="home-header">
            ${this.showIcon
              ? html`<div class="home-icon">
                  ${this.renderEntityIcon(entity, this.iconOverride)}
                </div>`
              : nothing}
            ${name !== undefined
              ? html`<div class="home-name">${name}</div>`
              : nothing}
          </div>

          <div class="home-main">
            ${this._renderHomeHero(entity, active, ariaLabel)}
            ${tempButtons
              ? nothing
              : this._renderHomeModes(entity, active, {
                  stackVertical: true,
                  optionLayout: 'rows',
                })}
          </div>

          ${this._renderHomeFooter(entity, false, active, tempButtons)}
        </div>
      `;
    }

    // Vertical home layout — leave as-is for a follow-up pass.
    return html`
      <div
        class=${classMap({
          'home-climate': true,
          'temp-buttons': tempButtons,
          active,
        })}
      >
        <div class="home-top">
          ${this.showIcon
            ? html`<div class="home-icon">
                ${this.renderEntityIcon(entity, this.iconOverride)}
              </div>`
            : nothing}
          ${tempButtons
            ? nothing
            : this._renderHomeModes(entity, active, {
                stackVertical: false,
                optionLayout: 'rows',
              })}
        </div>

        ${this._renderHomeHero(entity, active, ariaLabel)}
        ${this._renderHomeFooter(entity, true, active, tempButtons)}
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

    const active = isEntityActive(entity);
    const unavailable = isUnavailable(entity);
    const ariaLabel = this.showName ? this.resolveName(entity) : this._config.entity;
    const hasControls = hasClimateControls(entity);

    if (this.isHomeVariant) {
      return this.renderCardRoot(
        {
          tile: true,
          active,
          unavailable,
          'has-controls': hasControls,
          'home-tile': true,
          'domain-climate': true,
          [this.contentLayout]: true,
        },
        this._renderHomeBody(entity, active),
      );
    }

    return this.renderCardRoot(
      {
        tile: true,
        active,
        unavailable,
        'has-controls': hasControls,
        [this.contentLayout]: true,
      },
      html`
        ${this.renderHeaderActionButton(this.renderHeaderStack(entity), {
          disabled: unavailable,
          active,
          ariaLabel,
        })}
        ${this._renderControls(entity)}
      `,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-climate-card': AuClimateCard;
  }
}
