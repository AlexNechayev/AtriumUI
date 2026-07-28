import {
  actionCardEditorLabels,
  actionCardEditorSchema,
} from '../action-card/action-card-editor-schema';

/** `<ha-form>` schema for `au-climate-card`. */
export const climateCardEditorSchema = [
  { name: 'entity', selector: { entity: { domain: 'climate' } } },
  ...actionCardEditorSchema.slice(1),
  { name: 'show_temperature', selector: { boolean: {} } },
  {
    name: 'temperature_control',
    selector: {
      select: {
        options: [
          { label: 'Slider', value: 'slider' },
          { label: 'Buttons (+ / −)', value: 'buttons' },
        ],
      },
    },
  },
  { name: 'show_hvac_modes', selector: { boolean: {} } },
  { name: 'show_fan_mode', selector: { boolean: {} } },
];

export const climateCardEditorLabels: Record<string, string> = {
  ...actionCardEditorLabels,
  entity: 'Climate entity (required)',
  show_temperature: 'Show temperature control (default: on)',
  temperature_control: 'Temperature control style (default: slider)',
  show_hvac_modes: 'Show HVAC mode chips (default: on)',
  show_fan_mode: 'Show fan mode chips (default: on)',
};
