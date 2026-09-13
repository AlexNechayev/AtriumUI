import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/room-card/au-room-card';
import { demoHass } from '../fixtures/hass';
import { mountCard } from '../fixtures/mount';

const meta = {
  title: 'Cards/Room Card',
  component: 'au-room-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () =>
    mountCard(
      'au-room-card',
      {
        type: 'custom:au-room-card',
        name: 'Living room',
        icon: 'mdi:sofa',
        variant: 'home',
        entities: ['light.living_room', 'switch.outlet', 'light.kitchen'],
        temperature_entity: 'sensor.living_room_temperature',
      },
      demoHass,
      { width: 220, height: 176 },
    ),
};
