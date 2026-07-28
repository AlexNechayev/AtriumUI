import {
  actionCardEditorLabels,
  actionCardEditorSchema,
} from '../action-card/action-card-editor-schema';

/** `<ha-form>` schema for `au-fan-card`. */
export const fanCardEditorSchema = [
  { name: 'entity', selector: { entity: { domain: 'fan' } } },
  ...actionCardEditorSchema.slice(1),
  { name: 'show_speed', selector: { boolean: {} } },
  {
    name: 'speed_control',
    selector: {
      select: {
        options: [
          { label: 'Slider', value: 'slider' },
          { label: 'Button', value: 'button' },
        ],
      },
    },
  },
  { name: 'show_preset_modes', selector: { boolean: {} } },
  { name: 'show_oscillate', selector: { boolean: {} } },
  { name: 'show_direction', selector: { boolean: {} } },
  { name: 'debug', selector: { boolean: {} } },
];

export const fanCardEditorLabels: Record<string, string> = {
  ...actionCardEditorLabels,
  entity: 'Fan entity (required)',
  show_speed: 'Show speed control (default: on)',
  speed_control: 'Speed control style (default: slider)',
  show_preset_modes: 'Show preset mode chips (default: on when supported)',
  show_oscillate: 'Show oscillate toggle (default: on when supported)',
  show_direction: 'Show direction toggle (default: on when supported)',
  debug: 'Debug logging (default: off)',
};
