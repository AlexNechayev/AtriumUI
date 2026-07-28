/** Shared `<ha-form>` schema for action-card family editors. */
export const ACTION_CARD_UI_ACTIONS = [
  'more-info',
  'toggle',
  'call-service',
  'navigate',
  'url',
  'none',
] as const;

export const actionCardEditorSchema = [
  { name: 'entity', selector: { entity: {} } },
  { name: 'name', selector: { text: {} } },
  { name: 'show_name', selector: { boolean: {} } },
  { name: 'icon', selector: { icon: {} } },
  { name: 'show_icon', selector: { boolean: {} } },
  {
    name: 'content_layout',
    selector: {
      select: {
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ],
      },
    },
  },
  { name: 'secondary_attribute', selector: { text: {} } },
  { name: 'show_secondary_attribute', selector: { boolean: {} } },
  {
    name: 'tap_action',
    selector: { ui_action: { actions: [...ACTION_CARD_UI_ACTIONS] } },
  },
  {
    name: 'hold_action',
    selector: { ui_action: { actions: [...ACTION_CARD_UI_ACTIONS] } },
  },
  {
    name: 'double_tap_action',
    selector: { ui_action: { actions: [...ACTION_CARD_UI_ACTIONS] } },
  },
];

export const actionCardEditorLabels: Record<string, string> = {
  entity: 'Entity (required)',
  name: 'Name override (optional; entity name when empty)',
  show_name: 'Show name (default: on)',
  icon: 'Icon override (optional; entity icon when empty)',
  show_icon: 'Show icon (default: on)',
  content_layout: 'Content layout (default: horizontal)',
  secondary_attribute: 'Secondary attribute (optional; entity state when empty)',
  show_secondary_attribute: 'Show secondary line (default: on)',
  tap_action: 'Tap action (default: toggle)',
  hold_action: 'Hold action (default: more-info)',
  double_tap_action: 'Double-tap action (default: more-info)',
};
