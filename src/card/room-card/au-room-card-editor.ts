import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuBaseEditor } from '../../core/base-editor';
import { auTokens } from '../../theme/tokens';
import type { AuRoomCardConfig } from '../../types/room-card';
import { normalizeRoomCardEntities } from '../../types/room-card';
import { fireEvent } from '../../utils/fire-event';
import {
  roomCardEditorLabels,
  roomCardEditorSchema,
} from './room-card-editor-schema';

/**
 * Visual editor for `au-room-card`. Entities come from HA's multi-entity picker
 * and are normalized to a stable list on change.
 */
@customElement('au-room-card-editor')
export class AuRoomCardEditor extends AuBaseEditor<AuRoomCardConfig> {
  static override styles = [
    auTokens,
    css`
      ha-form {
        display: block;
      }
    `,
  ];

  private _computeLabel = (schema: { name: string }): string =>
    roomCardEditorLabels[schema.name] ?? schema.name;

  protected override _formChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = (ev.detail as { value: AuRoomCardConfig }).value;
    const next: AuRoomCardConfig = {
      ...value,
      type: value.type || 'custom:au-room-card',
      entities: normalizeRoomCardEntities(value.entities),
    };
    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${roomCardEditorSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-room-card-editor': AuRoomCardEditor;
  }
}
