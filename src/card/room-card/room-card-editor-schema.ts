import { ROOM_CARD_ENTITY_DOMAINS } from '../../utils/domains';

export const roomCardEditorSchema = [
  { name: 'name', selector: { text: {} } },
  { name: 'icon', selector: { icon: {} } },
  { name: 'show_name', selector: { boolean: {} } },
  {
    name: 'entities',
    selector: {
      entity: {
        multiple: true,
        domain: [...ROOM_CARD_ENTITY_DOMAINS],
      },
    },
  },
  { name: 'compact', selector: { boolean: {} } },
];

export const roomCardEditorLabels: Record<string, string> = {
  name: 'Name (optional)',
  icon: 'Header icon (optional)',
  show_name: 'Show name',
  entities: 'Entities (lights / switches)',
  compact: 'Compact icon row only',
};
