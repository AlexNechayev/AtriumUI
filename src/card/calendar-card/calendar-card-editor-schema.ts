export const calendarCardEditorSchema = [
  { name: 'title', selector: { text: {} } },
  {
    name: 'view',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: 'agenda', label: 'Agenda' },
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ],
      },
    },
  },
  {
    name: 'entities',
    selector: {
      entity: {
        multiple: true,
        domain: ['calendar'],
      },
    },
  },
  {
    name: 'horizon',
    type: 'grid',
    schema: [
      { name: 'days', selector: { number: { min: 1, max: 90, mode: 'box' } } },
      {
        name: 'max_events',
        selector: { number: { min: 1, max: 100, mode: 'box' } },
      },
      {
        name: 'refresh_minutes',
        selector: { number: { min: 1, max: 1440, mode: 'box' } },
      },
    ],
  },
  {
    name: 'timezone',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: 'local', label: 'Local timezone' },
          { value: 'event', label: 'Event timezone' },
        ],
      },
    },
  },
  {
    name: 'time_format',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: '24h', label: '24-hour' },
          { value: '12h', label: '12-hour' },
        ],
      },
    },
  },
  { name: 'expand_on_tap', selector: { boolean: {} } },
  { name: 'show_location', selector: { boolean: {} } },
  { name: 'show_description', selector: { boolean: {} } },
  { name: 'show_calendar_label', selector: { boolean: {} } },
  { name: 'show_view_picker', selector: { boolean: {} } },
  { name: 'hide_all_day', selector: { boolean: {} } },
  { name: 'allowlist', selector: { text: {} } },
  { name: 'blocklist', selector: { text: {} } },
];

export const calendarCardEditorLabels: Record<string, string> = {
  title: 'Title',
  view: 'Default view',
  entities: 'Calendars',
  days: 'Days ahead',
  max_events: 'Max events',
  refresh_minutes: 'Refresh (minutes)',
  timezone: 'Timezone',
  time_format: 'Time format',
  expand_on_tap: 'Expand on tap',
  show_location: 'Show location',
  show_description: 'Show description',
  show_calendar_label: 'Show calendar label',
  show_view_picker: 'Show view picker',
  hide_all_day: 'Hide all-day events',
  allowlist: 'Allowlist (RegExp)',
  blocklist: 'Blocklist (RegExp)',
};
