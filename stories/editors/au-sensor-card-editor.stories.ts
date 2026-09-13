import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/sensor-card/au-sensor-card-editor';
import { demoHass } from '../fixtures/hass';
import { mountEditor } from '../fixtures/mount';

const meta = {
  title: 'Editors/Sensor Card',
  component: 'au-sensor-card-editor',
  render: () =>
    mountEditor(
      'au-sensor-card-editor',
      { type: 'custom:au-sensor-card', entity: 'sensor.living_room_temperature' },
      demoHass,
    ),
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Default: Story = {};
