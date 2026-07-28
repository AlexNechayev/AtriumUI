import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { AuCardContent } from '../../core/card-content';
import { auHomeTokens, auHomeTileStyles } from '../../theme/home-style';
import {
  computeDomain,
  computeEntityName,
  formatNumericState,
  isUnavailable,
} from '../../utils/entity';
import type { HassEntity } from '../../types/home-assistant';
import type { AuSensorCardConfig } from '../../types/config';
import './au-sensor-card-editor';

type SeverityLevel = 'normal' | 'warn' | 'critical';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * `au-sensor-card` (spec 5.3) - a data-centric linear gauge for environmental
 * readouts (temperature, humidity, energy demand). Supports configurable
 * min/max ranges, contextual severity alerts, and scales its fill dynamically.
 * Home variant uses the shared squircle tile language.
 */
@customElement('au-sensor-card')
export class AuSensorCard extends AuCardContent<AuSensorCardConfig> {
  static override styles = [
    ...AuCardContent.contentStyles,
    auHomeTokens,
    auHomeTileStyles,
    css`
      .readout {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .head {
        display: flex;
        align-items: center;
        gap: var(--au-gap);
        margin-bottom: var(--au-gap);
        flex: 0 0 auto;
      }
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--au-display-size);
        height: var(--au-display-size);
        border-radius: 50%;
        flex: 0 0 auto;
        color: var(--au-accent);
        background: color-mix(in srgb, var(--au-accent) 14%, transparent);
        --mdc-icon-size: var(--au-display-glyph);
      }
      .labels {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1 1 auto;
        gap: 2px;
      }
      .primary {
        font-size: var(--au-font-primary);
        font-weight: var(--au-weight-bold);
        color: var(--au-primary-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .value {
        font-size: 1.5rem;
        font-weight: var(--au-weight-bold);
        line-height: 1.1;
        color: var(--au-primary-text);
      }
      .value .unit {
        font-size: var(--au-font-meta);
        font-weight: var(--au-weight-normal);
        color: var(--au-secondary-text);
        margin-left: 2px;
      }
      .badge {
        flex: 0 0 auto;
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-medium);
        padding: 2px 8px;
        border-radius: 999px;
        color: #fff;
      }
      .track {
        position: relative;
        width: 100%;
        height: 8px;
        border-radius: 999px;
        background: var(--divider-color, rgba(120, 120, 120, 0.2));
        overflow: hidden;
        flex: 0 0 auto;
      }
      .fill {
        position: absolute;
        inset: 0 auto 0 0;
        height: 100%;
        border-radius: 999px;
        background: var(--au-bar-color, var(--au-accent));
        transition:
          width var(--au-motion-medium) var(--au-motion-ease),
          background-color var(--au-motion-fast) var(--au-motion-ease);
      }
      .scale {
        display: flex;
        justify-content: space-between;
        margin-top: var(--au-gap-sm);
        font-size: var(--au-font-secondary);
        color: var(--au-secondary-text);
        flex: 0 0 auto;
      }
      .level-warn {
        --au-bar-color: var(--au-warning);
      }
      .level-critical {
        --au-bar-color: var(--au-error);
      }
      .badge.warn {
        background: var(--au-warning);
      }
      .badge.critical {
        background: var(--au-error);
      }

      /* Home squircle: icon matches other domain tiles; gauge stays compact. */
      .au-card.home-tile .icon {
        border-radius: 14px;
        color: var(--au-home-tile-accent, var(--au-home-accent-default));
        background: color-mix(
          in srgb,
          var(--au-home-tile-accent, var(--au-home-accent-default)) 18%,
          transparent
        );
      }
      .au-card.home-tile .primary {
        font-size: var(--au-font-secondary);
        font-weight: var(--au-weight-medium);
        color: var(--au-home-muted);
      }
      .au-card.home-tile .value {
        font-size: 1.35rem;
        font-weight: var(--au-weight-bold);
        color: var(--au-home-label);
      }
      .au-card.home-tile .value .unit {
        color: var(--au-home-muted);
      }
      .au-card.home-tile .head {
        margin-bottom: var(--au-gap-sm);
      }
      .au-card.home-tile .track {
        height: 6px;
        background: var(--au-home-control-fill-track);
      }
      .au-card.home-tile .fill {
        background: var(
          --au-bar-color,
          var(--au-home-tile-accent, var(--au-home-accent-default))
        );
      }
    `,
  ];

  public static getConfigElement(): HTMLElement {
    return document.createElement('au-sensor-card-editor');
  }

  public static getStubConfig(): AuSensorCardConfig {
    return { type: 'custom:au-sensor-card', entity: '', min: 0, max: 100 };
  }

  protected get isHomeVariant(): boolean {
    return this._config?.variant === 'home';
  }

  protected validateConfig(config: AuSensorCardConfig): void {
    if (!config.entity) {
      throw new Error('AtriumUI Sensor Card: "entity" is required');
    }
    if (
      config.min !== undefined &&
      config.max !== undefined &&
      config.min >= config.max
    ) {
      throw new Error('AtriumUI Sensor Card: "min" must be less than "max"');
    }
  }

  protected override watchedEntities(): string[] {
    return this._config?.entity ? [this._config.entity] : [];
  }

  private get _entity(): HassEntity | undefined {
    if (!this.hass || !this._config) return undefined;
    return this.hass.states[this._config.entity];
  }

  private _severityLevel(value: number): SeverityLevel {
    const sev = this._config?.severity;
    if (!sev) return 'normal';
    const dir = sev.direction ?? 'above';
    const beyond = (threshold: number): boolean =>
      dir === 'above' ? value >= threshold : value <= threshold;
    if (sev.critical !== undefined && beyond(sev.critical)) return 'critical';
    if (sev.warn !== undefined && beyond(sev.warn)) return 'warn';
    return 'normal';
  }

  public override getCardSize(): number {
    return 2;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    const entity = this._entity;

    if (!entity) {
      return html`<div class="au-error">
        Entity not found: ${this._config.entity}
      </div>`;
    }

    const name = this._config.name ?? computeEntityName(entity);
    const unit = this._config.unit ?? entity.attributes.unit_of_measurement ?? '';
    const icon = this._config.icon;
    const numeric = Number(entity.state);
    const hasNumber = !isUnavailable(entity) && !Number.isNaN(numeric);

    const min = this._config.min ?? 0;
    const max = this._config.max ?? 100;
    // Dynamic scaling: expand the visual range if the live value exceeds bounds.
    const scaleMin = Math.min(min, hasNumber ? numeric : min);
    const scaleMax = Math.max(max, hasNumber ? numeric : max);
    const pct = hasNumber
      ? clamp(((numeric - scaleMin) / (scaleMax - scaleMin || 1)) * 100, 0, 100)
      : 0;

    const level = hasNumber ? this._severityLevel(numeric) : 'normal';
    const displayValue = hasNumber
      ? formatNumericState(numeric, this._config.precision)
      : entity.state;
    const domain = computeDomain(entity.entity_id);
    const home = this.isHomeVariant;

    return this.renderCardRoot(
      {
        readout: true,
        [`level-${level}`]: true,
        'home-tile': home,
        [`domain-${domain}`]: home,
        unavailable: isUnavailable(entity),
      },
      html`
        <div class="head">
          <div class="icon">
            ${icon
              ? html`<ha-icon .icon=${icon}></ha-icon>`
              : html`<ha-state-icon
                  .hass=${this.hass}
                  .stateObj=${entity}
                ></ha-state-icon>`}
          </div>
          <div class="labels">
            <span class="primary">${name}</span>
            <span class="value"
              >${displayValue}${unit
                ? html`<span class="unit">${unit}</span>`
                : nothing}</span
            >
          </div>
          ${level !== 'normal'
            ? html`<span class="badge ${level}"
                >${level === 'critical' ? 'Critical' : 'Warning'}</span
              >`
            : nothing}
        </div>
        ${hasNumber
          ? html`
              <div
                class="track"
                role="progressbar"
                aria-valuenow=${numeric}
                aria-valuemin=${scaleMin}
                aria-valuemax=${scaleMax}
              >
                <div class="fill" style=${styleMap({ width: `${pct}%` })}></div>
              </div>
              ${home
                ? nothing
                : html`
                    <div class="scale">
                      <span>${formatNumericState(scaleMin)}${unit}</span>
                      <span>${formatNumericState(scaleMax)}${unit}</span>
                    </div>
                  `}
            `
          : nothing}
      `,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-sensor-card': AuSensorCard;
  }
}
