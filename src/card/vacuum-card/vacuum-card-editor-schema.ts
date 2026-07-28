import {
  actionCardEditorLabels,
  actionCardEditorSchema,
} from '../action-card/action-card-editor-schema';

/** `<ha-form>` schema for `au-vacuum-card`. */
export const vacuumCardEditorSchema = [
  { name: 'entity', selector: { entity: { domain: 'vacuum' } } },
  ...actionCardEditorSchema.slice(1),
  { name: 'show_controls', selector: { boolean: {} } },
  { name: 'show_settings', selector: { boolean: {} } },
  {
    name: 'hide_sections',
    selector: {
      select: {
        multiple: true,
        mode: 'list',
        options: [
          { value: 'status', label: 'Status' },
          { value: 'clean', label: 'Clean' },
          { value: 'map', label: 'Map' },
          { value: 'rooms', label: 'Rooms' },
          { value: 'dock', label: 'Dock' },
          { value: 'maintenance', label: 'Maintenance' },
          { value: 'ai', label: 'AI' },
          { value: 'dnd', label: 'DND' },
          { value: 'voice', label: 'Voice' },
          { value: 'advanced', label: 'Advanced' },
        ],
      },
    },
  },
  { name: 'debug', selector: { boolean: {} } },
];

export const vacuumCardEditorLabels: Record<string, string> = {
  ...actionCardEditorLabels,
  entity: 'Vacuum entity (required)',
  show_controls: 'Show start / pause / stop / return (default: on)',
  show_settings: 'Show settings gear + open on hold (default: on)',
  hide_sections: 'Hide settings sections',
  debug: 'Debug logging (default: off)',
};
