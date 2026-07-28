import { SUPPORTED_DEVICE_DOMAIN_LIST } from '../../utils/domains';
import {
  actionCardEditorLabels,
  actionCardEditorSchema,
} from '../action-card/action-card-editor-schema';

/** Prefer water_heater/… entities in the picker (avoids sensors that stay unavailable). */
const deviceEntitySelector = {
  entity: {
    domain: [...SUPPORTED_DEVICE_DOMAIN_LIST],
  },
};

export const deviceCardEditorSchema = [
  { name: 'entity', selector: deviceEntitySelector },
  ...actionCardEditorSchema.filter((field) => field.name !== 'entity'),
  { name: 'show_controls', selector: { boolean: {} } },
  { name: 'show_temperature', selector: { boolean: {} } },
  { name: 'show_timer', selector: { boolean: {} } },
  {
    name: 'timer_presets',
    selector: { text: {} },
  },
  {
    name: 'timer_minutes',
    selector: {
      number: {
        min: 1,
        max: 1440,
        mode: 'box',
        unit_of_measurement: 'min',
      },
    },
  },
  { name: 'confirm_actions', selector: { boolean: {} } },
  { name: 'confirm_message', selector: { text: {} } },
  { name: 'debug', selector: { boolean: {} } },
];

export const deviceCardEditorLabels: Record<string, string> = {
  ...actionCardEditorLabels,
  show_controls: 'Show domain controls (Home: off except water heater)',
  show_temperature: 'Show water heater temperature (default: on)',
  show_timer: 'Show water heater off-timer (default: on)',
  timer_presets: 'Timer presets in minutes (e.g. 15, 30, 60)',
  timer_minutes: 'Fallback single duration if presets empty (default: 30)',
  confirm_actions: 'Confirm before actions (default: off)',
  confirm_message: 'Confirmation message override',
  debug: 'Debug logging (default: off)',
};
