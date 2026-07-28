import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuBaseEditor } from '../../core/base-editor';
import { auTokens } from '../../theme/tokens';
import type { AuClimateCardConfig } from '../../types/climate';
import {
  climateCardEditorLabels,
  climateCardEditorSchema,
} from './climate-card-editor-schema';

@customElement('au-climate-card-editor')
export class AuClimateCardEditor extends AuBaseEditor<AuClimateCardConfig> {
  static override styles = [
    auTokens,
    css`
      ha-form {
        display: block;
      }
    `,
  ];

  private _computeLabel = (schema: { name: string }): string =>
    climateCardEditorLabels[schema.name] ?? schema.name;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${climateCardEditorSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-climate-card-editor': AuClimateCardEditor;
  }
}
