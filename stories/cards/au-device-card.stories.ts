import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/device-card/au-device-card';
import { demoHass } from '../fixtures/hass';
import { mountCard, mountCardLayouts } from '../fixtures/mount';

const meta = {
  title: 'Cards/Device Card',
  component: 'au-device-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () =>
    mountCardLayouts(
      'au-device-card',
      {
        type: 'custom:au-device-card',
        entity: 'water_heater.tank',
        variant: 'home',
      },
      demoHass,
      { width: 176, height: 220 },
    ),
};

export const Classic: Story = {
  render: () =>
    mountCard(
      'au-device-card',
      { type: 'custom:au-device-card', entity: 'water_heater.tank' },
      demoHass,
      { width: 320, height: 180 },
    ),
};
