import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../src/card/climate-card/au-climate-card';
import { demoHass } from '../fixtures/hass';
import { mountCard, mountCardLayouts } from '../fixtures/mount';

const meta = {
  title: 'Cards/Climate Card',
  component: 'au-climate-card',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () =>
    mountCardLayouts(
      'au-climate-card',
      {
        type: 'custom:au-climate-card',
        entity: 'climate.living_room',
        variant: 'home',
      },
      demoHass,
      { width: 176, height: 220 },
    ),
};

export const HomeButtons: Story = {
  render: () =>
    mountCardLayouts(
      'au-climate-card',
      {
        type: 'custom:au-climate-card',
        entity: 'climate.living_room',
        variant: 'home',
        temperature_control: 'buttons',
      },
      demoHass,
      { width: 176, height: 220 },
    ),
};

export const Classic: Story = {
  render: () =>
    mountCard(
      'au-climate-card',
      { type: 'custom:au-climate-card', entity: 'climate.living_room' },
      demoHass,
      { width: 320, height: 200 },
    ),
};

export const ClassicButtons: Story = {
  render: () =>
    mountCard(
      'au-climate-card',
      {
        type: 'custom:au-climate-card',
        entity: 'climate.living_room',
        temperature_control: 'buttons',
      },
      demoHass,
      { width: 320, height: 200 },
    ),
};
