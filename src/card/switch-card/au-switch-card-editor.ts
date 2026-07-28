import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuBaseEditor } from '../../core/base-editor';
import { auTokens } from '../../theme/tokens';
import type { AuSwitchCardConfig } from '../../types/switch';
import {
  switchCardEditorLabels,
  switchCardEditorSchema,
} from './switch-card-editor-schema';

@customElement('au-switch-card-editor')
export class AuSwitchCardEditor extends AuBaseEditor<AuSwitchCardConfig> {
  static override styles = [
    auTokens,
    css`
      ha-form {
        display: block;
      }
    `,
  ];

  private _computeLabel = (schema: { name: string }): string =>
    switchCardEditorLabels[schema.name] ?? schema.name;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${switchCardEditorSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-switch-card-editor': AuSwitchCardEditor;
  }
}
