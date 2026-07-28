import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuBaseEditor } from '../../core/base-editor';
import { auTokens } from '../../theme/tokens';
import type { AuActionCardConfig } from '../../types/config';
import {
  actionCardEditorLabels,
  actionCardEditorSchema,
} from './action-card-editor-schema';

/**
 * Visual editor for `au-action-card` (spec 6). Uses HA-native `<ha-form>`
 * selectors including `ui_action` for tap/hold actions.
 */
@customElement('au-action-card-editor')
export class AuActionCardEditor extends AuBaseEditor<AuActionCardConfig> {
  static override styles = [
    auTokens,
    css`
      ha-form {
        display: block;
      }
    `,
  ];

  private _computeLabel = (schema: { name: string }): string =>
    actionCardEditorLabels[schema.name] ?? schema.name;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${actionCardEditorSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-action-card-editor': AuActionCardEditor;
  }
}
