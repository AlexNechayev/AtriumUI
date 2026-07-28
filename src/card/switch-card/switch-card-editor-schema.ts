import {
  actionCardEditorLabels,
  actionCardEditorSchema,
} from '../action-card/action-card-editor-schema';

/** `<ha-form>` schema for `au-switch-card`. */
export const switchCardEditorSchema = [
  { name: 'entity', selector: { entity: { domain: 'switch' } } },
  ...actionCardEditorSchema.slice(1),
  { name: 'debug', selector: { boolean: {} } },
];

export const switchCardEditorLabels: Record<string, string> = {
  ...actionCardEditorLabels,
  entity: 'Switch entity (required)',
  debug: 'Debug logging (default: off)',
};
