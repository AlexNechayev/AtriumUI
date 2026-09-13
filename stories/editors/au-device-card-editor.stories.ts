import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/device-card/au-device-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Device Card',
  component: 'au-device-card-editor',
  render: () =>
    mountEditor(
      'au-device-card-editor',
      { type: 'custom:au-device-card', entity: 'water_heater.tank' },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};
