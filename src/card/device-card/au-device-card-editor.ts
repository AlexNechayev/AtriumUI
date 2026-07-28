import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuBaseEditor } from '../../core/base-editor';
import { auTokens } from '../../theme/tokens';
import type { AuDeviceCardConfig } from '../../types/device';
import {
  deviceCardEditorLabels,
  deviceCardEditorSchema,
} from './device-card-editor-schema';

@customElement('au-device-card-editor')
export class AuDeviceCardEditor extends AuBaseEditor<AuDeviceCardConfig> {
  static override styles = [
    auTokens,
    css`
      ha-form {
        display: block;
      }
    `,
  ];

  private _computeLabel = (schema: { name: string }): string =>
    deviceCardEditorLabels[schema.name] ?? schema.name;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${deviceCardEditorSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-device-card-editor': AuDeviceCardEditor;
  }
}
