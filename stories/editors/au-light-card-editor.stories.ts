import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/light-card/au-light-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Light Card',
  component: 'au-light-card-editor',
  render: () =>
    mountEditor(
      'au-light-card-editor',
      { type: 'custom:au-light-card', entity: 'light.living_room' },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};
