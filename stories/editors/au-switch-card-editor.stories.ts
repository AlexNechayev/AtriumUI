import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/switch-card/au-switch-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Switch Card',
  component: 'au-switch-card-editor',
  render: () =>
    mountEditor(
      'au-switch-card-editor',
      { type: 'custom:au-switch-card', entity: 'switch.outlet' },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};
