import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/room-card/au-room-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Room Card',
  component: 'au-room-card-editor',
  render: () =>
    mountEditor(
      'au-room-card-editor',
      {
        type: 'custom:au-room-card',
        name: 'Living room',
        entities: ['light.living_room'],
      },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};
