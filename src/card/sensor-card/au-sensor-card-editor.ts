import { html, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuBaseEditor } from '../../core/base-editor';
import { auTokens } from '../../theme/tokens';
import type { AuSensorCardConfig } from '../../types/config';

/**
 * Visual editor for `au-sensor-card` (spec 6). Uses `<ha-form>` selectors,
 * which render the HA-native `ha-entity-picker` and `ha-icon-picker` internally,
 * plus number selectors for the gauge range and an expandable severity group.
 */
@customElement('au-sensor-card-editor')
export class AuSensorCardEditor extends AuBaseEditor<AuSensorCardConfig> {
  static override styles = [auTokens];

  private readonly _schema = [
    { name: 'entity', selector: { entity: {} } },
    { name: 'name', selector: { text: {} } },
    { name: 'icon', selector: { icon: {} } },
    { name: 'unit', selector: { text: {} } },
    {
      name: 'range',
      type: 'grid',
      schema: [
        { name: 'min', selector: { number: { mode: 'box', step: 'any' } } },
        { name: 'max', selector: { number: { mode: 'box', step: 'any' } } },
      ],
    },
    { name: 'precision', selector: { number: { min: 0, max: 5, mode: 'box' } } },
    {
      name: 'severity',
      type: 'expandable',
      title: 'Severity alerts',
      schema: [
        { name: 'warn', selector: { number: { mode: 'box', step: 'any' } } },
        { name: 'critical', selector: { number: { mode: 'box', step: 'any' } } },
        {
          name: 'direction',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'above', label: 'Alert when above' },
                { value: 'below', label: 'Alert when below' },
              ],
            },
          },
        },
      ],
    },
  ];

  private _computeLabel = (schema: { name: string }): string => {
    const labels: Record<string, string> = {
      entity: 'Entity (required)',
      name: 'Name',
      icon: 'Icon',
      unit: 'Unit override',
      min: 'Min',
      max: 'Max',
      precision: 'Decimal precision',
      warn: 'Warning threshold',
      critical: 'Critical threshold',
      direction: 'Alert direction',
    };
    return labels[schema.name] ?? schema.name;
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-sensor-card-editor': AuSensorCardEditor;
  }
}
