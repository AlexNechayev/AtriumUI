import {
  actionCardEditorLabels,
  actionCardEditorSchema,
} from '../action-card/action-card-editor-schema';

/** `<ha-form>` schema for `au-cover-card`. */
export const coverCardEditorSchema = [
  { name: 'entity', selector: { entity: { domain: 'cover' } } },
  ...actionCardEditorSchema.slice(1),
  { name: 'show_controls', selector: { boolean: {} } },
  { name: 'show_position', selector: { boolean: {} } },
  { name: 'debug', selector: { boolean: {} } },
];

export const coverCardEditorLabels: Record<string, string> = {
  ...actionCardEditorLabels,
  entity: 'Cover entity (required)',
  show_controls: 'Show open / close / stop (default: on)',
  show_position: 'Show position slider when supported (default: on)',
  debug: 'Debug logging (default: off)',
};
