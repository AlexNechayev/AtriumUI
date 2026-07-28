import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AuBaseEditor } from '../../core/base-editor';
import { auTokens } from '../../theme/tokens';
import type {
  AuCalendarCardConfig,
  AuCalendarEntityConfig,
} from '../../types/calendar';
import { normalizeCalendarEntities } from '../../types/calendar';
import { fireEvent } from '../../utils/fire-event';
import {
  calendarCardEditorLabels,
  calendarCardEditorSchema,
} from './calendar-card-editor-schema';

/**
 * Visual editor for `au-calendar-card`. Multi-entity picker for `calendar.*`
 * with optional filters and view settings.
 *
 * `ha-form`'s entity selector expects `entities` as `string[]`. Stored config
 * keeps `{ entity, color?, label? }` objects — map to/from strings at the form
 * boundary so the picker never shows "Unknown entity selected".
 */
@customElement('au-calendar-card-editor')
export class AuCalendarCardEditor extends AuBaseEditor<AuCalendarCardConfig> {
  static override styles = [
    auTokens,
    css`
      ha-form {
        display: block;
      }
    `,
  ];

  private _computeLabel = (schema: { name: string }): string =>
    calendarCardEditorLabels[schema.name] ?? schema.name;

  /** Config shape for ha-form (entity ids as strings). */
  private _formData(): AuCalendarCardConfig & { entities: string[] } {
    const config = this._config!;
    return {
      ...config,
      entities: normalizeCalendarEntities(config.entities).map((e) => e.entity),
    };
  }

  private _mergeEntities(
    selected: AuCalendarCardConfig['entities'],
  ): AuCalendarEntityConfig[] {
    const prevById = new Map(
      normalizeCalendarEntities(this._config?.entities).map(
        (e) => [e.entity, e] as const,
      ),
    );
    return normalizeCalendarEntities(selected).map((e) => {
      const prev = prevById.get(e.entity);
      if (!prev) return e;
      return {
        ...e,
        ...(prev.color ? { color: prev.color } : {}),
        ...(prev.label ? { label: prev.label } : {}),
        ...(prev.writable !== undefined ? { writable: prev.writable } : {}),
      };
    });
  }

  protected override _formChanged = (ev: CustomEvent): void => {
    ev.stopPropagation();
    const value = (ev.detail as { value: AuCalendarCardConfig }).value;
    const next: AuCalendarCardConfig = {
      ...value,
      type: value.type || 'custom:au-calendar-card',
      entities: this._mergeEntities(value.entities),
    };
    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  };

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${calendarCardEditorSchema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._formChanged}
      ></ha-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'au-calendar-card-editor': AuCalendarCardEditor;
  }
}
