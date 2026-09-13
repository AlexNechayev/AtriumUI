import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/calendar-card/au-calendar-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Calendar Card',
  component: 'au-calendar-card-editor',
  render: () =>
    mountEditor(
      'au-calendar-card-editor',
      { type: 'custom:au-calendar-card', entities: ['calendar.personal'] },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};
