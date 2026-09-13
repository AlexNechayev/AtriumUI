import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/switch-card/au-switch-card';
import { demoHass, makeEntity, makeHass } from '../fixtures/hass';
import { mountCard, mountCardLayouts } from '../fixtures/mount';

const meta = {
  title: 'Cards/Switch Card',
  component: 'au-switch-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () =>
    mountCardLayouts(
      'au-switch-card',
      { type: 'custom:au-switch-card', entity: 'switch.outlet', variant: 'home' },
      demoHass,
    ),
};

export const Off: Story = {
  render: () =>
    mountCardLayouts(
      'au-switch-card',
      { type: 'custom:au-switch-card', entity: 'switch.outlet', variant: 'home' },
      makeHass({
        'switch.outlet': makeEntity('switch.outlet', 'off', {
          friendly_name: 'Outlet',
          icon: 'mdi:power-socket-eu',
        }),
      }),
    ),
};

export const Classic: Story = {
  render: () =>
    mountCard(
      'au-switch-card',
      { type: 'custom:au-switch-card', entity: 'switch.outlet' },
      demoHass,
      { width: 280, height: 96 },
    ),
};
