import {
  actionCardEditorLabels,
  actionCardEditorSchema,
} from '../action-card/action-card-editor-schema';

/** `<ha-form>` schema for `au-light-card`. */
export const lightCardEditorSchema = [
  { name: 'entity', selector: { entity: { domain: 'light' } } },
  ...actionCardEditorSchema.slice(1),
  { name: 'show_brightness', selector: { boolean: {} } },
  { name: 'show_color_temp', selector: { boolean: {} } },
  { name: 'show_rgb', selector: { boolean: {} } },
];

export const lightCardEditorLabels: Record<string, string> = {
  ...actionCardEditorLabels,
  entity: 'Light entity (required)',
  show_brightness: 'Show brightness slider (default: on)',
  show_color_temp: 'Show color temperature slider (default: on)',
  show_rgb: 'Show color slider (default: on)',
};
