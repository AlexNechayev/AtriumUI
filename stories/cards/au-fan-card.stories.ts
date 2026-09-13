import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/fan-card/au-fan-card';
import { demoHass } from '../fixtures/hass';
import { mountCard, mountCardLayouts } from '../fixtures/mount';

const meta = {
  title: 'Cards/Fan Card',
  component: 'au-fan-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

const homeGlance = {
  type: 'custom:au-fan-card',
  entity: 'fan.bedroom',
  variant: 'home',
  show_speed: false,
  show_preset_modes: false,
  show_oscillate: false,
  show_direction: false,
};

const homeSpeed = {
  type: 'custom:au-fan-card',
  entity: 'fan.bedroom',
  variant: 'home',
  show_preset_modes: false,
  show_oscillate: false,
  show_direction: false,
};

export const Home: Story = {
  render: () => mountCardLayouts('au-fan-card', homeGlance, demoHass),
};

export const HomeSpeed: Story = {
  render: () =>
    mountCardLayouts('au-fan-card', homeSpeed, demoHass, {
      width: 176,
      height: 220,
    }),
};

export const HomeButtons: Story = {
  render: () =>
    mountCardLayouts(
      'au-fan-card',
      { ...homeSpeed, speed_control: 'button' },
      demoHass,
      { width: 176, height: 220 },
    ),
};

export const Classic: Story = {
  render: () =>
    mountCard(
      'au-fan-card',
      { type: 'custom:au-fan-card', entity: 'fan.bedroom' },
      demoHass,
      { width: 320, height: 180 },
    ),
};

export const ClassicButtons: Story = {
  render: () =>
    mountCard(
      'au-fan-card',
      {
        type: 'custom:au-fan-card',
        entity: 'fan.bedroom',
        speed_control: 'button',
      },
      demoHass,
      { width: 320, height: 180 },
    ),
};
