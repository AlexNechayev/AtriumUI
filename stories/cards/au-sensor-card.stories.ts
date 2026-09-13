import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/sensor-card/au-sensor-card';
import { demoHass } from '../fixtures/hass';
import { mountCard } from '../fixtures/mount';

const config = {
  type: 'custom:au-sensor-card',
  entity: 'sensor.living_room_temperature',
  min: 0,
  max: 40,
  unit: '°C',
};

const meta = {
  title: 'Cards/Sensor Card',
  component: 'au-sensor-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () => mountCard('au-sensor-card', { ...config, variant: 'home' }, demoHass),
};

export const Classic: Story = {
  render: () =>
    mountCard('au-sensor-card', config, demoHass, { width: 280, height: 120 }),
};
