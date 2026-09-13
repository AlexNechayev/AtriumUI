import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/calendar-card/au-calendar-card';
import { demoHass } from '../fixtures/hass';
import { mountCard } from '../fixtures/mount';

const meta = {
  title: 'Cards/Calendar Card',
  component: 'au-calendar-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Agenda: Story = {
  render: () =>
    mountCard(
      'au-calendar-card',
      {
        type: 'custom:au-calendar-card',
        title: 'Calendar',
        entities: [{ entity: 'calendar.personal', label: 'Personal' }],
        view: 'agenda',
        expand_on_tap: true,
      },
      demoHass,
      { width: 360, height: 280 },
    ),
};

export const Month: Story = {
  render: () =>
    mountCard(
      'au-calendar-card',
      {
        type: 'custom:au-calendar-card',
        entities: [{ entity: 'calendar.personal', label: 'Personal' }],
        view: 'month',
      },
      demoHass,
      { width: 360, height: 320 },
    ),
};
