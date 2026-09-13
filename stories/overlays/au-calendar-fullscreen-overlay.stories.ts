import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/calendar-card/au-calendar-fullscreen-overlay';
import { AuCalendarFullscreenOverlay } from '../../src/card/calendar-card/au-calendar-fullscreen-overlay';
import { demoCalendarEvents } from '../fixtures/hass';

const meta = {
  title: 'Overlays/Calendar Fullscreen',
  component: 'au-calendar-fullscreen-overlay',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Open: Story = {
  render: () => {
    const el = document.createElement(
      'au-calendar-fullscreen-overlay',
    ) as AuCalendarFullscreenOverlay;
    el.title = 'Calendar';
    el.language = 'en';
    el.events = demoCalendarEvents();
    el.entities = [{ entity: 'calendar.personal', label: 'Personal', color: '#007AFF' }];
    el.config = {
      type: 'custom:au-calendar-card',
      entities: [{ entity: 'calendar.personal', label: 'Personal' }],
    };
    queueMicrotask(() => el.open());
    return el;
  },
};
