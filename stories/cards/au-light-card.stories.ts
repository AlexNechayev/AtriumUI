import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/light-card/au-light-card';
import { demoHass, demoStates, makeEntity, makeHass } from '../fixtures/hass';
import { mountCard, mountCardLayouts } from '../fixtures/mount';

const meta = {
  title: 'Cards/Light Card',
  component: 'au-light-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () =>
    mountCardLayouts(
      'au-light-card',
      { type: 'custom:au-light-card', entity: 'light.living_room', variant: 'home' },
      demoHass,
      { width: 176, height: 220 },
    ),
};

export const BrightnessOnly: Story = {
  render: () =>
    mountCardLayouts(
      'au-light-card',
      { type: 'custom:au-light-card', entity: 'light.kitchen', variant: 'home' },
      demoHass,
      { width: 176, height: 220 },
    ),
};

export const Hue: Story = {
  render: () =>
    mountCardLayouts(
      'au-light-card',
      { type: 'custom:au-light-card', entity: 'light.living_room', variant: 'home' },
      makeHass({
        ...demoStates,
        'light.living_room': makeEntity('light.living_room', 'on', {
          friendly_name: 'Living room',
          icon: 'mdi:ceiling-light',
          brightness: 200,
          hs_color: [210, 80],
          supported_color_modes: ['brightness', 'hs'],
          color_mode: 'hs',
        }),
      }),
      { width: 176, height: 220 },
    ),
};

export const Classic: Story = {
  render: () =>
    mountCard(
      'au-light-card',
      { type: 'custom:au-light-card', entity: 'light.living_room' },
      demoHass,
      { width: 320, height: 180 },
    ),
};
